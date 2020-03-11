import React from 'react'
import { Component, Container, Loading, Text } from '../stateless/generic'
import { Authentication } from '../stateless/profile'
import { Table } from '../stateless/data-table'
import { Dashboard } from '../stateless/data-dashboard'
import { View, Button } from 'react-native'

// Redux
import { getToken, getSMAs, reset, getProfile } from '../../redux/actions/oura'
import { setCompare } from '../../redux/actions/settings'
import { connect } from 'react-redux'

// Helpers
import { timeStringIsToday, timestampIsToday, wait } from '../../modules/helpers'

// Styling
import { merge } from '../styles/_helpers'
import generic from '../styles/generic'

class OuraProfile extends Component {

	constructor( props ) {
		super( props )

		this.state = {
			detailed: false,
			loading: true,
			syncError: false,
			connectionTimeout: 5000
		}

		this.getData = this.getData.bind( this )
		this.setBaseline = this.setBaseline.bind( this )
		this.setNumerator = this.setNumerator.bind( this )
		this.toggleDetail = this.toggleDetail.bind( this )
		this.sync = this.sync.bind( this )

	}

	// Load token from storage
	async componentDidMount( ) {

		const { dispatch } = this.props
		
		await dispatch( getToken() )

		const { token } = this.props

		// If no token reset, otherwise get data
		if( !token ) await dispatch( reset() )
		else await this.getData( token )
		
		await this.updateState( { loading: false } )
	}

	async componentDidUpdate( ) {

		const { sma, dispatch, token } = this.props

		// Only update if there is no data
		if( !sma ) await this.getData( token )
			
	}

	async getData( token ) {

		// No token? Stop
		if( !token ) return

		const { dispatch } = this.props

		try {
			await Promise.race( [
				// The timeout trigger, throws on timeout
				wait( this.state.connectionTimeout, true ),
				// The data getters, must outrace the timer
				Promise.all( [
					dispatch( getSMAs( token ) ),
					dispatch( getProfile( token ) )
				] )

			] )
			await this.updateState( { syncError: false } )
		} catch( e ) {
			alert( 'Sync error, check your connection.' )
			await this.updateState( { syncError: true } )
		}
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

	setNumerator( direction ) {

		const { dispatch, compare } = this.props

		const increments = [ 'day', 'week', 'month', 'semiannum' ]
		const [ now, baseline ] = compare

		if( !now || !baseline ) return dispatch( setCompare( [ 'day', 'week' ] ) )

		const currentIndex = increments.indexOf( now )

		// Set new baseline conditionally
		let newNumerator
		if( direction == 'next' )
			// Are we at the final increment? Reset to zero
			newNumerator = increments.length - 1 == currentIndex ? 0 : currentIndex + 1
		else
			// Are we at the first element? Set to last element
			newNumerator = currentIndex == 0 ? increments.length - 1 : currentIndex - 1

		return dispatch( setCompare( [ increments[ newNumerator ], baseline ] ) )
	}

	toggleDetail( ) {
		return this.updateState( { detailed: !this.state.detailed } )
	}

	async sync( ) {

		// Sync process running?
		const { syncing } = this.state
		if( syncing ) return 'Already syncing'

		// Do the sync
		await this.updateState( { syncing: true } )
		const { token, sma } = this.props
		await this.getData( token )

		await wait( 1000 )
		await this.updateState( { syncing: false, timeout: false, loading: false } )


	}


	render( ) {
		const { loading, detailed, syncing, syncError } = this.state
		const { token, profile, sma, dispatch, compare } = this.props

		if( !sma && syncError ) return <Loading message='Sync failed, pull down to retry' onPull={ this.sync } loading={ loading } />

		if( loading || !compare ) return <Loading />
		if( !sma && token ) return <Loading message='Accessing oura data' />


		return <Container style={ { paddingLeft: 0, paddingRight: 0 } }>

			{ sma && ( detailed ? <Table toggleDetail={ this.toggleDetail } sma={ sma } /> : <Dashboard
				onPull={ this.sync }
				syncing={ syncing }
				baselineNext={ f => this.setBaseline( 'next' ) }
				baselineBack={ f => this.setBaseline( 'back' ) }
				numeratorNext={ f => this.setNumerator( 'next' ) }
				numeratorBack={ f => this.setNumerator( 'back' ) }
				toggleDetail={ this.toggleDetail }
				sma={ sma }
				compare={ compare } /> ) }

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