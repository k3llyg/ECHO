let playButton;
let audioPlayer;

function setup() {
    noCanvas(); // We don't need a canvas for this sketch

    // Create a button using p5.js
    playButton = createButton('Play Audio');
    playButton.position(100, 100); // Position the button
    playButton.mousePressed(fetchAndPlayAudio); // Attach event listener
}

function fetchAndPlayAudio() {
    fetch('/audio')
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            audioPlayer = new Audio(url);
            audioPlayer.play();
        })
        .catch(error => console.error('Error fetching audio:', error));
}