"use strict";

function route(path ,handle, req, res, postData) {
	console.log('Routing a request for ' + path);

	if (typeof handle[path] == 'function') {
		handle[path](path, res, postData);
	}
	else {
		console.log("No handler found for: " + path);
	}
}

exports.route = route;