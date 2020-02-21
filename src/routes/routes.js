import React from 'react'

// Components
import { Component } from '../components/stateless/generic'

// Routing
import { Switch, Route, AppRouter } from './router'

// DEMO COMPONENT
import { Container } from '../components/stateless/generic'
import { Text } from 'react-native'
const Home = f => <Container>
	<Text>/ routes</Text>
</Container>

// Route maneger class
export default class Routes extends Component {

	render() {

		return <AppRouter>
			<Switch>
				<Route component={ Home } />
			</Switch>
		</AppRouter>

	}

}