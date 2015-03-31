var mw          = require('..'),
    supertest   = require('supertest'),
    connect     = require('connect');

var end = function(err, res) {
    if(err) throw err;
}

var contents = function(obj) {
    return function(res) {
        return !JSON.parse(res.text).message === obj.message;
    }
}

var json = require('./demo.json');

var app = connect();
app.use(mw(json));

supertest(app)
    .get('/user')
    .expect(200)
    .expect(contents(require('./files/1.json')))
    .end(end);

/** check updates */

[2,3,4,5,2,3,4,5].forEach(function(x) {
    supertest(app)
        .get('/events/updates')
        .expect(contents(require('./files/'+x+'.json')))
        .expect(200)
        .end(end);  
});

supertest(app)
    .get('/orders')
    .expect(contents(require('./files/6.json')))
    .expect(500)
    .end(end);
