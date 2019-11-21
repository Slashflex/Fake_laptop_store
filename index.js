const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

// SERVER CREATION
const server = http.createServer((req, res) => {

    const pathName = url.parse(req.url, true).pathname;    
    const id = url.parse(req.url, true).query.id; // Read ID from url

    //PRODUCTS
    if (pathName === '/products' || pathName === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.readFile(`${__dirname}/public/templates/template-overview.html`, 'UTF-8', (err, data) => {
            let overviewOutput = data;
            fs.readFile(`${__dirname}/public/templates/template-card.html`, 'UTF-8', (err, data) => {
                const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join('');
                overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput);
                res.end(overviewOutput);
            });
        });
    } 
    
    // LAPTOP DETAIL
    else if (pathName === '/laptop' && id < laptopData.length ) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.readFile(`${__dirname}/public/templates/template-laptop.html`, 'UTF-8', (err, data) => {
            const laptop = laptopData[id];
            const output = replaceTemplate(data, laptop);
            res.end(output);
        });
    } 
    
    // INCLUDE CSS FILE
    else if (pathName.match('\.css$')) {
        const cssPath = path.join(__dirname, 'public', pathName);
        const fileStream = fs.createReadStream(cssPath, 'UTF-8');
        res.writeHead(200, { 'Content-Type': 'text/css' });
        fileStream.pipe(res);
    } 
    
    // INCLUDE JPG FILES
    else if ((/\.(jpg|jpeg|png|gif)$/i)) {
        fs.readFile(`${__dirname}/public/img${pathName}`, (err, data) => {
            res.writeHead(200, { 'Content-Type': 'image/jpg' });
            res.end(data);
        });
    }
    
    // URL NOT FOUND
    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('No Page Found');
    }
});

// 127.0.0.1:1337
server.listen(8080, '127.0.0.1', () => {
    console.log('Listening for requests now');
});

// REPLACE HTML PLACEHOLDER BY ACTUAL DATAS
const replaceTemplate = (originalHtml, laptop) => {
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);
    return output;
}