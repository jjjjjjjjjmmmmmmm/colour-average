let video;
let captureButton;
let avgColor = [255, 255, 255]; // Default white
let analyzing = false;

function setup() {
  createCanvas(480, 640);

  // Start video capture
  video = createCapture({
    audio: false,
    video: {
      facingMode: "environment",
    },
  }, function () {
    console.log('Video loaded:', video);
  });
  video.hide();

  // Create and style the button
  captureButton = createButton("Capture Image");
  captureButton.style("font-size", "20px");
  captureButton.style("padding", "5px 10px");
  captureButton.style("border-radius", "10px");
  captureButton.style("background-color", "#ffffff");
  captureButton.style("color", "black");
  captureButton.position(windowWidth / 2 - captureButton.width / 2 - 11, 570);

  // Button press triggers getAverageColor()
  captureButton.mousePressed(function () {
    // Change the button text immediately after it is pressed
    captureButton.html("Processing...");

    // Call function to get the average color
    getAverageColor();
  });
}

function draw() {
  // Draw the video or color background
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

    // After processing, change the button text to 'Download Colour'
    captureButton.html("Download Colour");

    // Optionally: Save the color to Firebase or trigger the download here
    saveColorToFirebase(avgColor);
  }
}

function saveColorToFirebase(color) {
  if (typeof firebase !== "undefined" && db) {
    db.collection("colors").add({
      r: color[0],
      g: color[1],
      b: color[2],
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(docRef => console.log("Document written with ID:", docRef.id))
    .catch(error => console.error("Error adding document:", error));
  }
}




