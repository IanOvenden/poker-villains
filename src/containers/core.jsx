import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchLeagueIfNeeded } from '../actions/league';

/**
 * Page wrapper class
 * @extends Component
 * @requires react
 */

class Core extends Component {

	constructor( props ) {
		super( props );
	}

	componentDidMount() {
		const { dispatch } = this.props;
		dispatch( fetchLeagueIfNeeded() );
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

/**
 * propTypes
 * @memberOf module:BOARDLIST
 * @property {array} An array of league entries
 * @property {bool} isFetching - Has a request for entries been made and not yet resolved?
 * @property {number} lastUpdated - date value
 * @property {function} dispatch - the redux dispatch function is required.
 */

Core.propTypes = {
	league: PropTypes.array.isRequired,
	isFetching: PropTypes.bool.isRequired,
	lastUpdated: PropTypes.number,
	dispatch: PropTypes.func.isRequired
};

function mapStateToProps( state ) {

	return {
		league: state.league.items,
		isFetching: state.league.isFetching
	};
}

export default connect( mapStateToProps )( Core );
