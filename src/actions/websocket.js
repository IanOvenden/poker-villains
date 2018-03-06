import io from 'socket.io-client';
import {messageTypes, uri} from '../constants/websocket.js';

/** @constant
*   @type {object}
*		@description the socket to listen on
*		@default
*   @memberOf module:WEBSOCKETS
*/

const socket = io( uri );

/** @constant
*   @type {function}
*		@description loops through each of the websocket message types and adds a listener.  When activated the message is re-dispatched as an action
*		@default
*   @memberOf module:WEBSOCKETS
*/

export const init = ( store ) => {
	// add listeners to socket messages so we can re-dispatch them as actions
	Object.keys( messageTypes )
		.forEach( type => socket.on( type, ( payload ) => store.dispatch({ type, payload }) ) );
};

/** @constant
*   @type {function}
*	@description function to send a websocket message upon the action of a user.
*	@default
*   @memberOf module:WEBSOCKETS
*/

export const emit = ( type, payload ) => socket.emit( type, payload );
