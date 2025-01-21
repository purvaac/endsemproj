const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register new user
router.post('/register', async (req, res) => {
    const { username, name, email, password, role } = req.body;

    if (!username || !name || !email || !password || !role) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Role validation
    const validRoles = ['freelancer', 'client', 'both'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Role must be freelancer, client, or both.' });
    }

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email: email.trim() });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists.' });
        }

        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10); // Generate salt
        const hashedPassword = await bcrypt.hash(password, salt); // Hash password with the generated salt

        console.log("Generated salt:", salt);
        console.log("Hashed password:", hashedPassword);

        // Create new user
        const user = new User({
            username: username.trim(),
            name: name.trim(),
            email: email.trim(),
            password: hashedPassword, // Store hashed password
            role: role.trim(),
        });

        await user.save();
        console.log("User registered:", { email, password: hashedPassword });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error registering user.' });
    }
});

// Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user
        const user = await User.findOne({ email: email.trim() });
        console.log("User found:", user);
        if (!user) {
            console.error("User not found with email:", email);
            return res.status(404).json({ error: 'Invalid email or password.' });
        }

        // Compare input password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password comparison result:", isMatch);
        if (!isMatch) {
            console.error("Password mismatch for email:", email);
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Generate JWT
        const token = jwt.sign(
            { 
                id: user._id, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h',
            }
        );

        res.status(200).json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: 'Error logging in.' });
    }
});

module.exports = router;
