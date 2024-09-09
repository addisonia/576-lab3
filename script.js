require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/geometry/Point",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Locate",
    "esri/widgets/Search"  // Added Search module
  ], function(esriConfig, Map, MapView, Graphic, Point, BasemapGallery, Locate, Search) {
    esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurIMrpomeP09wA2mwDUzsv0qeG0ISCTpeTdFxzbJ-cyUauMC57EbnsWKVEefpRXnMiGrcXI8uPFtXbXTg2ji6sArT6R3SJAig3OM8Lzga26cqaxk8AxkOHrjTm9r-TQeuNHOu0bcrPnWC23w_4kB0GpfStwIImUvd3GDp4LZ4RSIjvlx30GE3n4EEu8qDK22R6k_mqP_HtnOMp02bV3JenFSMMaoeVsf4YcD-tH1zZ8sfAT1_iHCSbfhe";
  
    const map = new Map({
      basemap: "arcgis-imagery" // Starting with satellite imagery as the basemap
    });
  
    const view = new MapView({
      map: map,
      zoom: 15, // Default zoom level
      container: "viewDiv"
    });


    // Create the Search widget
    const searchWidget = new Search({
        view: view
        });
    
        // Add the Search widget to the top-right corner of the view
        view.ui.add(searchWidget, {
        position: "top-right",
        index: 2  // Place it below the BasemapGallery
        });
        
  
    // Create the BasemapGallery
    const basemapGallery = new BasemapGallery({
      view: view,
      source: {
        portal: {
          url: "https://www.arcgis.com"
        }
      }
    });
  
    // Add the BasemapGallery widget to the top-right corner of the view
    view.ui.add(basemapGallery, {
      position: "top-right"
    });
  
    // Create the Locate widget
    const locateBtn = new Locate({
      view: view
    });
  
    // Add the Locate widget to the top-left corner of the view
    view.ui.add(locateBtn, {
      position: "top-left"
    });
  
    function addGraphic(lon, lat) {
      const point = new Point({
        longitude: lon,
        latitude: lat
      });
  
      const graphic = new Graphic({
        geometry: point,
        symbol: {
          type: "simple-marker",
          color: [226, 119, 40],
          outline: {
            color: [255, 255, 255],
            width: 2
          }
        }
      });
  
      view.graphics.add(graphic);
    }
  
    // Initial geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lon = position.coords.longitude;
          const lat = position.coords.latitude;
  
          view.center = [lon, lat];
          addGraphic(lon, lat);
        },
        error => {
          console.error("Error getting location:", error);
          // Default to San Francisco if geolocation fails
          view.center = [-122.4194, 37.7749];
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      // Default to San Francisco if geolocation is not supported
      view.center = [-122.4194, 37.7749];
    }
  });