
import { openDb } from './db/database.mjs';
import database from './db/database.mjs';
import { ObjectId } from 'mongodb';

const docs = {
    getAll: async function () {
        const collection = await database.getDb(); // Use the collection returned by getDb
        try {
            return await collection.find().toArray(); // Get all documents
        } catch (e) {
            console.error(e);
            return [];
        }
    },

    getOne: async function (id) {
        const collection = await database.getDb();
        console.log(`Trying to create ObjectId from: ${id}`);

        if (!ObjectId.isValid(id)) {
            console.error(`Invalid ObjectId: ${id}`);
            return null;
        }

        const objectId = new ObjectId(id);
        try {
            return await collection.findOne({ _id: objectId }); // Get one document
        } catch (e) {
            console.error(e);
            return {};
        }
    },

    addOne: async function (body) {
        const collection = await database.getDb();
        console.log("Received document data in backend (addOne):", body);
        try {
            const result = await collection.insertOne({
                title: body.title,
                content: body.content
            });
            return result;
        } catch (e) {
            console.error("Failed to insert document:", e);
            throw new Error('Database insert error');
        }
    },

    updateOne: async function (id, body) {
        const collection = await database.getDb();

        if (!ObjectId.isValid(id)) {
            console.error(`Invalid ObjectId: ${id}`);
            return null;
        }

        try {
            const result = await collection.updateOne(
                { _id: new ObjectId(id) },
                { $set: { title: body.title, content: body.content }}
            );
            return result;
        } catch (e) {
            console.error('Failed to update document:', e);
            throw new Error('Database update error');
        }
    },

    deleteOne: async function (id) {
        const collection = await database.getDb();

        if (!ObjectId.isValid(id)) {
            console.error(`Invalid ObjectId: ${id}`);
            return null;
        }

        try {
            const result = await collection.deleteOne({ _id: new ObjectId(id) });
            return result;
        } catch (e) {
            console.error('Failed to delete document:', e);
            throw new Error('Database delete error');
        }
    },

    // Add a deleteMany function to delete all documents
    deleteMany: async function () {
        const collection = await openDb(); // Get collection directly
        try {
            const result = await collection.deleteMany({});
            return result; // Return the result from deleteMany
        } catch (e) {
            console.error('Failed to delete many documents:', e);
            throw new Error('Database deleteMany error');
        }
    }
};

export default docs;
