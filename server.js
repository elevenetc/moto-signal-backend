/**
 * Created by eleven on 24/07/2016.
 */

const http = require('http');
const InvalidRequest = require('./exceptions/invalid-request');
const restHandlers = require('./rest-handlers');

class Server {

	constructor(port) {
		this.port = port;
	}

	start() {
		const port = this.port;
		http.createServer(this.handleRequest).listen(port, function () {
			console.log("Server started", port);
		});
	}

	handleRequest(request, response) {

		const url = request.url.split('?')[0];

		console.log(request.method + ': ' + url);

		let respBody = null;
		let respStatus = null;
		let respContentType = 'application/json';

		if (restHandlers.hasOwnProperty(url)) {
			var handler = restHandlers[url].create();
			try {
				handler.handle(request, response);
				respStatus = handler.respStatus;
				respBody = handler.respBody;
			} catch (e) {

				console.log(e);

				if (e instanceof InvalidRequest) {
					respStatus = e.status;
					respBody = e.body;
				} else {
					respStatus = 500;
					respBody = {error: 'Server error'};
				}

			}

		} else {
			respStatus = 300;
			respBody = {'error': 'No mapped url: ' + url};
		}

		//finalize

		response.writeHead(respStatus, {
			'Content-Type': respContentType
		});

		if (typeof respBody !== 'string' || !(respBody instanceof String))
			respBody = JSON.stringify(respBody);

		response.end(respBody);

	}
}

module.exports = Server;