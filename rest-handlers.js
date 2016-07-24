/**
 * Created by eleven on 24/07/2016.
 */
const GCMToken = require('./rest/gcm-token');
const BackPing = require('./rest/back-ping');

module.exports = {
	'/gcmToken': GCMToken,
	'/backPing': BackPing
};