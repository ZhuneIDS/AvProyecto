const mongoose = require('mongoose');

// Define el esquema de usuario
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true }, //  asegura que el email sea único
});

// Exporta el modelo de usuario
module.exports = mongoose.model('User', userSchema);
