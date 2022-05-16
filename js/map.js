// Get Mapbox Access Token
import TOKEN from '../config.js';

mapboxgl.accessToken = TOKEN;

// Initialize mapbox object
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v8',
  zoom: 1.5,
  // pitch: 60,
  logoPosition: 'bottom-right',
  attributionControl: false,
});

// disable map rotation using right click + drag
map.dragRotate.disable();

// disable map rotation using touch rotation gesture
map.touchZoomRotate.disableRotation();

// add zoom in & zoom out map controls
map.addControl(
  new mapboxgl.NavigationControl({
    showCompass: false,
  }),
  'top-right'
);

// add geocoder(search bar) map control
map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    placeholder: 'Search Location',
  }),
  'top-left'
);

// Global variables
let isFullyLoaded = false;
let url =
  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';
let label_text = 'Earthquakes of Past 30 days';

// Initialize mapbox popup
const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
});

// Function to add popup for earthquakes
function addPopup(source, showTimeAgo) {
  map.on('mouseenter', source, (e) => {
    map.getCanvas().style.cursor = 'pointer';

    let coordinates = e.features[0].geometry.coordinates.slice();
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // For each earthquakes show magnitude, place and time
    if (source === 'earthquakes') {
      let mag = e.features[0].properties.mag
        ? e.features[0].properties.mag.toFixed(1)
        : '';
      let place = e.features[0].properties.place
        ? e.features[0].properties.place
        : '';
      let time = e.features[0].properties.time
        ? new Date(e.features[0].properties.time)
        : '';

      if (showTimeAgo) {
        popup
          .setLngLat(coordinates)
          .setHTML(
            `<div class="popup">
                        <span class="popup-head">${mag}</span>
                        <span class="popup-text">
                            ${place}
                            <br>
                            <strong>(${moment(time).fromNow()})</strong>
                        </span>
                    </div>`
          )
          .addTo(map);
      } else {
        popup
          .setLngLat(coordinates)
          .setHTML(
            `<div class="popup">
                        <span class="popup-head">${mag}</span>
                        <span class="popup-text">
                            ${place}
                            <br>
                            <strong>${moment(time).format('dddd LT')}</strong>
                            <strong>${moment(time).format(
                              'DD/MM/YYYY'
                            )}</strong>
                        </span>
                    </div>`
          )
          .addTo(map);
      }
    }
  });

  map.on('mouseleave', source, () => {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });
}

// Function to add earthquakes in map
function addEarthquakes(geojson, showTimeAgo) {
  if (!showTimeAgo) {
    // Change label text in the menu
    label_text = `${date1.format('DD/MM/YYYY')} to ${date2.format(
      'DD/MM/YYYY'
    )}`;
    if (min && max) {
      label_text += ` (M ${parseFloat(min).toFixed(1)}-${parseFloat(
        max
      ).toFixed(1)})`;
    } else if (min) {
      label_text += ` (M >=${parseFloat(min).toFixed(1)})`;
    } else if (max) {
      label_text += ` (M <=${parseFloat(max).toFixed(1)})`;
    }

    // Check for API call error(USGS API query response must be <= 20,000)
    fetch(geojson.replace('/query?', '/count?')).catch((error) =>
      console.log(error)
    );
  }

  // Show label_text in the menu
  document.querySelector('#showing-label p').textContent = label_text;

  // Add earthquakes source
  map.addSource('earthquakes', {
    type: 'geojson',
    data: geojson,
  });

  // Add earthquakes layer of type circle and interpolate circle color, radius w.r.t magnitude
  map.addLayer({
    id: 'earthquakes',
    type: 'circle',
    source: 'earthquakes',
    paint: {
      'circle-blur': 0.3,
      'circle-color': [
        'interpolate',
        ['linear'],
        ['get', 'mag'],
        2,
        '#fca31d',
        4,
        '#fc691d',
        6,
        '#fc1d1d',
      ],
      'circle-opacity': 0.5,
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['get', 'mag'],
        2,
        4,
        6,
        7,
        10,
        10,
      ],
      'circle-stroke-color': [
        'interpolate',
        ['linear'],
        ['get', 'mag'],
        2,
        '#fca31d',
        4,
        '#fc691d',
        6,
        '#fc1d1d',
      ],
      'circle-stroke-width': 1,
    },
  });

  // Add popup for earthquakes
  addPopup('earthquakes', showTimeAgo);
}

// Function to remove earthquakes in map
function removeEarthquakes() {
  if (map.isSourceLoaded('earthquakes') && map.getLayer('earthquakes')) {
    map.removeLayer('earthquakes');
    map.removeSource('earthquakes');
  }
}

// Load tilesets(tectonic plates, Global Seismic Network, Orogens & Volcanoes) on map load
map.on('load', () => {
  // Add earthquakes
  addEarthquakes(url, true);
});

// Toggle tilesets on/off in map idle state
map.on('idle', () => {
  // Remove loading screen after Map fully loaded
  if (!isFullyLoaded) {
    document
      .querySelector('.overlay')
      .parentNode.removeChild(document.querySelector('.overlay'));
    console.log('Map is Fully Loaded!');
    isFullyLoaded = true;
  }
});
