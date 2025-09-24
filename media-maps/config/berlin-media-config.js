/**
 * Berlin Media Locations Map Configuration
 *
 * Configuration for Berlin media/advertising locations maps.
 * This is separate from the city district/transportation maps.
 */

const BerlinMediaConfig = {
  // Map settings
  map: {
    center: [52.51, 13.39], // Berlin coordinates
    zoom: 11,
    minZoom: 10,
    maxZoom: 19, // Higher zoom for media locations
    containerId: "map",
  },

  // Data sources
  dataSources: {
    // Media locations data (advertising spots, billboards, etc.)
    mediaLocations: {
      // Google Sheets configuration (primary data source)
      googleSheets: {
        sheetId: "1ltHBwFfhnMvTEh1qzpZ6WFvMKBG9Q1v0358kyKSrLcg",
        range: "Tabellenblatt1!A:K", // Includes all columns from Name to Bild2
      },
      // Local JSON fallback
      fallback: "../shared/data/geojson/standort_daten.json",
    },
    // District boundaries - local server source
    districts: "../shared/data/geojson/berlin_districts.geojson",
  },

  // District coordinates for quick navigation
  districtCoordinates: {
    "Friedrichshain-Kreuzberg": {
      center: [52.5065, 13.453],
      zoom: 13,
    },
    "Charlottenburg-Wilmersdorf": {
      center: [52.5058, 13.3183],
      zoom: 13,
    },
    "Marzahn-Hellersdorf": {
      center: [52.5441, 13.5794],
      zoom: 13,
    },
    Neukölln: {
      center: [52.4814, 13.4399],
      zoom: 13,
    },
    Pankow: {
      center: [52.5755, 13.4015],
      zoom: 13,
    },
    "Tempelhof-Schöneberg": {
      center: [52.4675, 13.3669],
      zoom: 13,
    },
  },

  // Advertising type categories and colors (from original implementation)
  advertisingTypes: {
    Brückenwerbung: { color: "#1f77b4" }, // blue
    "City Light Poster": { color: "#ff7f0e" }, // orange
    "City Light Säule": { color: "#2ca02c" }, // green
    Fassadenwerbung: { color: "#d62728" }, // red
    Großfläche: { color: "#9467bd" }, // purple
    "Kreide Stencil": { color: "#8c564b" }, // brown
    Leuchtkasten: { color: "#e377c2" }, // pink
    Litfaßsäule: { color: "#7f7f7f" }, // gray
    Mastenschild: { color: "#bcbd22" }, // yellow-green
    Plakatwerbung: { color: "#17becf" }, // cyan
    Stromkasten: { color: "#e41a1c" }, // strong red
    Uhrenwerbung: { color: "#4daf4a" }, // strong green
    "Div. Supermarktwerbung": { color: "#984ea3" }, // violet
  },

  // District statistics (number of advertising displays per district)
  districtStatistics: {
    "Friedrichshain-Kreuzberg": 27,
    "Charlottenburg-Wilmersdorf": 39,
    "Marzahn-Hellersdorf": 10,
    Neukölln: 17,
    Pankow: 6,
    "Steglitz-Zehlendorf": 0,
    "Tempelhof-Schöneberg": 22,
  },

  // UI text and labels (German)
  ui: {
    title: "Berlin Media Locations",
    loadingText: "Lade Medienstandorte...",
    errorText: "Fehler beim Laden der Medienstandorte",
    noDataText: "Keine Medienstandorte gefunden",
    districtSelectPrompt: "Bezirk auswählen",
    zoomInstructionText: "Strg + Mausrad zum Zoomen",
  },

  // Marker styling for media locations
  markers: {
    color: "black",
    radius: 6,
    weight: 2,
    opacity: 1,
    interactive: true,
    fillOpacity: 0.8,
  },

  // Feature flags
  features: {
    showDistrictSelection: true,
    enableScrollZoom: true,
    showLoadingIndicator: true,
    showPopups: true,
    enableClustering: false, // Set to true for large datasets
  },

  // Map style configurations
  mapStyles: {
    osmhd: {
      name: "OSM HD (Original)",
      url: "https://osm.rrze.fau.de/osmhd/{z}/{x}/{y}.png",
      options: {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      },
    },
    "carto-base": {
      name: "Carto Base",
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      options: {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      },
    },
    "carto-voyager": {
      name: "Carto Voyager",
      url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      options: {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      },
    },
    osm: {
      name: "OpenStreetMap",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      options: {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      },
    },
  },

  // Performance settings
  performance: {
    debounceTime: 250,
    throttleTime: 100,
  },
};

// Helper functions
BerlinMediaConfig.getAdvertisingTypeColor = function (advertisingType) {
  return this.advertisingTypes[advertisingType]?.color || "#666666";
};

BerlinMediaConfig.getDistrictStatistic = function (districtName) {
  return this.districtStatistics[districtName] || 0;
};

// Optional: Add Google Sheets support for media map statistics
BerlinMediaConfig.setupGoogleSheets = async function () {
  await EnvLoader.load();

  // Example: Add Google Sheets for media location statistics
  const sheetId = "your_media_stats_sheet_id_here";
  const range = "MediaStats!A:F";

  const url = EnvLoader.buildSheetsUrl(sheetId, range);
  if (url) {
    // Could add media statistics data source
    console.log("Google Sheets configured for media map statistics");
  }

  return url;
};

// Export configuration
window.BerlinMediaConfig = BerlinMediaConfig;
