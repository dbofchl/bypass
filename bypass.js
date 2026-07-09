(function () {
  "use strict";

  const _decode = (str) => atob(str);

  // ─── Konfigurasi URL & Style ────────────────────────────────────────────────
  const CONFIG = {
    r: _decode("aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2Rib2ZjaGwvYnlwYXNzL21haW4vYnlwYXNzLnR4dA=="), 
    t: _decode("aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2Rib2ZjaGwvYnlwYXNzL21haW4vY2gudHh0"),
    m: _decode("aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY39tL3Zhbnotd2Vic2l0ZS9WYW56QnlwYXNzL21haW4vbXVzaWMubXAz"),
    s: "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);" +
       "background:rgba(6, 10, 22, 0.8);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);" +
       "color:#fff;padding:40px 30px;border-radius:16px;z-index:2147483647;" +
       'font-family:"Courier New", Courier, monospace;' +
       "text-align:center;box-shadow:0 0 50px rgba(0, 255, 102, 0.15), inset 0 0 20px rgba(0, 255, 102, 0.05);" +
       "border:1px solid rgba(0, 255, 102, 0.3);width:340px;box-sizing:border-box;transition: all 0.5s ease;",
  };

  const VALID_KEYS = ["psteamadm"];
  const FALLBACK_MUSIC_URL = _decode("aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY39tL3Zhbnotd2Vic2l0ZS9WYW56QnlwYXNzL21haW4vbXVzaWMubXAz");
  
  let audioPlayer = null;
  let matrixState = "LOGIN"; // Status: LOGIN, OVERLOAD, BYPASS

  // ─── Main Execution ─────────────────────────────────────────────────────────
  (async function () {
    // Bersihkan sisa elemen lama jika ada
    document.getElementById("matrix-bg-canvas")?.remove();
    document.getElementById("vanz-auth-box")?.remove();
    document.getElementById("vanz-floating-credit")?.remove();

    const titleName    = "PSTeamAdm";
    const telegramLink = _decode("aHR0cHM6Ly90Lm1lL3BzdGVhbWFkbV9vZmZpY2lhbA=="); 

    // ── Inject CSS Kustom untuk Efek Neon & Glitch ──────────────────────────
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      @keyframes neon-pulse {
        0%, 100% { border-color: rgba(0, 255, 102, 0.4); box-shadow: 0 0 10px rgba(0, 255, 102, 0.1); }
        50% { border-color: rgba(0, 255, 102, 1); box-shadow: 0 0 20px rgba(0, 255, 102, 0.4); }
      }
      @keyframes text-glitch {
        0% { text-shadow: 0 0 8px #00ff66; }
        95% { text-shadow: 0 0 8px #00ff66; }
        96% { text-shadow: -2px 0 #ff0055, 2px 0 #00f0ff; }
        98% { text-shadow: 2px 0 #ff0055, -2px 0 #00f0ff; }
        100% { text-shadow: 0 0 8px #00ff66; }
      }
      @keyframes spin-clockwise { 0% { transform: translate(-50%,-50%) rotate(0deg); } 100% { transform: translate(-50%,-50%) rotate(360deg); } }
      @keyframes spin-counter { 0% { transform: translate(-50%,-50%) rotate(360deg); } 100% { transform: translate(-50%,-50%) rotate(0deg); } }
      
      .matrix-input-glow { animation: neon-pulse 3s infinite ease-in-out; }
      .matrix-title-anim { animation: text-glitch 4s infinite linear; }
      
      .vanz-mode-btn {
        width: 100%; border: 1px solid #00ff66; padding: 12px; border-radius: 6px;
        font-weight: 700; cursor: pointer; font-size: 12px; letter-spacing: 2px;
        margin-bottom: 12px; color: #00ff66; background: rgba(0, 255, 102, 0.03);
        transition: all 0.3s ease; text-transform: uppercase; font-family: inherit;
      }
      .vanz-mode-btn:hover { background: #00ff66; color: #000; box-shadow: 0 0 20px #00ff66; transform: scale(1.02); }
    `;
    document.head.appendChild(styleEl);

    // ── INTERACTIVE MATRIX CANVAS BACKGROUND ──────────────────────────────────
    const canvas = document.createElement("canvas");
    canvas.id = "matrix-bg-canvas";
    canvas.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; z-index:2147483640; background:#02040a;";
    document.body.appendChild(canvas);

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
    
    // Karakter gabungan biner & siber ala matriks asli
    const matrixChars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZｦｱｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃ".split("");

    function drawMatrix() {
      // Menentukan ketebalan background trail berdasarkan state
      if (matrixState === "LOGIN") {
        ctx.fillStyle = "rgba(2, 4, 10, 0.05)";
      } else {
        // Efek distorsi trail saat terdeteksi bypass/overload
        ctx.fillStyle = "rgba(4, 2, 8, 0.08)"; 
      }
      ctx.fillRect(0, 0, width, height);

      // Skema warna dinamis berdasarkan state menu
      if (matrixState === "LOGIN") {
        ctx.fillStyle = "#00ff66"; // Hijau Klasik Netral
      } else if (matrixState === "OVERLOAD") {
        ctx.fillStyle = "#ff0055"; // Merah Peringatan Teroris Digital
      } else {
        ctx.fillStyle = "#00f0ff"; // Cyan Protokol Aktif
      }
      
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Kecepatan & sensitivitas jatuh diubah secara dramatis saat state berubah
        const resetThreshold = matrixState === "LOGIN" ? 0.975 : 0.93; 
        if (drops[i] * fontSize > height && Math.random() * 1 > resetThreshold) {
          drops[i] = 0;
        }
        
        // Percepat aliran jatuhnya kode jika sudah masuk mode bypass
        drops[i] += matrixState === "LOGIN" ? 1 : 2;
      }
    }
    let matrixInterval = setInterval(drawMatrix, 33);

    // ── Floating Credit Text ──────────────────────────────────────────────────
    const creditLink = document.createElement("a");
    creditLink.id = "vanz-floating-credit";
    creditLink.style.cssText = "position:fixed;bottom:15px;right:20px;font-size:12px;font-weight:bold;letter-spacing:2px;z-index:2147483647;text-decoration:none;color:#00ff66;text-shadow:0 0 5px #00ff66;";
    creditLink.innerText = `// ${titleName.toUpperCase()}_`;
    creditLink.href = telegramLink;
    creditLink.target = "_blank";
    document.body.appendChild(creditLink);

    // ── Build Core Login Box ──────────────────────────────────────────────────
    const authBox = document.createElement("div");
    authBox.id = "vanz-auth-box";
    authBox.style.cssText = CONFIG.s;
    authBox.innerHTML = `
      <button id="vanz-music-btn" style="
        position:absolute;top:15px;right:15px;background:transparent;
        border:1px solid rgba(0,255,102,0.3);color:#00ff66;border-radius:4px;
        width:32px;height:24px;cursor:pointer;font-size:10px;font-family:inherit;">MUTE</button>

      <h3 class="matrix-title-anim" style="margin:10px 0 2px 0;color:#00ff66;font-size:24px;letter-spacing:3px;font-weight:900;text-transform:uppercase;">
        ${titleName}
      </h3>
      <p style="margin:0 0 30px 0;color:#475569;font-size:10px;letter-spacing:2px;">
        MATRIX_INTERFACE_v4.0
      </p>

      <input type="text" id="vanz-key-input" class="matrix-input-glow" placeholder="[ ENTER ACCESS KEY ]" style="
        width:100%;padding:14px;margin-bottom:18px;border:1px solid rgba(0,255,102,0.3);
        border-radius:6px;background:rgba(0,0,0,0.85);color:#00ff66;text-align:center;
        box-sizing:border-box;font-size:13px;font-weight:600;font-family:inherit;
        letter-spacing:2px;outline:none;transition:all 0.3s;">

      <button id="vanz-login-btn" style="
        width:100%;background:#00ff66;color:#000;border:none;padding:14px;
        border-radius:6px;font-weight:900;cursor:pointer;font-size:12px;
        letter-spacing:2px;margin-bottom:12px;font-family:inherit;
        box-shadow:0 0 15px rgba(0,255,102,0.3);transition:all 0.2s ease;">
        CONNECT_TO_HOST
      </button>

      <button id="vanz-telegram-btn" style="
        width:100%;background:transparent;color:#229ED9;border:1px solid #229ED9;
        padding:12px;border-radius:6px;font-weight:700;cursor:pointer;
        font-size:11px;letter-spacing:2px;font-family:inherit;transition:all 0.3s;">
        TELEGRAM_CH
      </button>

      <div id="vanz-status" style="margin-top:25px;font-size:10px;color:#475569;letter-spacing:1px;">
        NODE_STATUS: LINK_IDLE
      </div>
    `;
    document.body.appendChild(authBox);

    const musicBtn    = document.getElementById("vanz-music-btn");
    const keyInput    = document.getElementById("vanz-key-input");
    const loginBtn    = document.getElementById("vanz-login-btn");
    const telegramBtn = document.getElementById("vanz-telegram-btn");
    const statusEl    = document.getElementById("vanz-status");

    // ── Handle BGM Audio ──────────────────────────────────────────────────────
    let musicLoading = false;
    musicBtn.addEventListener("click", async () => {
      if (musicLoading) return;
      if (!audioPlayer) {
        musicLoading = true;
        musicBtn.textContent = "...";
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
          musicBtn.style.color = "#00ff66";
          musicBtn.style.borderColor = "#00ff66";
        }).catch(() => { musicBtn.textContent = "MUTE"; });
      } else {
        audioPlayer.pause();
        musicBtn.textContent = "MUTE";
        musicBtn.style.color = "#ff0055";
        musicBtn.style.borderColor = "rgba(255,0,85,0.3)";
      }
    });

    telegramBtn.addEventListener("click", () => {
      if (telegramLink?.startsWith("http")) window.open(telegramLink, "_blank");
    });

    // ── Fungsi Utama: Efek Saat Bypass Timer Berjalan ──────────────────────────
    function runRedirect(countdownSeconds) {
      // Ubah state matriks latar belakang menjadi bypass (Warna Cyan & Super Cepat)
      matrixState = "BYPASS"; 
      authBox.remove();

      // Render HUD Kontainer Timer Baru Berbasis Tech-Ring Geometric
      const DASH_TOTAL = 597;
      const countdownOverlay = document.createElement("div");
      countdownOverlay.id = "vanz-timer-overlay";
      countdownOverlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:2147483645;display:flex;align-items:center;justify-content:center;font-family:inherit;";
      countdownOverlay.innerHTML = `
        <div style="position:relative; z-index:10; text-align:center;">
          <div style="position:relative; width:260px; height:260px; margin:0 auto; display:flex; align-items:center; justify-content:center;">
            
            <div style="position:absolute; top:50%; left:50%; width:230px; height:230px; border-radius:50%;
                        background:conic-gradient(transparent 0deg, #00f0ff 180deg, transparent 360deg);
                        filter:blur(20px); opacity:0.4; animation:spin-clockwise 3s linear infinite;"></div>

            <div style="position:absolute; top:50%; left:50%; width:215px; height:215px; border-radius:50%;
                        border:2px dashed rgba(0, 240, 255, 0.3); animation:spin-counter 8s linear infinite;"></div>

            <svg width="250" height="250" style="transform:rotate(-90deg); position:relative;">
              <circle cx="125" cy="125" r="95" fill="rgba(3, 6, 15, 0.85)" stroke="rgba(0,240,255,0.05)" stroke-width="12"></circle>
              <circle id="progress" cx="125" cy="125" r="95" fill="none" stroke="#00f0ff" stroke-width="8"
                      stroke-dasharray="${DASH_TOTAL}" stroke-dashoffset="${DASH_TOTAL}" stroke-linecap="round"
                      style="filter:drop-shadow(0 0 10px #00f0ff); transition:stroke-dashoffset 1s linear;"></circle>
            </svg>

            <div id="countdown-text" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
                        font-size:58px; font-weight:900; color:#fff; text-shadow:0 0 25px #00f0ff;">${countdownSeconds}</div>
          </div>
          <p id="bypass-hud-status" style="margin-top:35px; color:#00f0ff; font-size:12px; font-weight:bold; letter-spacing:4px;
                     text-shadow:0 0 10px #00f0ff; text-transform:uppercase;">EXTRACTING_TOKEN_STREAM...</p>
        </div>
      `;
      document.body.appendChild(countdownOverlay);

      let remaining = countdownSeconds;
      const progressCircle = document.getElementById("progress");
      const countdownText  = document.getElementById("countdown-text");
      const hudStatus      = document.getElementById("bypass-hud-status");

      const systemLogs = ["OVERRIDING_GATEWAY...", "INJECTING_PAYLOAD...", "BYPASS_SUCCESS_REDIRECTING..."];

      const timer = setInterval(async () => {
        remaining--;
        if (countdownText) countdownText.textContent = remaining;
        if (progressCircle) progressCircle.style.strokeDashoffset = DASH_TOTAL * (remaining / countdownSeconds);

        // Ubah log teks sub-terminal secara berkala biar terkesan kompleks
        if (hudStatus && remaining % 8 === 0 && remaining > 0) {
          hudStatus.textContent = systemLogs[Math.floor(Math.random() * systemLogs.length)];
        }

        if (remaining <= 0) {
          clearInterval(timer);
          clearInterval(matrixInterval);
          if (hudStatus) hudStatus.textContent = "HANDSHAKE_ESTABLISHED!";
          
          if (audioPlayer) {
            audioPlayer.pause();
            audioPlayer = null;
          }

          try {
            const redirectRes = await fetch(CONFIG.r + "?t=" + Date.now(), { credentials: "omit" });
            const redirectUrl = (await redirectRes.text()).trim();
            
            document.getElementById("matrix-bg-canvas")?.remove();
            countdownOverlay.remove();

            if (redirectUrl.startsWith("http")) {
              window.location.replace(redirectUrl);
            } else {
              alert("CRITICAL_ERR: SECURE TARGET NOT FOUND");
            }
          } catch {
            alert("NETWORK_TIMEOUT: REDIRECT FAILED");
          }
        }
      }, 1000);
    }

    // ── Logika Validasi Key & Render Menu Pilihan Protokol ────────────────────
    loginBtn.addEventListener("click", () => {
      const inputKey = keyInput.value.trim();

      if (!inputKey) {
        statusEl.innerHTML = "<span style='color:#ff0055;'>ERR: ACCESS_KEY_EMPTY</span>";
        return;
      }

      const isValid = VALID_KEYS.some(k => k.toLowerCase() === inputKey.toLowerCase());

      if (isValid) {
        // Alihkan matriks ke mode Overload (Merah Malicious) untuk transisi dramatis
        matrixState = "OVERLOAD";
        statusEl.innerHTML = "<span style='color:#00ff66;'>KEY_VERIFIED // LOADING_MODULES</span>";
        loginBtn.disabled = true;
        keyInput.disabled = true;

        setTimeout(() => {
          authBox.style.borderColor = "#ff0055";
          authBox.style.boxShadow = "0 0 50px rgba(255, 0, 85, 0.2)";
          
          authBox.innerHTML = `
            <h3 style="margin:5px 0 2px 0;color:#ff0055;font-size:20px;letter-spacing:2px;font-weight:900;text-shadow:0 0 10px #ff0055;">
              SELECT_METHOD
            </h3>
            <p style="margin:0 0 25px 0;color:#475569;font-size:10px;letter-spacing:1px;">
              SYSTEM_COMPROMISE_LEVEL
            </p>
            
            <button id="vanz-btn-safe"   class="vanz-mode-btn" style="border-color:#00f0ff;color:#00f0ff;">BYPASS GETKEY)</button>
          `;
          
          document.getElementById("vanz-btn-fast")?.addEventListener("click",   () => runRedirect(30));
          document.getElementById("vanz-btn-secure")?.addEventListener("click", () => runRedirect(45));
          document.getElementById("vanz-btn-safe")?.addEventListener("click",   () => runRedirect(60));
        }, 1000);

      } else {
        statusEl.innerHTML = "<span style='color:#ff0055;'>ERR: BAD_ACCESS_KEY</span>";
        // Efek getar/glitch singkat pada box jika salah key
        authBox.style.transform = "translate(-50%, -50%) scale(1.03)";
        setTimeout(() => authBox.style.transform = "translate(-50%, -50%) scale(1)", 150);
      }
    });

  })();
})();