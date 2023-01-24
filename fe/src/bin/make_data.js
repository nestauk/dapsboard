#!/usr/bin/env node -r esm

/* eslint-disable
	node/shebang
*/

import path from 'node:path';
import {fileURLToPath} from 'node:url';

import {readDir, readFile, saveObj} from '@svizzle/file';
import {tapMessage} from '@svizzle/dev';
import {applyFnMap} from '@svizzle/utils';
import yaml from 'js-yaml';
import * as _ from 'lamb';

import {makeDatasetBySource} from '$lib/utils/specs.js';
import {indexById} from '$lib/utils/generic.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DATASETS_PATH = path.resolve(__dirname, '../lib/app/data/datasets.json');
const ROUTES_PATH = path.resolve(__dirname, '../lib/app/data/routes.json');
const SIDEBAR_PATH = path.resolve(__dirname, '../lib/app/data/sidebar.json');
const INDICES_SPECS_DIR = path.resolve(__dirname, '../../../specs/indices');

const isYamlFile = name => path.parse(name).ext === '.yaml';

const getPathName = string => path.parse(string).name;

const makeDatasetName = string => getPathName(string).split('_v')[0];
const makeLabel = string => getPathName(string).replace(/_/gu, ' ');
const makeProject = string => getPathName(string).split('_')[0];
const makeSource = string => getPathName(string).split('_')[1];
const makeVersion = string => getPathName(string).split('_')[2].replace('v', '');
const resolveSchema = string => path.resolve(INDICES_SPECS_DIR, string);

const makeSchemaObj = applyFnMap({
	dataset: makeDatasetName,
	filepath: resolveSchema,
	id: getPathName,
	label: makeLabel,
	project: makeProject,
	source: makeSource,
	version: makeVersion
});

const save = (data, dest) => saveObj(dest, 2)(data).then(tapMessage(`Saved ${dest}`));

const run = async () => {
	const refs = await readDir(INDICES_SPECS_DIR)
	.then(_.pipe([_.filterWith(isYamlFile), _.mapWith(makeSchemaObj)]));

	const datasets = await Promise.all(
		refs.map(ref =>
			readFile(ref.filepath, 'utf-8')
			.then(yaml.load)
			.then(spec => ({
				..._.skipIn(ref, ['filepath']),
				spec
			}))
		)
	);

	await save(datasets, DATASETS_PATH);
	await save(indexById(datasets), ROUTES_PATH);
	await save(makeDatasetBySource(datasets), SIDEBAR_PATH);
}

run().then(tapMessage('Done'));
