const defaultStore = {
	compare: [ 'day', 'week' ]
}

const settingsReducer = ( state=defaultStore, action ) => {

	switch( action.type ) {

		case "SETCOMPARE_FULFILLED":
			return { compare: action.payload }
		break


		// Just return the state if no known action is specified
		default:
			return state
	}
}
export default settingsReducer