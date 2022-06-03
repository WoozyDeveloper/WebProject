const http = require('http');

const hostname = '127.0.0.1';
const port = 4000;

var pg = require('pg');
//or native libpq bindings
//var pg = require('pg').native

var conString = "postgres://ennfzieu:km1vCgMmJ3E__AlpbWFf7ueZuVh-lT8_@abul.db.elephantsql.com/ennfzieu" //Can be found in the Details page
var client = new pg.Client(conString);

var showInBrowser
client.connect(function (err) {
    if (err) {
        return console.error('could not connect to postgres', err);
    }
    client.query('SELECT NOW() AS "theTime"', function (err, result) {
        if (err) {
            return console.error('error running query', err);
        }
        showInBrowser = result.rows[0].theTime;
        // >> output: 2018-08-23T14:02:57.117Z
        client.end();
    });
});

const server = http.createServer((req, res) => {
    console.log(req.url)
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('' +
     `<html>
      <head></head>
      <body>
        Data render at browser page
        <p>Rezultat query: ${showInBrowser}</p>
        <script>
          /********** Browser start ********/
          /* This code is run in the browser */
          console.log('${showInBrowser}');
          /********** Browser end ********/
        </script>
      </body>
    </html>`);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});