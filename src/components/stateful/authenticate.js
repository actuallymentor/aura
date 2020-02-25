import React from 'react'
import { Component, Container } from '../stateless/generic'
import { Text, View, Button } from 'react-native'
import { getAccessToken, getProfile, getReadiness, getSleep, resetAuth } from '../../modules/oura'


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
		this.getProfile = this.getProfile.bind( this )
	}

	// Load token from storage
	async componentDidMount( ) {
		// await resetAuth()
		const token = await getAccessToken()
		await this.updateState( { token: token } )

		// If the token is available, check if it is valid
		if( token ) {
			
			try {
				this.getProfile( )
			} catch {
				await resetAuth( )
			}

		}
		await this.updateState( { loading: false } )
	}

	async authorize( ) {
		// Force token auth
		const token = await getAccessToken( true )
		await this.updateState( { token: token } )
		await this.getProfile( )
	}

	async logout( ) {
		await resetAuth( )
		await this.updateState( {
			token: undefined,
			profile: undefined
		} )	
	}

	async getProfile( ) {
		const { token } = this.state
		if( !token ) return
		const profile = await getProfile( token )
		await this.updateState( { profile: profile } )
		console.log( await getReadiness( token, 1 ) )
	}

	async getToday(  ) {
		const { token } = this.state
		if( !token ) return
	}


	render( ) {
		const { loading, token, profile } = this.state
		return <Container>

			{ loading && <Text>Loading...</Text> }
			{ token && !profile && <Text>Checking connection to oura...</Text> }
			{ !token && <View>
				<Text>You have not yet authorised Oura access</Text>
				<Button title='Click here to authorize' onPress={ this.authorize } />
			</View> }

			{ profile && <View>
				<Text>{ profile.email }</Text>
				<Button title='Log out' onPress={ this.logout } />
			</View> }

		</Container>
	}
}