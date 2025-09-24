/**
 * Google Sheets Data Processor for Media Maps
 * 
 * Replaces the Python script workflow by directly fetching data from Google Sheets
 * and transforming it to the expected GeoJSON format with rich popup content.
 */

const SheetsDataProcessor = {
  // Cache for performance
  cache: {
    data: null,
    timestamp: null,
    duration: 5 * 60 * 1000 // 5 minutes cache
  },

  /**
   * Fetch and process data from Google Sheets
   * @param {string} sheetId - Google Sheets ID
   * @param {string} range - Sheet range (e.g., 'Sheet1!A:K' or 'Tabellenblatt1!A:K')
   * @returns {Promise<Object>} Processed GeoJSON data
   */
  async fetchAndProcess(sheetId, range = 'Tabellenblatt1!A:K') {
    // Check cache first
    if (this.isCacheValid()) {
      console.log('Using cached Google Sheets data');
      return this.cache.data;
    }

    try {
      console.log('Fetching fresh data from Google Sheets...');
      
      // Load environment variables
      await EnvLoader.load();
      
      // Build Google Sheets API URL
      const sheetsUrl = EnvLoader.buildSheetsUrl(sheetId, range);
      
      if (!sheetsUrl) {
        throw new Error('Google Sheets API key not configured');
      }

      // Fetch data from Google Sheets
      const response = await fetch(sheetsUrl);
      
      if (!response.ok) {
        throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.values || data.values.length < 2) {
        throw new Error('No data found in Google Sheets');
      }

      // Process the data
      const processedData = this.processSheetData(data.values);
      
      // Update cache
      this.cache.data = processedData;
      this.cache.timestamp = Date.now();
      
      console.log('Successfully processed Google Sheets data');
      return processedData;

    } catch (error) {
      console.error('Error fetching from Google Sheets:', error);
      throw error;
    }
  },

  /**
   * Check if cached data is still valid
   */
  isCacheValid() {
    return this.cache.data && 
           this.cache.timestamp && 
           (Date.now() - this.cache.timestamp) < this.cache.duration;
  },

  /**
   * Clear the cache (useful for forcing refresh)
   */
  clearCache() {
    this.cache.data = null;
    this.cache.timestamp = null;
  },

  /**
   * Process raw Google Sheets data into GeoJSON format
   * @param {Array} values - Raw sheet values from Google Sheets API
   * @returns {Object} Processed data in the expected format
   */
  processSheetData(values) {
    const headers = values[0];
    const rows = values.slice(1);
    
    // Create the main data structure
    const data = {};
    
    // Process each row
    rows.forEach(row => {
      if (row.length < 9 || !row[0] || !row[9]) {
        // Skip rows without required data (Name and Koordinaten)
        return;
      }
      
      // Create row object from headers
      const rowData = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index] || '';
      });
      
      // Skip if no coordinates
      if (!rowData['Koordinaten']) {
        return;
      }
      
      // Parse coordinates
      let coordinates;
      try {
        const coordParts = rowData['Koordinaten'].split(',').map(c => parseFloat(c.trim()));
        if (coordParts.length !== 2 || isNaN(coordParts[0]) || isNaN(coordParts[1])) {
          console.warn(`Invalid coordinates for ${rowData['Name']}: ${rowData['Koordinaten']}`);
          return;
        }
        coordinates = coordParts;
      } catch (error) {
        console.warn(`Error parsing coordinates for ${rowData['Name']}: ${rowData['Koordinaten']}`);
        return;
      }
      
      // Get category from Werbeträger
      const category = rowData['Werbeträger'];
      if (!category) {
        console.warn(`No Werbeträger specified for ${rowData['Name']}`);
        return;
      }
      
      // Initialize category if it doesn't exist
      if (!data[category]) {
        data[category] = {
          type: "FeatureCollection",
          features: []
        };
      }
      
      // Create GeoJSON feature
      const feature = {
        type: "Feature",
        properties: {
          Name: rowData['Name'],
          popupContent: this.generatePopup(rowData),
          Category: category
        },
        geometry: {
          type: "Point",
          coordinates: coordinates
        }
      };
      
      data[category].features.push(feature);
    });
    
    return data;
  },

  /**
   * Generate popup HTML content (equivalent to Python generatePopup function)
   * @param {Object} row - Row data object
   * @returns {string} HTML popup content
   */
  generatePopup(row) {
    const infoSection = this.generateInfoSection(row);
    const imagesSection = this.generateImagesSection(row);
    
    const popupHtml = `
      <div class='location-popup'>
        <div class='popup-layout'>
          <div class='popup-info-section'>
            ${infoSection}
          </div>
          <div class='popup-images-section'>
            ${imagesSection}
          </div>
        </div>
      </div>
    `;
    
    // Remove extra whitespace and newlines for cleaner output
    return popupHtml.split(/\s+/).join(' ').trim();
  },

  /**
   * Generate the information section of the popup
   * @param {Object} row - Row data object
   * @returns {string} HTML info section
   */
  generateInfoSection(row) {
    const visibleColumns = [
      'Werbeträger',
      'Ort', 
      'Standort',
      'Maße',
      'Beleuchtung',
      'Buchungsintervall',
      'Vorlaufzeit'
    ];
    
    let infoSection = `<h3>${row['Name']}</h3><br>`;
    
    visibleColumns.forEach(column => {
      const data = row[column];
      if (data) {
        infoSection += `${column}: ${data}<br>`;
      }
    });
    
    infoSection += `
      <br>
      <img src='https://www.wtm-aussenwerbung.de/wp-content/uploads/wtm-aussenwerbung.webp' style='width: 10vw;'>
    `;
    
    return infoSection;
  },

  /**
   * Generate the images section of the popup
   * @param {Object} row - Row data object
   * @returns {string} HTML images section
   */
  generateImagesSection(row) {
    let imagesHtml = '';
    
    // Add custom images if they exist
    if (row['Bild1']) {
      imagesHtml += this.generateImageHtml(row['Bild1']);
    }
    if (row['Bild2']) {
      imagesHtml += this.generateImageHtml(row['Bild2']);
    }
    
    return imagesHtml;
  },

  /**
   * Generate HTML for a single image
   * @param {string} imageUrl - Image URL
   * @returns {string} HTML img tag
   */
  generateImageHtml(imageUrl) {
    if (!imageUrl) {
      return '';
    }
    return `<img src='${imageUrl}' style='width: 15vw; min-width: 200px;'>`;
  }
};

// Export for global access
window.SheetsDataProcessor = SheetsDataProcessor;
