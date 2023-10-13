/**
 * External dependencies
 */
import path from 'node:path';
import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

// To ensure env vars like WP_BASE_URL are defined before loading the base config.
dotenvExpand.expand( dotenv.config() );

/**
 * WordPress dependencies
 */
import baseConfig from '@wordpress/scripts/config/playwright.config';

process.env.WP_ARTIFACTS_PATH ??= path.join( process.cwd(), 'artifacts' );
process.env.STORAGE_STATE_PATH ??= path.join(
	process.env.WP_ARTIFACTS_PATH,
	'storage-states/admin.json'
);
process.env.TEST_RUNS ??= '30';

const config = defineConfig( {
	...baseConfig,
	globalSetup: require.resolve( './config/global-setup.js' ),
	reporter: [ [ './config/performance-reporter.js' ] ],
	forbidOnly: !! process.env.CI,
	workers: 1,
	retries: 0,
	timeout: parseInt( process.env.TIMEOUT || '', 10 ) || 600_000, // Defaults to 10 minutes.
	// Don't report slow test "files", as we will be running our tests in serial.
	reportSlowTests: null,
	webServer: {
		...baseConfig.webServer,
		port: undefined,
		url: process.env.WP_BASE_URL,
		command: 'npm run env:start',
	},
	use: {
		...baseConfig.use,
		baseURL: process.env.WP_BASE_URL,
		video: 'off',
	},
} );

export default config;

