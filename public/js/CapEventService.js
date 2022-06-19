const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser');

const http = require('http');

const querystring = require('query-string');

const hostname = '127.0.0.1';
const port = 4003;

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
      .on('end', function () {
        console.log('Body: ' + body);

        const parser = new XMLParser();
        let jObj = parser.parse(body);

        let json = JSON.parse(JSON.stringify(jObj))
        console.log(json['cap:alert']['cap:info']['cap:area'])

        res.writeHead(200, { 'Content-Type': 'application/json' });
        //res.end(JSON.stringify(jObj));
        addEvent(JSON.parse(JSON.stringify(jObj)), function (response) { res.end(JSON.stringify(response)); })
      });
  }
  else if (req.method == 'GET') {
    const urlSearchParams = querystring.parseUrl(req.url);
    const params = urlSearchParams.query;
    console.log(params)
    res.writeHead(200, { 'Content-Type': 'application/json' });
    getEvent(params, function (response) { res.end(JSON.stringify(response)); })
  }
});

function addEvent(queryparams, callback) {
  const { Pool } = require('pg')
  //const connectionString = 'postgres://ennfzieu:km1vCgMmJ3E__AlpbWFf7ueZuVh-lT8_@abul.db.elephantsql.com/ennfzieu'
  const pool = new Pool({
    //connectionString,
    user: 'postgres',
    host: '164.92.194.239',
    database: 'postgres',
    port: 5432,
  })
    ; (async () => {
      const client = await pool.connect()
      try {
        let res
        let identifier = queryparams["cap:alert"]["cap:identifier"]
        let sendername = queryparams["cap:alert"]["cap:info"]["cap:senderName"]
        let sender = queryparams["cap:alert"]["cap:sender"]
        let sent = queryparams["cap:alert"]["cap:sent"]
        let instruction = queryparams["cap:alert"]["cap:info"]["cap:instruction"]
        let language = queryparams["cap:alert"]["cap:info"]["cap:language"]
        let shelterLocation = queryparams["cap:alert"]["cap:info"]["cap:area"]["cap:geocode"]["cap:value"]
        let headline = queryparams["cap:alert"]["cap:info"]["cap:headline"]
        let status = queryparams["cap:alert"]["cap:status"]
        let msgType = queryparams["cap:alert"]["cap:msgType"]
        let scope = queryparams["cap:alert"]["cap:scope"]
        let category = queryparams["cap:alert"]["cap:info"]["cap:category"]
        let eventtype = queryparams["cap:alert"]["cap:info"]["cap:event"]
        let urgency = queryparams["cap:alert"]["cap:info"]["cap:urgency"]
        let severity = queryparams["cap:alert"]["cap:info"]["cap:severity"]
        let certainty = queryparams["cap:alert"]["cap:info"]["cap:certainty"]
        let expires = queryparams["cap:alert"]["cap:info"]["cap:expires"]
        let description = queryparams["cap:alert"]["cap:info"]["cap:description"]
        let areaDescription = queryparams['cap:alert']['cap:info']['cap:area']['cap:areaDesc']
        let polygon = queryparams['cap:alert']['cap:info']['cap:area']['cap:polygon']
        res = await client.query({
          text: `insert into Events(category, eventtype, urgency, severity, certainty, description, areadesc,
                      polygon,identifier,sendername,sent,status,msgType,scope,expires, sender, headline, shelterlocation, language, instruction) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,
                      $12,$13,$14,$15,$16,$17,$18,$19,$20)`,
          values: [category, eventtype, urgency, severity, certainty, 
            description, areaDescription, polygon, identifier, sendername, sent, status, msgType, scope, expires, sender, headline,
          shelterLocation, language, instruction]
        })
        console.log(res.rows)
        return callback(res.rows)
      } finally {
        // Make sure to release the client before any error handling,
        // just in case the error handling itself throws an error.
        client.release()
      }
    })().catch(err => console.log(err.stack))
}

function getEvent(queryparams, callback) {
  const { Pool } = require('pg')
  //const connectionString = 'postgres://ennfzieu:km1vCgMmJ3E__AlpbWFf7ueZuVh-lT8_@abul.db.elephantsql.com/ennfzieu'
  const pool = new Pool({
    //connectionString,
    user: 'postgres',
    host: '164.92.194.239',
    database: 'postgres',
    port: 5432,
  })
    ; (async () => {
      const client = await pool.connect()
      try {
        let start = queryparams.start
        let end = queryparams.end
        let category = queryparams.category
        let urgency = queryparams.urgency
        console.log(`select * from events where sent>=${start} and expires<=${end} and category=${category} and urgency=${urgency}`)
        let res = await client.query({
          text: `select * from events where sent>=$1 and expires>=$2 and category=$3 and urgency=$4`,
          values: [start, end, category, urgency]
        })
        console.log(res.rows)
        return callback(res.rows)
      } finally {
        // Make sure to release the client before any error handling,
        // just in case the error handling itself throws an error.
        client.release()
      }
    })().catch(err => console.log(err.stack))
}



server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
