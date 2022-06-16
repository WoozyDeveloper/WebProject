const { parse } = require("querystring");

const crypto = require("crypto");
const key = Buffer.from(
  "xNRxA48aNYd33PXaODSutRNFyCu4cAe/InKT/Rx+bw0=",
  "base64"
);
const iv = Buffer.from("81dFxOpX7BPG1UpZQPcS6w==", "base64");

const http = require("http");
const { appendFile } = require("fs");

const hostname = "127.0.0.1";
const port = 4000;

function encrypt_token(data) {
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encryptedData = cipher.update(data, "utf8", "base64");
  return encryptedData;
}

function decrypt_token(data) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  const decripted = decipher.update(data, "base64", "utf8");
  return decripted;
}

var showInBrowser;
const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const urlSearchParams = new URLSearchParams(req.url);
  const params = Object.fromEntries(urlSearchParams.entries());

  if (req.method == "GET") {
  } else if (req.method == "POST") {
    if (req.url.includes("register")) {
      var body = "";
      req.on("data", function (data) {
        body += data;
      });
      req.on("end", function () {
        console.log(body);
        body = JSON.parse(body);

        postUser(body, function (response) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(`${JSON.stringify(response)}`);
        });
      });
    } else if (req.url.includes("login")) {
      var body = "";
      req.on("data", function (data) {
        body += data;
      });

      let myBody = decrypt_token(body);
      req.on("end", function () {
        console.log("BODY= " + myBody);
        myBody = JSON.parse(myBody);
        console.log(myBody);
        checkUser(myBody, function (response) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(`${JSON.stringify(response)}`);
        });
      });
    }
  }
});

function checkUser(body, callback) {
  let extractedMail = body.email;
  let username = ""; //username-ul il extrag in DB
  let extractedPassword = body.password;
  let response = "";

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
        rowMode: "array",
        text:
          "SELECT * FROM USERS WHERE EMAIL='" +
          extractedMail +
          "' AND PASSWORD='" +
          extractedPassword +
          "'",
      });

      if (check.rowCount > 0) {
        console.log(check.rows);

        response = {
          status: "existent user",
        };
      } else {
        console.log(
          "user doesn't exist:" + extractedMail + " " + extractedPassword
        );

        response = {
          status: "no user found",
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
  let response = "";

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
        rowMode: "array",
        text: "SELECT * FROM USERS WHERE EMAIL='" + extractedMail + "'",
      });

      if (check.rowCount == 0) {
        const dim = await client.query({
          rowMode: "array",
          text: "SELECT * FROM USERS",
        });

        const res = await client.query({
          rowMode: "array",
          text:
            "INSERT INTO USERS VALUES(" +
            (dim.rowCount + 1) +
            ",'" +
            extractedMail +
            "','" +
            extractedUsername +
            "','" +
            extractedPassword +
            "')",
        });
        console.log(res.rows);

        //res.writeHead(200, {'Content-Type': 'text/plain'});
        response = {
          status: "new user",
        };
      } else {
        console.log("email already exists:" + extractedMail);

        response = {
          status: "user found",
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
      const res = await client.query({
        rowMode: "array",
        text: "SELECT * FROM users",
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
  var geojsonMerge = require("@mapbox/geojson-merge");

  var mergedGeoJSON = geojsonMerge.merge(links[0], links[1]);

  return callback(mergedGeoJSON);
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
