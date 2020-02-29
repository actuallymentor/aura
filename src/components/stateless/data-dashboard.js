import React from 'react'
import { View } from 'react-native'
import { Text } from './generic'
import { merge, color as colors } from '../styles/_helpers'
import generic from '../styles/generic'
import colorConvert from 'color'

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

export const Dashboard = ( { style, sma, compare, next, back } ) => {

	const [ now, then ] = compare

	return <View style={ merge( generic.centerContent, { flex: 1 } ) }>

		<View style={ merge( generic.centerContent, { marginBottom: 50 } ) }>
			<Text style={ { fontSize: 30 } }>Today</Text>
			<View style={ merge( generic.centerContent, { flexDirection: 'row' } ) }>
				<Text onPress={ back } style={ { fontSize: 20, width: 30, textAlign: 'center' } }>{ '<' }</Text>
				<Text>{ now } vs { then }</Text>
				<Text onPress={ next } style={ { fontSize: 20, width: 30, textAlign: 'center' } }>{ '>' }</Text>
			</View>
		</View>
		
	
		<NumberContext name='Avg HRV' number={ sma[ now ].aHrv } baseline={ sma[ then ].aHrv } size={ 15 } />

		<View style={ merge( generic.centerContent ), { flexDirection: 'row', marginTop: 20 } }>
			<NumberContext name='High HRV' number={ sma[ now ].hHrv } baseline={ sma[ then ].hHrv } size={ 10 } />
			<NumberContext name='Low HR' number={ sma[ now ].hr } baseline={ sma[ then ].hr } size={ 10 } lowerBetter={ true } />
		</View>

	</View>

}

export const another = true