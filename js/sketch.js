/*
Hasina Esteqlal, Ben Hess, 
Celeste Herrera, Lyle Watkins
03 Mar 2025
for CMPM 169: Creative Coding
Instructor: Wes Modes
*/

// Constants
const MAP = 'map.jpg';
const MARKER = 'marker.webp';
const ARTIFACTS = [{name: 'moctezuma_headdress', size: 200, repatriated: false, museum: 0},
                   {name: 'Pöch_Collection', size: 600, repatriated: false, museum: 0}, 
                   {name: 'hoa_hakananai_a', size: 120, repatriated: false, museum: 1}, 
                   {name: 'tjentmutengebtiu_mummy', size: 500, repatriated: false, museum: 1},
                   {name: 'kohinoor', size: 200, repatriated: false, museum: 2},
                   {name: 'Cullinan_Diamond', size: 200, repatriated: false, museum: 2}];
const SLIDESHOW_IMG_NAMES = [['aztec_parade.jpg', 'mexican_flag.jpg', 'ritual_dress.jpg', 'tenochtitlan.jpg'],
                             ['botswana_1.jpg', 'botswana_2.jpg', 'botswana_3.jpg', 'botswana_4.jpg'],
                             ['moai_hill.jpg', 'moai_line.jpg', 'rapa_nui_moai.jpg', 'rapa_nui_overlook.jpg'],
                             ['gizah_pyramids.jpg', 'habu_temple.jpg', 'sphinx.jpg', 'temple_column.jpg'],
                             ['kohinoor_1.webp', 'kohinoor_2.jpg', 'kohinoor_3.webp', 'kohinoor_4.webp'],
                             ['cullinan_1.jpg', 'cullinan_2.jpg', 'cullinan_3.jpg', 'cullinan_4.jpg']];
const MUSEUM_IMG = ['weltmuseum.jpg','weltmuseum_posh.jpg','britishmuseum_hoa.png','britishmuseum_mummy.jpg', 'toweroflondon_kohinoor.png', 'toweroflondon_cullinan.png'];
const HOMELAND_MUSIC = ['aztec_music.mp3', 'botswana_music.mp3', 'rapa_nui_music.mp3', 'egypt_music.mp3', 'southindian_music.mp3', 'southafrican_music.mp3'];
/* music sources: 
aztec_music: Jimena Contreras - Aztec Empire
botswana_music: Captain Dira-Machobane ( Botswana )
rapa_nui_music: Easter Island Folk Song - "Reo Topa"
egypt_music: Royalty free Ancient Egypt Music 2 | Desert Fantasy Cleopatra | WOW Sound
*/
const MUSEUM_CROP_X = 400; // X value to crop museum images
const DESCRIPTIONS = [`Believed to have belonged to Moctezuma II, the Aztec emperor during the Spanish conquest
  of the early 16th century, this artifact is recognized to have been a symbol of political and religious power in
  ancient Mexico. Its origin and function are disputed, as there exists no known evidence proving that it belonged
  to Moctezuma II and it is unclear when and for what purposes it may have been worn. It is made of quetzal and
  other feathers, sewn together with gold detailing, and is currently held in the Weltmuseum (World Museum) in
  Vienna, Austria. Mexico has repeatedly requested the artifact be returned in ongoing repatriation dialogues.`,
  `A collection of artifacts at the Weltmuseum collected by Rudolf Pöch. During 1870-1921, while Botswana was
  under British rule, the Austrain Academy of Sciences commissioned his travels where his focus was on collecting
  data on anthropological research. The museum holds 296 artifcats from this collection, to which to museum has
  acknowledged was collected unethically.`,
  `A moai statue from Easter Island, created by the Rapa Nui people between the 11th and 12th centuries. The
  statue is carved from basalt and is about 2.5 meters in height. It is distinguishable by the carvings on its
  back, which are associated with the bird man religion. The statue was removed by a British ship's crew in 1868
  and currently resides in the British Museum in London. In 2018, a written request was made for the return of
  Hoa Hakananai'a, and the museum met with representatives of Rapa Nui, but the statue remains on display in London.`,
  `A painted casting, holding the mummified remains of a priestess called Tjentmutengebtiu from Egypt's 21st dynasty.
  This artifact is currently in the British Museum.`,
  `The history of this diamond hasn’t been well documented, with many sources differing in the origin of the gem.
  However, it is believed to have originated from the Golconda mines in central southern India. It is a symbol of conquest and power, 
  and some of its previous owners included Mughal Emperors, Shahs of Iran, and Emirs of Afghanistan. 
  In 1849, the East India Company took the jewel from Maharaja Duleep Singh as part of the Treaty of Lahore to be surrendered to Queen Victoria. 
  The diamond weighs 105.6 carats but was larger before it was recut in 1852 to fit European aesthetics.`,
  `Discovered in South Africa in 1905 and named after the mine’s chairman, Sir Thomas Cullinan. Since its discovery, 
  it has remained the largest gem-quality uncut diamond in the world at 3106 carats. The rough stone was gifted to King Edward VII in 1907 
  and cut into nine major diamonds named Cullinan I through IX. Also known as the Great Star of Africa, Cullinan I weighs more than 530 carats 
  and is mounted on the Sovereign’s Scepter as part of the British royal family’s priceless crown jewels. Activists in South Africa have called
  for the diamond’s return, arguing that the diamond was stolen during the colonial era and not gifted.`];
const FADE_RATE = 2; // Change in tint per frame
const LERP_RATE = 0.05; // Rate of interpolation for artifact movement
const HANDLE_SIZE = 40; // Size of grabbable area around artifact
const BUTTON_SPACING = 255; // Distance from artifact to buttons
const BUTTON_SIZE = 50;
const MIN_MOVE_FREQ = 30; // Minimum # of frames in between random artifact movement 
const MAX_MOVE_FREQ = 60; // Maximum # of frames in between random artifact movement
const MOVE_DIFF = 200; // Maximum distance artifact can move randomly

// Globals
let currPos; // Current artifact position
let museumPos;
let homelandPos;
let goalPos;
let canvasContainer;
let artifactIndex = 0;
let isDragging = false;
let isMoving = false;
let mouseDown = false;
let moveCounter = MAX_MOVE_FREQ;
let artifactOpacity = 255; // opacity of the current artifact
let isTransitioning = false; // indicates if a transition is happening
let nextArtifactIndex = artifactIndex; // stores the index of the next artifact
// -- Images
let artifactImgs = [];
let slideshows = [[], [], [], [], [], []];
let museumImgs = [];
let imgIndex = 0;
let currImgOpacity = 255;
let nextImgOpacity = 0;
let _mapImg;
let _markerImg;
let markerPos = [[]];
let artifactPos = [[]];
let repatArtifacts = [[]];
let markerLabels = ['test', 'Weltmuseum', 'British Museum', 'Tower of London'];
let currMuseum;
let atMuseum = false;
// music
let homelandMusic = [];


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

  // load music
  for (let i = 0; i < ARTIFACTS.length; i++) {
    let path = 'assets/' + HOMELAND_MUSIC[i];
    let homelandSound = loadSound(path);
    homelandMusic.push(homelandSound);
}

  _mapImg = loadImage('assets/' + MAP);
  _markerImg = loadImage('assets/' + MARKER);
  markerPos.push([645, 140]);
  markerPos.push([580, 120]);
  markerPos.push([595, 130]);
  artifactPos.push([260, 270]);// mexico
  artifactPos.push([675, 480]);// botswana
  artifactPos.push([220, 500]);// easter island
  artifactPos.push([700, 250]);// egypt
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
  if(abs(mouseX - x) < BUTTON_SIZE && abs(mouseY - y) < BUTTON_SIZE && !isDragging && !isMoving) {
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
  
  handleArtifact();
  // Add in map, fade out when location is picked, the load in the artifact from that location
  if(!atMuseum){
    image(_mapImg, 600, 400, width, height);
    //placeArtifacts();
    placeMarker();
  }else{
    handleArtifact();
    drawShineEffect();
    drawDescription();
    drawArtifact();
    // add button to go back to map
    if(button(1000, 700, "Back to Map")) {
      atMuseum = false;
    }
  }
}

function handleArtifact() {
  if(currMuseum == 1){
    // Weltmuseum
    if(artifactIndex > 1) {
      artifactIndex = 0;
    }
  } else if(currMuseum == 2) {
    // British Museum
    if(artifactIndex < 2) {
      artifactIndex = 2;
    }
  } else if(currMuseum == 3) {
    // Tower of London
    if(artifactIndex < 4) {
      artifactIndex = 4;
    }
  }
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
  if (button(museumPos.x - BUTTON_SPACING, museumPos.y, "<")) {
    if (!isTransitioning) {
      nextArtifactIndex = artifactIndex - 1;
      if (nextArtifactIndex < 0) {
        nextArtifactIndex = ARTIFACTS.length - 1;
      }
      isTransitioning = true; // Start the transition
    }
  }
  if (button(museumPos.x + BUTTON_SPACING, museumPos.y, ">")) {
    if (!isTransitioning) {
      nextArtifactIndex = artifactIndex + 1;
      if (nextArtifactIndex >= ARTIFACTS.length) {
        nextArtifactIndex = 0;
      }
      isTransitioning = true; // Start the transition
    }
  }

  // Fade out current artifact
  if (isTransitioning) {
    artifactOpacity -= FADE_RATE; // Decrease opacity
    if (artifactOpacity <= 0) {
      artifactOpacity = 0; // Ensure opacity doesn't go below 0
      artifactIndex = nextArtifactIndex; // Switch to the next artifact
      checkRepatriation(); // Update positions based on repatriation status
      isTransitioning = false; // End the transition
    }
  } else if (artifactOpacity < 255) {
    artifactOpacity += FADE_RATE; // Fade in the new artifact
  }

  // Artifact dragging logic
  if (abs(mouseX - currPos.x) < HANDLE_SIZE && abs(mouseY - currPos.y) < HANDLE_SIZE) {
    if (mouseIsPressed && !isMoving && !ARTIFACTS[artifactIndex].repatriated) {
      isDragging = true;
    }
    if (!ARTIFACTS[artifactIndex].repatriated) cursor(HAND);
  }

  if (!mouseIsPressed) {
    isDragging = false;
    mouseDown = false;
  }

  if (isDragging) {
    cursor(HAND);
    currPos = createVector(mouseX, mouseY);
    if (!isMoving) goalPos = createVector(mouseX, mouseY);
    if (moveCounter == 0) {
      isMoving = true;
      isDragging = false;
      goalPos = createVector(museumPos.x + random(-MOVE_DIFF, MOVE_DIFF), currPos.y + random(-MOVE_DIFF, MOVE_DIFF));
    }
    moveCounter--;
  } else if (!isMoving) {
    if (currPos.x < width / 2) {
      goalPos = createVector(museumPos.x, museumPos.y);
      ARTIFACTS[artifactIndex].repatriated = false;
      repatArtifacts.splice(artifactIndex, 1);
    } else {
      goalPos = createVector(homelandPos.x, homelandPos.y);
      ARTIFACTS[artifactIndex].repatriated = true;
      repatArtifacts.push(artifactImgs[artifactIndex]);
    }
  }

  if (isMoving) {
    cursor(ARROW);
    if (currPos.dist(goalPos) < 1) {
      moveCounter = round(random(MIN_MOVE_FREQ, MAX_MOVE_FREQ));
      isMoving = false;
    }
  }

  // handle music
  let distToHomeland = dist(currPos.x, currPos.y, homelandPos.x, homelandPos.y);
  let maxDist = width / 2; 
  let volume = map(distToHomeland, maxDist, 0, 0, 1);
  for (let music of homelandMusic) music.setVolume(0);
  homelandMusic[artifactIndex].setVolume(volume);
  if (!homelandMusic[artifactIndex].isPlaying()) {
    homelandMusic[artifactIndex].loop();
  }
}

function placeMarker() {
  for(let i = 0; i < markerPos.length; i++) {
    image(_markerImg, markerPos[i][0], markerPos[i][1], 50, 50);
  }

  // when you hover over marker, create buttons to select location
  for(let i = 0; i < markerPos.length; i++) {
    if(abs(mouseX - markerPos[i][0]) < 25 && abs(mouseY - markerPos[i][1]) < 25) {
      fill(255);
      cursor(HAND);
      stroke(0);
      textAlign(CENTER, CENTER);
      textSize(20);
      text(markerLabels[i], markerPos[i][0], markerPos[i][1] + 30);
      if(mouseIsPressed && !mouseDown) {
        if (!isTransitioning) {
          currMuseum = i;
          if(i == 1) {
            nextArtifactIndex = 0;
          }else if(i == 2) {
            nextArtifactIndex = 1;
          }else if (i == 3) {
            nextArtifactIndex = 4;
          }
          atMuseum = true;
        }
      }
    } else {
      fill(200);
    }
  }
}

function placeArtifacts() {
  repatArtifacts.forEach((img, i) => {
    image(img, artifactPos[i][0], artifactPos[i][1]);
  });
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
  if(currMuseum != null) {
    if(currMuseum == 1) {
      // only show Weltmuseum artifacts, museum: 0
      if(nextArtifactIndex != 0) {
        nextArtficatIndex = 0;
      }
    } else if(currMuseum == 2) {
      // only show British Museum artifacts, museum: 1
      if(nextArtifactIndex > 2 || nextArtifactIndex < 1) {
        nextArtficatIndex = 1;
      }
    } else if(currMuseum == 3) {
      // only show Tower of London artifacts, museum: 2
      if(nextArtifactIndex < 4) {
        nextArtficatIndex = 4;
      }
    }
  }


  tint(255, artifactOpacity); // Apply opacity to the artifact
  currPos = p5.Vector.lerp(currPos, goalPos, LERP_RATE);
  image(artifactImgs[artifactIndex], currPos.x, currPos.y);
}