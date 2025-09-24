/**
 * City Map Factory
 * 
 * Makes creating new city maps as simple as swapping data sources.
 * Provides a standardized way to create city maps with minimal configuration.
 */

const CityMapFactory = {
  /**
   * Create a complete city map with all standard features
   * 
   * @param {Object} config - City map configuration
   * @param {Object} options - Optional initialization options
   * @returns {Promise<InteractiveMap>} Initialized map instance
   */
  async createCityMap(config, options = {}) {
    const {
      showLoadingCallback = null,
      hideLoadingCallback = null,
      setupResponsive = true,
      setupExternalEvents = true
    } = options;

    try {
      // Create the map instance
      const cityMap = new InteractiveMap(config);
      
      // Load all configured data sources
      await cityMap.initializeWithData(showLoadingCallback, hideLoadingCallback);
      
      // Setup standard responsive behavior if requested
      if (setupResponsive) {
        MapUtils.initResponsive(cityMap.getMap());
      }
      
      // Setup external event handlers if requested
      if (setupExternalEvents) {
        MapUtils.setupExternalEvents(cityMap.getMap());
      }
      
      return cityMap;
    } catch (error) {
      console.error('Failed to create city map:', error);
      if (hideLoadingCallback) hideLoadingCallback();
      throw error;
    }
  },

  /**
   * Create a basic city map without data loading
   * Useful for custom initialization workflows
   * 
   * @param {Object} config - City map configuration
   * @returns {InteractiveMap} Map instance (no data loaded)
   */
  createBasicCityMap(config) {
    return new InteractiveMap(config);
  },

  /**
   * Get default configuration template for city maps
   * Provides a starting point for new city configurations
   * 
   * @param {Object} overrides - Configuration overrides
   * @returns {Object} Default city map configuration
   */
  getDefaultConfig(overrides = {}) {
    return {
      // Map settings
      center: [52.51, 13.39], // Default to Berlin, override for other cities
      zoom: 11,
      minZoom: 10,
      maxZoom: 14,
      containerId: 'map',
      
      // Data sources - override these for different cities
      dataSources: {
        districts: '../shared/data/geojson/districts.geojson',
        transportation: '../shared/data/geojson/routes.geojson',
        districtStats: null // Set to Google Sheets URL or null to disable
      },
      
      // Transportation configuration
      transportation: {
        routesToDisplay: [],
        routeColors: {}
      },
      
      // UI text - customize for different languages/cities
      ui: {
        title: 'City Map',
        transportToggleText: 'Public Transportation',
        zoomInstructionText: 'Ctrl + Mouse Wheel to Zoom',
        districtSelectPrompt: 'Select District',
        districtSelectHint: 'Choose a district on the map to view details.',
        loadingText: 'Loading map data...',
        errorText: 'Error loading data',
        dataSource: 'Data source: Local government'
      },
      
      // Feature flags - enable/disable features as needed
      features: {
        showTransportation: true,
        showDistrictStats: true,
        enableScrollZoom: true,
        showDistrictInfo: true
      },
      
      // Performance settings
      performance: {
        debounceTime: 250,
        throttleTime: 100
      },
      
      ...overrides
    };
  },

  /**
   * Validate city map configuration
   * Helps catch common configuration errors
   * 
   * @param {Object} config - Configuration to validate
   * @returns {Array} Array of validation errors (empty if valid)
   */
  validateConfig(config) {
    const errors = [];
    
    if (!config) {
      errors.push('Configuration is required');
      return errors;
    }
    
    // Check required map settings
    if (!config.center || !Array.isArray(config.center) || config.center.length !== 2) {
      errors.push('Invalid or missing map center coordinates');
    }
    
    if (typeof config.zoom !== 'number' || config.zoom < 1 || config.zoom > 20) {
      errors.push('Invalid zoom level (must be between 1-20)');
    }
    
    // Check data sources if features are enabled
    if (config.features?.showTransportation && !config.dataSources?.transportation) {
      errors.push('Transportation feature enabled but no transportation data source provided');
    }
    
    if (config.features?.showDistrictStats && !config.dataSources?.districtStats) {
      console.warn('District stats feature enabled but no stats data source provided');
    }
    
    // Check transportation configuration
    if (config.features?.showTransportation) {
      if (!config.transportation?.routesToDisplay || !Array.isArray(config.transportation.routesToDisplay)) {
        errors.push('Invalid transportation routes configuration');
      }
      
      if (!config.transportation?.routeColors || typeof config.transportation.routeColors !== 'object') {
        errors.push('Invalid transportation route colors configuration');
      }
    }
    
    return errors;
  },

  /**
   * Simple helper to add Google Sheets to any map config
   * Works with city maps, media maps, or any other map type
   * 
   * @param {Object} config - Map configuration
   * @param {string} sheetId - Google Sheets ID
   * @param {string} range - Sheet range (e.g., "Sheet1!A:F")
   * @returns {Promise<Object>} Updated configuration
   */
  async addGoogleSheets(config, sheetId, range) {
    await EnvLoader.load();
    const url = EnvLoader.buildSheetsUrl(sheetId, range);
    
    if (url) {
      if (!config.dataSources) config.dataSources = {};
      config.dataSources.districtStats = url;
      console.log('Google Sheets configured for map');
    }
    
    return config;
  }
};

// Export for use in other modules
window.CityMapFactory = CityMapFactory;
