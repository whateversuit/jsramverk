import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const database = {
    getDb: async function () {
        let dsn = `mongodb+srv://EmilSagajsramverk:${process.env.ATLAS_PASSWORD}@cluster0.3glcy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test";
        }

        const client = new MongoClient(dsn, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        try {
            await client.connect();
            console.log("Connected to MongoDB!");

            const dbName = process.env.NODE_ENV === 'test' ? 'test' : 'docsforjsramverk';
            const db = client.db(dbName);
            const collection = db.collection("documents");

            return collection;
        } catch (err) {
            console.error("Failed to connect to MongoDB", err);
            throw err;
        }
    }
};

export default database;
