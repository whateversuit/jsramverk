import { MongoClient } from 'mongodb';

let client;

async function openDb() {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        // Anslut till MongoDB
        await client.connect();

        console.log("Connected to MongoDB");

        const dbName = 'docsforjsramverk';
        const database = client.db(dbName);
        const collection = database.collection('documents');

        return collection;
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        throw err;
    }
};

async function closeDb() {
    if (client) {
        await client.close();
        client = null;
    }
};

export { openDb, closeDb }
