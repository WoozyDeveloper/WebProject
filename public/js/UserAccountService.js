const http = require('http');

const querystring = require('query-string')

const hostname = '127.0.0.1';
const port = 4002;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    const urlSearchParams = querystring.parseUrl(req.url);
    const params = urlSearchParams.query;
    console.log(urlSearchParams)

    if (req.method == 'GET') {
        console.log('GET')
        res.setHeader('Content-Type', 'application/json');
        getInfo(params, function (response) { res.end(JSON.stringify(response)) })

    }
});


function getInfo(queryparams, callback) {
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
                let keys = Object.keys(queryparams)
                let table = queryparams.table
                let res
                for (let i = 0; i < keys.length; i++) {
                    if (queryparams[keys[i]] != null && keys[i] !== "table") {
                        console.log(`select * from ${table} where ${keys[i]}=${queryparams[keys[i]]}`)
                        res = await client.query({
                            text: `select * from ${table} where ${keys[i]}=$1`,
                            values: [queryparams[keys[i]]]
                        })
                        i = keys.length + 1
                    }
                }
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