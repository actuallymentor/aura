import React from 'react'

// Components
import { Component } from '../components/stateless/generic'

// Routing
import { Switch, Route, AppRouter } from './router'

// DEMO COMPONENT
import Profile from '../components/stateful/profile'

// Route maneger class
export default class Routes extends Component {

	render() {

		return <AppRouter>
			<Switch>
				<Route component={ Profile } />
			</Switch>
		</AppRouter>

	}

}