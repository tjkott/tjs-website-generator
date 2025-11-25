/**
 * Test script for location-finder module
 */

const { findNearbyLocations } = require('./src/location-finder');

async function testLocationFinder() {
  console.log('=== Testing Location Finder Module ===\n');

  try {
    // Test 1: Find locations near Galway
    console.log('Test 1: Finding locations within 50km of Galway, Ireland...\n');
    const galwayResults = await findNearbyLocations('Galway, Ireland', 50);

    console.log('\nResults:');
    galwayResults.slice(0, 10).forEach((location, index) => {
      console.log(`${index + 1}. ${location.name} - ${location.distance}km away`);
      console.log(`   Coordinates: ${location.coordinates.lat}, ${location.coordinates.lon}`);
    });

    console.log(`\nTotal locations found: ${galwayResults.length}`);

    // Test 2: Smaller radius
    console.log('\n\n--- Test 2: Finding locations within 20km of Dublin ---\n');
    const dublinResults = await findNearbyLocations('Dublin, Ireland', 20);

    console.log('\nResults:');
    dublinResults.slice(0, 5).forEach((location, index) => {
      console.log(`${index + 1}. ${location.name} - ${location.distance}km away`);
    });

    console.log(`\nTotal locations found: ${dublinResults.length}`);

    console.log('\n✅ All tests completed successfully!');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the tests
testLocationFinder();
