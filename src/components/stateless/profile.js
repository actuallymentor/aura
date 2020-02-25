import React from 'react'
import { KeyboardAvoidingView, Text, View, Button } from 'react-native'
import generic from '../styles/generic'
import { merge } from '../styles/_helpers'

const relativeTime = time => {
	const day = 1000 * 60 * 60 * 24
	const date = new Date( time )
	const now = new Date()

	if( now - date < day ) return 'Today'
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

const dataStyle = { margin: 10, padding: 10, minWidth: 50, textAlign: 'center' }
const relativeStyle = ( week, today, lowerIsBetter=false ) => {
	if( lowerIsBetter ) return ( { backgroundColor: today - week < 0 ? 'green' : 'red', color: 'white' } )
	return ( { backgroundColor: today - week > 0 ? 'green' : 'red', color: 'white' } )
}

const Head = ( {  } ) => <View style={ merge( generic.centerContent, { flexDirection: 'row' } ) }>
	<Text style={ dataStyle }></Text>
	<Text style={ dataStyle }>6m</Text>
	<Text style={ dataStyle }>1m</Text>
	<Text style={ dataStyle }>7d</Text>
	<Text style={ dataStyle }>t</Text>
</View>
const Row = ( { data, property, lowerIsBetter } ) => <View>
	
	<View style={ { display: 'flex', flexDirection: 'row' } }>
		<Text style={ dataStyle }>{ data.semiannum[ property ] }</Text>
		<Text style={ merge( dataStyle, relativeStyle( data.semiannum[ property ], data.month[ property ], lowerIsBetter ) ) }>{ data.month[ property ] }</Text>
		<Text style={ merge( dataStyle, relativeStyle( data.month[ property ], data.week[ property ], lowerIsBetter ) ) }>{ data.week[ property ] }</Text>
		<Text style={ merge( dataStyle, relativeStyle( data.week[ property ], data.day[ property ], lowerIsBetter ) ) } key={ `${ property }day` }>{ data.day[ property ] }</Text>
	</View>
</View>

export const Data = ( { sma } ) => <View style={ merge( generic.centerContent, { flex: 1 } ) }>

	<Text style={ { textAlign: 'center', fontSize: 20 } }>Oura moving averages</Text>

	<Text style={ { textAlign: 'center', marginBottom: 10 } }>Last data point: { relativeTime( sma.week.last ) }</Text>

	<Head />
	<View style={ merge( generic.centerContent, { flexDirection: 'row' } ) }>
		<View>
			<Text style={ merge( dataStyle, { minWidth: 0 } ) }>aHrv</Text>
			<Text style={ merge( dataStyle, { minWidth: 0 } ) }>hHrv</Text>
			<Text style={ merge( dataStyle, { minWidth: 0 } ) }>lHr</Text>
		</View>
		<View>
			<Row title='aHRV:' data={ sma } property='aHrv' />
			<Row title='hHRV:' data={ sma } property='hHrv' />
			<Row title='lHr:' data={ sma } property='hr' lowerIsBetter={ true } />
		</View>
	</View>

</View>