/**
 * Created by eleven on 24/07/2016.
 */
const GCM = require('node-gcm');
const settings = require('../local-settings');
const PingHandler = require('./ping-handler');

const sender = new GCM.Sender(settings.gcmApiKey);

class GCMSender {

	constructor(redis) {
		this.redis = redis;
		this.pingHandler = null;
		this.maxPingDiffTime = 0;
		this.minPingDiffTime = Number.MAX_VALUE;
		this.lastDiffPingTime = 0;
	}

	start() {
		const ref = this;
		this.getToken(function (token) {

			if (token == null) {
				setTimeout(function () {
					ref.start();
				}, settings.checkTokensTime);
			} else {
				ref.ping(token);
			}
		});
	}

	getToken(tokenHandler) {

		if(tokenHandler === undefined || tokenHandler === null) throw new Error('undefined tokenHandler');

		const ref = this;
		ref.redis.keys('token*', function (error, tokens) {
			if (tokens.length > 0) {
				const token = tokens[0].replace('token-', '');
				tokenHandler(token);
			} else {
				tokenHandler(null);
			}
		});
	}

	postBackPing(token) {
		const ref = this;
		if (this.pingHandler != null) {

			this.lastDiffPingTime = Date.now() - this.pingHandler.initTime;
			if (this.lastDiffPingTime > this.maxPingDiffTime) this.maxPingDiffTime = this.lastDiffPingTime;
			if (this.lastDiffPingTime < this.minPingDiffTime) this.minPingDiffTime = this.lastDiffPingTime;

			console.log('ping back time: ' + this.lastDiffPingTime);

			this.pingHandler.clear();
			this.pingHandler = null;
			setTimeout(function () {
				ref.start();
			}, settings.pingRepeatTime);
		}
	}

	ping(token) {

		const ref = this;

		var message = new GCM.Message({
			data: {command: 'ping'}
		});

		sender.send(message, {registrationTokens: [token]}, function (err, response) {
			if (err) {
				ref.sendAlarm('unable to send gcm ping')
			} else {
				if (response.failure == 0) {
					console.log('gcm sent');
					ref.pingHandler = new PingHandler(token, function (token) {

						ref.getToken(function (newToken) {//check if token was deleted
							if (newToken !== null)
								ref.sendAlarm('cant receive ping response from ' + token);

							ref.start();
						})

					});
				} else {
					ref.sendAlarm('unable to send gcm ping')
				}

			}
		});
	}

	sendAlarm(message) {
		console.log('alarm:' + message)
	}
}

module.exports = GCMSender;