"use strict";

var server = require("./server");
var router = require("./router");
var reqHandlers = require("./reqHandlers");

var handle = {};

handle["/"] = reqHandlers.reqStart;
handle["/assignment2/index.html"] = reqHandlers.reqStart;
handle["/css/index.css"] = reqHandlers.reqStart;
handle["/assignment2/css/index.css"] = reqHandlers.reqStart;
handle["/js/site.js"] = reqHandlers.reqStart;
handle["/assignment2/js/site.js"] = reqHandlers.reqStart;
handle["/assignment2/images/sunny.jpg"] = reqHandlers.reqStart;
handle["/assignment2/images/cloudy.jpg"] = reqHandlers.reqStart;
handle["/assignment2/images/rainy.jpg"] = reqHandlers.reqStart;
handle["/assignment2/images/thunder.jpg"] = reqHandlers.reqStart;
handle["/retrieveInfo"] = reqHandlers.reqInfo;
handle["/favicon.ico"] = reqHandlers.reqIco;

server.startServer(router.route, handle);   