/** @module
*  WEBSOCKETS
*/

import { UPDATE_STAGE_TITLE } from '../constants/action-types';

/** @constant
*   @type {string}
*	@description the hostname for the websockets server
*	@default
*   @memberOf module:WEBSOCKETS
*/

const host = 'localhost';

/** @constant
*   @type {number}
*	@description the port the WS server is listening on
*	@default
*   @memberOf module:WEBSOCKETS
*/

const port = 3000;

/** @constant
*   @type {array}
*	@description an array of actions to setup listeners for.
*	@default
*   @memberOf module:WEBSOCKETS
*/

const messageTypes = [
	UPDATE_STAGE_TITLE
].reduce( ( accum, msg ) => {
	accum[ msg ] = msg;
	return accum;
}, {});

module.exports = {
	port,
	host,
	messageTypes,
	uri: `http://${host}:${port}`
};
