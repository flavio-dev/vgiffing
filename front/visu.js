$(function () {
	"use strict";

	// var WebSocketClient = require('websocket').client;
	// var client = new WebSocketClient();

	// for better performance - to avoid searching in DOM
	var $visu = $('.visu'),
		$backgroundVisu = $('.background__visu'),
		isPlaying = false,
		bpms = 120,
		everyXBeats = 4,
		order = "random",
		hidebg = false,
		blurbg = true,
		listUrls = [],
		current = 0;

	var date = new Date();
	var sessionId = "" + date.getDate() + date.getMonth() + date.getHours() + date.getMinutes()+ date.getSeconds() + date.getMilliseconds();

	// if user is running mozilla then use it's built-in WebSocket
	window.WebSocket = window.WebSocket || window.MozWebSocket;

	// if browser doesn't support WebSocket, just show some notification and exit
	if (!window.WebSocket) {
		$visu.html($('<p>', { text: 'Sorry, but your browser doesn\'t support WebSockets.'} ));
		return;
	}

	// open connection
	var host = window.location.host,
		protocol = (window.location.protocol === 'https:') ? 'wss:' : 'ws:',
		connection = new WebSocket(''+protocol+host);

	connection.onopen = function () {
		$visu.html($('<p>', { text: 'This is your visu screen.'}));
		$visu.append($('<p>', { text: 'Your session id is the: '+ sessionId} ));
		$visu.append($('<p>', { text: 'Please copy this number on the \'Session Id\' field of your parameter screen'}));
	};

	connection.onerror = function (error) {
		// just in there were some problems with conenction...
		$visu.html($('<p>', { text: 'Sorry, but there\'s some problem with your connection or the server is down.' } ));
	};

	// most important part - incoming messages
	connection.onmessage = function (message) {
		// try to parse JSON message. Because we know that the server always returns
		// JSON this should work without any problem but we should make sure that
		// the massage is not chunked or otherwise damaged.
		var json;
		try {
			json = JSON.parse(message.data);
		} catch (e) {
			return;
		}

		if (json.sessionId === sessionId) {

			bpms = json.bpms;
			everyXBeats = json.everyXBeats;
			order = json.order;
			hidebg = json.hidebg;
			blurbg = json.blurbg;
			listUrls = json.listUrls;

			if (!isPlaying) {
				playVisu();
				isPlaying = true;
			}
		}
	};

	/**
	 * Add message to the chat window
	 */
	function playVisu() {
		var time = 60 / parseInt(bpms) * parseInt(everyXBeats) * 1000;
		var i = 0;

		if (order == 'ordered') {
			i = current;
			if ((current + 1) < listUrls.length) {
				current++;
			} else {
				current = 0;
			}
		} else {
			i = Math.floor(Math.random() * listUrls.length);
		}

		if ($backgroundVisu.hasClass('background__visu--blur') && blurbg === false) {
			$backgroundVisu.removeClass('background__visu--blur');
		} else if (!$backgroundVisu.hasClass('background__visu--blur') && blurbg === true) {
			$backgroundVisu.addClass('background__visu--blur');
		}

		if ($backgroundVisu.hasClass('background__visu--hide') && hidebg === false) {
			$backgroundVisu.removeClass('background__visu--hide');
		} else if (!$backgroundVisu.hasClass('background__visu--hide') && hidebg === true) {
			$backgroundVisu.addClass('background__visu--hide');
		}

		$visu.html('<img src="'+listUrls[i].url+'"" />');
		$backgroundVisu.css('background-image', 'url("'+listUrls[i].url+'")');

		setTimeout(function() {
			playVisu();
		}, time);
	}
});