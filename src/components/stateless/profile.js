import React from 'react'
import { KeyboardAvoidingView, Text, View, Button } from 'react-native'
import generic from '../styles/generic'
import { merge } from '../styles/_helpers'

const relativeTime = time => {
	const day = 1000 * 60 * 60 * 24
	const date = new Date( time )
	const now = new Date()

	console.log( date.toDateString(  ), now.toDateString( ), ( now - date ), day, ' today? ', now - date < day )

	if( now - date < day ) return 'Past 12 hours'
	if( now - date < day * 2 ) return 'Yesterday'
	if( now - date < day * 3 ) return '3 Days ago'

	return date.toDateString( )


}

export const Profile = ( { profile, loading, token, style, author, auth, logout } ) => <View style={ merge( style ) }>
	
	{ profile && <Text>User: { profile.email }</Text> }
	{ loading && <Text>Loading...</Text> }
	{ token && !profile && <Text>Checking connection to oura...</Text> }
	{ !token && <View>
		<Text>You have not yet authorised Oura access</Text>
		<View style={ { marginTop: 20 } }>
			<Button title='Click here to authorize' onPress={ auth } />
		</View>
	</View> }
	{  profile && <View style={ { marginTop: 20 } }>
		<Button title='Log out' onPress={ logout } />
	</View> }

</View>

const Row = ( { title, data } ) => <View>
	<Text>{ title }</Text>
</View>

export const Data = ( { sma } ) => <View style={ merge( generic.centerContent, { flex: 1 } ) }>
	<Text>Last data point: { relativeTime( sma.week.last ) }</Text>
	<Row title='Avg HRV:' data={ true } />

</View>