/** @module
 * REDUX_REDUCERS
 * @requires REDUX_ACTION_TYPES
*/

/**
 *  React reducer function
 *	@typedef	{function} Reducer
 *	@global
 */

import { combineReducers } from 'redux';
import boards from './boards';
import stages from './stages';
import tickets from './tickets';

let reducer = combineReducers({boards, stages, tickets});

export default reducer;
