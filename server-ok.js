const express = require('express');
const app = express();
const path = require('path');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Route to serve the audio file
app.get('/audio', (req, res) => {
    res.sendFile(path.join(__dirname, 'audio/audio.wav'));
});

// Run server at port 5500
app.listen(5500, () => {
    console.log('Server running at http://localhost:5500');
});