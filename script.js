const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = (Math.random() - 0.5);
    this.speedY = (Math.random() - 0.5);
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.fillStyle = '#00ff88';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
for (let i = 0; i < 100; i++) {
  particles.push(new Particle());
}
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const bgMusic = document.getElementById('bgMusic');
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const audioSource = audioCtx.createMediaElementSource(bgMusic);
const analyser = audioCtx.createAnalyser();
audioSource.connect(analyser);
analyser.connect(audioCtx.destination);
analyser.fftSize = 64;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
const bars = document.querySelectorAll('#musicVisualizer .music-bar');

function animateBars() {
  requestAnimationFrame(animateBars);
  analyser.getByteFrequencyData(dataArray);
  for (let i = 0; i < bars.length; i++) {
    const height = Math.max(4, dataArray[i] / 12);
    bars[i].style.height = height + 'px';
  }
}
animateBars();

const entryOverlay = document.getElementById('entryOverlay');
const bgVideo = document.getElementById('bgVideo');

entryOverlay.addEventListener('click', () => {
  entryOverlay.classList.add('hidden');

  // Start video playback
  bgVideo.play().catch(() => {
    console.log("Video playback failed. User interaction needed.");
  });

  // Start music
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  bgMusic.play();
});
