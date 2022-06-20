const http = require('http');

const querystring = require('query-string');

const hostname = 'localhost';
const port = 4001;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  const urlSearchParams = querystring.parseUrl(req.url);
  const params = urlSearchParams.query;

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
    console.log(params);
    let queryparams = '{"type":"","starttime":"","endtime":"","table":""}';
    queryparams = JSON.parse(queryparams);
    if (params.starttime === undefined) {
      // daca nu se specifica timpul atunci se baga o data pentru care vor aparea toate evenimentele
      queryparams.starttime = '01011800';
    } else queryparams.starttime = params.starttime;
    if (params.endtime === undefined) {
      queryparams.endtime = '01012900';
    } else queryparams.endtime = params.endtime;
    queryparams.table = params.table;
    res.setHeader('Content-Type', 'application/json');
    getUserEvents(queryparams, function (response) {
      res.end(`${JSON.stringify(response)}`);
    });
  } else if (req.method == 'POST') {
    console.log('POST');
    var body = '';
    req.on('data', function (data) {
      body += data;
      console.log(data);
      console.log('Partial body: ' + body);
    });
    req.on('end', function () {
      console.log('Body: ' + body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      postUserEvents(JSON.parse(body), function (response) {
        res.end(JSON.stringify(response));
      });
    });
  } else if (req.method == 'DELETE') {
    console.log('DELETE');
    var body = '';
    req.on('data', function (data) {
      body += data;
      console.log(data);
      console.log('Partial body: ' + body);
    });
    req.on('end', function () {
      console.log('Body: ' + body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      deleteUserEvents(JSON.parse(body), function (response) {
        res.end(JSON.stringify(response));
      });
    });
  } else if (req.method == 'PUT') {
    console.log('PUT');
    var body = '';
    req.on('data', function (data) {
      body += data;
      console.log(data);
      console.log('Partial body: ' + body);
    });
    req.on('end', function () {
      console.log('Body: ' + body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      putUserEvents(JSON.parse(body), function (response) {
        res.end(JSON.stringify(response));
      });
    });
  }
});

function getUserEvents(queryparams, callback) {
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
      console.log(queryparams);
      let table = queryparams.table;
      let startdate = queryparams.starttime;
      let enddate = queryparams.endtime;
      let type = queryparams.type;
      let res;
      if (table === 'UserEvents') {
        res = await client.query({
          text: `SELECT * FROM UserEvents where type = $1 and startdate >= to_date($2,'DDMMYYYY') and enddate <= to_date($3,'DDMMYYYY')`,
          values: [type, startdate, enddate],
        });
      } else {
        res = await client.query({
          text: `SELECT * FROM ${table} where startdate >= to_date($1,'DDMMYYYY') and enddate <= to_date($2,'DDMMYYYY') order by startdate desc`,
          values: [startdate, enddate],
        });
      }
      console.log(res.rows);
      return callback(res.rows);
    } finally {
      // Make sure to release the client before any error handling,
      // just in case the error handling itself throws an error.
      client.release();
    }
  })().catch((err) => console.log(err.stack));
}

function postUserEvents(data, callback) {
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
      console.log(data);
      let eventid = data.eventid;
      let location = data.location;
      let latitude = data.latitude;
      let longitude = data.longitude;
      let description = data.description;
      let details = data.details;
      let type = data.type;
      let table = data.table;
      let startdate = data.startdate;
      let enddate = data.enddate;
      let userid = data.userid;
      let res;
      if (table === 'UserEvents') {
        let eventname = data.eventname;
        let eventplacename = data.eventnameplace;

        res = await client.query({
          rowMode: 'array',
          text: `insert into UserEvents(userid, eventid, type, eventname, eventplacename, latitude, longitude, startdate, enddate, details)
                         values($1,$2,$3,$4,$5,$6,$7,TO_DATE($8,'DDMMYYYY'),TO_DATE($9,'DDMMYYYY'),$10)`,
          values: [
            userid,
            eventid,
            type,
            eventname,
            eventplacename,
            latitude,
            longitude,
            startdate,
            enddate,
            details,
          ],
          //values: [1,1,'flood','a','b',1.1,1.2,'13091845','06011923','I saw this in Iasi!'] foloseste pt test
        });
      }
      if (table === 'Floods') {
        let waterbodyname = data.waterbodyname;
        res = await client.query({
          rowMode: 'array',
          text: `insert into Floods(location, waterbodyname, latitude, longitude, description, details, eventid, startdate, enddate,userid, severity) 
                        values($1,$2,$3,$4,$5,$6,$7,TO_DATE($8,'DDMMYYYY'),TO_DATE($9,'DDMMYYYY'),$10,$11)`,
          values: [
            location,
            waterbodyname,
            latitude,
            longitude,
            description,
            details,
            eventid,
            startdate,
            enddate,
            userid,
            severity,
          ],
          //values: [1,1,'flood','a','b',1.1,1.2,'13091845','06011923','I saw this in Iasi!'] foloseste pt test
        });
      } else if (table === 'Earthquakes') {
        let magnitude = data.magnitude;
        let time = data.time;
        res = await client.query({
          rowMode: 'array',
          text: `insert into Earthquakes(eventid,location,enddate,magnitude,latitude,longitude,time,description,details,startdate,userid) 
                        values($1,$2,to_date($3, 'DDMMYYYY'),$4,$5,$6,$7,$8,$9,to_date($10, 'DDMMYYYY'),$11)`,
          values: [
            eventid,
            location,
            enddate,
            magnitude,
            latitude,
            longitude,
            time,
            description,
            details,
            startdate,
            userid,
          ],
          //values: [1,1,'flood','a','b',1.1,1.2,'13091845','06011923','I saw this in Iasi!'] foloseste pt test
        });
      } else if (table === 'Weather') {
        let event = data.event;
        res = await client.query({
          rowMode: 'array',
          text: `insert into Weather(eventid, location, event, latitude, longitude, description, details, startdate, enddate,userid)
                         values($1,$2,$3,$4,$5,$6,$7,to_date($8,'DDMMYYYY'),to_date($9,'DDMMYYYY'),$10)`,
          values: [
            eventid,
            location,
            event,
            latitude,
            longitude,
            description,
            details,
            startdate,
            enddate,
            userid,
          ],
          //values: [1,1,'flood','a','b',1.1,1.2,'13091845','06011923','I saw this in Iasi!'] foloseste pt test
        });
      }
      console.log(res.rows);
      return callback(data);
    } finally {
      // Make sure to release the client before any error handling,
      // just in case the error handling itself throws an error.
      client.release();
    }
  })().catch((err) => console.log(err.stack));
}

function deleteUserEvents(queryparams, callback) {
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
      console.log(queryparams);
      let eventid = queryparams.eventid;
      let table = queryparams.table;
      let res;
      if (table === 'UserEvents') {
        res = await client.query({
          text: `delete from UserEvents where eventid = $1`,
          values: [eventid], //folosim doar prima cheie ca parametru pt delete
        });
      }
      if (table === 'Floods') {
        res = await client.query({
          text: `delete from Floods where eventid = $1`,
          values: [eventid], //folosim doar prima cheie ca parametru pt delete
        });
      } else if (table === 'Earthquakes') {
        res = await client.query({
          text: `delete from Earthquakes where eventid = $1`,
          values: [eventid], //folosim doar prima cheie ca parametru pt delete
        });
      } else if (table === 'Weather') {
        res = await client.query({
          text: `delete from Weather where eventid = $1`,
          values: [eventid], //folosim doar prima cheie ca parametru pt delete
        });
      }
      console.log(res.rows);
      return callback(res.rows);
    } finally {
      // Make sure to release the client before any error handling,
      // just in case the error handling itself throws an error.
      client.release();
    }
  })().catch((err) => console.log(err.stack));
}

function putUserEvents(queryparams, callback) {
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
      let event_id = queryparams.event_id; //MANDATORY!!!!
      let keys = Object.keys(queryparams);
      let table = queryparams.table; //MANDATORY
      console.log(table);
      let res;
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] !== 'event_id' && keys[i] !== 'table') {
          res = await client.query({
            text: `update ${table} set ${keys[i]} = '${
              queryparams[keys[i]]
            }' where eventid=$1`,
            values: [event_id],
          });
        }
      }
      console.log(res.rows);
      return callback(res.rows);
    } finally {
      // Make sure to release the client before any error handling,
      // just in case the error handling itself throws an error.
      client.release();
    }
  })().catch((err) => console.log(err.stack));
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
