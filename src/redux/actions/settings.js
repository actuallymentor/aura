export const setCompare = baseline => ( {
	type: 'SETCOMPARE',
	payload: Promise.resolve( baseline )
} )

export const resetApp = f => ( {
	type: 'RESETAPP',
	payload: true
} )