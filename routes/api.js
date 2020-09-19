var express = require("express");
var meetingsRouter = require("./meetings");
var itemsRouter = require("./items");

var app = express();

app.use("/meetings/", meetingsRouter);
app.use("/items/", itemsRouter);

module.exports = app;