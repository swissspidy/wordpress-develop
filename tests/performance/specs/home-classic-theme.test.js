/**
 * WordPress dependencies
 */
import { test } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies
 */
import { camelCaseDashes } from '../utils';

const results = {
	timeToFirstByte: [],
	largestContentfulPaint: [],
	lcpMinusTtfb: [],
};

test.describe( 'Front End - Twenty Twenty One', () => {
	test.use( {
		storageState: {}, // User will be logged out.
	} );

	test.beforeAll( async ( { requestUtils } ) => {
		await requestUtils.activateTheme( 'twentytwentyone' );
	} );

	test.afterAll( async ( {}, testInfo ) => {
		await testInfo.attach( 'results', {
			body: JSON.stringify( results, null, 2 ),
			contentType: 'application/json',
		} );
	} );

	test.beforeEach( async ( { browser } ) => {
		const page = await browser.newPage();
		// Clear caches.
		await page.goto( '/?reset_helper' );
		// Warm caches.
		await page.goto( '/' );
	} );

	const iterations = Number( process.env.TEST_RUNS );
	for ( let i = 1; i <= iterations; i++ ) {
		test( `Measure load time metrics (${ i } of ${ iterations })`, async ( {
			page,
			metrics,
			// lighthouse,
		} ) => {
			await page.goto( '/' );

			const serverTiming = await metrics.getServerTiming();

			for (const [key, value] of Object.entries( serverTiming ) ) {
				results[ camelCaseDashes( key ) ] ??= [];
				results[ camelCaseDashes( key ) ].push( value );
			}

			const ttfb = await metrics.getTimeToFirstByte();
			const lcp = await metrics.getLargestContentfulPaint();

			results.largestContentfulPaint.push( lcp );
			results.timeToFirstByte.push( ttfb );
			results.lcpMinusTtfb.push( lcp - ttfb );

			// const report = await lighthouse.getReport();
			// for (const [key, value] of Object.entries( report ) ) {
			// 	results[ camelCaseDashes( key ) ] ??= [];
			// 	results[ camelCaseDashes( key ) ].push( value );
			// }
		} );
	}
} );
