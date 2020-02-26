import { getAccessToken, getProfile as profile, getReadiness, getSleep as sleep, resetAuth, getSMAs as sma } from '../../modules/oura'

export const getToken = f => ( {
	type: 'GETTOKEN',
	payload: getAccessToken( )
} )

export const getProfile = token => ( {
	type: 'GETPROFILE',
	payload: profile( token )
} )

export const getSleep = token => ( {
	type: 'GETSLEEP',
	payload: getSleep( token )
} )

export const getSMAs = token => ( {
	type: 'GETSMAS',
	payload: sma( token )
} )

export const reset = f => ( {
	type: 'RESET',
	payload: resetAuth()
} )