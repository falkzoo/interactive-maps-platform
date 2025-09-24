/**
 * Berlin City Map Configuration
 *
 * Standardized configuration for Berlin city map showing districts and transportation.
 * Uses the new CityMapFactory pattern for easy replication to other cities.
 */

const BerlinCityConfig = {
  // Map settings
  center: [52.51, 13.39], // Berlin coordinates
  zoom: 11,
  minZoom: 10,
  maxZoom: 14,
  containerId: "map",

  // Data sources
  dataSources: {
    // District boundaries - local server source
    districts: "../shared/data/geojson/berlin_districts.geojson",
    // Transportation routes - local server source  
    transportation: "../shared/data/geojson/berlin_routes.geojson",
    // District statistics - Google Sheets (external source)
    districtStats: null, // Will be set by helper function if API key is configured
  },

  // Transportation routes to display
  transportation: {
    routesToDisplay: [
      "U1", "U2", "U3", "U4", "U5", "U6", "U7", "U8", "U9",
      "S41", "S5", "S9",
    ],
    routeColors: {
      // S-Bahn colors (official BVG colors)
      S1: "#DE4DA4",
      S2: "#006F35",
      S25: "#006F35",
      S3: "#003F7F",
      S41: "#A23B1E",
      S5: "#FF6600",
      S9: "#8B1538",
      // U-Bahn colors
      U1: "#7DAD4C",
      U2: "#DA421E",
      U3: "#16683D",
      U4: "#F0D722",
      U5: "#7E5330",
      U6: "#007734",
      U7: "#009BD5",
      U8: "#224F86",
      U9: "#F3791D",
    },
  },

  // UI text and labels (German)
  ui: {
    title: "Berlin City Map - Districts & Transportation",
    transportToggleText: "Öffentliche Verkehrsmittel",
    zoomInstructionText: "Strg + Mausrad zum Zoomen",
    districtSelectPrompt: "Bezirk auswählen",
    districtSelectHint: "Wähle einen Bezirk auf der Karte, um Details anzuzeigen.",
    loadingText: "Lade Kartendaten...",
    errorText: "Fehler beim Laden der Daten",
    dataSource: "Datenquelle: Bezirksamt / interne Erhebung",
  },

  // Feature flags
  features: {
    showTransportation: true,
    showDistrictStats: true,
    enableScrollZoom: true,
    showDistrictInfo: true,
  },

  // Performance settings
  performance: {
    debounceTime: 250,
    throttleTime: 100,
  },

  // Legacy Google Sheets configuration (for backward compatibility)
  _legacyGoogleSheets: {
    apiKey: "YOUR_GOOGLE_SHEETS_API_KEY_HERE",
    sheetId: "16j8VuT1ziwtkP-M5uuhFg7Z0AWqkxlLDTCwmdTwIEVA",
    range: "Berlin!A:F",
  }
};

// Simple helper to get Google Sheets URL
BerlinCityConfig.setupGoogleSheets = async function () {
  await EnvLoader.load();
  
  const sheetId = "16j8VuT1ziwtkP-M5uuhFg7Z0AWqkxlLDTCwmdTwIEVA";
  const range = "Berlin!A:F";
  
  const url = EnvLoader.buildSheetsUrl(sheetId, range);
  if (url) {
    this.dataSources.districtStats = url;
    console.log("Google Sheets configured for Berlin district stats");
  } else {
    console.info("Google Sheets API key not configured - district stats disabled");
  }
  
  return url;
};

// Export configuration
window.BerlinCityConfig = BerlinCityConfig;
