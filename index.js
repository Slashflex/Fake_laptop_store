const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer(function(req, res){

    if (req.url === "/") {
        fs.readFile("./public/laptop.html", "UTF-8", function(err, html){
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(html);
        });
    } else if (req.url.match("\.css$")) {
        const cssPath = path.join(__dirname, 'public', req.url);
        const fileStream = fs.createReadStream(cssPath, "UTF-8");
        res.writeHead(200, {"Content-Type": "text/css"});
        fileStream.pipe(res);

    } else if (req.url.match("\.jpg$")) {
        const imagePath = path.join(__dirname, 'public', req.url);
        const fileStream = fs.createReadStream(imagePath);
        res.writeHead(200, {"Content-Type": "image/jpg"});
        fileStream.pipe(res);
    } else {
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end("No Page Found");
    }

});


server.listen(1337, '127.0.0.1', () => {
    console.log('Listening for requests now');
});