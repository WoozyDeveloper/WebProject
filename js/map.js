mapboxgl.accessToken =
  'pk.eyJ1IjoiYXhlbGxiZW4iLCJhIjoiY2pneHc0a2o2MGlkcTJ3bGxtdHB1cXoycSJ9.BRtJfvAR2e_5nA3irA2KSg';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v8',
  zoom: 2,
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

const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  placeholder: 'Search Location',
});

geocoder.on('result', (e) => {
  const searchLocation = e.result.place_name;
  console.log(searchLocation);
});

// add geocoder(search bar) map control
map.addControl(geocoder, 'top-left');

// Extract the search location from the geocoder

// Initialize mapbox popup
const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
});

fetch(
  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'
)
  .then((response) => response.json())
  .then((data) => {
    for (let i = 0; i < 3; i++) {
      let coords = data.features[i].geometry.coordinates;
      let place = data.features[i].properties.place;
      let datetime = new Date(data.features[i].properties.time);
      let time = moment(datetime).format('LT');
      let date = moment(datetime).format('DD/MM/YYYY');
      let mag = `M ${data.features[i].properties.mag.toFixed(1)}`;
      const marker = new mapboxgl.Marker()
      .setLngLat([coords[0], coords[1]])
      .addTo(map);


      // Add to Latest Events
      let latestEvents = document.getElementById('latest-events');
      let event = document.createElement('div');
      event.classList.add('event');
      event.innerHTML = `
        <p class="event-date">${date}</p>
        <p class="event-time">${time}</p>
        <p class="event-place">${place}</p>
        <p class="event-mag">${mag}</p>
      `;
      latestEvents.appendChild(event);
    }
  });
