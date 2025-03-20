let video;
let videoWidth;
let videoHeight;
let captureButton;
let avgColor = [255, 255, 255]; // Default white
let analyzing = false;

function setup() {
  let canvasWidth = min(windowWidth, 480);
  let canvasHeight = canvasWidth * (9 / 16);

  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.position((windowWidth - canvasWidth) / 2, 100); // Center the canvas

  video = createCapture({
    audio: false,
    video: {
      facingMode: "environment",
    },
  });

  video.size(canvasWidth, canvasHeight);
  video.hide();

  // Create button with an ID for CSS positioning
  captureButton = createButton("Capture Image");
  captureButton.id("capture-btn"); // Assign ID
  captureButton.mousePressed(getAverageColor);

  // Manually position the button after it is created
  positionButton();
}

// Adjust button position dynamically when window resizes
function windowResized() {
  let newWidth = min(windowWidth, 480);
  let newHeight = newWidth * (9 / 16);
  resizeCanvas(newWidth, newHeight);
  video.size(newWidth, newHeight);

  // Reposition button after resizing
  positionButton();
}

function positionButton() {
  let buttonX = windowWidth / 2 - 75; // Center horizontally
  let buttonY = 550; // Adjust manually to your desired vertical position
  captureButton.position(buttonX, buttonY);
}

function draw() {
  if (analyzing) {
    background(avgColor);
  } else {
    image(video, 0, 0, width, height);
  }
}

function getAverageColor() {
  video.loadPixels();
  if (video.pixels.length > 0) {
    let r = 0, g = 0, b = 0, count = 0;

    for (let y = 0; y < video.height; y++) {
      for (let x = 0; x < video.width; x++) {
        let index = (x + y * video.width) * 4;
        r += video.pixels[index];
        g += video.pixels[index + 1];
        b += video.pixels[index + 2];
        count++;
      }
    }

    avgColor = [r / count, g / count, b / count];
    analyzing = true;

    // Immediately call downloadColor after calculating average
    downloadColor(avgColor);  

    // Change button text to "Download Colour" after color is calculated
    captureButton.html("Download Colour");  

    // Attach downloadColor function to the button
    captureButton.mousePressed(function() {  
      downloadColor(avgColor);  // Trigger the download when button is pressed
    });
  }
}

function downloadColor(color) {
  let colorCanvas = createGraphics(100, 100);
  colorCanvas.background(color[0], color[1], color[2]); 
  colorCanvas.loadPixels();
  save(colorCanvas, "colour.png");
}

function saveColorToFirebase(color) {
  db.collection("colors").add({
    r: color[0],
    g: color[1],
    b: color[2],
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(docRef => console.log("Document written with ID:", docRef.id))
  .catch(error => console.error("Error adding document:", error));
}





