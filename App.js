// Sentry debugging and Amplitude tracking
import './src/modules/sentry'
import './src/modules/amplitude'

// React
import React from 'react'

// Redux
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './src/redux/store'


// Import router
import Routes from './src/routes/routes'


// Visual
import { Loading } from './src/components/stateless/generic'

// Rotation
import { ScreenOrientation } from 'expo'

// Push notifications
import { askForPushPermissions } from './src/modules/push'

// ///////////////////////////////
// Main app ( web )
// ///////////////////////////////
export default class App extends React.Component {

	
	async componentDidMount() {

		// Put upside down if developing
		if( process.env.NODE_ENV == 'development' ) await ScreenOrientation.lockAsync( ScreenOrientation.Orientation.PORTRAIT_DOWN )
		await ScreenOrientation.unlockAsync()

		// Create and store expo push token
		await askForPushPermissions()
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


