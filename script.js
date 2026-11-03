/**
 * Kissna & Dhaval Wedding Invitation
 * Interactive Script
 */

document.addEventListener("DOMContentLoaded", () => {
  if (typeof WEDDING_CONFIG === "undefined") {
    console.error("Wedding configuration (config.js) not found.");
    return;
  }

  // ==========================================================================
  // 1. POPULATE DYNAMIC DATA FROM CONFIG
  // ==========================================================================

  // Couple Info
  const bride = WEDDING_CONFIG.couple.bride;
  const groom = WEDDING_CONFIG.couple.groom;
  const coupleNames = `${bride.name} & ${groom.name}`;

  // Update Titles and Hero
  document.title = `Wedding Invitation | ${coupleNames}`;
  
  const heroNamesEl = document.getElementById("hero-names");
  if (heroNamesEl) {
    heroNamesEl.innerHTML = `${bride.name} <span class="connector">&</span> ${groom.name}`;
  }

  const footerNamesEl = document.getElementById("footer-names");
  if (footerNamesEl) {
    footerNamesEl.textContent = coupleNames;
  }

  const heroDateEl = document.getElementById("hero-date");
  if (heroDateEl) {
    heroDateEl.textContent = WEDDING_CONFIG.dateString;
  }

  // Populate Bride Card
  const bridePhotoEl = document.getElementById("bride-photo");
  if (bridePhotoEl) bridePhotoEl.src = bride.photo;

  const brideNameEl = document.getElementById("bride-name");
  if (brideNameEl) brideNameEl.textContent = bride.fullName || bride.name;

  const brideParentsEl = document.getElementById("bride-parents");
  if (brideParentsEl) {
    brideParentsEl.innerHTML = `<i class="fa-solid fa-heart-circle-bolt"></i> ${bride.parents}`;
  }

  const brideBioEl = document.getElementById("bride-bio");
  if (brideBioEl) brideBioEl.textContent = `"${bride.bio}"`;

  // Populate Groom Card
  const groomPhotoEl = document.getElementById("groom-photo");
  if (groomPhotoEl) groomPhotoEl.src = groom.photo;

  const groomNameEl = document.getElementById("groom-name");
  if (groomNameEl) groomNameEl.textContent = groom.fullName || groom.name;

  const groomParentsEl = document.getElementById("groom-parents");
  if (groomParentsEl) {
    groomParentsEl.innerHTML = `<i class="fa-solid fa-heart-circle-bolt"></i> ${groom.parents}`;
  }

  const groomBioEl = document.getElementById("groom-bio");
  if (groomBioEl) groomBioEl.textContent = `"${groom.bio}"`;

  // Populate Countdown Section
  const cdPhotoEl = document.getElementById("countdown-couple-photo");
  if (cdPhotoEl) cdPhotoEl.src = WEDDING_CONFIG.countdownCouplePhoto;

  const quoteEl = document.getElementById("romantic-quote");
  if (quoteEl) quoteEl.textContent = `"${WEDDING_CONFIG.romanticQuote}"`;

  // Render Wedding Events
  const eventGrid = document.getElementById("event-grid");
  if (eventGrid && WEDDING_CONFIG.events) {
    eventGrid.innerHTML = "";
    WEDDING_CONFIG.events.forEach(event => {
      const card = document.createElement("div");
      card.className = "event-card";
      card.innerHTML = `
        <div class="event-card-body">
          <div class="event-icon-wrap">
            <img src="${event.icon}" alt="${event.title} icon">
          </div>
          <h3>${event.title}</h3>
          <div class="event-details">
            <div class="event-detail-row">
              <i class="fa-regular fa-calendar-days"></i>
              <div><strong>Date:</strong> ${event.dayName ? event.dayName + ', ' : ''}${event.date}</div>
            </div>
            <div class="event-detail-row">
              <i class="fa-regular fa-clock"></i>
              <div><strong>Time:</strong> ${event.time}</div>
            </div>
            <div class="event-detail-row">
              <i class="fa-solid fa-hotel"></i>
              <div><strong>Venue:</strong> ${event.venue}</div>
            </div>
            <div class="event-detail-row">
              <i class="fa-solid fa-location-dot"></i>
              <div><strong>Address:</strong> ${event.address}</div>
            </div>
          </div>
        </div>
        <div class="event-card-action">
          <a href="${event.mapLink}" target="_blank" rel="noopener noreferrer" class="btn-outline-gold">
            <i class="fa-solid fa-diamond-turn-right"></i> Get Directions
          </a>
        </div>
      `;
      eventGrid.appendChild(card);
    });
  }

  // Render Photo Gallery
  const galleryGrid = document.getElementById("gallery-grid");
  let currentGalleryIndex = 0;

  if (galleryGrid && WEDDING_CONFIG.gallery) {
    galleryGrid.innerHTML = "";
    WEDDING_CONFIG.gallery.forEach((item, index) => {
      const el = document.createElement("div");
      el.className = "gallery-item";
      el.dataset.index = index;
      el.innerHTML = `
        <img src="${item.src}" alt="${item.title}" loading="lazy">
        <div class="gallery-overlay">
          <div class="gallery-overlay-icon">
            <i class="fa-solid fa-magnifying-glass-plus"></i>
          </div>
          <h4 class="gallery-item-title">${item.title}</h4>
          <p class="gallery-item-caption">${item.caption}</p>
        </div>
      `;
      el.addEventListener("click", () => openLightbox(index));
      galleryGrid.appendChild(el);
    });
  }

  // ==========================================================================
  // 2. BACKGROUND MUSIC & AUDIO CONTROLLER
  // ==========================================================================
  let bgMusic = null;
  let isPlaying = false;
  const musicToggleBtn = document.getElementById("btn-toggle-music");

  if (WEDDING_CONFIG.musicUrl) {
    bgMusic = new Audio(WEDDING_CONFIG.musicUrl);
    bgMusic.loop = true;
    bgMusic.volume = 0.45;

    bgMusic.addEventListener("play", () => {
      isPlaying = true;
      if (musicToggleBtn) musicToggleBtn.classList.add("playing");
    });

    bgMusic.addEventListener("pause", () => {
      isPlaying = false;
      if (musicToggleBtn) musicToggleBtn.classList.remove("playing");
    });
  }

  function startMusic() {
    if (bgMusic && bgMusic.paused) {
      bgMusic.play().catch(err => {
        console.warn("Autoplay deferred until explicit click: ", err);
      });
    }
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener("click", () => {
      if (!bgMusic) return;
      if (bgMusic.paused) {
        bgMusic.play();
      } else {
        bgMusic.pause();
      }
    });
  }

  // ==========================================================================
  // 3. SPLASH SCREEN (ROYAL INVITATION ENVELOPE)
  // ==========================================================================
  const splashScreen = document.getElementById("splash-screen");
  const btnOpenInvitation = document.getElementById("btn-open-invitation");
  const splashContainer = document.querySelector(".splash-container");

  function openInvitation() {
    if (!splashScreen) return;
    splashScreen.classList.add("hidden");
    document.body.classList.remove("no-scroll");
    document.documentElement.classList.remove("no-scroll");
    startMusic();
  }

  if (btnOpenInvitation) {
    btnOpenInvitation.addEventListener("click", (e) => {
      e.stopPropagation();
      openInvitation();
    });
  }

  if (splashContainer) {
    splashContainer.addEventListener("click", openInvitation);
  }

  // ==========================================================================
  // 4. AUSPICIOUS LIVE COUNTDOWN TIMER
  // ==========================================================================
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  function updateCountdown() {
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    const target = new Date(WEDDING_CONFIG.weddingDate).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      const badge = document.querySelector(".countdown-header p");
      if (badge) badge.textContent = "Happily Married! May God bless Kissna & Dhaval!";
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = d < 10 ? `0${d}` : d;
    hoursEl.textContent = h < 10 ? `0${h}` : h;
    minutesEl.textContent = m < 10 ? `0${m}` : m;
    secondsEl.textContent = s < 10 ? `0${s}` : s;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ==========================================================================
  // 5. LIGHTBOX MODAL WITH NAVIGATION
  // ==========================================================================
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxCounter = document.getElementById("lightbox-counter");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");

  function openLightbox(index) {
    if (!lightbox || !WEDDING_CONFIG.gallery || !WEDDING_CONFIG.gallery[index]) return;
    currentGalleryIndex = index;
    const item = WEDDING_CONFIG.gallery[index];

    lightboxImg.src = item.src;
    lightboxTitle.textContent = item.title;
    lightboxCaption.textContent = item.caption;
    lightboxCounter.textContent = `${index + 1} / ${WEDDING_CONFIG.gallery.length}`;

    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  function showNextPhoto() {
    if (!WEDDING_CONFIG.gallery) return;
    currentGalleryIndex = (currentGalleryIndex + 1) % WEDDING_CONFIG.gallery.length;
    openLightbox(currentGalleryIndex);
  }

  function showPrevPhoto() {
    if (!WEDDING_CONFIG.gallery) return;
    currentGalleryIndex = (currentGalleryIndex - 1 + WEDDING_CONFIG.gallery.length) % WEDDING_CONFIG.gallery.length;
    openLightbox(currentGalleryIndex);
  }

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener("click", showNextPhoto);
  if (lightboxPrev) lightboxPrev.addEventListener("click", showPrevPhoto);

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Traditional Lagna Patrika Booklet Viewer (Multi-page PDF / Gallery)
  const cardModal = document.getElementById("card-modal");
  const btnViewCard = document.getElementById("btn-view-card");
  const cardModalClose = document.getElementById("card-modal-close");
  const cardModalPrev = document.getElementById("card-modal-prev");
  const cardModalNext = document.getElementById("card-modal-next");
  const cardModalImg = document.getElementById("card-modal-img");
  const cardModalTitle = document.getElementById("card-modal-title");
  const cardModalCaption = document.getElementById("card-modal-caption");
  const cardModalCounter = document.getElementById("card-modal-counter");
  const cardModalDots = document.getElementById("card-modal-dots");

  const patrikaPages = WEDDING_CONFIG.patrika?.pages || [
    { src: "assets/patrika_page_1.jpg", title: "Traditional Lagna Patrika", caption: "Page 1 • Cover & Divine Ganesh Vandana" }
  ];
  let currentPatrikaIndex = 0;

  function renderPatrikaDots() {
    if (!cardModalDots) return;
    cardModalDots.innerHTML = "";
    patrikaPages.forEach((page, idx) => {
      const dot = document.createElement("button");
      dot.className = `patrika-dot ${idx === currentPatrikaIndex ? "active" : ""}`;
      dot.setAttribute("aria-label", `Go to page ${idx + 1}`);
      dot.textContent = `${idx + 1}`;
      dot.addEventListener("click", () => {
        showPatrikaPage(idx);
      });
      cardModalDots.appendChild(dot);
    });
  }

  function showPatrikaPage(index) {
    if (!patrikaPages.length) return;
    currentPatrikaIndex = (index + patrikaPages.length) % patrikaPages.length;
    const page = patrikaPages[currentPatrikaIndex];

    if (cardModalImg) {
      cardModalImg.style.opacity = "0.4";
      cardModalImg.src = page.src;
      cardModalImg.onload = () => {
        cardModalImg.style.opacity = "1";
      };
    }
    if (cardModalTitle) cardModalTitle.textContent = page.title;
    if (cardModalCaption) cardModalCaption.textContent = page.caption;
    if (cardModalCounter) cardModalCounter.textContent = `Page ${currentPatrikaIndex + 1} of ${patrikaPages.length}`;

    if (cardModalDots) {
      const dots = cardModalDots.querySelectorAll(".patrika-dot");
      dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === currentPatrikaIndex);
      });
    }
  }

  function showNextPatrikaPage() {
    showPatrikaPage(currentPatrikaIndex + 1);
  }

  function showPrevPatrikaPage() {
    showPatrikaPage(currentPatrikaIndex - 1);
  }

  renderPatrikaDots();

  if (btnViewCard && cardModal) {
    btnViewCard.addEventListener("click", () => {
      showPatrikaPage(0);
      cardModal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  }

  if (cardModalClose && cardModal) {
    cardModalClose.addEventListener("click", () => {
      cardModal.classList.remove("active");
      document.body.style.overflow = "auto";
    });
  }

  if (cardModalPrev) {
    cardModalPrev.addEventListener("click", (e) => {
      e.stopPropagation();
      showPrevPatrikaPage();
    });
  }

  if (cardModalNext) {
    cardModalNext.addEventListener("click", (e) => {
      e.stopPropagation();
      showNextPatrikaPage();
    });
  }

  if (cardModal) {
    cardModal.addEventListener("click", (e) => {
      if (e.target === cardModal) {
        cardModal.classList.remove("active");
        document.body.style.overflow = "auto";
      }
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    cardModal.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    cardModal.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        showNextPatrikaPage();
      } else if (touchEndX - touchStartX > 50) {
        showPrevPatrikaPage();
      }
    }, { passive: true });
  }

  // Keyboard navigation for Lightbox and Card Modal
  document.addEventListener("keydown", (e) => {
    if (lightbox && lightbox.classList.contains("active")) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNextPhoto();
      if (e.key === "ArrowLeft") showPrevPhoto();
    }
    if (cardModal && cardModal.classList.contains("active")) {
      if (e.key === "Escape") {
        cardModal.classList.remove("active");
        document.body.style.overflow = "auto";
      }
      if (e.key === "ArrowRight") showNextPatrikaPage();
      if (e.key === "ArrowLeft") showPrevPatrikaPage();
    }
  });

  // ==========================================================================
  // 6. ADD TO CALENDAR (.ICS FILE DOWNLOAD)
  // ==========================================================================
  const btnAddCalendar = document.getElementById("btn-add-calendar");
  if (btnAddCalendar) {
    btnAddCalendar.addEventListener("click", () => {
      const icsData = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Kissna and Dhaval//Wedding Invitation//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        "UID:wedding-kissna-dhaval-2027@nakhatrana",
        "DTSTART:20270116T032700Z",
        "DTEND:20270117T083000Z",
        "SUMMARY:Kissna & Dhaval Wedding Celebrations",
        "DESCRIPTION:Join us to celebrate the wedding ceremonies of Kissna & Dhaval! Mandava: 16 Jan 8:57 AM, Mameru: 16 Jan 3:00 PM, Hasthmelap: 17 Jan 10:19 AM.",
        "LOCATION:Vidhyarthi Bhavan (Boarding), Nakhatrana, Bhuj Kutch, Gujarat 370615",
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Kissna_and_Dhaval_Wedding.ics");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  // ==========================================================================
  // 7. RSVP & BLESSINGS GUESTBOOK
  // ==========================================================================
  const rsvpForm = document.getElementById("rsvp-form");
  const wishesBoard = document.getElementById("wishes-board");
  const wishesCountEl = document.getElementById("wishes-count");
  const STORAGE_KEY = "wedding_wishes_kissna_dhaval";

  const defaultWishes = [
    {
      name: "Leelaben & Vijay Haribhai Somjiyani",
      attendance: "yes",
      message: "May God shower you both with boundless happiness, health, and prosperity on this sacred journey of marriage. We love you dearly!"
    },
    {
      name: "Shilaben & Kishorbhai Madhavji Bhagat",
      attendance: "yes",
      message: "Heartiest congratulations to our dearest Dhaval and our lovely daughter Kissna! Wishing you a lifetime of joy, harmony, and togetherness."
    },
    {
      name: "Chirag & Pooja Somjiyani",
      attendance: "yes",
      message: "So thrilled and ecstatic for you two! Wishing you an eternity of laughter, adventure, and endless love. Can't wait to dance at the ceremonies!"
    }
  ];

  function getWishes() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultWishes));
        return defaultWishes;
      }
      return JSON.parse(stored);
    } catch (e) {
      return defaultWishes;
    }
  }

  function displayWishes() {
    if (!wishesBoard) return;
    const wishes = getWishes();
    wishesBoard.innerHTML = "";

    if (wishesCountEl) {
      wishesCountEl.textContent = `${wishes.length} ${wishes.length === 1 ? 'Wish' : 'Wishes'}`;
    }

    [...wishes].reverse().forEach(wish => {
      const card = document.createElement("div");
      card.className = "wish-card";

      const isAttending = wish.attendance === "yes" || wish.attendance === "yes_single";
      const badgeClass = isAttending ? "attending" : "afar";
      const badgeText = isAttending ? "✓ Joyfully Attending" : "♡ Warm Wishes from Afar";

      card.innerHTML = `
        <div class="wish-header">
          <span class="wish-author">${escapeHtml(wish.name)}</span>
          <span class="wish-badge ${badgeClass}">${badgeText}</span>
        </div>
        <p class="wish-message">"${escapeHtml(wish.message)}"</p>
      `;
      wishesBoard.appendChild(card);
    });
  }

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("rsvp-name").value.trim();
      const attendance = document.getElementById("rsvp-attendance").value;
      const message = document.getElementById("rsvp-message").value.trim();

      if (!name || !attendance || !message) {
        alert("Please complete all required fields.");
        return;
      }

      const wishes = getWishes();
      wishes.push({ name, attendance, message });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));

      displayWishes();
      rsvpForm.reset();

      alert(`Thank you so much, ${name}! Your warm wishes have been posted and your RSVP is confirmed.`);
    });

    displayWishes();
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // ==========================================================================
  // 8. FALLING ROSE & GOLD PETALS CANVAS
  // ==========================================================================
  const canvas = document.getElementById("petals-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const petalCount = 28;
    const petals = [];

    const colors = [
      "rgba(212, 163, 89, 0.6)",   // Gold
      "rgba(235, 204, 150, 0.7)",  // Soft Gold
      "rgba(164, 90, 108, 0.55)",  // Rose Pink
      "rgba(197, 120, 138, 0.5)"   // Blush
    ];

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        r: Math.random() * 6 + 4,
        d: Math.random() * petalCount,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleInc: (Math.random() * 0.07) + 0.04,
        tiltAngle: 0,
        speed: (Math.random() * 1.2) + 0.6
      });
    }

    let animationFrameId;
    function drawPetals() {
      ctx.clearRect(0, 0, width, height);

      petals.forEach(p => {
        p.tiltAngle += p.tiltAngleInc;
        p.y += p.speed;
        p.x += Math.sin(p.d) * 0.8;
        p.tilt = Math.sin(p.tiltAngle - (p.d / 3)) * 15;

        ctx.beginPath();
        ctx.lineWidth = p.r / 2;
        ctx.strokeStyle = p.color;
        ctx.fillStyle = p.color;

        // Draw oval petal shape
        ctx.ellipse(
          p.x + p.tilt, 
          p.y, 
          p.r, 
          p.r * 1.6, 
          (p.tilt * Math.PI) / 180, 
          0, 
          2 * Math.PI
        );
        ctx.fill();

        // Wrap around when petal falls below screen
        if (p.y > height) {
          p.x = Math.random() * width;
          p.y = -20;
          p.tilt = Math.floor(Math.random() * 10) - 10;
        }
      });

      animationFrameId = requestAnimationFrame(drawPetals);
    }

    drawPetals();
  }
});
