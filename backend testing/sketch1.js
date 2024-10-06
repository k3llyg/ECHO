//const { text } = require("stream/consumers");

function setup() {
    createCanvas(400, 400);
    // Fetch the message from the backend
    fetch('http://localhost:5500/')
        .then(response => response.text())
        .then(data => {
            message = data;
        })
        .catch(error => {
            console.error('Error fetching message:', error);
            message = 'Error loading message';
        });
  }
  
  function draw() {
    background(220);
    text(100, 100);
    textAlign(CENTER, CENTER); // Center the text
    text(message, width / 2, height / 2);
  }