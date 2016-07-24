/**
 * Created by eleven on 24/07/2016.
 */
const settings = require('../local-settings');

class PingHandler {
	constructor(token, alarmHandler) {
		this.token = token;
		this.isWaiting = true;
		this.alarmTimer = null;
		this.alarmHandler = alarmHandler;
		this.init();
	}

	init() {
		const ref = this;
		this.alarmTimer = setTimeout(function () {
			ref.alarmHandler(ref.token);
		}, settings.alarmTimeDiff);
	}

	clear() {
		clearTimeout(this.alarmTimer);
	}
}

module.exports = PingHandler;