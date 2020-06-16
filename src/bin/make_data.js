#!/usr/bin/env node -r esm

/* eslint-disable
	node/no-unpublished-import,
	node/shebang
*/

import path from 'path';

import * as _ from 'lamb';
import yaml from 'js-yaml';
import {readDir, readFile, saveObj, saveString} from '@svizzle/file';
import {tapMessage} from '@svizzle/dev';
import {applyFnMap} from '@svizzle/utils';

import {indexById, makeDatasetBySource, generateTypingsForAll} from 'app/utils';

const ESTYPINGS_PATH = path.resolve(__dirname, '../node_modules/app/elasticsearch/typings/es.ts');
const DSLTYPINGS_PATH = path.resolve(__dirname, '../node_modules/app/elasticsearch/typings/dsl.ts');
const TYPINGS_PATH = path.resolve(__dirname, '../../static/dsl/datasets.ts');

const DATASETS_PATH = path.resolve(__dirname, '../node_modules/app/data/datasets.json');
const ROUTES_PATH = path.resolve(__dirname, '../node_modules/app/data/routes.json');
const SIDEBAR_PATH = path.resolve(__dirname, '../node_modules/app/data/sidebar.json');
const SPECS_DIR = path.resolve(__dirname, '../../specs');

const isYamlFile = name => path.parse(name).ext === '.yaml';

const getPathName = string => path.parse(string).name;

const makeDatasetName = string => getPathName(string).split('_v')[0];
const makeLabel = string => getPathName(string).replace(/_/gu, ' ');
const makeProject = string => getPathName(string).split('_')[0];
const makeSource = string => getPathName(string).split('_')[1];
const makeVersion = string => getPathName(string).split('_')[2].replace('v', '');
const resolveSchema = string => path.resolve(SPECS_DIR, string);

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
const saveStr = (data, dest) => saveString(dest)(data).then(tapMessage(`Saved ${dest}`));

const process = async () => {
	const refs = await readDir(SPECS_DIR)
		.then(_.pipe([_.filterWith(isYamlFile), _.mapWith(makeSchemaObj)]));

	const datasets = await Promise.all(
		refs.map(obj =>
			readFile(obj.filepath, 'utf-8')
				.then(yaml.safeLoad)
				.then(spec => ({
					..._.skip(obj, ['filepath']),
					spec
				}))
		)
	);

	const esTypes = await readFile(ESTYPINGS_PATH, 'utf-8')
	const dslTypes = await readFile(DSLTYPINGS_PATH, 'utf-8')

	await save(datasets, DATASETS_PATH);
	await save(indexById(datasets), ROUTES_PATH);
	await save(makeDatasetBySource(datasets), SIDEBAR_PATH);
	await saveStr(dslTypes + esTypes + generateTypingsForAll(datasets).join('\n'), TYPINGS_PATH);
}

process().then(tapMessage('Done'));
