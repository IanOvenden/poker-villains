/** @module
*  API
*/

/** @constant
*	@type {string}
*	@description Service layer domain which hosts our endpoints
*	@default
*	@private
*   @memberOf module:API
*/

// APIARY
export const API_URL = 'https://private-c05f7-snapimock.apiary-mock.com';

// LOCAL
//export const API_URL = 'http://snap-local:8090';

// AWS
//export const API_URL = 'http://snapidevtest.csproject.org:8090';

//const API_URL = 'http://192.168.33.11:8090';

/** @constant
*   @type {string}
*	@description /snapi/boards - Enpoint for listing available boards.
*	@default
*   @memberOf module:API
*/
export const BOARDS_ENDPOINT = API_URL + '/snapi/boards';
export const BOARDS_ENDPOINT_RAW = '/snapi/boards';

//export const BOARDS_ENDPOINT = API_URL + '/db/snap-demo/boards';

/** @constant
*   @type {string}
*	@description /snapi/boards/{boardId}/stages - Enpoint for listing stages of a given board.
*	@default
*   @memberOf module:API
*/
export const STAGES_ENDPOINT = API_URL + '/snapi/boards/{boardId}/stages';
export const STAGES_ENDPOINT_RAW = '/snapi/boards/{boardId}/stages';

//export const STAGES_ENDPOINT = API_URL + '/snapi/boards/3/stages';

/** @constant
*   @type {string}
*	@description /snapi/boards/{boardId}/stages/{stageId}/tickets - Enpoint for listing tickets of a given stage.
*	@default
*   @memberOf module:API
*/
export const TICKETS_ENDPOINT = API_URL + '/snapi/boards/{boardId}/stages/{stageId}/tickets';
export const TICKETS_ENDPOINT_RAW = '/snapi/boards/{boardId}/stages/{stageId}/tickets';
