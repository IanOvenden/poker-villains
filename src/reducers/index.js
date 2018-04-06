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
import league from './league';

let reducer = combineReducers({league});

export default reducer;
