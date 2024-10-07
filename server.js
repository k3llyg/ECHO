const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// Serve static files from the 'public' and 'vid' directories
app.use(express.static(path.join(__dirname, 'public')));
app.use('/vid', express.static(path.join(__dirname, 'vid')));

// Serve the index.html file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Serve a 204 No Content for favicon requests (optional if you don't want to provide a favicon)
app.get('/favicon.ico', (req, res) => res.status(204));

// Route to serve video with buffering (handling Range requests)
app.get('/video', (req, res) => {
    const videoPath = path.join(__dirname, 'vid/kid1.mp4');
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;

    // Check if the Range header is present
    const range = req.headers.range;
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = (end - start) + 1;

        const videoStream = fs.createReadStream(videoPath, { start, end });
        const headers = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(206, headers);  // 206 Partial Content
        videoStream.pipe(res);
    } else {
        const headers = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(200, headers);  // Full video content
        fs.createReadStream(videoPath).pipe(res);
    }
});

// Serve an audio file with buffering (handling Range requests)
app.get('/audio', (req, res) => {
    const audioPath = path.join(__dirname, 'audio/audio.wav');  // Replace with your audio file path
    const stat = fs.statSync(audioPath);
    const fileSize = stat.size;

    // Check if the Range header is present
    const range = req.headers.range;
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = (end - start) + 1;

        const audioStream = fs.createReadStream(audioPath, { start, end });
        const headers = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'audio/wav',
        };

        res.writeHead(206, headers);  // 206 Partial Content
        audioStream.pipe(res);
    } else {
        const headers = {
            'Content-Length': fileSize,
            'Content-Type': 'audio/wav',
        };

        res.writeHead(200, headers);  // Full audio content
        fs.createReadStream(audioPath).pipe(res);
    }
});


// Run server at port 5500
app.listen(5500, () => {
    console.log('Server running at http://localhost:5500');
});