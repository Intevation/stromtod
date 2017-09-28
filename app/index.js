import $ from 'jquery';
import 'uikit'
import mapboxgl from 'mapbox-gl'

// https://css-tricks.com/css-modules-part-2-getting-started/
// https://medium.com/@rajaraodv/webpack-the-confusing-parts-58712f8fcad9#.txbwrns34
import '../node_modules/leaflet/dist/leaflet.css';
import '../node_modules/uikit/dist/css/uikit.css';
import '../css/index.css';

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
          'http://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'http://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'http://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
        ],
        'tileSize': 256
      }
    },
    'layers': [{
      'id': 'osm',
      'type': 'raster',
      'source': 'osm',
      'minzoom': 0,
      'maxzoom': 22
    }]
  },
  center: [9, 52.77],
  zoom: 7
});

// disable map rotation using right click + drag
map.dragRotate.disable();

// disable map rotation using touch rotation gesture
map.touchZoomRotate.disableRotation();

map.addControl(new mapboxgl.NavigationControl(), 'top-right');
// disable map rotation using right click + drag
map.dragRotate.disable();

// // disable map rotation using touch rotation gesture
map.touchZoomRotate.disableRotation();

$(window).width() < 599 ? $('.intro-sidebar').html('Datensätze anzeigen.') : $('.intro-sidebar').html('Hier können Sie sich verschiedene Datensätze anzeigen lassen, um interaktiv die Daten zu den Vogelkollisionen zu erkunden.');

$('#start-btn').on('click', function() {
  $('#intro').outerHeight(!0);
  $('#intro').css('top', '100%');
  $('#sidebar').css('left', '50px');
  $('#overlay').fadeOut(1E3);
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
  map.addLayer({
    'id': 'sensitivitaetskarte',
    'source': {
      'type': 'geojson',
      'data': 'data/Sensitivitaetskarte_wgs84.geojson'
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
    console.log(id);
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
    'minzoom': 7,
    'maxzoom': 14
  });

  $('input[name=baselayer]').change(function() {
    // Uncheck other checkboxes
    $('input[name=baselayer]').not(this).prop('checked', false);
    // Deal with actual checkbox
    var id = $(this).attr('id');
    if ($(this).is(':checked')) {
      map.setLayoutProperty(id, 'visibility', 'visible');
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
      e += '<span style="width:' + d + '%;">' + f + '</span>'
    }
    e += '</div';
    $(this).next().append(e)
  });
});
