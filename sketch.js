let video;
let clearedMask;  
let maskImage;
let strokes = []; 
let fadeDuration = 10000; 
let isPlaying = false;  // To check if video has started playing

function preload() {
  video = createVideo(['/vid/kid.webm']);
  video.hide();  // Hide the HTML video loader
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video.volume(0);  // Mute the video

  // Create a graphics buffer for the mask
  clearedMask = createGraphics(width, height);
  clearedMask.clear();  // Start a transparent buffer
  
  maskImage = createGraphics(width, height);
  maskImage.fill(0); 
  maskImage.noStroke();
}

function draw() {
  background(0);
  textSize(80);
  fill(200);
  textAlign(CENTER, CENTER);
  text("Tap to Start", width / 2, height / 2); 
  image(video, 0, 0, width, height);
  //image(video, 0, 0, width, height);
  filter(BLUR, 8);

  // Clear fog with mouse press or touch
  if (mouseIsPressed) {
    clearFog(mouseX, mouseY);  // For desktop users
  }

  // Handle touches for mobile users
  if (touches.length > 0) {
    clearFog(touches[0].x, touches[0].y);  // First touch point
  }

  // Update & shrink strokes overtime
  updateStrokes();

  // Apply mask to reveal clear video
  let maskedVideo = video.get();
  maskedVideo.mask(clearedMask);  // Dynamic mask
  image(maskedVideo, 0, 0, width, height);
}

// Start video loop when the user interacts for the first time
function mousePressed() {
  if (!isPlaying) {
    video.loop();  // Start the video looping
    isPlaying = true;  // Ensure this only happens once
  }
}

// Start video loop when the user taps on a mobile device
function touchStarted() {
  if (!isPlaying) {
    video.loop();  // Start the video looping
    isPlaying = true;  // Ensure this only happens once
  }
}

// Clear fog with circular brush
function clearFog(x, y) {
  let brushSize = 100;  

  // Add brush stroke to the strokes array with timestamp
  strokes.push({ x: x, y: y, size: brushSize, time: millis() });
}

// Function to update and draw all strokes (shrinking them over time)
function updateStrokes() {
  clearedMask.clear();  // Clear stroke

  let currentTime = millis();

  // Loop through all the strokes and update them
  for (let i = strokes.length - 1; i >= 0; i--) {
    let stroke = strokes[i];
    let elapsedTime = currentTime - stroke.time;

    // Calculate how long has passed
    let fadeProgress = elapsedTime / fadeDuration;
    
    if (fadeProgress >= 1) {
      // If stroke fully fades, remove it
      strokes.splice(i, 1);
    } else {
      // Calculate stroke size based on fade progress
      let currentSize = stroke.size * (1 - fadeProgress);

      // Shrink stroke on mask (revealing the video)
      clearedMask.fill(255);  // White is visible in the mask
      clearedMask.noStroke();
      clearedMask.ellipse(stroke.x, stroke.y, currentSize, currentSize);
    }
  }
}