// Get page elements
const audioEl = document.getElementById('mainAudio');
const coverArt = document.getElementById('coverArt');
const trackTitle = document.getElementById('trackTitle');
const visualizer = document.getElementById('visualizer');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// ✅ INSTANT WORKING LINKS — no waiting for Pages
const playlist = [
    {
        title: "0 - THE SICK TEAM MINI ALUM MIX",
        src: "https://raw.githubusercontent.com/Architect-Marco/wkor-radio-player/main/media/0 - THE SICK TEAM MINI ALUM MIX - intro.mp3",
        cover: "https://raw.githubusercontent.com/Architect-Marco/wkor-radio-player/main/media/0 - THE SICK TEAM MINI ALUM MIX - cover art.png"
    },
    {
        title: "1 - I CAN'T LET THIS FEELING GO (Original Mix)",
        src: "https://raw.githubusercontent.com/Architect-Marco/wkor-radio-player/main/media/1 - I CANT LET THIS FEELING GO - FEAT LEXI CON (Original Mix).mp3",
        cover: "https://raw.githubusercontent.com/Architect-Marco/wkor-radio-player/main/media/1 - I CANT LET THIS FEELING GO - FEAT LEXI CON (Cover Art).png"
    },
    {
        title: "2 - THIS IS US - Version 1",
        src: "https://raw.githubusercontent.com/Architect-Marco/wkor-radio-player/main/media/2 - THIS IS US - THE SICK TEAM FT LEIX CON 1.mp3",
        cover: "https://raw.githubusercontent.com/Architect-Marco/wkor-radio-player/main/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png"
    },
    {
        title: "3 - THIS IS US - Version 2",
        src: "https://raw.githubusercontent.com/Architect-Marco/wkor-radio-player/main/media/3 - THIS IS US - THE SICK TEAM FT LEIX CON 2.mp3",
        cover: "https://raw.githubusercontent.com/Architect-Marco/wkor-radio-player/main/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png"
    },
    {
        title: "4 - ROCK THIS BEATS - Version 1",
        src: "https://raw.githubusercontent.com/Architect-Marco/wkor-radio-player/main/media/4 - ROCK THIS BEATS - THE SICK TEAM FT LEXI CON 1.mp3",
        cover: "https://raw.githubusercontent.com/Architect-Marco/wkor-radio-player/main/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png"
    },
    {
        title: "5 - ROCK THIS BEATS - Version 2",
        src: "https://raw.githubusercontent.com/Architect-Marco/wkor-radio-player/main/media/5 - ROCK THIS BEATS - THE SICK TEAM FT LEXI CON 2.mp3",
        cover: "https://raw.githubusercontent.com/Architect-Marco/wkor-radio-player/main/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png"
    },
    {
        title: "6 - I CAN'T LET THIS FEELING GO - Remix 1",
        src: "https://raw.githubusercontent.com/Architect-Marco/wkor-radio-player/main/media/6 - I CANT LET THIS FEELING GO - REMIX - THE SICK TEAM FT LEXI CON 1.mp3",
        cover: "https://raw.githubusercontent.com/Architect-Marco/wkor-radio-player/main/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png"
    },
    {
        title: "7 - I CAN'T LET THIS FEELING GO - Remix 2",
        src: "https://raw.githubusercontent.com/Architect-Marco/wkor-radio-player/main/media/7 - I CANT LET THIS FEELING GO REMIX - THE SICK TEAM FT LEXI CON 2.mp3",
        cover: "https://raw.githubusercontent.com/Architect-Marco/wkor-radio-player/main/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png"
    },
    {
        title: "8 - YOU FEEL THE EMOTION - Version 1",
        src: "https://raw.githubusercontent.com/Architect-Marco/wkor-radio-player/main/media/8 - YOU FEEL THE EMOTION - THE SICK TEAM FT LEXI CON 1.mp3",
        cover: "https://raw.githubusercontent.com/Architect-Marco/wkor-radio-player/main/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png"
    },
    {
        title: "9 - YOU FEEL THE EMOTION - Version 2",
        src: "https://raw.githubusercontent.com/Architect-Marco/wkor-radio-player/main/media/9 - YOU FEEL THE EMOTION - THE SICK TEAM FT LEXI CON 2.mp3",
        cover: "https://raw.githubusercontent.com/Architect-Marco/wkor-radio-player/main/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png"
    },
    {
        title: "10 - REACH OUT - Version 1",
        src: "https://raw.githubusercontent.com/Architect-Marco/wkor-radio-player/main/media/10 - REACH OUT - THE SICK TEAM FT LEXI CON 1.mp3",
        cover: "https://raw.githubusercontent.com/Architect-Marco/wkor-radio-player/main/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png"
    },
    {
        title: "11 - REACH OUT - Version 2",
        src: "https://raw.githubusercontent.com/Architect-Marco/wkor-radio-player/main/media/11 - REACH OUT - THE SICK TEAM FT LEXI CON 2.mp3",
        cover: "https://raw.githubusercontent.com/Architect-Marco/wkor-radio-player/main/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png"
    }
];

let currentTrack = 0;
let isPlaying = false;
let audioCtx, analyser, dataArray;

// Build visualizer bars
for (let i = 0; i < 12; i++) {
    const bar = document.createElement('div');
    bar.className = "viz-bar w-1.5 bg-neonPink rounded-sm";
    bar.style.height = "10px";
    visualizer.appendChild(bar);
}

function loadTrack(index) {
    const track = playlist[index];
    audioEl.src = track.src;
    trackTitle.textContent = track.title;
    coverArt.src = track.cover;
    audioEl.load();
}

playBtn.addEventListener('click', async () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') await audioCtx.resume();

    if (!analyser) {
        const source = audioCtx.createMediaElementSource(audioEl);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        drawVisualizer();
    }

    if (isPlaying) {
        audioEl.pause();
        playBtn.textContent = "PLAY";
    } else {
        audioEl.play().catch(err => console.log("Play error:", err));
        playBtn.textContent = "PAUSE";
    }
    isPlaying = !isPlaying;
});

prevBtn.addEventListener('click', () => {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrack);
    if (isPlaying) audioEl.play().catch(() => {});
});

nextBtn.addEventListener('click', () => {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
    if (isPlaying) audioEl.play().catch(() => {});
});

audioEl.addEventListener('ended', () => nextBtn.click());

function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);
    if (!analyser) return;
    analyser.getByteFrequencyData(dataArray);
    const bars = visualizer.children;
    for (let i = 0; i < bars.length; i++) {
        bars[i].style.height = `${Math.max(10, dataArray[i] * 0.7)}px`;
    }
}

loadTrack(currentTrack);
