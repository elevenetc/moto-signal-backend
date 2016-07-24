/**
 * Created by eleven on 24/07/2016.
 */
const RestHandler = require('./rest-handler');
const TOKEN = 'token';

class BackPing extends RestHandler {

	constructor(redis, gcmSender) {
		super(redis);
		/**
		 * @type {GCMSender}
		 */
		this.gcmSender = gcmSender;
		this.setQuery([TOKEN]);
	}

	handlePost() {
		this.gcmSender.postBackPing(this.query(TOKEN));
		this.setResultOk();
		this.internalFinalize();
	}

	static create(redis, gcmSender) {
		return new BackPing(redis, gcmSender);
	}
}
module.exports = BackPing;