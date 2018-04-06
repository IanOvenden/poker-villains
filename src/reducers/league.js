/**
 * @requires REDUX_ACTION_TYPES
 * @memberOf module:REDUX_REDUCERS
*/

import { REQUEST_LEAGUE, RECEIVE_LEAGUE } from '../constants/action-types';

/** Handles league slice of state object
 * 	@function league
 * 	@param {object} State Current state
 * 	@param {action} string Redux action
 *  @memberOf module:REDUX_REDUCERS
 * 	@returns {reducer} state new state
*/

export default function league( state = {
	isFetching: false,
	items: []
}, action ) {
	switch ( action.type ) {
	case REQUEST_LEAGUE:
		return Object.assign({}, state, {
			isFetching: true
		});
	case RECEIVE_LEAGUE:
		return Object.assign({}, state, {
			isFetching: false,
			items: action.entries,
			lastUpdated: action.receivedAt
		});
	default:
		return state;
	}
}
