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

function addFloodMarkers() {
  fetch('https://environment.data.gov.uk/flood-monitoring/id/floodAreas')
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < 10; i++) {
        let lat = data.items[i].lat
        let long = data.items[i].long
        const marker = new mapboxgl.Marker()
          .setLngLat([long, lat])
          .addTo(map);
      }
    }
    );
}

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
let date1, date2, min, max;

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

function displayEvents(url) {
  document.getElementById('events').innerHTML = '';
  console.log(url);
  // Recent five earthquakes
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < 15; i++) {
        let coords = data.features[i].geometry.coordinates;
        let place = data.features[i].properties.place;
        let datetime = new Date(data.features[i].properties.time);
        let time = moment(datetime).format('LT');
        let date = moment(datetime).format('DD/MM/YYYY');
        let mag = `M ${data.features[i].properties.mag.toFixed(1)}`;

        let events = document.getElementById('events');

        let event = document.createElement('div');

        event.classList.add('slide');

        event.innerHTML = `<div class="slide-details"><p>${time}</p><div class="slide-subheading"><p>${mag}</p><p>${date}</p></div><div class="slide-place"><svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 0 24 24" width="12px" fill="#fff"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>${place}</div></div>`;

        events.appendChild(event);

        const img = document.createElement('img');
        img.src = `https://api.mapbox.com/v4/mapbox.satellite/${coords[0]},${coords[1]},7/360x200@2x.png?access_token=${TOKEN}`;
        img.alt = place;

        event.appendChild(img);

        events.appendChild(event);
      }
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

  // Display latest earthquakes
  displayEvents(geojson);
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
  if(document.getElementById("flood").checked)
    addFloodMarkers();
  else if(document.getElementById("earthquake").checked)
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




// Get earthquakes in specific date and magnitude range in map idle state
map.on('idle', () => {
  // Submitted date and magnitude validation
  document.querySelector('form').addEventListener('submit', (e) => {
    const data = Object.fromEntries(new FormData(e.target).entries());
    e.preventDefault();
    const today = new Date();
    date1 = moment(data.start, 'YYYY-MM-DD');
    date2 = moment(data.end, 'YYYY-MM-DD');
    const range1 = moment('1800-01-01', 'YYYY-MM-DD');
    const range2 = moment(today);
    const isDateValid =
      (date1.isBetween(range1, range2) ||
        date1.isSame(range1) ||
        date1.isSame(range2)) &&
      (date2.isBetween(range1, range2) ||
        date2.isSame(range1) ||
        date2.isSame(range2)) &&
      date1.isBefore(date2) &&
      date2.isAfter(date1);

    console.log(data);

    min = data.min;
    max = data.max;

    if (data.start && data.end && isDateValid) {
      if (document.getElementById("earthquake").checked && !document.getElementById("flood").checked && !document.getElementById("storm").checked) {
        removeEarthquakes();
        if (data.min && data.max) {
          url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${data.start}&endtime=${data.end}&minmagnitude=${min}&maxmagnitude=${max}`;
        } else {
          if (data.min) {
            url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${data.start}&endtime=${data.end}&minmagnitude=${min}`;
          } else if (data.max) {
            url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${data.start}&endtime=${data.end}&maxmagnitude=${max}`;
          } else {
            url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${data.start}&endtime=${data.end}`;
          }
        }
        addEarthquakes(url, false);
      }
      else if (!document.getElementById("earthquake").checked && !document.getElementById("flood").checked && document.getElementById("storm").checked) {
        console.log("just storm checked")
      }
      else if (!document.getElementById("earthquake").checked && document.getElementById("flood").checked && !document.getElementById("storm").checked) {
        removeEarthquakes();
        addFloodMarkers();
      }
      else {
        console.log("nothing checked")
      }
    } else {
      console.log('Invalid Date');
    }
    document.getElementById('start-date').value = '';
    document.getElementById('end-date').value = '';
    document.getElementById('min-mag').value = '';
    document.getElementById('max-mag').value = '';
  });
});
