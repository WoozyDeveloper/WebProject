mapboxgl.accessToken =
  'pk.eyJ1IjoiYXhlbGxiZW4iLCJhIjoiY2pneHc0a2o2MGlkcTJ3bGxtdHB1cXoycSJ9.BRtJfvAR2e_5nA3irA2KSg';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v8',
  zoom: 1.5,
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

// Initialize mapbox popup
const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
});
