import {LEAGUE_ENDPOINT} from '../constants/api';

/** Requests a list of league positions from the LEAGUE_ENDPOINT
 *  @memberOf module:API
 * 	@function apiGetLeague
 * 	@returns {json} Ajax data
*/

export function apiGetLeague() {
	return (
		fetch( LEAGUE_ENDPOINT )
	);
}
