import { Command } from 'commander';
import { MongoClient } from 'mongodb';

const { MONGO_ROOT_USER: user, MONGO_ROOT_PASSWORD: password } = process.env;

if (!user || !password) {
	throw new Error(`You must set the MONGO_ROOT_USER and MONGO_ROOT_PASSWORD 
	envrionment variables in order to use this script.`)
}

const uri = `mongodb://${user}:${password}@dapsboard.cache.dev.dap-tools.uk:27017`;
const client = new MongoClient(uri);

const database = client.db('dapsboard');
const cache = database.collection('cache');


const program = new Command();
program.requiredOption(
	'-i, --index <index>',
	'ES index corresponding to the cache to clear'
);

program.parse();
const options = program.opts();

const main = async () => {
	const cursor = cache.find({ url: { $regex: `.*/${options.index}$` } })
	for await (const doc of cursor) {
		await cache.deleteOne(doc);
	}
	await cursor.close();
	process.exit(0);
}

main();
