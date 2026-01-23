
const http = require('http');

const options = {
    hostname: '127.0.0.1',
    port: 1337,
    path: '/api/about-page',
    method: 'GET'
};

console.log(`Connecting to http://127.0.0.1:1337/api/about-page ...`);

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('BODY: ' + data);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.setTimeout(5000, () => {
    console.error('Request timed out');
    req.destroy();
});

req.end();
