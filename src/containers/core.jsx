import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Page wrapper class
 * @extends Component
 * @requires react
 */

class Core extends Component {

	constructor( props ) {
		super( props );
	}

	/**
     * Setup the router
     * @returns {Render} render the main page layout with appropriate page. Include application navigation and board navigation if required.
     */

	render() {

		return (
			<div>
				{this.props.children}
			</div>
		);
	}
}

export default Core;
