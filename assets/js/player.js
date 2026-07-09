const audioEl = document.getElementById('mainAudio');
const coverArt = document.getElementById('coverArt');
const trackTitle = document.getElementById('trackTitle');
const visualizer = document.getElementById('visualizer');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Correct file paths
const playlist = [
    { title: "0 - THE SICK TEAM MINI ALUM MIX", src: "assets/media/0 - THE SICK TEAM MINI ALUM MIX - intro.mp3", cover: "assets/media/0 - THE SICK TEAM MINI ALUM MIX - cover art.png" },
    { title: "1 - I CAN'T LET THIS FEELING GO (Original Mix)", src: "assets/media/1 - I CANT LET THIS FEELING GO - FEAT LEXI CON (Original Mix).mp3", cover: "assets/media/1 - I CANT LET THIS FEELING GO - FEAT LEXI CON (Cover Art).png" },
    { title: "2 - THIS IS US - Version 1", src: "assets/media/2 - THIS IS US - THE SICK TEAM FT LEIX CON 1.mp3", cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png" },
    { title: "3 - THIS IS US - Version 2", src: "assets/media/3 - THIS IS US - THE SICK TEAM FT LEIX CON 2.mp3", cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png" },
    { title: "4 - ROCK THIS BEATS - Version 1", src: "assets/media/4 - ROCK THIS BEATS - THE SICK TEAM FT LEXI CON 1.mp3", cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png" },
    { title: "5 - ROCK THIS BEATS - Version 2", src: "assets/media/5 - ROCK THIS BEATS - THE SICK TEAM FT LEXI CON 2.mp3", cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png" },
    { title: "6 - I CAN'T LET THIS FEELING GO - Remix 1", src: "assets/media/6 - I CANT LET THIS FEELING GO - REMIX - THE SICK TEAM FT LEXI CON 1.mp3", cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png" },
    { title: "7 - I CAN'T LET THIS FEELING GO - Remix 2", src: "assets/media/7 - I CANT LET THIS FEELING GO REMIX - THE SICK TEAM FT LEXI CON 2.mp3", cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png" },
    { title: "8 - YOU FEEL THE EMOTION - Version 1", src: "assets/media/8 - YOU FEEL THE EMOTION - THE SICK TEAM FT LEXI CON 1.mp3", cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png" },
    { title: "9 - YOU FEEL THE EMOTION - Version 2", src: "assets/media/9 - YOU FEEL THE EMOTION - THE SICK TEAM FT LEXI CON 2.mp3", cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png" },
    { title: "10 - REACH OUT - Version 1", src: "assets/media/10 - REACH OUT - THE SICK TEAM FT LEXI CON 1.mp3", cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png" },
    { title: "11 - REACH OUT - Version 2", src: "assets/media/11 - REACH OUT - THE SICK TEAM FT LEXI CON 2.mp3", cover: "assets/media/2ND MINI ALBUM MAGAZINE - 2,3,4,5,6,7,8,9,10,11.png" }
];

let currentTrack = 0, isPlaying = false, audioCtx, analyser, dataArray;

// 24 bars, thinner, shorter height
for (let i = 0; i < 24; i++) {
    const bar = document.createElement('div');
    bar.className = "viz-bar w-0.8 bg-neonPink rounded-sm";
    bar.style.height = "5px";
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
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') await audioCtx.resume();
    if (!analyser) {
        const source = audioCtx.createMediaElementSource(audioEl);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 128;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        source.connect(analyser); analyser.connect(audioCtx.destination); drawVisualizer();
    }
    isPlaying ? (audioEl.pause(), playBtn.textContent = "PLAY") : (audioEl.play().catch(e => console.log("Play error:", e)), playBtn.textContent = "PAUSE");
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

// Max height locked at 45px — never hits the top
function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);
    if (!analyser) return;
    analyser.getByteFrequencyData(dataArray);
    const bars = visualizer.children;
    for (let i = 0; i < bars.length; i++) {
        const height = Math.min(45, Math.max(5, dataArray[i] * 0.35));
        bars[i].style.height = `${height}px`;
    }
}

loadTrack(0);
