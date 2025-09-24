# Quick Setup Guide

This guide will help you get your Interactive Maps Platform up and running quickly.

## 🚀 Quick Start (5 minutes)

### 1. Deploy to Netlify

1. **Create a new repository** on GitHub/GitLab with this refactored code
2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Select your repository
   - Use these settings:
     - Build command: `echo "No build step required"`
     - Publish directory: `.` (root)
3. **Deploy**: Your site will be live at `https://your-site.netlify.app`

### 2. Test Berlin Map

Visit `https://your-site.netlify.app/berlin/` to see the Berlin map in action.

### 3. Add Your First City

```bash
# Clone your repository locally
git clone your-repo-url
cd your-repo-name

# Create a new city (example: Hamburg)
cd scripts
node create-city-site.js hamburg

# Commit and push
git add .
git commit -m "Add Hamburg map site"
git push
```

Your Hamburg map will be available at `https://your-site.netlify.app/hamburg/`

## 🛠️ Customization Checklist

### For Each New City:

- [ ] **Get district boundaries GeoJSON**
  - Find or create GeoJSON file with district polygons
  - Upload to GitHub or use external service
  - Update `dataSources.districts` URL

- [ ] **Get transportation data** (optional)
  - Find GeoJSON with public transport routes
  - Update `dataSources.publicTransportation` URL
  - List route names in `transportation.routesToDisplay`

- [ ] **Set up statistics** (optional)
  - Create Google Sheet with district data
  - Get API key from Google Cloud Console
  - Update `dataSources.districtStats` configuration

- [ ] **Customize appearance**
  - Update city name and coordinates
  - Customize UI text for your language
  - Set transportation route colors
  - Add city-specific assets (favicon, images)

- [ ] **Test and deploy**
  - Test locally using `npx serve .`
  - Commit and push to trigger Netlify deployment
  - Visit your city's URL to verify

## 🌍 Data Sources

### Where to Find District Boundaries:

- **Germany**: [OpenData portals](https://www.govdata.de/)
- **Berlin**: [Berlin Open Data](https://daten.berlin.de/)
- **Hamburg**: [Hamburg Transparency Portal](https://transparenz.hamburg.de/)
- **Munich**: [Munich Open Data](https://www.muenchen.de/rathaus/Stadtverwaltung/Direktorium/Statistik/Geodaten.html)
- **General**: [OpenStreetMap](https://overpass-turbo.eu/) with Overpass API

### Transportation Data:

- **GTFS Data**: Many cities provide GTFS feeds
- **OpenStreetMap**: Extract public transport routes
- **City APIs**: Many cities have public transport APIs

## 🎨 Quick Customizations

### Change Colors:

Edit `shared/css/map-styles.css`:
```css
:root {
  --primary: #your-color;
  --accent: #your-accent-color;
}
```

### Add Logo:

1. Add logo to `sites/your-city/assets/logo.png`
2. Update the footer in your city's config:
   ```javascript
   ui: {
     logoUrl: 'assets/logo.png'
   }
   ```

### Change Language:

Update all UI text in your city's configuration:
```javascript
ui: {
  title: 'Your City Interactive Map',
  transportToggleText: 'Public Transport',
  loadingText: 'Loading map data...',
  // ... more text options
}
```

## 🔒 Security First: API Keys

**⚠️ NEVER commit API keys to your repository!**

The refactored code uses placeholder values like `YOUR_GOOGLE_SHEETS_API_KEY_HERE`. Replace these securely:

### For Local Development:
```javascript
// In your city config file (keep this local, don't commit)
dataSources: {
  districtStats: {
    apiKey: 'your-actual-api-key-here', // Replace locally only
    sheetId: 'your-actual-sheet-id',
    range: 'Sheet1!A:F'
  }
}
```

## 🔧 Environment Variables

For sensitive data like API keys, use Netlify environment variables:

1. **In Netlify Dashboard**:
   - Go to Site settings > Environment variables
   - Add: `GOOGLE_SHEETS_API_KEY = your-api-key`

2. **In your config**:
   ```javascript
   dataSources: {
     districtStats: {
       apiKey: process.env.GOOGLE_SHEETS_API_KEY || 'fallback-key'
     }
   }
   ```

## 📱 Testing

### Local Testing:
```bash
# Serve files locally
npx serve . -p 3000

# Test specific city
open http://localhost:3000/sites/berlin/
open http://localhost:3000/sites/your-city/
```

### Production Testing:
- Test on different devices and browsers
- Check console for JavaScript errors
- Verify all data loads correctly
- Test responsive behavior

## 🚨 Common Issues

### 1. Map Not Loading
- **Check**: Browser console for errors
- **Fix**: Verify data source URLs are accessible

### 2. CORS Errors
- **Issue**: External data blocked by CORS policy
- **Fix**: Use Netlify redirects as proxy (already configured)

### 3. API Rate Limits
- **Issue**: Google Sheets API limits exceeded
- **Fix**: Cache data or reduce requests

### 4. Mobile Performance
- **Issue**: Slow loading on mobile
- **Fix**: Optimize GeoJSON file sizes, enable compression

## 📞 Getting Help

1. **Check the main README.md** for detailed documentation
2. **Review browser console** for error messages
3. **Check Netlify deploy logs** for build issues
4. **Test with Berlin map** to isolate configuration issues

## 🎯 Next Steps

Once your basic setup is working:

1. **Add more cities** using the template system
2. **Customize styling** to match your brand
3. **Add custom features** specific to your needs
4. **Set up analytics** to track usage
5. **Consider custom domain** for professional appearance

---

**Need more help?** Check the full documentation in the main README.md file.
