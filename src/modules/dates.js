const daysago = days => {

	const now = new Date()
	now.setDate( now.getDate() - days )

	const newmonth = now.getMonth() < 9 ? '0' + ( now.getMonth() + 1 ) : now.getMonth() + 1 
	const newday = now.getDate()
	const newyear = now.getFullYear()
	return`${ newyear }-${ newmonth }-${ newday }`
}


export default daysago