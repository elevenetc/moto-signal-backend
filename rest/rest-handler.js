/**
 * Created by eleven on 24/07/2016.
 */
const urlUtils = require('url');
const InvalidRequest = require('../exceptions/invalid-request');

class RestHandler {

	constructor(redis) {
		this.redis = redis;
		this.request = null;
		this.response = null;

		this.method = null;
		this.url = null;
		this.queryMap = null;

		this.respBody = null;
		this.respStatus = 200;
		this.respContentType = 'application/json';

		this.queryParamsNames = [];
	}

	query(key) {
		return this.queryMap[key];
	}

	setQuery(queryParamsNames) {
		this.queryParamsNames = queryParamsNames;
	}

	handle(request, response) {
		this.request = request;
		this.response = response;
		this.method = request.method;
		this.url = request.url;
		this.queryMap = urlUtils.parse(this.url, true).query;

		this.checkQueryParamNames();

		if (this.method === 'GET') this.handleGet();
		else if (this.method === 'POST') this.handlePost();
		else if (this.method === 'DELETE') this.handleDelete();
	}

	handlePost() {

	}

	handleGet() {

	}

	handleDelete() {

	}

	internalFinalize() {
		RestHandler.finalize(this.response, this.respStatus, this.respBody, this.respContentType);
	}

	setResultError(result = 'undefined') {

	}

	setResultOk(result = 'undefined') {
		this.respStatus = 200;
		if (result === 'undefined') {
			this.respBody = {result: 'ok'};
		} else {
			this.respBody = {result: result};
		}
	}

	static finalize(response, respStatus, respBody, respContentType) {
		response.writeHead(respStatus, {
			'Content-Type': respContentType
		});

		if (typeof respBody !== 'string' || !(respBody instanceof String))
			respBody = JSON.stringify(respBody);

		response.end(respBody);
	}

	checkQueryParamNames() {
		let result = true;
		if (this.queryParamsNames) {
			for (let i = 0; i < this.queryParamsNames.length; i++) {

				const paramName = this.queryParamsNames[i];

				if (this.queryMap == null || this.queryMap[paramName] == 'undefined') {
					result = false;
					break;
				}
			}

		}

		if (!result) throw new InvalidRequest(300, 'invalid query params');
	}

}

module.exports = RestHandler;