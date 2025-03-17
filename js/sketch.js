/*
Hasina Esteqlal, Ben Hess, 
Celeste Herrera, Lyle Watkins
18 Mar 2025
for CMPM 169: Creative Coding
Instructor: Wes Modes
*/

// -- Constants -- //
const MAP = 'map.jpg';
const MARKER = 'marker.webp';
const ARTIFACT_NAMES = ['moctezuma_headdress', 'Pöch_Collection', 'hoa_hakananai_a', 'tjentmutengebtiu_mummy', 'kohinoor', 'Cullinan_Diamond'];
const SLIDESHOW_IMG_NAMES = [['aztec_parade.jpg', 'mexican_flag.jpg', 'ritual_dress.jpg', 'tenochtitlan.jpg'],
['botswana_1.jpg', 'botswana_2.jpg', 'botswana_3.jpg', 'botswana_4.jpg'],
['moai_hill.jpg', 'moai_line.jpg', 'rapa_nui_moai.jpg', 'rapa_nui_overlook.jpg'],
['gizah_pyramids.jpg', 'habu_temple.jpg', 'sphinx.jpg', 'temple_column.jpg'],
['kohinoor_1.webp', 'kohinoor_2.jpg', 'kohinoor_3.webp', 'kohinoor_4.webp'],
['cullinan_1.jpg', 'cullinan_2.jpg', 'cullinan_3.jpg', 'cullinan_4.jpg']];
const MUSEUM_IMG = ['weltmuseum.jpg', 'weltmuseum_posh.jpg', 'britishmuseum_hoa.png', 'britishmuseum_mummy.jpg', 'toweroflondon_kohinoor.png', 'toweroflondon_cullinan.png'];
const HOMELAND_MUSIC = ['aztec_music.mp3', 'botswana_music.mp3', 'rapa_nui_music.mp3', 'egypt_music.mp3', 'southindian_music.mp3', 'southafrican_music.mp3'];
/* music sources: 
aztec_music: Jimena Contreras - Aztec Empire
botswana_music: Captain Dira-Machobane ( Botswana )
rapa_nui_music: Easter Island Folk Song - "Reo Topa"
egypt_music: Royalty free Ancient Egypt Music 2 | Desert Fantasy Cleopatra | WOW Sound
*/
const MUSEUM_CROP_X = 400; // X value to crop museum images
const SLIDESHOW_FADE_RATE = 2; // Change in tint per frame
const ARTIFACT_FADE_RATE = 5;
const LERP_RATE = 0.05; // Rate of interpolation for artifact movement
const HANDLE_SIZE = 40; // Size of grabbable area around artifact
const BUTTON_SPACING = 255; // Distance from artifact to buttons
const BUTTON_SIZE = 50;
const MIN_MOVE_FREQ = 20; // Minimum # of frames in between random artifact movement 
const MAX_MOVE_FREQ = 60; // Maximum # of frames in between random artifact movement
const MOVE_DIFF = 250; // Maximum distance artifact can move randomly

// -- Globals -- //
let artifacts = []; // Array of artifact objects
let artifactData;
let currPos; // Current artifact position
let museumPos;
let homelandPos;
let goalPos;
let canvasContainer;
let isDragging = false;
let isMoving = false;
let mouseDown = false;
let moveCounter = MIN_MOVE_FREQ;
let artifactOpacity = 255; // opacity of the current artifact
let isTransitioning = false; // indicates if a transition is happening
let atMuseum = false;
let currArtifacts; // Array of artifacts at the current museum
let currArtifact;
let nextArtifactIndex;
// -- Images
let artifactImgs = [];
let slideshows = [[], [], [], [], [], []];
let museumImgs = [];
let imgIndex = 0;
let currImgOpacity = 255;
let nextImgOpacity = 0;
let _mapImg;
let _markerImg;
let markerPos = [];
let markerLabels = ['Weltmuseum', 'British Museum', 'Tower of London'];
// -- Music
let homelandMusic = [];

function preload() {
    artifactData = loadJSON('/artifactData.json');

    for (let i = 0; i < ARTIFACT_NAMES.length; i++) {
        // Load artifact image and add to corresponding artifact object
        let artifactName = ARTIFACT_NAMES[i];
        let img = loadImage('assets/' + artifactName + '/artifact.png');
        artifactImgs.push(img);

        // Load slideshow images and add to corresponding artifact object slideshow array
        let imgNames = SLIDESHOW_IMG_NAMES[i];
        for (let imgName of imgNames) {
            let img = loadImage('assets/' + artifactName + '/slideshow/' + imgName);
            slideshows[i].push(img);
        }

        // Load museum image and add to corresponding artifact object
        let museumName = MUSEUM_IMG[i];
        let museumImg = loadImage('assets/museum_images/' + museumName);
        museumImgs.push(museumImg);
    }

    // Load music
    for (let i = 0; i < ARTIFACT_NAMES.length; i++) {
        let path = 'assets/' + HOMELAND_MUSIC[i];
        let homelandSound = loadSound(path);
        homelandMusic.push(homelandSound);
    }

    _mapImg = loadImage('assets/' + MAP);
    _markerImg = loadImage('assets/' + MARKER);
    markerPos.push([645, 140]);
    markerPos.push([580, 120]);
    markerPos.push([595, 130]);
}

function resizeScreen() {
    resizeCanvas(canvasContainer.width, canvasContainer.height);
}

function setup() {
    imageMode(CENTER);
    noStroke();
    frameRate(60);
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

    // Create artifact objects
    for (let assetName of ARTIFACT_NAMES) artifacts.push(new Artifact(assetName));

    // Set artifact images
    for (let i = 0; i < artifacts.length; i++) {
        let artifact = artifacts[i];
        artifact.img = artifactImgs[i];
        artifact.slideshow = slideshows[i];
        artifact.bg = museumImgs[i];
    }

    // Resize images to fit the screen
    for (let artifact of artifacts) {
        for (let img of artifact.slideshow) {
            if (img.height > img.width) img.resize(width, 0); else img.resize(0, height);
        }
        artifact.img.resize(artifact.size, 0);
        artifact.bg.resize(0, height);
    }
}

function button(x, y, t) {
    let result = false;
    if (abs(mouseX - x) < BUTTON_SIZE && abs(mouseY - y) < BUTTON_SIZE && !isDragging && !isMoving) {
        fill(255);
        cursor(HAND);
        if (mouseIsPressed && !mouseDown) {
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

    // Add in map, fade out when location is picked, the load in the artifact from that location
    if (!atMuseum) {
        tint(255, 255);
        image(_mapImg, 600, 400, width, height);
        placeMarker();
    } else {
        currArtifact.draw();
        handleButtons();
        handleArtifactTransition();
        handleArtifactDragging();
        handleMusic();
        // Add button to go back to map
        if (button(1000, 700, "Back to Map") && !isTransitioning) {
            turnMusicOff();
            atMuseum = false;
            mouseDown = false;
        }
    }
}

function handleButtons() {
    if (button(museumPos.x - BUTTON_SPACING, museumPos.y, "<")) {
        if (!isTransitioning) {
            // TODO: Rewrite logic for changing artifacts
            let currArtifactIndex = currArtifacts.indexOf(currArtifact);
            nextArtifactIndex = currArtifactIndex - 1;
            if (nextArtifactIndex < 0) nextArtifactIndex = currArtifacts.length - 1;
            isTransitioning = true; // Start the transition
        }
    }
    if (button(museumPos.x + BUTTON_SPACING, museumPos.y, ">")) {
        if (!isTransitioning) {
            // TODO: Rewrite logic for changing artifacts
            let currArtifactIndex = currArtifacts.indexOf(currArtifact);
            nextArtifactIndex = currArtifactIndex + 1;
            if (nextArtifactIndex > currArtifacts.length - 1) nextArtifactIndex = 0;
            isTransitioning = true; // Start the transition
        }
    }
}

function handleArtifactTransition() {
    if (isTransitioning) {
        artifactOpacity -= ARTIFACT_FADE_RATE; // Decrease opacity
        if (artifactOpacity <= 0) {
            artifactOpacity = 0; // Ensure opacity doesn't go below 0
            currArtifact = currArtifacts[nextArtifactIndex]; // Switch to the next artifact
            currArtifact.setPosition(); // Update position based on repatriation status
            isTransitioning = false; // End the transition
        }
    } else if (artifactOpacity < 255) {
        artifactOpacity += ARTIFACT_FADE_RATE; // Fade in the new artifact
    }
}

function handleArtifactDragging() {
    if (abs(mouseX - currPos.x) < HANDLE_SIZE && abs(mouseY - currPos.y) < HANDLE_SIZE) {
        if (mouseIsPressed && !isMoving && !currArtifact.repatriated) {
            isDragging = true;
        }
        if (!currArtifact.repatriated) cursor(HAND);
    }

    if (!mouseIsPressed) {
        isDragging = false;
        mouseDown = false;
    }

    if (isDragging) {
        cursor(HAND);
        currPos = createVector(mouseX, mouseY);
        if (!isMoving) goalPos = createVector(mouseX, mouseY);
        // Random movment behavior
        if (moveCounter == 0) {
            isMoving = true;
            isDragging = false;
            goalPos = createVector(museumPos.x + random(-MOVE_DIFF, MOVE_DIFF), currPos.y + random(-MOVE_DIFF, MOVE_DIFF));
        }
        moveCounter--;
    } else if (!isMoving && !currArtifact.repatriated) {
        if (currPos.x < width / 2) {
            goalPos = createVector(museumPos.x, museumPos.y);
        } else {
            goalPos = createVector(homelandPos.x, homelandPos.y);
            currArtifact.repatriated = true;
        }
    }

    if (isMoving) {
        cursor(ARROW);
        if (currPos.dist(goalPos) < 1) {
            moveCounter = round(random(MIN_MOVE_FREQ, MAX_MOVE_FREQ));
            isMoving = false;
        }
    }
}

function handleMusic() {
    let distToHomeland = dist(currPos.x, currPos.y, homelandPos.x, homelandPos.y);
    let maxDist = width / 2;
    let volume = map(distToHomeland, maxDist, 0, 0, 1);
    turnMusicOff();
    if (currArtifact) {
        let index = ARTIFACT_NAMES.indexOf(currArtifact.assetName);
        homelandMusic[index].setVolume(volume);
        if (!homelandMusic[index].isPlaying()) {
            homelandMusic[index].loop();
        }
    }
}

function turnMusicOff() {
    for (let music of homelandMusic) music.setVolume(0);
}

function placeMarker() {
    for (let i = 0; i < markerPos.length; i++) {
        image(_markerImg, markerPos[i][0], markerPos[i][1], 50, 50);
    }

    // when you hover over marker, create buttons to select location
    for (let i = 0; i < markerPos.length; i++) {
        if (abs(mouseX - markerPos[i][0]) < 10 && abs(mouseY - markerPos[i][1]) < 25) {
            fill(255);
            cursor(HAND);
            stroke(0);
            textAlign(CENTER, CENTER);
            textSize(20);
            text(markerLabels[i], markerPos[i][0], markerPos[i][1] + 30);
            if (mouseIsPressed && !mouseDown) {
                mouseDown = true;
                switch (i) {
                    case 0:
                        currArtifacts = [artifacts[0], artifacts[1]]; // Weltmuseum
                        break;
                    case 1:
                        currArtifacts = [artifacts[2], artifacts[3]]; // British Museum
                        break;
                    case 2:
                        currArtifacts = [artifacts[4], artifacts[5]]; // Tower of London
                        break;
                }
                currArtifact = currArtifacts[0];
                currArtifact.setPosition();
                atMuseum = true;
            }
        } else {
            fill(200);
        }
    }
}

class Artifact {
    constructor(assetName) {
        this.assetName = assetName;
        this.name = artifactData[assetName].name;
        this.desc = artifactData[assetName].description;
        this.size = artifactData[assetName].size;
        this.slideshow = [];
        this.repatriated = false;
        this.img;
        this.bg;
    }

    setPosition() {
        if (this.repatriated) {
            currPos = createVector(homelandPos.x, homelandPos.y);
            goalPos = createVector(homelandPos.x, homelandPos.y);
        } else {
            currPos = createVector(museumPos.x, museumPos.y);
            goalPos = createVector(museumPos.x, museumPos.y);
        }
    }

    draw() {
        // Right side slideshow
        let slideshow = this.slideshow;
        // Get current and next images
        let currImg = slideshow[imgIndex];
        let nextImg = slideshow[(imgIndex + 1) % slideshow.length]; // Modulo allows for easy looping through image array
        // Draw each image with their respective opacity value
        tint(255, currImgOpacity);
        image(currImg, width / 2 + width / 4, height / 2);
        tint(255, nextImgOpacity);
        image(nextImg, width / 2 + width / 4, height / 2);
        // Decrease the current image's opacity and increase the next images opacity until they have completely faded in/out
        currImgOpacity -= SLIDESHOW_FADE_RATE;
        nextImgOpacity += SLIDESHOW_FADE_RATE;
        if (currImgOpacity <= 0) {
            imgIndex = (imgIndex + 1) % slideshow.length;
            currImgOpacity = 255;
            nextImgOpacity = 0;
        }

        // Left side museum image
        let museumImg = this.bg.get(MUSEUM_CROP_X, 0, width / 2, height);
        tint(255, 255);
        image(museumImg, width / 4, height / 2);

        // Description
        fill(0, 0, 0, 128);
        noStroke();
        rect(0, museumPos.y + 150, width / 2, height - (museumPos.y + 100));
        fill(255);
        textAlign(LEFT, TOP);
        textSize(16);
        text(this.desc, 10, museumPos.y + 160, width / 2 - 20);

        // Title
        stroke(0);
        strokeWeight(3);
        textSize(48);
        textAlign(CENTER, CENTER);
        text(this.name, width / 4, 70);

        // Shine effect
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

        // Artifact
        tint(255, artifactOpacity); // Apply opacity to the artifact
        currPos = p5.Vector.lerp(currPos, goalPos, LERP_RATE);
        image(this.img, currPos.x, currPos.y);
    }
}