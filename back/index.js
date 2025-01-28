const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');

const app = express();
const PORT = 3000;

dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Middleware
app.use(express.static(path.join(__dirname, '..', 'front')));
app.use(express.json());

// Middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`Receiving request: ${req.method} ${req.path}`);
    next();
});

console.log('Mongo URI:', process.env.MONGO_URI);

let db; // Global variable to store the database instance

async function connectToDatabase() {
    try {
        // Connect to MongoDB once at startup
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB Atlas');

        // Explicitly use the IDS database
        db = connection.connection.useDb('IDS');
        console.log('Using Database:', db.name);

        // Pass the database instance to the controllers
        require('./controllers/documentController').setDb(db);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        console.log("Server will start without database connection. Database-dependent features will be unavailable.");
    }
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'index.html'));
});

app.use('/api/auth', authRoutes);
app.use("/api/documents", (req, res, next) => {
    if (!db) {
        console.log("Database unavailable. Please try again later.");
        
        return res.status(503).json({ message: "Database unavailable. Please try again later." });
    }
    next();
}, documentRoutes);

// Start the application
connectToDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Backend running at http://localhost:${PORT}`);
    });
});
