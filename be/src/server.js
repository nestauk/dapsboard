import { collection } from "./db.js";

const cursor = await collection.find({})
// print a message if no documents were found
if (await cursor.count() === 0) {
	console.log("No documents found!");
}
await cursor.forEach(console.dir)
