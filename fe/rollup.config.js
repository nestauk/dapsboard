/* eslint-disable
	node/no-unpublished-import,
	node/no-process-env,
	node/no-deprecated-api
*/

import {babel} from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import yaml from '@rollup/plugin-yaml';
import cleanup from 'rollup-plugin-cleanup';
import svelte from 'rollup-plugin-svelte';

import config from 'sapper/config/rollup.js';
import pkg from './package.json';

const mode = process.env.NODE_ENV;
const isExported = process.env.SAPPER_EXPORT;
const inspect = process.env.INSPECT;
const dev = mode === 'development';
const legacy = Boolean(process.env.SAPPER_LEGACY_BUILD);
const Babel = babel({
	babelHelpers: 'runtime',
	exclude: ['node_modules/@babel/**'],
	extensions: ['.js', '.mjs', '.html', '.svelte'],
	presets: [
		['@babel/preset-env', {
			targets: '> 0.25%, not dead'
		}]
	],
	plugins: [
		'@babel/plugin-syntax-dynamic-import',
		'@babel/plugin-proposal-optional-chaining',
		['@babel/plugin-transform-runtime', {
			useESModules: true
		}]
	],
});

const onwarn = (warning, _onwarn) =>
	warning.code === 'MISSING_EXPORT'
		&& (/'preload'/u).test(warning.message)
	|| warning.code === 'CIRCULAR_DEPENDENCY'
		&& (/[/\\]@sapper[/\\]/u).test(warning.message)
	|| _onwarn(warning);

export default {
	client: {
		input: config.client.input(),
		output: config.client.output(),
		preserveEntrySignatures: false,
		plugins: [
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode),
				'process.env.SAPPER_EXPORT': JSON.stringify(isExported),
				'process.env.INSPECT': JSON.stringify(inspect)
			}),
			svelte({
				compilerOptions: {
					dev,
					hydratable: true,
				}
			}),
			resolve({
				// browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),
			json(),
			yaml(),
			cleanup(),

			legacy && Babel,

			!dev && terser({
				module: true
			})
		],
		onwarn,
	},

	server: {
		input: config.server.input(),
		output: config.server.output(),
		preserveEntrySignatures: 'strict',
		plugins: [
			replace({
				'process.browser': false,
				'process.env.NODE_ENV': JSON.stringify(mode),
				'process.env.SAPPER_EXPORT': JSON.stringify(isExported),
				'process.env.INSPECT': JSON.stringify(inspect)
			}),
			svelte({
				compilerOptions: {
					generate: 'ssr',
					dev,
				}
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
				require('module').builtinModules
				|| Object.keys(process.binding('natives'))
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
				'process.env.SAPPER_EXPORT': JSON.stringify(isExported),
				'process.env.INSPECT': JSON.stringify(inspect)
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
