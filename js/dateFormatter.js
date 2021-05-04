"use strict";
function formatDate(inputDate){
	var day = inputDate.toString().substring(0, 2);
	var month = inputDate.toString().substring(3, 5);
	var year = inputDate.toString().substring(6);
	var date = year + "-" + month + "-" + day;
	return date;
}

function formatSDate(inputMth, inputYr){
	var month = inputMth;
	var year = inputYr;
	var date = year + "-" + month + "-01";
	return date;
}

function formatEDate(inputMth, inputYr){
	var month = inputMth;
	var year = inputYr;
	var day = "";
	if (parseInt(month) % 2 && parseInt(month) < 9){
		day = "31";
	}
	else if (parseInt(month) % 2 && parseInt(month) > 7){
		day = "30";
	}
	else if(parseInt(month) % 2 == 0 && parseInt(month) > 6 && parseInt(month) != 2){
		day = "31";
	}
	else if(parseInt(month) % 2 == 0 && parseInt(month) < 8 && parseInt(month) != 2){
		day = "30";
	}
	else if (parseInt(year) % 4 == 0 && parseInt(month) == 2){
		day = "29";
	}
	else if (parseInt(year) % 4 == 0 && parseInt(month) == 2){
		day = "28";
	}
	var date = year + "-" + month + "-" + day;
	return date;
}

exports.formatDate = formatDate;
exports.formatSDate = formatSDate;
exports.formatEDate = formatEDate;