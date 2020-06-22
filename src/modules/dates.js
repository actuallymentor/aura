export const daysago = days => {

	const now = new Date()
	now.setDate( now.getDate() - days )

	return now.toISOString().split( 'T' )[0]

	const newmonth = now.getMonth() < 9 ? '0' + ( now.getMonth() + 1 ) : now.getMonth() + 1 
	const newday = now.getDate() < 9 ? '0' + now.getDate() : now.getDate() 
	const newyear = now.getFullYear()
	return`${ newyear }-${ newmonth }-${ newday }`
}


export const daysSinceOura = f => {
	const foundedIn = new Date( '2013' )
	const msSinceFounding = Date.now() - foundedIn.getTime()
	const daysSinceFounding = msSinceFounding / ( 1000 * 60 * 60 * 24 )
	return daysSinceFounding
}