Here's the schema for the projects.json file structure:

  projects.json Schema

```json
  {
    "projects": [
      {
        "id": "string",                    // Unique project identifier(kebab-case)
        "name": "string",                  // Display name of the project
        "description": "string",           // Detailed description of the project
        "technologies": ["string"],        // Array of technologies used
        "impact": "high|medium|low",       // Project impact level
        "status": "production|development|prototype|archived", // Current status
        "category": "api|web-app|mobile-app|ml|utility",      // Project category
        "tags": ["string"],               // Array of searchable tags
        "links": {                        // Optional links object
          "github": "string",             // GitHub repository URL
          "live": "string",               // Live demo URL
          "docs": "string"                // Documentation URL
        },
        "created": "YYYY-MM-DD",          // Creation date (ISO format)
        "highlights": ["string"]          // Array of key features/achievements     
      }
    ],
    "metadata": {                         // Portfolio metadata
      "total_projects": "number",         // Total count of projects
      "last_updated": "YYYY-MM-DD",       // Last update date
      "categories": ["string"],           // Available categories
      "technologies": ["string"],         // All technologies used
      "status_counts": {                  // Status distribution
        "production": "number",
        "development": "number",
        "prototype": "number",
        "archived": "number"
      }
    }
  }
  ```

  Field Details

  Required Fields

- id - Unique identifier (used for direct lookups)
- name - Project display name
- description - Detailed project description
- technologies - Technologies/frameworks used
- impact - Business/learning impact level
- status - Current project status
- category - Project type/category
- created - Project creation date

  Optional Fields

- tags - Additional searchable keywords
- links - External URLs (GitHub, live demo, docs)
- highlights - Key features or achievements

  Search-Optimized Fields

  The query engine searches across:

- name (highest weight)
- technologies (high weight)
- tags (high weight)
- description (medium weight)
- category (low weight)
