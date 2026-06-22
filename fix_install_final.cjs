const fs = require('fs');

let code = fs.readFileSync('index.html', 'utf8');

const tTexts = {
  "en": "Installation unavailable on this device",
  "pt": "Instalação indisponível neste dispositivo",
  "es": "Instalación no disponible en este dispositivo",
  "fr": "Installation indisponible sur cet appareil",
  "de": "Installation auf diesem Gerät nicht verfügbar",
  "it": "Installazione non disponibile su questo dispositivo",
  "ja": "このデバイスではインストールできません",
  "ko": "이 기기에서는 설치할 수 없습니다",
  "zh": "此设备无法安装",
  "hi": "इस डिवाइस पर स्थापना अनुपलब्ध है",
  "ar": "التثبيت غير متاح على هذا الجهاز",
  "ru": "Установка недоступна на этом устройстве",
  "tr": "Bu cihazda yükleme yapılamıyor",
  "nl": "Installatie niet beschikbaar op dit apparaat",
  "pl": "Instalacja niedostępna na tym urządzeniu",
  "uk": "Установка недоступна на цьому пристрої",
  "id": "Instalasi tidak tersedia di perangkat ini",
  "el": "Η εγκατάσταση δεν είναι διαθέσιμη σε αυτήν τη συσκευή",
  "he": "התקנה אינה זמינה במכשיר זה",
  "ro": "Instalarea nu este disponibilă pe acest dispozitiv"
};

// 1. Re-add translations for the 20 languages
for (const [lang, msg] of Object.entries(tTexts)) {
  const marker = `"${lang}": {`;
  const insertLoc = code.indexOf(marker);
  if (insertLoc > -1) {
    const afterMarker = code.substring(insertLoc + marker.length);
    if (!afterMarker.includes('"installUnavailable"')) {
        code = code.substring(0, insertLoc + marker.length) + `\n    "installUnavailable": "${msg}",` + afterMarker;
    }
  }
}

// 2. Replace the `install-options` and `installPromptFallbackFlow` blocks with just a single button
code = code.replace(
  /<div class="install-options">[\s\S]*?<button class="install-later-btn" id="installLaterBtn" onclick="dismissInstall\(\)">Maybe later<\/button>\s*<\/div>\s*<div class="install-prompt-box" id="installPromptFallbackFlow"[\s\S]*?<\/div>/,
  `<button id="installPromptBtn" class="action-btn" style="width: 100%; margin-top: 20px;" onclick="acceptInstall()">Install Tiresias</button>
        <button class="install-later-btn" id="installLaterBtn" onclick="dismissInstall()">Maybe later</button>
      </div>`
);

// 3. Replace the `acceptInstall` function
const newAcceptInstall = `async function acceptInstall() {
        if (deferredPrompt) {
          document.getElementById("installPromptOverlay").classList.remove("visible");
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          deferredPrompt = null;
        }
        localStorage.setItem("tiresiasInstallPromptSeen", "true");
        installPromptSeen = true;
      }`;

code = code.replace(/async function acceptInstall.*?localStorage\.setItem\("tiresiasInstallPromptSeen", "true"\);\s*installPromptSeen = true;\s*\}/s, newAcceptInstall);

// 4. Update the `checkAndShowInstallPrompt` to NOT show if no deferredPrompt
code = code.replace(
  /if \(\!isStandalone && \!installPromptSeen && flowState === 3\) \{/,
  "if (!isStandalone && !installPromptSeen && flowState === 3 && deferredPrompt) {"
);

// 5. Update UI logic to handle the text change and disabled state
const updateUIInjection = `
        const ipB = document.getElementById("installPromptBtn"); 
        if(ipB) {
          if (deferredPrompt) {
            ipB.innerText = t.installBtn;
            ipB.disabled = false;
            ipB.style.opacity = "1";
            ipB.style.pointerEvents = "auto";
          } else {
            ipB.innerText = t.installUnavailable || "Instalação indisponível neste dispositivo";
            ipB.disabled = true;
            ipB.style.opacity = "0.5";
            ipB.style.pointerEvents = "none";
          }
        }
`;

code = code.replace(
  /const ipB = document\.getElementById\("installPromptBtn"\); if\(ipB\) ipB\.innerText = t\.installBtn;/,
  updateUIInjection
);

fs.writeFileSync('index.html', code);
console.log('Done');
