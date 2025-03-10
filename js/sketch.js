/*
Hasina Esteqlal, Ben Hess, 
Celeste Herrera, Lyle Watkins
03 Mar 2025
for CMPM 169: Creative Coding
Instructor: Wes Modes
*/

// Constants
const ARTIFACTS = [{name: 'moctezuma_headdress', size: 200, repatriated: false}, 
                   {name: 'hoa_hakananai_a', size: 120, repatriated: false}, 
                   {name: 'tjentmutengebtiu_mummy', size: 500, repatriated: false}];
const SLIDESHOW_IMG_NAMES = [['aztec_parade.jpg', 'mexican_flag.jpg', 'ritual_dress.jpg', 'tenochtitlan.jpg'],
                             ['moai_hill.jpg', 'moai_line.jpg', 'rapa_nui_moai.jpg', 'rapa_nui_overlook.jpg'],
                             ['gizah_pyramids.jpg', 'habu_temple.jpg', 'sphinx.jpg', 'temple_column.jpg']];
const MUSEUM_IMG = ['weltmuseum.jpg','britishmuseum_hoa.png','britishmuseum_mummy.jpg'];
const MUSEUM_CROP_X = 400; // X value to crop museum images
const DESCRIPTIONS = [`Believed to have belonged to Moctezuma II, the Aztec emperor during the Spanish conquest
  of the early 16th century, this artifact is recognized to have been a symbol of political and religious power in
  ancient Mexico. Its origin and function are disputed, as there exists no known evidence proving that it belonged
  to Moctezuma II and it is unclear when and for what purposes it may have been worn. It is made of quetzal and
  other feathers, sewn together with gold detailing, and is currently held in the Weltmuseum (World Museum) in
  Vienna, Austria. Mexico has repeatedly requested the artifact be returned in ongoing repatriation dialogues.`,
  `A moai statue from Easter Island, created by the Rapa Nui people between the 11th and 12th centuries. The
  statue is carved from basalt and is about 2.5 meters in height. It is distinguishable by the carvings on its
  back, which are associated with the bird man religion. The statue was removed by a British ship’s crew in 1868
  and currently resides in the British Museum in London. In 2018, a written request was made for the return of
  Hoa Hakanani’a, and the museum met with representatives of Rapa Nui, but the statue remains on display in London.`,
  `A painted casting, holding the mummified remains of a priestess called Tjentmutengebtiu from Egypt’s 21st dynasty.
  This artifact is currently in the British Museum.`];
const FADE_RATE = 2; // Change in tint per frame
const LERP_RATE = 0.1; // Rate of interpolation for artifact movement
const HANDLE_SIZE = 40; // Size of grabbable area around artifact
const BUTTON_SPACING = 255; // Distance from artifact to buttons
const BUTTON_SIZE = 50;

// Globals
let currPos; // Current artifact position
let museumPos;
let homelandPos;
let goalPos;
let canvasContainer;
let artifactIndex = 0;
let isDragging = false;
let mouseDown = false;
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
    let artifactName = ARTIFACTS[i].name;
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
  museumPos = createVector(width / 4, height / 2);
  homelandPos = createVector(width / 4 * 3, height / 2);
  currPos = createVector(museumPos.x, museumPos.y);
  goalPos = createVector(museumPos.x, museumPos.y);

  // Resize images to fit the screen
  for (let slideshow of slideshows) {
    for (let img of slideshow) {
      if (img.height > img.width) img.resize(width, 0); else img.resize(0, height);
    }
  }
  for (let artifact of ARTIFACTS) artifactImgs[ARTIFACTS.indexOf(artifact)].resize(artifact.size, 0);
  for (let img of museumImgs) img.resize(0, height);
}

function button(x, y, t) {
  let result = false;
  if(abs(mouseX - x) < BUTTON_SIZE && abs(mouseY - y) < BUTTON_SIZE && !isDragging) {
    fill(255);
    cursor(HAND);
    if(mouseIsPressed && !mouseDown) {
      result = true;
      mouseDown = true;
    }
  } else {
    fill(200);
  }
  stroke(0);
  textAlign(CENTER, CENTER);
  textSize(BUTTON_SIZE);
  text(t, x, y);
  return result;
}

function draw() {
  background(255);
  cursor(ARROW);

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
  let museumImg = museumImgs[artifactIndex].get(MUSEUM_CROP_X, 0, width / 2, height);
  tint(255, 255);
  image(museumImg, width / 4, height / 2);

  // Button logic for changing artifacts
  if(button(museumPos.x - BUTTON_SPACING, museumPos.y, "<")) {
    artifactIndex -= 1;
    if(artifactIndex < 0) {
      artifactIndex = ARTIFACTS.length - 1;
    }
    checkRepatriation();
  }
  if(button(museumPos.x + BUTTON_SPACING, museumPos.y, ">")) {
    artifactIndex += 1;
    if(artifactIndex >= ARTIFACTS.length) {
      artifactIndex = 0;
    }
    checkRepatriation();
  }

  // Drag logic for artifact
  if (abs(mouseX - currPos.x) < HANDLE_SIZE && abs(mouseY - currPos.y) < HANDLE_SIZE) {
    if (mouseIsPressed) {
      isDragging = true;
    }
    cursor(HAND);
  }

  if (!mouseIsPressed) {
    isDragging = false;
    mouseDown = false;
  }

  if (isDragging) {
    cursor(HAND);
    currPos = createVector(mouseX, mouseY);
    goalPos = createVector(mouseX, mouseY);
  } else {
    if (currPos.x < width / 2) {
      goalPos = createVector(museumPos.x, museumPos.y);
      ARTIFACTS[artifactIndex].repatriated = false;
    } else {
      goalPos = createVector(homelandPos.x, homelandPos.y);
      ARTIFACTS[artifactIndex].repatriated = true;
    }
  }

  drawShineEffect();
  drawDescription();
  drawArtifact();
}

function checkRepatriation() {
  if (ARTIFACTS[artifactIndex].repatriated) {
    currPos = createVector(homelandPos.x, homelandPos.y);
    goalPos = createVector(homelandPos.x, homelandPos.y);
  } else {
    currPos = createVector(museumPos.x, museumPos.y);
    goalPos = createVector(museumPos.x, museumPos.y);
  }
}

function drawShineEffect() {
  let r = constrain((currPos.x - (width / 4)) / (width / 2), 0, 1);
  fill(255, 255, 255, floor(r * 50));
  noStroke();
  push();
  translate(currPos.x, currPos.y);
  rotate(frameCount * 0.01);
  for (let i = 0; i < 8; i++) {
    rotate(PI * 2 / 8);
    triangle(0, 0, floor(r * -200), 1000, floor(r * 200), 1000);
  }
  pop();
}

function drawDescription() {
  fill(0, 0, 0, 128);
  noStroke();
  rect(0, museumPos.y + 150, width / 2, height - (museumPos.y + 100));
  
  fill(255, 255, 255);
  textAlign(LEFT, TOP);
  textSize(14);
  text(DESCRIPTIONS[artifactIndex], 10, museumPos.y + 160, width / 2 - 20);
}

function drawArtifact() {
  tint(255, 255);
  currPos = p5.Vector.lerp(currPos, goalPos, LERP_RATE);
  image(artifactImgs[artifactIndex], currPos.x, currPos.y);
}