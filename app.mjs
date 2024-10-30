import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import methodOverride from 'method-override';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io'

import { graphqlHTTP } from 'express-graphql';
import schema from './graphql/root.js';

// Initialize the Express app
const app = express();
const visual = true;

app.use(cors());

app.options('*', cors());

app.use(methodOverride('_method'));

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: visual // Visual is set to true during development
}));

const port = process.env.PORT || 1337;

// HTTP-server based on express-app
const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST']
    }
});

let timeout;

io.on('connection', function(socket) {
    console.log('A user connected:', socket.id);


    socket.on("content", function(data) {
        console.log('Message received:', data);

        socket.join(data);

        io.emit("content", data);

        clearTimeout(timeout);

        timeout = setTimeout(function() {
            console.log("spara data");
        }, 2000);
    });

    socket.on("addComment", async ({ documentId, lineNumber, comment }) => {
        console.log("New temporary comment received:", { documentId, lineNumber, comment });

        // skicka kommentaren till alla anslutna klienter
        io.emit("newComment", { documentId, lineNumber, comment });
    });

    socket.on("disconnect", function() {
        console.log('A user disconnected:', socket.id);
    });
});

app.get("/", (req, res) => res.send("io server"));

httpServer.listen(port, () => {
    console.log(`App and Socket.io listening on port ${port}`);
});

export default app;
