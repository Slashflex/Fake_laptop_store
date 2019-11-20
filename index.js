const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

const server = http.createServer((req, res) => {

    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id; // Read ID from url

    if (pathName === '/products' || pathName === '/') {

        fs.readFile('./public/overview.html', 'UTF-8', (err, html) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        });
        
    } else if (pathName === '/laptop' && id < pathName.length ) {

        res.writeHead(200, { 'Content-Type': 'text/html' });

        fs.readFile(`${__dirname}/public/templates/template-laptop.html`, 'UTF-8', (err, data) => {
            const laptop = laptopData[id];
            let output = data.replace(/{%PRODUCTNAME%}/g, laptop.productName);
            output = output.replace(/{%IMAGE%}/g, laptop.image);
            output = output.replace(/{%PRICE%}/g, laptop.price);
            output = output.replace(/{%SCREEN%}/g, laptop.screen);
            output = output.replace(/{%CPU%}/g, laptop.cpu);
            output = output.replace(/{%STORAGE%}/g, laptop.storage);
            output = output.replace(/{%RAM%}/g, laptop.ram);
            output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
        
            res.end(output);
        });

    } else if (pathName.match('\.css$')) {

        const cssPath = path.join(__dirname, 'public', pathName);
        const fileStream = fs.createReadStream(cssPath, 'UTF-8');
        res.writeHead(200, { 'Content-Type': 'text/css' });
        fileStream.pipe(res);

    } else if (pathName.match('\.jpg$')) {

        const imagePath = path.join(__dirname, './public/img', pathName);
        const fileStream = fs.createReadStream(imagePath);
        res.writeHead(200, { 'Content-Type': 'image/jpg' });
        fileStream.pipe(res);

    } else if (pathName.match('\.png$')) {

        const imagePath = path.join(__dirname, './public/img', pathName);
        const fileStream = fs.createReadStream(imagePath);
        res.writeHead(200, { 'Content-Type': 'image/png' });
        fileStream.pipe(res);

    }else {

        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('No Page Found');

    }
});

server.listen(1337, '127.0.0.1', () => {
    console.log('Listening for requests now');
});