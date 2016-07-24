/**
 * Created by eleven on 24/07/2016.
 */
class InvalidRequest {

	constructor(status, error) {
		this.status = status;
		this.body = {'error': error};
	}
}
module.exports = InvalidRequest;