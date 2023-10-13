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
const baseConfig = require( '@wordpress/scripts/config/playwright.config' );

process.env.WP_ARTIFACTS_PATH ??= path.join( process.cwd(), 'artifacts' );
process.env.STORAGE_STATE_PATH ??= path.join(
	process.env.WP_ARTIFACTS_PATH,
	'storage-states/admin.json'
);

const config = defineConfig( {
	...baseConfig,
	globalSetup: require.resolve( './config/global-setup.js' ),
	webServer: {
		...baseConfig.webServer,
		port: undefined,
		url: process.env.WP_BASE_URL,
		command: 'npm run env:start',
	},
} );

export default config;
