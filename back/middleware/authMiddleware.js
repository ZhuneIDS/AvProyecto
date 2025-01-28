const jwt = require('jsonwebtoken');

// Middleware para autenticar un JWT
function authenticateJWT(req, res, next) {
    // Verificar que el token exista
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Accesso denegado token requerido' });
    }

    // Verificar el token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalido o expirado' });
        }

        req.user = user;
        next();
    });
}

module.exports = { authenticateJWT };
