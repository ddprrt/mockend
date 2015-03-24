var mw = require('./lib/middleware.js'),
    http = require('http'),
    fs = require('fs'),
    connect = require('connect');


var json = JSON.parse(fs.readFileSync('./specs/demo.json', 'utf8'));

var app = connect();
app.use(mw(json));

http.createServer(app).listen(3000);
