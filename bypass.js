(function () {
  "use strict";

  // Decoder internal untuk menyamarkan URL sensitif dari scanner statis
  const _decode = (str) => atob(str);

  // ─── Konfigurasi URL & Style Premium ────────────────────────────────────────
  const CONFIG = {
    r: _decode("aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2Rib2ZjaGwvYnlwYXNzL21haW4vYnlwYXNzLnR4dA=="), 
    t: _decode("aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2Rib2ZjaGwvYnlwYXNzL21haW4vY2gudHh0"),
    m: _decode("aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY39tL3Zhbnotd2Vic2l0ZS9WYW56QnlwYXNzL21haW4vbXVzaWMubXAz"),
    s: "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);" +
       "background:rgba(5, 7, 16, 0.85);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);" +
       "color:#fff;padding:35px 25px;border-radius:12px;z-index:2147483647;" +
       'font-family:"Courier New", Courier, monospace, system-ui;' +
       "text-align:center;box-shadow:0 0 40px rgba(0, 240, 255, 0.25), inset 0 0 15px rgba(0, 240, 255, 0.1);" +
       "border:1px solid #00f0ff;width:320px;box-sizing:border-box;" +
       "overflow:hidden;",
  };

  const VALID_KEYS = ["psteamadm"];
  const FALLBACK_MUSIC_URL = _decode("aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY39tL3Zhbnotd2Vic2l0ZS9WYW56QnlwYXNzL21haW4vbXVzaWMubXAz");
  let audioPlayer = null;

  // ─── Main IIFE ────────────────────────────────────────────────────────────────
  (async function () {

    document.getElementById("vanz-auth-box")?.remove();
    document.getElementById("vanz-floating-credit")?.remove();

    const titleName    = "PSTeamAdm";
    const telegramLink = _decode("aHR0cHM6Ly90Lm1lL3BzdGVhbWFkbV9vZmZpY2lhbA=="); 

    // ── Inject CSS Animasi Futuristik ──────────────────────────────────────────
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      @keyframes cyber-scan {
        0% { top: -100%; }
        100% { top: 200%; }
      }
      @keyframes glitch-text {
        0%, 100% { text-shadow: 0 0 8px #00f0ff, 2px 0 0 #ff007f; }
        50% { text-shadow: 0 0 15px #00f0ff, -2px 0 0 #00ffcc; }
      }
      @keyframes pulse-ring {
        0% { transform: translate(-50%, -50%) rotate(0deg) scale(0.98); opacity: 0.5; }
        50% { transform: translate(-50%, -50%) rotate(180deg) scale(1.02); opacity: 0.9; }
        100% { transform: translate(-50%, -50%) rotate(360deg) scale(0.98); opacity: 0.5; }
      }
      .cyber-scanline {
        position: absolute; top: 0; left: 0; width: 100%; height: 6px;
        background: linear-gradient(to bottom, transparent, rgba(0, 240, 255, 0.4), transparent);
        animation: cyber-scan 4s linear infinite; pointer-events: none;
      }
      .vanz-clickable-credit {
        position: fixed; bottom: 14px; right: 20px; font-size: 14px; font-weight: bold;
        letter-spacing: 2px; z-index: 2147483647; text-decoration: none; cursor: pointer;
        color: #00f0ff; text-shadow: 0 0 5px #00f0ff; animation: glitch-text 2s infinite;
      }
      .vanz-mode-btn {
        width: 100%; border: 1px solid #00f0ff; padding: 12px; border-radius: 4px;
        font-weight: 700; cursor: pointer; font-size: 12px; letter-spacing: 2px;
        margin-bottom: 12px; color: #00f0ff; background: rgba(0, 240, 255, 0.05);
        transition: all 0.2s ease; text-transform: uppercase; font-family: inherit;
      }
      .vanz-btn-fast   { border-color: #ff0055; color: #ff0055; }
      .vanz-btn-fast:hover   { background: #ff0055; color: #000; box-shadow: 0 0 15px #ff0055; }
      .vanz-btn-secure { border-color: #ffaa00; color: #ffaa00; }
      .vanz-btn-secure:hover { background: #ffaa00; color: #000; box-shadow: 0 0 15px #ffaa00; }
      .vanz-btn-safe   { border-color: #00ffcc; color: #00ffcc; }
      .vanz-btn-safe:hover   { background: #00ffcc; color: #000; box-shadow: 0 0 15px #00ffcc; }
    `;
    document.head.appendChild(styleEl);

    // ── Floating Credit ───────────────────────────────────────────────────────
    const creditLink     = document.createElement("a");
    creditLink.id        = "vanz-floating-credit";
    creditLink.className = "vanz-clickable-credit";
    creditLink.innerText = `// ${titleName.toUpperCase()}_`;
    creditLink.href      = telegramLink;
    creditLink.target    = "_blank";
    document.body.appendChild(creditLink);

    // ── Buat Auth Box (Cyberpunk HUD) ─────────────────────────────────────────
    const authBox         = document.createElement("div");
    authBox.id            = "vanz-auth-box";
    authBox.style.cssText = CONFIG.s;
    authBox.innerHTML     = `
      <div class="cyber-scanline"></div>
      <button id="vanz-music-btn" style="
        position:absolute;top:15px;right:15px;
        background:transparent;border:1px solid rgba(0,240,255,0.3);
        color:#ff0055;border-radius:4px;width:28px;height:28px;
        cursor:pointer;font-size:12px;display:flex;align-items:center;
        justify-content:center;transition:all 0.3s ease;z-index:10;">MUTE</button>

      <h3 style="margin:10px 0 4px 0;color:#00f0ff;font-size:22px;letter-spacing:2px;
                 font-weight:900;animation: glitch-text 3s infinite;text-transform:uppercase;">
        ${titleName}
      </h3>
      <p style="margin:0 0 25px 0;color:#475569;font-size:10px;letter-spacing:3px;">
        SECURE_CORE_ACCESS v3.0
      </p>

      <input type="text" id="vanz-key-input" placeholder="[ ENTER ACCESS KEY ]" style="
        width:100%;padding:14px;margin-bottom:16px;
        border:1px solid rgba(0,240,255,0.3);border-radius:4px;
        background:rgba(0,0,0,0.8);color:#00ffcc;text-align:center;
        box-sizing:border-box;font-size:12px;font-weight:600;font-family:inherit;
        letter-spacing:2px;outline:none;transition:all 0.3s ease;">

      <button id="vanz-login-btn" style="
        width:100%;background:#00f0ff;color:#000;border:none;
        padding:14px;border-radius:4px;font-weight:900;cursor:pointer;
        font-size:12px;letter-spacing:2px;margin-bottom:12px;font-family:inherit;
        box-shadow:0 0 15px rgba(0,240,255,0.4);transition:all 0.2s ease;">
        INITIALIZE_BYPASS
      </button>

      <button id="vanz-telegram-btn" style="
        width:100%;background:transparent;color:#229ED9;border:1px solid #229ED9;
        padding:12px;border-radius:4px;font-weight:700;cursor:pointer;
        font-size:12px;letter-spacing:2px;font-family:inherit;
        transition:all 0.3s; box-shadow:inset 0 0 5px rgba(34,158,217,0.2);">
        COM_CHANNEL
      </button>

      <div id="vanz-status" style="margin-top:20px;font-size:10px;color:#475569;letter-spacing:1px;">
        SYS_STATUS: STANDBY...
      </div>
    `;
    document.body.appendChild(authBox);

    const musicBtn    = document.getElementById("vanz-music-btn");
    const keyInput    = document.getElementById("vanz-key-input");
    const loginBtn    = document.getElementById("vanz-login-btn");
    const telegramBtn = document.getElementById("vanz-telegram-btn");
    const statusEl    = document.getElementById("vanz-status");

    // ── Input Focus Glow ──────────────────────────────────────────────────────
    keyInput.addEventListener("focus", () => {
      keyInput.style.borderColor = "#00ffcc";
      keyInput.style.boxShadow = "0 0 12px rgba(0,255,204,0.3)";
    });
    keyInput.addEventListener("blur", () => {
      keyInput.style.borderColor = "rgba(0,240,255,0.3)";
      keyInput.style.boxShadow = "none";
    });

    // ── Event: Tombol Telegram ────────────────────────────────────────────────
    telegramBtn.addEventListener("click", () => {
      if (telegramLink && telegramLink.startsWith("http")) {
        window.open(telegramLink, "_blank");
      }
    });

    // ── Event: Audio Player ───────────────────────────────────────────────────
    let musicLoading = false;
    musicBtn.addEventListener("click", async () => {
      if (musicLoading) return;
      if (!audioPlayer) {
        musicLoading = true;
        musicBtn.textContent = "LOAD";
        let resolvedUrl = FALLBACK_MUSIC_URL;
        try {
          const res = await fetch(CONFIG.m + "?t=" + Date.now(), { credentials: "omit", mode: "cors" });
          const audioUrl = (await res.text()).trim();
          if (audioUrl && audioUrl.startsWith("http")) resolvedUrl = audioUrl;
        } catch (err) { console.log(err); }
        audioPlayer = new Audio(resolvedUrl);
        audioPlayer.loop = true;
        musicLoading = false;
      }
      if (audioPlayer.paused) {
        audioPlayer.play().then(() => {
          musicBtn.textContent = "PLAY";
          musicBtn.style.color = "#00ffcc";
          musicBtn.style.borderColor = "#00ffcc";
        }).catch(() => { musicBtn.textContent = "MUTE"; });
      } else {
        audioPlayer.pause();
        musicBtn.textContent = "MUTE";
        musicBtn.style.color = "#ff0055";
        musicBtn.style.borderColor = "rgba(0,240,255,0.3)";
      }
    });

    // ── Fungsi: Efek Keren Saat Timer Berjalan (Matrix Rain Canvas) ────────────
    function runRedirect(countdownSeconds) {
      authBox.remove();

      // Setup Fullscreen Overlay
      const countdownOverlay = document.createElement("div");
      countdownOverlay.style.cssText = `
        position:fixed; top:0; left:0; width:100%; height:100%;
        background:#020205; z-index:2147483647;
        display:flex; align-items:center; justify-content:center;
        font-family:"Courier New", monospace; overflow:hidden;
      `;
      
      // Inject Canvas untuk Animasi Matrix Hujan Binary Digital
      const canvas = document.createElement("canvas");
      canvas.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; opacity:0.15; z-index:1;";
      countdownOverlay.appendChild(canvas);

      // Desain Lingkaran HUD Timer Yang Kompleks & Keren
      const DASH_TOTAL = 597;
      const contentContainer = document.createElement("div");
      contentContainer.style.cssText = "position:relative; z-index:2; text-align:center;";
      contentContainer.innerHTML = `
        <div style="position:relative; width:260px; height:260px; margin:0 auto; display:flex; align-items:center; justify-content:center;">
          
          <div style="position:absolute; top:50%; left:50%; width:240px; height:240px; border-radius:50%;
                      background:conic-gradient(transparent 0deg, #ff0055 120deg, #00f0ff 240deg, transparent 360deg);
                      filter:blur(16px); animation:cyber-scan 2s linear infinite, pulse-ring 2.5s ease-in-out infinite; z-index:1;"></div>

          <div style="position:absolute; top:50%; left:50%; width:210px; height:210px; border-radius:50%;
                      border:2px dashed rgba(0, 240, 255, 0.4); animation: pulse-ring 6s linear infinite reverse; z-index:2;"></div>

          <svg width="250" height="250" style="transform:rotate(-90deg); position:relative; z-index:3;">
            <circle cx="125" cy="125" r="95" fill="rgba(4,6,14,0.85)" stroke="rgba(0,240,255,0.05)" stroke-width="12"></circle>
            <circle id="progress" cx="125" cy="125" r="95" fill="none" stroke="#00f0ff" stroke-width="10"
                    stroke-dasharray="${DASH_TOTAL}" stroke-dashoffset="${DASH_TOTAL}" stroke-linecap="square"
                    style="filter:drop-shadow(0 0 8px #00f0ff); transition:stroke-dashoffset 1s linear;"></circle>
          </svg>

          <div id="countdown-text" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
                      font-size:54px; font-weight:900; color:#fff; font-family:inherit;
                      text-shadow:0 0 20px #00f0ff; z-index:4;">${countdownSeconds}</div>
        </div>
        <p id="bypass-hud-status" style="margin-top:30px; color:#00ffcc; font-size:13px; font-weight:bold; letter-spacing:4px;
                   text-shadow:0 0 10px #00ffcc; text-transform:uppercase;">INJECTING_BYPASS_PROTOCOL...</p>
      `;
      countdownOverlay.appendChild(contentContainer);
      document.body.appendChild(countdownOverlay);

      // ── LOGIKA JALANNYA MATRIX CANVAS EFFECT ──
      const ctx = canvas.getContext("2d");
      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);
      
      window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      });

      const fontSize = 14;
      const columns = Math.floor(width / fontSize);
      const drops = Array(columns).fill(1);
      // Karakter biner biar makin cocok dengan tema bypass anomali
      const chars = "01".split(""); 

      function drawMatrix() {
        ctx.fillStyle = "rgba(2, 2, 5, 0.05)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#00f0ff"; // Warna biner mengikuti tema HUD cyan
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
          const text = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);
          if (drops[i] * fontSize > height && Math.random() * 0.975 > 0.95) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }
      const matrixInterval = setInterval(drawMatrix, 33);

      // ── LOGIKA COUNTDOWN TIMER REDIRECT ──
      let remaining = countdownSeconds;
      const progressCircle = countdownOverlay.querySelector("#progress");
      const countdownText  = countdownOverlay.querySelector("#countdown-text");
      const hudStatus      = countdownOverlay.querySelector("#bypass-hud-status");

      // Mengubah subteks secara berkala agar terlihat realistis sedang melakukan exploit/bypass
      const logPhases = ["BYPASSING_ANTIVIRUS...", "CLEARING_ANOMALY_LOGS...", "STEALTH_REDIRECT_PREPARING..."];
      
      const timer = setInterval(async () => {
        remaining--;
        if (countdownText) countdownText.textContent = remaining;
        if (progressCircle) progressCircle.style.strokeDashoffset = DASH_TOTAL * (remaining / countdownSeconds);

        // Ubah teks log secara dinamis berdasarkan sisa detik
        if (hudStatus && remaining % 10 === 0 && remaining > 0) {
          hudStatus.textContent = logPhases[Math.floor(Math.random() * logPhases.length)];
        }

        if (remaining <= 0) {
          clearInterval(timer);
          clearInterval(matrixInterval);
          if (hudStatus) hudStatus.textContent = "ESTABLISHING_CONNECTION!";
          
          if (audioPlayer) {
            audioPlayer.pause();
            audioPlayer = null;
          }

          try {
            const redirectRes = await fetch(CONFIG.r + "?t=" + Date.now(), { credentials: "omit" });
            const redirectUrl = (await redirectRes.text()).trim();
            countdownOverlay.remove();
            if (redirectUrl.startsWith("http")) {
              window.location.replace(redirectUrl);
            } else {
              alert("CRITICAL: INVALID TARGET ENDPOINT");
            }
          } catch {
            alert("REDIRECT ENGINE FAILURE!");
          }
        }
      }, 1000);
    }

    // ── Event: Tombol Login (Validasi & Render Protocol Menu) ──────────────────
    loginBtn.addEventListener("click", () => {
      const inputKey = keyInput.value.trim();

      if (!inputKey) {
        statusEl.innerHTML = "<span style='color:#ff0055;'>ERR: KEY_REQUIRED</span>";
        return;
      }

      const isValid = VALID_KEYS.some(k => k.toLowerCase() === inputKey.toLowerCase());

      if (isValid) {
        statusEl.innerHTML = "<span style='color:#00ffcc;'>ACCESS_GRANTED ✓</span>";
        loginBtn.disabled    = true;
        telegramBtn.disabled = true;

        setTimeout(() => {
          authBox.innerHTML = `
            <div class="cyber-scanline"></div>
            <h3 style="margin:5px 0 4px 0;color:#00f0ff;font-size:18px;letter-spacing:2px;font-weight:900;">
              PROTOCOL_SELECT
            </h3>
            <p style="margin:0 0 20px 0;color:#475569;font-size:10px;letter-spacing:2px;">
              CHOOSE BYPASS SEVERITY
            </p>
            <button id="vanz-btn-fast"   class="vanz-mode-btn vanz-btn-fast">FAST_BYPASS (30s)</button>
            <button id="vanz-btn-secure" class="vanz-mode-btn vanz-btn-secure">SECURE_TUNNEL (45s)</button>
            <button id="vanz-btn-safe"   class="vanz-mode-btn vanz-btn-safe">ANTI_ANOMALY (60s)</button>
          `;
          
          // Menggunakan Optional Chaining (?.) untuk perlindungan ekstra anti-anomali/error crash
          document.getElementById("vanz-btn-fast")?.addEventListener("click",   () => runRedirect(30));
          document.getElementById("vanz-btn-secure")?.addEventListener("click", () => runRedirect(45));
          document.getElementById("vanz-btn-safe")?.addEventListener("click",   () => runRedirect(60));
        }, 800);

      } else {
        statusEl.innerHTML = "<span style='color:#ff0055;'>ERR: INVALID_ACCESS_KEY</span>";
      }
    });

  })();
})();