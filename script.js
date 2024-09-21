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
  "esri/widgets/LayerList"
], function(esriConfig, Map, MapView, Graphic, GraphicsLayer, FeatureLayer, BasemapGallery, Editor, Locate, Search, SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, SimpleRenderer, LayerList) {
  
  esriConfig.apiKey = "AAPK2cb19acc98eb406b80346e85af5aa1ffagWp07_WJVQlFAY2XL6xGrQ86USz9K6UzB1OaBd37PTIlYdHTo04S0-F9ETbr-dC";

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
      url: "https://addisonia.github.io/562-lab2/local_airport_24dp_FFFF55.png",
      width: "24px",
      height: "24px"
    }
  };

  // Heliport renderer
  const heliportRenderer = {
    type: "simple",
    symbol: {
      type: "picture-marker",
      url: "https://addisonia.github.io/562-lab2/helicopter.png",    
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
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/My_Airports_576lab3/FeatureServer",
    outFields: ["AirportCode"],
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
});