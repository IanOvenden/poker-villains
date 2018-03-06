import React, { Component } from 'react';
import { Provider } from 'react-redux';
import {Route, Router, IndexRoute, hashHistory} from 'react-router';
import configureStore from '../store/configure-store';
import Core from './core';
import Index from '../pages/index';

/** @constant
*	@type {Object}
*	@description the application store
*	@default
*	@private
*	@memberOf module:STORE
*/

const store = configureStore( window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() );

/**
 * The root application class
 * @extends Component
 * @requires react
 * @requires react-redux
 * @requires react-router
 * @requires module:STORE
 * @requires Async
 */

class Villains extends Component {

	/**
     * Setup the router
     * @returns {Render} render the correct page
     */
	render() {

		function errorLoading( err ) {
			console.error( 'Dynamic page loading failed', err );
		}

		function loadRoute( callback ) {
			return ( module ) => callback( null, module.default );
		}

		return (
			<Provider store={store}>
				<Router history={hashHistory}>
					<Route path='/' component={Core}>
						<IndexRoute component={Index}/>
							<Route
								path='/home'
								getComponent={( location, callback )=> {
									System.import( '../pages/index' )
										.then( loadRoute( callback ) )
										.catch( errorLoading );
								}} />
					</Route>
				</Router>
			</Provider>
		);
	}
}

export default Villains;
