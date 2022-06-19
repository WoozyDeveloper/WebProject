const http = require("http");

const querystring = require("query-string");

const hostname = "127.0.0.1";
const port = 4002;

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  res.statusCode = 200;
  const urlSearchParams = querystring.parseUrl(req.url);
  const params = urlSearchParams.query;
  console.log(urlSearchParams);
  console.log(req.method);

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method == "GET") {
    console.log("GET");
    res.setHeader("Content-Type", "application/json");
    getInfo(params, function (response) {
      res.end(JSON.stringify(response));
    });
  } else if (req.method == "POST") {
    console.log("POST");
    var body = "";
    req.on("data", function (data) {
      body += data;
      console.log(data);
      console.log("Partial body: " + body);
    });
    req.on("end", function () {
      console.log("Body: " + body);
      res.writeHead(200, { "Content-Type": "application/json" });
      postInfo(JSON.parse(body), function (response) {
        res.end(JSON.stringify(response));
      });
    });
  } else if (req.method == "PATCH" && req.url.includes("updateUsername")) {
    console.log("DAU PATCH");
    var body = "";
    req.on("data", function (data) {
      body += data;
      console.log("DADADA " + JSON.stringify(body));
    });

    req.on("end", function () {
      body = JSON.parse(body);
      console.log("BODY=" + body);
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      updateUsername(body.username, body.id, function (response) {
        res.end(JSON.stringify(response));
      });
    });
  } else if (req.method == "PATCH" && req.url.includes("updateEmail")) {
    console.log("DAU CU EMAIL");
    var body = "";
    req.on("data", function (data) {
      body += data;
      console.log("DADADA " + JSON.stringify(body));
    });
    req.on("end", function () {
      body = JSON.parse(body);
      console.log("BODY=" + body);
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      console.log("m1 " + body.email + " id " + body.id);
      updateEmail(body.email, body.id, function (response) {
        res.end(JSON.stringify(response));
      });
    });
  }
});

function updateEmail(email, uid, callback) {
  const { Pool } = require("pg");
  //const connectionString = 'postgres://ennfzieu:km1vCgMmJ3E__AlpbWFf7ueZuVh-lT8_@abul.db.elephantsql.com/ennfzieu'
  const pool = new Pool({
    //connectionString,
    user: "postgres",
    host: "164.92.194.239",
    database: "postgres",
    port: 5432,
  });
  (async () => {
    const client = await pool.connect();
    try {
      const validateEmail = await client.query({
        text: `SELECT EMAIL FROM USERS WHERE EMAIL=$1`,
        values: [email],
      });

      console.log("m " + email + " id " + uid);
      if (validateEmail.rowCount === 0) {
        const check = await client.query({
          text: `UPDATE USERS SET EMAIL=$1 WHERE ID=$2`,
          values: [email, uid],
        });
        console.log("check=" + check);
        response = {
          status: "updated user",
        };
        console.log("USER UPDATE REQUESTED!!!");
      } else {
        response = {
          status: "user not updated",
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

function updateUsername(usr, userid, callback) {
  const { Pool } = require("pg");
  //const connectionString = 'postgres://ennfzieu:km1vCgMmJ3E__AlpbWFf7ueZuVh-lT8_@abul.db.elephantsql.com/ennfzieu'
  const pool = new Pool({
    //connectionString,
    user: "postgres",
    host: "164.92.194.239",
    database: "postgres",
    port: 5432,
  });
  (async () => {
    const client = await pool.connect();
    try {
      const check = await client.query({
        text: `UPDATE USERS SET USERNAME=$1 WHERE ID=$2`,
        values: [usr, userid],
      });
      if (check) {
        response = {
          status: "updated user",
        };
      } else {
        response = {
          status: "failed update",
        };
      }
      console.log("USER UPDATE REQUESTED!!!");
      return callback(response);
    } finally {
      // Make sure to release the client before any error handling,
      // just in case the error handling itself throws an error.

      client.release();
    }
  })().catch((err) => console.log(err.stack));
}

function getInfo(queryparams, callback) {
  const { Pool } = require("pg");
  //const connectionString = 'postgres://ennfzieu:km1vCgMmJ3E__AlpbWFf7ueZuVh-lT8_@abul.db.elephantsql.com/ennfzieu'
  const pool = new Pool({
    //connectionString,
    user: "postgres",
    host: "164.92.194.239",
    database: "postgres",
    port: 5432,
  });
  (async () => {
    const client = await pool.connect();
    try {
      let keys = Object.keys(queryparams);
      let table = queryparams.table;
      let res;
      for (let i = 0; i < keys.length; i++) {
        if (queryparams[keys[i]] != null && keys[i] !== "table") {
          console.log(
            `select * from ${table} where ${keys[i]}='${queryparams[keys[i]]}'`
          );
          res = await client.query({
            text: `select * from ${table} where ${keys[i]}=$1`,
            values: [queryparams[keys[i]]],
          });
          i = keys.length + 1;
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

function postInfo(queryparams, callback) {
  const { Pool } = require("pg");
  //const connectionString = 'postgres://ennfzieu:km1vCgMmJ3E__AlpbWFf7ueZuVh-lT8_@abul.db.elephantsql.com/ennfzieu'
  const pool = new Pool({
    //connectionString,
    user: "postgres",
    host: "164.92.194.239",
    database: "postgres",
    port: 5432,
  });
  (async () => {
    const client = await pool.connect();
    try {
      let operation = queryparams.operation;
      if (operation === "replace") {
        let res;
        let userid = queryparams.userid;
        let preferenceid = queryparams.preferenceid;
        let keys = Object.keys(queryparams);
        let table = queryparams.table;
        for (let i = 0; i < keys.length; i++) {
          if (
            queryparams[keys[i]] != null &&
            keys[i] !== "table" &&
            keys[i] !== "preferenceid" &&
            keys[i] !== "operation"
          ) {
            console.log(
              `update ${table} set ${keys[i]}='${
                queryparams[keys[i]]
              }' where preferenceid=${preferenceid}`
            );
            res = await client.query({
              text: `update ${table} set ${keys[i]} = '${
                queryparams[keys[i]]
              }' where preferenceid=$1`,
              values: [preferenceid],
            });
          }
        }
      } else if (operation === "add") {
        let table = queryparams.table;
        let userid = queryparams.userid;
        let location = queryparams.location;
        let eventtype = queryparams.eventtype;
        let latitude = queryparams.latitude;
        let longitude = queryparams.longitude;
        let notificationmethod = queryparams.notificationmethod;
        let preferenceid = await client.query({
          text: `select max(preferenceid)+1 as "id" from UserPreferences`,
        });
        let res = await client.query({
          text: `insert into ${table}(userid,location,eventtype,latitude,longitude,notificationmethod,preferenceid)
                        values($1,$2,$3,$4,$5,$6,$7)`,
          values: [
            userid,
            location,
            eventtype,
            latitude,
            longitude,
            notificationmethod,
            preferenceid.rows[0].id,
          ],
        });
      }
      response = '{"executed":"yes"}';
      return callback(JSON.parse(response));
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
