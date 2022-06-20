const http = require(`http`);
const fs = require('fs');
const path = require('path');
const basePath = path.join(__dirname, 'public');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    // Decode the token
    const decodedToken = parseToken(req, res);
    // Home
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

    // Login
    else if (req.url === '/login') {
      if (!decodedToken) {
        fs.readFile(`${basePath}/pages/login.html`, (err, data) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end('404 Not Found');
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.write(data);
          return res.end();
        });
      } else {
        // Redirect to home
        res.writeHead(302, { Location: '/account' });
        return res.end();
      }

      // User preferences
    }

    // Register
    else if (req.url === '/register') {
      fs.readFile(`${basePath}/pages/register.html`, (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          return res.end('404 Not Found');
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
      });
    }

    // Contact
    else if (req.url === '/contact') {
      fs.readFile(`${basePath}/pages/contact.html`, (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          return res.end('404 Not Found');
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
      });
    }

    // Map
    else if (req.url === '/map') {
      fs.readFile(`${basePath}/pages/map.html`, (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          return res.end('404 Not Found');
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
      });
    }

    // Dashboard
    else if (req.url === '/dashboard') {
      if (decodedToken && decodedToken.role === 'admin') {
        fs.readFile(`${basePath}/pages/dashboard.html`, (err, data) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end('404 Not Found');
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.write(data);
          return res.end();
        });
      } else {
        console.log(decodedToken);
        console.log('Not authorized');
        // Redirect to login page
        res.writeHead(302, { Location: '/login' });
        return res.end();
      }
    }

    // Add event
    else if (req.url === '/add-event') {
      if (decodedToken && decodedToken.role === 'admin') {
        fs.readFile(`${basePath}/pages/event.html`, (err, data) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end('404 Not Found');
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.write(data);
          return res.end();
        });
      } else {
        console.log(decodedToken);
        console.log('Not authorized');
        // Redirect to login page
        res.writeHead(302, { Location: '/login' });
        return res.end();
      }
    }

    // User preferences
    else if (req.url === '/account') {
      if (decodedToken) {
        fs.readFile(`${basePath}/pages/user.html`, (err, data) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end('404 Not Found');
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.write(data);
          return res.end();
        });
      } else {
        console.log(decodedToken);
        console.log('Not authorized');
        // Redirect to login page
        res.writeHead(302, { Location: '/login' });
        return res.end();
      }
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

    // // If it is a page
    // if (req.url.match(/\.html$/)) {
    //   fs.readFile(`${basePath}${req.url}`, (err, data) => {
    //     if (err) {
    //       res.writeHead(404, { 'Content-Type': 'text/html' });
    //       return res.end('404 Not Found');
    //     }
    //     res.writeHead(200, { 'Content-Type': 'text/html' });
    //     res.write(data);
    //     return res.end();
    //   });
    // }
  }

  // Handle POST requests
  if (req.method === 'POST') {
    let parsedBody;
    let body = '';
    req
      .on('data', (data) => {
        body += data;
      })
      .on('end', () => {
        parsedBody = JSON.parse(body);
        handlePost(req, res, parsedBody);
      });
  }
});

// JWT
const jwtKey = 'my_secret_key';

const handlePost = async (req, res, parsedBody) => {
  if (req.url === '/login') {
    const { email, password } = parsedBody;

    console.log(parsedBody);

    // fetch post data
    const data = await axios
      .post(`http://127.0.0.1:4000/login/`, {
        email,
        password,
      })
      .then((response) => {
        return response.data;
      });

    console.log(data);

    if (data.status === 'no user found' || data.status === 'wrong password') {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify({ status: 'Invalid username or password' }));
      return res.end();
    }

    const token = jwt.sign(
      { username: data.username, email: data.email, role: 'admin' },
      jwtKey,
      {
        expiresIn: '1h',
      }
    );
    // Put the token in the cookie
    // res.setHeader('Set-Cookie', `token=${token}; HttpOnly`);
    res.setHeader('Set-Cookie', `token=${token};`);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ status: 'existent user' }));
    return res.end();
  }
};

const parseToken = (req, res, next) => {
  // Get the token from the cookie
  const token = parseCookies(req) ? parseCookies(req).token : null;
  if (!token) {
    return null;
  }

  // Verify the authenticity of the token
  let payload;
  try {
    payload = jwt.verify(token, jwtKey);
    console.log(payload);
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized
      return null;
    }
    // otherwise, return a bad request error
    return null;
  }
  return payload;
};

function parseCookies(request) {
  const list = {};
  const cookieHeader = request.headers ? request.headers.cookie : null;
  if (!cookieHeader) return list;

  cookieHeader.split(`;`).forEach(function (cookie) {
    let [name, ...rest] = cookie.split(`=`);
    name = name?.trim();
    if (!name) return;
    const value = rest.join(`=`).trim();
    if (!value) return;
    list[name] = decodeURIComponent(value);
  });

  return list;
}

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
