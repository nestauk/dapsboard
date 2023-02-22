import { MongoClient } from 'mongodb';

// Replace the uri string with your connection string.
const uri = "mongodb://mongo";
const client = new MongoClient(uri);

const database = client.db('dapsboard');
export const cache = database.collection('cache');

export const cacheRequest = (request, aggregation) => {
	const fresh = {
		_id: request.hash,
		url: request.url,
		body: request.body,
		aggregation
	};
	cache.updateOne({ _id: request.hash }, { $set: fresh }, { upsert: true });
}
