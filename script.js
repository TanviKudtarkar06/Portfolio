// Tanvi.exe — playful portfolio interactions. No dependencies required.
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const words = ["ideas", "experiments", "tiny wins", "cool things"];
let wordIndex = 0;
setInterval(() => {
  const el = $("#rotating-word");
  if (!el) return;
  el.style.opacity = "0";
  setTimeout(() => {
    wordIndex = (wordIndex + 1) % words.length;
    el.textContent = words[wordIndex];
    el.style.opacity = "1";
  }, 220);
}, 2300);

const cursorGlow = $("#cursor-glow");
window.addEventListener("pointermove", event => {
  if (!cursorGlow) return;
  cursorGlow.style.left = `${event.clientX - 140}px`;
  cursorGlow.style.top = `${event.clientY - 140}px`;
});

const canvas = $("#circuit-canvas");
const ctx = canvas.getContext("2d");
let width = 0, height = 0, dpr = 1, nodes = [];
function resizeCanvas() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth; height = window.innerHeight;
  canvas.width = width * dpr; canvas.height = height * dpr;
  canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  nodes = Array.from({length: Math.min(55, Math.floor(width / 22))}, () => ({
    x: Math.random() * width, y: Math.random() * height,
    vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22,
    r: Math.random() * 1.6 + .5, phase: Math.random() * 6
  }));
}
function drawCircuit() {
  ctx.clearRect(0, 0, width, height);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  nodes.forEach((n, i) => {
    if (!reduced) { n.x += n.vx; n.y += n.vy; }
    if (n.x < 0 || n.x > width) n.vx *= -1;
    if (n.y < 0 || n.y > height) n.vy *= -1;
    const pulse = .25 + (Math.sin(Date.now() * .001 + n.phase) + 1) * .24;
    ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(77, 220, 255, ${pulse})`; ctx.fill();
    for (let j = i + 1; j < nodes.length; j++) {
      const m = nodes[j], dx = n.x - m.x, dy = n.y - m.y, dist = Math.hypot(dx, dy);
      if (dist < 105) {
        ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = `rgba(66, 133, 255, ${(1 - dist / 105) * .16})`;
        ctx.lineWidth = .7; ctx.stroke();
      }
    }
  });
  requestAnimationFrame(drawCircuit);
}
resizeCanvas(); drawCircuit();
window.addEventListener("resize", resizeCanvas);

const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add("visible"); revealObserver.unobserve(entry.target); }
}), {threshold: .12});
$$(".reveal").forEach(el => revealObserver.observe(el));

const contributionGrid = $("#contribution-grid");
for (let i = 0; i < 91; i++) {
  const cell = document.createElement("i");
  const value = Math.random() > .68 ? Math.ceil(Math.random() * 4) : 0;
  cell.dataset.level = value;
  cell.title = "Decorative demo cell";
  contributionGrid.appendChild(cell);
}
let commits = 0;
const commitCount = $("#commit-count");
const winCount = $("#win-count");
function tinyWin() {
  commits++;
  commitCount.textContent = commits.toString();
  winCount.textContent = commits.toString();
  showToast(["Tiny win logged. Keep going ✨", "One more for the lore 💾", "Progress is progress 🌱"][commits % 3]);
}
setTimeout(() => {
  const start = Date.now();
  const timer = setInterval(() => {
    const value = Math.min(1234, Math.floor((Date.now() - start) / 4));
    if (commitCount && commits === 0) commitCount.textContent = value.toLocaleString();
    if (value >= 1234 || commits > 0) clearInterval(timer);
  }, 40);
}, 300);

const waveform = $("#waveform");
for (let i = 0; i < 25; i++) {
  const bar = document.createElement("i");
  bar.style.setProperty("--h", `${5 + Math.random() * 15}px`);
  waveform.appendChild(bar);
}
const musicPanel = $(".music-panel");
let playing = false, progress = 39, seconds = 87;
function updatePlay() {
  musicPanel.classList.toggle("is-playing", playing);
  $("#play-toggle").textContent = playing ? "Ⅱ" : "▶";
  $("#progress-fill").style.width = `${progress}%`;
}
$("#play-toggle").addEventListener("click", () => { playing = !playing; updatePlay(); showToast(playing ? "Visualizer on — no audio, just vibes ♫" : "Visualizer paused."); });
$("#prev-track").addEventListener("click", () => { progress = 8; seconds = 18; updateTime(); showToast("Rewound the imaginary playlist ↶"); });
$("#next-track").addEventListener("click", () => { progress = 57; seconds = 126; updateTime(); showToast("Next track: Neon Daydream ✦"); });
function updateTime() {
  $("#progress-fill").style.width = `${progress}%`;
  $("#track-time").textContent = `${String(Math.floor(seconds / 60)).padStart(2,"0")}:${String(seconds % 60).padStart(2,"0")}`;
}
setInterval(() => { if (playing) { progress = progress >= 99 ? 0 : progress + .18; seconds = seconds >= 222 ? 0 : seconds + 1; updateTime(); } }, 1000);

const terminalForm = $("#terminal-form");
const terminalInput = $("#terminal-input");
const terminalResponse = $("#terminal-response");
const commandMap = {
  help: "Available commands: help, about, skills, projects, clear, coffee",
  about: "Tanvi.exe — curious developer, currently leveling up 🌱",
  skills: "Python · JavaScript · React · AI/ML · Git (edit this to match your real stack)",
  projects: "NaviNFC · Meeting Summarizer · EventHub — sample project cards",
  coffee: "☕ Brewing clean code... please wait 3-5 business commits.",
  clear: ""
};
terminalForm.addEventListener("submit", event => {
  event.preventDefault();
  const command = terminalInput.value.trim().toLowerCase();
  if (!command) return;
  if (command === "clear") terminalResponse.textContent = "";
  else terminalResponse.textContent = commandMap[command] || `Command not found: "${command}". Type help for a list of commands.`;
  terminalInput.value = "";
});
$("#terminal-focus").addEventListener("click", () => { $("#terminal-panel").scrollIntoView({behavior:"smooth", block:"center"}); setTimeout(() => terminalInput.focus(), 450); });

const toast = $("#toast");
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}
$("#glitch-button").addEventListener("click", () => {
  document.body.classList.remove("glitch-mode");
  void document.body.offsetWidth;
  document.body.classList.add("glitch-mode");
  showToast("SYSTEM WOBBLE DETECTED // all good ✦");
});
const palettes = [
  ["#54eaff", "#f174ff", "#9d78ff"],
  ["#72ffc8", "#55aaff", "#ffdc72"],
  ["#ff8ccf", "#8d9bff", "#6fffe9"],
  ["#c7ff6b", "#ff9d66", "#b08bff"]
];
let paletteIndex = 0;
$("#color-button").addEventListener("click", () => {
  paletteIndex = (paletteIndex + 1) % palettes.length;
  document.documentElement.style.setProperty("--cyan", palettes[paletteIndex][0]);
  document.documentElement.style.setProperty("--pink", palettes[paletteIndex][1]);
  document.documentElement.style.setProperty("--purple", palettes[paletteIndex][2]);
  showToast(`Neon palette ${paletteIndex + 1}/${palettes.length} loaded.`);
});
$("#spark-button").addEventListener("click", () => {
  const colors = ["#54eaff", "#f174ff", "#9d78ff", "#54f5bf", "#ffffff"];
  for (let i = 0; i < 36; i++) {
    const spark = document.createElement("span");
    spark.textContent = Math.random() > .5 ? "✦" : "·";
    spark.style.cssText = `position:fixed;left:${Math.random()*100}vw;top:${Math.random()*85+5}vh;z-index:40;pointer-events:none;color:${colors[Math.floor(Math.random()*colors.length)]};font-size:${10+Math.random()*20}px;text-shadow:0 0 12px currentColor;transition:transform 1s ease-out,opacity 1s ease-out`;
    document.body.appendChild(spark);
    requestAnimationFrame(() => { spark.style.transform = `translate(${(Math.random()-.5)*150}px,${(Math.random()-.5)*160}px) rotate(${Math.random()*220}deg)`; spark.style.opacity = "0"; });
    setTimeout(() => spark.remove(), 1100);
  }
  showToast("Digital confetti deployed ✨");
});
$("#counter-button").addEventListener("click", tinyWin);

$("#theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  showToast(document.body.classList.contains("light-mode") ? "Daylight mode enabled ☀" : "Neon night mode restored ◐");
});
$("#sound-toggle").addEventListener("click", () => {
  playing = !playing; updatePlay();
  showToast(playing ? "Ambient visualizer enabled ♫ (silent demo)" : "Ambient visualizer paused.");
});
$("#menu-toggle").addEventListener("click", () => $(".nav-links").classList.toggle("open"));
$$(".nav-links a").forEach(link => link.addEventListener("click", () => $(".nav-links").classList.remove("open")));
$(".panel-minimize").addEventListener("click", () => {
  const body = $("#terminal-body");
  body.hidden = !body.hidden;
  $(".panel-minimize").textContent = body.hidden ? "+" : "−";
});
$$(".project-card").forEach(card => {
  card.addEventListener("pointermove", event => {
    if (window.innerWidth < 800 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    card.style.transform = `perspective(900px) rotateY(${x*5}deg) rotateX(${-y*5}deg) translateY(-3px)`;
  });
  card.addEventListener("pointerleave", () => { card.style.transform = ""; });
});
