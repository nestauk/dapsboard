export const isDev = import.meta.env?.DEV || true;

/* cache */

const cacheEnv = import.meta.env?.VITE_CACHE_ENV || 'dev'; // local, dev, prod
const cacheURLs = {
	dev: 'https://dapsboard.cache.dev.dap-tools.uk',
	local: 'http://localhost:4000',
	staging: 'https://dapsboard.cache.staging.dap-tools.uk'
};
export const selectedCacheURL = cacheURLs[cacheEnv];
export const useCache = true;
