let db; // instancia de la base de datos
// Importar dependencias
const authenticateJWT = require('../middleware/authMiddleware').authenticateJWT;
const { ObjectId } = require("mongodb"); // Import ObjectId to work with MongoDB's _id

// Funcion para establecer la base de datos
function setDb(database) {
    db = database;
}

// Middleware para verificar la conexión a la base de datos
function checkDb(req, res, next) {
    if (!db) {
        return res.status(503).json({ message: "Base de datos no disponible, intente mas tarde ..." });
    }
    next();
}

// Funcion para obtener los documentos de la colección
async function getDocuments(req, res) {
    try {
        const collection = db.collection('DesarrolloFullStack');
        const documents = await collection.find({}).toArray();
        res.json(documents);
    } catch (error) {
        console.log("probando despues de middlware");
        
        console.error("Error fetching documents:", error, await response.text());
        res.status(500).json({ message: 'Error fetching documents' });
    }
}

// Funcion para agregar un documento a la colección
async function addDocument(req, res) {
    try {
        // Desestructurar la llave y valor del cuerpo de la solicitud
        const { key, value } = req.body;

        // Validar que la llave y valor no estén vacíos
        if (!key || !value) {
            return res.status(400).json({ message: "LLave valor son requeridos." });
        }

        // Obtener la colección de la base de datos
        const collection = db.collection("DesarrolloFullStack");
        const document = { [key]: value }; // Crear un documento con la llave y valor

        // Insertar el documento en la colección
        const result = await collection.insertOne(document);

        // Log el documento agregado para debug
        console.log("Documento agregado a base de datos:");
        console.log(`LLave: ${key}, Valor: ${value}`);

        // Responder con el documento agregado
        res.status(201).json({
            message: "Documento agregado correctamente.",
            document: { id: result.insertedId, ...document }
        });
    } catch (error) {
        console.error("Error al agregar documento:", error.message);
        res.status(500).json({ message: "Error al agregar documento", error: error.message });
    }
}

// Funcion para displayar los documentos en el frontend
async function fetchAndDisplayDocuments(token) {
    try {
        // Traer los documentos de la API
        const response = await fetch("/api/documents", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        // Parsear la respuesta a JSON
        const documents = await response.json();

        // Verificar si la respuesta fue exitosa
        if (response.ok) {
            const messageContainer = document.getElementById("message");
            messageContainer.innerHTML = ""; // Clear existing documents

            documents.forEach((doc) => {
                const docElement = document.createElement("div");
                docElement.style.display = "flex";
                docElement.style.justifyContent = "space-between";
                docElement.style.marginBottom = "10px";

                // Display key-value pair
                const docText = document.createElement("span");
                docText.textContent = `${Object.keys(doc)[0]}: ${Object.values(doc)[0]}`;

                // Edit button
                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.style.marginLeft = "10px";
                editButton.addEventListener("click", () => editDocument(doc, token));

                // Delete button
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.style.marginLeft = "10px";
                deleteButton.addEventListener("click", () => deleteDocument(doc, token));

                docElement.appendChild(docText);
                docElement.appendChild(editButton);
                docElement.appendChild(deleteButton);

                messageContainer.appendChild(docElement);
            });
        } else {
            alert("Failed to fetch documents.");
        }
    } catch (error) {
        console.error("Error fetching documents:", error.message);
    }
}

// Funcion para borrar un documento de la colección
async function deleteDocument(req, res) {
    
    try {
        const { id } = req.params; // desestructurar el ID del documento de la URL

        // Validar que el ID no esté vacío
        if (!id) {
            return res.status(400).json({ message: "ID del documento es requerido." });
        }

        // Obtener la colección de la base de datos
        const collection = db.collection("DesarrolloFullStack");

        // Borra el documento de la colección
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        // Verificar si el documento fue borrado
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Documento no fue borrado." });
        }

        // Responder con un mensaje de éxito
        res.json({ message: "Documento borrado correctamente." });
    } catch (error) {
        console.error("Error borrando documento:", error.message);
        res.status(500).json({ message: "Error borrando documento.", error: error.message });
    }
}

// Funcion para editar un documento de la colección
async function editDocument(req, res) {
    try {
        // Desestructurar el ID del documento de la URL
        const { id } = req.params; // ID del documento
        const { key, value } = req.body; // Llave valor a editar

        // Validar que el ID no esté vacío
        if (!id) {
            return res.status(400).json({ message: "Id del documento requerido." });
        }

        // Validar que la llave y valor no estén vacíos
        if (!key || !value) {
            return res.status(400).json({ message: "Llave valor son requeridos." });
        }

        const collection = db.collection("DesarrolloFullStack");

        // Actualizar el documento en la colección
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { [key]: value } }
        );

        // Verificar si el documento fue actualizado
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Documento no cambiado o no encontrado." });
        }

        // Responder con un mensaje de éxito
        res.json({ message: "Documento actualizado correctamente." });
    } catch (error) {
        console.error("Error actualizando documento:", error.message);
        res.status(500).json({ message: "Error editando documento.", error: error.message });
    }
}

// Exportar las funciones
module.exports = {
    setDb,
    checkDb,
    getDocuments,
    addDocument,
    // fetchAndDisplayDocuments,
    deleteDocument,
    editDocument,

};
