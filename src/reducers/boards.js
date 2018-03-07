/**
 * @requires REDUX_ACTION_TYPES
 * @memberOf module:REDUX_REDUCERS
*/

import { REQUEST_BOARDS, RECEIVE_BOARDS } from '../constants/action-types';

/** Handles board slice of state object
 * 	@function boards
 * 	@param {object} State Current state
 * 	@param {action} string Redux action
 *  @memberOf module:REDUX_REDUCERS
 * 	@returns {reducer} state new state
*/

export default function boards( state = {
	isFetching: false,
	items: []
}, action ) {
	switch ( action.type ) {
	case REQUEST_BOARDS:
		return Object.assign({}, state, {
			isFetching: true
		});
	case RECEIVE_BOARDS:
		return Object.assign({}, state, {
			isFetching: false,
			items: action.boards,
			lastUpdated: action.receivedAt
		});
	default:
		return state;
	}
}
