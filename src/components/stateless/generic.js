import React from 'react'
import { KeyboardAvoidingView, Text as NativeText, View, Button } from 'react-native'

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
export const Loading = ( { message } ) => <Container>
	<NativeText>
		{ message || 'Loading' }
	</NativeText>
</Container>

export const Text = ( { children, style, onPress } ) => <NativeText onPress={ onPress } style={ merge( { color: color.text }, style ) }>{ children }</NativeText>