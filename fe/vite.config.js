// eslint-disable-next-line import/no-unresolved
import { sveltekit } from '@sveltejs/kit/vite';
import ViteYaml from '@modyfi/vite-plugin-yaml';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sveltekit(),
		ViteYaml()
	],
	server: {
		fs: {
			// Allow serving files from one level up to the project root
			allow: ['..']
		}
	}
};

export default config;
