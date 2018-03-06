import React from 'react';
import PropTypes from 'prop-types';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { shallow, mount } from 'enzyme';
import nock from 'nock';
import jsdom from 'jsdom';
import * as types from '../../../src/constants/action-types';

// setup a dummy redux store
const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

// create a global document for use with enzyme mount() - for full DOM rendering
const doc = jsdom.jsdom( '<!doctype html><html><body></body></html>' );
global.document = doc;
global.window = doc.defaultView;

export function harness( Component, getState, nockObj, presentational=false, renderType='shallow' ) {
 
	let enzymeWrapper = {};
	let options = {};

	const store = mockStore( getState );
	const props = {
		store: store
	};

	//mock up the board endpoint api response
	if ( nockObj.endpoint ) {
		nock( nockObj.endpoint )
			.get( nockObj.get )
			.reply( 200, 
				nockObj.reply
			);
	}

	// enforce the store if component isn't presentational'
	if (presentational ){ 
		options = {
			context: { store }
		}
	} else {
		options = {
			context: { store },
			childContextTypes: { store: PropTypes.object.isRequired }
		};
	}

	if ( renderType === 'shallow' ){
		enzymeWrapper = shallow( Component );
	} else {
		enzymeWrapper = mount( Component, options );
	}

	return {
		props,
		enzymeWrapper
	};

}
