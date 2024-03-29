const nodemailer = require('nodemailer');
const path = require('path');
const http = require('http');
const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser');
const { promisify } = require('util');
const handlebars = require('handlebars');
const fs = require('fs');

const readFile = promisify(fs.readFile);

require('dotenv').config({ path: path.resolve(__dirname, '../..', '.env') });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send the email
function sendEmail(to, subject, text, html) {
  const mailOptions = {
    from: 'noreply@asii.ro',
    to,
    subject,
    text,
    html,
  };
  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

const geoJson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        stroke: '#555555',
        'stroke-width': 2,
        'stroke-opacity': 1,
        fill: '#b33737',
        'fill-opacity': 0.5,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [27.575297355651855, 47.16436280131059],
            [27.57795810699463, 47.16197014838819],
            [27.582077980041504, 47.163108130899104],
            [27.578086853027344, 47.16564661942949],
            [27.575297355651855, 47.16436280131059],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        'marker-color': '#16d436',
        'marker-size': 'medium',
        'marker-symbol': 'campsite',
      },
      geometry: {
        type: 'Point',
        coordinates: [27.57568359375, 47.16094886127813],
      },
    },
  ],
};

// Create a server
const hostname = 'localhost';
const port = 4004;

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  //  POST request.
  if (req.method == 'POST') {
    let body = '';
    req
      .on('data', function (data) {
        body += data;
      })
      .on('end', async function () {
        console.log('Body: ' + body);

        const parser = new XMLParser();
        let jObj = parser.parse(body);

        let emailSubject = jObj['cap:alert']['cap:info']['cap:headline'];
        // let emailHtml = `
        // <p>${emailText}</p>
        // <img width="600" src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l-campsite+285A98(-73.7638,42.6564)/-73.7638,42.6564,13,0/600x300@2x?access_token=pk.eyJ1IjoiYXhlbGxiZW4iLCJhIjoiY2pneHc0a2o2MGlkcTJ3bGxtdHB1cXoycSJ9.BRtJfvAR2e_5nA3irA2KSg&attribution=false&logo=false" alt="Mapbox Map of -73.7638,42.6564">`;
        const htmlPath = path.resolve(
          __dirname,
          '../..',
          'public',
          'pages',
          'notification.html'
        );

        let html = await readFile(htmlPath, 'utf8');
        let template = handlebars.compile(html);

        let areaPolygon =
          jObj['cap:alert']['cap:info']['cap:area']['cap:polygon'];
        let shelter =
          jObj['cap:alert']['cap:info']['cap:area']['cap:geocode']['cap:value'];

        // Parse the polygon to array of points
        let polygon = parsePolygonString(areaPolygon);
        console.log(polygon);

        // Parse the shelter to array of points
        let shelterPoint = parsePointString(shelter);
        console.log(shelterPoint);

        // Modify geoJson to include the polygon and shelter
        geoJson.features[0].geometry.coordinates[0] = polygon;
        geoJson.features[1].geometry.coordinates = shelterPoint;

        let data = {
          headline: emailSubject,
          description: jObj['cap:alert']['cap:info']['cap:description'],
          instruction: jObj['cap:alert']['cap:info']['cap:instruction'],
          image: `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/geojson(${encodeURIComponent(
            JSON.stringify(geoJson)
          )})/auto/600x300@2x?access_token=pk.eyJ1IjoiYXhlbGxiZW4iLCJhIjoiY2pneHc0a2o2MGlkcTJ3bGxtdHB1cXoycSJ9.BRtJfvAR2e_5nA3irA2KSg&attribution=false&logo=false`,
        };

        console.log(data.image);
        let htmlToSend = template(data);

        // Send email to users

        sendEmailTolUsers(emailSubject, htmlToSend, polygon);

        // console.log(jObj);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(jObj));
      });
  }
});

async function sendEmailTolUsers(subject, html, polygon) {
  const { Pool } = require('pg');
  //const connectionString = 'postgres://ennfzieu:km1vCgMmJ3E__AlpbWFf7ueZuVh-lT8_@abul.db.elephantsql.com/ennfzieu'
  const pool = new Pool({
    //connectionString,
    user: 'postgres',
    host: '157.230.100.116',
    database: 'postgres',
    port: 5432,
  });

  const users = await pool.query(
    'select * from userpreferences join users on userpreferences.userid = users.id'
  );

  users.rows.forEach((user) => {
    const latLng = parsePointString(`${user.latitude},${user.longitude}`);

    if (inside(latLng, polygon)) {
      console.log(user.email)
      sendEmail(user.email, subject, '', html);
    }
  });

  // const emails = await pool.query('SELECT email FROM users');
  // console.log(emails.rows);
  // emails.rows.forEach(async (email) => {
  //   sendEmail(email.email, subject, '', html);
  // });
}

function inside(point, vs) {
  // ray-casting algorithm based on
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

  let x = point[0],
    y = point[1];

  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    let xi = vs[i][0],
      yi = vs[i][1];
    let xj = vs[j][0],
      yj = vs[j][1];

    let intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

function parsePolygonString(polygonString) {
  // Parse the polygon to array of points
  let polygon = polygonString.split(' ');
  let polygonPoints = [];
  for (let i = 0; i < polygon.length; i += 1) {
    let point = polygon[i].split(',');
    polygonPoints.push([parseFloat(point[1]), parseFloat(point[0])]);
  }
  return polygonPoints;
}

function parsePointString(pointString) {
  let point = [];
  let shelterArray = pointString.split(',');
  for (let i = 0; i < shelterArray.length; i += 2) {
    point.push(parseFloat(shelterArray[i + 1]));
    point.push(parseFloat(shelterArray[i]));
  }
  return point;
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
