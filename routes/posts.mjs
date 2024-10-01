import express from 'express';
import docs from "../docs.mjs";

const router = express.Router();

// Hämta alla dokument
router.get('/', async (req, res) => {
    try {
        const allDocuments = await docs.getAll();
        return res.json(allDocuments);
    } catch (error) {
        return res.status(500).json({ error: "Failed to retrieve documents", details: error });
    }
});

// Hämta ett enskilt dokument
router.get('/:_id', async (req, res) => {
    try {
        console.log('Received ID:', req.params._id); // Logga mottaget ID
        const document = await docs.getOne(req.params._id);
        console.log('Retrieved document:', document); // Logga det hämtade dokumentet
        if (document) {
            return res.json(document);
        } else {
            return res.status(404).json({ error: 'Document not found' });
        }
    } catch (error) {
        console.error('Error retrieving document:', error); // Logga eventuella fel
        return res.status(500).json({ error: "Failed to retrieve document", details: error });
    }
});

// Skapa ett nytt dokument
router.post("/", async (req, res) => {
    try {
        const result = await docs.addOne(req.body);
        return res.json({ id: result.insertedId, message: "Document created" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to create document", details: error });
    }
});

router.post("/create", async (req, res) => {
// //     const result = await documents.addOne(req.body);

     return res.redirect(`/${result.lastID}`);
});

// Uppdatera ett dokument
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedContent = req.body;

    try {
        const result = await docs.updateOne(id, updatedContent);
        if (result.modifiedCount > 0) {
            return res.json({ id, message: "Document updated" });
        } else {
            return res.status(404).json({ error: "Document not found or no changes made" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Failed to update document", details: error });
    }
});

// Ta bort ett dokument
router.delete('/:_id', async (req, res) => {
    const { _id } = req.params;

    try {
        const result = await docs.deleteOne(_id);
        if (result.deletedCount > 0) {
            return res.json({ _id, message: "Document deleted" });
        } else {
            return res.status(404).json({ error: "Document not found" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Failed to delete document!", details: error });
    }
});

export default router;
