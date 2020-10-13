var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var url2 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"

// Perform a GET request to the query URL
d3.json(url, function(data) {
    console.log(data.features);
    // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map
    createFeatures(data.features);
  });
  function createFeatures(earthquakeData){
    function onEachFeature(feature, layer) {
      layer.bindPopup("<hs>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    function radius(mag){
        if (mag === 0){
            return 1;
        }
        return mag * 20000;
    }

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
  
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(earthquakeData, coord){
            return L.circle(coord, {
                opacity: 1,
                fillOpacity: 1,
                color: "white",
                fillColor: getColor(earthquakeData.properties.mag),
                radius: radius(earthquakeData.properties.mag),
                weight: 0.5,
                stroke: true
            });
        },
        onEachFeature: onEachFeature
    });
  
    createMap(earthquakes);
  }

function createMap(earthquakes){
  // Adding tile layer to the map
  var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
  })

  var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
  })

  var light = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  })

    // Create a faultline layer
    var faultLine = new L.LayerGroup();

    // Base map layer
    var baseMap= {
        "Satellite": satellite,
        "Outdoors": outdoors,
        "Light": light
    }

    // Overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes,
        FaultLines: faultLine
    }

    // Creating map object
    var myMap = L.map("map", {
        center: [38.8375, -110.8958],
        zoom: 5,
        layers: [satellite, earthquakes, faultLine]
    });

    // Add baseMap and overlayMaps to myMap
    L.control.layers(baseMap, overlayMaps, {
        collapsed: false
      }).addTo(myMap);

    d3.json(url2, function(data){
        L.geoJSON(data, {
            style: function(){
                return {color: "orange",
                        fillOpacity: 0}
            }
        }).addTo(faultLine)
    })
    // Create an object for the legend
    var legend =L.control({
        position: "bottomright"
    });

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
}