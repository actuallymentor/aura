import React from 'react'
import { Component, Container, Loading } from '../stateless/generic'
import { Authentication } from '../stateless/profile'
import { Table } from '../stateless/data-table'
import { Dashboard } from '../stateless/data-dashboard'
import { Text, View, Button } from 'react-native'

// Redux
import { getToken, getSMAs, reset, getProfile } from '../../redux/actions/oura'
import { setCompare } from '../../redux/actions/settings'
import { connect } from 'react-redux'

class OuraProfile extends Component {

	constructor( props ) {
		super( props )

		this.state = {
			detailed: false,
			loading: true
		}

		this.getData = this.getData.bind( this )
		this.setBaseline = this.setBaseline.bind( this )

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

	setBaseline( direction ) {

		const { dispatch, compare } = this.props

		const increments = [ 'day', 'week', 'month', 'semiannum' ]
		const [ now, baseline ] = compare

		if( !now || !baseline ) return dispatch( setCompare( [ 'day', 'week' ] ) )

		const currentIndex = increments.indexOf( baseline )

		// Set new baseline conditionally
		let newBaseline
		if( direction == 'next' )
			// Are we at the final increment? Reset to zero
			newBaseline = increments.length - 1 == currentIndex ? 0 : currentIndex + 1
		else
			// Are we at the first element? Set to last element
			newBaseline = currentIndex == 0 ? increments.length - 1 : currentIndex - 1

		return dispatch( setCompare( [ now, increments[ newBaseline ] ] ) )
	}


	render( ) {
		const { loading, detailed } = this.state
		const { token, profile, sma, dispatch, compare } = this.props

		if( loading || !compare ) return <Loading />
		if( !sma && token ) return <Loading message='Accessing oura data' />

		return <Container>

			{ sma && ( detailed ? <Table sma={ sma } /> : <Dashboard next={ f => this.setBaseline( 'next' ) } back={ f => this.setBaseline( 'back' ) } sma={ sma } compare={ compare } /> ) }

			<Authentication profile={ profile } token={ token } auth={ f => dispatch( getToken( true ) ) } logout={ f => dispatch( reset() ) } />

		</Container>
	}
}

export default connect( store => ( {
	token: store.oura && store.oura.token,
	profile: store.oura && store.oura.profile,
	sma: store.oura && store.oura.smas,
	compare: store.settings.compare
} ) )( OuraProfile )