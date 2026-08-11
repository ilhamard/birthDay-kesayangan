/* =================================================================
   ROMANTIC BIRTHDAY WEBSITE INTERACTIVITY & ANIMATIONS
   ================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // 1. INITIALIZE CONFIG VALUES INTO DOM
  initFromConfig();

  // 2. INITIALIZE AUDIO PLAYER
  initAudioPlayer();

  // 3. INITIALIZE FLOATING HEARTS CANVAS
  initHeartCanvas();

  // 4. INITIALIZE SURPRISE BUTTON EVENT
  initSurpriseButton();

  // 5. INITIALIZE TIME COUNTER
  initCounter();

  // 6. INITIALIZE RANDOM GIFT SURPRISE
  initGiftSurprise();
});

/* =================================================================
   1. BIND CONFIG DATA TO HTML DOM
   ================================================================= */
function initFromConfig() {
  if (typeof CONFIG === 'undefined') return;

  // Set titles and names
  document.getElementById('heroSubtitle').innerText = CONFIG.heroSubtitle || "Ada kejutan manis untuk...";
  document.getElementById('heroTitle').innerText = CONFIG.heroTitle || "Selamat Ulang Tahun,";
  document.getElementById('heroName').innerText = CONFIG.name || "Sayangku Cantikku";
  document.getElementById('btnText').innerText = CONFIG.buttonText || "💖 Klik Di Sini, Sayang! 💖";
  document.getElementById('letterTo').innerText = `Untuk ${CONFIG.name || "Sayangku Cantikku"}, ❤️`;
  document.getElementById('letterQuote').innerText = CONFIG.loveQuote || "";
  document.getElementById('counterLabel').innerText = CONFIG.counterLabel || "Hari Indah Yang Telah Kita Lewati Bersama 💕";
  document.getElementById('musicTitle').innerText = CONFIG.musicTitle || "Jamrud - Selamat Ulang Tahun 🎶";

  // Update target name tags
  document.querySelectorAll('.target-name').forEach(el => {
    el.innerText = CONFIG.name || "Sayangku Cantikku";
  });

  // Render Polaroid Gallery
  const galleryGrid = document.getElementById('galleryGrid');
  if (galleryGrid && CONFIG.photos) {
    galleryGrid.innerHTML = CONFIG.photos.map(photo => `
      <div class="polaroid-card">
        <div class="polaroid-img-wrapper">
          <img src="${photo.url}" alt="${photo.caption}" onerror="this.src='https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&q=80'">
        </div>
        <div class="polaroid-caption">${photo.caption}</div>
        <div class="polaroid-desc">${photo.desc || ''}</div>
      </div>
    `).join('');
  }

  // Render Wishes Cards
  const wishesGrid = document.getElementById('wishesGrid');
  if (wishesGrid && CONFIG.wishes) {
    wishesGrid.innerHTML = CONFIG.wishes.map(wish => `
      <div class="wish-card">
        <span class="wish-icon">${wish.icon}</span>
        <div class="wish-title">${wish.title}</div>
        <div class="wish-text">${wish.text}</div>
      </div>
    `).join('');
  }

  // Render Gift Showcase Grid
  const giftGrid = document.getElementById('giftGrid');
  if (giftGrid && CONFIG.gifts) {
    giftGrid.innerHTML = CONFIG.gifts.map(gift => `
      <div class="gift-card" id="gift-card-${gift.id}">
        <span class="gift-card-badge">${gift.badge || 'Gift'}</span>
        <div class="gift-card-icon">${gift.icon}</div>
        <div class="gift-card-name">${gift.name}</div>
        <div class="gift-card-desc">${gift.desc}</div>
      </div>
    `).join('');
  }
}

/* =================================================================
   2. AUDIO PLAYER CONTROLLER (JAMRUD - SELAMAT ULANG TAHUN)
   ================================================================= */
let bgAudio;
let isAudioPlaying = false;

function initAudioPlayer() {
  bgAudio = document.getElementById('bgMusic');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const vinylRecord = document.getElementById('vinylRecord');
  const musicStatus = document.getElementById('musicStatus');

  if (!bgAudio) return;

  // Set music URL from CONFIG
  if (typeof CONFIG !== 'undefined' && CONFIG.musicUrl) {
    bgAudio.src = CONFIG.musicUrl;
  }
  bgAudio.volume = 1.0;

  // Try playing audio immediately (will succeed if browser allows or after interaction)
  const attemptPlay = () => {
    if (!isAudioPlaying && bgAudio.paused) {
      bgAudio.play().then(() => {
        isAudioPlaying = true;
        updateAudioUI(true);
      }).catch(err => {
        console.log("Autoplay waiting for user gesture...");
        musicStatus.innerText = "Klik tombol untuk memutar Jamrud 🎶";
      });
    }
  };

  // Attempt play right away
  attemptPlay();

  // Also play on first user interaction anywhere on document
  const handleFirstUserGesture = () => {
    attemptPlay();
    document.removeEventListener('click', handleFirstUserGesture);
    document.removeEventListener('touchstart', handleFirstUserGesture);
  };
  document.addEventListener('click', handleFirstUserGesture);
  document.addEventListener('touchstart', handleFirstUserGesture);

  // Manual Play / Pause toggle
  const togglePlay = (e) => {
    if (e) e.stopPropagation();
    if (bgAudio.paused) {
      bgAudio.play().then(() => {
        isAudioPlaying = true;
        updateAudioUI(true);
      }).catch(err => {
        console.error("Audio playback error:", err);
        alert("Gagal memutar lagu. Pastikan file audio tersedia.");
      });
    } else {
      bgAudio.pause();
      isAudioPlaying = false;
      updateAudioUI(false);
    }
  };

  function updateAudioUI(playing) {
    if (playing) {
      playPauseBtn.innerText = "❚❚";
      vinylRecord.classList.add('playing');
      musicStatus.innerText = "Sedang Memutar 🎶";
    } else {
      playPauseBtn.innerText = "▶";
      vinylRecord.classList.remove('playing');
      musicStatus.innerText = "Klik untuk memutar lagu";
    }
  }

  playPauseBtn.addEventListener('click', togglePlay);
  vinylRecord.addEventListener('click', togglePlay);
}

/* =================================================================
   3. SURPRISE BUTTON & CONTENT REVEAL
   ================================================================= */
function initSurpriseButton() {
  const surpriseBtn = document.getElementById('surpriseBtn');
  const heroSection = document.getElementById('heroSection');
  const mainContent = document.getElementById('mainContent');

  if (!surpriseBtn) return;

  surpriseBtn.addEventListener('click', (e) => {
    // Force start playing Jamrud audio on button click
    if (bgAudio) {
      bgAudio.play().then(() => {
        isAudioPlaying = true;
        const playPauseBtn = document.getElementById('playPauseBtn');
        const vinylRecord = document.getElementById('vinylRecord');
        const musicStatus = document.getElementById('musicStatus');
        if (playPauseBtn) playPauseBtn.innerText = "❚❚";
        if (vinylRecord) vinylRecord.classList.add('playing');
        if (musicStatus) musicStatus.innerText = "Sedang Memutar 🎶";
      }).catch(err => {
        console.log("Audio play error on button click:", err);
      });
    }

    // Trigger Heart Fireworks / Confetti
    triggerHeartExplosion(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 45);

    // Fade out Hero & Fade in Main Content
    heroSection.classList.add('hidden');

    setTimeout(() => {
      mainContent.classList.add('visible');
      mainContent.scrollIntoView({ behavior: 'smooth' });
      startTypingEffect();
    }, 400);
  });
}

/* =================================================================
   4. TYPING EFFECT ENGINE FOR ROMANTIC MESSAGE
   ================================================================= */
function startTypingEffect() {
  const letterBody = document.getElementById('letterBody');
  if (!letterBody || typeof CONFIG === 'undefined' || !CONFIG.romanticMessage) return;

  const messages = CONFIG.romanticMessage;
  letterBody.innerHTML = '';

  let paragraphIndex = 0;
  let charIndex = 0;

  function typeNextParagraph() {
    if (paragraphIndex >= messages.length) return;

    const p = document.createElement('p');
    letterBody.appendChild(p);

    const currentText = messages[paragraphIndex];

    function typeChar() {
      if (charIndex < currentText.length) {
        p.textContent += currentText.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, 35);
      } else {
        charIndex = 0;
        paragraphIndex++;
        setTimeout(typeNextParagraph, 400);
      }
    }

    typeChar();
  }

  typeNextParagraph();
}

/* =================================================================
   5. TIME COUNTER (DAYS TOGETHER / SPECIAL DATE)
   ================================================================= */
function initCounter() {
  if (typeof CONFIG === 'undefined' || !CONFIG.specialDate) return;

  const startDate = new Date(CONFIG.specialDate).getTime();

  function updateClock() {
    const now = new Date().getTime();
    const diff = Math.abs(now - startDate);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('daysCount').innerText = days;
    document.getElementById('hoursCount').innerText = hours;
    document.getElementById('minsCount').innerText = minutes;
    document.getElementById('secsCount').innerText = seconds;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* =================================================================
   6. FLOATING HEART CANVAS & CONFETTI FIREWORKS ENGINE
   ================================================================= */
let canvas, ctx;
let hearts = [];
let explosions = [];

function initHeartCanvas() {
  canvas = document.getElementById('heartCanvas');
  if (!canvas) return;

  ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 25; i++) {
    hearts.push(createHeart());
  }

  window.addEventListener('click', (e) => {
    if (e.target.closest('#audioWidget') || e.target.closest('#surpriseBtn')) return;
    triggerHeartExplosion(e.clientX, e.clientY, 12);
  });

  animate();
}

function createHeart() {
  return {
    x: Math.random() * canvas.width,
    y: canvas.height + Math.random() * 100,
    size: Math.random() * 14 + 8,
    speedY: Math.random() * 1.5 + 0.8,
    speedX: (Math.random() - 0.5) * 0.8,
    opacity: Math.random() * 0.6 + 0.3,
    color: ['#ff4b72', '#f72585', '#ffb3c6', '#ffd166'][Math.floor(Math.random() * 4)],
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.04
  };
}

function triggerHeartExplosion(x, y, count) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2;
    explosions.push({
      x: x,
      y: y,
      size: Math.random() * 16 + 10,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      opacity: 1,
      color: ['#ff4b72', '#ff2a57', '#f72585', '#ffd166', '#ffffff'][Math.floor(Math.random() * 5)],
      gravity: 0.15,
      friction: 0.96
    });
  }
}

function drawHeart(x, y, size, color, opacity, rotation = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(0, topCurveHeight);
  ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
  ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size);
  ctx.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
  ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  hearts.forEach((h, index) => {
    h.y -= h.speedY;
    h.x += h.speedX;
    h.rotation += h.rotationSpeed;

    if (h.y < -30) {
      hearts[index] = createHeart();
    }
    drawHeart(h.x, h.y, h.size, h.color, h.opacity, h.rotation);
  });

  for (let i = explosions.length - 1; i >= 0; i--) {
    const p = explosions[i];
    p.vx *= p.friction;
    p.vy *= p.friction;
    p.vy += p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.opacity -= 0.018;

    if (p.opacity <= 0) {
      explosions.splice(i, 1);
    } else {
      drawHeart(p.x, p.y, p.size, p.color, p.opacity, Math.atan2(p.vy, p.vx));
    }
  }

  requestAnimationFrame(animate);
}

/* =================================================================
   7. RANDOM GIFT SURPRISE & MODAL CONTROLLER
   ================================================================= */
let isDrawingGift = false;

function initGiftSurprise() {
  const drawGiftBtn = document.getElementById('drawGiftBtn');
  const drawBtnText = document.getElementById('drawBtnText');
  const giftBoxIcon = document.getElementById('giftBoxIcon');
  const giftBoxTitle = document.getElementById('giftBoxTitle');
  const giftModalOverlay = document.getElementById('giftModalOverlay');
  const closeGiftModal = document.getElementById('closeGiftModal');
  const reDrawBtn = document.getElementById('reDrawBtn');
  const claimWaBtn = document.getElementById('claimWaBtn');
  const modalGiftIcon = document.getElementById('modalGiftIcon');
  const modalGiftName = document.getElementById('modalGiftName');
  const modalGiftDesc = document.getElementById('modalGiftDesc');

  if (!drawGiftBtn || typeof CONFIG === 'undefined' || !CONFIG.gifts || CONFIG.gifts.length === 0) return;

  const gifts = CONFIG.gifts;

  function drawRandomGift() {
    if (isDrawingGift) return;
    isDrawingGift = true;
    drawGiftBtn.disabled = true;

    let shuffleCount = 0;
    const maxShuffles = 18;
    const intervalTime = 90;

    giftBoxIcon.classList.add('shuffling');

    const shuffleInterval = setInterval(() => {
      const randomTemp = gifts[Math.floor(Math.random() * gifts.length)];
      giftBoxIcon.innerText = randomTemp.icon;
      giftBoxTitle.innerText = `Mengacak... ${randomTemp.name}`;
      drawBtnText.innerText = "🎲 Sedang Mengacak Hadiah...";

      // Highlight temp card in showcase
      document.querySelectorAll('.gift-card').forEach(c => c.classList.remove('highlighted'));
      const activeCard = document.getElementById(`gift-card-${randomTemp.id}`);
      if (activeCard) activeCard.classList.add('highlighted');

      shuffleCount++;
      if (shuffleCount >= maxShuffles) {
        clearInterval(shuffleInterval);

        // Determine final gift
        const finalGift = gifts[Math.floor(Math.random() * gifts.length)];
        
        giftBoxIcon.innerText = finalGift.icon;
        giftBoxTitle.innerText = `SELAMAT! 🎉 Kamu dapat ${finalGift.name}`;
        drawBtnText.innerText = "🎁 Buka Kotak Hadiah! 🎁";
        giftBoxIcon.classList.remove('shuffling');

        // Highlight winning card
        document.querySelectorAll('.gift-card').forEach(c => c.classList.remove('highlighted'));
        const winningCard = document.getElementById(`gift-card-${finalGift.id}`);
        if (winningCard) winningCard.classList.add('highlighted');

        // Confetti Heart Explosion
        const rect = drawGiftBtn.getBoundingClientRect();
        triggerHeartExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);

        // Open Modal after short delay
        setTimeout(() => {
          showGiftModal(finalGift);
          isDrawingGift = false;
          drawGiftBtn.disabled = false;
        }, 600);
      }
    }, intervalTime);
  }

  function showGiftModal(gift) {
    if (!giftModalOverlay) return;
    modalGiftIcon.innerText = gift.icon;
    modalGiftName.innerText = gift.name;
    modalGiftDesc.innerText = gift.desc;

    // Prepare WhatsApp claim link
    const waText = encodeURIComponent(`Halo Sayang! ❤️ Aku dapet hadiah ulang tahun *${gift.name}* (${gift.icon}) dari website spesialmu! Makasih banyak yaa sayang! 💖✨`);
    claimWaBtn.href = `https://api.whatsapp.com/send?text=${waText}`;

    giftModalOverlay.classList.add('active');

    // Extra burst of hearts for celebration
    triggerHeartExplosion(window.innerWidth / 2, window.innerHeight / 2, 35);
  }

  function hideModal() {
    if (giftModalOverlay) giftModalOverlay.classList.remove('active');
  }

  drawGiftBtn.addEventListener('click', drawRandomGift);
  if (closeGiftModal) closeGiftModal.addEventListener('click', hideModal);
  if (reDrawBtn) reDrawBtn.addEventListener('click', () => {
    hideModal();
    setTimeout(drawRandomGift, 300);
  });

  // Close modal on backdrop click
  if (giftModalOverlay) {
    giftModalOverlay.addEventListener('click', (e) => {
      if (e.target === giftModalOverlay) hideModal();
    });
  }
}
