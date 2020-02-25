import React from 'react'
import { Component, Container } from '../stateless/generic'
import { Profile, Data } from '../stateless/profile'
import { Text, View, Button } from 'react-native'
import { getAccessToken, getProfile, getReadiness, getSleep, resetAuth } from '../../modules/oura'
import { lowestHrSMA, avgHrvSMA, highestHrvSMA } from '../../modules/sma'


export default class Authenticate extends Component {

	constructor( props ) {
		super( props )

		this.state = {
			token: undefined,
			profile: undefined,
			loading: true
		}

		this.authorize = this.authorize.bind( this )
		this.logout = this.logout.bind( this )
		this.loadData = this.loadData.bind( this )
		this.getProfile = this.getProfile.bind( this )
		this.getSMAs = this.getSMAs.bind( this )
	}

	// Load token from storage
	async componentDidMount( ) {
		// await resetAuth()
		const token = await getAccessToken()
		await this.updateState( { token: token } )

		// If the token is available, check if it is valid
		if( token ) {
			
			try {
				this.loadData()
			} catch {
				await resetAuth( )
			}

		}
		await this.updateState( { loading: false } )
	}

	loadData( ) {
		const { token } = this.state
		if( !token ) return

		return Promise.all( [
			this.getProfile( token ),
			this.getSMAs( token )
		] )

	}

	async authorize( ) {
		// Force token auth
		const token = await getAccessToken( true )
		await this.updateState( { token: token } )
		await this.loadData( )
	}

	async logout( ) {
		await resetAuth( )
		await this.updateState( {
			token: undefined,
			profile: undefined
		} )	
	}

	async getProfile( token ) {


		const profile = await getProfile( token )
		await this.updateState( { profile: profile } )

	}

	async getSMAs( token ) {

		const week = await getSleep( token, 7 )
		const month = await getSleep( token, 30 )
		const semiannum = await getSleep( token, 180 )
		

		const sma = {
			day: {
				last: week[ week.length - 1 ][ "bedtime_end" ],
				hr: lowestHrSMA( [ week[ week.length - 1 ] ] ),
				aHrv: avgHrvSMA( [ week[ week.length - 1 ] ] ),
				hHrv: highestHrvSMA( [ week[ week.length - 1 ] ] )
			},
			week: {
				last: week[ week.length - 1 ][ "bedtime_end" ],
				entries: week.length,
				hr: lowestHrSMA( week ),
				aHrv: avgHrvSMA( week ),
				hHrv: highestHrvSMA( week )
			},
			month: {
				last: month[ month.length - 1 ][ "bedtime_end" ],
				entries: month.length,
				hr: lowestHrSMA( month ),
				aHrv: avgHrvSMA( month ),
				hHrv: highestHrvSMA( month )
			},
			semiannum: {
				last: semiannum[ semiannum.length - 1 ][ "bedtime_end" ],
				entries: semiannum.length,
				hr: lowestHrSMA( semiannum ),
				aHrv: avgHrvSMA( semiannum ),
				hHrv: highestHrvSMA( semiannum )
			}
		}

		await this.updateState( {
			sma: sma
		} )

		if( process.env.NODE_ENV == 'development' ) console.log( sma )

	}



	render( ) {
		const { loading, token, profile, sma } = this.state
		return <Container style={ { marginBottom: 20 } }>

			{ sma && <Data sma={ sma } /> }

			<Profile profile={ profile } loading={ loading } token={ token } auth={ this.authorize } logout={ this.logout } />

		</Container>
	}
}