var path = require("path");
var express = require("express");
var mockjs = require("./express-mockjs");
const delay = require("randelay");
var bodyParser = require("body-parser");
var multer = require("multer");
var upload = multer({ dest: path.join(__dirname, './temp/') });

var app = express();

// 增加mock接口的随机延时
app.use(async (req, res, next) => {
  await delay(200, 1000);
  await next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  if (req.body.hqccParams) {
    req.body = JSON.parse(req.body.hqccParams)
  }
  return next()
})
// 下面一行注释掉的原因：对于上传图片而言，应该是file，然后才能本地mock成功，否则提示 Error: Unexpected field
app.use('/reuse/sc/product/uploadTool', upload.single('multipart'));

// Use the default path '/' (Not recommended)
// app.use(mockjs(path.join(__dirname, 'mocks')))
app.use(mockjs(path.join(__dirname, "api")));

module.exports = app;
