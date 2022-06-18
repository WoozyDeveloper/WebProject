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

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(jObj));
      });
  }
});

//

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
