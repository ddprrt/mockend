/**
 * mockend middleware for connect/express
 * 
 * Copyright (c) 2015 Stefan Baumgartner
 * Licensed under the MIT license.
 */

var fs = require('fs'),
    url = require('url');

module.exports = function(config) {
    var arraycount = {},
        funcs = {
        '[object Object]': function(contents, url, res) {
            res.statusCode = contents.code;
            return funcs[Object.prototype.toString.call(contents.path)](contents.path, url, res);
        },
        '[object String]': function(contents, url, res) {
            return fs.readFileSync(contents);
        },
        '[object Array]': function(contents, url, res) {
            if(typeof arraycount[url] === 'undefined' || arraycount[url] >= contents.length) {
                arraycount[url] = 0;
            }
            var nx = contents[arraycount[url]++];
            return funcs[Object.prototype.toString.call(nx)](nx, url, res);
        }
    };

    var jsonpCallback = function(string, uri) {
        if(!!uri.query && !!uri.query.callback) {
            return uri.query.callback + '(' + string + ');';
        } else {
            return string;
        }
    }

    return function(req, res, next) {
        var uri = url.parse(req.url, true, true),
        contents = config[uri.pathname];
        
        if(typeof contents === 'undefined') {
            next();
        } else {
            try {
                res.write(jsonpCallback(funcs[Object.prototype.toString.call(contents)](contents, uri.pathname, res), uri));
                res.end();
            } catch (ex) {
                console.error(ex);
                next();
            }
        }
    }
}
