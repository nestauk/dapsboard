import {
	authenticate,
	parseBasicAuth
} from 'dap_dv_backends_utils/auth/authentication.mjs';
import * as _ from 'lamb';

import {CROSS_ORIGIN_DOMAINS, PROTECTED_DATASETS} from './conf.js';

const AUTH_ENDPOINT = 'https://authentication.dap-tools.uk/authenticate';

export const authenticationHook = async req => {

	req.notAuthorised = false;

	if ('authorization' in req.headers) {
		const authHeader = req.headers.authorization;
		if (!authHeader.startsWith('Basic')) {
			req.notAuthorised = true;
			req.errorMessage = 'Basic Authorization Header required';
		}
		const { email, token } = parseBasicAuth(authHeader);
		const isAuthorized = await authenticate(AUTH_ENDPOINT, email, token);
		// if user is authenticated then they can access all datasets
		if (!isAuthorized) {
			req.notAuthorised = true;
			req.errorMessage = 'Token cannot be authenticated'
		}
	} else {
		// check that the non-signed request is coming from dapsboard
		if (!_.isIn(CROSS_ORIGIN_DOMAINS, req.headers.origin)) {
			req.notAuthorised = true;
			req.errorMessage = 'CORS policy is blocking this request';
		}
		const urlParts = _.split(req.url, '/')
		const dataset = urlParts.at(-2).trim();
		if (_.isIn(PROTECTED_DATASETS, dataset)) {
			req.notAuthorised = true;
			req.errorMessage = 'This dataset is protected'
		}
	}
};
