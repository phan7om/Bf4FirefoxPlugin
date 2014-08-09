'use strict';
var { Cc, Cu, Ci, Cr, Cm, components } = require('chrome');

var data = require("sdk/self").data;
//var self = require("sdk/self");
var tmr = require('sdk/timers');
var notifications = require("sdk/notifications");
var pageworker = require ("sdk/page-worker");

var response = '';
//var myIconURL = self.data.url("myIcon.png");

tmr.setInterval(checkFavoritesByTimer, 60000);

checkFavoritesByTimer();

function checkFavoritesByTimer() {
    
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

	var header = "Плотина на:\n";
	var mes = '';
	var n = 1;
	if ('globalContext' in response) {
	    for(var i = 0; i < response.globalContext.servers.length; i++) {
		if (response.globalContext.servers[i].map == 'MP_Damage') {
		    mes += n++ + '. ' + response.globalContext.servers[i].name + "\n";
		}
	    }
	} else {
	    mes = "You have to login";
	    header = '';
	}
	
	if (mes != '') {
	    notifications.notify({
		text: header + mes
		//iconURL: myIconURL
	    });

	    pageworker.Page({
		contentScript: "new Audio('alarm.ogg').play()",
		contentURL: data.url("blank.html")
	    });
	}
    }

    function transferFailed(evt) {
	notifications.notify({
	    text: "An error occurred while transferring the file."
	});
    }

    function transferCanceled(evt) {
	notifications.notify({
	    text: "The transfer has been canceled by the user."
	});
    }
}
