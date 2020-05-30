/* eslint-disable
	node/no-unpublished-import,
	node/no-process-env,
	node/no-deprecated-api
*/

import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import cleanup from "rollup-plugin-cleanup";
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';
import yaml from '@rollup/plugin-yaml';

import config from 'sapper/config/rollup.js';
import pkg from './package.json';

const mode = process.env.NODE_ENV;
const isExported = process.env.SAPPER_EXPORT;
const dev = mode === 'development';
const legacy = Boolean(process.env.SAPPER_LEGACY_BUILD);

const onwarn = (warning, _onwarn) =>
	warning.code !== 'CIRCULAR_DEPENDENCY' && _onwarn(warning);

export default {
	client: {
		input: config.client.input(),
		output: config.client.output(),
		preserveEntrySignatures: false,
		plugins: [
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode),
				'process.env.SAPPER_EXPORT': JSON.stringify(isExported)
			}),
			svelte({
				dev,
				hydratable: true,
				emitCss: true,
			}),
			resolve({
				// browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),
			json(),
			yaml(),
			cleanup(),

			legacy && babel({
				extensions: ['.js', '.mjs', '.html', '.svelte'],
				runtimeHelpers: true,
				exclude: ['node_modules/@babel/**'],
				presets: [
					['@babel/preset-env', {
						targets: '> 0.25%, not dead'
					}]
				],
				plugins: [
					'@babel/plugin-syntax-dynamic-import',
					['@babel/plugin-transform-runtime', {
						useESModules: true
					}]
				]
			}),

			!dev && terser({
				module: true
			})
		],

		onwarn,
	},

	server: {
		input: config.server.input(),
		output: config.server.output(),
		preserveEntrySignatures: false,
		plugins: [
			replace({
				'process.browser': false,
				'process.env.NODE_ENV': JSON.stringify(mode),
				'process.env.SAPPER_EXPORT': JSON.stringify(isExported)
			}),
			svelte({
				generate: 'ssr',
				dev,
			}),
			resolve({
				dedupe: ['svelte']
			}),
			commonjs(),
			json(),
			yaml(),
			cleanup(),
		],
		external:
			// /* eslint-disable node/global-require */
			Object.keys(pkg.dependencies)
				.filter(name => ![
					'@svizzle/barchart',
					'@svizzle/choropleth',
				].includes(name))
				.concat(
					require('module').builtinModules ||
					Object.keys(process.binding('natives'))
				),

		onwarn,
	},

	serviceworker: {
		input: config.serviceworker.input(),
		output: config.serviceworker.output(),
		preserveEntrySignatures: false,
		plugins: [
			resolve(),
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode),
				'process.env.SAPPER_EXPORT': JSON.stringify(isExported)
			}),
			commonjs(),
			json(),
			yaml(),
			cleanup(),
			!dev && terser()
		],

		onwarn,
	}
};
