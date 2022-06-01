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
let date1, date2, min, max;

function checkElement(type, checked) {
  this.type = type
  this.checked = checked
}

let checkArray = [new checkElement("earthquake", false), new checkElement("storm", false), new checkElement("flood", false)]

function isLoaded(type, loaded) {
  this.type = type
  this.loaded = loaded
}

var earthquakeCheckBox = document.querySelector("input[name=earthquake]")
var stormCheckBox = document.querySelector("input[name=storm]")
var floodCheckBox = document.querySelector("input[name=flood]")

var checkBoxes = [earthquakeCheckBox, stormCheckBox, floodCheckBox]
var loaded = [new isLoaded("earthquake", false), new isLoaded("flood", false), new isLoaded("storm", false)]

var floodMarkers = []

var clickable = false

function changeClickable()
{
  if(clickable==false)
  {
    clickable=true
    console.log("I'm now clickable")
  }
  else {
    clickable=false
    console.log("I'm now not clickable")
  }
}

checkBoxes.forEach(function (checkbox) {
  checkbox.addEventListener('change', function () {
    if (checkbox.name === "earthquake") {
      checkArray.find(obj => obj.type === "earthquake").checked = this.checked
      if (this.checked) {
        document.querySelector("input[name=flood]").checked = false
        document.querySelector("input[name=storm]").checked = false
        checkArray.find(obj => obj.type === "flood").checked = false
        checkArray.find(obj => obj.type === "storm").checked = false
        document.getElementById("earthquakeSettings").style.display = "block"
        document.getElementsByClassName("duration")[0].style.display = "block"
        document.getElementById("showing-label").style.display = "block"
        document.getElementById("selectLastFloods").style.display = "none"
        document.getElementById("weatherMenu").style.display = "none"
        document.getElementById("submit").style.display = "block"
      }
    }
    else if (checkbox.name === "storm")
      {
        checkArray.find(obj => obj.type === "storm").checked = this.checked
        if(this.checked)
        {
          document.getElementById("selectLastFloods").style.display = "none"
          checkArray.find(obj => obj.type === "earthquake").checked = false
          checkArray.find(obj => obj.type === "flood").checked = false
          document.querySelector("input[name=flood]").checked = false
          document.querySelector("input[name=earthquake]").checked = false
          document.getElementById("earthquakeSettings").style.display = "none"
          document.getElementById("showing-label").style.display = "none"
          document.getElementById("weatherMenu").style.display = "block"
          document.getElementsByClassName("duration")[0].style.display = "none"
          document.getElementById("submit").style.display = "none"
          changeClickable()
        }
      }
    else if (checkbox.name === "flood") {
      checkArray.find(obj => obj.type === "flood").checked = this.checked
      if (this.checked) {
        document.querySelector("input[name=earthquake]").checked = false
        document.querySelector("input[name=storm]").checked = false
        checkArray.find(obj => obj.type === "earthquake").checked = false
        checkArray.find(obj => obj.type === "storm").checked = false
        document.getElementById("earthquakeSettings").style.display = "none"
        document.getElementsByClassName("duration")[0].style.display = "none"
        document.getElementById("showing-label").style.display = "none"
        document.getElementById("selectLastFloods").style.display = "block"
        document.getElementById("weatherMenu").style.display = "none"
        document.getElementById("submit").style.display = "block"
      }
    }

  })
})

function addFloodMarkers() {
  let nr = document.getElementById("quantity").value
  fetch('https://environment.data.gov.uk/flood-monitoring/id/floodAreas')
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < nr; i++) {
        let lat = data.items[i].lat
        let long = data.items[i].long
        let riverOrSea = data.items[i].riverOrSea
        let county = data.items[i].county

        const popup = new mapboxgl.Popup({ offset: 25 }).setText(
          `River/sea: ${riverOrSea}
          
           County: ${county}`
          );

        const marker = new mapboxgl.Marker()
          .setLngLat([long, lat])
          .setPopup(popup)
          .addTo(map);
        floodMarkers.push(marker)
      }
    }
    );
}

function showFloodPictures() {

  fetch('https://environment.data.gov.uk/flood-monitoring/id/floodAreas')
    .then((response) => response.json())
    .then((data) => {
      const eventsNode = document.getElementById("events");
      while (eventsNode.firstChild) {
        eventsNode.removeChild(eventsNode.lastChild);
      }
      for (let i = 0; i < document.getElementById("quantity").value; i++) {

        let place = data.items[i].eaAreaName;

        let coords = [data.items[i].long, data.items[i].lat]

        let events = document.getElementById('events');

        let event = document.createElement('div');

        event.classList.add('slide');

        event.innerHTML = `<div class="slide-details"><div class="slide-subheading"></div><div class="slide-place"><svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 0 24 24" width="12px" fill="#fff"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>${place}</div></div>`;

        events.appendChild(event);

        const img = document.createElement('img');
        img.src = `https://api.mapbox.com/v4/mapbox.satellite/${coords[0]},${coords[1]},7/360x200@2x.png?access_token=${TOKEN}`;
        img.alt = place;

        event.appendChild(img);

        events.appendChild(event);
      }
    });
}

function removeFloodMarkers() {
  for (let i = 0; i < floodMarkers.length; i++) {
    floodMarkers[i].remove()
  }
}

map.on('style.load', function () {
  map.on('click', function (e) {
      if(clickable)
      {
        var coordinates = e.lngLat;

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML('you clicked here: <br/>' + coordinates
           )
          .addTo(map);
      }
  });
});

// Initialize mapbox popup
const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
});

function setErrorMessage(message) {
  var errMsg = document.getElementById("errorMessage")
  errMsg.textContent = message
}

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

  if (map.getLayer("earthquakes")) {
    map.removeLayer("earthquakes");
  }

  if (map.getSource("earthquakes")) {
    map.removeSource("earthquakes");
  }
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

function setCheckElement(type) {
  document.getElementById(type).checked = true
  var typeCheck = checkArray.find(obj => obj.type === type)
  typeCheck.checked = true
}

// Load tilesets(tectonic plates, Global Seismic Network, Orogens & Volcanoes) on map load
map.on('load', () => {
  // Add earthquakes
  addEarthquakes(url, true);
  document.getElementById("selectLastFloods").style.display = "none"
  document.getElementById("weatherMenu").style.display = "none"
  setCheckElement("earthquake")
  loaded.find(obj => obj.type === "earthquake").loaded = true
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

    if ((data.start && data.end && isDateValid) || checkArray.find(obj => obj.type === "flood").checked) {
      var checkedSomething = false
      setErrorMessage("")
      for (let i = 0; i < loaded.length; i++) {
        if (loaded[i].type === "earthquake" && loaded[i].loaded) {
          removeEarthquakes()
          loaded.find(obj => obj.type === "earthquake").loaded = false
        }
        else if (loaded[i].type === "flood" && loaded[i].loaded) {
          removeFloodMarkers()
          loaded.find(obj => obj.type === "flood").loaded = true
        }
      }
      for (let i = 0; i < checkArray.length; i++) {
        var checkElement = checkArray[i]
        if (checkElement.checked == true) {
          if (checkElement.type === "earthquake") {
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
            addEarthquakes(url, false)
            checkedSomething = true
            document.getElementById("earthquakeSettings").style.display = "block"
            loaded.find(obj => obj.type === "earthquake").loaded = true
          }
          else if (checkElement.type == "flood") {
            addFloodMarkers()
            showFloodPictures()
            checkedSomething = true
            loaded.find(obj => obj.type === "flood").loaded = true
          }
          else if (checkElement.type === "storm") {
            checkedSomething = true
            loaded.find(obj => obj.type === "storm").loaded = true
            if(date2.isBefore(range2))
            {
              setErrorMessage("Cannot show forcast in the past")
            }
          }
        }
      }
      if (!checkedSomething) {
        setErrorMessage("Please check something")
      }
    }
    else {
      setErrorMessage("Please select a valid date")
      document.getElementById('start-date').value = '';
      document.getElementById('end-date').value = '';
      document.getElementById('min-mag').value = '';
      document.getElementById('max-mag').value = '';
    }
  });

});
