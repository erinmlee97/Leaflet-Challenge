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

  // Create function to change color based on earthquake magnitude
  function getColor(mag) {
    // Conditionals for magnitude
    if (mag >= 5) {
      return "#ea2c2c";
    }
    else if (mag >= 4) {
      return "#eaa12c";
    }
    else if (mag >= 3) {
     return "#eaea2c";
    }
    else if (mag >= 2) {
      return "#6fea2c";
    }
    else if (mag >= 1) {
      return "#2cdaea";
    }
    else {
      return "#a12cea";
    }
};

// Use d3 to pull data from url
d3.json(url, function(data){
    function styles(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            color: "white",
            fillColor: getColor(feature.properties.mag),
            radius: radius(feature.properties.mag),
            weight: 0.5,
            stroke: true
        }
    }
    // Create funtion to set radius from magnitude
    function radius(mag){
        if (mag === 0){
            return 1;
        }
        return mag * 5;
    }

    // Get GeoJson layer, create cirlces, and add information on earthquake
    L.geoJson(data, {
        pointToLayer: function(feature, coord){
            return L.circleMarker(coord);
        },
        style: styles,
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`Location: ${feature.properties.place} <hr> Magnitude: ${feature.properties.mag}`)
        }
    }).addTo(myMap)

    // Create an object for the legend
    var legend =L.control({
        position: "bottomright"
    });
    
    // Add details for the legend
    legend.onAdd = () => {
        var div = L.DomUtil.create('div', 'info legend');
        var magnitudes = [0, 1, 2, 3, 4, 5];
        // For each magnitude append div with color and range 
        magnitudes.forEach(m => {
          var range = `${m} - ${m+1}`;
          if (m >= 5) {range = `${m}+`}
          var html = `<div class="legend-item">
                <div style="height: 25px; width: 25px; background-color:${getColor(m)}"> </div>
                <div <strong>${range}</strong></div>
            </div>`
          div.innerHTML += html
        });
        return div;
    }
    // Add legend to map
    legend.addTo(myMap);
});

