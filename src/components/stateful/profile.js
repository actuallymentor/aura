import React from 'react'
import { Component, Container, Loading, Text } from '../stateless/generic'
import { Authentication } from '../stateless/profile'
import { Table } from '../stateless/data-table'
import { Dashboard } from '../stateless/data-dashboard'
import { View, Button } from 'react-native'
import * as Updates from 'expo-updates'

// Redux
import { getToken, getSMAs, reset, getProfile } from '../../redux/actions/oura'
import { setCompare, resetApp } from '../../redux/actions/settings'
import { connect } from 'react-redux'

// Helpers
import { timeStringIsToday, timestampIsToday, wait, Dialogue } from '../../modules/helpers'

// Styling
import { merge } from '../styles/_helpers'
import generic from '../styles/generic'

// Tracking
import { pageView, event } from '../../modules/analytics'

class OuraProfile extends Component {

	constructor( props ) {
		super( props )

		this.state = {
			detailed: false,
			loading: true,
			syncError: false,
			connectionTimeout: 30000,
			increments: [ 'day', 'week', 'month', 'semiannum', 'all' ],
			normalDeviation: 2,
			anomalies: [],
			showAnomalies: false,
			retryAuth: false,
			shouldSync: false
		}

		this.getData = this.getData.bind( this )
		this.setBaseline = this.setBaseline.bind( this )
		this.setNumerator = this.setNumerator.bind( this )
		this.toggleDetail = this.toggleDetail.bind( this )
		this.sync = this.sync.bind( this )
		this.findAnomalies = this.findAnomalies.bind( this )
		this.authenticate = this.authenticate.bind( this )

	}

	// Load token from storage
	async componentDidMount( ) {

		const { dispatch } = this.props
		
		await dispatch( getToken() )

		const { token } = this.props

		// If no token reset, otherwise get data
		if( !token ) await dispatch( reset() )
		else await this.sync( token )
		
		await this.updateState( { loading: false } )

		// Track page view
		pageView( 'Profile' )
	}

	async shouldComponentUpdate( nextProps, nextState ) {
		const { token: oldToken } = this.props
		const { token: newToken } = nextProps
		const { syncing } = nextState

		// Unawaited sync trigger
		if( !syncing && !oldToken && newToken ) this.updateState( { shouldSync: true } )
		// Should update = yes
		return true

	}

	async componentDidUpdate( ) {

		const { shouldSync, syncing } = this.state
		const { sma, dispatch, token } = this.props

		// Only update if there is no data
		if( !this.syncing && !syncing && shouldSync && token && !sma ) await this.sync( token )
			
	}

	async getData( token ) {

		// No token? Stop
		if( !token ) return

		const { dispatch } = this.props

		try {

			if( process.env.NODE_ENV != 'development' ) {
				const { isAvailable } = await Updates.checkForUpdateAsync().catch( e => ( { isAvailable: false } ) )
				if( isAvailable ) {
					const { isNew } = await Updates.fetchUpdateAsync()
					await Dialogue( 'An update is available!', 'The app will now reload' )
					if( isNew ) await Updates.reload()
				}
			}

			// Grab external data and calculate SMAs
			await Promise.race( [
				// The timeout trigger, throws on timeout
				wait( this.state.connectionTimeout, true ),
				// The data getters, must outrace the timer
				Promise.all( [
					dispatch( getSMAs( token ) ).catch( e => {
						const annotated = { ...e, reason: 'getSMAs errored' }
						throw e
					} ),
					dispatch( getProfile( token ) ).catch( e => {
						const annotated = { ...e, reason: 'getSMAs errored' }
						throw e
					} )
				] )

			] )

			// If the cata came in, calculate anomalies
			try {
				await this.findAnomalies( )
			} catch( e ) {
				const annotated = { ...e, reason: 'findAnomalies errored' }
				throw e
			}

			// All went well? Set error to false
			await this.updateState( { syncError: false } )

		} catch( e ) {

			const errorMessage = JSON.stringify( typeof e == 'object' ? ( e.message || e ) : e )

			await this.updateState( { syncError: errorMessage, loading: false, syncing: false } )

			console.log( 'Sync error: ', e )

			await Dialogue( 'Sync error', `Error: ${ errorMessage }. Check your connection.`, [
				{ text: 'Retry sync', onPress: f => this.sync() },
				{ text: 'App is stuck, reset it', onPress: f => Promise.all( [
					dispatch( reset() ),
					dispatch( resetApp() )
				] ) },
				{ text: 'Ignore error', onPress: async f => f }
			] )

			// Throw to sentry
			throw e
			
		}
	}

	async setBaseline( direction ) {

		const { dispatch, compare } = this.props

		const { increments } = this.state
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

		await dispatch( setCompare( [ now, increments[ newBaseline ] ] ) )

		// Update anomaly registry
		this.findAnomalies( )

		event( 'settings', 'baseline', this.props.compare.baseline )
	}

	async setNumerator( direction ) {

		const { increments } = this.state
		const { dispatch, compare } = this.props
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

		await dispatch( setCompare( [ increments[ newNumerator ], baseline ] ) )

		// Update anomaly registry
		this.findAnomalies( )

		event( 'settings', 'numerator', this.props.compare.now )
	}

	async findAnomalies( ) {

		const { normalDeviation } = this.state
		const { compare, sma } = this.props
		const [ now, baseline ] = compare

		// If neither exist yet
		if( !sma || !compare ) return

		const properties = Object.keys( sma[ baseline ] )
		const anomalousProps = properties.filter( p => ( p != 'entries' && p != 'last' ) ).filter( prop => {

			const { sd, val: baselineval } = sma[ baseline ][ prop ]

			const { val } = sma[ now ][ prop ]

			// Keep only those that are outside 2 SD
			return val > baselineval + ( sd * normalDeviation ) || val < baselineval - ( sd * normalDeviation )

		} )

		const translate = prop => {
			const translations = {
				hHrv: 'Highest HRV',
				aHrv: 'Average HRV',
				midpoint_time: 'Sleep midpoint',
				hr_average: 'Heart rate avg',
				hr: 'Heart rate',
				temperature_delta: 'Sleep temp change',
				breath_average: 'Respiration rate'
			}
			return translations[ prop ] || prop.charAt(0).toUpperCase() + prop.slice(1)
		}

		const anomalies = anomalousProps.map( prop => {
			const { val: baseval, sd } = sma[ baseline ][ prop ]
			const { val } = sma[ now ][ prop ]
			const diff = val - baseval
			const delta = Math.floor( ( diff / baseval ) * 100 )
			return {
				prop: translate( prop ),
				delta: delta,
				val: val,
				baseval: baseval,
				sd: sd
			}
		} )

		return this.updateState( { anomalies: anomalies } )

	}

	toggleDetail( ) {
		return this.updateState( { detailed: !this.state.detailed } )
	}

	async authenticate( ) {
		const { dispatch } = this.props
		await dispatch( reset( ) )
		await dispatch( getToken( true ) )

		const { token } = this.props
		const { retry } = this.state
		if( !token ) await this.updateState( { retryAuth: true } )
		if( retry && token ) await this.updateState( { retryAuth: false } )
	}

	async sync( ) {

		try {

			this.syncing = true

			const { token, sma } = this.props

			// Sync process running?
			const { syncing } = this.state
			console.log( 'Syncing: ', syncing )
			if( syncing ) return 'Already syncing'

			// Do the sync
			await this.updateState( { syncing: true, syncError: false } )
			
			await this.getData( token )

			await wait( 1000 )
			await this.updateState( { syncing: false, timeout: false, loading: false } )

		} catch( e ) {
			console.log( 'sync error: ', e )
			await this.updateState( { syncError: e.message || e } )
		} finally {
			this.syncing = false
		}


	}

	cycleDeviation = async direction => {
		const increment = .5
		const { normalDeviation } = this.state
		if( direction == 'up' ) await this.updateState( { normalDeviation: normalDeviation == 3 ? 0 : normalDeviation + increment } )
		else await this.updateState( { normalDeviation: normalDeviation == 0 ? 3 : normalDeviation - increment } )

		// Update anomaly registry
		this.findAnomalies( )
		event( 'settings', 'anomalysensitivity', this.state.normalDeviation )
	}


	render( ) {
		const { loading, detailed, syncing, syncError, anomalies, showAnomalies, retryAuth, normalDeviation } = this.state
		const { token, profile, sma, dispatch, compare } = this.props

		if( syncError ) return <Loading details={ syncError } message='Sync failed, pull down to retry' onPull={ this.sync } loading={ loading } />

		if( token && ( loading || !compare ) ) return <Loading message='Loading your profile...' />
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
				compare={ compare }
				anomalies={ anomalies }
				showAnomalies={ showAnomalies }
				toggleAnomalies={ f => this.updateState( { showAnomalies: !showAnomalies } ) }
				normalDeviation={ normalDeviation }
				cycleDeviation={ this.cycleDeviation }
			/>) }

			<Authentication profile={ profile } token={ token } auth={ this.authenticate } retry={ retryAuth } logout={ f => dispatch( reset() ) } />

		</Container>
	}
}

export default connect( store => ( {
	token: store?.oura?.token,
	profile: store?.oura?.profile,
	sma: store?.oura?.smas,
	compare: store?.settings?.compare
} ) )( OuraProfile )