export const setCompare = baseline => ( {
	type: 'SETCOMPARE',
	payload: Promise.resolve( baseline )
} )

export const another = true