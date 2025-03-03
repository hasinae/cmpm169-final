// globals
let x;
let y;
let isDragging = false;
let canvasContainer; 

function resizeScreen() {
  resizeCanvas(canvasContainer.width, canvasContainer.height);
}

function setup() {
  // Get the canvas container element
  canvasContainer = select("#canvas-container");

  // Create a canvas and attach it to the container
  let canvas = createCanvas(canvasContainer.width, canvasContainer.height);
  canvas.parent("canvas-container");

  // console.log("Canvas created and attached to #canvas-container"); // Debugging

  windowResized = () => {
    resizeScreen();
  };
  resizeScreen();

  // Initialize positions
  x = width / 4;
  y = height / 2;
}

function draw() {
  background(0);

  // Draw background rectangles
  fill(89, 79, 227, 128);
  rect(width / 2, 0, width / 2, height);

  fill(50, 50, 50);
  rect(width / 4 - 50, height / 2 + 25, 100, 50);

  cursor(ARROW);
  if (abs(mouseX - x) < 40 && abs(mouseY - y) < 40) {
    if (mouseIsPressed) {
      isDragging = true;
    }
    cursor(HAND);
  }

  if (!mouseIsPressed) {
    isDragging = false;
  }

  if (isDragging) {
    cursor(HAND);
    x = mouseX;
    y = mouseY;
  } else {
    if (x < width / 2) {
      x += ((width / 4) - x) * 0.1;
    } else {
      x += ((width / 4 * 3) - x) * 0.1;
    }
    y += ((height / 2) - y) * 0.1;
  }

  let r = constrain((x - (width / 4)) / (width / 2), 0, 1);

  fill(255, 255, 255, floor(r * 50));
  push();
  translate(x, y);
  rotate(frameCount * 0.01);
  for (let i = 0; i < 8; i++) {
    rotate(PI * 2 / 8);
    triangle(0, 0, floor(r * -200), 1000, floor(r * 200), 1000);
  }
  pop();

  fill(89, 79, 227);
  noStroke();
  circle(x, y, 50);
  rect(x - 10, y - 50, 20, 50);
}