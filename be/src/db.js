import { MongoClient } from 'mongodb';

const { MONGO_ROOT_USER: user, MONGO_ROOT_PASSWORD: password } = process.env;
const uri = `mongodb://${user}:${password}@mongo`;
const client = new MongoClient(uri);

const database = client.db('dapsboard');
export const cache = database.collection('cache');

console.log(cache);

export const cacheRequest = (request, aggregation) => {
	const fresh = {
		_id: request.hash,
		url: request.url,
		body: request.body,
		aggregation
	};
	cache.updateOne({ _id: request.hash }, { $set: fresh }, { upsert: true });
}
