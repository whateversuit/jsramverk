import openDb from './db/database.mjs';
import { ObjectId } from 'mongodb';

const docs = {
    getAll: async function getAll() {
        const collection = await openDb(); // Få collection direkt
        try {
            console.log(collection.find());
            return await collection.find().toArray(); // Hämta alla docs
        } catch (e) {
            console.error(e);
            return [];
        }
    },

    getOne: async function getOne(id) {
        const collection = await openDb(); // Få collection direkt
        console.log(`Försöker skapa ObjectId från: ${id}`);

        // Kontrollera om id är ett giltigt ObjectId
        if (!ObjectId.isValid(id)) {
            console.error(`Ogiltigt ObjectId: ${id}`);
            return null; // Returnera null eller ett annat värde för ogiltiga ID:n
        }

        const objectId = new ObjectId(id);
        try {
            return await collection.findOne({ _id: objectId }); // Hämta ett doc
        } catch (e) {
            console.error(e);
            return {};
        }
    },

    addOne: async function addOne(body) {
        const collection = await openDb(); // Få collection direkt
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

    updateOne: async function updateOne(id, body) {
        console.log("Received ID for updateOne (backend):", id); // Check ID value before validation
        const collection = await openDb(); // Få collection direkt
        // Kontrollera om id är ett giltigt ObjectId
        if (!ObjectId.isValid(id)) {
            console.error(`Ogiltigt ObjectId: ${id}`);
            return null; // Returnera null eller ett annat värde för ogiltiga ID:n
        }

        try {
            const result = await collection.updateOne(
                { _id: new ObjectId(id) }, // Hitta doc med id
                { $set: { title: body.title, content: body.content }} // Uppdatera doc
            );
            return result; // Återvänd result för att veta om något ändrades
        } catch (e) {
            console.error('Failed to update document:', e);
            throw new Error('Database update error'); // Kasta ett fel som kan fångas i rutten
        }
    },

    deleteOne: async function deleteOne(id) {
        const collection = await openDb(); // Få collection direkt
        // Kontrollera om id är ett giltigt ObjectId
        if (!ObjectId.isValid(id)) {
            console.error(`Ogiltigt ObjectId: ${id}`);
            return null; // Returnera null eller ett annat värde för ogiltiga ID:n
        }
    
        try {
            const result = await collection.deleteOne({ _id: new ObjectId(id) });
            return result; // Återvänd result för att veta om dokumentet togs bort
        } catch (e) {
            console.error('Failed to delete document:', e);
            throw new Error('Database delete error'); // Kasta ett fel som kan fångas i rutten
        }
    },
    
};

export default docs;
