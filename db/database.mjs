import { MongoClient } from 'mongodb';

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

export default openDb;
