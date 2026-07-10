/**
 * SOVEREIGN ENGINE V6.3.1 - PERFORMANCE CORE
 * ARCHITECT: MARCO (THE SICK TEAM)
 * UNIT: WKOR FLAGSHIP
 */

const audioEl = document.getElementById('sovereignAudio');
const coverArt = document.getElementById('coverArt');
const trackTitle = document.getElementById('trackTitle');
const visualizer = document.getElementById('waveVisualizer');
const lines = visualizer.querySelectorAll('.wave-line');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const playlist = [
    { title: "0 - THE SICK TEAM MINI ALBUM MIX", src: "assets/media/0 - THE SICK TEAM MINI ALUM MIX - intro.mp3", cover: "assets/media/0 - THE SICK TEAM MINI ALUM MIX - cover art.png" },
    { title: "1 - I CAN'T LET THIS FEELING GO", src: "assets/media/1 - I CANT LET THIS FEELING GO - FEAT LEXI CON (Original Mix).mp3", cover: "assets/media/1 - I CANT LET THIS FEELING GO - FEAT LEXI CON (Cover Art).png" },
    { title: "2 - THIS IS US - Version 1", src: "assets/media/2 - THIS IS US - THE SICK TEAM FT LEIX CON 1.mp3", cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png" },
    { title: "3 - THIS IS US - Version 2", src: "assets/media/3 - THIS IS US - THE SICK TEAM FT LEIX CON 2.mp3", cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png" },
    { title: "4 - ROCK THIS BEATS - Version 1", src: "assets/media/4 - ROCK THIS BEATS - THE SICK TEAM FT LEXI CON 1.mp3", cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png" },
    { title: "5 - ROCK THIS BEATS - Version 2", src: "assets/media/5 - ROCK THIS BEATS - THE SICK TEAM FT LEXI CON 2.mp3", cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png" },
    { title: "6 - I CAN'T LET THIS FEELING GO - Remix 1", src: "assets/media/6 - I CANT LET THIS FEELING GO - REMIX - THE SICK TEAM FT LEXI CON 1.mp3", cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png" },
    { title: "7 - I CAN'T LET THIS FEELING GO - Remix 2", src: "assets/media/7 - I CANT LET THIS FEELING GO REMIX - THE SICK TEAM FT LEXI CON 2.mp3", cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png" },
    { title: "8 - YOU FEEL THE EMOTION - Version 1", src: "assets/media/8 - YOU FEEL THE EMOTION - THE SICK TEAM FT LEXI CON 1.mp3", cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png" },
    { title: "9 - YOU FEEL THE EMOTION - Version 2", src: "assets/media/9 - YOU FEEL THE EMOTION - THE SICK TEAM FT LEIX CON 2.mp3", cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png" },
    { title: "10 - REACH OUT - Version 1", src: "assets/media/10 - REACH OUT - THE SICK TEAM FT LEXI CON 1.mp3", cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png" },
    { title: "11 - REACH OUT - Version 2", src: "assets/media/11 - REACH OUT - THE SICK TEAM FT LEXI CON 2.mp3", cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png" }
];

let currentTrack = 0;
let isPlaying = false;
let wasPlayingBeforeHide = false;

// PERFORMANCE SPECS
const FPS = 30;
const FRAME_INTERVAL = 1000 / FPS;
let lastFrameTime = 0;
let rafId = null;
let isVizPaused = false;

const phaseOffsets = Array.from(lines).map((_, i) => i * (Math.PI / 6));

function loadTrack(index) {
    const track = playlist[index];
    audioEl.src = track.src;
    trackTitle.textContent = track.title;
    coverArt.src = track.cover;
    audioEl.load();
}

function renderFrame(timestamp) {
    if (isVizPaused || !isPlaying) return;
    rafId = requestAnimationFrame(renderFrame);

    const elapsed = timestamp - lastFrameTime;
    if (elapsed < FRAME_INTERVAL) return;
    lastFrameTime = timestamp - (elapsed % FRAME_INTERVAL);

    const t = timestamp / 350;
    lines.forEach((line, i) => {
        const scale = 0.2 + 0.8 * Math.abs(Math.sin(t + phaseOffsets[i]));
        line.style.transform = `scaleY(${scale.toFixed(3)})`;
    });
}

function startVisualizer() {
    if (rafId !== null) return;
    isVizPaused = false;
    lastFrameTime = performance.now();
    rafId = requestAnimationFrame(renderFrame);
}

function stopVisualizer() {
    isVizPaused = true;
    if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
    lines.forEach(line => line.style.transform = 'scaleY(0.2)');
}

// INTERFACE LISTENERS
playBtn.addEventListener('click', () => {
    if (isPlaying) {
        audioEl.pause();
        playBtn.textContent = "PLAY";
        stopVisualizer();
    } else {
        audioEl.play().catch(e => console.log(e));
        playBtn.textContent = "PAUSE";
        startVisualizer();
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

// VISIBILITY SYNC CORE
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        wasPlayingBeforeHide = isPlaying;
        if (isPlaying) {
            audioEl.pause();
            stopVisualizer();
            visualizer.classList.add('paused');
        }
    } else {
        if (wasPlayingBeforeHide) {
            audioEl.play().then(() => {
                startVisualizer();
                visualizer.classList.remove('paused');
            }).catch(() => {});
        }
    }
});

// INITIALIZE
loadTrack(0);
