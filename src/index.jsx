/**
 *  React JSX render method.
 *	@typedef	{method} Render
 */

/** @module
 * 	ROOT
 * 	@description Application entry point
 * 	@requires React
 * 	@requires ReactDOM
 * 	@requires class:App
 */

import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';
import 'isomorphic-fetch';
import App from './containers/app';
import './modules/closest.polyfill';
import {polyfill} from 'mobile-drag-drop';

// optional import of scroll behaviour
import {scrollBehaviourDragImageTranslateOverride} from 'mobile-drag-drop/scroll-behaviour';

// options are optional ;)
polyfill({
    // use this to make use of the scroll behaviour
	dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
	holdToDrag: 1000
});

import styles from './_assets/css/app.css';

ReactDOM.render( (
	<App />
	), document.getElementById( 'app' )
);
