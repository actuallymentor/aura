// Based on https://www.mathsisfun.com/data/standard-deviation-formulas.html
const SD = ( series ) => {
	const total = series.reduce( ( acc, val ) => acc + val, 0 )
	const mean = total / series.length
	const squaredDistancesFromMean = series.map( nr => Math.pow( nr - mean, 2 ) )
	const totalOfDifferences = squaredDistancesFromMean.reduce( ( acc, val ) => acc + val, 0 )
	const meanOfDifferences = totalOfDifferences / series.length

	// Always SD to 2 decimals except when the value itself has decimals
	return Math.round( Math.sqrt( meanOfDifferences ) * 100 ) / 100
}

export const highestOfPropSMA = ( prop, sleepData, decimals=false ) => {

	const series = sleepData.map( day => day[ prop ] ).map( nrs => Math.max( ...nrs ) )
	const total = series.reduce( ( acc, val ) => acc + val, 0 )
	const sma = decimals ? ( Math.round( ( total / series.length ) * 100 ) / 100 ) : ( Math.round( total / series.length ) )
	const sd = SD( series )

	return {
		val: sma,
		sd: sd
	}


}

export const propSMA = ( prop, sleepData, decimals=false ) => {

	const series = sleepData.map( day => day[ prop ] )
	const total = series.reduce( ( acc, val ) => acc + val, 0 )
	const sma = decimals ? ( Math.round( ( total / series.length ) * 100 ) / 100 ) : ( Math.round( total / series.length ) )
	const sd = SD( series, decimals )

	return {
		val: sma,
		sd: sd
	}
}