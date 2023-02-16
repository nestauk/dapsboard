import * as _ from 'lamb';


import { authenticate, parseBasicAuth } from 'dap_dv_backends_utils/auth/authentication.mjs'
import { CROSS_ORIGIN_DOMAINS, PROTECTED_DATASETS } from './conf.js';


export const authenticationMiddleware = async (req, res, next) => {
	console.log(`HEADERS: ${JSON.stringify(req.headers, null, 2)}`)
	console.log('authorization' in req.headers)
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
		const isAuthorized = await authenticate(email, token);
		// if user is authenticated then they can access all datasets
		if (isAuthorized) {
			next();
		}
	} else {
		// check that the non-signed request is coming from dapsboard
		console.log("HOSTNAME: ", req.hostname)
		if (!(req.hostname in CROSS_ORIGIN_DOMAINS)) {
			res.statusCode = 401;
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify({ error: 'CORS policy is blocking this request' }));
			res.end();
			return;
		}
		const urlParts = _.split(req.url, '/')
		const dataset = urlParts.at(-2);
		if (dataset in PROTECTED_DATASETS) {
			res.statusCode = 401;
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify({ error: 'This dataset is protected' }));
			res.end();
			return;
		}

	}
	next();
};
