import 'dotenv/config'

const port = process.env.PORT || 1337;

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import methodOverride from 'method-override';

import documents from "./docs.mjs";

const app = express();

app.disable('x-powered-by');

app.set("view engine", "ejs");

app.use(express.static(path.join(process.cwd(), "public")));
app.use(methodOverride('_method'));

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", async (req, res) => {
    const result = await documents.addOne(req.body);

    return res.redirect(`/${result.lastID}`);
});

//visa enbart lista med dokument. Denna route funkar inte just nu.
app.get('/list', async (req, res) => {
    return res.render("list", { docs: await documents.getAll() });
    
});
// ----------------------------------------------------------------------//
app.get('/', async (req, res) => {
    return res.render("index", { docs: await documents.getAll() });
    
});

app.get('/:id', async (req, res) => {
    const document = await documents.getOne(req.params.id);

    if (document) {
        return res.render("doc", { doc: document });
    } else {
        return res.status(404).send('document not found');
    }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

app.post("/create", async (req, res) => {
    const result = await documents.addOne(req.body);

    return res.redirect(`/${result.lastID}`);
});

app.put('/:id', async (req, res) => {
    const { id } = req.params;

    const updatedContent = req.body;

    //uppdatera docs i databas
    await documents.updateOne(id, updatedContent);

    return res.redirect(`/${id}`);
});
