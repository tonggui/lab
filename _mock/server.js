var express = require("express");
var mockApiApp = require("./app");

var app = express();

// Use a custom path '/api'
app.use("/api", mockApiApp);

// Here you can add any code.

app.listen(10010);
