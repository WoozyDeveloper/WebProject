const { parse } = require('querystring');

const http = require('http');

const hostname = '127.0.0.1';
const port = 4000;
//Can be found in the Details page




var showInBrowser
const server = http.createServer(async (req, res) => {
    const urlSearchParams = new URLSearchParams(req.url);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (!req.url.includes("/favicon.ico")) {
        console.log(req.url)
        console.log(params)
    }
    if (req.method == 'GET' && !req.url.includes("/favicon.ico")) {
        if (params.getUsers === "true") {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            getUsers(function (response) { res.end(`${JSON.stringify(response)}`) })//vezi aici cv sincronizare callback
        }
        else if (params.mergeGeoJSON !== null) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            //var links = params.mergeGeoJSON.split(",")
            //console.log(links[0])
            //console.log(links[1])
            //mergeGeoJSON(links,function (response) {res.end(response)})
        }
    }
    else if (req.method == 'POST') {
        console.log('POST')
        var body = ''
        req.on('data', function(data) {
            body+=data;
        })
        req.on('end', function() {
            console.log(parse(body));
            body = JSON.parse(body);
            
            postUser(body,function (response) { res.end(`${JSON.stringify(response)}`) })
            
        })
    }
});

function postUser(body, callback){
    let extractedMail = body.email;
            let extractedUsername = body.username;
            let extractedPassword = body.password;
            let response = '';
                
            const { Pool } = require('pg')
            const connectionString = 'postgres://ennfzieu:km1vCgMmJ3E__AlpbWFf7ueZuVh-lT8_@abul.db.elephantsql.com/ennfzieu'
            const pool = new Pool({
                connectionString,
            })
                ; (async () => {
                    const client = await pool.connect()
                    try {
                        const check = await client.query({
                            rowMode: 'array',
                            text: 'SELECT * FROM USERS WHERE EMAIL=\'' + extractedMail + '\'',
                        })
                        
                        if(check.rowCount == 0){
                            const dim = await client.query({
                                rowMode: 'array',
                                text: 'SELECT * FROM USERS',
                            })
                            
                            const res = await client.query({
                                rowMode: 'array',
                                text: 'INSERT INTO USERS VALUES(' + (dim.rowCount + 1) + ',\'' + extractedMail + '\',\'' + extractedUsername + '\',\'' + extractedPassword + '\')',
                            })
                            console.log(res.rows);

                            //res.writeHead(200, {'Content-Type': 'text/plain'});
                            response = "raspuns";

                        }
                        else{
                            console.log('email already exists:' + extractedMail);

                            //res.writeHead(200, {'Content-Type': 'text/plain'});
                            response = "email existent";
                        }
                        return callback(response);

                    } finally {
                        // Make sure to release the client before any error handling,
                        // just in case the error handling itself throws an error.

                        client.release()
                    }
                })().catch(err => console.log(err.stack))
}

function getUsers(callback) {
    const { Pool } = require('pg')
    const connectionString = 'postgres://ennfzieu:km1vCgMmJ3E__AlpbWFf7ueZuVh-lT8_@abul.db.elephantsql.com/ennfzieu'
    const pool = new Pool({
        connectionString,
    })
        ; (async () => {
            const client = await pool.connect()
            try {
                const res = await client.query({
                    rowMode: 'array',
                    text: 'SELECT * FROM users where id=2',
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

function mergeGEOJSON(links, callback) {

    var geojsonMerge = require('@mapbox/geojson-merge');

    var mergedGeoJSON = geojsonMerge.merge(links[0],links[1]);

    return callback(mergedGeoJSON)
}


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});