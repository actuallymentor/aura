import React from 'react'
import { KeyboardAvoidingView, Text as NativeText, View, Button, TouchableOpacity, ScrollView, RefreshControl } from 'react-native'

// Styling
import generic from '../styles/generic'
import { merge, color } from '../styles/_helpers'

// Optimised react root component
export class Component extends React.Component {

  constructor( props ) {
    super( props )

    // Class-wide functions
    this.promiseState = newState => new Promise( resolve => this.setState( newState, resolve ) )
    this.updateState = updates => this.promiseState( { ...this.state, ...updates } )

  }

}

// General app container
export const Container = ( { children, style } ) => <KeyboardAvoidingView behavior="padding" enabled style={ merge( generic.container, style ) }>{ children }</KeyboardAvoidingView>

// Loading screen
export const Loading = ( { message, loading=false, onPull, style } ) => <ScrollView
	contentContainerStyle={ merge( generic.centerContent, { flex: 1, paddingTop: 50 }, style ) }
	style={ { flex: 1 } }
	refreshControl={ <RefreshControl progressViewOffset={ 50 } title='Loading...' refreshing={ loading } onRefresh={ onPull } /> }
>
	<NativeText>
		{ message || 'Loading' }
	</NativeText>
</ScrollView>

export const Text = ( { children, style, onPress } ) => <NativeText onPress={ onPress } style={ merge( { color: color.text }, style ) }>{ children }</NativeText>

// export const Header = ( { onPress, detailed, fontSize=20 } ) => <TouchableOpacity
// 	onPress={ onPress }
// 	style={ merge( generic.centerContent, { marginTop: 50, flexDirection: 'row' } ) }
// >
// 	{ detailed && <Text style={ { fontSize: fontSize } }>{ '<' }</Text> }
// 	<Text style={ { padding: 10, fontSize: fontSize } }>{ detailed ? 'Table view' : 'Dashboard' }</Text>
// 	{ !detailed && <Text style={ { fontSize: fontSize } }>{ '>' }</Text> }
// </TouchableOpacity>