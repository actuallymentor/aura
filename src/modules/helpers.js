// ///////////////////////////////
// Helpers
// ///////////////////////////////
export const relativeTime = time => {
	const day = 1000 * 60 * 60 * 24
	const date = new Date( time )
	const now = new Date()

	if( now - date < day ) return 'Today'
	if( now - date < day * 2 ) return 'Yesterday'
	if( now - date < day * 3 ) return '3 Days ago'

	return date.toDateString( )


}

export const another = false