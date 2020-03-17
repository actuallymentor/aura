import React from 'react'
import { View } from 'react-native'
import { Text } from './generic'
import { merge, color } from '../styles/_helpers'
import generic from '../styles/generic'


import { relativeTime } from '../../modules/helpers'

// ///////////////////////////////
// Styling
// ///////////////////////////////
const dataStyle = { margin: 10, padding: 10, minWidth: 50, textAlign: 'center' }
const relativeStyle = ( week, today, lowerIsBetter=false ) => {

	const winning = lowerIsBetter ? ( today - week <= 0 ) : ( today - week >= 0 )
	let border = { backgroundColor: winning ? color.accent : color.error }
	if( week == today ) border.backgroundColor = 'grey'
	if( !week || !today ) border.backgroundColor = 'grey'

	return ( { color: 'white', ...border } )

}


// ///////////////////////////////
// Components
// ///////////////////////////////
export const TableHead = ( {  } ) => {
	const style = merge( dataStyle, { borderBottomColor: 'black', borderBottomWidth: 2 } )
	return <View style={ merge( generic.centerContent, { flexDirection: 'row' } ) }>
		<Text style={ dataStyle }></Text>
		<Text style={ style }>6m</Text>
		<Text style={ style }>1m</Text>
		<Text style={ style }>7d</Text>
		<Text style={ style }>t</Text>
	</View>
}
export const TableRow = ( { data, property, lowerIsBetter } ) => <View>
	<View style={ { display: 'flex', flexDirection: 'row' } }>
		<Text style={ merge( dataStyle, relativeStyle( ) ) }>{ data.semiannum[ property ].val }</Text>
		<Text style={ merge( dataStyle, relativeStyle( data.semiannum[ property ].val, data.month[ property ].val, lowerIsBetter ) ) }>{ data.month[ property ].val }</Text>
		<Text style={ merge( dataStyle, relativeStyle( data.month[ property ].val, data.week[ property ].val, lowerIsBetter ) ) }>{ data.week[ property ].val }</Text>
		<Text style={ merge( dataStyle, relativeStyle( data.week[ property ].val, data.day[ property ].val, lowerIsBetter ) ) } key={ `${ property }day` }>{ data.day[ property ].val }</Text>
	</View>
</View>

export const Table = ( { sma, toggleDetail } ) => {

	const brStyle = merge( dataStyle, { borderRightColor: 'black', borderRightWidth: 2 } )

	return <View style={ merge( generic.centerContent, { flex: 1 } ) }>
		<Text style={ merge( generic.centerContent, { padding: 20, textAlign: 'center' } ) }>Table compares each time period to the previous. I.e. day to week, month to semiannum.</Text>
		<TableHead />
		<View style={ merge( generic.centerContent, { flexDirection: 'row' } ) }>
			<View>
				<Text style={ merge( brStyle, { minWidth: 0 } ) }>aHrv</Text>
				<Text style={ merge( brStyle, { minWidth: 0 } ) }>hHrv</Text>
				<Text style={ merge( brStyle, { minWidth: 0 } ) }>lHr</Text>
			</View>
			<View>
				<TableRow title='aHRV:' data={ sma } property='aHrv' />
				<TableRow title='hHRV:' data={ sma } property='hHrv' />
				<TableRow title='lHr:' data={ sma } property='hr' lowerIsBetter={ true } />
			</View>
		</View>

		<Text style={ { textAlign: 'center', marginBottom: 10 } }>Last data point: { relativeTime( sma.week.last ) }</Text>

		<Text style={ { marginTop: 20, opacity: .5 } } onPress={ toggleDetail }>Toggle dashboard</Text>

	</View>

}