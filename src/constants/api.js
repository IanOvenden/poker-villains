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

/** @constant
*   @type {string}
*	@description /snapi/boards - Enpoint for listing available boards.
*	@default
*   @memberOf module:API
*/
export const LEAGUE_ENDPOINT = API_URL + '/snapi/boards';
export const LEAGUE_ENDPOINT_RAW = '/snapi/boards';
