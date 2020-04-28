import React from 'react'
import { KeyboardAvoidingView, Text as NativeText, View, Button, TouchableOpacity } from 'react-native'
import generic from '../styles/generic'
import { merge, color } from '../styles/_helpers'

// Visual
import { Text } from './generic'

export const Authentication = ( { profile, token, style, author, auth, logout, retry } ) => <View style={ merge( generic.centerContent, style, { maxWidth: 500 } ) }>

	{ !token && <Text style={ { textAlign: 'center', padding: 20 } }>This app links to your Oura ring and allows you to compare today's HRV/HR scores to your averages of the past week, month or half year. The idea is to see whether you are trending up or down.</Text> }

	{ profile && <Text style={ { textAlign: 'center' } }>User: { profile.email }</Text> }
	{ token && !profile && <Text>Checking connection to oura...</Text> }
	{ !token && <View>
		
		<Text style={ { textAlign: 'center' } }>You have not yet authorised Oura access. Once you do you will see your scores. All data is stored locally (this app has no accounts/database).</Text>
		<View style={ { marginTop: 20, marginBottom: 20, padding: 20 } }>
			<Button title='Click here to authorize Oura' onPress={ auth } />
		</View>
		{ retry && <Text style={ { textAlign: 'center' } }>⚠️ Something went wrong, probably not your fault. Please try again.</Text> }
	</View> }

	{  profile && <TouchableOpacity onPress={ logout } style={ { marginTop: 10, marginBottom: 20 } }>
		<Text style={ { textAlign: 'center', textDecorationLine: 'underline' } } color={ color.accent } onPress={ logout }>Log out</Text>
	</TouchableOpacity> }

</View>


export const another = true