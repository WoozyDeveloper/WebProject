const shelterInput = document.getElementById('shelter');
const polygonInput = document.getElementById('polygon');
// const circleInput = document.getElementById('shelter');

const map = L.map('map').setView([46, 24.9668], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '',
}).addTo(map);

// FeatureGroup is to store editable layers
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
const drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems,
    poly: {
      allowIntersection: false,
    },
  },

  draw: {
    position: 'topleft',
    polygon: true,
    polyline: false,
    rectangle: true,
    circle: false,
    marker: true,
    circlemarker: false,
  },
});
map.addControl(drawControl);

// Object created - bind popup to layer, add to feature group
map.on(L.Draw.Event.CREATED, function (event) {
  console.log('Created');
  let layer = event.layer;

  populateInput(layer);
  drawnItems.addLayer(layer);
});

function populateInput(layer) {
  if (layer instanceof L.Marker) {
    shelterInput.value =
      layer.getLatLng().lat.toFixed(4) + ',' + layer.getLatLng().lng.toFixed(4);
    console.log(layer.getLatLng());
  } else if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
    let polygonCoords = '';
    layer.getLatLngs()[0].forEach(function (latlng) {
      polygonCoords +=
        latlng.lat.toFixed(4) + ',' + latlng.lng.toFixed(4) + ' ';
    });
    polygonCoords +=
      layer.getLatLngs()[0][0].lat.toFixed(4) +
      ',' +
      layer.getLatLngs()[0][0].lng.toFixed(4);
    polygonInput.value = polygonCoords;
  }
  // else if (layer instanceof L.Circle) {
  //   circleInput.value =
  //     layer.getLatLng().lat.toFixed(4) + ',' + layer.getLatLng().lng.toFixed(4);
  //   console.log(layer.getLatLng());
  // }
}

map.on(L.Draw.Event.DELETED, function (event) {
  console.log('Deleted');
  shelterInput.value = '';
  polygonInput.value = '';
  // circleInput.value = '';
});

// Form stuff
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get all the values from the form
  let formData = new FormData(form);
  const values = formData.entries();

  // Convert the values to a JSON object
  let json = {};
  for (let [key, value] of values) {
    json[key] = value;
  }

  json['identifier'] = 'urn:oid:fsdf';
  json['sender'] = 'alex@gmail.com';
  json['sent'] = '2020-06-18T02:31:10+03:00';
  json['status'] = 'Actual';
  json['msgType'] = 'Alert';
  json['scope'] = 'Public';
  json['senderName'] = 'Alex';

  /*json['expires'] = '2022-06-20T02:31:10+03:00';*/

  // Convert JSON to CAP XML format

  // Create XML document
  const xmlDoc = document.implementation.createDocument('', '', null);

  // Create root element
  const root = xmlDoc.createElement('cap:alert');
  root.setAttribute('xmlns:cap', 'urn:oasis:names:tc:emergency:cap:1.2');
  xmlDoc.appendChild(root);

  // Create identifier element
  const identifier = xmlDoc.createElement('cap:identifier');
  identifier.innerHTML = json.identifier;
  root.appendChild(identifier);

  // Create sender element
  const sender = xmlDoc.createElement('cap:sender');
  sender.innerHTML = json.sender;
  root.appendChild(sender);

  // Create sent element
  const sent = xmlDoc.createElement('cap:sent');
  var currentdate = new Date();
  var datetime =
    String(currentdate.getFullYear()) +
    '-' +
    String(currentdate.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(currentdate.getDate()).padStart(2, '0') +
    'T' +
    String(currentdate.getHours()).padStart(2, '0') +
    ':' +
    String(currentdate.getMinutes()).padStart(2, '0') +
    ':' +
    String(currentdate.getSeconds()).padStart(2, '0') +
    '+00:00';
  console.log(datetime);
  sent.innerHTML = datetime;
  root.appendChild(sent);

  // Create status element
  const status = xmlDoc.createElement('cap:status');
  status.innerHTML = json.status;
  root.appendChild(status);

  // Create msgType element
  const msgType = xmlDoc.createElement('cap:msgType');
  msgType.innerHTML = json.msgType;
  root.appendChild(msgType);

  // Create scope element
  const scope = xmlDoc.createElement('cap:scope');
  scope.innerHTML = json.scope;
  root.appendChild(scope);

  // Create info element
  const info = xmlDoc.createElement('cap:info');
  root.appendChild(info);

  // Create language element
  const language = xmlDoc.createElement('cap:language');
  language.innerHTML = json.language || 'en';
  info.appendChild(language);

  // Create category element
  const category = xmlDoc.createElement('cap:category');
  category.innerHTML = json.category;
  info.appendChild(category);

  // Create event element
  const event = xmlDoc.createElement('cap:event');
  event.innerHTML = json.event;
  info.appendChild(event);

  // Create urgency element
  const urgency = xmlDoc.createElement('cap:urgency');
  urgency.innerHTML = json.urgency;
  info.appendChild(urgency);

  // Create severity element
  const severity = xmlDoc.createElement('cap:severity');
  severity.innerHTML = json.severity;
  info.appendChild(severity);

  // Create certainty element
  const certainty = xmlDoc.createElement('cap:certainty');
  certainty.innerHTML = json.certainty;
  info.appendChild(certainty);

  // // Create expires element
  const expires = xmlDoc.createElement('cap:expires');
  let string = String(json.expires).split('-');
  json.expires =
    string[0] + '-' + string[1] + '-' + string[2] + 'T' + '00:00:00+00:00';
  expires.innerHTML = json.expires;
  info.appendChild(expires);

  // // Create senderName element
  const senderName = xmlDoc.createElement('cap:senderName');
  senderName.innerHTML = json.senderName;
  info.appendChild(senderName);

  // // Create headline element
  const headline = xmlDoc.createElement('cap:headline');
  headline.innerHTML = json.headline;
  info.appendChild(headline);

  // Create description element
  const description = xmlDoc.createElement('cap:description');
  description.innerHTML = json.description;
  info.appendChild(description);

  // Create instruction element
  const instruction = xmlDoc.createElement('cap:instruction');
  instruction.innerHTML = json.instruction;
  info.appendChild(instruction);

  // Create area element
  const area = xmlDoc.createElement('cap:area');
  info.appendChild(area);

  // Create areaDesc element
  const areaDesc = xmlDoc.createElement('cap:areaDesc');
  areaDesc.innerHTML = json.areaDesc;
  area.appendChild(areaDesc);

  // Create polygon element
  const polygon = xmlDoc.createElement('cap:polygon');
  polygon.innerHTML = json.polygon;
  area.appendChild(polygon);

  // Create geocode element
  const geocode = xmlDoc.createElement('cap:geocode');

  const valueName = xmlDoc.createElement('cap:valueName');
  valueName.innerHTML = 'shelterLocation';
  geocode.appendChild(valueName);

  const value = xmlDoc.createElement('cap:value');
  value.innerHTML = json.shelter;
  geocode.appendChild(value);

  area.appendChild(geocode);

  // Convert the XML document to a string
  const xmlString = new XMLSerializer().serializeToString(xmlDoc);
  console.log(xmlString);

  console.log(json);

  // Send the XML to the server
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:4003');
  xhr.setRequestHeader('Content-Type', 'application/xml');
  xhr.send(xmlString);
});
