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