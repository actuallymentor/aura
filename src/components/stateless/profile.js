import React from 'react'
import { KeyboardAvoidingView, Text as NativeText, View, Button, TouchableOpacity } from 'react-native'
import generic from '../styles/generic'
import { merge, color } from '../styles/_helpers'

// Visual
import { Text } from './generic'

export const Authentication = ( { profile, token, style, author, auth, logout } ) => <View style={ merge( style ) }>

	{ profile && <Text>User: { profile.email }</Text> }
	{ token && !profile && <Text>Checking connection to oura...</Text> }
	{ !token && <View>
		<Text>You have not yet authorised Oura access</Text>
		<View style={ { marginTop: 20 } }>
			<Button title='Click here to authorize' onPress={ auth } />
		</View>
	</View> }
	{  profile && <TouchableOpacity onPress={ logout } style={ { marginTop: 10, marginBottom: 20 } }>
		<Text style={ { textAlign: 'center', textDecorationLine: 'underline' } } color={ color.accent } onPress={ logout }>Log out</Text>
	</TouchableOpacity> }

</View>

export const another = true