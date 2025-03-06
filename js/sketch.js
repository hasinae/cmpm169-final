/*
Hasina Esteqlal, Ben Hess, 
Celeste Herrera, Lyle Watkins
03 Mar 2025
for CMPM 169: Creative Coding
Instructor: Wes Modes
*/

// Constants
const ARTIFACTS = [{name: 'moctezuma_headdress', repatriated: false}, 
                   {name: 'hoa_hakananai_a', repatriated: false}, 
                   {name: 'tjentmutengebtiu_mummy', repatriated: false}];
const SLIDESHOW_IMG_NAMES = [['aztec_parade.jpg', 'mexican_flag.jpg', 'ritual_dress.jpg', 'tenochtitlan.jpg'],
                             ['moai_hill.jpg', 'moai_line.jpg', 'rapa_nui_moai.jpg', 'rapa_nui_overlook.jpg'],
                             ['gizah_pyramids.jpg', 'habu_temple.jpg', 'sphinx.jpg', 'temple_column.jpg']];
const MUSEUM_IMG = ['weltmuseum.jpg','britishmuseum_hoa.png','britishmuseum_mummy.jpg'];
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
const ARTIFACT_SIZE = 200; // Width of artifact images

// Globals
let x;
let y;
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

function button(x, y, t) {
  let result = false;
  if(abs(mouseX - x) < 20 && abs(mouseY - y) < 30 && !isDragging) {
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
  textSize(24);
  text(t, x, y);
  return result;
}

function draw() {
  background(255);

  let artifactX = width / 4;
  let artifactY = height / 2;

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

  // Draw buttons
  if(button(artifactX - 100, artifactY, "<<")) {
    artifactIndex -= 1;
    if(artifactIndex < 0) {
      artifactIndex = ARTIFACTS.length - 1;
    }
    checkRepatriation(artifactX, artifactY);
  }
  if(button(artifactX + 100, artifactY, ">>")) {
    artifactIndex += 1;
    if(artifactIndex >= ARTIFACTS.length) {
      artifactIndex = 0;
    }
    checkRepatriation(artifactX, artifactY);
  }

  // Drag logic for artifact
  if (abs(mouseX - x) < 40 && abs(mouseY - y) < 40) {
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
    x = mouseX;
    y = mouseY;
  } else {
    if (x < width / 2) {
      x += ((width / 4) - x) * 0.1;
      ARTIFACTS[artifactIndex].repatriated = false;
    } else {
      x += ((width / 4 * 3) - x) * 0.1;
      ARTIFACTS[artifactIndex].repatriated = true;
    }
    y += ((height / 2) - y) * 0.1;
  }

  // Artifact shine effect
  let r = constrain((x - (width / 4)) / (width / 2), 0, 1);
  fill(255, 255, 255, floor(r * 50));
  noStroke();
  push();
  translate(x, y);
  rotate(frameCount * 0.01);
  for (let i = 0; i < 8; i++) {
    rotate(PI * 2 / 8);
    triangle(0, 0, floor(r * -200), 1000, floor(r * 200), 1000);
  }
  pop();

  // Draw description
  fill(0, 0, 0, 128);
  noStroke();
  rect(0, artifactY + 100, width / 2, height - (artifactY + 100));
  
  fill(255, 255, 255);
  textAlign(LEFT, TOP);
  textSize(14);
  text(DESCRIPTIONS[artifactIndex], 10, artifactY + 110, width / 2 - 20);

  // Draw artifact
  tint(255, 255);
  image(artifactImgs[artifactIndex], x, y);
}

function checkRepatriation(artifactX, artifactY) {
  if (ARTIFACTS[artifactIndex].repatriated) {
    x = width / 4 * 3;
    y = height / 2;
  } else {
    x = artifactX;
    y = artifactY;
  }
}