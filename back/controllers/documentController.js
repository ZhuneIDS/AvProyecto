let db; // Database instance
const authenticateJWT = require('../middleware/authMiddleware').authenticateJWT;
const { ObjectId } = require("mongodb"); // Import ObjectId to work with MongoDB's _id

// Set the database instance
function setDb(database) {
    db = database;
}
function checkDb(req, res, next) {
    if (!db) {
        return res.status(503).json({ message: "Database unavailable. Please try again later." });
    }
    next();
}

// Fetch all documents
async function getDocuments(req, res) {
    try {
        const collection = db.collection('DesarrolloFullStack');
        const documents = await collection.find({}).toArray();
        res.json(documents);
    } catch (error) {
        console.error("Error fetching documents:", error, await response.text());
        res.status(500).json({ message: 'Error fetching documents' });
    }
}

// Add a document to the collection
async function addDocument(req, res) {
    try {
        const { key, value } = req.body;

        if (!key || !value) {
            return res.status(400).json({ message: "Key and value are required." });
        }

        const collection = db.collection("DesarrolloFullStack");
        const document = { [key]: value }; // Create a document with a dynamic key-value pair

        // Insert the document
        const result = await collection.insertOne(document);

        // Log the added document to the backend console
        console.log("Document successfully added to the database:");
        console.log(`Key: ${key}, Value: ${value}`);

        // Respond with the added document's details
        res.status(201).json({
            message: "Document added successfully",
            document: { id: result.insertedId, ...document }
        });
    } catch (error) {
        console.error("Error adding document:", error.message);
        res.status(500).json({ message: "Error adding document", error: error.message });
    }
}


async function fetchAndDisplayDocuments(token) {
    try {
        const response = await fetch("/api/documents", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        const documents = await response.json();

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

async function deleteDocument(req, res) {
    try {
        const { id } = req.params; // Retrieve the document ID from the route parameter

        if (!id) {
            return res.status(400).json({ message: "Document ID is required." });
        }

        const collection = db.collection("DesarrolloFullStack");

        // Delete the document by its ObjectId
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Document not found." });
        }

        res.json({ message: "Document deleted successfully." });
    } catch (error) {
        console.error("Error deleting document:", error.message);
        res.status(500).json({ message: "Error deleting document.", error: error.message });
    }
}

async function editDocument(req, res) {
    try {
        const { id } = req.params; // Document ID from the URL
        const { key, value } = req.body; // Key and value from the request body

        // Validate inputs
        if (!id) {
            return res.status(400).json({ message: "Document ID is required." });
        }

        if (!key || !value) {
            return res.status(400).json({ message: "Both key and value are required." });
        }

        const collection = db.collection("DesarrolloFullStack");

        // Update the document
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { [key]: value } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Document not found or no changes made." });
        }

        res.json({ message: "Document updated successfully." });
    } catch (error) {
        console.error("Error updating document:", error.message);
        res.status(500).json({ message: "Error updating document.", error: error.message });
    }
}




module.exports = {
    setDb,
    checkDb,
    getDocuments,
    addDocument,
    fetchAndDisplayDocuments,
    deleteDocument,
    editDocument,

};
