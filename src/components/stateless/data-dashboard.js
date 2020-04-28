import React from 'react'
import { View, ScrollView, RefreshControl, TouchableOpacity } from 'react-native'
import { Text } from './generic'
import { merge, color as colors } from '../styles/_helpers'
import generic from '../styles/generic'
import colorConvert from 'color'
import { relativeTime, humanTimeFromStamp } from '../../modules/helpers'

// ////////////////////////////////////////
// Data circles and supporting components
// ////////////////////////////////////////
const Judgement = ( { delta, size, color } ) => {
	delta = delta > 0 ? ( delta = `+${delta}` ) : delta
	return <Text style={ { textAlign: 'center', fontSize: 3 * size, color: color } }>{ delta }%</Text>
}


const NumberContext = ( { name, number, baseline, size=1, lowerBetter=false } ) => {

	// Conditional
	const diff = number - baseline
	const delta = Math.floor( ( diff / baseline ) * 100 )
	const good = lowerBetter ? ( delta <= 0 ) : ( delta >= 0 )

	// Status color
	let color
	if( delta != 0 ) color = good ? colors.accent : colors.error
	else color = colors.neutral

	// Create rgb from color
	let hsl = colorConvert( color ).darken( .5 ).alpha( .3 ).hsl().string()

	// Style
	const dimensions = 12 * size 
	const border = { width: dimensions, height: dimensions, borderWidth: 4, borderRadius: 100, borderColor: hsl }

	return <View style={ merge( generic.centerContent, { padding: 10 } ) }>
	
		<View style={ merge( generic.centerContent, border ) }>
			<Text>{ name }</Text>
			<Judgement size={ size } then={ baseline } now={ number } color={ color } delta={ delta } />
			<Text style={ { fontSize: 1 * size, opacity: 0.5 } }> { number } / { baseline }</Text>
		</View>

	</View>

}

const DataControls = ( { next, back, current, fontSize } ) => <View style={ merge( generic.centerContent, { flexDirection: 'row' } ) }>
	<Text onPress={ back } style={ { fontSize: fontSize, width: 1.1 * fontSize, textAlign: 'center' } }>{ '<' }</Text>
	<Text onPress={ next } style={ { fontSize: fontSize } }>{ current }</Text>
	<Text onPress={ next } style={ { fontSize: fontSize, width: 1.1 * fontSize, textAlign: 'center' } }>{ '>' }</Text>
</View>


const DataCircles = ( { headFont=18, now, then, normalDeviation, cycleDeviation, numeratorNext, numeratorBack, baselineNext, baselineBack, toggleDetail, sma  } ) => <View style={ generic.centerContent }>
	<View style={ merge( generic.centerContent, { marginBottom: 50, flexDirection: 'row', padding: 10, flexWrap: 'wrap' } ) }>
		<Text style={ { fontSize: headFont } }>Compare this</Text>
		<DataControls fontSize={ headFont } next={ numeratorNext } back={ numeratorBack } current={ now } />
		<Text style={ { fontSize: headFont } }>to this</Text>
		<DataControls fontSize={ headFont } next={ baselineNext } back={ baselineBack } current={ then } />

		<View style={ { flexDirection: 'row', justifyContent: 'center', width: '100%', paddingVertical: 10 } }>
			<Text style={ { fontSize: headFont } }>Anomaly sensitivity: </Text>
			<DataControls fontSize={ headFont } next={ f => cycleDeviation( 'down' ) } back={ f => cycleDeviation( 'down' ) } current={ normalDeviation } />
			<Text style={ { fontSize: headFont } }> standard deviations</Text>
		</View>

		<Text style={ { marginTop: 20, opacity: .5, width: '100%', textAlign: 'center' } } onPress={ toggleDetail }>Last data: { relativeTime( sma[ now ].last ) }, last sync: { humanTimeFromStamp( sma.synctimestamp ) }</Text>

	</View>
	

	<NumberContext name='Avg HRV' number={ sma[ now ].aHrv.val } baseline={ sma[ then ].aHrv.val } size={ 15 } />

	<View style={ merge( generic.centerContent ), { flexDirection: 'row' } }>
		<NumberContext name='High HRV' number={ sma[ now ].hHrv.val } baseline={ sma[ then ].hHrv.val } size={ 10 } />
		<NumberContext name='Low HR' number={ sma[ now ].hr.val } baseline={ sma[ then ].hr.val } size={ 10 } lowerBetter={ true } />
	</View>
</View>

// ///////////////////////////////
// Anomaly display
// ///////////////////////////////
export const AnomalyNotification = ( { style, anomalies, toggleAnomalies, showAnomalies } ) => <TouchableOpacity
style={ merge( generic.centerContent, { padding: 20, paddingTop: 40, width: '100%' }, style ) }
onPress={ toggleAnomalies }>
	{ !showAnomalies && <Text>⚠️ View { anomalies.length } { anomalies.length > 1 ? 'anomalies' : 'anomaly' }</Text> }
	{ showAnomalies && <AnomalySquares anomalies={ anomalies } /> }
</TouchableOpacity>

const Row = ( { data, style } ) => <View style={ merge( generic.centerContent, { flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginBottom: 10 }, style ) }>
	<Text style={ { minWidth: 90, flex: 1 } }>{ data[0] }</Text>
	<Text style={ { textAlign: 'right', minWidth: 60, flex: 1 } }>{ data[1] }%</Text>
	{ data.slice( 2 ).map( val => <Text style={ { textAlign: 'right', minWidth: 60, flex: 1 } }>{ val }</Text> ) }
</View>

const AnomalyList = ( { style, anomalies } ) => <View style={ merge( generic.centerContent, { width: '100%' } ) }>
	<Row style={ { marginBottom: 20 } } data={ [ 'Variable', 'Delta ', 'Value', 'Baseline', 'SD' ] } />
	{ anomalies.map( ( { prop, delta, val, baseval, sd } ) => <Row key={ prop } data={ [ prop, delta, val, baseval, sd ] } /> ) }
	<Text style={ { marginTop: 20 } }>Click to return to dashboard</Text>
</View>

const AnomalySquares = ( { style, anomalies } ) => <View style={ merge( generic.centerContent, { width: '100%', flexDirection: 'column', flexWrap: 'wrap' } ) }>

	<Text style={ { fontSize: 20 } }>Anomalies</Text>

	<View style={ { padding: 20 } }>
		<Text style={ { textAlign: 'center' } }>An anomaly is any value that falls outside of 2 standard deviations of the baseline.</Text>
		<Text style={ { textAlign: 'center', opacity: .5, marginTop: 10 } }>Notation: comparisson value / ( baseline value ± standard deviation )</Text>
	</View>

	<View style={ merge( generic.centerContent, { width: '100%', justifyContent: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', marginVertical: 30 } ) }>
		{ anomalies.map( ( { prop, delta, val, baseval, sd } ) => <View key={ prop } style={ merge( generic.centerContent, { width: '50%', minWidth: 180, height: 120, padding: 5 } ) }>
			<View style={ merge( generic.centerContent, { borderWidth: 1, borderColor: colors.divider, padding: 10, width: '100%', height: '100%' } ) }>
				<Text style={ { textAlign: 'center', fontSize: 20 } }>{ delta }%</Text>
				<Text style={ { textAlign: 'center', marginBottom: 10 } }>{ prop }</Text>
				<Text style={ { textAlign: 'center', opacity: .5 } }>{val} / ( { baseval } ± { sd } )</Text>
			</View>
		</View> ) }
	</View>
	

	<Text style={ { marginTop: 20 } }>Click to return to dashboard</Text>

</View>

/// ///////////////////////////////
// Controlling dash component
// ///////////////////////////////
export const Dashboard = ( { style, sma, compare, baselineNext, baselineBack, numeratorNext, numeratorBack, normalDeviation, cycleDeviation, toggleDetail, onPull, syncing, anomalies, showAnomalies, toggleAnomalies } ) => {

	const [ now, then ] = compare

	return <ScrollView
	contentContainerStyle={ merge( generic.centerContent, { flex: 1, paddingTop: 50 }, style ) }
	style={ { flex: 1, width: '100%' } }
	refreshControl={ <RefreshControl progressViewOffset={ 50 } title='Syncing...' refreshing={ syncing } onRefresh={ onPull } /> }
	>

		{ !showAnomalies && <DataCircles normalDeviation={ normalDeviation } cycleDeviation={ cycleDeviation } now={ now } then={ then } numeratorNext={ numeratorNext } numeratorBack={ numeratorBack } baselineNext={ baselineNext } baselineBack={ baselineBack } toggleDetail={ toggleDetail } sma={ sma } /> }

		{ anomalies.length > 0 && <AnomalyNotification showAnomalies={ showAnomalies } toggleAnomalies={ toggleAnomalies } anomalies={ anomalies } /> }
		
		{ !showAnomalies && <Text style={ { marginTop: 20, opacity: .5 } } onPress={ toggleDetail }>Toggle table</Text> }


	</ScrollView>

}

