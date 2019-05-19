var path = require("path");
var express = require("express");
var mockjs = require("./express-mockjs");
const delay = require("randelay");
var bodyParser = require("body-parser");
var multer = require("multer");
var upload = multer();

var app = express();

// 增加mock接口的随机延时
app.use(async (req, res, next) => {
  await delay(200, 1000);
  await next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.none());

// Use the default path '/' (Not recommended)
// app.use(mockjs(path.join(__dirname, 'mocks')))
app.use(mockjs(path.join(__dirname, "api")));

module.exports = app;
