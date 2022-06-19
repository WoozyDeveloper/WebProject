import fetch from 'node-fetch';
import http from 'http';

import querystring from 'query-string'

//const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser');
import XMLParser from 'fast-xml-parser'

const hostname = '127.0.0.1';
const port = 3005;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    const urlSearchParams = querystring.parseUrl(req.url);
    const params = urlSearchParams.query;
    const url = urlSearchParams.url
    console.log("URL Search Params URL: " + urlSearchParams.url)

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'GET') {
        console.log('GET')
        if (url === '/UserInformationService/') {
            console.log('GET')
            let table = params.table
            let email = params.email
            fetch(
                `http://localhost:4002/?table=${table}&email=${email}`
            )
                .then((response) => response.json())
                .then((data) => {
                    let userid = data[0].id;
                    let usermail = data[0].email;
                    let usr = data[0].username;
                    let response = { id: userid, email: usermail, username: usr }
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(response))
                });
        }
        else if (url === '/CapEventService/') {
            console.log('GET')
            let start = params.start
            let end = params.end
            let urgency = params.urgency
            let category = params.category
            fetch(
                `http://localhost:4003?start=${start}&end=${end}&urgency=${urgency}&category=${category}`
            )
                .then((response) => response.json())
                .then((data) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data))
                });
        }
    }
    else if (req.method === 'POST') {
        if (url === '/UserAccountService/login') {
            var body = "";
            console.log("LOGIN")
            req.on('data', function (data) {
                body += data
                console.log(data)
                console.log('Partial body: ' + body)
            })
            req.on("end", async function () {
                const settings = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: body,
                };
                //console.log("JSON PARSE BODY: " + JSON.parse(body).email + " " + JSON.parse(body).password)
                const fetchResponse = await fetch("http://localhost:4000/login", settings);
                const response = await fetchResponse.json();
                console.log(response);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(`${JSON.stringify(response)}`);
            });

        }
        else if (url === '/UserAccountService/register') {
            var body = "";
            console.log("Register")
            req.on('data', function (data) {
                body += data
                console.log(data)
                console.log('Partial body: ' + body)
            })
            req.on("end", async function () {
                const settings = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: body,
                };
                //console.log("JSON PARSE BODY: " + JSON.parse(body).email + " " + JSON.parse(body).password)
                const fetchResponse = await fetch("http://localhost:4000/register", settings);
                const response = await fetchResponse.json();
                console.log(response);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(`${JSON.stringify(response)}`);
            });
        }
        else if (url === '/NotificationService') {
            var body = "";
            console.log("add event")
            req.on('data', function (data) {
                body += data
                console.log(data)
                console.log('Partial body: ' + body)
            })
            req.on("end", async function () {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', 'http://localhost:4004');
                xhr.setRequestHeader('Content-Type', 'application/xml');
                xhr.send(body);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(`${JSON.stringify(body)}`);
            });
        }
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});