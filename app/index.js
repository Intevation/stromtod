import $ from 'jquery';
import mapboxgl from 'mapbox-gl';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import csv2geojson from 'csv2geojson';
// https://www.giacomodebidda.com/how-to-import-d3-plugins-with-webpack/
import {request} from 'd3-request';
import {dsvFormat, csvFormat} from 'd3-dsv';

// https://css-tricks.com/css-modules-part-2-getting-started/
// https://medium.com/@rajaraodv/webpack-the-confusing-parts-58712f8fcad9#.txbwrns34
import '../node_modules/mapbox-gl/dist/mapbox-gl.css';
import '../node_modules/uikit/dist/css/uikit.css';
import '../css/index.css';

// create a Object with only the subset of functions/submodules/plugins that we need
const d3 = Object.assign({},
  {
    request,
    dsvFormat,
    csvFormat
  }, {});

const ibaTemplate = require('../tmpl/details-iba.html');
const totfundTemplate = require('../tmpl/details-totfund.html');

// loads the Icon plugin
UIkit.use(Icons);

$(window).width() < 599 ? $('.intro-sidebar').html('Datensätze anzeigen.') : $('.intro-sidebar').html('Hier können Sie sich verschiedene Datensätze anzeigen lassen, um interaktiv die Daten zu den Vogelkollisionen zu erkunden.');

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

map.on('mousemove', function(e) {
  map.queryRenderedFeatures(e.point).length ? map.getCanvas().style.cursor = 'pointer' : map.getCanvas().style.cursor = ''
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

var s = $('#details').outerHeight(!0);
$('#details').css('bottom', 2 * -s);
$('#details-close').click(function() {
  $('#details').css('bottom', -s);
});

map.on('click', function(b) {
  var a = map.queryRenderedFeatures(b.point, {
    layers: ['leitungskollision', 'stromtod', 'unbekannt', 'iba']
  });
  if (a.length) {
    b = a[0].layer.id;
    a = a[0].properties;
    if (b === 'iba') {
      $('.detail-totfund').hide();
      $('#details').html(ibaTemplate(a));
      $('.detail-iba').show();
      var r = $('#details').outerHeight(!0);
      $('#details').css('bottom', 2 * -r);
      $('#details-close').click(function() {
        $('#details').css('bottom', -r);
      });
    } else {
      $('.detail-iba').hide();
      $('#details').html(totfundTemplate(a));
      $('.detail-totfund').show();
      var s = $('#details').outerHeight(!0);
      $('#details').css('bottom', 2 * -s);
      $('#details-close').click(function() {
        $('#details').css('bottom', -s);
      });
    }
    $('#details').css('bottom', '90px');
  } else {
    b = $('#details').outerHeight(!0);
    $('#details').css('bottom', -b);
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
  // d3-request broken in in conjunction with webpack (because d3-request is intend to work with node only)
  // https://github.com/d3/d3-request/issues/24
  // d3.request('https://www.dropbox.com/s/r8qq3zqmhb1y3kv/Stromtod.csv?raw=1&dl=1').header('X-Requested-With', 'XMLHttpRequest').mimeType('text/plain').response(function(xhr) { makeGeoJSON(xhr.responseText) });

  $.ajax({
    type: 'GET',
    // www.dropbox.com doesn't support cors use dl.dropboxusercontent.com instead.
    url: 'https://dl.dropboxusercontent.com/s/i4c3i6t04lr66e0/Stromtod.csv?raw=1&dl=1',
    // url: 'data/171117-stromtod-anonym.csv',
    success: function(csvData) { makeGeoJSON(csvData); }
  });

  function makeGeoJSON(csvData) {
    var psv = d3.dsvFormat(',');

    var store = []

    psv.parse(csvData, function(data) {
      var dummy = {}
      dummy.Vogelart = data.Vogelart;
      dummy['Anzahl-funde'] = data['Anzahl-funde'];
      dummy.Tag = data.Tag + '.' + data.Monat + '.' + data.Jahr;
      dummy.Todesursache = data.Todesursache;
      dummy.lat = data.lat;
      dummy.lon = data.lon;
      store.push(dummy);
    });
    // var string = d3.csvFormat(box);
    csv2geojson.csv2geojson(d3.csvFormat(store), {
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
    var b = $(this).find('input[name=brutvogelarten]').attr('id');
    var a = [];
    switch (b) {
      case 'BrutvogelartenA':
        a = [
          [0, '#ffffff'],
          [0, '#eaee26'],
          [1, '#f3b710'],
          [3, '#ef2e21'],
          [4, '#91191e']
        ];
        break;
      case 'BrutvogelartenB':
        a = [
          [0, '#ffffff'],
          [0, '#eaee26'],
          [1, '#f3b710'],
          [2, '#ef2e21'],
          [5, '#91191e']
        ];
        break;
      case 'BrutvogelartenC':
        a = [
          [0, '#ffffff'],
          [0, '#eaee26'],
          [15, '#f3b710'],
          [19, '#ef2e21'],
          [24, '#91191e']
        ];
        break;
      case 'BrutvogelartenABC':
        a = [
          [0, '#ffffff'],
          [0, '#eaee26'],
          [17, '#f3b710'],
          [24, '#ef2e21'],
          [31, '#91191e']
        ];
        break;
      default:
        console.log("Sorry, we haven't found a legend style for " + b + '.');
    }
    var d = 100 / a.length;
    var e = '<div class="legend-colors">';
    for (var c = 0; c < a.length; c++) e += '<span style="width:' + d + '%; background-color:' + a[c][1] + ';" ></span>';
    for (c = 0; c < a.length; c++) {
      var f = '';
      f = c === 0 ? a[c + 1][0] : c === a.length - 1 ? '> ' + a[c][0] : '> ' + a[c][0] + ' - ' + a[c + 1][0];
      e += '<span style="width:' + d + '%;">' + f + ' Arten</span>'
    }
    e += '</div>';
    $(this).next().append(e)
  });
});
