# TJS Service Website Generator 🚀

A powerful orchestration system that generates complete, SEO-optimized local service websites with automated image scraping, lead capture forms, and location-based pages. Built on Claude Code's agent architecture with mandatory human oversight and visual testing.

## 🎯 What Is This?

This is a **service website generation system** that automatically creates fully-functional local service websites for any niche (plumbers, electricians, HVAC, lawyers, etc.). The system uses Claude Code as the orchestrator with specialized subagents for each task:

- **🧠 Claude (Orchestrator)** - Manages the 200k context, creates todos, coordinates all agents
- **🔧 Service Generator** - Creates service lists for any niche
- **🖼️ Image Scraper** - Fetches high-quality images from Unsplash via Jina AI (s.jina and r.jina)
- **🗄️ Database Agent** - Sets up Supabase for forms and lead capture
- **✍️ Coder** - Generates location + service combination pages with SEO optimization
- **👁️ Tester** - Verifies everything with Playwright (screenshots, navigation, forms)
- **🆘 Stuck** - Human escalation when ANY issue occurs

## ⚡ Key Features

### Website Generation
- **Service List Generation**: Automatically generates comprehensive service lists for any niche
- **Location-Based Pages**: Creates service + location combination pages (e.g., "Plumber in Galway City")
- **SEO-Optimized Content**: Clickbait titles, meta descriptions, and structured content
- **Responsive Design**: Mobile-first templates that work on all devices

### Image & Assets
- **Automated Image Scraping**: Uses Jina AI (s.jina.ai and r.jina.ai) to fetch Unsplash images
- **Context-Aware Images**: Images match service type and location context
- **Optimized Assets**: Properly sized and formatted images

### Lead Capture & Forms
- **Supabase Integration**: Automated database setup for form submissions
- **Contact Forms**: Pre-built forms on every page for lead generation
- **Data Validation**: Client and server-side form validation

### Quality Assurance
- **No Fallbacks**: When ANY problem occurs, you get asked - no assumptions
- **Visual Testing**: Playwright screenshots verify every page
- **Link Verification**: Every header/footer link gets a real page - NO 404s
- **Human Control**: Stuck agent ensures you're always in the loop

## 🚀 Quick Start

### Prerequisites

1. **Claude Code CLI** installed ([get it here](https://docs.claude.com/en/docs/claude-code))
2. **Node.js** (for Playwright MCP)
3. **Jina AI API Key** ([get it here](https://jina.ai))
4. **Supabase Account** (optional, for forms)

### Installation

```bash
# Clone this repository
git clone https://github.com/IncomeStreamSurfer/claude-code-agents-wizard-v2.git
cd claude-code-agents-wizard-v2

# Start Claude Code in this directory
claude
```

That's it! The agents are automatically loaded from the `.claude/` directory.

## 📖 How to Use

### Generating a Service Website

When you want to generate a service website, provide the niche, location, and API keys:

```
You: "Generate a plumber website for Galway. Jina API key: abc123"
```

Claude will automatically:
1. Create a detailed todo list for the entire website
2. Invoke **service-generator** to create comprehensive service lists
3. Invoke **image-scraper** to fetch relevant images from Unsplash via Jina
4. Invoke **database** agent to set up Supabase (if needed)
5. Invoke **coder** to generate each location + service page with SEO optimization
6. Invoke **tester** to verify every page (screenshots, navigation, forms)
7. If ANY problem occurs, **stuck** agent asks you what to do
8. Continue until complete website is generated

### The Service Website Generation Workflow

```
USER: "Generate [service] website for [location]"
    ↓
CLAUDE: Creates detailed website todos with TodoWrite
    ↓
CLAUDE: Invokes service-generator subagent
    ↓
SERVICE-GENERATOR: Creates service list (e.g., drain cleaning, pipe repair, etc.)
    ↓
CLAUDE: Invokes image-scraper subagent
    ↓
IMAGE-SCRAPER: Uses Jina AI (s.jina/r.jina) to fetch Unsplash images
    ↓
    ├─→ Problem? → Invokes STUCK → You decide → Continue
    ↓
CLAUDE: Invokes database subagent
    ↓
DATABASE: Sets up Supabase tables for forms
    ↓
CLAUDE: Invokes coder for each page
    ↓
CODER: Generates service + location pages with SEO content
    ↓
    ├─→ Problem? → Invokes STUCK → You decide → Continue
    ↓
CLAUDE: Invokes tester subagent
    ↓
TESTER: Playwright verification (screenshots, links, forms)
    ↓
    ├─→ Test fails? → Invokes STUCK → You decide → Continue
    ↓
TESTER: Reports success
    ↓
CLAUDE: Marks todo complete, moves to next page
    ↓
Repeat until all pages generated ✅
```

## 🛠️ Available Subagents

### Service Generator
**Specialized Service List Creation**

- Generates comprehensive service lists for any niche
- Creates SEO-friendly service names and descriptions
- Provides service categories and subcategories
- Returns structured data for page generation

**When it's used**: First step in website generation process

### Image Scraper
**Jina AI Integration for Unsplash**

- Uses s.jina.ai to search Unsplash for relevant images
- Uses r.jina.ai to scrape image URLs and metadata
- Filters images by service type and location context
- Returns optimized image URLs for page generation

**When it's used**: After service list generation, before page creation

### Database Agent
**Supabase Setup & Configuration**

- Creates Supabase tables for form submissions
- Sets up authentication (if needed)
- Configures API keys and environment variables
- Returns connection details for forms

**When it's used**: Before generating pages with forms

### Coder Subagent
**Page Generation & Implementation**

- Generates location + service combination pages
- Creates SEO-optimized titles and meta descriptions
- Implements contact forms with Supabase integration
- Writes responsive HTML/CSS/JavaScript
- **Never uses fallbacks** - invokes stuck agent immediately

**When it's used**: For generating each website page

### Tester Subagent
**Playwright Visual Verification**

- Uses **Playwright MCP** to test rendered pages
- Takes screenshots of every page layout
- Tests navigation links (header/footer)
- Verifies form submissions work
- Checks responsive design on multiple viewports
- **Never marks failing tests as passing**

**When it's used**: After every page generation

### Stuck Subagent
**Human Escalation Point**

- Gets invoked when ANY subagent hits a problem
- **ONLY subagent** that can ask you questions
- Presents clear options for you to choose
- Blocks progress until you respond
- Returns your decision to the calling agent

**When it's used**: Whenever ANY problem occurs

## 🚨 The "No Fallbacks" Rule

**This is the key differentiator:**

Traditional AI: Hits error → tries workaround → might fail silently
**This system**: Hits error → asks you → you decide → proceeds correctly

Every agent is **hardwired** to invoke the stuck agent rather than use fallbacks. You stay in control.

## 💡 Example Session

```
You: "Generate a plumber website for Galway. Jina API key: jina_abc123xyz"

Claude creates todos:
  [ ] Generate plumbing service list
  [ ] Scrape plumber images from Unsplash via Jina
  [ ] Set up Supabase for contact forms
  [ ] Generate homepage with hero section
  [ ] Generate service pages (drain cleaning, pipe repair, etc.)
  [ ] Generate location pages (Galway City, Salthill, Oranmore, etc.)
  [ ] Generate service + location combo pages
  [ ] Create header navigation with all links
  [ ] Create footer with service links
  [ ] Test all pages and navigation

Claude invokes service-generator("plumber services")

Service-Generator: Creates list:
  - Emergency Plumbing
  - Drain Cleaning
  - Pipe Repair
  - Water Heater Installation
  - Bathroom Fitting
  - etc.

Claude invokes image-scraper("plumber images", "jina_abc123xyz")

Image-Scraper: Uses s.jina.ai to search Unsplash
Image-Scraper: Uses r.jina.ai to scrape image URLs
Image-Scraper: Returns 20+ relevant plumber images

Claude invokes database("setup contact form tables")

Database: Creates Supabase table 'contact_submissions'
Database: Returns connection string

Claude invokes coder("Generate homepage with hero section")

Coder: Creates index.html with:
  - SEO title: "Best Plumber in Galway - 24/7 Emergency Service"
  - Hero image from scraped Unsplash images
  - Contact form connected to Supabase
  - Service list links
  - Location links in footer

Claude invokes tester("Verify homepage loads and form works")

Tester: Launches Playwright
Tester: Takes screenshot of homepage
Tester: Clicks "Contact Us" button
Tester: Fills out form
Tester: ERROR - Form submission returns 403

Tester: Invokes stuck subagent

Stuck: Asks YOU:
  "Form submission failed with 403 Forbidden. How to proceed?"
  Options:
  - Check Supabase API key configuration
  - Disable form validation temporarily
  - Review CORS settings

You choose: "Check Supabase API key configuration"

Stuck: Returns your decision to tester
Tester: Verifies API key is correct
Tester: Form now works
Tester: Reports success to Claude

Claude: Marks homepage todo complete ✓

Claude invokes coder("Generate 'Drain Cleaning in Galway City' page")

... and so on until all pages generated
```

## 📁 Repository Structure

```
.
├── .claude/
│   ├── CLAUDE.md              # Orchestration instructions for main Claude
│   └── agents/
│       ├── service-generator.md  # Service list generation agent
│       ├── image-scraper.md      # Jina AI Unsplash scraper agent
│       ├── database.md           # Supabase setup agent
│       ├── coder.md              # Page generation agent
│       ├── tester.md             # Playwright testing agent
│       └── stuck.md              # Human escalation agent
├── .mcp.json                  # Playwright MCP configuration
├── .gitignore
└── README.md
```

## 🎓 Learn More

### Resources

- **[SEO Grove](https://seogrove.ai)** - AI-powered SEO automation platform
- **[ISS AI Automation School](https://www.skool.com/iss-ai-automation-school-6342/about)** - Join our community to learn AI automation
- **[Income Stream Surfers YouTube](https://www.youtube.com/incomestreamsurfers)** - Tutorials, breakdowns, and AI automation content

### Support

Have questions or want to share what you built?
- Join the [ISS AI Automation School community](https://www.skool.com/iss-ai-automation-school-6342/about)
- Subscribe to [Income Stream Surfers on YouTube](https://www.youtube.com/incomestreamsurfers)
- Check out [SEO Grove](https://seogrove.ai) for automated SEO solutions

## 🤝 Contributing

This is an open system! Feel free to:
- Add new specialized agents
- Improve existing agent prompts
- Share your agent configurations
- Submit PRs with enhancements

## 📝 How It Works Under the Hood

This system leverages Claude Code's [subagent system](https://docs.claude.com/en/docs/claude-code/sub-agents):

1. **CLAUDE.md** instructs main Claude to be the orchestrator
2. **Subagents** are defined in `.claude/agents/*.md` files
3. **Each subagent** gets its own fresh context window
4. **Main Claude** maintains the 200k context with todos and project state
5. **Playwright MCP** is configured in `.mcp.json` for visual testing
6. **Jina AI** integration uses s.jina.ai (search) and r.jina.ai (reader) endpoints

The magic happens because:
- **Claude (200k context)** = Maintains big picture, manages todos, coordinates all agents
- **Service-Generator (fresh context)** = Creates service lists for specific niches
- **Image-Scraper (fresh context)** = Fetches images via Jina AI's Unsplash integration
- **Database (fresh context)** = Sets up Supabase for one website at a time
- **Coder (fresh context)** = Generates one page at a time with SEO optimization
- **Tester (fresh context)** = Verifies one page at a time with Playwright
- **Stuck (fresh context)** = Handles one problem at a time with human input

## 🎯 Best Practices

1. **Provide clear requirements** - Specify niche, location, and any API keys upfront
2. **Review screenshots** - The tester provides visual proof of every page
3. **Make decisions when asked** - The stuck agent needs your guidance
4. **Verify navigation** - Ensure all header/footer links have actual pages (no 404s)
5. **Test forms** - Check Supabase integration works for lead capture
6. **Check SEO** - Review generated titles and meta descriptions

## 🔥 Pro Tips

- Use `/agents` command to see all available subagents
- Claude maintains the todo list in its 200k context - check anytime
- Screenshots from tester are saved and can be reviewed
- Each subagent has specific tools - check their `.md` files
- Subagents get fresh contexts - no context pollution!
- s.jina.ai is for searching Unsplash, r.jina.ai is for scraping content
- Always verify ALL header/footer links have corresponding pages created

## 📜 License

MIT - Use it, modify it, share it!

## 🙏 Credits

Built by [Income Stream Surfer](https://www.youtube.com/incomestreamsurfers)

Powered by Claude Code's agent system, Playwright MCP, and Jina AI.

---

**Ready to generate a service website?** Just run `claude` in this directory and tell it what niche and location you want! 🚀
