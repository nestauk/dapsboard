import * as _ from 'lamb';


import { authenticate, parseBasicAuth } from 'dap_dv_backends_utils/auth/authentication.mjs';
import { CROSS_ORIGIN_DOMAINS, PROTECTED_DATASETS } from './conf.js';

const AUTH_ENDPOINT = 'https://authentication.dap-tools.uk/authenticate';

export const authenticationMiddleware = async (req, res, next) => {
	if ('authorization' in req.headers) {
		const authHeader = req.headers.authorization;
		if (!authHeader.startsWith('Basic')) {
			res.statusCode = 401;
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify({ error: 'Basic Authorization Header required' }));
			res.end();
			return;
		}
		const { email, token } = parseBasicAuth(authHeader);
		const isAuthorized = await authenticate(AUTH_ENDPOINT, email, token);
		// if user is authenticated then they can access all datasets
		if (isAuthorized) {
			next();
			return;
		}
		res.statusCode = 401;
		res.setHeader('Content-Type', 'application/json');
		res.write(JSON.stringify({ error: 'Token cannot be authenticated' }));
		res.end();
		return;
	}
	// check that the non-signed request is coming from dapsboard
	if (!_.isIn(CROSS_ORIGIN_DOMAINS, req.headers.origin)) {
		res.statusCode = 401;
		res.setHeader('Content-Type', 'application/json');
		res.write(JSON.stringify({ error: 'CORS policy is blocking this request' }));
		res.end();
		return;
	}
	const urlParts = _.split(req.url, '/')
	const dataset = urlParts.at(-2).trim();
	if (_.isIn(PROTECTED_DATASETS, dataset)) {
		res.statusCode = 401;
		res.setHeader('Content-Type', 'application/json');
		res.write(JSON.stringify({ error: 'This dataset is protected' }));
		res.end();
		return;
	}

	next();
};
