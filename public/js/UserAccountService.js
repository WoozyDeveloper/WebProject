const { parse } = require('querystring');
const http = require('http');
const bcrypt = require('bcrypt');
const hostname = 'localhost';
const port = 4000;

//Can be found in the Details page

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const urlSearchParams = new URLSearchParams(req.url);
  const params = Object.fromEntries(urlSearchParams.entries());

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method == 'GET') {
  } else if (req.method == 'POST') {
    if (req.url.includes('register')) {
      var body = '';
      req.on('data', function (data) {
        body += data;
      });

      req.on('end', function () {
        console.log(body);
        body = JSON.parse(body);

        postUser(body, function (response) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(`${JSON.stringify(response)}`);
        });
      });
    } else if (req.url.includes('login')) {
      var body = '';
      req.on('data', function (data) {
        body += data;
      });

      req.on('end', function () {
        body = JSON.parse(body);
        console.log(body);

        checkUser(body, function (response) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(`${JSON.stringify(response)}`);
        });
      });
    }
  }
});

function checkUser(body, callback) {
  let extractedMail = body.email;
  let username = ''; //username-ul il extrag in DB
  let extractedPassword = body.password;
  let response = '';

  const { Pool } = require('pg');
  //const connectionString = 'postgres://ennfzieu:km1vCgMmJ3E__AlpbWFf7ueZuVh-lT8_@abul.db.elephantsql.com/ennfzieu'
  const pool = new Pool({
    //connectionString,
    user: 'postgres',
    host: '157.230.100.116',
    database: 'postgres',
    port: 5432,
  });
  (async () => {
    const client = await pool.connect();
    try {
      const check = await client.query({
        //text: `SELECT * FROM USERS WHERE EMAIL='${extractedMail}' AND PASSWORD='${extractedPassword}'`,
        text: `SELECT * FROM USERS WHERE EMAIL=$1 AND PASSWORD=$2`,
        values: [extractedMail, extractedPassword],
      });

      const result = await client.query({
        text: `SELECT * FROM USERS WHERE EMAIL=$1`,
        values: [extractedMail],
      });

      if (result.rowCount == 1) {
        console.log(body.password);
        console.log(result.rows[0].password);
        console.log(bcrypt.compareSync(body.password, result.rows[0].password));
        if (bcrypt.compareSync(body.password, result.rows[0].password)) {
          console.log(check.rows);
          response = {
            status: 'existent user',
            username: result.rows[0].username,
            email: result.rows[0].email,
            role: result.rows[0].role,
          };
        } else {
          response = {
            status: 'wrong password',
          };
        }
      } else {
        console.log(
          "user doesn't exist:" + extractedMail + ' ' + extractedPassword
        );

        response = {
          status: 'no user found',
        };
      }
      return callback(response);
    } finally {
      // Make sure to release the client before any error handling,
      // just in case the error handling itself throws an error.

      client.release();
    }
  })().catch((err) => console.log(err.stack));
}

function postUser(body, callback) {
  let extractedMail = body.email;
  let extractedUsername = body.username;
  let extractedPassword = body.password;
  let response = '';

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(extractedPassword, salt);

  const { Pool } = require('pg');
  //const connectionString = 'postgres://ennfzieu:km1vCgMmJ3E__AlpbWFf7ueZuVh-lT8_@abul.db.elephantsql.com/ennfzieu'
  const pool = new Pool({
    //connectionString,
    user: 'postgres',
    host: '157.230.100.116',
    database: 'postgres',
    port: 5432,
  });
  (async () => {
    const client = await pool.connect();
    try {
      const check = await client.query({
        rowMode: 'array',
        text: `SELECT * FROM USERS WHERE EMAIL=$1`,
        values: [extractedMail],
      });

      if (check.rowCount == 0) {
        const dim = await client.query({
          rowMode: 'array',
          text: 'SELECT * FROM USERS',
        });
        const res = await client.query({
          rowMode: 'array',
          text: `INSERT INTO USERS VALUES($1,$2,$3,$4)`,
          values: [dim.rowCount + 1, extractedMail, extractedUsername, hash],
        });

        response = {
          status: 'new user',
        };
      } else {
        console.log('email already exists:' + extractedMail);

        response = {
          status: 'user found',
        };
      }
      return callback(response);
    } finally {
      // Make sure to release the client before any error handling,
      // just in case the error handling itself throws an error.

      client.release();
    }
  })().catch((err) => console.log(err.stack));
}

function getUsers(callback) {
  const { Pool } = require('pg');
  //const connectionString = 'postgres://ennfzieu:km1vCgMmJ3E__AlpbWFf7ueZuVh-lT8_@abul.db.elephantsql.com/ennfzieu'
  const pool = new Pool({
    //connectionString,
    user: 'postgres',
    host: '157.230.100.116',
    database: 'postgres',
    port: 5432,
  });
  (async () => {
    const client = await pool.connect();
    try {
      const res = await client.query({
        rowMode: 'array',
        text: 'SELECT * FROM USERS',
      });
      console.log(res.rows);
      return callback(res.rows);
    } finally {
      // Make sure to release the client before any error handling,
      // just in case the error handling itself throws an error.
      client.release();
    }
  })().catch((err) => console.log(err.stack));
}

function mergeGEOJSON(links, callback) {
  var geojsonMerge = require('@mapbox/geojson-merge');

  var mergedGeoJSON = geojsonMerge.merge(links[0], links[1]);

  return callback(mergedGeoJSON);
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
