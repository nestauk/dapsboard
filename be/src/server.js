import Fastify from 'fastify';

import { cache } from './db.js';
import { hash } from './hash.js';


const fastify = Fastify({
	logger: true
});

const { PORT } = process.env || 3000;

fastify.post('/*', async (request, reply) => {

	const input = JSON.stringify(request.url) + JSON.stringify(request.body);
	const hashed = hash(input);

	const doc = await cache.findOne({ _id: hashed });

	if (doc) {
		return reply.send({
			...doc,
			mongo: true
		});
	}

	const fresh = {
		_id: hashed,
		url: request.url,
		body: request.body,
	};

	cache.insertOne(fresh);
	return reply.send({
		...fresh,
		mongo: false
	});
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
