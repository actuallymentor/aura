export const lowestHrSMA = sleepData => {

	const hr = sleepData.map( day => day[ "hr_lowest" ] )
	const totalHr = hr.reduce( ( acc, val ) => acc + val, 0 )

	return totalHr / hr.length

}

export const avgHrvSMA = sleepData => {

	const hrv = sleepData.map( day => day[ "rmssd" ] )
	const totalHrv = hrv.reduce( ( acc, val ) => acc + val, 0 )

	return totalHrv / hrv.length

}

export const highestHrvSMA = sleepData => {

	const highestHrvs = sleepData.map( day => day[ "rmssd_5min" ] ).map( hrvArr => Math.max( ...hrvArr ) )
	const totalHighestHrvs = highestHrvs.reduce( ( acc, val ) => acc + val, 0 )

	return totalHighestHrvs / highestHrvs.length

}