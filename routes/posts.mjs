import express, { Router } from 'express';
const router = express.Router();

import documents from "../docs.mjs";

// router.post("/", async (req, res) => {
//     const result = await documents.addOne(req.body);

//     return res.redirect(`/${result.lastID}`);
// });
router.post("/", async (req, res) => {
    const result = await documents.addOne(req.body);
    return res.json({ id: result.lastID, message: "Document created" });
});

// router.get('/:id', async (req, res) => {
//     const document = await documents.getOne(req.params.id);

//     if (document) {
//         return res.render("doc", { doc: document });
//     } else {
//         return res.status(404).send('Document not found');
//     }
// });
router.get('/:id', async (req, res) => {
    const document = await documents.getOne(req.params.id);

    if (document) {
        return res.json(document);
    } else {
        return res.status(404).json({ error: 'Dokumentet finns inte i databasen.' });
    }
});

router.get('/', async (req, res) => {
    return res.json(await documents.getAll())

    
//return res.render("index", { docs: await documents.getAll() });
});

router.post("/create", async (req, res) => {
// //     const result = await documents.addOne(req.body);

     return res.redirect(`/${result.lastID}`);
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;

    const updatedContent = req.body;

     //uppdatera docs i databas
    await documents.updateOne(id, updatedContent);

    return res.redirect(`/${id}`);
});

export default router;