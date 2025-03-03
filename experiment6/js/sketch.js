/*
Hasina Esteqlal, Ben Hess, 
Celeste Herrera, Lyle Watkins
03 Mar 2025
for CMPM 169: Creative Coding
Instructor: Wes Modes
*/

// Constants
const ARTIFACTS = ['moctezuma_headdress', 'hoa_hakananai_a', 'tjentmutengebtiu_mummy'];
const IMG_NAMES = [['aztec_parade.jpg', 'mexican_flag.jpg', 'ritual_dress.jpg', 'tenochtitlan.jpg'],
                   ['moai_hill.jpg', 'moai_line.jpg', 'rapa_nui_moai.jpg', 'rapa_nui_overlook.jpg'],
                   ['gizah_pyramids.jpg', 'habu_temple.jpg', 'sphinx.jpg', 'temple_column.jpg']];
const FADE_RATE = 2; // Change in tint per frame

// Globals
let x;
let y;
let isDragging = false;
let slideshows = [[], [], []];
let imgIndex = 0;
let currImgOpacity = 255;
let nextImgOpacity = 0;
let canvasContainer;

function preload() {
  for (let i = 0; i < ARTIFACTS.length; i++) {
    let artifactName = ARTIFACTS[i];
    let imgNames = IMG_NAMES[i];
    for (let imgName of imgNames) {
      let img = loadImage('assets/' + artifactName + '/slideshow/' + imgName);
      slideshows[i].push(img);
    }
  }
  console.log(slideshows);
}

function resizeScreen() {
  resizeCanvas(canvasContainer.width, canvasContainer.height);
}

function setup() {
  canvasContainer = select("#canvas-container");
  let canvas = createCanvas(canvasContainer.width, canvasContainer.height);
  canvas.parent("canvas-container");

  windowResized = () => {
    resizeScreen();
  };
  resizeScreen();

  // Initialize positions
  x = width / 4;
  y = height / 2;

  // Resize images to fit the screen
  for (let slideshow of slideshows) {
    for (let img of slideshow) {
      if (img.height > img.width) img.resize(width, 0); else img.resize(0, height);
    }
  }
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

  // Draw artifact
  fill(89, 79, 227);
  noStroke();
  circle(x, y, 50);
  rect(x - 10, y - 50, 20, 50);
}