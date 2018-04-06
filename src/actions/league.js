/** @module
 * REDUX_ACTIONS
 * @requires module:REDUX_ACTION_TYPES
*/

import {REQUEST_LEAGUE, RECEIVE_LEAGUE} from '../constants/action-types';

import {apiGetLeague} from '../api/league';

/** Action creator for REQUEST_LEAGUE
 * 	@function requestBoards
 * 	@returns {Action} REQUEST_LEAGUE
*/

export function requestLeague() {
	return {
		type: REQUEST_LEAGUE
	};
}

/** Action creator for RECEIVE_LEAGUE
 * 	@function receiveLeague
 * 	@param {json} json Update boards state with API response.
 * 	@returns {Action} RECEIVE_LEAGUE
*/

export function receiveLeague( json ) {
	return {
		type: RECEIVE_LEAGUE,
		entries: json,
		receivedAt: Date.now()
	};
}

/** API call to fetch league
 * 	@function fetchLeague
 *  @requires module:API~apiGetLeague
 * 	@returns {Promise} API response promise
*/

export function fetchLeague() {
	return dispatch => {
		dispatch( requestLeague() );
		return apiGetLeague()
		.then( response => response.json() )
		.then( json => dispatch( receiveLeague( json ) ) );
	};
}

/** Function to determine whether or not league list needs updating
 * 	@function shouldFetchLeague
 * 	@param {object} state
 * 	@returns {bool} - flag to determine where data should be refreshed
*/

export function shouldFetchLeague( state ) {
	const league = state.league;
	if ( !league ) {
		return true;
	} else if ( league.isFetching ) {
		return false;
	} else {
		return true;
	}
}

/** Wrapper function for checking whether or not to refresh league. Invoking fetchLeague if required.
 * 	@function fetchLeagueIfNeeded
*/

export function fetchLeagueIfNeeded() {
	return ( dispatch, getState ) => {
		if ( shouldFetchLeague( getState() ) ) {
			return dispatch( fetchLeague() );
		}
	};
}
