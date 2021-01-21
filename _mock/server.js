var express = require("express");
var mockApiApp = require("./app");
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// Use a custom path '/api'
app.use("/api", mockApiApp);

// Here you can add any code.

app.listen(10010);
