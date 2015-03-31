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

var callbackAvailable = function(cbNum) {
    return function(res) {
        return res.text.indexOf('jq' + cbNum) < 0;
    }
}

var json = require('./demo.json');

var app = connect();
app.use(mw(json));

/** check standard string call */

supertest(app)
    .get('/user')
    .expect(200)
    .expect(contents(require('./files/1.json')))
    .end(end);

/** check array */

[2,3,4,5,2,3,4,5].forEach(function(x) {
    supertest(app)
        .get('/events/updates')
        .expect(contents(require('./files/'+x+'.json')))
        .expect(200)
        .end(end);  
});

/** check object */

supertest(app)
    .get('/orders')
    .expect(contents(require('./files/6.json')))
    .expect(500)
    .end(end);

/** check jsonp */

var rand = parseInt(Math.random() * 334500);

supertest(app)
    .get('/user?callback=jq' + rand)
    .expect(200)
    .expect(callbackAvailable(rand))
    .end(end);
