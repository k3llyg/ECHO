let video;
let clearedMask;
let maskImage;
let strokes = [];
let fadeDuration = 10000;
let isPlaying = false;
let videoWidth, videoHeight, videoXOffset;
let textFadeDuration = 3000;
let startTime;

function preload() {
  video = createVideo(["https://i.imgur.com/0AUMwf4.mp4"]);
  video.hide(); // Hide the HTML video loader
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video.volume(0); // Mute the video!!
  calculateVideoSize();
  startTime = millis();

  // Create a graphics buffer for the mask
  clearedMask = createGraphics(width, height);
  clearedMask.clear(); // Start a transparent buffer

  maskImage = createGraphics(width, height);
  maskImage.fill(0);
  maskImage.noStroke();
}

function draw() {
  background(0);

  // Show blurred video
  image(video, videoXOffset, 0, videoWidth, videoHeight);
  filter(BLUR, 5);

  let elapsedTime = millis() - startTime; // Time since the sketch started

  // If less than 3 seconds have passed, draw the text with varying opacity
  if (elapsedTime < fadeDuration) {
    let opacity = map(elapsedTime, 0, fadeDuration, 255, 0);
    fill(200, opacity);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("<Wipe Me>", width / 2, height / 2);

    //Apply blur to the text
    filter(BLUR, 3);
  } else {
    // Text disappear after 3 secodns
    fill(200, 0); // Transparent
    textSize(50);
    textAlign(CENTER, CENTER);
    text("<Wipe Me>", width / 2, height / 2);
  }

  // Clear fog with mouse press or touch
  if (mouseIsPressed) {
    clearFog(mouseX, mouseY); // For desktop users
  }

  // Handle touches for mobile users
  if (touches.length > 0) {
    clearFog(touches[0].x, touches[0].y); // First touch point
  }

  // Update & shrink strokes overtime
  updateStrokes();

  // Apply mask to reveal clear video
  let maskedVideo = video.get();
  maskedVideo.mask(clearedMask); // Dynamic mask
  image(maskedVideo, videoXOffset, 0, videoWidth, videoHeight);
}

// Video dimensions based on screen size
function calculateVideoSize() {
  let aspectRatio = video.width / video.height;

  // Calculate video wh based on aspect ratio
  videoHeight = height;
  videoWidth = videoHeight * aspectRatio;

  // Offset for cropping
  videoXOffset = (width - videoWidth) / 2;
}

// Start video loop when the user interacts for the first time
function mousePressed() {
  if (!isPlaying) {
    video.play();
    video.loop(); // Switch to looping after it starts
    isPlaying = true;
  }
}

// Start video loop when the user taps on a mobile device
function touchStarted() {
  if (!isPlaying) {
    video.play();
    video.onended(() => video.loop());
    isPlaying = true;
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
  clearedMask.clear(); // Clear stroke

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
      clearedMask.fill(255); // White is visible in the mask
      clearedMask.noStroke();
      //Ellipse brush create realistic wiping
      clearedMask.ellipse(stroke.x, stroke.y, currentSize, currentSize);
    }
  }
}

// Adjust video dimensions when window size changes
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateVideoSize(); // Recalculate video size and offset on window resize
}
