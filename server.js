"use strict";

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-visu';

// Port where we'll run the websocket server
var webSocketsServerPort = Number(process.env.PORT || 3000);

// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');

// list of currently connected clients (users)
var clients = [ ];

/**
 * HTTP server
 */
var server = http.createServer(function(request, response) {

	// to do: how to pass the port to the other js files

	if (request.url == '/') {
		fs.readFile('front/index.html', function(err, page) {
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.write(page);
			response.end();
		});
	} else {
		var secPartReq = request.url.substr(1, request.url.length);

		if (secPartReq.substr(secPartReq.length - 3) === 'ico') {
			fs.readFile(secPartReq, function(err, ico) {
				response.writeHead(200, {'Content-Type': 'image/x-icon'});
				response.write(ico);
				response.end();
			});
		}

		if (secPartReq.substr(secPartReq.length - 4) === 'json') {
			fs.readFile(secPartReq, function(err, ico) {
				response.writeHead(200, {'Content-Type': 'application/json'});
				response.write(ico);
				response.end();
			});
		}

		if (secPartReq.substr(secPartReq.length - 3) === 'css') {
			fs.readFile('front/' + secPartReq, function(err, css) {
				response.writeHead(200, {'Content-Type': 'text/css'});
				response.write(css);
				response.end();
			});
		}

		if (secPartReq.substr(secPartReq.length - 2) === 'js') {
			fs.readFile('front/' + secPartReq, function(err, js) {
				response.writeHead(200, {'Content-Type': 'application/javascript'});
				response.write(js);
				response.end();
			});
		}

		if (secPartReq.substr(secPartReq.length - 4) === 'html') {
			fs.readFile('front/' + secPartReq, function(err, html) {
				response.writeHead(200, {'Content-Type': 'text/html'});
				response.write(html);
				response.end();
			});
		}

		if (secPartReq.substr(secPartReq.length - 3) === 'gif' ||
			secPartReq.substr(secPartReq.length - 3) === 'GIF') {
			fs.readFile(secPartReq, function(err, html) {
				response.writeHead(200, {'Content-Type': 'image/gif'});
				response.write(html);
				response.end();
			});
		}
	}
});

server.listen(webSocketsServerPort, function() {
	console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
	// WebSocket server is tied to a HTTP server. WebSocket request is just
	// an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
	httpServer: server
});

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
	console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

	// accept connection - you should check 'request.origin' to make sure that
	// client is connecting from your website
	// (http://en.wikipedia.org/wiki/Same_origin_policy)
	var connection = request.accept(null, request.origin);
	// we need to know client index to remove them on 'close' event
	var index = clients.push(connection) - 1;

	console.log((new Date()) + ' Connection accepted.');

	// user sent some message
	connection.on('message', function(message) {

		if (message.type === 'utf8') {
			console.log((new Date()) + ' Received Parameters: '+ message.utf8Data);

			// broadcast message to all connected clients
			// var json = JSON.stringify({ type:'message', data: obj });
			for (var i=0; i < clients.length; i++) {
				clients[i].sendUTF(message.utf8Data);
			}
		}
	});

	// user disconnected
	connection.on('close', function(connection) {
		console.log((new Date()) + " Peer "
			+ connection.remoteAddress + " disconnected.");
		// remove user from the list of connected clients
		clients.splice(index, 1);
	});

});