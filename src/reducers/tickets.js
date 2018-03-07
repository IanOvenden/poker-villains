/**
 * @requires REDUX_ACTION_TYPES
 * @memberOf module:REDUX_REDUCERS
*/
import { REQUEST_TICKETS, RECEIVE_TICKETS } from '../constants/action-types';

/** Handles tickets slice of state object
 * 	@function tickets
 * 	@param {object} State Current state
 * 	@param {action} string Redux action
 *  @memberOf module:REDUX_REDUCERS
 * 	@returns {reducer} state new state
*/

export default function tickets( state = {
	isFetchingTickets: false,
	itemTickets: []
}, action ) {
	switch ( action.type ) {
	case REQUEST_TICKETS:
		return Object.assign({}, state, {
			isFetchingTickets: true
		});
	case RECEIVE_TICKETS:

		let items = state.itemTickets;

		action.tickets.forEach( function( item ) {
			let tester = items.filter( function( v ) {
				return v.ticketId === item.ticketId;
			});
			if ( tester.length === 0 ) {
				items.push( item );
			}
		});

		return Object.assign({}, state, {
			isFetchingTickets: false,
			itemTickets: items,
			lastUpdated: action.receivedAt
		});
	default:
		return state;
	}
}
