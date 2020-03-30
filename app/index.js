import $ from 'jquery';
import mapboxgl from 'mapbox-gl';
import UIkit from 'uikit';
import csv2geojson from 'csv2geojson';

// https://css-tricks.com/css-modules-part-2-getting-started/
// https://medium.com/@rajaraodv/webpack-the-confusing-parts-58712f8fcad9#.txbwrns34
import '../node_modules/mapbox-gl/dist/mapbox-gl.css';
import '../node_modules/uikit/dist/css/uikit.css';
import '../css/index.css';

const ibaTemplate = require('../tmpl/details-iba.html');
const totfundTemplate = require('../tmpl/details-totfund.html');

// from uikit-icons.js
var info = '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"> <path d="M12.13,11.59 C11.97,12.84 10.35,14.12 9.1,14.16 C6.17,14.2 9.89,9.46 8.74,8.37 C9.3,8.16 10.62,7.83 10.62,8.81 C10.62,9.63 10.12,10.55 9.88,11.32 C8.66,15.16 12.13,11.15 12.14,11.18 C12.16,11.21 12.16,11.35 12.13,11.59 C12.08,11.95 12.16,11.35 12.13,11.59 L12.13,11.59 Z M11.56,5.67 C11.56,6.67 9.36,7.15 9.36,6.03 C9.36,5 11.56,4.54 11.56,5.67 L11.56,5.67 Z"></path> <circle fill="none" stroke="#000" stroke-width="1.1" cx="10" cy="10" r="9"></circle></svg>';

// loads the Icon plugin
UIkit.icon.add({ info: info });

$(window).width() < 599
  ? $('.intro-sidebar').html('Datensätze anzeigen.')
  : $('.intro-sidebar').html('Hier können Sie sich verschiedene Datensätze anzeigen lassen, um interaktiv die Daten zu den Vogelkollisionen zu erkunden.');

$('#sidebar').css('left', '50px');

var map = new mapboxgl.Map({
  container: 'map', // container id
  style: {
    'version': 8,
    'sources': {
      'osm': {
        'type': 'raster',
        // point to our third-party tiles. Note that some examples
        // show a "url" property. This only applies to tilesets with
        // corresponding TileJSON (such as mapbox tiles).
        'tiles': [
          'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
        ],
        'tileSize': 256
      }
    },
    'layers': [{
      'id': 'osm',
      'type': 'raster',
      'source': 'osm',
      'minzoom': 0,
      'maxzoom': 18
    }]
  },
  center: [6.402, 51.638],
  zoom: 5.33,
  attributionControl: false

});

map.on('mousemove', function(ev) {
  map.queryRenderedFeatures(ev.point).length ? map.getCanvas().style.cursor = 'pointer' : map.getCanvas().style.cursor = ''
  // var features = map.queryRenderedFeatures(e.point);
  // document.getElementById('features').innerHTML = JSON.stringify(features[0].properties, null, 2);
});

// disable map rotation using right click + drag
map.dragRotate.disable();

// disable map rotation using touch rotation gesture
map.touchZoomRotate.disableRotation();

// map.addControl(new mapboxgl.NavigationControl(), 'top-right');

map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.ScaleControl({
  maxWidth: 200,
  unit: 'metric'
}));

var outerHeight = $('#details').outerHeight(!0);
$('#details').css('bottom', 2 * -outerHeight);
$('#details-close').click(function() {
  $('#details').css('bottom', -outerHeight);
});

map.on('click', function(ev) {
  var features = map.queryRenderedFeatures(ev.point, {
    layers: ['leitungskollision', 'stromtod', 'bahn', 'unbekannt', 'iba']
  });
  if (features.length) {
    let id = features[0].layer.id;
    let props = features[0].properties;
    if (id === 'iba') {
      $('.detail-totfund').hide();
      $('#details').html(ibaTemplate(props));
      $('.detail-iba').show();
      var outerHeightIBA = $('#details').outerHeight(!0);
      $('#details').css('bottom', 2 * outerHeightIBA);
      $('#details-close').click(function() {
        $('#details').css('bottom', -outerHeightIBA);
      });
    } else {
      $('.detail-iba').hide();
      $('#details').html(totfundTemplate(props));
      $('.detail-totfund').show();
      var outerHeightTotfund = $('#details').outerHeight(!0);
      $('#details').css('bottom', 2 * -outerHeightTotfund);
      $('#details-close').click(function() {
        $('#details').css('bottom', -outerHeightTotfund);
      });
    }
    $('#details').css('bottom', '90px');
  } else {
    let oh = $('#details').outerHeight(!0);
    $('#details').css('bottom', -oh);
  }
});

var stylesBrutvogelarten = {
  'BrutvogelartenA': {
    property: 'Anzahl_A',
    type: 'interval',
    stops: [
      [0, '#FFFFFF'],
      [1.0, '#eaee26'],
      [2.0, '#f3b710'],
      [3.0, '#f3b710'],
      [4.0, '#ef2e21'],
      [5.0, '#91191e']
    ]
  },
  'BrutvogelartenB': {
    property: 'Anzahl_B',
    type: 'interval',
    stops: [
      [0, '#FFFFFF'],
      [1.0, '#eaee26'],
      [2.0, '#f3b710'],
      [3.0, '#ef2e21'],
      [4.0, '#ef2e21'],
      [6.0, '#91191e']
    ]
  },
  'BrutvogelartenC': {
    property: 'Anzahl_C',
    type: 'interval',
    stops: [
      [0, '#FFFFFF'],
      [1.0, '#eaee26'],
      [16.0, '#f3b710'],
      [20.0, '#ef2e21'],
      [24.0, '#ef2e21'],
      [25.0, '#91191e']
    ]
  },
  'BrutvogelartenABC': {
    property: 'Anzahl_ABC',
    type: 'interval',
    stops: [
      [0, '#FFFFFF'],
      [1.0, '#eaee26'],
      [18.0, '#f3b710'],
      [25.0, '#ef2e21'],
      [31.0, '#ef2e21'],
      [32.0, '#91191e']
    ]
  }
};

map.on('load', function() {
  $.ajax({
    type: 'GET',
    // www.dropbox.com doesn't support cors use dl.dropboxusercontent.com instead.
    url: 'https://dl.dropboxusercontent.com/s/i4c3i6t04lr66e0/Stromtod.csv?raw=1&dl=1',
    // url: 'data/Stromtod.csv',
    success: function(csvData) { makeGeoJSON(csvData); }
  });

  function makeGeoJSON(csvData) {
    csv2geojson.csv2geojson(csvData, {
      latfield: 'lat',
      lonfield: 'lon',
      delimiter: ','
    }, function(err, data) {
      if (err) {
        console.log(err.stack);
      }

      map.addSource('totfunde', {
        'type': 'geojson',
        'data': data
      });

      map.addLayer({
        'id': 'leitungskollision',
        'source': 'totfunde',
        'type': 'circle',
        'filter': ['==', 'Todesursache', 'ursache-kollision'],
        'paint': {
          'circle-radius': 6,
          'circle-color': '#762a83',
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 1
        }
      });

      map.addLayer({
        'id': 'stromtod',
        'source': 'totfunde',
        'type': 'circle',
        'filter': ['==', 'Todesursache', 'ursache-stromtod'],
        'paint': {
          'circle-radius': 6,
          'circle-color': '#e9a3c9',
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 1

        }
      });

      map.addLayer({
        'id': 'unbekannt',
        'source': 'totfunde',
        'type': 'circle',
        'filter': ['==', 'Todesursache', 'ursache-unbekannt'],
        'paint': {
          'circle-radius': 6,
          'circle-color': '#3288bd',
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 1
        }
      });

      map.addLayer({
        'id': 'bahn',
        'source': 'totfunde',
        'type': 'circle',
        'filter': ['==', 'Todesursache', 'ursache-bahn'],
        'paint': {
          'circle-radius': 6,
          'circle-color': '#3131d3',
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 1
        }
      });
    })
  }

  $('input[name=totfunde]').change(function() {
    // Deal with actual checkbox
    // $('.totfunde.layer-legend').not(this).removeClass('active');
    var id = $(this).attr('id');
    if ($(this).is(':checked')) {
      map.setLayoutProperty(id, 'visibility', 'visible');
    } else {
      map.setLayoutProperty(id, 'visibility', 'none');
    }
  });

  map.addLayer({
    'id': 'sensitivitaetskarte',
    'source': {
      'type': 'geojson',
      'data': 'data/out-p5.geojson'
    },
    'type': 'fill',
    'layout': {
      'visibility': 'none'
    },
    'paint': { 'fill-opacity': 0.75 }
  });

  $('input[name=brutvogelarten]').change(function() {
    // Uncheck other checkboxes
    $('input[name=brutvogelarten]').not(this).prop('checked', false);
    // Removed other legends
    $('.brutvogelarten.layer-legend').not(this).removeClass('active');

    // Deal with actual checkbox
    var id = $(this).attr('id');
    if ($(this).is(':checked')) {
      map.setPaintProperty('sensitivitaetskarte', 'fill-color', stylesBrutvogelarten[id]
      );
      map.setLayoutProperty('sensitivitaetskarte', 'visibility', 'visible');
    } else {
      map.setLayoutProperty('sensitivitaetskarte', 'visibility', 'none');
    }
  });

  map.addLayer({
    'id': 'iba',
    'source': {
      'type': 'geojson',
      'data': 'data/iba.geojson'
    },
    'type': 'fill',
    'layout': {
      'visibility': 'none'
    },
    'paint': {
      'fill-color': '#15534C',
      'fill-opacity': 0.8

    }
  });

  $('input[name=iba]').change(function() {
    // Deal with actual checkbox
    // var id = $(this).attr("id");
    if ($(this).is(':checked')) {
      map.setLayoutProperty('iba', 'visibility', 'visible');
    } else {
      map.setLayoutProperty('iba', 'visibility', 'none');
    }
  });

  map.addLayer({
    'id': 'powerlines110000',
    'source': {
      'type': 'geojson',
      'data': 'data/powerlines_110000.geojson'
    },
    'type': 'line',
    'layout': {
      'visibility': 'none'
    },
    'paint': {
      'line-color': '#5aae58',
      'line-width': 1.5
    }
  });
  map.addLayer({
    'id': 'powerlines220000',
    'source': {
      'type': 'geojson',
      'data': 'data/powerlines_220000.geojson'
    },
    'type': 'line',
    'layout': {
      'visibility': 'none'
    },
    'paint': {
      'line-color': '#dd1e1c',
      'line-width': 2
    }
  });
  map.addLayer({
    'id': 'powerlines380000',
    'source': {
      'type': 'geojson',
      'data': 'data/powerlines_380000.geojson'
    },
    'type': 'line',
    'layout': {
      'visibility': 'none'
    },
    'paint': {
      'line-color': '#4b86b7',
      'line-width': 2.5
    }
  });

  $('input[name=powerlines]').change(function() {
    // Deal with actual checkbox
    var id = $(this).attr('id');
    if ($(this).is(':checked')) {
      map.setLayoutProperty(id, 'visibility', 'visible');
    } else {
      map.setLayoutProperty(id, 'visibility', 'none');
    }
  });

  map.addLayer({
    'id': 'satellite',
    'type': 'raster',
    'source': {
      'type': 'raster',
      'tiles': [
        'https://tiles.maps.eox.at/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&layers=s2cloudless_3857'
      ],
      'tileSize': 256
    },
    'layout': {
      'visibility': 'none'
    },
    'paint': {},
    'minzoom': 0,
    'maxzoom': 14
  }, 'sensitivitaetskarte');

  map.addLayer({
    'id': 'stamen',
    'type': 'raster',
    'source': {
      'type': 'raster',
      'tiles': [
        'https://stamen-tiles-a.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
        'https://stamen-tiles-b.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
        'https://stamen-tiles-c.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
        'https://stamen-tiles-d.a.ssl.fastly.net/toner/{z}/{x}/{y}.png'
      ],
      'tileSize': 256
    },
    'layout': {
      'visibility': 'none'
    },
    'paint': {},
    'minzoom': 0,
    'maxzoom': 14
  }, 'sensitivitaetskarte');

  $('input[name=baselayer]').change(function() {
    // Uncheck other checkboxes
    $('input[name=baselayer]').not(this).prop('checked', false);
    // Deal with actual checkbox
    var id = $(this).attr('id');
    if ($(this).is(':checked')) {
      map.setLayoutProperty(id, 'visibility', 'visible');
      if (id === 'osm') {
        map.setLayoutProperty('satellite', 'visibility', 'none');
        map.setLayoutProperty('stamen', 'visibility', 'none');
      } else if (id === 'satellite') {
        map.setLayoutProperty('osm', 'visibility', 'none');
        map.setLayoutProperty('stamen', 'visibility', 'none');
      } else {
        map.setLayoutProperty('osm', 'visibility', 'none');
        map.setLayoutProperty('satellite', 'visibility', 'none');
      }
    } else {
      map.setLayoutProperty(id, 'visibility', 'none');
    }
  });

  // $('.iba.layer-legend').change(function() {
  //  $(this).next().toggleClass('active');
  //  $(this).next().slideToggle('slow')
  // });
  //
  $('.brutvogelarten.layer-legend').change(function() {
    $('.brutvogelarten.layer-legend').not(this).next('.active').slideToggle('slow');
    $('.brutvogelarten.layer-legend').not(this).next().removeClass('active');

    $(this).next().toggleClass('active');
    $(this).next().slideToggle('slow')
  });

  $('.brutvogelarten.layer-legend').each(function() {
    var brutvogelarten = $(this).find('input[name=brutvogelarten]').attr('id');
    var colors = [];
    switch (brutvogelarten) {
      case 'BrutvogelartenA':
        colors = [
          [0, '#ffffff'],
          [0, '#eaee26'],
          [1, '#f3b710'],
          [3, '#ef2e21'],
          [4, '#91191e']
        ];
        break;
      case 'BrutvogelartenB':
        colors = [
          [0, '#ffffff'],
          [0, '#eaee26'],
          [1, '#f3b710'],
          [2, '#ef2e21'],
          [5, '#91191e']
        ];
        break;
      case 'BrutvogelartenC':
        colors = [
          [0, '#ffffff'],
          [0, '#eaee26'],
          [15, '#f3b710'],
          [19, '#ef2e21'],
          [24, '#91191e']
        ];
        break;
      case 'BrutvogelartenABC':
        colors = [
          [0, '#ffffff'],
          [0, '#eaee26'],
          [17, '#f3b710'],
          [24, '#ef2e21'],
          [31, '#91191e']
        ];
        break;
      default:
        console.log("Sorry, we haven't found a legend style for " + brutvogelarten + '.');
    }
    var width = 100 / colors.length;
    var legendColors = '<div class="legend-colors">';
    for (var color = 0; color < colors.length; color++) legendColors += '<span style="width:' + width + '%; background-color:' + colors[color][1] + ';" ></span>';
    for (color = 0; color < colors.length; color++) {
      var count = '';
      count = color === 0 ? colors[color + 1][0] : color === colors.length - 1 ? '> ' + colors[color][0] : '> ' + colors[color][0] + ' - ' + colors[color + 1][0];
      legendColors += '<span style="width:' + width + '%;">' + count + ' Arten</span>'
    }
    legendColors += '</div>';
    $(this).next().append(legendColors)
  });
});
