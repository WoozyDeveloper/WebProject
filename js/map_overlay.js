import TOKEN from '../config.js';

// Open and close menu
document.getElementById('toggle-menu').addEventListener('click', () => {
  document.getElementById('full-menu').classList.replace('inactive', 'active');
  document
    .getElementById('toggle-menu')
    .classList.replace('active', 'inactive');
  document.getElementById('close').classList.replace('inactive', 'active');
});

document.getElementById('close').addEventListener('click', () => {
  document.getElementById('full-menu').classList.replace('active', 'inactive');
  document.getElementById('close').classList.replace('active', 'inactive');
  document
    .getElementById('toggle-menu')
    .classList.replace('inactive', 'active');
});

// Recent five earthquakes
fetch(
  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'
)
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
