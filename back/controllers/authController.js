const jwt = require('jsonwebtoken');

// Importar el modelo de usuario
const User = require('../models/user');

// Registrar un usuario
async function register(req, res) {
    //log para debug
    console.log("Recibiendo req para registrar usuario: ", req.body);

    // Desestructurar los campos del body
    const { username, password, email } = req.body;

    // Log de cada campo para debug
    console.log("Username:", username);
    console.log("Password:", password);
    console.log("Email:", email);

    // Validar que los campos no estén vacíos
    if (!username || !password || !email) {
        console.error("Validacion fallida: Falta username, password, o email.");
        return res.status(400).json({ message: "Username, contraseña y correo requeridos" });
    }

    // Verificar si el usuario ya existe
    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            console.warn(`User ya existe: ${existingUser.username} o email: ${existingUser.email}`);
            return res.status(400).json({ message: "Username o Correo ya existen" });
        }
        // Crear un nuevo usuario
        const user = new User({ username, password, email });
        console.log("Objeto user antes de guardar:", user);
        // Guardar el usuario en la base de datos
        const savedUser = await user.save(); //metodo save proporcionado por mongoose
        console.log("User guardado correctamente:", savedUser);
        // Responder con un mensaje de éxito
        res.status(201).json({ message: "Usuario guardado correctamente." });
    } catch (err) {
        console.error("Error durante el registro:", err.message);
        res.status(500).json({ message: "Error registrando usuario.", error: err.message });
    }
}




// Logeo de un usuario con JWT
async function login(req, res) {
    console.log("Recibiendo req de login", req.body);

    // Desestructurar los campos del body
    const { username, password } = req.body;

    // validar que los campos no estén vacíos
    if (!username || !password) {
        console.error("Validacion fallida, falta usuario o contraseña.");
        return res.status(400).json({ message: "Usuario y contraseña son requeridos." });
    }

    // Verificar si el usuario existe
    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.warn(`Login fallido, usuario no encontrado - ${username}`);
            return res.status(401).json({ message: "Usuario o Contraseña invalido." });
        }

        // Verificar la contraseña
        if (user.password !== password) {
            console.warn("Login fallida, contraseña incorrecta.");
            return res.status(401).json({ message: "Usuario o Contraseña incorrecto" });
        }

        // Crear un token JWT
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // Responder con un mensaje de éxito y el token
        console.log("Login con exito del usuario:", username);
        res.json({ message: "Login con exito.", token });
    } catch (err) {
        console.error("Error durante login:", err.message);
        res.status(500).json({ message: "Error en logging.", error: err.message });
    }
}


// Ruta protegida
function protectedRoute(req, res) {
    res.json({ message: 'No tienes acceso a esta ruta', user: req.user });
}

// Exportar los controladores
module.exports = {
    register,
    login,
    protectedRoute,
};
