"use strict";
//----edited from https://codepen.io/dudleystorey/pen/qEoKzZ--------------------------------------------
var bgImageArray = ["sunny.jpg", "cloudy.jpg", "rainy.jpg", "thunder.jpg"],
base = "http://ceto.murdoch.edu.au:40511/assignment2/images/",
secs = 3;
bgImageArray.forEach(function(img){
    new Image().src = base + img; 
    // caches images, avoiding white flash between background replacements
});

function backgroundSequence() {
	window.clearTimeout();
	var k = 0;
	for (var i = 0; i < bgImageArray.length; i++) {
		setTimeout(function(){ 
			// document.documentElement.style.background = "url(" + base + bgImageArray[k] + ") no-repeat center center fixed";
			// document.documentElement.style.backgroundSize ="cover";
            document.getElementById("header").style.background = "url(" + base + bgImageArray[k] + ") no-repeat center center fixed";
			document.getElementById("header").style.backgroundSize ="cover";
            if ((k + 1) === bgImageArray.length) {
                setTimeout(function() {
                        backgroundSequence();
                    }, (secs * 1000))
            }
            else {
                k++;
            }
		}, (secs * 1000) * i)	
	}
}
backgroundSequence();
//----edited from https://codepen.io/dudleystorey/pen/qEoKzZ--------------------------------------------

function loading(){
    var div = $("#load");
    document.getElementById("load").innerHTML = "Loading.";
    div.css("display", "flex");
    window.setInterval( function() {
        if ( div.text().length > 11 ) 
            document.getElementById("load").innerHTML = "Loading.";
        else 
            document.getElementById("load").innerHTML += " .";
        }, 500);
}

function submitForm(){
    var info = "", fmth, yr, tmth, invalid = $("#invalid"), graph = $("#graphDisp"), noSearch = $("#noSearch"), ftbl = $("#filteredTable"), fgrph = $("#filteredGraph"), error = $("#error");
    $('input[name="measure"]:checked').each(function() {
        info += this.value;
    });
    fmth = $('#fmth').find(":selected").val();
    yr = $('#yr').val();
    tmth = $('#tmth').find(":selected").val();
    var valid = $.isNumeric(yr) && info != "" && (fmth == "0" && tmth == "0" || fmth != "0" && parseInt(fmth) < parseInt(tmth));

    if (valid){
        invalid.css("display", "none");
        noSearch.css("display", "none");
        $.ajax({
            url: "/retrieveInfo",
            data: {smth: fmth, emth : tmth, year: yr, info: info},
            method: 'POST',
            success: function(data){
                var res = JSON.parse(data);
                if (res["error"] == undefined){
                    var table = createTable(res);
                    $("#filteredTable").html(table);
                    var id = [];
                    var labelInfo = [];
                    var scales;
                    var graphData;
                    var labelMth = [];
                    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    for (var i = 0; i < 12; i++){
                        if (i + 1 >=parseInt(fmth) && i + 1 <= parseInt(tmth)){
                            labelMth.push(months[i]);
                        }
                    }
                    if (info.includes("both")){
                        labelInfo.push("Average Wind Speed");
                        labelInfo.push("Total Solar Radiation");
                        id.push("ws");
                        id.push("sr");
                        scales = [{
                            id: id[0],
                            type: 'linear',
                            position: 'left',
                            }, {
                            id: id[1],
                            type: 'linear',
                            position: 'right',
                            r: {
                                max: 100,
                                min: 0,
                                ticks: {
                                    stepSize: 0.5
                                }
                            }
                        }];
                        graphData = {
                            type: 'line',
                            data: {
                                labels: labelMth,
                                datasets: [{
                                    label: labelInfo[0],
                                    yAxisID: id[0],
                                    data: res["awsmthArr"]
                                }, {
                                    label: labelInfo[1],
                                    yAxisID: id[1],
                                    data: res["srmthArr"],
                                    borderColor: "#bae755",
                                    borderDash: [5, 5],
                                    backgroundColor: "#e755ba",
                                    pointBackgroundColor: "#55bae7",
                                    pointBorderColor: "#55bae7",
                                    pointHoverBackgroundColor: "#55bae7",
                                    pointHoverBorderColor: "#55bae7",
                                }]
                            },
                            options: {
                                scales: {
                                    yAxes: scales
                                }
                            }
                        }
                    }
                    else if(info.includes("ws") && info.length == 2){
                        labelInfo.push("Average Wind Speed");
                        id.push("ws");
                        scales = [{
                            id: 'ws',
                            type: 'linear',
                            position: 'left',
                            r: {
                                max: 100,
                                min: 0,
                                ticks: {
                                    stepSize: 0.5
                                }
                            }
                        }];
                        graphData = {
                            type: 'line',
                            data: {
                                labels: labelMth,
                                datasets: [{
                                    label: labelInfo[0],
                                    yAxisID: id[0],
                                    data: res["awsmthArr"]
                                }]
                            },
                            options: {
                                scales: {
                                    yAxes: scales
                                }
                            }
                        }
                    }
                    else if(info.includes("sr") && info.length == 2){
                        labelInfo.push("Total Solar Radiation");
                        id.push("sr");
                        scales = [{
                            id: 'sr',
                            type: 'linear',
                            position: 'left',
                            r: {
                                max: 100,
                                min: 0,
                                ticks: {
                                    stepSize: 0.5
                                }
                            }
                        }];
                        graphData = {
                            type: 'line',
                            data: {
                                labels: labelMth,
                                datasets: [{
                                    label: labelInfo[0],
                                    yAxisID: id[0],
                                    data: res["srmthArr"]
                                }]
                            },
                            options: {
                                scales: {
                                    yAxes: scales
                                }
                            }
                        }
                    }
                    createGraph(graph, graphData);
                    toggleView();
                    error.css("display", "none");
                }
                else{
                    error.html(res["error"]);
                    error.css("display", "flex");
                    ftbl.css("display", "none");
                    fgrph.css("display", "none");
                    invalid.css("display", "none");
                }
            },
            error: function(err) {
                console.log(err);
            },
        });    
    }
    else{
        invalid.css("display", "flex");
        noSearch.css("display", "none");
        ftbl.css("display", "none");
        fgrph.css("display", "none");
    }
}

function ns(){
    var info = "", fmth, yr, tmth, invalid = $("#invalid"), graph = $("#graphDisp"), noSearch = $("#noSearch");
    $('input[name="measure"]:checked').each(function() {
        info += this.value;
    });
    fmth = $('#fmth').find(":selected").val();
    yr = $('#yr').val();
    tmth = $('#tmth').find(":selected").val();
    if (info == "" && fmth == "0" && yr == "" && tmth == "0"){
        noSearch.css("display", "flex");
    }
}

function createGraph(filteredGraph, data){
    var lineChart = new Chart(filteredGraph, data);
}

function createTable(data){
    var table = "<table id='tbl'>";
    for (var i = 0; i < 6; i++){
        if (i==0){
            table += "<tr><th>Jan</th><th>Feb</th><th>Mar</th><th>Apr</th></tr>";
        }
        else if(i==1){
            table += "<tr>";
            for(var y=0; y < 4; y++){
                var ws, sr;
                if (data["awsmthArr"][y] == 0 || data["awsmthArr"][y] == undefined){
                    console.log(data["awsmthArr"]);
                    ws = "";
                }
                else{
                    ws = data["awsmthArr"][y].toFixed(2) + "km/h; ";
                }
                if (data["srmthArr"][y] == 0 || data["srmthArr"][y] == undefined){
                    sr = "";
                }
                else{
                    console.log(data["srmthArr"][y]);
                    sr = data["srmthArr"][y].toFixed(2) + "kWh/m<sup>2</sup>";
                }
                table += "<td>" + ws + sr + "</td>";
            }
            table += "</tr>";
        }
        else if (i==2){
            table += "<tr><th>May</th><th>Jun</th><th>Jul</th><th>Aug</th></tr>";
        }
        else if (i==3){
            table += "<tr>";
            for(var y=4; y < 8; y++){
                var ws, sr;
                if (data["awsmthArr"][y] == undefined || data["awsmthArr"][y] == 0){
                    ws = "";
                }
                else{
                    ws = data["awsmthArr"][y].toFixed(2) + "km/h; ";
                }
                if (data["srmthArr"][y] == undefined || data["srmthArr"][y] == 0){
                    sr = "";
                }
                else{
                    sr = data["srmthArr"][y].toFixed(2) + "kWh/m<sup>2</sup>";
                }
                table += "<td>" + ws + sr + "</td>";
            }
            table += "</tr>";
        }
        else if (i==4){
            table += "<tr><th>Sep</th><th>Oct</th><th>Nov</th><th>Dec</th></tr>";
        }
        else if (i==5){
            table += "<tr>";
            for(var y=8; y < 12; y++){
                var ws, sr;
                if (data["awsmthArr"][y] == undefined || data["awsmthArr"][y] == 0){
                    ws = "";
                }
                else{
                    ws = data["awsmthArr"][y].toFixed(2) + "km/h; ";
                }
                if (data["srmthArr"][y] == undefined || data["srmthArr"][y] == 0){
                    sr = "";
                }
                else{
                    sr = data["srmthArr"][y].toFixed(2) + "kWh/m<sup>2</sup>";
                }
                table += "<td>" + ws + sr + "</td>";
            }
            table += "</tr>";
        }
    }
    var taws, tsr;
    if (data.taws == 0){
        taws = "";
    }
    else{
        taws = "Total average(Wind Speed): " + data.taws + "km/h; ";
    }
    if (data.tsr == 0){
        tsr = "";
    }
    else{
        tsr = "Total(solar radiation): " + data.tsr + "kWh/m<sup>2</sup>";
    }
    table += "<tr><td colspan='4'>" + taws + tsr + "</td></tr>";
    table += "</table>";
    return table;
}

function toggleView(){
    var table = $("#filteredTable"), graph = $("#filteredGraph"), none = $("#noView"), tablec = $("#table"), graphc = $("#graph"), bothc = $("#bothDisp"), invalid = $("#invalid");
    if (bothc.prop('checked')){
        tablec.prop('checked', true);
        graphc.prop('checked', true);
        table.css("display", "flex");
        graph.css("display", "flex");
        none.css("display", "none");
        invalid.css("display", "none");
        if ($(window).innerWidth <=1440){
            table.css("width", "100%");
            graph.css("width", "100%");
        }
        else{
            table.css("width", "50%");
            graph.css("width", "50%");
        }
    }
    if (tablec.prop("checked") && graphc.prop("checked") == false){
        bothc.prop('checked', false);
        table.css("display", "flex");
        graph.css("display", "none");
        none.css("display", "none");
        invalid.css("display", "none");
        table.css("width", "100%");
    }
    if (tablec.prop("checked") == false && graphc.prop("checked")){
        bothc.prop('checked', false);
        table.css("display", "none");
        graph.css("display", "flex");
        none.css("display", "none");
        invalid.css("display", "none");
        graph.css("width", "100%");
    }
    if (tablec.prop("checked") == false && graphc.prop("checked") == false){
        bothc.prop('checked', false);
        table.css("display", "none");
        graph.css("display", "none");
        none.css("display", "flex");
        invalid.css("display", "none");
    }
    if (tablec.prop("checked") && graphc.prop("checked")){
        bothc.prop('checked', true);
        table.css("display", "flex");
        graph.css("display", "flex");
        none.css("display", "none");
        invalid.css("display", "none");
        if ($(window).innerWidth <=1440){
            table.css("width", "100%");
            graph.css("width", "100%");
        }
        else{
            table.css("width", "50%");
            graph.css("width", "50%");
        }
    }
}

function toggleInfo(){
    var wsc = $("#ws"), src = $("#sr"), wssrc = $("#both");
    if (wssrc.prop('checked')){
        wsc.prop('checked', true);
        src.prop('checked', true);
    }
    if (wsc.prop("checked") && src.prop("checked") == false){
        wssrc.prop('checked', false);
    }
    if (wsc.prop("checked") == false && src.prop("checked")){
        wssrc.prop('checked', false);
    }
    if (wsc.prop("checked") == false && wsc.prop("checked") == false){
        wssrc.prop('checked', false);
    }
    if (wsc.prop("checked") && src.prop("checked")){
        wssrc.prop('checked', true);
    }
}

$(document).ajaxStart(function(){
    loading();
});

$(document).ajaxStop(function(){
    console.log("stop load");
    $("#load").css("display", "none");
    $("#load").html("Loading.");
});

$(function(){
    changeSize();
    var submit = $("#submit");
    var fmth = $("#fmth"), tmth = $("#tmth"), yr = $("#yr"), wsc = $("#ws"), src = $("#sr"), wssrc = $("#both"),
    tablec = $("#table"), graphc = $("#graph"), bothc = $("#bothDisp");

    bothc.prop('checked', true);
    tablec.prop('checked', true);
    graphc.prop('checked', true);
    wssrc.prop('checked', true);
    wsc.prop('checked', true);
    src.prop('checked', true);

    function changeSize(){
        $(window).on('resize', function(){
            var win = $(this);
            if (win.innerWidth <= 1440) 
            {
                $("#dispContent").css("flex-direction", "column");
            }
            else{$("#dispContent").css("flex-direction", "row");}
        });
    }

    $(window).on('resize', function(){
        var win = $(this);
        if (win.width() <= 1440) {$("#dispContent").css("flex-direction", "column");}
        else{$("#dispContent").css("flex-direction", "row");}
    });

    $("#startBtn").click(function(){
        window.location = "http://ceto.murdoch.edu.au:40511/assignment2/index.html#main";
    });

    tablec.change(function(){
        if (bothc.prop('checked')){
            bothc.prop('checked', false);
        }
        toggleView();
    });

    graphc.change(function(){
        if (bothc.prop('checked')){
            bothc.prop('checked', false);
        }
        toggleView();
    });
    
    bothc.change(function(){
        if (bothc.prop('checked') == false){
            tablec.prop('checked', false);
            graphc.prop('checked', false);
        }
        toggleView();
    });

    submit.on('click', function(e){
        e.preventDefault();
        submitForm();
    });

    wsc.change(function(){
        if (wssrc.prop('checked')){
            wssrc.prop('checked', false);
        }
        toggleInfo();
        ns();
        if($.trim(yr.val()).length == 4){
            submit.click();
        }
    });

    src.change(function(){
        if (wssrc.prop('checked')){
            wssrc.prop('checked', false);
        }
        toggleInfo();
        ns();
        if($.trim(yr.val()).length == 4){
            submit.click();
        }
    });
    
    wssrc.change(function(){
        if (wssrc.prop('checked') == false){
            wsc.prop('checked', false);
            src.prop('checked', false);
        }
        toggleInfo();
        ns();
        if($.trim(yr.val()).length == 4){
            submit.click();
        }
    });

    yr.on("input", function(){
        ns();
        if($.trim(yr.val()).length == 4){
            submit.click();
        }
    });

    fmth.change(function(){
        ns();
        if($.trim(yr.val()).length == 4){
            submit.click();
        }
    });

    tmth.change(function(){
        ns();
        if($.trim(yr.val()).length == 4){
            submit.click();
        }
    });
});