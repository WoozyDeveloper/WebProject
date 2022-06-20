// Get Mapbox Access Token
import TOKEN from "../config.js";

mapboxgl.accessToken = TOKEN;

// Initialize mapbox object
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v8",
  zoom: 1.5,
  // pitch: 60,
  logoPosition: "bottom-right",
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
  "top-right"
);

// add geocoder(search bar) map control
map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    placeholder: "Search Location",
  }),
  "top-left"
);

// Global variables
let isFullyLoaded = false;
let url =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
let label_text = "Earthquakes of Past 30 days";
let date1, date2, min, max;

function checkElement(type, checked) {
  this.type = type;
  this.checked = checked;
}

let checkArray = [
  new checkElement("earthquake", false),
  new checkElement("storm", false),
  new checkElement("flood", false),
  new checkElement("other", false),
];

function isLoaded(type, loaded) {
  this.type = type;
  this.loaded = loaded;
}

var earthquakeCheckBox = document.querySelector("input[name=earthquake]");
var stormCheckBox = document.querySelector("input[name=storm]");
var floodCheckBox = document.querySelector("input[name=flood]");
var otherCheckBox = document.querySelector("input[name=other]");

var checkBoxes = [
  earthquakeCheckBox,
  stormCheckBox,
  floodCheckBox,
  otherCheckBox,
];
var loaded = [
  new isLoaded("earthquake", false),
  new isLoaded("flood", false),
  new isLoaded("storm", false),
  new isLoaded("other", false),
];

var floodMarkers = [];

var clickable = false;

checkBoxes.forEach(function (checkbox) {
  checkbox.addEventListener("change", function () {
    if (checkbox.name === "earthquake") {
      checkArray.find((obj) => obj.type === "earthquake").checked =
        this.checked;
      if (this.checked) {
        document.querySelector("input[name=flood]").checked = false;
        document.querySelector("input[name=storm]").checked = false;
        checkArray.find((obj) => obj.type === "flood").checked = false;
        checkArray.find((obj) => obj.type === "storm").checked = false;
        document.getElementById("earthquakeSettings").style.display = "block";
        document.getElementsByClassName("duration")[0].style.display = "block";
        document.getElementById("showing-label").style.display = "block";
        document.getElementById("selectLastFloods").style.display = "none";
        document.getElementById("weatherMenu").style.display = "none";
        document.getElementById("submit").style.display = "block";
        document.getElementById("event-form").style.display = "none";
        document.querySelector("input[name=other]").checked = false;
        clickable = false;
      }
    } else if (checkbox.name === "storm") {
      checkArray.find((obj) => obj.type === "storm").checked = this.checked;
      if (this.checked) {
        document.getElementById("selectLastFloods").style.display = "none";
        checkArray.find((obj) => obj.type === "earthquake").checked = false;
        checkArray.find((obj) => obj.type === "flood").checked = false;
        checkArray.find((obj) => obj.type === "storm").checked = true;
        document.querySelector("input[name=flood]").checked = false;
        document.querySelector("input[name=earthquake]").checked = false;
        document.getElementById("earthquakeSettings").style.display = "none";
        document.getElementById("showing-label").style.display = "none";
        document.getElementById("weatherMenu").style.display = "block";
        document.getElementsByClassName("duration")[0].style.display = "block";
        document.getElementById("submit").style.display = "block";
        document.querySelector("input[name=other]").checked = false;
        let weatherMenu = document.getElementById("weatherMenu");
        document.getElementById("event-form").style.display = "none";
        while (weatherMenu.firstChild) {
          weatherMenu.removeChild(weatherMenu.firstChild);
        }
        let message = document.createElement("p");
        message.textContent = "Select a date";
        weatherMenu.appendChild(message);
      }
    } else if (checkbox.name === "flood") {
      checkArray.find((obj) => obj.type === "flood").checked = this.checked;
      if (this.checked) {
        document.querySelector("input[name=earthquake]").checked = false;
        document.querySelector("input[name=storm]").checked = false;
        document.querySelector("input[name=other]").checked = false;
        checkArray.find((obj) => obj.type === "earthquake").checked = false;
        checkArray.find((obj) => obj.type === "storm").checked = false;
        document.getElementById("earthquakeSettings").style.display = "none";
        document.getElementsByClassName("duration")[0].style.display = "none";
        document.getElementById("showing-label").style.display = "none";
        document.getElementById("selectLastFloods").style.display = "block";
        document.getElementById("weatherMenu").style.display = "none";
        document.getElementById("submit").style.display = "block";
        document.getElementById("event-form").style.display = "none";
        clickable = false;
      }
    } else if (checkbox.name === "other") {
      checkArray.find((obj) => obj.type === "other").checked = this.checked;
      if (this.checked) {
        document.querySelector("input[name=earthquake]").checked = false;
        document.querySelector("input[name=storm]").checked = false;
        document.querySelector("input[name=flood]").checked = false;
        checkArray.find((obj) => obj.type === "earthquake").checked = false;
        checkArray.find((obj) => obj.type === "storm").checked = false;
        checkArray.find((obj) => obj.type === "flood").checked = false;
        document.getElementById("earthquakeSettings").style.display = "none";
        document.getElementsByClassName("duration")[0].style.display = "none";
        document.getElementById("showing-label").style.display = "none";
        document.getElementById("selectLastFloods").style.display = "none";
        document.getElementById("weatherMenu").style.display = "none";
        document.getElementById("submit").style.display = "block";
        clickable = false;
        let event_form = document.getElementById("event-form");
        event_form.style.display = "block";
      }
    }
  });
});

function addFloodMarkers() {
  let nr = document.getElementById("quantity").value;
  fetch("https://environment.data.gov.uk/flood-monitoring/id/floodAreas")
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < nr; i++) {
        let lat = data.items[i].lat;
        let long = data.items[i].long;
        let riverOrSea = data.items[i].riverOrSea;
        let county = data.items[i].county;

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<p>River/sea: ${riverOrSea}</p>
           <p>County: ${county}</p>`
        );

        const marker = new mapboxgl.Marker({ scale: "0.75" })
          .setLngLat([long, lat])
          .setPopup(popup)
          .addTo(map);
        floodMarkers.push(marker);
      }
    });

  fetch("http://localhost:4001?table=Floods")
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        let lat = data[i].latitude;
        let long = data[i].longitude;
        let location = data[i].location;
        let waterbodyname = data[i].waterbodyname;
        let startdate = data[i].startdate;
        let enddate = data[i].enddate;
        let details = data[i].details;
        let description = data[i].description;
        let userid = data[i].userid;
        let severity = data[i].severity;

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<p>Location: ${location}</p> 
           <p>Waterbody name: ${waterbodyname}</p>
           <p>Severity: ${severity}</p>
           <p>Start time: ${startdate}</p>
           <p>End time: ${enddate}</p>
           <p>Details: ${details}</p>
           <p>Description: ${description}</p>
           <p>Posted by: ${userid}</p>`
        );

        const marker = new mapboxgl.Marker({ color: "green", scale: "0.75" })
          .setLngLat([long, lat])
          .setPopup(popup)
          .addTo(map);
        floodMarkers.push(marker);
      }
    });
}

function showFloodPictures() {
  const eventsNode = document.getElementById("events");
  while (eventsNode.firstChild) {
    eventsNode.removeChild(eventsNode.lastChild);
  }

  fetch("http://localhost:4001?table=Floods")
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        let lat = data[i].latitude;
        let long = data[i].longitude;
        let location = data[i].location;
        let waterbodyname = data[i].waterbodyname;
        let startdate = data[i].startdate;
        let enddate = data[i].enddate;
        let details = data[i].details;
        let description = data[i].description;
        let userid = data[i].userid;
        let severity = data[i].severity;

        let events = document.getElementById("events");

        let event = document.createElement("div");
        event.classList.add("slide");

        event.innerHTML = `<div class="slide-details">
          <p>${waterbodyname}</p>
          <div class="slide-subheading">
            <p style="font-size: 11px">Severity: ${severity}</p>
          </div>
          <div class="slide-place">
            <svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 0 24 24" width="12px" fill="#fff"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            ${location}
          </div>
          <p style="font-size: 13px">${startdate.substring(0, 10)}</p>
          <p style="font-size: 13px">${enddate.substring(0, 10)}</p>
        </div>`;

        events.appendChild(event);

        const img = document.createElement("img");
        img.src = `https://api.mapbox.com/v4/mapbox.satellite/${long},${lat},7/360x200@2x.png?access_token=${TOKEN}`;
        img.alt = location;

        event.appendChild(img);

        events.appendChild(event);
      }
    });

  fetch("https://environment.data.gov.uk/flood-monitoring/id/floodAreas")
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < document.getElementById("quantity").value; i++) {
        let place = data.items[i].eaAreaName;

        let coords = [data.items[i].long, data.items[i].lat];

        let event = document.createElement("div");
        event.classList.add("slide");

        event.innerHTML = `<div class="slide-details"><div class="slide-subheading"></div><div class="slide-place"><svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 0 24 24" width="12px" fill="#fff"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>${place}</div></div>`;

        let events = document.getElementById("events");

        events.appendChild(event);

        const img = document.createElement("img");
        img.src = `https://api.mapbox.com/v4/mapbox.satellite/${coords[0]},${coords[1]},7/360x200@2x.png?access_token=${TOKEN}`;
        img.alt = place;

        event.appendChild(img);

        events.appendChild(event);
      }
    });
}

function removeFloodMarkers() {
  for (let i = 0; i < floodMarkers.length; i++) {
    floodMarkers[i].remove();
  }
}

var cityMarkers = [];
function addCities(start, end) {
  fetch(
    `https://graphical.weather.gov/xml/sample_products/browser_interface/ndfdXMLclient.php?listCitiesLevel=1`
  )
    .then((response) => response.text())
    .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
    .then((data) => {
      let cityLatLong = data.getElementsByTagName("latLonList")[0];
      let cityCoords = cityLatLong.textContent.split(" ");
      let cityName = data.getElementsByTagName("cityNameList")[0];
      let cityNames = cityName.textContent.split("|");

      const eventsNode = document.getElementById("events");
      while (eventsNode.firstChild) {
        eventsNode.removeChild(eventsNode.lastChild);
      }

      for (let i = 0; i < cityCoords.length; i++) {
        let lat = cityCoords[i].split(",")[0];
        let long = cityCoords[i].split(",")[1];

        let url = `https://graphical.weather.gov/xml/sample_products/browser_interface/ndfdXMLclient.php?gmlListLatLon=${lat},${long}&featureType=Forecast_Gml2Point&begin=${start}T00:00:00&end=${end}T00:00:00&compType=Between&propertyName=maxt,wx`;
        fetch(url)
          .then((response) => response.text())
          .then((str) =>
            new window.DOMParser().parseFromString(str, "text/xml")
          )
          .then((data) => {
            let temp = data
              .getElementsByTagName("gml:featureMember")[0]
              .getElementsByTagName("app:Forecast_Gml2Point")[0]
              .getElementsByTagName("app:maximumTemperature")[0];
            let forecast = data
              .getElementsByTagName("gml:featureMember")[0]
              .getElementsByTagName("app:Forecast_Gml2Point")[0]
              .getElementsByTagName("app:weatherPhrase")[0];
            let validTime = data
              .getElementsByTagName("gml:featureMember")[0]
              .getElementsByTagName("app:Forecast_Gml2Point")[0]
              .getElementsByTagName("app:validTime")[0];
            let time = validTime.textContent.split("T")[1];
            let date = validTime.textContent.split("T")[0];

            if (forecast === undefined) {
              let forecastFix = document.createElement("p");
              forecastFix.innerHTML = "No forecast";
              forecast = forecastFix;
            }

            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<p>City: ${cityNames[i]}</p>
               <p>Maximum temperature: ${
                 ((parseFloat(temp.textContent) - 32) / 1.8)
                   .toFixed(0)
                   .toString() + "C\u00B0"
               }</p>
               <p>Forecast: ${forecast.textContent}</p>
               <p>Time: ${time}</p>
               <p>Date: ${date}</p>`
            );

            let settings = '{"color":"","scale":""}';
            settings = JSON.parse(settings);
            if (forecast.textContent === "Thunderstorm") {
              settings.color = "red";
            }
            settings.scale = "0.75";
            const marker = new mapboxgl.Marker(settings)
              .setLngLat([long, lat])
              .setPopup(popup)
              .addTo(map);
            cityMarkers.push(marker);

            let events = document.getElementById("events");

            let event = document.createElement("div");

            event.classList.add("slide");

            event.innerHTML = `<div class="slide-details"><p>${time}</p><div class="slide-subheading"><p style="font-size: 13px;">Maximum temperature:
             ${
               ((parseFloat(temp.textContent) - 32) / 1.8)
                 .toFixed(0)
                 .toString() + "C\u00B0"
             }</p><p style="font-size: 13px;">${date}</p></div><div class="slide-place"><svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 0 24 24" width="12px" fill="#fff"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>${
              cityNames[i]
            }</div></div>`;

            events.appendChild(event);

            const img = document.createElement("img");
            img.src = `https://api.mapbox.com/v4/mapbox.satellite/${long},${lat},7/360x200@2x.png?access_token=${TOKEN}`;
            img.alt = cityNames[i];

            event.appendChild(img);

            events.appendChild(event);
          });
      }
    });

  let startSplit = String(start).split("-");
  let endSplit = String(end).split("-");
  start = startSplit[2] + startSplit[1] + startSplit[0];
  end = endSplit[2] + endSplit[1] + endSplit[0];
  fetch(
    `http://localhost:4001/?table=Weather&starttime=${start}&endtime=${end}`
  )
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        let lat = data[i].latitude;
        let long = data[i].longitude;
        let weatherevent = data[i].event;
        let location = data[i].location;
        let startdate = data[i].startdate;
        let enddate = data[i].enddate;
        let details = data[i].details;
        let description = data[i].description;
        let userid = data[i].userid;

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<p>Event: ${weatherevent}</p> 
           <p>Location: ${location}</p>
           <p>Start time: ${startdate}</p>
           <p>End time: ${enddate}</p>
           <p>Details: ${details}</p>
           <p>Description: ${description}</p>
           <p>User ID: ${userid}</p>`
        );

        const marker = new mapboxgl.Marker({ color: "blue", scale: "0.75" })
          .setLngLat([long, lat])
          .setPopup(popup)
          .addTo(map);
        cityMarkers.push(marker);

        let events = document.getElementById("events");

        let event = document.createElement("div");

        event.classList.add("slide");

        event.innerHTML = `<div class="slide-details">
        <p>${weatherevent}</p>
        <div class="slide-subheading">
        <p style="font-size: 13px;">${description}</p>
        </div>
        <div class="slide-place">
        <svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 0 24 24" width="12px" fill="#fff"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        ${location}
        </div>
        <p style="font-size: 13px">${startdate.substring(0, 10)}</p>
        <p style="font-size: 13px">${enddate.substring(0, 10)}</p>
        </div>`;

        events.appendChild(event);

        const img = document.createElement("img");
        img.src = `https://api.mapbox.com/v4/mapbox.satellite/${long},${lat},7/360x200@2x.png?access_token=${TOKEN}`;
        img.alt = location;

        event.appendChild(img);

        events.appendChild(event);
      }
    });
}

function removeCities() {
  for (let i = 0; i < cityMarkers.length; i++) {
    cityMarkers[i].remove();
  }
}

var earthquakeMarkers = [];
function addUserEarthquakes(start, end) {
  fetch(
    `http://localhost:4001?table=Earthquakes&starttime=${start}&endtime=${end}`
  )
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        let lat = data[i].latitude;
        let long = data[i].longitude;
        let location = data[i].location;
        let magnitude = data[i].magnitude;
        let startdate = data[i].startdate;
        let enddate = data[i].enddate;
        let details = data[i].details;
        let userid = data[i].userid;
        let time = data[i].time;
        let description = data[i].description;

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<p>Location: ${location}</p> 
           <p>Magnitude: ${magnitude}</p>
           <p>Start time: ${startdate}</p>
           <p>End time: ${enddate}</p>
           <p>Time: ${time}</p>
           <p>Description: ${description}</p>
           <p>User: ${userid}</p>`
        );

        const marker = new mapboxgl.Marker({ color: "brown", scale: "0.75" })
          .setLngLat([long, lat])
          .setPopup(popup)
          .addTo(map);
        earthquakeMarkers.push(marker);

        let events = document.getElementById("events");

        let event = document.createElement("div");

        event.classList.add("slide");

        event.innerHTML = `<div class="slide-details">
        <p>M ${magnitude}</p>
        <div class="slide-subheading">
        <p style="font-size: 13px;">${description}</p>
        </div>
        <div class="slide-place">
        <svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 0 24 24" width="12px" fill="#fff"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        ${location}
        </div>
        <p style="font-size: 13px">${startdate.substring(0, 10)}</p>
        <p style="font-size: 13px">${enddate.substring(0, 10)}</p>
        </div>`;

        events.appendChild(event);

        const img = document.createElement("img");
        img.src = `https://api.mapbox.com/v4/mapbox.satellite/${long},${lat},7/360x200@2x.png?access_token=${TOKEN}`;
        img.alt = location;

        event.appendChild(img);

        events.appendChild(event);
      }
    });
}

function convertPolygonToGeoJson(polygon) {
  // polygon: '47.1808,28.0529 47.7237,28.0529 47.7237,28.9424 47.1808,28.9424 47.1808,28.0529',
  let polygonGeoJson = {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [[]],
    },
  };

  let polygonArray = polygon.split(" ");
  polygonArray.forEach((coordinate) => {
    let coordinateArray = coordinate.split(",");
    polygonGeoJson.geometry.coordinates[0].push([
      parseFloat(coordinateArray[1]),
      parseFloat(coordinateArray[0]),
    ]);
  });

  return polygonGeoJson;
}

function convertPointToGeoJson(point) {
  // point: '47.1808,28.0529',
  let pointGeoJson = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [],
    },
  };

  let pointArray = point.split(",");
  pointGeoJson.geometry.coordinates.push(parseFloat(pointArray[1]));
  pointGeoJson.geometry.coordinates.push(parseFloat(pointArray[0]));

  return pointGeoJson;
}

let eventMarkers = [];
function showOtherEvents(queryparams) {
  console.log(queryparams);
  fetch(
    `http://localhost:4003?start=${queryparams["start-date-event"]}&end=${queryparams["end-date-event"]}&urgency=${queryparams.urgency}&category=${queryparams.category}`
  )
    .then((response) => response.json())
    .then((data) => {
      let put = false;
      for (let i = 0; i < data.length; i++) {
        let polygon = data[i].polygon;
        console.log(polygon);
        let coords = String(polygon).split(" ");
        let identifier = data[i].sender;
        let eventtype = data[i].eventtype;
        let urgency = data[i].urgency;
        let category = data[i].category;
        let severity = data[i].severity;
        let sent = data[i].sent;
        let expires = data[i].expires;

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<p>Category: ${category}</p>
           <p>Event type: ${eventtype}</p>
           <p>Urgency: ${urgency}</p>
           <p>Severity: ${severity}</p>
           <p>Posted by: ${identifier}</p>`
        );

        console.log(coords);
        for (let j = 0; j < coords.length; j++) {
          let lng = coords[j].split(",")[1];
          let lat = coords[j].split(",")[0];
          // const marker = new mapboxgl.Marker({ "color": "green", "scale": "0.75" })
          //   .setLngLat([lng, lat])
          //   .setPopup(popup)
          //   .addTo(map);
          // eventMarkers.push(marker);

          if (!put) {
            put = true;
            let events = document.getElementById("events");

            let event = document.createElement("div");

            event.classList.add("slide");

            event.innerHTML = `<div class="slide-details">
            <p>Urgency: ${urgency}</p>
            <div class="slide-subheading">
            <p style="font-size: 13px;">Severity: ${severity}</p>
            </div>
            <div class="slide-place">
            <svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 0 24 24" width="12px" fill="#fff"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            ${eventtype}
            </div>
            <p style="font-size: 13px">${sent.substring(0, 10)}</p>
            <p style="font-size: 13px">${expires.substring(0, 10)}</p>
            </div>`;

            events.appendChild(event);

            const img = document.createElement("img");
            img.src = `https://api.mapbox.com/v4/mapbox.satellite/${lng},${lat},7/360x300@2x.png?access_token=${TOKEN}`;
            img.alt = category;

            event.appendChild(img);

            events.appendChild(event);
          }
        }
      }

      let geoJson = {
        type: "FeatureCollection",
        features: [],
      };

      // for (let i = 0; i < data.length; i++) {
      geoJson.features.push(convertPolygonToGeoJson(data[0].polygon));

      console.log(JSON.stringify(convertPolygonToGeoJson(data[0].polygon)));

      geoJson.features.push(convertPolygonToGeoJson(data[0].polygon));
      geoJson.features.push(convertPointToGeoJson(data[0].shelterlocation));

      map.addSource("events", {
        type: "geojson",
        data: geoJson,
      });

      map.addLayer({
        id: "area-event",
        type: "fill",
        source: "events",
        paint: {
          "fill-color": "#ff0000",
          "fill-opacity": 0.4,
        },
        filter: ["==", "$type", "Polygon"],
      });

      map.addLayer({
        id: "shelters",
        type: "circle",
        source: "events",
        paint: {
          "circle-radius": 6,
          "circle-color": "#00ff00",
        },
        filter: ["==", "$type", "Point"],
      });
    });
}

function removeOtherEvents()
{
  if (map.getLayer('shelters')) {
    map.removeLayer('shelters');
  }

  if (map.getLayer('area-event')) {
    map.removeLayer('area-event');
  }

  if (map.getSource('events')) {
    map.removeSource('events');
  }
}

// Initialize mapbox popup
const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
});

function setErrorMessage(message) {
  var errMsg = document.getElementById("errorMessage");
  errMsg.textContent = message;
}

// Function to add popup for earthquakes
function addPopup(source, showTimeAgo) {
  map.on("mouseenter", source, (e) => {
    map.getCanvas().style.cursor = "pointer";

    let coordinates = e.features[0].geometry.coordinates.slice();
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // For each earthquakes show magnitude, place and time
    if (source === "earthquakes") {
      let mag = e.features[0].properties.mag
        ? e.features[0].properties.mag.toFixed(1)
        : "";
      let place = e.features[0].properties.place
        ? e.features[0].properties.place
        : "";
      let time = e.features[0].properties.time
        ? new Date(e.features[0].properties.time)
        : "";

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
                            <strong>${moment(time).format("dddd LT")}</strong>
                            <strong>${moment(time).format(
                              "DD/MM/YYYY"
                            )}</strong>
                        </span>
                    </div>`
          )
          .addTo(map);
      }
    }
  });

  map.on("mouseleave", source, () => {
    map.getCanvas().style.cursor = "";
    popup.remove();
  });
}

function displayEvents(url) {
  document.getElementById("events").innerHTML = "";
  console.log(url);
  // Recent five earthquakes
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < 15; i++) {
        let coords = data.features[i].geometry.coordinates;
        let place = data.features[i].properties.place;
        let datetime = new Date(data.features[i].properties.time);
        let time = moment(datetime).format("LT");
        let date = moment(datetime).format("DD/MM/YYYY");
        let mag = `M ${data.features[i].properties.mag.toFixed(1)}`;

        let events = document.getElementById("events");

        let event = document.createElement("div");

        event.classList.add("slide");

        event.innerHTML = `<div class="slide-details"><p>${time}</p><div class="slide-subheading"><p>${mag}</p><p>${date}</p></div><div class="slide-place"><svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 0 24 24" width="12px" fill="#fff"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>${place}</div></div>`;

        events.appendChild(event);

        const img = document.createElement("img");
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
    label_text = `${date1.format("DD/MM/YYYY")} to ${date2.format(
      "DD/MM/YYYY"
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
    fetch(geojson.replace("/query?", "/count?")).catch((error) =>
      console.log(error)
    );
  }

  // Show label_text in the menu
  document.querySelector("#showing-label p").textContent = label_text;

  if (map.getLayer("earthquakes")) {
    map.removeLayer("earthquakes");
  }

  if (map.getSource("earthquakes")) {
    map.removeSource("earthquakes");
  }
  // Add earthquakes source
  map.addSource("earthquakes", {
    type: "geojson",
    data: geojson,
  });

  // Add earthquakes layer of type circle and interpolate circle color, radius w.r.t magnitude
  map.addLayer({
    id: "earthquakes",
    type: "circle",
    source: "earthquakes",
    paint: {
      "circle-blur": 0.3,
      "circle-color": [
        "interpolate",
        ["linear"],
        ["get", "mag"],
        2,
        "#fca31d",
        4,
        "#fc691d",
        6,
        "#fc1d1d",
      ],
      "circle-opacity": 0.5,
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["get", "mag"],
        2,
        4,
        6,
        7,
        10,
        10,
      ],
      "circle-stroke-color": [
        "interpolate",
        ["linear"],
        ["get", "mag"],
        2,
        "#fca31d",
        4,
        "#fc691d",
        6,
        "#fc1d1d",
      ],
      "circle-stroke-width": 1,
    },
  });

  // Add popup for earthquakes
  addPopup("earthquakes", showTimeAgo);

  // Display latest earthquakes
  displayEvents(geojson);
}

// Function to remove earthquakes in map
function removeEarthquakes() {
  if (map.getSource("earthquakes") && map.getLayer("earthquakes")) {
    map.removeLayer("earthquakes");
    map.removeSource("earthquakes");
  }

  for (let i = 0; i < earthquakeMarkers.length; i++) {
    earthquakeMarkers[i].remove();
  }
}

function setCheckElement(type) {
  document.getElementById(type).checked = true;
  var typeCheck = checkArray.find((obj) => obj.type === type);
  typeCheck.checked = true;
}

function getCurrentDay() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + mm + yyyy;

  return today;
}

function getCurrentDayAMonthAgo() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var yyyy = today.getFullYear();
  var mm = String(today.getMonth()).padStart(2, "0"); //January is 0!
  if (mm === "00") {
    mm = "12";
    yyyy = yyyy - 1;
  }
  today = dd + mm + yyyy;

  return today;
}

// Load tilesets(tectonic plates, Global Seismic Network, Orogens & Volcanoes) on map load
map.on("load", () => {
  // Add earthquakes
  addEarthquakes(url, true);
  addUserEarthquakes(getCurrentDayAMonthAgo(), getCurrentDay());
  document.getElementById("selectLastFloods").style.display = "none";
  document.getElementById("weatherMenu").style.display = "none";
  setCheckElement("earthquake");
  loaded.find((obj) => obj.type === "earthquake").loaded = true;
});

// Toggle tilesets on/off in map idle state
map.on("idle", () => {
  // Remove loading screen after Map fully loaded
  if (!isFullyLoaded) {
    document
      .querySelector(".overlay")
      .parentNode.removeChild(document.querySelector(".overlay"));
    console.log("Map is Fully Loaded!");
    isFullyLoaded = true;
  }
});

// Get earthquakes in specific date and magnitude range in map idle state
map.on("idle", () => {
  // Submitted date and magnitude validation
  document.querySelector("form").addEventListener("submit", (e) => {
    const data = Object.fromEntries(new FormData(e.target).entries());
    e.preventDefault();
    const today = new Date();
    date1 = moment(data.start, "YYYY-MM-DD");
    date2 = moment(data.end, "YYYY-MM-DD");
    const range1 = moment("1800-01-01", "YYYY-MM-DD");
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

    if (
      (data.start && data.end && isDateValid) ||
      checkArray.find((obj) => obj.type === "flood").checked ||
      checkArray.find((obj) => obj.type === "other").checked ||
      checkArray.find((obj) => obj.type === "storm").checked
    ) {
      var checkedSomething = false;
      setErrorMessage("");
      for (let i = 0; i < loaded.length; i++) {
        if (loaded[i].type === "earthquake" && loaded[i].loaded) {
          removeEarthquakes();
          loaded.find((obj) => obj.type === "earthquake").loaded = false;
        } else if (loaded[i].type === "flood" && loaded[i].loaded) {
          removeFloodMarkers();
          loaded.find((obj) => obj.type === "flood").loaded = false;
        } else if (loaded[i].type === "storm" && loaded[i].loaded) {
          removeCities();
          loaded.find((obj) => obj.type === 'storm').loaded = false;
        } else if (loaded[i].type === 'other' && loaded[i].loaded) {
          removeOtherEvents();
          loaded.find((obj) => obj.type === 'other').loaded = false;
        }
      }
      for (let i = 0; i < checkArray.length; i++) {
        var checkElement = checkArray[i];
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
            addEarthquakes(url, false);
            let startSplit = String(data.start).split("-");
            let endSplit = String(data.end).split("-");
            let start = startSplit[2] + startSplit[1] + startSplit[0];
            let end = endSplit[2] + endSplit[1] + endSplit[0];
            addUserEarthquakes(start, end);
            checkedSomething = true;
            document.getElementById("earthquakeSettings").style.display =
              "block";
            loaded.find((obj) => obj.type === "earthquake").loaded = true;
          } else if (checkElement.type == "flood") {
            addFloodMarkers();
            showFloodPictures();
            checkedSomething = true;
            loaded.find((obj) => obj.type === "flood").loaded = true;
          } else if (checkElement.type === "storm") {
            checkedSomething = true;
            loaded.find((obj) => obj.type === "storm").loaded = true;
            console.log("storm selected");
            if (date2.isBefore(range2)) {
              setErrorMessage("Cannot show forcast in the past");
            } else addCities(data.start, data.end);
          } else if (checkElement.type === "other") {
            console.log(data);
            checkedSomething = true;
            loaded.find((obj) => obj.type === "other").loaded = true;
            let json =
              '{"start-date-event":"","end-date-event":"","urgency":"","category":""}';
            json = JSON.parse(json);
            json["start-date-event"] = data["start-date-event"];
            json["end-date-event"] = data["end-date-event"];
            json.urgency = data["urgency-event"];
            json.category = data.category;
            console.log(json);
            const eventsNode = document.getElementById("events");
            while (eventsNode.firstChild) {
              eventsNode.removeChild(eventsNode.lastChild);
            }
            showOtherEvents(json);
          }
        }
      }
      if (!checkedSomething) {
        setErrorMessage("Please check something");
      }
    } else {
      setErrorMessage("Please select a valid date");
      document.getElementById("start-date").value = "";
      document.getElementById("end-date").value = "";
      document.getElementById("min-mag").value = "";
      document.getElementById("max-mag").value = "";
    }
  });
});
