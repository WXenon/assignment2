"use strict";

var http = require('http');
var url = require('url');
var fs = require('fs');
var route = require('./router');
const { parseString } = require('xml2js');
var dateFormatter = require('./dateFormatter');

function reqStart(path, res, postData) {
	if(path.indexOf("html") != -1 || path.length == 1){
		fs.readFile('../index.html', null, function (err, data) {
			if (err) {
				console.log(err);
			}
			else{
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.write(data);
			}
			res.end();
		});
    }

    if(path.indexOf('.js') != -1 && path.indexOf('site') != -1){
		fs.readFile('./site.js', function (err, data) {
			if (err) {
				console.log(err);
			}
			else{
				res.writeHead(200, {'Content-Type': 'text/javascript'});
				res.write(data);
			}
			res.end();
		});
    }

    if(path.indexOf('.css') != -1){
		fs.readFile('../css/index.css', function (err, data) {
			if (err) {
				console.log(err);
			}
			else{
				res.writeHead(200, {'Content-Type': 'text/css'});
				res.write(data);
			}
			res.end();
		});
    }

	if(path.indexOf('sunny.jpg') != -1){
		res.writeHead(200, {'Content-Type': 'image/jpg'});
	
		var readStream = fs.createReadStream('../images/sunny.jpg');
		readStream.on('open', function() {
			readStream.pipe(res);
		});

		readStream.on('error', function(err) {
			readStream.end(err);
		});
    }

	if(path.indexOf('cloudy.jpg') != -1){
		res.writeHead(200, {'Content-Type': 'image/jpg'});
	
		var readStream = fs.createReadStream('../images/cloudy.jpg');
		readStream.on('open', function() {
			readStream.pipe(res);
		});

		readStream.on('error', function(err) {
			readStream.end(err);
		});
    }

	if(path.indexOf('rainy.jpg') != -1){
		res.writeHead(200, {'Content-Type': 'image/jpg'});
	
		var readStream = fs.createReadStream('../images/rainy.jpg');
		readStream.on('open', function() {
			readStream.pipe(res);
		});

		readStream.on('error', function(err) {
			readStream.end(err);
		});
    }

	if(path.indexOf('thunder.jpg') != -1){
		res.writeHead(200, {'Content-Type': 'image/jpg'});
	
		var readStream = fs.createReadStream('../images/thunder.jpg');
		readStream.on('open', function() {
			readStream.pipe(res);
		});

		readStream.on('error', function(err) {
			readStream.end(err);
		});
    }
}

function reqInfo(path, res, postData){
	var suffix, start, end, year, info;
	var vars = postData.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0].toString() == "year") {
            year = pair[1];
        }
		else if (pair[0].toString() == "smth"){
			start = pair[1];
		}
		else if (pair[0].toString() == "emth"){
			end = pair[1];
		}
		else if (pair[0].toString() == "info"){
			info = pair[1];
		}
    }

	if (parseInt(year) > 2009){
		suffix = ".json";
	}
	else{
		suffix = ".xml";
	}

	var url = "http://it.murdoch.edu.au/~S900432D/ict375/data/" + year + suffix;
	
	var filePath = "../data/" + year + suffix;
	const file = fs.createWriteStream(filePath);
	http.get(url, function(response){
		if (response.statusCode == 404){
			var data = JSON.stringify('{"error": "No record found for year entered"}');
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.write(data);
			res.end();
		}
		else{
			var stream = response.pipe(file);
			stream.on("finish", function(){
				fs.readFile(filePath, function (err, data) {
					var ws, sr, tws = 0, tsr = 0, count = 0, taws = 0, awsmth = 0, srmth = 0, twsmth = 0, tsrmth = 0, wsmth;
					var awsmthArr = [], srmthArr = []; 
					if (err) {
						console.log("error line 139:" +err);
					}
					else{
						if (suffix == ".xml"){
							parseString(data, (err, result) =>{
								if (err) console.log(err);
								data = JSON.stringify(result, null, 4);
							})
						}
						var dataToSend = JSON.parse(data);
						if (start != "0"){
							console.log("filtering");
							var startDate = dateFormatter.formatSDate(start, year);
							var endDate = dateFormatter.formatEDate(end, year);
							var sDate = new Date(startDate);
							var eDate = new Date(endDate);
							var resultData = dataToSend["weather"]["record"].filter(function (a) {
								var date = new Date(dateFormatter.formatDate(a.date));
								var hitDateMatchExists = date >= sDate && date <= eDate;
								if (hitDateMatchExists){
									if (info.includes("both")){
										ws = parseFloat(a.ws) * 600;
										tws += ws;
										if (parseFloat(a.sr) >= 100){
											sr = parseFloat(a.sr) * 600;
											tsr += sr;
										}
									}
									else if(info.includes("ws") && info.length == 2){
										ws = parseFloat(a.ws) * 600;
										tws += ws;
									}
									else if(info.includes("sr") && info.length == 2){
										if (parseFloat(a.sr) >= 100){
											sr = parseFloat(a.sr) * 600;
											tsr += sr;
										}
									}
									count++;
								}
								return hitDateMatchExists;
							});
							
							if (info.includes("both")){
								wsmth = parseFloat(resultData[0]["ws"]) * 600;
								twsmth += wsmth;
								if (parseFloat(resultData[0]["sr"]) >= 100){
									srmth = parseFloat(resultData[0]["sr"]) * 600;
									tsrmth += srmth;
								}
							}
							else if(info.includes("ws") && info.length == 2){
								wsmth = parseFloat(resultData[0]["ws"]) * 600;
								twsmth += wsmth;
							}
							else if(info.includes("sr") && info.length == 2){
								if (resultData[0]["sr"] >= 100){
									srmth = parseFloat(resultData[0]["sr"]) * 600;
									tsrmth += srmth;
								}
							}
							var countRecord = 1;
							var j = 1;
							for (var i = 1; i < count; i++){
								if (parseInt(resultData[i]["date"].toString().substring(3, 5)) == parseInt(resultData[i-1]["date"].toString().substring(3, 5))){
									if (info.includes("both")){
										wsmth = parseFloat(resultData[i]["ws"]);
										twsmth += wsmth;
										if (resultData[i]["sr"] >= 100){
											srmth = parseFloat(resultData[i]["sr"]);
											tsrmth += srmth;
										}
									}
									else if(info.includes("ws") && info.length == 2){
										wsmth = parseFloat(resultData[i]["ws"]);
										twsmth += wsmth;
									}
									else if(info.includes("sr") && info.length == 2){
										if (resultData[i]["sr"] >= 100){
											srmth = parseFloat(resultData[i]["sr"]);
											tsrmth += srmth;
										}
									}
	
									countRecord++;
	
									if (resultData[i + 1] == undefined){
										if (info.includes("both")){
											awsmth = twsmth / countRecord;
											awsmthArr.push(awsmth);
											srmthArr.push(tsrmth);
										}
										else if(info.includes("ws") && info.length == 2){
											awsmth = twsmth / countRecord;
											awsmthArr.push(awsmth);
										}
										else if(info.includes("sr") && info.length == 2){
											srmthArr.push(tsrmth);
										}
									}
									else if (parseInt(resultData[i + 1]["date"].toString().substring(3, 5)) != parseInt(resultData[i]["date"].toString().substring(3, 5))){
										if (info.includes("both")){
											for (var k = 0; k < start-1; k++){
												if (j < start){
													awsmthArr.push(0);
													srmthArr.push(0);
												}
												j++;
											}
											awsmth = twsmth / countRecord;
											awsmthArr.push(awsmth);
											srmthArr.push(tsrmth);
										}
										else if(info.includes("ws") && info.length == 2){
											for (var k = 0; k < start-1; k++){
												if (j < start){
													awsmthArr.push(0);
												}
												j++;
											}
											awsmth = twsmth / countRecord;
											awsmthArr.push(awsmth);
										}
										else if(info.includes("sr") && info.length == 2){
											for (var k = 0; k < start-1; k++){
												if (j < start){
													srmthArr.push(0);
												}
												j++;
											}
											srmthArr.push(tsrmth);
										}
									}
								}
							}
							
							if (info.includes("both")){
								tws = (tws * 6)/1000;
								taws = tws / count;
								tsr = (tsr / 6)/1000;
							}
							else if(info.includes("ws") && info.length == 2){
								tws = (tws * 6)/1000;
								taws = tws / count;
							}
							else if(info.includes("sr") && info.length == 2){
								tsr = (tsr / 6)/1000;
							}
						}
						else{
							var startDate = dateFormatter.formatSDate("01", year);
							var endDate = dateFormatter.formatEDate("12", year);
							var sDate = new Date(startDate);
							var eDate = new Date(endDate);
							var resultData = dataToSend["weather"]["record"].filter(function (a) {
								var date = new Date(dateFormatter.formatDate(a.date));
								var hitDateMatchExists = date >= sDate && date <= eDate;
								if (hitDateMatchExists){
									if (info.includes("both")){
										ws = parseFloat(a.ws) * 600;
										tws += ws;
										if (parseFloat(a.sr) >= 100){
											sr = parseFloat(a.sr) * 600;
											tsr += sr;
										}
									}
									else if(info.includes("ws") && info.length == 2){
										ws = parseFloat(a.ws) * 600;
										tws += ws;
									}
									else if(info.includes("sr") && info.length == 2){
										if (parseFloat(a.sr) >= 100){
											sr = parseFloat(a.sr) * 600;
											tsr += sr;
										}
									}
									count++;
								}
								return hitDateMatchExists;
							});
							
							if (info.includes("both")){
								wsmth = parseFloat(resultData[0]["ws"]) * 600;
								twsmth += wsmth;
								if (parseFloat(resultData[0]["sr"]) >= 100){
									srmth = parseFloat(resultData[0]["sr"]) * 600;
									tsrmth += srmth;
								}
							}
							else if(info.includes("ws") && info.length == 2){
								wsmth = parseFloat(resultData[0]["ws"]) * 600;
								twsmth += wsmth;
							}
							else if(info.includes("sr") && info.length == 2){
								if (resultData[0]["sr"] >= 100){
									srmth = parseFloat(resultData[0]["sr"]) * 600;
									tsrmth += srmth;
								}
							}
							var countRecord = 1;
							for (var i = 1; i < count; i++){
								if (parseInt(resultData[i]["date"].toString().substring(3, 5)) == parseInt(resultData[i-1]["date"].toString().substring(3, 5))){
									if (info.includes("both")){
										wsmth = parseFloat(resultData[i]["ws"]);
										twsmth += wsmth;
										if (resultData[i]["sr"] >= 100){
											srmth = parseFloat(resultData[i]["sr"]);
											tsrmth += srmth;
										}
									}
									else if(info.includes("ws") && info.length == 2){
										wsmth = parseFloat(resultData[i]["ws"]);
										twsmth += wsmth;
									}
									else if(info.includes("sr") && info.length == 2){
										if (resultData[i]["sr"] >= 100){
											srmth = parseFloat(resultData[i]["sr"]);
											tsrmth += srmth;
										}
									}
	
									countRecord++;
	
									if (resultData[i + 1] == undefined){
										if (info.includes("both")){
											awsmth = twsmth / countRecord;
											awsmthArr.push(awsmth);
											srmthArr.push(tsrmth);
										}
										else if(info.includes("ws") && info.length == 2){
											awsmth = twsmth / countRecord;
											awsmthArr.push(awsmth);
										}
										else if(info.includes("sr") && info.length == 2){
											srmthArr.push(tsrmth);
										}
									}
									else if (parseInt(resultData[i + 1]["date"].toString().substring(3, 5)) != parseInt(resultData[i]["date"].toString().substring(3, 5))){
										if (info.includes("both")){
											awsmth = twsmth / countRecord;
											awsmthArr.push(awsmth);
											srmthArr.push(tsrmth);
										}
										else if(info.includes("ws") && info.length == 2){
											awsmth = twsmth / countRecord;
											awsmthArr.push(awsmth);
										}
										else if(info.includes("sr") && info.length == 2){
											srmthArr.push(tsrmth);
										}
									}
								}
							}
	
							if (info.includes("both")){
								tws = (tws * 6)/1000;
								taws = tws / count;
								tsr = (tsr / 6)/1000;
							}
							else if(info.includes("ws") && info.length == 2){
								tws = (tws * 6)/1000;
								taws = tws / count;
							}
							else if(info.includes("sr") && info.length == 2){
								tsr = (tsr / 6)/1000;
							}
						}
	
						data = JSON.stringify('{"awsmthArr": [' + awsmthArr + '], "srmthArr": [' + srmthArr + '], "taws":' + taws + ', "tsr":' + tsr + '}');
						res.writeHead(200, {'Content-Type': 'application/json'});
						res.write(data);
					}
					res.end();
				});
			})
		}
	})
}

function reqIco(path, res, postData){

}

exports.reqStart = reqStart;
exports.reqInfo = reqInfo;
exports.reqIco = reqIco;