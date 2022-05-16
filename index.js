const http = require(`http`);
const oracledb = require('oracledb');
const fs = require('fs');
const path = require('path');
const basePath = path.join(__dirname, 'public');
const PORT = process.env.PORT || 3000;

require('dotenv').config();
let connection;

(async () => {
  connection = await oracledb
    .getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      connectString: process.env.DB_HOST,
    })
    .then((conn) => {
      console.log('Connected to database');
      return conn;
    })
    .catch((err) => {
      console.error(err.message);
      return;
    });
})();

const server = http.createServer((req, res) => {
  // Routes for static files
  if (req.url === '/') {
    fs.readFile(`${basePath}/index.html`, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        return res.end('404 Not Found');
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(data);
      return res.end();
    });
  }

  // If it is a js
  if (req.url.match(/\.js$/)) {
    fs.readFile(`${basePath}${req.url}`, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        return res.end('404 Not Found');
      }
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      res.write(data);
      return res.end();
    });
  }

  // If it is a css
  if (req.url.match(/\.css$/)) {
    fs.readFile(`${basePath}${req.url}`, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        return res.end('404 Not Found');
      }
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.write(data);
      return res.end();
    });
  }

  // If it is a image
  if (req.url.match(/\.(jpg|png|gif|ico|PNG)$/)) {
    fs.readFile(`${basePath}${req.url}`, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        return res.end('404 Not Found');
      }
      res.writeHead(200, { 'Content-Type': 'image/png' });
      res.write(data);
      return res.end();
    });
  }

  // If it is a page
  if (req.url.match(/\.html$/)) {
    fs.readFile(`${basePath}${req.url}`, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        return res.end('404 Not Found');
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(data);
      return res.end();
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
