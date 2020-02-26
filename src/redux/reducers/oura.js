const ouraReducer = ( state = {}, action ) => {

	switch( action.type ) {

		case "GETTOKEN_FULFILLED":
			return { ...state, token: action.payload }
		break

		case "GETSMAS_FULFILLED":
			return { ...state, smas: action.payload }
		break

		case "GETPROFILE_FULFILLED":
			return { ...state, profile: action.payload }
		break

		case "RESET_FULFILLED":
			return {  }
		break

		// Just return the state if no known action is specified
		default:
			return state
	}
}
export default ouraReducer