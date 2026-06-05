// =============================================
// HAJI RUSH — Game Engine
// game.js — Golden Flow @goldenflow.id
// =============================================

const CONFIG = {
  GRAVITY: 0.6,
  JUMP_FORCE: -13,
  BASE_SPEED: 4,
  SPEED_INCREMENT: 0.001,
  GROUND_HEIGHT: 80,
  CHAR_WIDTH: 40,
  CHAR_HEIGHT: 55,
  OBSTACLE_WIDTH: 35,
  OBSTACLE_HEIGHT: 45,
  ZAMZAM_SIZE: 20,
  IHRAM_DECAY: 0.03,
  IHRAM_GAIN_ZAMZAM: 15,
  IHRAM_GAIN_CHECKPOINT: 30,
  CHECKPOINT_INTERVAL: 500, // meters
  FUNFACT_INTERVAL: 100,    // meters
  PHASE_DISTANCES: [700, 1500, 9999],
};

const PHASES = [
  { name: "🌙 Fase 1: Miqat", bg: "phase1", label: "Madinah - Masjid Nabawi" },
  { name: "🕌 Fase 2: Thawaf Road", bg: "phase2", label: "Mekkah - Masjidil Haram" },
  { name: "🌅 Fase 3: Arafah", bg: "phase3", label: "Padang Arafah - Wukuf" },
];

const CHECKPOINTS = [
  {
    id: "tawaf",
    icon: "🕋",
    title: "Checkpoint Tawaf!",
    desc: "Klik/tap Ka'bah 7 kali untuk mengelilinginya!",
    type: "tap",
    count: 7,
    doa: { ar: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ", latin: "Labbaik Allahumma Labbaik", arti: "Aku penuhi panggilan-Mu ya Allah" },
    reward: 1000
  },
  {
    id: "sai",
    icon: "🏃",
    title: "Checkpoint Sa'i!",
    desc: "Tap cepat 10x dalam 5 detik — Sa'i antara Shafa & Marwah!",
    type: "tap",
    count: 10,
    doa: { ar: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ", latin: "Innash-shafaa wal-marwata min sya'aa'irillah", arti: "Sesungguhnya Shafa dan Marwah adalah sebagian syiar Allah" },
    reward: 800
  },
  {
    id: "wukuf",
    icon: "🌅",
    title: "Checkpoint Wukuf!",
    desc: "Tahan Space/Tap selama 3 detik untuk berwukuf di Arafah",
    type: "hold",
    duration: 3000,
    doa: { ar: "لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ", latin: "La ilaha illallah wahdahu la syarikalah", arti: "Tiada Tuhan selain Allah, tiada sekutu bagi-Nya" },
    reward: 1200
  },
];

const FUN_FACTS = [
  "💧 Air Zamzam berasal dari telapak kaki Nabi Ismail AS!",
  "🕋 Ka'bah dibangun pertama kali oleh Nabi Adam AS",
  "🐪 Unta bisa minum hingga 100 liter sekaligus!",
  "🌙 Tawaf dilakukan 7 kali putaran berlawanan arah jarum jam",
  "👘 Ihram artinya melarang diri dari hal-hal yang dilarang saat haji",
  "🏔️ Bukit Shafa & Marwah kini ada di dalam Masjidil Haram",
  "⭐ Hajar Aswad adalah batu dari surga yang menjadi hitam karena dosa manusia",
  "🦅 Jarak Sa'i antara Shafa & Marwah adalah 394 meter",
  "🌅 Wukuf di Arafah adalah rukun haji yang paling utama!",
  "✂️ Tahalul = memotong rambut minimal 3 helai setelah haji",
  "🪨 Jumrah adalah melempar batu setan sebanyak 7 kali",
  "🕌 Masjidil Haram adalah masjid terbesar di dunia!",
  "🌍 Lebih dari 2 juta jamaah berhaji setiap tahunnya",
  "💫 Berjalan saat Sa'i hukumnya sunnah (tidak wajib berlari)",
  "📿 Talbiyah dibaca mulai dari miqat hingga melempar jumrah",
];

const DOAS = [
  { ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً", latin: "Rabbana atina fid-dunya hasanah", arti: "Ya Tuhan kami, berilah kami kebaikan di dunia..." },
  { ar: "اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي", latin: "Allahummaghfirli warhamni", arti: "Ya Allah, ampuni dan rahmatilah aku" },
  { ar: "بِسْمِ اللهِ تَوَكَّلْتُ عَلَى اللهِ", latin: "Bismillahi tawakkaltu 'alallah", arti: "Dengan nama Allah, aku bertawakkal kepada Allah" },
];

// =============================================
// GAME STATE
// =============================================
const state = {
  running: false, paused: false,
  phase: 0,
  score: 0, distance: 0, zamzam: 0,
  ihramMeter: 80,
  ihramFull: false, ihramFullTimer: 0,
  speed: CONFIG.BASE_SPEED,
  lives: 1,
  invincible: false, invincibleTimer: 0,
  nextCheckpoint: CONFIG.CHECKPOINT_INTERVAL,
  nextFunFact: CONFIG.FUNFACT_INTERVAL,
  checkpointIndex: 0,
  checkpointActive: false,
  obstacles: [], zamzams: [], particles: [],
  bgOffset: [0, 0, 0, 0],
  animFrame: 0,
  flashTimer: 0,
  shakeTimer: 0,
  playerY: 0, playerVY: 0,
  isOnGround: true,
  isSliding: false, slideTimer: 0,
  charFrame: 0, charFrameTimer: 0,
  spawnTimer: 0,
  totalRuns: parseInt(localStorage.getItem("hr_totalRuns") || "0"),
};

// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let W, H, GROUND_Y;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  GROUND_Y = H - CONFIG.GROUND_HEIGHT;
  state.playerY = GROUND_Y - CONFIG.CHAR_HEIGHT;
}
resize();
window.addEventListener("resize", resize);

// Player position
const PLAYER_X = 80;

// =============================================
// COLOR PALETTES PER PHASE
// =============================================
const PHASE_COLORS = [
  { // Fase 1: Madinah - Subuh
    sky: ["#0D1B35", "#1A2E6B", "#2E5AA0"],
    ground: "#8B6914",
    groundLine: "#A0782A",
    accent: "#4CAF50",
  },
  { // Fase 2: Mekkah - Dzuhur
    sky: ["#C27535", "#E8A020", "#F5C842"],
    ground: "#8B5E1A",
    groundLine: "#C4892E",
    accent: "#F5C842",
  },
  { // Fase 3: Arafah - Maghrib
    sky: ["#8B1A1A", "#C75522", "#FF8040"],
    ground: "#6B4010",
    groundLine: "#9B6525",
    accent: "#FF8040",
  }
];

// =============================================
// DRAW HELPERS
// =============================================
function drawBackground() {
  const p = PHASE_COLORS[state.phase];
  // Sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.7);
  p.sky.forEach((c, i) => skyGrad.addColorStop(i / (p.sky.length - 1), c));
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, H * 0.7);

  // Stars (phase 1 only)
  if (state.phase === 0) {
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    for (let i = 0; i < 30; i++) {
      const sx = ((i * 173 + state.bgOffset[0] * 0.1) % W);
      const sy = ((i * 97) % (H * 0.5));
      const ss = i % 3 === 0 ? 2 : 1;
      ctx.fillRect(sx, sy, ss, ss);
    }
  }

  // Moon/Sun
  if (state.phase === 0) {
    // Moon
    ctx.fillStyle = "#FFF8DC";
    ctx.beginPath();
    ctx.arc(W * 0.8, H * 0.15, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = PHASE_COLORS[0].sky[1];
    ctx.beginPath();
    ctx.arc(W * 0.8 + 10, H * 0.15 - 5, 18, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Sun
    const sunY = state.phase === 1 ? H * 0.12 : H * 0.3;
    const sunColor = state.phase === 1 ? "#FFF176" : "#FF6B35";
    ctx.fillStyle = sunColor;
    ctx.shadowColor = sunColor;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(W * 0.75, sunY, state.phase === 1 ? 28 : 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Silhouette buildings
  drawSilhouettes();

  // Ground
  ctx.fillStyle = p.ground;
  ctx.fillRect(0, GROUND_Y, W, CONFIG.GROUND_HEIGHT);
  ctx.fillStyle = p.groundLine;
  ctx.fillRect(0, GROUND_Y, W, 4);

  // Ground texture lines
  ctx.strokeStyle = "rgba(0,0,0,0.15)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const lx = ((state.bgOffset[0] * 1.2 + i * 120) % (W + 60)) - 60;
    ctx.beginPath();
    ctx.moveTo(lx, GROUND_Y + 20);
    ctx.lineTo(lx + 80, GROUND_Y + 20);
    ctx.stroke();
  }
}

function drawSilhouettes() {
  const offset = -state.bgOffset[1] * 0.3 % W;
  ctx.fillStyle = "rgba(0,0,0,0.4)";

  if (state.phase === 0) {
    // Masjid Nabawi dome
    drawMosque(offset + 100, GROUND_Y - 100, 80);
    drawMosque(offset + 350, GROUND_Y - 70, 55);
    drawMosque(offset + W * 0.6 + 50, GROUND_Y - 90, 65);
  } else if (state.phase === 1) {
    // Masjidil Haram + Ka'bah silhouette
    drawMosque(offset + 80, GROUND_Y - 130, 100);
    drawKaabahSilhouette(offset + 200, GROUND_Y - 90);
    drawMosque(offset + W * 0.5 + 100, GROUND_Y - 110, 85);
  } else {
    // Hills of Arafah
    ctx.beginPath();
    ctx.ellipse(offset + 150, GROUND_Y, 180, 80, 0, Math.PI, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(offset + W * 0.5 + 80, GROUND_Y, 200, 60, 0, Math.PI, 0);
    ctx.fill();
  }
}

function drawMosque(x, y, scale) {
  const s = scale / 80;
  ctx.save(); ctx.translate(x, y);
  // Dome
  ctx.beginPath();
  ctx.arc(0, 0, 40 * s, Math.PI, 0);
  ctx.lineTo(40 * s, 60 * s);
  ctx.lineTo(-40 * s, 60 * s);
  ctx.closePath();
  ctx.fill();
  // Minaret
  ctx.fillRect(-60 * s, -30 * s, 12 * s, 90 * s);
  ctx.fillRect(60 * s - 12 * s, -30 * s, 12 * s, 90 * s);
  // Crescent
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.beginPath();
  ctx.arc(-54 * s, -38 * s, 7 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawKaabahSilhouette(x, y) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(-25, -50, 50, 50);
  ctx.restore();
}

// =============================================
// DRAW PLAYER
// =============================================
function drawPlayer() {
  const x = PLAYER_X;
  const y = state.playerY;
  const w = CONFIG.CHAR_WIDTH;
  const h = CONFIG.CHAR_HEIGHT;

  ctx.save();
  // Ihram glow
  if (state.ihramFull || state.invincible) {
    ctx.shadowColor = "white";
    ctx.shadowBlur = 20 + Math.sin(Date.now() * 0.01) * 10;
  }

  // Body (white ihram)
  ctx.fillStyle = state.ihramFull ? "#FFFFFF" : "#F5F5F5";
  if (state.isSliding) {
    // Sliding pose
    ctx.fillRect(x, y + h * 0.5, w * 1.3, h * 0.4);
    ctx.fillStyle = "#FFCC80";
    ctx.fillRect(x + w * 0.9, y + h * 0.15, w * 0.35, w * 0.35);
  } else {
    // Standing/running pose
    ctx.fillRect(x, y + h * 0.2, w, h * 0.8);
    // Head
    ctx.fillStyle = "#FFCC80";
    ctx.fillRect(x + w * 0.15, y, w * 0.7, w * 0.7);
    // Ihram head wrap
    ctx.fillStyle = state.ihramFull ? "#FFFDE7" : "#EEEEEE";
    ctx.fillRect(x + w * 0.1, y, w * 0.8, w * 0.25);
  }

  // Running legs animation
  if (!state.isSliding && state.isOnGround) {
    const legOff = Math.sin(state.animFrame * 0.3) * 6;
    ctx.fillStyle = "#E0E0E0";
    ctx.fillRect(x + 5, y + h - 18, 12, 18 + legOff);
    ctx.fillRect(x + w - 17, y + h - 18, 12, 18 - legOff);
  }

  ctx.restore();
}

// =============================================
// DRAW OBSTACLES
// =============================================
function drawObstacles() {
  state.obstacles.forEach(obs => {
    ctx.save();
    if (obs.type === "rock") {
      // Boulder pixel style
      ctx.fillStyle = "#78909C";
      ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
      ctx.fillStyle = "#90A4AE";
      ctx.fillRect(obs.x + 4, obs.y + 4, obs.w - 12, 8);
      ctx.fillStyle = "#546E7A";
      ctx.fillRect(obs.x + 2, obs.y + obs.h - 8, obs.w - 4, 8);
    } else if (obs.type === "camel") {
      // Camel pixel art
      ctx.fillStyle = "#D4A96A";
      ctx.fillRect(obs.x + 10, obs.y, obs.w - 10, obs.h * 0.6);
      ctx.fillRect(obs.x, obs.y + obs.h * 0.1, obs.w, obs.h * 0.5);
      // Hump
      ctx.fillStyle = "#C4994A";
      ctx.beginPath();
      ctx.arc(obs.x + obs.w * 0.5, obs.y, 18, Math.PI, 0);
      ctx.fill();
      // Legs
      ctx.fillStyle = "#B8864A";
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(obs.x + 8 + i * 10, obs.y + obs.h * 0.55, 6, obs.h * 0.45);
      }
    } else if (obs.type === "crowd") {
      // Crowd of people
      ctx.fillStyle = "#FF8A65";
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(obs.x + i * 18, obs.y + 10, 14, obs.h - 10);
        ctx.fillStyle = "#FFCC80";
        ctx.fillRect(obs.x + i * 18 + 3, obs.y, 10, 12);
        ctx.fillStyle = "#EEEEEE";
      }
    }
    ctx.restore();
  });
}

// =============================================
// DRAW ZAMZAM
// =============================================
function drawZamzams() {
  state.zamzams.forEach(z => {
    const bounce = Math.sin(state.animFrame * 0.08 + z.phase) * 4;
    ctx.save();
    ctx.fillStyle = "#64B5F6";
    ctx.shadowColor = "#2196F3";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(z.x, z.y + bounce, CONFIG.ZAMZAM_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.beginPath();
    ctx.arc(z.x - 3, z.y + bounce - 4, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

// =============================================
// DRAW PARTICLES
// =============================================
function drawParticles() {
  state.particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.life / p.maxLife;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    ctx.restore();
  });
}

function spawnParticles(x, y, color, count) {
  for (let i = 0; i < count; i++) {
    state.particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6 - 2,
      color,
      size: Math.random() * 6 + 2,
      life: 30, maxLife: 30,
    });
  }
}

// =============================================
// SPAWN LOGIC
// =============================================
function spawnObstacle() {
  const types = ["rock", "rock", "camel", "crowd"];
  const type = types[Math.floor(Math.random() * types.length)];
  const isLow = type === "camel";
  const h = isLow ? 50 : CONFIG.OBSTACLE_HEIGHT;
  state.obstacles.push({
    x: W + 30,
    y: GROUND_Y - h,
    w: type === "camel" ? 55 : CONFIG.OBSTACLE_WIDTH,
    h,
    type,
    isCamel: isLow,
  });
}

function spawnZamzam() {
  const yPos = Math.random() < 0.5 ? GROUND_Y - 80 : GROUND_Y - 40;
  state.zamzams.push({
    x: W + 20,
    y: yPos,
    phase: Math.random() * Math.PI * 2,
  });
}

// =============================================
// COLLISION DETECTION
// =============================================
function checkCollisions() {
  if (state.invincible || state.ihramFull) return;

  const px = PLAYER_X;
  const py = state.playerY;
  const pw = CONFIG.CHAR_WIDTH - 8;
  const ph = state.isSliding ? CONFIG.CHAR_HEIGHT * 0.5 : CONFIG.CHAR_HEIGHT;
  const pBottom = state.isSliding ? py + CONFIG.CHAR_HEIGHT : py + ph;

  // Obstacles
  for (let i = state.obstacles.length - 1; i >= 0; i--) {
    const obs = state.obstacles[i];
    if (obs.isCamel && state.isSliding) continue;
    if (
      px + 4 < obs.x + obs.w &&
      px + pw > obs.x &&
      py + 4 < obs.y + obs.h &&
      pBottom > obs.y + 4
    ) {
      hitObstacle();
      state.obstacles.splice(i, 1);
      break;
    }
  }

  // Zamzam collection
  for (let i = state.zamzams.length - 1; i >= 0; i--) {
    const z = state.zamzams[i];
    const dx = px + pw / 2 - z.x;
    const dy = py + ph / 2 - z.y;
    if (Math.sqrt(dx * dx + dy * dy) < CONFIG.ZAMZAM_SIZE + 10) {
      collectZamzam(z.x, z.y);
      state.zamzams.splice(i, 1);
    }
  }
}

function hitObstacle() {
  state.lives--;
  state.ihramMeter = Math.max(0, state.ihramMeter - 30);
  state.invincible = true;
  state.invincibleTimer = 120;
  state.shakeTimer = 20;
  spawnParticles(PLAYER_X + 20, state.playerY + 20, "#FF5252", 12);
  document.getElementById("ihramBar").style.width = state.ihramMeter + "%";
  if (state.lives <= 0) {
    setTimeout(gameOver, 400);
  }
}

function collectZamzam(x, y) {
  state.zamzam++;
  state.score += 50;
  state.ihramMeter = Math.min(100, state.ihramMeter + CONFIG.IHRAM_GAIN_ZAMZAM);
  state.lives = Math.min(3, state.lives + 1);
  spawnParticles(x, y, "#64B5F6", 8);
  document.getElementById("zamzamDisplay").textContent = state.zamzam;
  document.getElementById("ihramBar").style.width = state.ihramMeter + "%";
}

// =============================================
// IHRAM METER
// =============================================
function updateIhramMeter() {
  if (state.ihramFull) {
    state.ihramFullTimer--;
    if (state.ihramFullTimer <= 0) {
      state.ihramFull = false;
      document.getElementById("ihramBar").classList.remove("ihram-glow");
    }
  } else {
    state.ihramMeter = Math.max(0, state.ihramMeter - CONFIG.IHRAM_DECAY);
    if (state.ihramMeter >= 100) {
      state.ihramFull = true;
      state.ihramFullTimer = 300; // 5 seconds
      document.getElementById("ihramBar").classList.add("ihram-glow");
    }
  }
  document.getElementById("ihramBar").style.width = state.ihramMeter + "%";
}

// =============================================
// CHECKPOINT SYSTEM
// =============================================
function triggerCheckpoint() {
  state.paused = true;
  state.checkpointActive = true;
  const cp = CHECKPOINTS[state.checkpointIndex % CHECKPOINTS.length];
  state.checkpointIndex++;

  document.getElementById("checkpointIcon").textContent = cp.icon;
  document.getElementById("checkpointTitle").textContent = cp.title;
  document.getElementById("checkpointDesc").textContent = cp.desc;
  document.getElementById("doaArabic").textContent = cp.doa.ar;
  document.getElementById("doaLatin").textContent = cp.doa.latin;
  document.getElementById("doaArti").textContent = cp.doa.arti;
  document.getElementById("doa-popup").classList.add("hidden");
  document.getElementById("cpDoneBtn").classList.add("hidden");
  document.getElementById("checkpointOverlay").classList.remove("hidden");

  const gameEl = document.getElementById("cpTimerFill");
  const gameArea = document.getElementById("cpGame");

  if (cp.type === "tap") {
    let tapCount = 0;
    const needed = cp.count;
    const gameArea2 = document.getElementById("checkpointGame");
    gameArea2.innerHTML = `<div id="cpProgress" style="font-size:2rem">0 / ${needed} 🕋</div>`;
    const timeLimit = cp.count === 7 ? 10000 : 5000;
    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += 100;
      document.getElementById("cpTimerFill").style.width = (1 - elapsed / timeLimit) * 100 + "%";
      if (elapsed >= timeLimit) {
        clearInterval(interval);
        showDoaAndFinish(cp);
      }
    }, 100);

    const handleTap = () => {
      tapCount++;
      spawnParticles(W / 2, H / 2, "#F5C842", 3);
      const el = document.getElementById("cpProgress");
      if (el) el.textContent = `${tapCount} / ${needed} 🕋`;
      if (tapCount >= needed) {
        clearInterval(interval);
        state.score += cp.reward;
        state.ihramMeter = Math.min(100, state.ihramMeter + CONFIG.IHRAM_GAIN_CHECKPOINT);
        showDoaAndFinish(cp);
      }
    };

    document.getElementById("checkpointOverlay").addEventListener("click", handleTap, { once: false });
    setTimeout(() => {
      document.getElementById("checkpointOverlay").removeEventListener("click", handleTap);
    }, timeLimit);
  } else if (cp.type === "hold") {
    const gameArea2 = document.getElementById("checkpointGame");
    gameArea2.innerHTML = `<div id="cpHoldMsg" style="font-size:1rem;color:#F5C842">Tahan SPACE atau TAP layar...</div>`;
    let holding = false, holdTime = 0;
    const holdNeeded = cp.duration;
    const holdInterval = setInterval(() => {
      if (holding) {
        holdTime += 100;
        document.getElementById("cpTimerFill").style.width = (holdTime / holdNeeded) * 100 + "%";
        const el = document.getElementById("cpHoldMsg");
        if (el) el.textContent = `${(holdTime / 1000).toFixed(1)}s / ${holdNeeded / 1000}s ✨`;
        if (holdTime >= holdNeeded) {
          clearInterval(holdInterval);
          state.score += cp.reward;
          state.ihramMeter = Math.min(100, state.ihramMeter + CONFIG.IHRAM_GAIN_CHECKPOINT);
          showDoaAndFinish(cp);
        }
      }
    }, 100);

    const keyDown = (e) => { if (e.code === "Space") { e.preventDefault(); holding = true; } };
    const keyUp = (e) => { if (e.code === "Space") holding = false; };
    const touchStart = () => { holding = true; };
    const touchEnd = () => { holding = false; };

    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);
    document.getElementById("checkpointOverlay").addEventListener("touchstart", touchStart);
    document.getElementById("checkpointOverlay").addEventListener("touchend", touchEnd);

    setTimeout(() => {
      clearInterval(holdInterval);
      document.removeEventListener("keydown", keyDown);
      document.removeEventListener("keyup", keyUp);
      showDoaAndFinish(cp);
    }, 12000);
  }
}

function showDoaAndFinish(cp) {
  document.getElementById("doa-popup").classList.remove("hidden");
  document.getElementById("cpDoneBtn").classList.remove("hidden");
  document.getElementById("checkpointGame").innerHTML = "";
  document.getElementById("cpDoneBtn").onclick = () => {
    document.getElementById("checkpointOverlay").classList.add("hidden");
    state.paused = false;
    state.checkpointActive = false;
  };
}

// =============================================
// FUN FACT TOAST
// =============================================
function showFunFact() {
  const fact = FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];
  const toast = document.getElementById("funfactToast");
  document.getElementById("funfactText").textContent = fact;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 3200);
}

// =============================================
// PHASE TRANSITION
// =============================================
function checkPhaseTransition() {
  const nextPhase = PHASES.findIndex((_, i) => state.distance < CONFIG.PHASE_DISTANCES[i]);
  const newPhase = nextPhase === -1 ? PHASES.length - 1 : nextPhase;
  if (newPhase !== state.phase) {
    state.phase = newPhase;
    document.getElementById("phaseLabel").textContent = PHASES[state.phase].name;
    state.speed = CONFIG.BASE_SPEED + state.phase * 1.5;
  }
}

// =============================================
// MAIN GAME LOOP
// =============================================
function gameLoop() {
  if (!state.running) return;

  state.animFrame++;

  if (!state.paused) {
    // Speed up
    state.speed += CONFIG.SPEED_INCREMENT;

    // Distance
    state.distance += state.speed / 10;
    state.score += Math.floor(state.speed / 4);

    // Update HUD
    document.getElementById("scoreDisplay").textContent = Math.floor(state.score);
    document.getElementById("distDisplay").textContent = Math.floor(state.distance);

    // Phase check
    checkPhaseTransition();

    // Checkpoint trigger
    if (state.distance >= state.nextCheckpoint) {
      state.nextCheckpoint += CONFIG.CHECKPOINT_INTERVAL;
      triggerCheckpoint();
    }

    // Fun fact trigger
    if (state.distance >= state.nextFunFact) {
      state.nextFunFact += CONFIG.FUNFACT_INTERVAL;
      showFunFact();
    }

    // Player physics
    if (!state.isOnGround) {
      state.playerVY += CONFIG.GRAVITY;
      state.playerY += state.playerVY;
      if (state.playerY >= GROUND_Y - CONFIG.CHAR_HEIGHT) {
        state.playerY = GROUND_Y - CONFIG.CHAR_HEIGHT;
        state.playerVY = 0;
        state.isOnGround = true;
      }
    }

    // Slide timer
    if (state.isSliding) {
      state.slideTimer--;
      if (state.slideTimer <= 0) state.isSliding = false;
    }

    // Invincible timer
    if (state.invincible) {
      state.invincibleTimer--;
      if (state.invincibleTimer <= 0) state.invincible = false;
    }

    // Spawn obstacles
    state.spawnTimer++;
    const spawnInterval = Math.max(40, 90 - state.distance * 0.02);
    if (state.spawnTimer >= spawnInterval) {
      state.spawnTimer = 0;
      if (Math.random() < 0.8) spawnObstacle();
      if (Math.random() < 0.4) spawnZamzam();
    }

    // Move obstacles & zamzams
    state.obstacles.forEach(o => o.x -= state.speed);
    state.zamzams.forEach(z => z.x -= state.speed);
    state.obstacles = state.obstacles.filter(o => o.x > -100);
    state.zamzams = state.zamzams.filter(z => z.x > -50);

    // Move bg
    state.bgOffset[0] += state.speed;
    state.bgOffset[1] += state.speed * 0.5;

    // Update particles
    state.particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.2;
      p.life--;
    });
    state.particles = state.particles.filter(p => p.life > 0);

    // Ihram meter
    updateIhramMeter();

    // Shake
    if (state.shakeTimer > 0) state.shakeTimer--;

    // Collisions
    checkCollisions();
  }

  // RENDER
  ctx.save();
  if (state.shakeTimer > 0) {
    ctx.translate(
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 8
    );
  }

  drawBackground();
  drawParticles();
  drawZamzams();
  drawObstacles();
  if (state.invincible && state.animFrame % 6 < 3) {
    // Flash when invincible
  } else {
    drawPlayer();
  }

  ctx.restore();

  requestAnimationFrame(gameLoop);
}

// =============================================
// INPUT HANDLING
// =============================================
function jump() {
  if (state.isOnGround && !state.checkpointActive) {
    state.isOnGround = false;
    state.playerVY = CONFIG.JUMP_FORCE;
    spawnParticles(PLAYER_X + 20, state.playerY + CONFIG.CHAR_HEIGHT, "#F5C842", 4);
  }
}

function slide() {
  if (state.isOnGround && !state.isSliding) {
    state.isSliding = true;
    state.slideTimer = 40;
  }
}

document.addEventListener("keydown", (e) => {
  if (!state.running || state.paused) return;
  if (e.code === "Space" || e.code === "ArrowUp") { e.preventDefault(); jump(); }
  if (e.code === "ArrowDown") { e.preventDefault(); slide(); }
});

// Touch controls
let touchStartY = 0;
document.addEventListener("touchstart", (e) => {
  if (!state.running || state.paused || state.checkpointActive) return;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener("touchend", (e) => {
  if (!state.running || state.paused || state.checkpointActive) return;
  const diff = touchStartY - e.changedTouches[0].clientY;
  if (diff > 20) jump();
  else if (diff < -20) slide();
  else jump();
}, { passive: true });

document.getElementById("gameArea").addEventListener("click", (e) => {
  if (state.paused || state.checkpointActive) return;
  jump();
});

// Pause
document.getElementById("pauseBtn").addEventListener("click", (e) => {
  e.stopPropagation();
  state.paused = !state.paused;
  document.getElementById("pauseBtn").textContent = state.paused ? "▶" : "⏸";
});

// =============================================
// GAME START / OVER
// =============================================
function startGame() {
  // Reset state
  state.running = true; state.paused = false;
  state.phase = 0; state.score = 0; state.distance = 0; state.zamzam = 0;
  state.ihramMeter = 80; state.ihramFull = false; state.ihramFullTimer = 0;
  state.speed = CONFIG.BASE_SPEED; state.lives = 1;
  state.invincible = false; state.invincibleTimer = 0;
  state.nextCheckpoint = CONFIG.CHECKPOINT_INTERVAL;
  state.nextFunFact = CONFIG.FUNFACT_INTERVAL;
  state.checkpointIndex = 0; state.checkpointActive = false;
  state.obstacles = []; state.zamzams = []; state.particles = [];
  state.bgOffset = [0, 0, 0, 0];
  state.animFrame = 0; state.shakeTimer = 0;
  state.playerY = GROUND_Y - CONFIG.CHAR_HEIGHT;
  state.playerVY = 0; state.isOnGround = true;
  state.isSliding = false; state.slideTimer = 0;
  state.spawnTimer = 0;

  // Update HUD
  document.getElementById("phaseLabel").textContent = PHASES[0].name;
  document.getElementById("scoreDisplay").textContent = "0";
  document.getElementById("distDisplay").textContent = "0";
  document.getElementById("zamzamDisplay").textContent = "0";
  document.getElementById("ihramBar").style.width = "80%";
  document.getElementById("ihramBar").classList.remove("ihram-glow");

  // Show game, hide others
  document.getElementById("mainMenu").classList.add("hidden");
  document.getElementById("gameOverScreen").classList.add("hidden");
  document.getElementById("gameArea").classList.remove("hidden");
  document.getElementById("checkpointOverlay").classList.add("hidden");
  document.getElementById("funfactToast").classList.add("hidden");
  document.getElementById("pauseBtn").textContent = "⏸";

  state.totalRuns++;
  localStorage.setItem("hr_totalRuns", state.totalRuns);

  gameLoop();
}

function gameOver() {
  state.running = false;

  const score = Math.floor(state.score);
  const dist = Math.floor(state.distance);
  const bestScore = parseInt(localStorage.getItem("hr_bestScore") || "0");
  const isNewRecord = score > bestScore;

  if (isNewRecord) {
    localStorage.setItem("hr_bestScore", score);
    document.getElementById("newRecordBanner").classList.remove("hidden");
  } else {
    document.getElementById("newRecordBanner").classList.add("hidden");
  }

  document.getElementById("goScore").textContent = score;
  document.getElementById("goDist").textContent = dist;
  document.getElementById("goZamzam").textContent = state.zamzam;

  // WA share
  const playerName = localStorage.getItem("hr_playerName") || "Jamaah";
  const waMsg = encodeURIComponent(
    `🕋 Aku baru main Haji Rush!\n` +
    `Nama: ${playerName}\n` +
    `Skor: ${score} | Jarak: ${dist}m | Zamzam: ${state.zamzam}\n\n` +
    `Mau info Umroh & Haji? Hubungi Golden Flow:\n` +
    `📱 +62 895-3224-12300\n` +
    `📸 @goldenflow.id`
  );
  document.getElementById("waShareBtn").href = `https://wa.me/?text=${waMsg}`;

  document.getElementById("gameArea").classList.add("hidden");
  document.getElementById("gameOverScreen").classList.remove("hidden");

  // Save to Google Sheets
  if (typeof saveToSheets === "function") {
    saveToSheets(playerName, score, dist, state.zamzam);
  }

  // Update menu
  document.getElementById("menuBestScore").textContent = Math.max(score, bestScore);
}

// =============================================
// UI EVENT LISTENERS
// =============================================
document.getElementById("retryBtn").addEventListener("click", startGame);
document.getElementById("menuBtn").addEventListener("click", () => {
  document.getElementById("gameOverScreen").classList.add("hidden");
  document.getElementById("mainMenu").classList.remove("hidden");
});
document.getElementById("playBtn").addEventListener("click", startGame);
document.getElementById("howToBtn").addEventListener("click", () => {
  document.getElementById("howToModal").classList.remove("hidden");
});
document.getElementById("leaderboardBtn").addEventListener("click", () => {
  document.getElementById("leaderboardModal").classList.remove("hidden");
  loadLeaderboard();
});

function loadLeaderboard() {
  const el = document.getElementById("leaderboardList");
  el.innerHTML = "<div class='lb-loading'>Memuat leaderboard...</div>";
  if (typeof fetchLeaderboard === "function") {
    fetchLeaderboard().then(data => {
      if (!data || data.length === 0) {
        el.innerHTML = "<div class='lb-loading'>Belum ada data. Jadilah yang pertama! 🕋</div>";
        return;
      }
      el.innerHTML = "";
      data.slice(0, 15).forEach((row, i) => {
        const entry = document.createElement("div");
        entry.className = "lb-entry";
        const medals = ["🥇", "🥈", "🥉"];
        entry.innerHTML = `
          <span class="lb-rank">${medals[i] || (i + 1)}</span>
          <span class="lb-name">${row.name || "Jamaah"}</span>
          <span class="lb-score">${row.score || 0}</span>
        `;
        el.appendChild(entry);
      });
    }).catch(() => {
      el.innerHTML = "<div class='lb-loading'>Gagal memuat. Cek koneksi internet.</div>";
    });
  } else {
    el.innerHTML = "<div class='lb-loading'>Setup Google Sheets untuk melihat leaderboard!</div>";
  }
}

// =============================================
// LOGIN / AUTH SYSTEM
// =============================================
function initAuth() {
  const storedName = localStorage.getItem("hr_playerName");
  if (storedName) {
    showWelcomeBack(storedName);
  } else {
    document.getElementById("loginModal").classList.remove("hidden");
  }
}

function showWelcomeBack(name) {
  document.getElementById("loginModal").classList.add("hidden");
  const best = localStorage.getItem("hr_bestScore") || "0";
  const runs = localStorage.getItem("hr_totalRuns") || "0";
  document.getElementById("welcomeName").textContent = `Assalamu'alaikum, ${name}!`;
  document.getElementById("wbBestScore").textContent = best;
  document.getElementById("wbRuns").textContent = runs;
  document.getElementById("welcomeBack").classList.remove("hidden");
  document.getElementById("menuPlayerName").textContent = name;
  document.getElementById("menuBestScore").textContent = best;
}

document.getElementById("startLoginBtn").addEventListener("click", () => {
  const name = document.getElementById("playerName").value.trim();
  const email = document.getElementById("playerEmail").value.trim();
  if (!name) {
    document.getElementById("playerName").style.borderColor = "#FF5252";
    document.getElementById("playerName").placeholder = "Wajib diisi!";
    return;
  }
  localStorage.setItem("hr_playerName", name);
  if (email) localStorage.setItem("hr_playerEmail", email);

  document.getElementById("loginModal").classList.add("hidden");
  document.getElementById("menuPlayerName").textContent = name;
  document.getElementById("menuBestScore").textContent = localStorage.getItem("hr_bestScore") || "0";
  document.getElementById("mainMenu").classList.remove("hidden");

  if (typeof registerPlayer === "function") {
    registerPlayer(name, email);
  }
});

document.getElementById("playerName").addEventListener("keypress", (e) => {
  if (e.key === "Enter") document.getElementById("startLoginBtn").click();
});

document.getElementById("continueBtn").addEventListener("click", () => {
  document.getElementById("welcomeBack").classList.add("hidden");
  document.getElementById("mainMenu").classList.remove("hidden");
});

document.getElementById("changeUserBtn").addEventListener("click", () => {
  localStorage.removeItem("hr_playerName");
  localStorage.removeItem("hr_playerEmail");
  document.getElementById("welcomeBack").classList.add("hidden");
  document.getElementById("loginModal").classList.remove("hidden");
  document.getElementById("playerName").value = "";
  document.getElementById("playerEmail").value = "";
});

// Init
window.addEventListener("load", initAuth);
