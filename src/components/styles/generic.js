import { color, fontSize, StyleSheet } from './_helpers'

export default StyleSheet.create( {
	container: {
		flexGrow: 1,
		backgroundColor: color.background,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: 10,
		paddingRight: 10
	},
	centerContent: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	}
} )