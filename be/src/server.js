import cors from '@fastify/cors';
import Fastify from 'fastify';
import * as _ from 'lamb';

import { buildRequest, makeRequest } from 'dap_dv_backends_utils/es/requests.mjs';

import {coverage} from './coverage.js'
import {cache, cacheRequest} from './db.js';
import {hash} from './hash.js';
import {authenticationHook} from './hooks.js';

const {PORT} = process.env;

const fastify = Fastify({
	logger: false
});

await fastify.register(cors, { origin: true });

fastify.addHook('onRequest', authenticationHook);

fastify.addHook('preValidation', async (request, reply) => {
	const input = JSON.stringify(request.url) + JSON.stringify(request.body);
	request.hash = hash(input);
	const doc = await cache.findOne({ _id: request.hash });
	if (doc) {
		return reply.send(doc.aggregation);
	}
})

const esRoute = '/es/*'
fastify.route({
	method: ['GET', 'POST'],
	url: esRoute,
	handler: async (request, reply) => {

		if (request.notAuthorised) {
			return reply.code(401).send({ error: request.errorMessage });
		}

		const input = JSON.stringify(request.url) + JSON.stringify(request.body);
		const hashed = hash(input);

		const doc = await cache.findOne({ _id: hashed });
		if (doc) {
			return reply.send(doc.aggregation);
		}

		const esEndpoint = request.url.slice(1, request.url.length);
		// 18 - length of string /coverage/ and of string https://
		const removeProtocol = _.replace(/https?:\/\//gu, '');
		const [domain, index, path] = _.split(removeProtocol(esEndpoint), '/');
		const req = buildRequest(
			domain,
			`${index}/${path}`,
			request.method,
			{
				payload: JSON.stringify(request.body)
			}
		);
		const response = await makeRequest(req);
		if (!response.code.toString().startsWith("2")) {
			return reply.code(response.code).send(response.body);
		}

		const aggregation = response.body;
		const fresh = {
			_id: hashed,
			url: request.url,
			body: request.body,
			aggregation
		};
		cache.updateOne({ _id: hashed }, { $set: fresh }, { upsert: true });
		return reply.send(aggregation);
	}
});

const coverageRoute = '/coverage/*'
fastify.get(coverageRoute, async (request, reply) => {

	// 18 - length of string /coverage/ and of string https://
	const esEndpoint = request.url.slice(coverageRoute.length - 1, request.url.length);
	const removeProtocol = _.replace(/https?:\/\//gu, '')
	const [domain, index] = _.split(removeProtocol(esEndpoint), '/')
	const aggregation = await coverage(domain, index);
	cacheRequest(request, aggregation);
	return reply.send(aggregation);
})

const start = async () => {
	try {
		await fastify.listen({ host: '0.0.0.0', port: PORT });
	} catch (err) {
		fastify.log.error(err);
		throw new Error(err);
	}
};

start();
