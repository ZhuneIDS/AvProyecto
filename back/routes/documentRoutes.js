const express = require('express');

const { authenticateJWT } = require('../middleware/authMiddleware');
const {
    checkDb,
    getDocuments,
    addDocument,
    deleteDocument,
    editDocument,
} = require("../controllers/documentController");

const router = express.Router();

// Fetch all documents
router.get("/", authenticateJWT, checkDb, getDocuments);

// Add a new document
router.post("/", authenticateJWT, checkDb, addDocument);

// Delete a document
router.delete("/:id", authenticateJWT, checkDb, deleteDocument);

// Edit a document
router.put("/:id", authenticateJWT, checkDb, editDocument);


module.exports = router;
