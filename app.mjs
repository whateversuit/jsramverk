import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import methodOverride from 'method-override';
import { Server } from 'http'; // If needed in the future, e.g., for WebSockets

//import posts from './routes/posts.mjs';
import docs from './docs.mjs'; // Ensure that the path to docs.mjs is correct

import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import schema from './graphql/root.js';




// Initialize the Express app
const app = express();
const visual = true;

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: visual // Visual is set to true during development
  }));

const port = process.env.PORT || 1337;











/*

// Disable the "x-powered-by" header for security reasons
app.disable('x-powered-by');

// Set the view engine to EJS
app.set("view engine", "ejs");

// Set up static file serving
app.use(express.static(path.join(process.cwd(), "public")));

// Enable method override for PUT and DELETE requests
app.use(methodOverride('_method'));

// Enable CORS
app.use(cors());

// Use morgan for logging, but only in non-test environments
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined')); // 'combined' format mimics Apache logs
}

// Parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use routes from posts
app.use("/", posts);

// Uncommented the following if you're ready to use docs-related routes
app.get('/:id', async (req, res) => {
    try {
        const document = await docs.getOne(req.params.id);

        if (document) {
            return res.render("doc", { doc: document });
        } else {
            return res.status(404).send('Document not found');
        }
    } catch (error) {
        console.error("Error fetching document:", error);
        return res.status(500).send('Internal server error');
    }
});

app.get('/', async (req, res) => {
    try {
        const allDocs = await docs.getAll();
        return res.render("index", { docs: allDocs });
    } catch (error) {
        console.error("Error fetching documents:", error);
        return res.status(500).send('Internal server error');
    }
});
*/

// Start the server
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

export default app;
