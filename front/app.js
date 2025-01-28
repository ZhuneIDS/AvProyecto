//
//  app.js
//  mernIDS4
//
//  Created by Javier Fernandez on 11/01/25.
//

let token = null; // delcarando variable token de JWT

// funcion utilidad para mostrar mensajes de error
function displayMessage(message, isError = false) {
    const messageElement = document.getElementById("message");
    messageElement.textContent = message;
    if (isError) {
        messageElement.style.color = "red";
    } else {
        messageElement.style.color = "black";
    }
}

// funcion utilidad para manejar errores de la API
async function handleApiError(response) {
    const errorMessage = await response.json();
    console.error("API Error:", errorMessage);
    displayMessage(errorMessage.message || "Ocurrio un error", true);
}

//botton para traer documentos
document.getElementById("fetchMessage").addEventListener("click", async () => {
    try {
        const token = localStorage.getItem("jwt");

        if (!token) {
            alert("No estas logueado, por favor logueate primero");
            return;
        }

        const response = await fetch("/api/documents", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            // const errorMessage = await response.json();
            // console.error("Error fetching documents:", errorMessage);
            // document.getElementById("message").textContent = errorMessage.message || "Failed to fetch documents.";
            await handleApiError(response);
            return;
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            console.error("Formato de data inesperado:", data);
            document.getElementById("message").textContent = "Recibio tipo de data inesperado.";
            return;
        }

        // Limpiar el mensaje para mostrar los documentos
        const messageElement = document.getElementById("message");
        messageElement.innerHTML = "";
        const list = document.createElement("ul");

        data.forEach((doc) => {
            const keys = Object.keys(doc).filter((key) => key !== "_id"); // Filtra el campo _id
            if (keys.length < 1) return; // Si no encuentra nada se lo salta

            const secondKey = keys[0]; // Asume que es el primer campo
            const secondValue = doc[secondKey];
            
            // Crear un elemento de lista
            const listItem = document.createElement("li");
            listItem.style.display = "flex";
            listItem.style.alignItems = "center";
            listItem.style.marginBottom = "10px";

            // Display del par key-value
            const docText = document.createElement("span");
            docText.textContent = `${secondKey}: ${secondValue}`;
            docText.style.flexGrow = "1";

            // Botton editar
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.style.marginLeft = "10px";
            editButton.addEventListener("click", async () => {
                const key = Object.keys(doc).find(k => k !== "_id"); // LLave a editar que no sea _id
                const currentValue = doc[key];
                const newValue = prompt(`Introduce nuevo valor para "${key}":`, currentValue);
            
                if (!newValue) {
                    alert("Nuevo valor no puede estar vacio.");
                    return;
                }
            
                try {
                    const editResponse = await fetch(`/api/documents/${doc._id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ key, value: newValue }), // manda llave valor a backend
                    });
            
                    const result = await editResponse.json();
            
                    if (editResponse.ok) {
                        alert("Documento se actualizo correctamente");
                        docText.textContent = `${key}: ${newValue}`;
                    } else {
                        // alert(result.message || "Failed to update document.");
                        await handleApiError(editResponse); // llamar las funciones de utilidad
                    }
                } catch (error) {
                    console.error("Error actualizando documento: ", error.message);
                    alert("Error ocurrio al actualizar documento.");
                }
            });
            
            

            // Botton borrar
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
                        alert("Documento eliminado correctamente");
                        listItem.remove();
                    } else {
                        const deleteError = await deleteResponse.json();
                        // alert(deleteError.message || "Failed to delete document.");
                        await handleApiError(deleteResponse); // llama a la funcion de utilidad
                    }
                } catch (error) {
                    console.error("Error al borrar documento: ", error.message);
                }
            });

            listItem.appendChild(docText);
            listItem.appendChild(editButton);
            listItem.appendChild(deleteButton);
            list.appendChild(listItem);
        });

        messageElement.appendChild(list);
    } catch (error) {
        console.error("Error al traer los documentos:", error.message);
        // document.getElementById("message").textContent = "Error al traer los documentos.";
        displayMessage("Error al traer los documentos", true);
    }
});


//Registrar
document.getElementById("registerButton").addEventListener("click", async () => {
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;
    const email = document.getElementById("registerEmail").value;

    if (!username || !password || !email) {
        console.error("Registro fallido: Falta username, password, o email.");
        alert("Por favor provea username, password, y email.");
        displayMessage("Por favor provea username, password, y email.", true);
        return;
    }

    try {
        //log para debug
        console.log("mandando req de registro:", { username, password, email });

        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, email }),
        });

        const data = await response.json();
        //log para debug
        console.log("Respuesta de registro:", data);

        if (response.ok) {
            alert("Usuario registrado correctamente!");
        } else {
            console.warn("Registro fallido:", data.message);
            alert(data.message || "Registro fallido.");
            displayMessage(data.message || "Registro fallido.", true);
        }
    } catch (error) {
        console.error("Error durante el registro:", error.message);
        alert("Un error ocurrio durante el registro.");
    }
});


// Login y generar JWT
document.getElementById("loginButton").addEventListener("click", async () => {
    const token = localStorage.getItem("jwt"); //intenta traer el token

    if (token) {
        // Logout en caso de que haya un token
        localStorage.removeItem("jwt");
        alert("Logged out successfully!");
        document.getElementById("loginButton").textContent = "Login";
        document.getElementById("addDocumentForm").style.display = "none";
    } else {
        // Login en caso de que no haya token
        const username = prompt("Introde tu username:");
        const password = prompt("Introde tu password:");

        if (!username || !password) {
            console.error("Login fallido: Falta username o password.");
            alert("Por favor introduzca username y password.");
            displayMessage("Por favor introduzca username y password.", true);
            return;
        }

        try {
            //log para debug
            console.log("Mandando req login:", { username, password });

            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            console.log("respuesta de login:", data);

            if (response.ok) {
                localStorage.setItem("jwt", data.token); // guarda el token
                alert("Login exitoso");
                document.getElementById("loginButton").textContent = "Logout";
                document.getElementById("addDocumentForm").style.display = "block"; // muestra el form
            } else {
                console.warn("Login fallido", data.message);
                alert(data.message || "Login fallido.");
                displayMessage(data.message || "Login fallido.", true);
            }
        } catch (error) {
            console.error("Error durante logeo", error.message);
            alert("un error ocurrio durante el logeo.");
            displayMessage("un error ocurrio durante el logeo.", true);
        }
    }
});

// Agregar documento
document.getElementById("addDocumentButton").addEventListener("click", async () => {
    const key = document.getElementById("documentKey").value.trim();
    const value = document.getElementById("documentValue").value.trim();
    const token = localStorage.getItem("jwt"); // intenta traer el token

    // Validar que haya llave y valor
    if (!key || !value) {
        alert("Por favor provea una llave y valor para el documento.");
        displayMessage("Por favor provea una llave y valor para el documento.", true);
        return;
    }

    // Validar que haya token
    if (!token) {
        alert("No estas logueado, por favor logueate primero.");
        displayMessage("No estas logueado, por favor logueate primero.", true);
        return;
    }

    // Intentar agregar documento
    try {
        const response = await fetch("/api/documents", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // utilizar el token en el header
            },
            body: JSON.stringify({ key, value }),
        });

        const result = await response.json();
        console.log("Respuesta de agregar documento", result);

        if (response.ok) {
            alert("Documento agregado correctamente");
        } else {
            console.error("Error al agregar documento", result.message);
            alert(result.message || "No se pudo agregar el documento.");
            displayMessage(result.message || "No se pudo agregar el documento.", true);
        }
    } catch (error) {
        console.error("Error agregando documento", error.message);
        alert("Un error ocurrio al agregar el documento.");
        displayMessage("Un error ocurrio al agregar el documento.", true);
    }
});

// Borrar todos los documentos
// Codigo que se ejecuta al cargar la pagina
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("jwt");
    const loginButton = document.getElementById("loginButton");
    const addDocumentForm = document.getElementById("addDocumentForm");

    if (token) {
        // Si el usuario esta logueado
        loginButton.textContent = "Logout";
        addDocumentForm.style.display = "block";
    } else {
        // Si el usuario no esta logueado
        loginButton.textContent = "Login";
        addDocumentForm.style.display = "none";
    }
});