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
 *   Request user boards.
 *   @event     REQUEST_BOARDS
 *   @type      {Action}
 */

export const REQUEST_BOARDS = 'REQUEST_BOARDS';

/**
 *   Receieve a list of boards.
 *   @event     RECEIVE_BOARDS
 *   @type      {Action}
 */

export const RECEIVE_BOARDS = 'RECEIVE_BOARDS';

/**
 *   Request a list of stages associated with a board.
 *   @event     REQUEST_STAGES
 *   @type      {Action}
 */

export const REQUEST_STAGES = 'REQUEST_STAGES';

/**
 *   Receieve a list of stages associated with a board.
 *   @event     RECEIVE_STAGES
 *   @type      {Action}
 */

export const RECEIVE_STAGES = 'RECEIVE_STAGES';

/**
 *   Request a list of tickets associated with a stage and board.
 *   @event     REQUEST_TICKETS
 *   @type      {Action}
 */

export const REQUEST_TICKETS = 'REQUEST_TICKETS';

/**
 *   Receive a list of tickets associated with a stage and board.
 *   @event     RECEIVE_TICKETS
 *   @type      {Action}
 */

export const RECEIVE_TICKETS = 'RECEIVE_TICKETS';

/**
 *   Update the isFetchingTickets flag against the appropriate stage.
 *   @event     STAGE_UPDATE_TICKET_LOAD
 *   @type      {Action}
 */

export const STAGE_UPDATE_TICKET_LOAD = 'STAGE_UPDATE_TICKET_LOAD';

/**
 *   Emitted when the user updates a stage title
 *   @event     UPDATE_STAGE_TITLE
 *   @type      {Action}
 */

export const UPDATE_STAGE_TITLE = 'UPDATE_STAGE_TITLE';
