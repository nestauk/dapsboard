import cors from '@fastify/cors';
import middie from '@fastify/middie';
import Fastify from 'fastify';

import {cache} from './db.js';
import {hash} from './hash.js';
import {authenticationMiddleware} from './middleware.js'

const {PORT} = process.env;

const fastify = Fastify({
	logger: true
});

await fastify.register(cors, { origin: true });
await fastify.register(middie);

fastify.use(authenticationMiddleware)

fastify.route({
	method: ['GET', 'POST'],
	url: '/*',
	handler: async (request, reply) => {

		const input = JSON.stringify(request.url) + JSON.stringify(request.body);
		const hashed = hash(input);

		const doc = await cache.findOne({ _id: hashed });
		if (doc) {
			return reply.send(doc.aggregation);
		}

		const esEndpoint = request.url.slice(1, request.url.length);
		const response = await fetch(esEndpoint, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(request.body)
		});

		if (!response.ok) {
			return reply.code(response.status).send(await response.json())
		}

		const aggregation = await response.json();
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

const start = async () => {
	try {
		await fastify.listen({ host: '0.0.0.0', port: PORT });
	} catch (err) {
		fastify.log.error(err);
		throw new Error(err);
	}
};

start();
