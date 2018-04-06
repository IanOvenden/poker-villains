/** @module
 * REDUX_ACTION_TYPES
*/

/**
 *  A Redux action fired.
 *	@typedef	{Object} Action
 *  @property   {String} type - The type of action.
 *  @global
 */

/**
 *   Request league positions.
 *   @event     REQUEST_LEAGUE
 *   @type      {Action}
 */

export const REQUEST_LEAGUE = 'REQUEST_LEAGUE';

/**
 *   Receieve a list of league positions.
 *   @event     RECEIVE_LEAGUE
 *   @type      {Action}
 */

export const RECEIVE_LEAGUE = 'RECEIVE_LEAGUE';
