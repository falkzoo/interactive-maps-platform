# Interactive Maps Platform

A multi-city interactive mapping platform built with Leaflet.js for urban planning, transportation, and media location visualization.

## Features

**City Maps** - District boundaries, transportation routes, and statistics
**Media Maps** - Advertising locations with multiple map styles
**Multi-city Support** - Easy to add new cities with separate configurations
**Netlify Ready** - Optimized for deployment with proper routing

## Project Structure

```
├── city-maps/          # City district & transportation maps
├── media-maps/         # Media/advertising location maps  
├── shared/             # Shared assets (CSS, JS, data)
├── netlify.toml        # Deployment configuration
└── index.html          # Main entry point
```

## Quick Start

1. **Test locally**:
   ```bash
   npx serve . -p 3000
   # Visit http://localhost:3000
   ```

2. **Deploy to Netlify**:
   - Connect your repository to Netlify
   - Deploy automatically with included configuration

## Adding New Cities

1. **Copy existing city files**:
   ```bash
   cp city-maps/berlin.html city-maps/hamburg.html
   cp city-maps/config/berlin-city-config.js city-maps/config/hamburg-city-config.js
   ```

2. **Update configuration** with new city coordinates and data sources

3. **Add Netlify redirects** in `netlify.toml` for clean URLs

## Configuration

Each city has its own configuration file with map settings, data sources, and UI customization options. See `city-maps/config/berlin-city-config.js` for an example.

## Deployment

The platform is optimized for Netlify deployment. After connecting your repository:

- **Build command**: `echo "No build step required"`
- **Publish directory**: `.` (root)

Maps will be available at:
- `https://your-domain.netlify.app/` → Main entry point
- `https://your-domain.netlify.app/city-maps/berlin` → Berlin city map
- `https://your-domain.netlify.app/media-maps/berlin` → Berlin media map

## Data Sources

The platform uses GeoJSON files for:
- **District boundaries** - Polygon data with district information
- **Transportation routes** - Line data for public transport
- **Media locations** - Point data for advertising locations

Optional Google Sheets integration for dynamic statistics.

## Security

**Never commit API keys to your repository!** Use Netlify environment variables for production deployments.

## Support

For issues:
- Check browser console for errors
- Verify data source URLs are accessible
- Review Netlify deployment logs
