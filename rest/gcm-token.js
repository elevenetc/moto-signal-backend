/**
 * Created by eleven on 24/07/2016.
 */
const RestHandler = require('./rest-handler');
const TOKEN = 'token';

class GCMToken extends RestHandler {

	constructor(redis) {
		super(redis);
		this.setQuery([TOKEN]);
	}

	handlePost() {
		this.redis.set(this.getTokenKey(), true);
		this.setResultOk();
		this.internalFinalize();
	}

	handleDelete() {
		this.redis.del(this.getTokenKey());
		this.setResultOk();
		this.internalFinalize();
	}

	handleGet() {

		const handler = this;

		this.redis.get(this.getTokenKey(), function (error, result) {
			if (error) {
				console.log(error);
				handler.setResultError(error);
			} else {
				console.log(result);
				handler.setResultOk(result);
			}

			handler.internalFinalize();
		});
	}

	getTokenKey() {
		return 'token-' + this.query(TOKEN);
	}

	static create(redis) {
		return new GCMToken(redis);
	}
}

module.exports = GCMToken;