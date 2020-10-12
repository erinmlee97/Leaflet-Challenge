var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Creating map object
var myMap = L.map("map", {
    center: [38.8375, -110.8958],
    zoom: 5
  });
  
  // Adding tile layer to the map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  }).addTo(myMap);

// Create function to change colors based on earthquake magnitude
function chooseColor(mag){
    switch(true){
        case mag > 5:
            return "990000";
        case mag > 5:
            return "990033";
        case mag > 5:
            return "990066";
        case mag > 5:
            return "990099";
        case mag > 5:
            return "9900CC";
        default:
            return "9900FF";
    }
}

// Use d3 to pull data from url
d3.json(url, function(data){
    function style(feature){
        return {
            opacity: 1,
            fillOpacity: 1,
            color: "white",
            fillColor: chooseColor(feature.properties.mag),
        }
    }
})
