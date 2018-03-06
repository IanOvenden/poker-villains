import { SocketIO as socketIO, Server } from 'mock-socket';
import {messageTypes, uri} from '../../../src/constants/websocket.js';

//SERVER
export const mockServer = new Server( uri );

let messages = [];

/*
This step is very important! It tells our chat app to use the mocked
websocket object instead of the native one. The great thing
about this is that our actual code did not need to change and
thus is agnostic to how we test it.
*/
window.io = socketIO;

const socket = socketIO( uri );

export const init = ( store ) => {
	// add listeners to socket messages so we can re-dispatch them as actions
	Object.keys( messageTypes )
		.forEach( type => socket.on( type, ( payload ) => store.dispatch({ type, payload }) ) );
};

export const emit = ( type, payload ) => {
	messages.push( type, payload );
	socket.emit( type, payload );
};

export const getMessages = () => {
	return messages;
};
