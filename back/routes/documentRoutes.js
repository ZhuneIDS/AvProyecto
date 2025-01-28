const express = require('express');

// Importar los controladores
const { authenticateJWT } = require('../middleware/authMiddleware');
const {
    checkDb,
    getDocuments,
    addDocument,
    deleteDocument,
    editDocument,
} = require("../controllers/documentController");

// Crear el router
const router = express.Router();

// traer todos los documentos
router.get("/", authenticateJWT, checkDb, getDocuments);

// agregar un documento
router.post("/", authenticateJWT, checkDb, addDocument);

// borra un documento
router.delete("/:id", authenticateJWT, checkDb, deleteDocument);

// edita un documento
router.put("/:id", authenticateJWT, checkDb, editDocument);

// exportar el router
module.exports = router;
