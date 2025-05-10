const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Main route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Profile route
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// Registration endpoint
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
    
    // Basic validation
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Read existing users
    let users = [];
    try {
        const usersData = fs.readFileSync(path.join(__dirname, 'data', 'users.json'));
        users = JSON.parse(usersData);
    } catch (error) {
        // If file doesn't exist or is empty, start with empty array
        users = [];
    }

    // Check if user already exists
    if (users.some(user => user.email === email)) {
        return res.status(400).json({ error: 'User already exists' });
    }

    // Add new user
    const newUser = { username, email, password };
    users.push(newUser);

    // Save updated users
    fs.writeFileSync(path.join(__dirname, 'data', 'users.json'), JSON.stringify(users, null, 2));

    res.status(201).json({ message: 'Registration successful' });
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    // Read users
    let users = [];
    try {
        const usersData = fs.readFileSync(path.join(__dirname, 'data', 'users.json'));
        users = JSON.parse(usersData);
    } catch (error) {
        return res.status(500).json({ error: 'Error reading user data' });
    }

    // Find and validate user
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({ message: 'Login successful', username: user.username });
});

// Additional routes for your API endpoints can go here
app.get('/api/data', (req, res) => {
    // Add your data handling here
    res.json({ message: 'Data endpoint' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});