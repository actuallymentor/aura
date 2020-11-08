import { applyMiddleware, combineReducers, createStore } from 'redux'
import promise from 'redux-promise-middleware'
import logger from 'redux-logger'

// Reducers
// ....

// Redux persistance
import { persistStore, persistReducer } from 'redux-persist'
import storage from './storage'

// Reducers
import ouraReducer from './reducers/oura'
import settingsReducer from './reducers/settings'

// Reducers
const reducers = combineReducers( { 
	oura: ouraReducer,
	settings: settingsReducer
} )

// Root reducer
const metaReducer = ( state, action ) => {

	switch( action.type ) {
		
		case "RESETAPP":
			state = undefined
			return undefined
		break


		state = undefined
		return undefined

	}

	return reducers( state, action )
}

// Persisted reducer
const persistedReducer = persistReducer( { key: 'root', storage: storage }, metaReducer )

// Middleware
const middleware = process.env.NODE_ENV == 'development' ? applyMiddleware( logger, promise ) : applyMiddleware( promise )


// Export store and persistor
export const store = createStore( persistedReducer, middleware )
export const persistor = persistStore( store )