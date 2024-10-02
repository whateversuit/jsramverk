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

    // // Testa GET /:id Hämta ett enskilt dokument
    // describe("GET /:id", () => {
    //     it("Det bör returnera ett enskilt dokument med status 200", (done) => {
    //         const validId = "66f56c5a1988aa584b27ed59"; // Använd ett giltigt test-ID
    //         chai.request(app)
    //             .get(`/${validId}`)
    //             .end((err, res) => {
    //                 res.should.have.status(200);
    //                 res.body.should.be.an('object');
    //                 done();
    //             });
    //     });
    
    //     it("Det bör returnera 404 om dokumentet inte finns", (done) => {
    //         const invalidId = "5f50c31b1c4ae512ec45da99"; // Använd ett icke-existerande test-ID
    //         chai.request(app)
    //             .get(`/${invalidId}`)
    //             .end((err, res) => {
    //                 res.should.have.status(404);
    //                 res.body.should.have.property('error').eql('Document not found');
    //                 done();
    //             });
    //     });
    
    //     it("Det bör returnera 500 vid serverfel", (done) => {
    //         // Simulera ett serverfel om det går att mocka docs.getOne.
    //         done();
    //     });
    // });
    

    // // Testa POST / skapa nytt dokument
    // describe("POST /", () => {
    //     it("Det bör skapa ett nytt dokument", (done) => {
    //         const newDocument = {
    //             title: "Test Title",
    //             content: "Test Content"
    //         };
    //         chai.request(app)
    //             .post("/")
    //             .send(newDocument)
    //             .end((err, res) => {
    //                 res.should.have.status(200); // Ändra till korrekt statuskod om det är 200 eller 201
    //                 res.body.should.have.property('id');
    //                 res.body.should.have.property('message').eql('Document created');
    //                 done();
    //             });
    //     });
    
    //     it("Det bör returnera 500 vid serverfel under skapande", (done) => {
    //         // Simulera ett serverfel under dokument-skapande.
    //         done();
    //     });
    // });

    // // Testa POST /create bor omdirigera till det nya dokumentet
    // describe("POST /create", () => {
    //     it("Det bör omdirigera till det nya dokumentet", (done) => {
    //         const newDocument = {
    //             title: "Test Title",
    //             content: "Test Content"
    //         };
    //         chai.request(app)
    //             .post("/create")
    //             .send(newDocument)
    //             .end((err, res) => {
    //                 res.should.have.status(200); // Kontrollera vilken status som returneras
    //                 res.should.redirect;
    //                 done();
    //             });
    //     });
    // });

    // // Testa PUT /:id
    // describe("PUT /:id", () => {
    //     it("Det bör uppdatera ett dokument", (done) => {
    //         const validId = "66fc12a6474f8625f10da2da"; // Testa med ett giltigt dokument-ID
    //         const updatedContent = {
    //             title: "Updated Title",
    //             content: "Updated Content"
    //         };
    //         chai.request(app)
    //             .put(`/${validId}`)
    //             .send(updatedContent)
    //             .end((err, res) => {
    //                 res.should.have.status(200);
    //                 res.body.should.have.property('message').eql('Document updated');
    //                 done();
    //             });
    //     });

    //     it("Det bör returnera 404 om dokumentet inte finns", (done) => {
    //         const invalidId = "5f50c31b1c4ae512ec45da99"; // Använd ett ogiltigt ID
    //         chai.request(app)
    //             .put(`/${invalidId}`)
    //             .send({ title: "Updated Title" })
    //             .end((err, res) => {
    //                 res.should.have.status(404);
    //                 res.body.should.have.property('error').eql('Document not found or no changes made');
    //                 done();
    //             });
    //     });
    // });


    // // Testa DELETE /:id
    // describe("DELETE /:id", () => {
    //     it("Det bör ta bort ett dokument", (done) => {
    //         const validId = "66fc0edba17ca49cda248b3b"; // Testa med ett giltigt dokument-ID
    //         chai.request(app)
    //             .delete(`/${validId}`)
    //             .end((err, res) => {
    //                 res.should.have.status(200);
    //                 res.body.should.have.property('message').eql('Document deleted');
    //                 done();
    //             });
    //     });
    
    //     it("Det bör returnera 404 om dokumentet inte finns", (done) => {
    //         const invalidId = "5f50c31b1c4ae512ec45da99"; // Använd ett ogiltigt ID
    //         chai.request(app)
    //             .delete(`/${invalidId}`)
    //             .end((err, res) => {
    //                 res.should.have.status(404);
    //                 res.body.should.have.property('error').eql('Document not found');
    //                 done();
    //             });
    //     });
    // });

    // describe("POST / without title", () => {
    //     it("Det bör returnera ett valideringsfel om title saknas", (done) => {
    //         const invalidPost = { content: "Test content without title" };
    //         chai.request(app)
    //             .post("/")
    //             .send(invalidPost)
    //             .end((err, res) => {
    //                 res.should.have.status(400);
    //                 res.body.should.be.an('object');
    //                 res.body.should.have.property('error').eql('Title is required');
    //                 done();
    //             });
    //     });
    // });

    // // Testa POST / med ogiltig JSON (edge case)
    // describe("POST / with invalid JSON", () => {
    //     it("Det bör returnera ett valideringsfel vid ogiltig JSON", (done) => {
    //         chai.request(app)
    //             .post("/")
    //             .send("{ title: 'Test' }") // Ogiltig JSON (saknar citattecken kring 'title')
    //             .end((err, res) => {
    //                 res.should.have.status(400);
    //                 res.body.should.have.property('error').eql('Invalid JSON');
    //                 done();
    //             });
    //     });
    // });
});
