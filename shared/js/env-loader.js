/**
 * Simple Environment Variable Loader
 * 
 * Loads .env file for Google Sheets API key and other configuration.
 * Works with any map type - city maps, media maps, etc.
 */

const EnvLoader = {
  variables: {},
  loaded: false,

  /**
   * Load environment variables from .env file
   */
  async load() {
    if (this.loaded) return this.variables;

    try {
      const response = await fetch('/.env');
      if (!response.ok) {
        console.info('No .env file found - using defaults');
        this.loaded = true;
        return this.variables;
      }

      const content = await response.text();
      this.variables = this.parse(content);
      this.loaded = true;
      return this.variables;
    } catch (error) {
      console.warn('Could not load .env file:', error.message);
      this.loaded = true;
      return this.variables;
    }
  },

  /**
   * Parse .env content
   */
  parse(content) {
    const vars = {};
    content.split('\n').forEach(line => {
      line = line.trim();
      if (!line || line.startsWith('#')) return;
      
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length) {
        let value = valueParts.join('=').trim();
        // Remove quotes
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        vars[key.trim()] = value;
      }
    });
    return vars;
  },

  /**
   * Get environment variable
   */
  get(key, defaultValue = null) {
    return this.variables[key] || defaultValue;
  },

  /**
   * Build Google Sheets URL
   */
  buildSheetsUrl(sheetId, range) {
    const apiKey = this.get('GOOGLE_SHEETS_API_KEY');
    
    if (!apiKey || apiKey === 'your_google_sheets_api_key_here') {
      return null;
    }

    return `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
  }
};

// Export
window.EnvLoader = EnvLoader;
