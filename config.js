/*
Constants for the main program
*/

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
const MARKER_SIZE = 50; // Actual size of marker image
const MARKER_WIDTH = 10; // Width of hoverable area
const MARKER_HEIGHT = 25; // Height of hoverable area
const LABEL_OFFSET = 30; // Y offset of marker label text