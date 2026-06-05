// =============================================
// HAJI RUSH — Google Sheets Integration
// gsheets.js — Golden Flow @goldenflow.id
// =============================================
//
// SETUP INSTRUKSI:
// 1. Buka Google Sheets baru
// 2. Extensions → Apps Script
// 3. Copy kode di bagian bawah file ini ke editor Apps Script
// 4. Deploy → New Deployment → Web App
//    - Execute as: Me
//    - Access: Anyone
// 5. Copy URL Web App
// 6. Paste ke variabel GAS_URL di bawah ini
// 7. Simpan dan upload ke GitHub
//
// =============================================

const GAS_URL = "https://script.google.com/macros/s/AKfycbzLfkA2mM4p7Z7sVhSyKbT3KodNOE2QgxsErnJbReh0bDkc5VKN7yKcQiKYBzwE-0hu/exec";

// Cek apakah URL sudah dikonfigurasi
const sheetsEnabled = GAS_URL && GAS_URL !== "https://script.google.com/macros/s/AKfycbzLfkA2mM4p7Z7sVhSyKbT3KodNOE2QgxsErnJbReh0bDkc5VKN7yKcQiKYBzwE-0hu/exec";

// =============================================
// SAVE SCORE KE GOOGLE SHEETS
// =============================================
async function saveToSheets(name, score, distance, zamzam) {
  if (!sheetsEnabled) {
    console.log("[HajiRush] Google Sheets belum dikonfigurasi. Score tersimpan lokal saja.");
    return;
  }

  const playerEmail = localStorage.getItem("hr_playerEmail") || "";
  const params = new URLSearchParams({
    action: "saveScore",
    name: name || "Jamaah",
    email: playerEmail,
    score: score,
    distance: distance,
    zamzam: zamzam,
    timestamp: new Date().toISOString(),
  });

  try {
    const res = await fetch(`${GAS_URL}?${params.toString()}`);
    const data = await res.json();
    if (data.status === "ok") {
      console.log("[HajiRush] Score tersimpan ke Sheets! ✅");
    }
  } catch (err) {
    console.warn("[HajiRush] Gagal simpan ke Sheets:", err.message);
  }
}

// =============================================
// REGISTER PLAYER BARU
// =============================================
async function registerPlayer(name, email) {
  if (!sheetsEnabled) return;

  const params = new URLSearchParams({
    action: "registerPlayer",
    name: name || "Jamaah",
    email: email || "",
    uid: getOrCreateUID(),
    timestamp: new Date().toISOString(),
  });

  try {
    await fetch(`${GAS_URL}?${params.toString()}`);
    console.log("[HajiRush] Player terdaftar ke Sheets! ✅");
  } catch (err) {
    console.warn("[HajiRush] Gagal register player:", err.message);
  }
}

// =============================================
// FETCH LEADERBOARD
// =============================================
async function fetchLeaderboard() {
  if (!sheetsEnabled) {
    // Return local dummy data jika Sheets belum setup
    const localName = localStorage.getItem("hr_playerName") || "Kamu";
    const localScore = localStorage.getItem("hr_bestScore") || "0";
    return [{ name: localName, score: localScore }];
  }

  const params = new URLSearchParams({
    action: "getLeaderboard",
    limit: 15
  });

  try {
    const res = await fetch(`${GAS_URL}?${params.toString()}`);
    const data = await res.json();
    return data.leaderboard || [];
  } catch (err) {
    console.warn("[HajiRush] Gagal fetch leaderboard:", err.message);
    return [];
  }
}

// =============================================
// HELPER: UID Unik per Browser
// =============================================
function getOrCreateUID() {
  let uid = localStorage.getItem("hr_uid");
  if (!uid) {
    uid = "hr_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("hr_uid", uid);
  }
  return uid;
}


// =============================================
// ============================================
// GOOGLE APPS SCRIPT CODE — PASTE INI KE GAS
// ============================================
// (Kode di bawah adalah komentar — copy ke Apps Script)
// =============================================
/*

// ======= APPS SCRIPT (code.gs) =======

const SHEET_NAME_SCORES = "Scores";
const SHEET_NAME_PLAYERS = "Players";

function doGet(e) {
  const action = e.parameter.action;
  let result = {};

  if (action === "saveScore") {
    result = saveScore(e.parameter);
  } else if (action === "registerPlayer") {
    result = registerPlayer(e.parameter);
  } else if (action === "getLeaderboard") {
    result = getLeaderboard(parseInt(e.parameter.limit) || 15);
  } else {
    result = { status: "ok", message: "Haji Rush API Ready 🕋" };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function saveScore(params) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME_SCORES);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME_SCORES);
      sheet.appendRow(["Timestamp", "Nama", "Email", "Skor", "Jarak (m)", "Zamzam"]);
    }
    sheet.appendRow([
      params.timestamp || new Date().toISOString(),
      params.name || "Jamaah",
      params.email || "",
      parseInt(params.score) || 0,
      parseInt(params.distance) || 0,
      parseInt(params.zamzam) || 0,
    ]);
    return { status: "ok", message: "Score saved!" };
  } catch (e) {
    return { status: "error", message: e.message };
  }
}

function registerPlayer(params) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME_PLAYERS);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME_PLAYERS);
      sheet.appendRow(["UID", "Nama", "Email", "Registered At"]);
    }
    // Cek duplikasi UID
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === params.uid) return { status: "ok", message: "Already registered" };
    }
    sheet.appendRow([
      params.uid || "",
      params.name || "Jamaah",
      params.email || "",
      params.timestamp || new Date().toISOString(),
    ]);
    return { status: "ok", message: "Player registered!" };
  } catch (e) {
    return { status: "error", message: e.message };
  }
}

function getLeaderboard(limit) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME_SCORES);
    if (!sheet) return { leaderboard: [] };

    const data = sheet.getDataRange().getValues();
    const scores = [];
    const seen = {};

    for (let i = 1; i < data.length; i++) {
      const name = data[i][1];
      const score = parseInt(data[i][3]) || 0;
      if (!seen[name] || seen[name] < score) {
        seen[name] = score;
      }
    }

    for (const [name, score] of Object.entries(seen)) {
      scores.push({ name, score });
    }
    scores.sort((a, b) => b.score - a.score);

    return { leaderboard: scores.slice(0, limit) };
  } catch (e) {
    return { leaderboard: [] };
  }
}

*/
