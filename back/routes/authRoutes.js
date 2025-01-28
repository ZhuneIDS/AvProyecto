const express = require('express');

// Importar los controladores
const { register, login, protectedRoute } = require('../controllers/authController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// Crear el router
const router = express.Router();

// rutas de autenticación
// Ruta para registrar un usuario
router.post('/register', register);

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta protegida
router.get('/protected', authenticateJWT, protectedRoute);

// Exportar el router
module.exports = router;
