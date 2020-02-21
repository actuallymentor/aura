// Routing, using HashRouter instead of BrowserRouter tomake sure no server-side config is needed
import React from 'react'
import { Router }  from 'react-router-dom'
import { createHashHistory } from 'history'

export const AppRouter = ( { children } ) => <Router history={ createHashHistory() }>
	{ children }
</Router>

export { Switch } from 'react-router-dom'

export { Route } from 'react-router-dom'