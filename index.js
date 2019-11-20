const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

const server = http.createServer(function(req, res){

    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id; // Read ID from url

    if (pathName === '/products' || pathName === '/') {
        fs.readFile('./public/overview.html', 'UTF-8', function(err, html){
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        });
    } else if (pathName === '/laptop' && id < pathName.length ) {
        fs.readFile('./public/laptop.html', 'UTF-8', function(err, html){
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        });
    } else if (pathName.match('\.css$')) {
        const cssPath = path.join(__dirname, 'public', pathName);
        const fileStream = fs.createReadStream(cssPath, 'UTF-8');
        res.writeHead(200, { 'Content-Type': 'text/css' });
        fileStream.pipe(res);

    } else if (pathName.match('\.jpg$')) {
        const imagePath = path.join(__dirname, 'public', pathName);
        const fileStream = fs.createReadStream(imagePath);
        res.writeHead(200, { 'Content-Type': 'image/jpg' });
        fileStream.pipe(res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('No Page Found');
    }
});

server.listen(1337, '127.0.0.1', () => {
    console.log('Listening for requests now');
});