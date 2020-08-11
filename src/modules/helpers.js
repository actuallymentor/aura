// ///////////////////////////////
// Helpers
// ///////////////////////////////
export const relativeTime = time => {
	const day = 1000 * 60 * 60 * 24
	const date = new Date( time )
	const now = new Date()

	if( now - date < day ) return 'today'
	if( now - date < day * 2 ) return 'yesterday'
	if( now - date < day * 3 ) return '3 Days ago'

	return date.toDateString( )

}

export const timeStringIsToday = time => {
	
	const day = 1000 * 60 * 60 * 24
	const date = new Date( time )
	const now = new Date()

	return now - date < day
}

export const timestampIsToday = time => {
	const today = new Date().setHours(0, 0, 0, 0)
	const stampday = new Date( time ).setHours(0, 0, 0, 0)
	return today == stampday
}

export const howLongAgo = time => {
	const date = new Date( time )
	const now = new Date()

	const minutesDiff = Math.floor( ( now - date ) / 1000 / 60 )

	if( minutesDiff < 60 ) return `${ minutesDiff } mins ago`
	if( minutesDiff > 60 && minutesDiff < 60 * 24 ) return `${ minutesDiff / 60 } hours ago`
	return `${ minutesDiff / 60 / 24 }days ago`
}

export const humanTimeFromStamp = time => {
	const date = new Date( time )
	const hours = date.getHours()
	const minutes = date.getMinutes()
	return `${ hours }:${ minutes < 9 || minutes == 0 ? `0${ minutes }` : minutes }`
}

export const wait = ( time, error=false ) => new Promise( ( res, rej ) => setTimeout( error ? rej : res, time ) )

import { Alert } from 'react-native'
export const Dialogue = ( title, message, options ) => new Promise( res => {

	if( options ) options = options.map( ( { text, onPress } ) => ( {
		text: text,
		onPress: f => {
			if( onPress ) onPress()
			return res(  )
		}
	} ) )

	if( !options ) options = [ { text: 'Ok', onPress: res } ]

	Alert.alert( title, message, options )

} )

// ///////////////////////////////
// Error object parser
// ///////////////////////////////
export const errorToObject = content => {

	// It this is not an object just let it through
	if( typeof content != 'object' ) return content

	// Create placeholder
	const obj = {}

	// For each property, append to object
	Object.getOwnPropertyNames( content ).map( key => {

		// If the sub property is also an object, recurse so we destructure it too
		if( typeof content[key] == 'object' ) obj[key] = errorToObject( content[key] )
		else return obj[key] = content[key]
	} )

	return obj
}