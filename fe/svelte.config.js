import adapterAuto from '@sveltejs/adapter-auto';
import adapterStatic from '@sveltejs/adapter-static';
import adapterNetlify from '@sveltejs/adapter-netlify';

import sources from './src/lib/app/data/sidebar.json' assert { type: 'json' };

const sourceIds = sources.map(({source}) => source);
const exploreRoutes = sourceIds.map(id => `/explore/${id}`);

// eslint-disable-next-line no-process-env
const {ADAPTER} = process.env;

const adapterMap = {
	auto: adapterAuto(),
	netlify: adapterNetlify({
		edge: false,
		split: false
	}),
	static: adapterStatic()
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	kit: {
		adapter: adapterMap[ADAPTER] || adapterMap.auto,
		prerender: {
			entries: ['*', ...exploreRoutes]
		}
	}
};

export default config;
