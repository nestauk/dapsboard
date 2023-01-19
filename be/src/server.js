import Fastify from 'fastify';

import { collection } from './db.js';


const fastify = Fastify({
	logger: true
});

const { PORT } = process.env || 3000;

fastify.put('/', (request, reply) => {
	collection.insertOne(request.body)
	reply.send('Insertion succeeded')
})

const getIdSchema = {
	params: {
		type: 'object',
		properties: {
			id: { type: 'number' }
		}
	}
}
fastify.get('/:id', { schema: getIdSchema }, async (request, reply) => {

	const { id } = request.params;
	const query = { id }
	const result = await collection.findOne(query)
	const replyBody = result || { error: `No doc with id ${id} found` }
	const code = result ? 200 : 404;
	reply.code(code).send(replyBody)
})

const cursor = await collection.find({})
cursor.forEach(console.log)

const start = async () => {
	try {
		await fastify.listen({ host: '0.0.0.0', port: PORT });
	} catch (err) {
		fastify.log.error(err);
		throw new Error(err);
	}
};

start()
