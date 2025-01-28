// Dependencias 
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Rutas
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');

// Crear la aplicación
const app = express();
const PORT = 3000;

// Configurar variables de entorno
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Middleware
app.use(express.static(path.join(__dirname, '..', 'front')));
app.use(express.json());

// Middleware para registrar las peticiones
app.use((req, res, next) => {
    console.log(`Recibiendo request: ${req.method} ${req.path}`);
    next();
});

let db; // Declara la variable db

// log de la variable de entorno para debug
console.log('Mongo URI:', process.env.MONGO_URI);

// Conectar a la base de datos
async function connectToDatabase() {
    try {
        // Conectar a la base de datos
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        // Log de la conexión para debug
        console.log('Connectado a MongoDB:', connection.connection.name);

        // Explicitamente usar la base de datos IDS
        db = connection.connection.useDb('IDS');
        console.log('Usando base de datos', db.name);

        // Pasar la base de datos a los controladores como parametro
        require('./controllers/documentController').setDb(db);
    } catch (error) {
        console.error("Error connectando a Mongo: ", error.message);
        console.log("Servidor no puede iniciar sin conexión a la base de datos, funcionando sin base de datos");
    }
}

// Rutas
// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'index.html'));
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de documentos con middleware para verificar la conexión a la base de datos
app.use("/api/documents", (req, res, next) => {
    if (!db) {
        console.log("Base de datos no disponible por favor intente mas tarde");
        
        return res.status(503).json({ message: "Base de datos no disponible por favor intente mas tarde" });
    }
    next();
}, documentRoutes);

// Función para iniciar el servidor
async function startServer() {
    try {
        // Conectar a la base de datos
        await connectToDatabase();
        console.log("Base de datos conectada correctamente");

        // Empezar el servidor
        app.listen(PORT, () => {
            console.log(`Backend corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error al iniciar el servidor:", error.message);
        process.exit(1); // Terminar el proceso con un error
    }
}

// Llamado a la función para iniciar el servidor
startServer();
