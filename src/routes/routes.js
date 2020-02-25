import React from 'react'

// Components
import { Component } from '../components/stateless/generic'

// Routing
import { Switch, Route, AppRouter } from './router'

// DEMO COMPONENT
import Authenticate from '../components/stateful/authenticate'

// Route maneger class
export default class Routes extends Component {

	render() {

		return <AppRouter>
			<Switch>
				<Route component={ Authenticate } />
			</Switch>
		</AppRouter>

	}

}