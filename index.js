// Init ES2015 + .jsx environments for .require()
require('babel-register');

var express = require('express');
var fluxexapp = require('./fluxexapp');
var pageAction = require('./actions/page');
var fluxexServerExtra = require('fluxex/extra/server');
var app = express();

// Provide /static/js/main.js
fluxexServerExtra.initStatic(app);

// Start server
app.listen(3000);
console.log('Fluxex started on port 3000');