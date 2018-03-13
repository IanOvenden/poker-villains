import React, { Component } from 'react';
import firebase, { auth, provider } from '../modules/firebase';

class Index extends Component {

	constructor( props ) {
		super( props );
		this.state = {
			league: [],
			user: null
		};
		this.login = this.login.bind( this );
		this.logout = this.logout.bind( this );
	}

	componentDidMount() {

		// auth.onAuthStateChanged( ( user ) => {
		// 	if ( user ) {
		// 		this.setState({ user });
		// 	}
		// });

		let db = firebase.firestore(),
			fbLeague = db.collection( 'league' );

		fbLeague.orderBy( 'points', 'desc' ).get().then( ( querySnapshot ) => {

			let newState = [];

			querySnapshot.forEach( doc => {
				let newItem = doc.data();

				if ( newItem.user ) {
					newItem.user.get()
					.then( res => {
						newItem.user = res.data();
						newState.push( newItem );
						this.setState({
							league: newState
						});
					})
					.catch( err => console.error( err ) );
				}
			});
		});
	}

	login() {
		auth.signInWithPopup( provider )
			.then( ( result ) => {
				const user = result.user;
				this.setState({
					user
				});
			});
	}

	logout() {
		auth.signOut()
			.then( () => {
				this.setState({
					user: null
				});
			});
	}

	render() {
		return (
			<div className='league'>
				<table>
					<thead>
						<tr>
							<th>
								Villain
							</th>
							<th>
								First
							</th>
							<th>
								Second
							</th>
							<th className="secondary-column">
								Third
							</th>
							<th>
								First Out
							</th>
							<th>
								Knockouts
							</th>
							<th>
								Balance
							</th>
							<th>
								Points
							</th>
						</tr>
					</thead>
					<tbody>
						{this.state.league.map( ( item, index ) => {
							return (
								<tr key={index}>
									<td className="-u-left-align">
										{item.user.firstname}
									</td>
									<td>
										{item.first}
									</td>
									<td>
										{item.second}
									</td>
									<td className="secondary-column">
										{item.third}
									</td>
									<td>
										{item.firstout}
									</td>
									<td>
										{item.knockouts}
									</td>
									<td>
										{item.balance}
									</td>
									<td>
										{item.points}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}
}

export default Index;
