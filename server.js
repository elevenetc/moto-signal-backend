/**
 * Created by eleven on 24/07/2016.
 */

const http = require('http');
const InvalidRequest = require('./exceptions/invalid-request');
const restHandlers = require('./rest-handlers');
const RestHandler = require('./rest/rest-handler');
const redis = require('redis').createClient();

class Server {

	constructor(port) {
		this.port = port;
	}

	start() {

		const server = this;

		this.initRedis();

		const port = this.port;
		http.createServer(function (request, response) {
			server.handleRequest(request, response)
		}).listen(port, function () {
			console.log("Server started", port);
		});
	}

	initRedis() {
		redis.on("error", function (err) {
			console.log(err);
		});
	}

	handleRequest(request, response) {

		const url = request.url.split('?')[0];

		console.log(request.method + ': ' + url);

		if (restHandlers.hasOwnProperty(url)) {

			var handler = restHandlers[url].create(redis);
			try {
				handler.handle(request, response);
			} catch (e) {
				this.handleError(response, e);
			}
		} else {
			this.handleError(response, new InvalidRequest(300, {'error': 'No mapped url: ' + url}));
		}
	}

	handleError(response, e) {

		console.log(e);

		let respBody = null;
		let respStatus = null;
		let respContentType = 'application/json';

		if (e instanceof InvalidRequest) {
			respStatus = e.status;
			respBody = e.body;
		} else {
			respStatus = 500;
			respBody = {error: e};
		}

		RestHandler.finalize(response, respStatus, respBody, respContentType);
	}
}

module.exports = Server;