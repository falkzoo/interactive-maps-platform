# Interactive Maps Platform

A scalable, multi-city interactive mapping platform built with Leaflet.js, designed for easy deployment on Netlify with support for multiple map sites.

## 🚀 Features

### 🏙️ Two Map Types Supported:

**1. City Maps** (`city-maps/`) - Urban Planning & Transportation

- Interactive district boundaries with statistics
- Public transportation route overlays (S-Bahn, U-Bahn, etc.)
- District information panels with population, area, and custom data
- Google Sheets integration for dynamic statistics

**2. Media Maps** (`media-maps/`) - Advertising & Media Locations

- Advertising location markers (billboards, digital screens, etc.)
- Multiple map styles (Carto Base, Carto Voyager, OSM HD)
- Media type categorization and filtering
- District-based navigation for media planning

### 🛠️ Technical Features:

- **Multi-city Support**: Easy to add new cities with separate configurations
- **Responsive Design**: Works on desktop and mobile devices
- **Netlify Ready**: Optimized for Netlify deployment with proper routing
- **Modular Architecture**: Shared components reduce duplication
- **Configurable**: Each map type and city has its own configuration
- **Performance Optimized**: Lazy loading, caching, and optimized assets
- **Security First**: No API keys committed to repository

## 📁 Project Structure

```
interactive-maps-platform/
├── netlify.toml                 # Netlify deployment configuration
├── shared/                      # Shared assets across all maps
│   ├── css/
│   │   └── map-styles.css      # Consolidated CSS styles
│   ├── js/
│   │   ├── map-core.js         # Core map functionality
│   │   └── map-utils.js        # Utility functions
│   └── data/                   # Shared data files
│       └── geojson/            # GeoJSON data files
├── city-maps/                  # City district & transportation maps
│   ├── berlin.html             # Berlin districts & transport
│   ├── hamburg.html            # Hamburg districts & transport (future)
│   ├── munich.html             # Munich districts & transport (future)
│   └── config/
│       ├── berlin-city-config.js    # Berlin city configuration
│       ├── hamburg-city-config.js   # Hamburg city configuration
│       └── munich-city-config.js    # Munich city configuration
├── media-maps/                 # Media/advertising location maps
│   ├── berlin-carto-base.html  # Berlin media locations (Carto base)
│   ├── berlin-carto-voyager.html # Berlin media locations (Carto voyager)
│   ├── berlin-osmhd.html       # Berlin media locations (OSM HD)
│   └── config/
│       └── berlin-media-config.js   # Berlin media configuration
├── scripts/                    # Build and utility scripts
│   └── generate_geojson.py     # Data processing script
└── docs/                       # Documentation
    └── README.md               # This file
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+ (for development scripts)
- Modern web browser
- Netlify account (for deployment)

### Local Development

1. **Clone or copy this refactored structure to your new repository**

2. **Test the Berlin site locally**:

   ```bash
   # Serve the files using a local server
   npx serve . -p 3000

   # Or use Python's built-in server
   python -m http.server 3000

   # Visit http://localhost:3000/sites/berlin/
   ```

3. **Customize the Berlin configuration** (optional):
   ```bash
   # Edit the Berlin configuration
   nano sites/berlin/config/berlin-config.js
   ```

## 🌍 Adding New Cities

### For City Maps (Districts & Transportation)

1. **Create HTML file**:

   ```bash
   cp city-maps/berlin.html city-maps/hamburg.html
   ```

2. **Create configuration**:

   ```bash
   cp city-maps/config/berlin-city-config.js city-maps/config/hamburg-city-config.js
   ```

3. **Update configuration** in `hamburg-city-config.js`:

   ```javascript
   const HamburgCityConfig = {
     map: {
       center: [53.5511, 9.9937], // Hamburg coordinates
       zoom: 11,
     },
     dataSources: {
       districts: "https://your-hamburg-districts.geojson",
       publicTransportation: "https://your-hamburg-transport.geojson",
     },
     ui: {
       title: "Hamburg City Map",
     },
     // ... other settings
   };
   window.HamburgCityConfig = HamburgCityConfig;
   ```

4. **Update HTML file** to use Hamburg config:
   ```html
   <script src="config/hamburg-city-config.js"></script>
   <!-- Update variable names from BerlinCityConfig to HamburgCityConfig -->
   ```

### For Media Maps (Advertising Locations)

1. **Create HTML files** (one per map style):

   ```bash
   cp media-maps/berlin-carto-base.html media-maps/hamburg-carto-base.html
   ```

2. **Create configuration**:

   ```bash
   cp media-maps/config/berlin-media-config.js media-maps/config/hamburg-media-config.js
   ```

3. **Update configuration** with Hamburg-specific data sources and coordinates

4. **Add Netlify redirects** in `netlify.toml`:

   ```toml
   [[redirects]]
     from = "/city-maps/hamburg"
     to = "/city-maps/hamburg.html"
     status = 200

   [[redirects]]
     from = "/media-maps/hamburg-carto-base"
     to = "/media-maps/hamburg-carto-base.html"
     status = 200
   ```

## ⚙️ Configuration

Each city has its own configuration file with the following structure:

```javascript
const CityConfig = {
  // Map settings
  map: {
    center: [latitude, longitude],
    zoom: 11,
    minZoom: 10,
    maxZoom: 14,
  },

  // Data sources
  dataSources: {
    districts: "https://example.com/districts.geojson",
    publicTransportation: "https://example.com/transport.geojson",
    districtStats: {
      apiKey: "your-api-key",
      sheetId: "your-sheet-id",
      range: "Sheet1!A:F",
    },
  },

  // Feature toggles
  features: {
    showTransportation: true,
    showDistrictStats: true,
    showDistrictSelection: true,
  },

  // UI customization
  ui: {
    title: "City Interactive Map",
    transportToggleText: "Public Transport",
    loadingText: "Loading map data...",
  },
};
```

## 🚀 Deployment

### Netlify Deployment

1. **Connect your repository** to Netlify
2. **Set build settings**:
   - Build command: `echo "No build step required"`
   - Publish directory: `.` (root)
3. **Deploy**: Netlify will automatically deploy with the included configuration

### URL Structure

After deployment, your maps will be available at:

**City Maps** (Districts & Transportation):

- `https://your-domain.netlify.app/` → Redirects to Berlin city map (default)
- `https://your-domain.netlify.app/city-maps/berlin` → Berlin districts & transportation
- `https://your-domain.netlify.app/city-maps/hamburg` → Hamburg districts & transportation
- `https://your-domain.netlify.app/city-maps/munich` → Munich districts & transportation

**Media Maps** (Advertising Locations):

- `https://your-domain.netlify.app/media-maps/berlin-carto-base` → Berlin media (Carto base style)
- `https://your-domain.netlify.app/media-maps/berlin-carto-voyager` → Berlin media (Carto voyager style)
- `https://your-domain.netlify.app/media-maps/berlin-osmhd` → Berlin media (OSM HD style)

### Custom Domain

To use a custom domain:

1. Add your domain in Netlify dashboard
2. Update DNS settings to point to Netlify
3. SSL certificate will be automatically provisioned

## 🎨 Customization

### Styling

All styles are in `shared/css/map-styles.css`. The CSS uses CSS custom properties (variables) for easy theming:

```css
:root {
  --primary: #007cba;
  --accent: #0969da;
  --panel-bg: #ffffff;
  /* ... more variables */
}
```

### Adding Custom Features

1. **Extend the InteractiveMap class** in `shared/js/map-core.js`
2. **Add utility functions** in `shared/js/map-utils.js`
3. **Create city-specific assets** in `sites/your-city/assets/`

### Transportation Colors

Customize transportation route colors in your city config:

```javascript
transportation: {
  routeColors: {
    'S1': '#DE4DA4',
    'S2': '#006F35',
    'U1': '#7DAD4C',
    'U2': '#DA421E'
  }
}
```

## 🔒 Security & API Keys

**⚠️ IMPORTANT: Never commit API keys to your repository!**

### Handling API Keys Securely

1. **For Development**: Replace placeholder values in config files with your actual keys locally
2. **For Production**: Use Netlify environment variables:
   ```bash
   # In Netlify Dashboard: Site Settings > Environment Variables
   GOOGLE_SHEETS_API_KEY = your-actual-api-key
   ```
3. **In Code**: Reference environment variables when possible:
   ```javascript
   apiKey: process.env.GOOGLE_SHEETS_API_KEY ||
     "YOUR_GOOGLE_SHEETS_API_KEY_HERE";
   ```

### Default Configuration

The platform is configured to work without API keys by:

- Showing placeholder text when statistics aren't available
- Gracefully degrading functionality
- Providing clear console warnings about missing configuration

## 📊 Data Sources

### District Boundaries

Provide GeoJSON with district polygons:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "District Name",
        "cartodb_id": "unique-id"
      },
      "geometry": {
        /* polygon geometry */
      }
    }
  ]
}
```

### Transportation Routes

GeoJSON with route lines:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "route_name": "S1"
      },
      "geometry": {
        /* line geometry */
      }
    }
  ]
}
```

### District Statistics (Optional)

Google Sheets with columns:

- `cartodb_id`: Matches district ID
- `name`: District name
- `population`: Population count
- `area`: Area in km²
- `adcount`: Number of advertising locations
- `notes`: Additional notes

## 🔧 Development

### Shared Components

- **InteractiveMap**: Main map class in `map-core.js`
- **MapUtils**: Utility functions in `map-utils.js`
- **Styling**: Consolidated CSS in `map-styles.css`

### Adding New Features

1. Add feature to shared components if reusable
2. Add feature flag to city configuration
3. Test with existing cities
4. Document in this README

### Performance Optimization

- **Lazy loading**: Data loaded on demand
- **Caching**: Netlify CDN caching configured
- **Minification**: Enabled in Netlify settings
- **Responsive images**: Use appropriate sizes

## 🐛 Troubleshooting

### Common Issues

1. **Map not loading**:
   - Check browser console for errors
   - Verify data source URLs are accessible
   - Check API keys are valid

2. **District statistics not showing**:
   - Verify Google Sheets API key
   - Check sheet permissions (public or API access)
   - Ensure column names match configuration

3. **Transportation routes not displaying**:
   - Verify GeoJSON format
   - Check route names match configuration
   - Ensure routes are in `routesToDisplay` array

### Debug Mode

Add `?debug=true` to URL for additional console logging.

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Test with existing cities
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Check the troubleshooting section above
- Review browser console for errors
- Check Netlify deployment logs
- Verify data source URLs and API keys

## 🎯 Roadmap

- [ ] Add more city templates
- [ ] Implement data validation
- [ ] Add automated testing
- [ ] Create admin interface for non-technical users
- [ ] Add more map layer types
- [ ] Implement offline support
- [ ] Add analytics integration
