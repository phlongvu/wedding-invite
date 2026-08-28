const weddingDate = new Date("2026-09-27T08:00:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  const els = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
  };

  if (!els.days) return;

  if (distance <= 0) {
    els.days.textContent = "00";
    els.hours.textContent = "00";
    els.minutes.textContent = "00";
    els.seconds.textContent = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  els.days.textContent = String(days).padStart(2, "0");
  els.hours.textContent = String(hours).padStart(2, "0");
  els.minutes.textContent = String(minutes).padStart(2, "0");
  els.seconds.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

/* ---------- Background music ---------- */

const music = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
let musicAvailable = Boolean(music && musicToggle);

function setMusicState(playing) {
  if (!musicToggle) return;
  musicToggle.setAttribute("aria-pressed", playing ? "true" : "false");
}

/* Nothing to offer if the track file is missing, so the control stays hidden. */
if (music) {
  music.addEventListener("error", () => {
    musicAvailable = false;
    if (musicToggle) musicToggle.hidden = true;
  });
}

function startMusic() {
  if (!musicAvailable || !music) return;

  music.volume = 0.45;
  const attempt = music.play();

  if (attempt && typeof attempt.then === "function") {
    attempt
      .then(() => {
        musicToggle.hidden = false;
        setMusicState(true);
      })
      .catch(() => {
        // Autoplay refused: still offer the control so the guest can start it.
        musicToggle.hidden = false;
        setMusicState(false);
      });
  }
}

if (musicToggle) {
  musicToggle.addEventListener("click", () => {
    if (!music) return;

    if (music.paused) {
      const attempt = music.play();
      if (attempt && typeof attempt.then === "function") {
        attempt.then(() => setMusicState(true)).catch(() => setMusicState(false));
      } else {
        setMusicState(true);
      }
    } else {
      music.pause();
      setMusicState(false);
    }
  });
}

/* ---------- Sealed envelope ---------- */

const overlay = document.getElementById("envelopeOverlay");
const openButton = document.getElementById("openInvite");

/* The overlay blocks pointer events and body scroll is locked in CSS, so the
   guest cannot do anything else while the envelope is opening. */
function unlockPage() {
  document.body.classList.remove("is-sealed");
  document.body.classList.add("invite-open");
  window.scrollTo(0, 0);

  const firstSection = document.querySelector(".save-the-date");
  if (firstSection) {
    firstSection.setAttribute("tabindex", "-1");
    firstSection.focus({ preventScroll: true });
  }
}

if (overlay && openButton) {
  document.body.classList.add("is-sealed");

  openButton.addEventListener(
    "click",
    () => {
      openButton.disabled = true;
      // The press is a real user gesture, so audio is allowed to start here.
      startMusic();

      if (prefersReducedMotion) {
        overlay.remove();
        unlockPage();
        return;
      }

      overlay.classList.add("is-opening");
      document.body.classList.add("is-revealing");

      window.setTimeout(() => {
        overlay.remove();
        unlockPage();
      }, 2250);
    },
    { once: true }
  );
} else {
  document.body.classList.add("invite-open");
}

/* ---------- Gift dialog ---------- */

const giftDialog = document.getElementById("giftDialog");
const openGift = document.getElementById("openGift");
const closeGift = document.getElementById("closeGift");
const giftQr = document.getElementById("giftQr");
const qrMissing = document.getElementById("qrMissing");

if (giftQr && qrMissing) {
  const showQrFallback = () => {
    giftQr.hidden = true;
    qrMissing.hidden = false;
  };

  giftQr.addEventListener("error", showQrFallback);

  // The image may have already failed before this script ran.
  if (giftQr.complete && giftQr.naturalWidth === 0) {
    showQrFallback();
  }
}

if (giftDialog && openGift) {
  openGift.addEventListener("click", () => {
    if (typeof giftDialog.showModal === "function") {
      giftDialog.showModal();
    } else {
      giftDialog.setAttribute("open", "");
    }
  });
}

if (giftDialog && closeGift) {
  closeGift.addEventListener("click", () => {
    if (typeof giftDialog.close === "function") {
      giftDialog.close();
    } else {
      giftDialog.removeAttribute("open");
    }
  });
}

/* Clicking the backdrop area closes the dialog too */
if (giftDialog) {
  giftDialog.addEventListener("click", (event) => {
    if (event.target === giftDialog) {
      giftDialog.close();
    }
  });
}

const copyBank = document.getElementById("copyBank");
const bankNumber = document.getElementById("bankNumber");

if (copyBank && bankNumber && navigator.clipboard) {
  copyBank.addEventListener("click", () => {
    navigator.clipboard
      .writeText(bankNumber.textContent.trim())
      .then(() => {
        copyBank.textContent = "Đã chép";
        window.setTimeout(() => {
          copyBank.textContent = "Sao chép";
        }, 1800);
      })
      .catch(() => {
        copyBank.textContent = "Không chép được";
        window.setTimeout(() => {
          copyBank.textContent = "Sao chép";
        }, 1800);
      });
  });
} else if (copyBank) {
  copyBank.hidden = true;
}

/* ---------- Scroll reveal ---------- */

const revealEls = document.querySelectorAll(".reveal");

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealEls.forEach((el) => el.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));
}
