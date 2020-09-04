// Sentry debugging and Amplitude tracking
import { SentryInit } from './src/modules/sentry'
// import './src/modules/amplitude'

// React
import React from 'react'
import { Platform } from 'react-native'

// Redux
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './src/redux/store'


// Import router
import Routes from './src/routes/routes'


// Visual
import { Loading } from './src/components/stateless/generic'

// Rotation
import * as ScreenOrientation from 'expo-screen-orientation'

// Push notifications
// import { askForPushPermissions } from './src/modules/push'

// ///////////////////////////////
// Main app ( web )
// ///////////////////////////////
export default class App extends React.Component {

	
	async componentDidMount() {

		// Put upside down if developing
		const web = Platform.OS == 'web'
		const dev = process.env.NODE_ENV == 'development'
		if( !web && dev ) {
			await ScreenOrientation.lockAsync( ScreenOrientation.Orientation.PORTRAIT_DOWN )
			await ScreenOrientation.unlockAsync()
		} else if( !web ) {
			await ScreenOrientation.lockAsync( ScreenOrientation.Orientation.PORTRAIT )
		}
		
		SentryInit()
		
		// Create and store expo push token
		// await askForPushPermissions()
	}


	// Return the app with routing
	render( ) {

		return (

			// Connect redux store
			<Provider store={ store }>
				{ /* Redux store persistence across reloads and visits */ }
				<PersistGate loading={ <Loading /> } persistor={ persistor }>
					{ /* Connect router */ }
					<Routes />
				</PersistGate>
			</Provider>

		)
	}

}


