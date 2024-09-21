require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
  "esri/layers/FeatureLayer",
  "esri/widgets/BasemapGallery",
  "esri/widgets/Editor",
  "esri/widgets/Locate",
  "esri/widgets/Search",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/renderers/SimpleRenderer",
  "esri/widgets/LayerList",
  "esri/widgets/Legend"
], function(esriConfig, Map, MapView, Graphic, GraphicsLayer, FeatureLayer, BasemapGallery, Editor, Locate, Search, SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, SimpleRenderer, LayerList, Legend) {
  
  esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurIMrpomeP09wA2mwDUzsv0qeG0ISCTpeTdFxzbJ-cyUauMC57EbnsWKVEefpRXnMiGrcXI8uPFtXbXTg2ji6sArT6R3SJAig3OM8Lzga26cqaxk8AxkOHrjTm9r-TQeuNHOu0bcrPnWC23w_4kB0GpfStwIImUvd3GDp4LZ4RSIjvlx30GE3n4EEu8qDK22R6k_mqP_HtnOMp02bV3JenFSMMaoeVsf4YcD-tH1zZ8sfAT1_iHCSbfhe";

  const map = new Map({
    basemap: "arcgis-topographic"
  });

  const view = new MapView({
    map: map,
    center: [-97.7431, 30.2672],
    zoom: 13,
    container: "viewDiv"
  });

  const graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);

  // Stevie Ray Vaughan Statue point
  const point = {
    type: "point",
    longitude: -97.750689,
    latitude: 30.263098 
  };
  
  const simpleMarkerSymbol = {
    type: "simple-marker",
    color: [0, 0, 139],
    outline: {
      color: [255, 255, 255],
      width: 1
    }
  };

  const popupTemplate = {
    title: "{Name}",
    content: "{Description}"
  }
  const attributes = {
    Name: "Stevie Ray Vaughan Statue",
    Description: "A bronze sculpture of Stevie Ray Vaughan by Ralph Helmick"
  }

  const pointGraphic = new Graphic({
    geometry: point,
    symbol: simpleMarkerSymbol,
    attributes: attributes,
    popupTemplate: popupTemplate
  });
   
  graphicsLayer.add(pointGraphic);

  // Colleges and Universities layer
  const popupEduusa = {
    "title": "EDUs",
    "content": "<b>Name:</b> {NAME}<br><b>Total Enrollment:</b> {TOT_ENROLL}<br>"
  }

  const usaeduLayer = new FeatureLayer({
    url: "https://services2.arcgis.com/FiaPA4ga0iQKduv3/arcgis/rest/services/Colleges_and_Universities_View/FeatureServer",
    outFields: ["NAME","TOT_ENROLL"],
    popupTemplate: popupEduusa
  });

  map.add(usaeduLayer);

  // Airport renderer
  const airportRenderer = {
    type: "simple",
    symbol: {
      type: "picture-marker",
      url: "https://addisonia.github.io/576-lab3/local_airport_24dp_FFFF55.png",
      width: "24px",
      height: "24px"
    }
  };

  // Heliport renderer
  const heliportRenderer = {
    type: "simple",
    symbol: {
      type: "picture-marker",
      url: "https://addisonia.github.io/576-lab3/helicopter.png",    
      width: "24px",
      height: "24px"
    }
  };

  // My Airport renderer
  const myAirportRenderer = {
    type: "simple",
    symbol: {
      type: "picture-marker",
      url: "https://addisonia.github.io/576-lab3/myairport.png",    
      width: "24px",
      height: "24px"
    }
  };

  // Popup template for airports and heliports
  const airportPopupTemplate = {
    title: "{Fac_Name}",
    content: [
      {
        type: "fields",
        fieldInfos: [
          { fieldName: "Fac_Type", label: "Facility Type" },
          { fieldName: "City", label: "City" },
          { fieldName: "Elevation", label: "Elevation" }
        ]
      }
    ]
  };

  // Airport Layer
  const airportLayer = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/US_Airports_Addison/FeatureServer/0",
    renderer: airportRenderer,
    definitionExpression: "Fac_Type = 'AIRPORT'",
    outFields: ["Fac_Name", "Fac_Type", "City", "Elevation"],
    popupTemplate: airportPopupTemplate
  });

  // Heliport Layer
  const heliportLayer = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/US_Airports_Addison/FeatureServer/0",
    renderer: heliportRenderer,
    definitionExpression: "Fac_Type = 'HELIPORT'",
    outFields: ["Fac_Name", "Fac_Type", "City", "Elevation"],
    popupTemplate: airportPopupTemplate
  });

  // Add layers to the map
  map.add(airportLayer);
  map.add(heliportLayer);

  // My Airports layer
  const myAirports = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/My_Airports_576lab3/FeatureServer/0",
    renderer: {
      type: "simple",
      symbol: {
        type: "picture-marker",
        url: "./myairport.png",
        width: "24px",
        height: "24px"
      }
    },
    outFields: ["AirportCode"],
    popupTemplate: {
      title: "My Airport",
      content: "{AirportCode}"
    },

    // Labelling Info
    labelingInfo: [{
      symbol: {
        type: "text",
        color: "black",
        haloColor: "white",
        haloSize: "2px",
        font: {
          size: "12px",
          family: "Arial",
          weight: "bold"
        }
      },
      labelPlacement: "above-center",
      labelExpressionInfo: {
        expression: "$feature.AirportCode"
      }
    }]
  });

  map.add(myAirports);

  // Editor widget
  const pointInfos = {
    layer: myAirports
  };

  const editor = new Editor({
    view: view,
    layerInfos: [pointInfos]
  });

  view.ui.add(editor, "top-right");


  // Create the Legend widget
  const legend = new Legend({
    view: view,
    layerInfos: [
      {
        layer: myAirports,
        title: "My Custom Points"
      },
      {
        layer: airportLayer,
        title: "US Airports"
      },
      {
        layer: heliportLayer,
        title: "US Heliports"
      },
      {
        layer: usaeduLayer,
        title: "US Universities"
      }
    ]
  });

  // Add the legend to the view's UI
  view.ui.add(legend, "bottom-left");




});