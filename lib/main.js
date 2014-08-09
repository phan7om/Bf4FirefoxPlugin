'use strict';
var { Cc, Cu, Ci, Cr, Cm, components } = require('chrome');

var data = require("sdk/self").data;
//var self = require("sdk/self");
var tmr = require('sdk/timers');
var notifications = require("sdk/notifications");

var response = '';
//var myIconURL = self.data.url("myIcon.png");

tmr.setInterval(checkFavoritesByTimer, 5000); 

function checkFavoritesByTimer()
{
    var oReq = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Ci.nsIXMLHttpRequest);

    oReq.open("get", "http://battlelog.battlefield.com/bf4/servers/favourites/pc/", true);
    oReq.setRequestHeader('X-AjaxNavigation', '1');

    oReq.addEventListener("load", transferComplete, false);
    oReq.addEventListener("error", transferFailed, false);
    oReq.addEventListener("abort", transferCanceled, false);
    
    oReq.send();

    function transferComplete(e) {
	console.log("The transfer is complete.");
	//console.log(this, e, e.type, this.responseText);
	console.log(this.responseText);
	response = JSON.parse(this.responseText);
	
	var mes;
	if (response.partial) {
	    mes = 'Partial!';
	} else {
	    mes = 'Not partial!';
	}
	
	notifications.notify({
	    text: mes
	    //iconURL: myIconURL
	});
    }

    function transferFailed(evt) {
	console.log("An error occurred while transferring the file.");
    }

    function transferCanceled(evt) {
	console.log("The transfer has been canceled by the user.");
    }
    
    console.log('call ok');
}
