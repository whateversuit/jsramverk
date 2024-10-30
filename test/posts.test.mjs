// import * as chai from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it, beforeEach, before, after } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb'; 
import app from '../app.mjs';
import { openDb, closeDb } from "../db/database.mjs";

chai.should();
chai.use(chaiHttp);

describe("Posts API", () => {

    let mongoServer;
    let db;
    let client;

    // Kör denna före alla tester för att starta en in-memory MongoDB-instans
    before(async () => {
        // Skapa en ny MongoDB server i minnet
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();

        // Anslut till den temporära databasen i minnet
        client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        db = client.db(); // Anslut till databasen
    });

    // Kör denna efter alla tester för att stänga ned MongoDB-instansen
    after(async () => {
        await closeDb();  // Koppla från databasen
        // await mongoServer.stop();     // Stoppa den temporära databasen
    });

    // Kör denna före varje test för att göra setup, t.ex. rensa databasen
    beforeEach(async () => {
        // Här kan du lägga till kod för att rensa databasen eller skapa testdata
        await db.collection('posts').deleteMany({});
        // await docs.deleteMany();
    });

    // Testa GET /
    describe("GET /", () => {
        it("Det bör returnera alla inlägg med status 200", (done) => {
            chai.request(app)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    done();
                });
        });

        it("Det bör returnera ett fel om dokument inte kan hämtas", (done) => {
            // Här kan du simulera ett fel om du mockar docs.getAll-funktionen att kasta ett fel.
            done();
        });
    });
});
