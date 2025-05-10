const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Main route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Additional routes for your API endpoints can go here
app.get('/api/data', (req, res) => {
    // Add your data handling here
    res.json({ message: 'Data endpoint' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});