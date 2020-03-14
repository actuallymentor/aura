// Authentication module
import { AuthSession } from 'expo'
import * as SecureStore from 'expo-secure-store'
import { OURA_CLIENTID, OURA_SECRET } from 'react-native-dotenv'
import daysago from './dates'
import { lowestHrSMA, avgHrvSMA, highestHrvSMA } from './sma'
import * as Network from 'expo-network'

const dev = process.env.NODE_ENV == 'development'

const options = {
	urls: {
		auth: 'https://cloud.ouraring.com/oauth/authorize',
		token: 'https://api.ouraring.com/oauth/token'
	},
	scopes: [ 'email', 'personal', 'daily' ],
	redirectUrl: encodeURIComponent( AuthSession.getRedirectUrl() ),
	apiEndpoint: 'https://api.ouraring.com'
}

export const getAuthorisation = async ( forceAuth = false ) => {

	// If local auth token is stored return it
	const storedAuthToken = await SecureStore.getItemAsync( 'oura_auth_token' )
	if( storedAuthToken || !forceAuth ) return storedAuthToken

	// if not, obtain it
	const { params: { code: acquiredToken } } = await AuthSession.startAsync( {
        authUrl:
          `${ options.urls.auth }?response_type=code` +
          `&client_id=${ OURA_CLIENTID }` +
          `&redirect_uri=${ options.redirectUrl }`
      }
    )


	
	if( acquiredToken ) await SecureStore.setItemAsync( 'oura_auth_token', acquiredToken )

	// If all went well we now have a stored token
	return SecureStore.getItemAsync( 'oura_auth_token' )

}

export const getAccessToken = async ( forceAuth = false ) => {

	// If local auth token is stored return it
	const storedToken = await SecureStore.getItemAsync( 'oura_access_token' )
	if( storedToken || !forceAuth ) return storedToken

	// If not, obtain it
	const { type, params } = await AuthSession.startAsync( {
        authUrl:
          `${ options.urls.auth }?response_type=token` +
          `&client_id=${ OURA_CLIENTID }` +
          `&redirect_uri=${ options.redirectUrl }`
      }
    )

	// If auth was not ok, cancel
    if( type != 'success' && !params ) return undefined

    // Otherwise, get the token
    const { params: { access_token: acquiredToken } } = res

	if( acquiredToken ) await SecureStore.setItemAsync( 'oura_access_token', acquiredToken )

	// If all went well we now have a stored token
	return SecureStore.getItemAsync( 'oura_access_token' )

}

export const getProfile = async token => {
	const res = await fetch( `${ options.apiEndpoint }/v1/userinfo?access_token=${token}`, { method: 'GET' } )
	return res.json(  )
}

export const getReadiness = async ( token, span=0 ) => {

	const res = await fetch( `${ options.apiEndpoint }/v1/readiness?start=${daysago( span )}&end=${daysago( 0 )}&access_token=${token}`, { method: 'GET' } )

	return res.json(  )
}

export const getSleep = async ( token, span=0 ) => {

	
	if( dev ) console.log( 'Calling ', `${ options.apiEndpoint }/v1/sleep?start=${daysago( span )}&end=${daysago( 0 )}&access_token=${token}` )


	const res = await fetch( `${ options.apiEndpoint }/v1/sleep?start=${daysago( span )}&end=${daysago( 0 )}&access_token=${token}`, { method: 'GET' } )
	const { sleep } = await res.json(  )
	return sleep
	
}

export const resetAuth = f => {
	return Promise.all( [
		SecureStore.deleteItemAsync( 'oura_access_token' ),
		SecureStore.deleteItemAsync( 'oura_auth_token' )
	] )
}

export const getSMAs = async token => {

	try {

		// Check for connection
		const net = await Network.getNetworkStateAsync()
		if( !net.isInternetReachable ) throw 'No internet'

		if( dev ) console.log( 'Getting data from oura' )
		const week = await getSleep( token, 7 )
		const month = await getSleep( token, 30 )
		const semiannum = await getSleep( token, 180 )
		if( dev ) console.log( 'Got data from oura' )

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
			},
			synctimestamp: Date.now()
		}

		if( dev ) console.log( 'Generated SMAs' )

		return sma

	} catch( e ) {
		throw e
	}
	
}