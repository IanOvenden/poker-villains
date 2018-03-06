import React from 'react';

/**
 * Home page class
 * @extends Component
 * @memberof module:PAGES
 * @requires react
 */

class Index extends React.Component {

	constructor( props ) {
		super( props );
	}

	/**
     * Render default/home page.
     * @returns {Render}
     */

	render() {

		return (
			<section className="page">
				<h1>Home Page</h1>
			</section>
		);
	}
}

export default Index;
