/*
Hasina Esteqlal, Ben Hess, 
Celeste Herrera, Lyle Watkins
03 Mar 2025
for CMPM 169: Creative Coding
Instructor: Wes Modes
*/

// Constants
const ARTIFACTS = ['moctezuma_headdress', 'hoa_hakananai_a', 'tjentmutengebtiu_mummy'];
const SLIDESHOW_IMG_NAMES = [['aztec_parade.jpg', 'mexican_flag.jpg', 'ritual_dress.jpg', 'tenochtitlan.jpg'],
                             ['moai_hill.jpg', 'moai_line.jpg', 'rapa_nui_moai.jpg', 'rapa_nui_overlook.jpg'],
                             ['gizah_pyramids.jpg', 'habu_temple.jpg', 'sphinx.jpg', 'temple_column.jpg']];
const MUSEUM_IMG = ['weltmuseum.jpg','britishmuseum_hoa.jpg','britishmuseum_mummy.jpg'];
const FADE_RATE = 2; // Change in tint per frame
const ARTIFACT_SIZE = 200; // Width of artifact images

// Globals
let x;
let y;
let canvasContainer;
let artifactIndex = 0;
let isDragging = false;
// -- Images
let artifactImgs = [];
let slideshows = [[], [], []];
let museumImgs = [];
let imgIndex = 0;
let currImgOpacity = 255;
let nextImgOpacity = 0;

function preload() {
  for (let i = 0; i < ARTIFACTS.length; i++) {
    // Load artifact image and add to array
    let artifactName = ARTIFACTS[i];
    let img = loadImage('assets/' + artifactName + '/artifact.png');
    artifactImgs.push(img);

    // Load slideshow images and add to array
    let imgNames = SLIDESHOW_IMG_NAMES[i];
    for (let imgName of imgNames) {
      let img = loadImage('assets/' + artifactName + '/slideshow/' + imgName);
      slideshows[i].push(img);
    }

    // Load museum image and add to array
    let museumName = MUSEUM_IMG[i];
    let museumImg = loadImage('assets/museum_images/' + museumName);
    museumImgs.push(museumImg);
  }
}

function resizeScreen() {
  resizeCanvas(canvasContainer.width, canvasContainer.height);
}

function setup() {
  imageMode(CENTER);
  noStroke();
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
  for (let img of artifactImgs) img.resize(ARTIFACT_SIZE, 0);
  for (let img of museumImgs) img.resize(0, height);
}

function draw() {
  background(255);

  // RIGHT SIDE SLIDESHOW //
  let slideshow = slideshows[artifactIndex];
  // -- Get current and next images
  let currImg = slideshow[imgIndex];
  let nextImg = slideshow[(imgIndex + 1) % slideshow.length]; // Modulo allows for easy looping through image array
  // -- Draw each image with their respective opacity value
  tint(255, currImgOpacity);
  image(currImg, width / 2 + width / 4, height / 2);
  tint(255, nextImgOpacity);
  image(nextImg, width / 2 + width / 4, height / 2);
  // -- Decrease the current image's opacity and increase the next images opacity until they have completely faded in/out
  currImgOpacity -= FADE_RATE;
  nextImgOpacity += FADE_RATE;
  if (currImgOpacity <= 0) {
    imgIndex = (imgIndex + 1) % slideshow.length;
    currImgOpacity = 255;
    nextImgOpacity = 0;
  }

  // LEFT SIDE MUSEUM IMAGE //
  let museumImg = museumImgs[artifactIndex].get(450, 0, width / 2, height);
  tint(255, 255);
  image(museumImg, width / 4, height / 2);

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

  // Draw pedestal
  fill(50, 50, 50);
  rect(width / 4 - 50, height / 2 + 25, 100, 50);

  // Draw artifact
  tint(255, 255);
  image(artifactImgs[artifactIndex], x, y);
}