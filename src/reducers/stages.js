/**
 * @requires REDUX_ACTION_TYPES
 * @memberOf module:REDUX_REDUCERS
*/

import { REQUEST_STAGES, RECEIVE_STAGES, STAGE_UPDATE_TICKET_LOAD, UPDATE_STAGE_TITLE } from '../constants/action-types';

/** Handles stages slice of state object
 * 	@function stages
 * 	@param {object} State Current state
 * 	@param {action} string Redux action
 *  @memberOf module:REDUX_REDUCERS
 * 	@returns {reducer} state new state
*/

export default function stages( state = {
	isFetchingStages: false,
	itemStages: []
}, action ) {
	switch ( action.type ) {
	case REQUEST_STAGES:
		return Object.assign({}, state, {
			isFetchingStages: true
		});
	case RECEIVE_STAGES:
		let items = [];
		action.stages.map( ( stage ) =>
			items.push( Object.assign( stage, { isFetchingTickets: false }) )
		);
		return Object.assign({}, state, {
			isFetchingStages: false,
			itemStages: items,
			lastUpdated: action.receivedAt
		});
	case STAGE_UPDATE_TICKET_LOAD:
		return Object.assign({}, ...state,
			{
				isFetchingStages: false,
				itemStages: Object.keys( state.itemStages ).reduce( ( newItems, stageId ) => {
					const oldItem = state.itemStages[stageId];
					if ( oldItem.stageId === action.stageId ) {
						newItems[stageId] = { ...oldItem, isFetchingTickets: action.status };
					} else {
						newItems[stageId] = oldItem;
					}
					return newItems;
				}, [] )
			}
		);
	case UPDATE_STAGE_TITLE:
		return Object.assign({}, ...state,
			{
				isFetchingStages: false,
				itemStages: Object.keys( state.itemStages ).reduce( ( newItems, stageId ) => {
					const oldItem = state.itemStages[stageId];
					if ( oldItem.stageId === action.payload.stageId ) {
						newItems[stageId] = { ...oldItem, name: action.payload.stageTitle };
					} else {
						newItems[stageId] = oldItem;
					}
					return newItems;
				}, [] )
			}
		);
	default:
		return state;
	}
}
