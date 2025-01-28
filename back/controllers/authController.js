const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Register a new user
async function register(req, res) {
    console.log("Received request to register user:", req.body);

    const { username, password, email } = req.body;

    // Log each value explicitly to ensure they are parsed correctly
    console.log("Username:", username);
    console.log("Password:", password);
    console.log("Email:", email);

    if (!username || !password || !email) {
        console.error("Validation failed: Missing username, password, or email.");
        return res.status(400).json({ message: "Username, password, and email are required." });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            console.warn(`User already exists: ${existingUser.username} or email: ${existingUser.email}`);
            return res.status(400).json({ message: "Username or email already exists." });
        }

        const user = new User({ username, password, email });
        console.log("User object before saving:", user);

        const savedUser = await user.save();
        console.log("User registered successfully:", savedUser);

        res.status(201).json({ message: "User registered successfully." });
    } catch (err) {
        console.error("Error during user registration:", err.message);
        res.status(500).json({ message: "Error registering user.", error: err.message });
    }
}




// Login and generate JWT
async function login(req, res) {
    console.log("Received login request:", req.body);

    const { username, password } = req.body;

    if (!username || !password) {
        console.error("Validation failed: Missing username or password.");
        return res.status(400).json({ message: "Username and password are required." });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.warn(`Login failed: User not found - ${username}`);
            return res.status(401).json({ message: "Invalid username or password." });
        }

        if (user.password !== password) {
            console.warn("Login failed: Incorrect password.");
            return res.status(401).json({ message: "Invalid username or password." });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        console.log("Login successful for user:", username);
        res.json({ message: "Login successful.", token });
    } catch (err) {
        console.error("Error during login:", err.message);
        res.status(500).json({ message: "Error logging in.", error: err.message });
    }
}


// Protected route
function protectedRoute(req, res) {
    res.json({ message: 'You have access to this protected route', user: req.user });
}

module.exports = {
    register,
    login,
    protectedRoute,
};
