import React from 'react'
import { Component, Container } from '../stateless/generic'
import { Profile, DetailedData } from '../stateless/profile'
import { Text, View, Button } from 'react-native'

// Redux
import { getToken, getSMAs, reset, getProfile } from '../../redux/actions/oura'
import { connect } from 'react-redux'

class OuraProfile extends Component {

	constructor( props ) {
		super( props )

		this.state = {
			detailed: false,
			loading: true
		}

		this.getData = this.getData.bind( this )

	}

	// Load token from storage
	async componentDidMount( ) {

		const { dispatch } = this.props
		
		await dispatch( getToken() )

		const { token } = this.props

		if( token ) await this.getData( token )

		if( !token ) await dispatch( reset() )
		
		await this.updateState( { loading: false } )
	}

	async componentDidUpdate( ) {
		const { token, sma, dispatch } = this.props
		if( token && !sma ) await this.getData( token )
	}

	async getData( token ) {
		const { dispatch } = this.props
		await Promise.all( [
			dispatch( getSMAs( token ) ),
			dispatch( getProfile( token ) )
		] )
	}


	render( ) {
		const { loading, detailed } = this.state
		const { token, profile, sma, dispatch } = this.props

		return <Container>

			{ !loading && !detailed && sma && <DetailedData sma={ sma } /> }

			<Profile profile={ profile } loading={ loading } token={ token } auth={ f => dispatch( getToken( true ) ) } logout={ f => dispatch( reset() ) } />

		</Container>
	}
}

export default connect( store => ( {
	token: store.oura && store.oura.token,
	profile: store.oura && store.oura.profile,
	sma: store.oura && store.oura.smas
} ) )( OuraProfile )