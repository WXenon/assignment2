"use strict";

var http = require('http');
var url = require('url');
var route = require('./router');

function startServer(route, handle) {
	function onRequest(req,res) {
        var path = url.parse(req.url).pathname;
        console.log('Request for ' + path + ' received.');
		console.log(req.method);
		var postData = "";
		req.addListener('data', function(dataChunk) {
			postData += dataChunk;
		});
		req.addListener('end', function() {
			route(path, handle, req, res, postData);
		});
	}

	http.createServer(onRequest).listen(40511);

	console.log('Server running http://ceto.murdoch.edu.au:40511/');
	console.log('Process ID: ', process.pid);
}

exports.startServer = startServer;