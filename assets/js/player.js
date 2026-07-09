
// Get page elements
const audioEl = document.getElementById('mainAudio');
const coverArt = document.getElementById('coverArt');
const trackTitle = document.getElementById('trackTitle');
const visualizer = document.getElementById('visualizer');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// ✅ EXACT FILES FROM YOUR FOLDER
const playlist = [
    {
        title: "0 - THE SICK TEAM MINI ALUM MIX",
        src: "assets/media/0 - THE SICK TEAM MINI ALUM MIX - intro.mp3",
        cover: "assets/media/0 - THE SICK TEAM MINI ALUM MIX - cover art.png"
    },
    {
        title: "1 - I CAN'T LET THIS FEELING GO (Original Mix)",
        src: "assets/media/1 - I CANT LET THIS FEELING GO - FEAT LEXI CON (Original Mix).mp3",
        cover: "assets/media/1 - I CANT LET THIS FEELING GO - FEAT LEXI CON (Cover Art).png"
    },
    {
        title: "2 - THIS IS US - Version 1",
        src: "assets/media/2 - THIS IS US - THE SICK TEAM FT LEIX CON 1.mp3",
        cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png"
    },
    {
        title: "3 - THIS IS US - Version 2",
        src: "assets/media/3 - THIS IS US - THE SICK TEAM FT LEIX CON 2.mp3",
        cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png"
    },
    {
        title: "4 - ROCK THIS BEATS - Version 1",
        src: "assets/media/4 - ROCK THIS BEATS - THE SICK TEAM FT LEXI CON 1.mp3",
        cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png"
    },
    {
        title: "5 - ROCK THIS BEATS - Version 2",
        src: "assets/media/5 - ROCK THIS BEATS - THE SICK TEAM FT LEXI CON 2.mp3",
        cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png"
    },
    {
        title: "6 - I CAN'T LET THIS FEELING GO - Remix 1",
        src: "assets/media/6 - I CANT LET THIS FEELING GO - REMIX - THE SICK TEAM FT LEXI CON 1.mp3",
        cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png"
    },
    {
        title: "7 - I CAN'T LET THIS FEELING GO - Remix 2",
        src: "assets/media/7 - I CANT LET THIS FEELING GO REMIX - THE SICK TEAM FT LEXI CON 2.mp3",
        cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png"
    },
    {
        title: "8 - YOU FEEL THE EMOTION - Version 1",
        src: "assets/media/8 - YOU FEEL THE EMOTION - THE SICK TEAM FT LEXI CON 1.mp3",
        cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png"
    },
    {
        title: "9 - YOU FEEL THE EMOTION - Version 2",
        src: "assets/media/9 - YOU FEEL THE EMOTION - THE SICK TEAM FT LEXI CON 2.mp3",
        cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png"
    },
    {
        title: "10 - REACH OUT - Version 1",
        src: "assets/media/10 - REACH OUT - THE SICK TEAM FT LEXI CON 1.mp3",
        cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png"
    },
    {
        title: "11 - REACH OUT - Version 2",
        src: "assets/media/11 - REACH OUT - THE SICK TEAM FT LEXI CON 2.mp3",
        cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png"
    }
];

let currentTrack = 0;
let isPlaying = false;
let audioCtx, analyser, dataArray;

// Build 12 visualizer bars
for (let i = 0; i < 12; i++) {
    const bar = document.createElement('div');
    bar.className = "viz-bar w-1.5 bg-neonPink rounded-sm";
    bar.style.height = "10px";
    visualizer.appendChild(bar);
}

// Load selected track
function loadTrack(index) {
    const track = playlist[index];
    audioEl.src = track.src;
    trackTitle.textContent = track.title;
    coverArt.src = track.cover;
    audioEl.load();
}

// Play / Pause toggle
playBtn.addEventListener('click', async () => {
    if (!audioCtx) await initAudioEngine();
    if (isPlaying) {
        audioEl.pause();
        playBtn.textContent = "PLAY";
    } else {
        audioEl.play();
        playBtn.textContent = "PAUSE";
    }
    isPlaying = !isPlaying;
});

// Previous track
prevBtn.addEventListener('click', () => {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrack);
    if (isPlaying) audioEl.play();
});

// Next track
nextBtn.addEventListener('click', () => {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
    if (isPlaying) audioEl.play();
});

// Auto-play next when track ends
audioEl.addEventListener('ended', () => {
    nextBtn.click();
});

// Audio visualizer setup
async function initAudioEngine() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaElementSource(audioEl);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    drawVisualizer();
}

// Animate visualizer bars
function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);
    if (!analyser) return;
    analyser.getByteFrequencyData(dataArray);
    const bars = visualizer.children;
    for (let i = 0; i < 12; i++) {
        const height = Math.max(10, dataArray[i] * 0.7);
        bars[i].style.height = `${height}px`;
    }
}

// Start with first track
loadTrack(currentTrack);
