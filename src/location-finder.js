/**
 * Location Finder Module
 *
 * Finds all locations within a specified radius of a given location using
 * OpenStreetMap APIs (free, no API key required):
 * - Nominatim API for geocoding
 * - Overpass API for finding nearby places
 *
 * Usage:
 *   const { findNearbyLocations } = require('./location-finder');
 *   const results = await findNearbyLocations('Galway', 50);
 */

const https = require('https');

// Rate limiting: Nominatim requires max 1 request per second
const RATE_LIMIT_MS = 1000;
let lastRequestTime = 0;

/**
 * Sleep helper for rate limiting
 * @param {number} ms - Milliseconds to sleep
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Make an HTTPS GET request with proper user agent
 * @param {string} url - The URL to request
 * @returns {Promise<object>} Parsed JSON response
 */
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'LocationFinderModule/1.0 (Educational Project)'
      }
    };

    https.get(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data));
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse JSON response: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(new Error(`HTTPS request failed: ${error.message}`));
    });
  });
}

/**
 * Respect rate limiting (1 request per second for Nominatim)
 */
async function respectRateLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < RATE_LIMIT_MS) {
    await sleep(RATE_LIMIT_MS - timeSinceLastRequest);
  }

  lastRequestTime = Date.now();
}

/**
 * Geocode a location name to coordinates
 * @param {string} locationName - Name of the location (e.g., "Galway", "Dublin")
 * @returns {Promise<{lat: number, lon: number, displayName: string}>}
 */
async function geocodeLocation(locationName) {
  if (!locationName || typeof locationName !== 'string') {
    throw new Error('Location name must be a non-empty string');
  }

  await respectRateLimit();

  const encodedLocation = encodeURIComponent(locationName);
  const url = `https://nominatim.openstreetmap.org/search?q=${encodedLocation}&format=json&limit=1`;

  try {
    const results = await httpsGet(url);

    if (!results || results.length === 0) {
      // ERROR HANDLING: If geocoding fails, this would be escalated to stuck agent
      // In production: invoke stuck agent with context about failed location lookup
      throw new Error(`Location not found: "${locationName}". Please verify the location name.`);
    }

    const location = results[0];
    return {
      lat: parseFloat(location.lat),
      lon: parseFloat(location.lon),
      displayName: location.display_name
    };
  } catch (error) {
    // ERROR HANDLING: Network or API errors would trigger stuck agent escalation
    // In production: invoke stuck agent with API error details
    throw new Error(`Geocoding failed for "${locationName}": ${error.message}`);
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

/**
 * Convert degrees to radians
 * @param {number} degrees
 * @returns {number} Radians
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Search for nearby places using Overpass API
 * @param {number} lat - Latitude of center point
 * @param {number} lon - Longitude of center point
 * @param {number} radiusKm - Search radius in kilometers
 * @returns {Promise<Array>} Array of nearby places
 */
async function searchNearbyPlaces(lat, lon, radiusKm) {
  await respectRateLimit();

  // Convert radius to meters for Overpass API
  const radiusMeters = radiusKm * 1000;

  // Overpass QL query to find cities, towns, and villages within radius
  // This searches for nodes and ways tagged as place=city/town/village
  const query = `
    [out:json];
    (
      node["place"~"city|town|village|hamlet"](around:${radiusMeters},${lat},${lon});
      way["place"~"city|town|village|hamlet"](around:${radiusMeters},${lat},${lon});
    );
    out center;
  `;

  const encodedQuery = encodeURIComponent(query);
  const url = `https://overpass-api.de/api/interpreter?data=${encodedQuery}`;

  try {
    const result = await httpsGet(url);

    if (!result || !result.elements) {
      return [];
    }

    // Process and deduplicate results
    const places = new Map();

    for (const element of result.elements) {
      const name = element.tags?.name;
      if (!name) continue;

      // Get coordinates (different for nodes vs ways)
      let elementLat, elementLon;
      if (element.type === 'node') {
        elementLat = element.lat;
        elementLon = element.lon;
      } else if (element.type === 'way' && element.center) {
        elementLat = element.center.lat;
        elementLon = element.center.lon;
      } else {
        continue;
      }

      // Use name as key to avoid duplicates (same place tagged as both node and way)
      if (!places.has(name.toLowerCase())) {
        places.set(name.toLowerCase(), {
          lat: elementLat,
          lon: elementLon,
          display_name: name,
          type: element.tags.place
        });
      }
    }

    return Array.from(places.values());

  } catch (error) {
    // ERROR HANDLING: API search failures would trigger stuck agent
    // In production: invoke stuck agent with search error context
    console.error(`Warning: Overpass API search failed: ${error.message}`);
    return [];
  }
}

/**
 * Find all locations within a specified radius of a given location
 * @param {string} locationName - Name of the center location (e.g., "Galway", "Dublin")
 * @param {number} radiusKm - Search radius in kilometers (default: 50)
 * @returns {Promise<Array<{name: string, distance: number, coordinates: {lat: number, lon: number}}>>}
 */
async function findNearbyLocations(locationName, radiusKm = 50) {
  // Validate inputs
  if (!locationName || typeof locationName !== 'string') {
    throw new Error('locationName must be a non-empty string');
  }

  if (typeof radiusKm !== 'number' || radiusKm <= 0 || radiusKm > 200) {
    throw new Error('radiusKm must be a positive number between 1 and 200');
  }

  try {
    // Step 1: Geocode the center location
    console.log(`Geocoding location: ${locationName}...`);
    const centerLocation = await geocodeLocation(locationName);
    console.log(`Found: ${centerLocation.displayName}`);
    console.log(`Coordinates: ${centerLocation.lat}, ${centerLocation.lon}`);

    // Step 2: Search for nearby places
    console.log(`Searching for locations within ${radiusKm}km...`);
    const nearbyPlaces = await searchNearbyPlaces(
      centerLocation.lat,
      centerLocation.lon,
      radiusKm
    );

    // Step 3: Filter by actual distance and format results
    const results = [];
    const seenNames = new Set(); // Avoid duplicates

    for (const place of nearbyPlaces) {
      const placeLat = parseFloat(place.lat);
      const placeLon = parseFloat(place.lon);

      const distance = calculateDistance(
        centerLocation.lat,
        centerLocation.lon,
        placeLat,
        placeLon
      );

      // Only include places within the specified radius
      if (distance <= radiusKm) {
        // Extract a clean name (prefer city/town/village name)
        const name = place.display_name.split(',')[0].trim();

        // Avoid duplicate names
        if (!seenNames.has(name.toLowerCase())) {
          seenNames.add(name.toLowerCase());

          results.push({
            name: name,
            distance: distance,
            coordinates: {
              lat: placeLat,
              lon: placeLon
            }
          });
        }
      }
    }

    // Sort by distance (closest first)
    results.sort((a, b) => a.distance - b.distance);

    console.log(`Found ${results.length} locations within ${radiusKm}km`);
    return results;

  } catch (error) {
    // ERROR HANDLING: Top-level errors would trigger stuck agent escalation
    // In production: invoke stuck agent with full error context and user input
    throw new Error(`Failed to find nearby locations: ${error.message}`);
  }
}

// Export the main function
module.exports = {
  findNearbyLocations
};

/**
 * Example usage (for testing):
 *
 * const { findNearbyLocations } = require('./location-finder');
 *
 * (async () => {
 *   try {
 *     const results = await findNearbyLocations('Galway', 50);
 *     console.log(results);
 *   } catch (error) {
 *     console.error('Error:', error.message);
 *   }
 * })();
 */
