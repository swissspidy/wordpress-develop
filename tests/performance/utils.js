/**
 * Computes the median number from an array numbers.
 *
 * @param {number[]} array
 *
 * @return {number} Median.
 */
function median( array = [] ) {
	if ( ! array.length ) {
		return 0;
	}

	const mid = Math.floor( array.length / 2 );
	const numbers = [ ...array ].sort( ( a, b ) => a - b );
	return array.length % 2 !== 0
		? numbers[ mid ]
		: ( numbers[ mid - 1 ] + numbers[ mid ] ) / 2;
}

function standardDeviation( array = [] ) {
	if ( ! array.length ) {
		return 0;
	}

	const mean = array.reduce( ( a, b ) => a + b ) / array.length
	return Math.sqrt( array.map( ( x ) => Math.pow( x - mean, 2 ) ).reduce( ( a, b ) => a + b ) / array.length )
}
function medianAbsoluteDeviation( array = [] ) {
	if ( ! array.length ) {
		return 0;
	}

	const med = median( array );
	return median( array.map( ( a ) => Math.abs( a - med ) ) );
}

/**
 * Gets the result file name.
 *
 * @param {string} fileName File name.
 *
 * @return {string} Result file name.
 */
function getResultsFilename( fileName ) {
	const prefix = process.env.TEST_RESULTS_PREFIX;
	const fileNamePrefix = prefix ? `${ prefix }-` : '';
	return `${fileNamePrefix + fileName}.results.json`;
}

function camelCaseDashes( str ) {
	return str.replace( /-([a-z])/g, function( g ) {
		return g[ 1 ].toUpperCase();
	} );
}

module.exports = {
	median,
	getResultsFilename,
	camelCaseDashes,
	standardDeviation,
	medianAbsoluteDeviation,
};
