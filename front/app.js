//
//  app.js
//  mernIDS4
//
//  Created by Javier Fernandez on 11/01/25.
//


document.getElementById("fetchMessage").addEventListener("click", async () => {
    try {
        const token = localStorage.getItem("jwt");

        if (!token) {
            alert("You are not logged in. Please log in first.");
            return;
        }

        const response = await fetch("/api/documents", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            console.error("Error fetching documents:", errorMessage);
            document.getElementById("message").textContent = errorMessage.message || "Failed to fetch documents.";
            return;
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            console.error("Unexpected data format:", data);
            document.getElementById("message").textContent = "Unexpected data format received.";
            return;
        }

        // Clear previous content and render documents
        const messageElement = document.getElementById("message");
        messageElement.innerHTML = "";
        const list = document.createElement("ul");

        data.forEach((doc) => {
            const keys = Object.keys(doc).filter((key) => key !== "_id"); // Filter out `_id`
            if (keys.length < 1) return; // Skip if no other key-value pairs

            const secondKey = keys[0]; // Assuming it's the second key after `_id`
            const secondValue = doc[secondKey];

            const listItem = document.createElement("li");
            listItem.style.display = "flex";
            listItem.style.alignItems = "center";
            listItem.style.marginBottom = "10px";

            // Display the second key-value pair
            const docText = document.createElement("span");
            docText.textContent = `${secondKey}: ${secondValue}`;
            docText.style.flexGrow = "1";

            // Edit button
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.style.marginLeft = "10px";
            editButton.addEventListener("click", async () => {
                const key = Object.keys(doc).find(k => k !== "_id"); // Key to edit (exclude `_id`)
                const currentValue = doc[key];
                const newValue = prompt(`Enter new value for "${key}":`, currentValue);
            
                if (!newValue) {
                    alert("New value cannot be empty.");
                    return;
                }
            
                try {
                    const editResponse = await fetch(`/api/documents/${doc._id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ key, value: newValue }), // Ensure both key and value are sent
                    });
            
                    const result = await editResponse.json();
            
                    if (editResponse.ok) {
                        alert("Document updated successfully!");
                        docText.textContent = `${key}: ${newValue}`;
                    } else {
                        alert(result.message || "Failed to update document.");
                    }
                } catch (error) {
                    console.error("Error updating document:", error.message);
                    alert("An error occurred while updating the document.");
                }
            });
            
            

            // Delete button
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.style.marginLeft = "10px";
            deleteButton.addEventListener("click", async () => {
                try {
                    const deleteResponse = await fetch(`/api/documents/${doc._id}`, {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (deleteResponse.ok) {
                        alert("Document deleted successfully!");
                        listItem.remove();
                    } else {
                        const deleteError = await deleteResponse.json();
                        alert(deleteError.message || "Failed to delete document.");
                    }
                } catch (error) {
                    console.error("Error deleting document:", error.message);
                }
            });

            listItem.appendChild(docText);
            listItem.appendChild(editButton);
            listItem.appendChild(deleteButton);
            list.appendChild(listItem);
        });

        messageElement.appendChild(list);
    } catch (error) {
        console.error("Error fetching documents:", error.message);
        document.getElementById("message").textContent = "Error fetching documents!";
    }
});




let token = null; // Store the JWT

document.getElementById("registerButton").addEventListener("click", async () => {
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;
    const email = document.getElementById("registerEmail").value;

    if (!username || !password || !email) {
        console.error("Registration failed: Missing username, password, or email.");
        alert("Please enter username, password, and email.");
        return;
    }

    try {
        console.log("Sending registration request:", { username, password, email });

        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, email }),
        });

        const data = await response.json();
        console.log("Registration response:", data);

        if (response.ok) {
            alert("User registered successfully!");
        } else {
            console.warn("Registration failed:", data.message);
            alert(data.message || "Failed to register user.");
        }
    } catch (error) {
        console.error("Error during registration:", error.message);
        alert("An error occurred during registration.");
    }
});





// Login functionality
document.getElementById("loginButton").addEventListener("click", async () => {
    const token = localStorage.getItem("jwt");

    if (token) {
        // Logout functionality
        localStorage.removeItem("jwt");
        alert("Logged out successfully!");
        document.getElementById("loginButton").textContent = "Login";
        document.getElementById("addDocumentForm").style.display = "none";
    } else {
        // Login functionality
        const username = prompt("Enter your username:");
        const password = prompt("Enter your password:");

        if (!username || !password) {
            console.error("Login failed: Missing username or password.");
            alert("Please provide both username and password.");
            return;
        }

        try {
            console.log("Sending login request:", { username, password });

            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            console.log("Login response:", data);

            if (response.ok) {
                localStorage.setItem("jwt", data.token); // Save token
                alert("Login successful!");
                document.getElementById("loginButton").textContent = "Logout";
                document.getElementById("addDocumentForm").style.display = "block"; // Show the form
            } else {
                console.warn("Login failed:", data.message);
                alert(data.message || "Login failed.");
            }
        } catch (error) {
            console.error("Error during login:", error.message);
            alert("An error occurred during login.");
        }
    }
});

// Add document functionality
document.getElementById("addDocumentButton").addEventListener("click", async () => {
    const key = document.getElementById("documentKey").value.trim();
    const value = document.getElementById("documentValue").value.trim();
    const token = localStorage.getItem("jwt"); // Retrieve the token

    if (!key || !value) {
        alert("Please enter both a key and a value.");
        return;
    }

    if (!token) {
        alert("You are not logged in. Please log in first.");
        return;
    }

    try {
        const response = await fetch("/api/documents", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Include token in headers
            },
            body: JSON.stringify({ key, value }),
        });

        const result = await response.json();
        console.log("Add document response:", result);

        if (response.ok) {
            alert("Document added successfully!");
        } else {
            console.error("Error adding document:", result.message);
            alert(result.message || "Failed to add document.");
        }
    } catch (error) {
        console.error("Error adding document:", error.message);
        alert("An error occurred while adding the document.");
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("jwt");
    const loginButton = document.getElementById("loginButton");
    const addDocumentForm = document.getElementById("addDocumentForm");

    if (token) {
        // User is logged in
        loginButton.textContent = "Logout";
        addDocumentForm.style.display = "block";
    } else {
        // User is not logged in
        loginButton.textContent = "Login";
        addDocumentForm.style.display = "none";
    }
});