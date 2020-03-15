// Based on https://www.mathsisfun.com/data/standard-deviation-formulas.html
const SD = series => {
	const total = series.reduce( ( acc, val ) => acc + val, 0 )
	const mean = total / series.length
	const squaredDistancesFromMean = series.map( nr => Math.pow( nr - mean, 2 ) )
	const totalOfDifferences = squaredDistancesFromMean.reduce( ( acc, val ) => acc + val, 0 )
	const meanOfDifferences = totalOfDifferences / series.length
	return Math.sqrt( meanOfDifferences )
}

export const highestOfPropSMA = ( prop, sleepData, decimals=false ) => {

	const series = sleepData.map( day => day[ prop ] ).map( nrs => Math.max( ...nrs ) )
	const total = series.reduce( ( acc, val ) => acc + val, 0 )

	if( decimals ) return Math.round( ( total / series.length ) * 100 ) / 100
	if( !decimals ) return Math.round( total / series.length )


}

!!!!!!!! Todo: use SD function and change the data dashboard and table to understand it.

export const propSMA = ( prop, sleepData, decimals=false ) => {

	const series = sleepData.map( day => day[ prop ] )
	const total = series.reduce( ( acc, val ) => acc + val, 0 )

	if( decimals ) return Math.round( ( total / series.length ) * 100 ) / 100
	if( !decimals ) return Math.round( total / series.length )


}