import React from 'react'
import { NativeRouter } from 'react-router-native'

export const AppRouter = ( { children } ) => <NativeRouter>
	{ children }
</NativeRouter>

export { Switch } from 'react-router-native'

export { Route } from 'react-router-native'