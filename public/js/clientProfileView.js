const http = require('http');

const hostname = '127.0.0.1';
const port = 3001;

const querystring = require('query-string')

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    const urlSearchParams = querystring.parseUrl(req.url);
    const params = urlSearchParams.query;
    if (req.method === 'GET') {
        console.log(urlSearchParams)
    }
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});