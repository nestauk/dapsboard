#!/usr/bin/env node -r esm

/* eslint-disable
	node/no-unpublished-import,
	node/shebang
*/

import path from 'path';

import * as _ from 'lamb';
import yaml from 'js-yaml';
import {readDir, readFile, saveObj} from '@svizzle/file';
import {tapMessage} from '@svizzle/dev';
import {applyFnMap} from '@svizzle/utils';

import {makeDatasetBySource} from 'app/utils/specs';
import {indexById} from 'app/utils/generic';

const DATASETS_PATH = path.resolve(__dirname, '../node_modules/app/data/datasets.json');
const ROUTES_PATH = path.resolve(__dirname, '../node_modules/app/data/routes.json');
const SIDEBAR_PATH = path.resolve(__dirname, '../node_modules/app/data/sidebar.json');
const INDICES_SPECS_DIR = path.resolve(__dirname, '../../specs/indices');

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

const process = async () => {
	const refs = await readDir(INDICES_SPECS_DIR)
	.then(_.pipe([_.filterWith(isYamlFile), _.mapWith(makeSchemaObj)]));

	const datasets = await Promise.all(
		refs.map(ref =>
			readFile(ref.filepath, 'utf-8')
			.then(yaml.safeLoad)
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

process().then(tapMessage('Done'));
