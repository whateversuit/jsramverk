import { should, use }from 'chai';
import * as chai from 'chai';
import chaiHttp from 'chai-http';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import { openDb, closeDb } from '../db/database.mjs';
import docs from '../docs.mjs'; // Importera din databaslogik

should();
use(chaiHttp);

let mongoServer;
let db;
let client;
const expect = chai.expect;

// Kör denna före alla tester för att starta en in-memory MongoDB-instans
before(async () => {
    // Skapa en ny MongoDB server i minnet
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Anslut till den temporära databasen i minnet
    client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db(); // Anslut till den databasen
});

// Stäng ned MongoDB-instansen efter alla tester
after(async () => {
    // Koppla från databasen
    await closeDb();
    // Stoppa den temporära MongoDB-servern
    // await mongoServer.stop();
});

// Kör denna före varje test för att göra setup, t.ex. rensa databasen
beforeEach(async () => {
    // Här kan du lägga till kod för att rensa databasen eller skapa testdata
    await docs.deleteMany();
});

describe("Database interaction via docs.mjs", () => {

    // Testa att skapa ett nytt dokument i databasen
    it("Det bör spara ett nytt dokument i databasen", async () => {
        const newPost = { title: "Test post", content: "Test content" };
        
        const result = await docs.addOne(newPost); // Använd addOne för att skapa ett dokument
        result.should.be.an('object');
        result.should.have.property('insertedId'); // Kontrollera att ett ID returneras

        const insertedId = result.insertedId;
        const savedPost = await docs.getOne(insertedId); // Hämta det sparade dokumentet

        savedPost.should.be.an('object');
        savedPost.should.have.property('title').eql(newPost.title);
        savedPost.should.have.property('content').eql(newPost.content);
    });

    // Testa att hämta alla dokument från databasen
    it("Det bör hämta alla dokument från databasen", async () => {
        const documents = await docs.getAll(); // Använd getAll för att hämta alla dokument
        documents.should.be.an('array');
    });

    // Testa att uppdatera ett dokument
    it("Det bör uppdatera ett dokument i databasen", async () => {
        const newPost = { title: "Initial post", content: "Initial content" };
        const result = await docs.addOne(newPost); // Lägg till ett dokument
        const postId = result.insertedId;

        const updatedPost = { title: "Updated post", content: "Updated content" };
        const updateResult = await docs.updateOne(postId, updatedPost); // Uppdatera dokumentet

        updateResult.should.be.an('object');
        updateResult.should.have.property('modifiedCount').eql(1); // Kontrollera att något ändrades

        const savedPost = await docs.getOne(postId); // Hämta det uppdaterade dokumentet
        savedPost.should.have.property('title').eql(updatedPost.title);
        savedPost.should.have.property('content').eql(updatedPost.content);
    });

    // Testa att radera ett dokument
    it("Det bör radera ett dokument i databasen", async () => {
        const newPost = { title: "Post to delete", content: "Content to delete" };
        const result = await docs.addOne(newPost); // Lägg till ett dokument
        const postId = result.insertedId;

        const deleteResult = await docs.deleteOne(postId); // Radera dokumentet
        deleteResult.should.be.an('object');
        deleteResult.should.have.property('deletedCount').eql(1); // Kontrollera att dokumentet raderades

        const deletedPost = await docs.getOne(postId); // Försök hämta det raderade dokumentet
        expect(deletedPost).to.be.null; // Kontrollera att dokumentet inte längre finns
    });
});
