/* The offset is not optional. Without it the browser reads the string in the
   guest's own timezone, so the same page counted down to 09:00 in Saigon, in
   Tokyo and in California alike. 09:00 +07:00 is the Lễ Vu Quy, the first
   event on the day's schedule. */
const weddingDate = new Date("2026-09-27T09:00:00+07:00").getTime();

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

/* Run once the image has pixels, whether it already has them or is still to
   get them. The obvious spelling, "if complete, check naturalWidth, else wait
   for load", quietly drops any image that has no src yet: such an image counts
   as complete with a natural width of zero, so neither branch ever fires. */
function whenLoaded(image, run) {
  if (image.complete && image.naturalWidth > 0) {
    run();
  } else {
    image.addEventListener("load", run, { once: true });
  }
}

/* ---------- Sealed envelope ---------- */

const overlay = document.getElementById("envelopeOverlay");
const openButton = document.getElementById("openInvite");
const sealPhoto = document.getElementById("sealPhoto");
const sealFace = document.getElementById("sealFace");

/* A photograph of the real stamp takes over from the drawn wax when present */
if (sealPhoto && sealFace) {
  const useSealPhoto = () => {
    sealPhoto.hidden = false;
    sealFace.classList.add("has-photo");
  };

  whenLoaded(sealPhoto, useSealPhoto);
}

/* Images the page can do without until the guest asks for them. They cannot
   be lazy-loaded: each is hidden until it loads, and a lazy image inside a
   display:none box never enters the viewport, so it would wait for a scroll
   that can never reach it. Both features already need JS to appear at all, so
   holding the URL back costs nothing. */
function loadDeferred(image) {
  if (!image || !image.dataset.src) return;
  if (image.dataset.srcset) image.srcset = image.dataset.srcset;
  image.src = image.dataset.src;
  delete image.dataset.src;
  delete image.dataset.srcset;
}

const countdownSection = document.getElementById("countdownSection");
const countdownPhoto = document.getElementById("countdownPhoto");

/* The countdown becomes a photo band only once there is a photo to band with.
   Until then it stays the flat section it is now, rather than showing a hole. */
if (countdownSection && countdownPhoto) {
  const usePhoto = () => countdownSection.classList.add("has-photo");

  whenLoaded(countdownPhoto, usePhoto);
}

const logoPhoto = document.getElementById("logoPhoto");
const logoMark = document.getElementById("logoMark");

/* Artwork of the real monogram replaces the drawn one when it is supplied */
if (logoPhoto && logoMark) {
  // .hidden is an HTMLElement property; logoMark is an SVG element, so
  // assigning it would set a stray JS property and leave the mark on screen.
  const useLogoPhoto = () => {
    logoPhoto.hidden = false;
    logoMark.setAttribute("hidden", "");
  };

  whenLoaded(logoPhoto, useLogoPhoto);
}

/* The overlay blocks pointer events and body scroll is locked in CSS, so the
   guest cannot do anything else while the envelope is opening. */
let pageUnlocked = false;

function unlockPage() {
  if (pageUnlocked) return;
  pageUnlocked = true;

  document.body.classList.remove("is-sealed");
  document.body.classList.remove("is-revealing");
  document.body.classList.add("invite-open");

  // The page sets scroll-behavior: smooth, so an animated scroll here would
  // fight the guest's first gesture. Jump instead.
  window.scrollTo({ top: 0, behavior: "instant" });

  loadDeferred(countdownPhoto);

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

      /* Release the moment the last flap actually lands. A padded timeout left
         a gap where the card looked finished but the overlay still swallowed
         the first scroll. The timeout below is only a safety net. */
      const lastFlap = overlay.querySelector(".env-flap-bottom");
      const release = () => {
        overlay.remove();
        unlockPage();
      };

      if (lastFlap) {
        lastFlap.addEventListener("transitionend", release, { once: true });
      }
      window.setTimeout(release, 2200);
    },
    { once: true }
  );
} else {
  document.body.classList.add("invite-open");
}

/* ---------- Dialogs ---------- */

/* showModal() does not stop the page behind it from scrolling, so the body has
   to be pinned. Reading the open dialogs rather than counting opens and closes
   keeps this right no matter the order: close() queues its event, so a form
   that closes one dialog and opens the next would otherwise unlock underneath
   the new one. */
let scrollLocked = false;

function syncScrollLock() {
  const anyOpen = document.querySelector("dialog[open]") !== null;
  if (anyOpen === scrollLocked) return;
  scrollLocked = anyOpen;

  if (anyOpen) {
    // Hiding the scrollbar would otherwise shift the whole page sideways.
    const gap = window.innerWidth - document.documentElement.clientWidth;
    if (gap > 0) document.body.style.paddingRight = gap + "px";
    document.body.classList.add("modal-open");
  } else {
    document.body.classList.remove("modal-open");
    document.body.style.paddingRight = "";
  }
}

function openDialog(dialog) {
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
  syncScrollLock();
}

/* One opener for every dialog on the page */
function wireDialog(dialog, opener, closer) {
  if (!dialog) return;

  if (opener) {
    opener.addEventListener("click", () => openDialog(dialog));
  }

  if (closer) {
    closer.addEventListener("click", () => dialog.close());
  }

  // Clicking the backdrop area closes it too
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  // Covers the close button, the backdrop and the Escape key alike
  dialog.addEventListener("close", syncScrollLock);
}


const giftDialog = document.getElementById("giftDialog");
const openGift = document.getElementById("openGift");
const closeGift = document.getElementById("closeGift");

/* A QR only earns its space once the image is actually there. The save link
   rides with it, since there is nothing to save otherwise. */
function wireQr(imageId, frameId, saveId) {
  const image = document.getElementById(imageId);
  const frame = document.getElementById(frameId);
  const save = document.getElementById(saveId);
  if (!image || !frame || !save) return;

  const show = () => {
    frame.hidden = false;
    save.hidden = false;
  };

  whenLoaded(image, show);
}

wireQr("groomQr", "groomQrFrame", "groomQrSave");
wireQr("brideQr", "brideQrFrame", "brideQrSave");

wireDialog(giftDialog, openGift, closeGift);

if (openGift) {
  openGift.addEventListener("click", () => {
    loadDeferred(document.getElementById("groomQr"));
    loadDeferred(document.getElementById("brideQr"));
  });
}

const rsvpDialog = document.getElementById("rsvpDialog");
const thanksDialog = document.getElementById("thanksDialog");

wireDialog(rsvpDialog, document.getElementById("openRsvp"), document.getElementById("closeRsvp"));
wireDialog(thanksDialog, null, document.getElementById("closeThanks"));

const closeThanksBtn = document.getElementById("closeThanksBtn");
if (closeThanksBtn && thanksDialog) {
  closeThanksBtn.addEventListener("click", () => thanksDialog.close());
}

/* The RSVP form: the guest count only appears for someone who is coming, and
   the submit stays shut until there is both a name and an answer. */
const rsvpForm = document.getElementById("rsvpForm");
const thanksText = document.getElementById("thanksText");
const rsvpName = document.getElementById("rsvpName");
const rsvpSubmit = document.getElementById("rsvpSubmit");
const guestField = document.getElementById("guestField");
const guestCount = document.getElementById("guestCount");
const guestMinus = document.getElementById("guestMinus");
const guestPlus = document.getElementById("guestPlus");

function attendingChoice() {
  return rsvpForm ? rsvpForm.querySelector('input[name="attending"]:checked') : null;
}

function syncRsvpState() {
  if (!rsvpForm) return;

  const choice = attendingChoice();
  const coming = Boolean(choice) && choice.value === "yes";

  // Backs up the :has() styling for browsers that lack it
  rsvpForm.querySelectorAll(".choice-row").forEach((row) => {
    const input = row.querySelector('input[type="radio"]');
    row.classList.toggle("is-selected", Boolean(input && input.checked));
  });

  if (guestField) guestField.hidden = !coming;
  if (rsvpSubmit) {
    rsvpSubmit.disabled = !(rsvpName && rsvpName.value.trim() && choice);
  }
}

function syncStepper() {
  if (!guestCount) return;

  const value = Number(guestCount.value) || 1;
  const min = Number(guestCount.min) || 1;
  const max = Number(guestCount.max) || 20;
  const clamped = Math.min(Math.max(value, min), max);

  if (clamped !== value) guestCount.value = String(clamped);
  if (guestMinus) guestMinus.disabled = clamped <= min;
  if (guestPlus) guestPlus.disabled = clamped >= max;
}

function stepGuests(delta) {
  if (!guestCount) return;
  guestCount.value = String((Number(guestCount.value) || 1) + delta);
  syncStepper();
}

if (rsvpForm) {
  rsvpForm.addEventListener("change", syncRsvpState);
  if (rsvpName) rsvpName.addEventListener("input", syncRsvpState);
  if (guestCount) guestCount.addEventListener("input", syncStepper);
  if (guestMinus) guestMinus.addEventListener("click", () => stepGuests(-1));
  if (guestPlus) guestPlus.addEventListener("click", () => stepGuests(1));

  syncRsvpState();
  syncStepper();

  /* Nowhere to post yet. The form closes and the thank you takes its place. */
  rsvpForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const choice = attendingChoice();
    const coming = Boolean(choice) && choice.value === "yes";

    if (thanksText) {
      thanksText.textContent = coming
        ? "Chúng mình đã nhận được xác nhận của bạn. Rất mong được gặp bạn trong ngày trọng đại!"
        : "Chúng mình đã nhận được phản hồi của bạn. Cảm ơn bạn đã cho chúng mình biết.";
    }

    if (rsvpDialog) rsvpDialog.close();
    if (thanksDialog) openDialog(thanksDialog);
  });
}

/* ---------- Album rail ---------- */

/* An endless rail. Snapping, momentum, touch and arrow keys stay the
   browser's own; script clones the plates so there is always a photograph on
   both sides, jumps the scroll position back to the middle copy when the
   guest reaches an edge, and lets a mouse drag the rail the way a finger
   already could. */
const albumRail = document.getElementById("albumRail");

if (albumRail) {
  const source = [...albumRail.querySelectorAll(".album-plate")];
  const count = source.length;
  const prev = document.getElementById("albumPrev");
  const next = document.getElementById("albumNext");
  const index = document.getElementById("albumIndex");
  const total = document.getElementById("albumTotal");
  const pad = (n) => String(n).padStart(2, "0");

  if (total) total.textContent = pad(count);

  /* A copy of the run before and after the real one. The clones are scenery:
     they carry no alt text and are hidden from assistive technology, so the
     album is still twelve photographs to a screen reader, not thirty-six. */
  const copies = [document.createDocumentFragment(), document.createDocumentFragment()];
  source.forEach((plate) => {
    copies.forEach((into) => {
      const clone = plate.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      const image = clone.querySelector("img");
      if (image) image.alt = "";
      into.appendChild(clone);
    });
  });
  albumRail.insertBefore(copies[0], albumRail.firstChild);
  albumRail.appendChild(copies[1]);

  const plates = [...albumRail.querySelectorAll(".album-plate")];
  const middle = (n) => plates[count + n];

  let runWidth = 0;
  let current = -1;

  const measure = () => {
    runWidth = plates[count].offsetLeft - plates[0].offsetLeft;
  };

  const centreOf = (plate) =>
    plate.offsetLeft - (albumRail.clientWidth - plate.clientWidth) / 2;

  /* Moving the scroll position by exactly one run lands on an identical
     photograph, so the jump is invisible. Snapping has to be off for the
     instant it takes, or the browser fights the reposition. */
  const shift = (by) => {
    albumRail.style.scrollSnapType = "none";
    albumRail.scrollLeft += by;
    albumRail.style.scrollSnapType = "";
  };

  const keepCentred = () => {
    if (!runWidth) return;
    if (albumRail.scrollLeft < runWidth * 0.5) shift(runWidth);
    else if (albumRail.scrollLeft > runWidth * 2.5) shift(-runWidth);
  };

  /* Distance from the centre, not overlap: several plates are fully visible at
     once on a wide screen, and asking an observer alone which one was showing
     left the count stuck on the last plate to report. */
  const settledOn = () => {
    const mid = albumRail.scrollLeft + albumRail.clientWidth / 2;
    let best = 0;
    let nearest = Infinity;

    plates.forEach((plate, n) => {
      const away = Math.abs(plate.offsetLeft + plate.clientWidth / 2 - mid);
      if (away < nearest) {
        nearest = away;
        best = n;
      }
    });

    return ((best % count) + count) % count;
  };

  const sync = () => {
    keepCentred();
    const n = settledOn();
    if (n === current) return;
    current = n;
    if (index) index.textContent = pad(n + 1);
  };

  const step = (by) => {
    const plate = middle(((current + by) % count + count) % count);
    if (!plate) return;
    albumRail.scrollTo({
      left: centreOf(plate),
      behavior: prefersReducedMotion ? "instant" : "smooth",
    });
  };

  if (prev) prev.addEventListener("click", () => step(-1));
  if (next) next.addEventListener("click", () => step(1));

  /* The observer is only the signal that the rail moved; the answers come from
     the measurements above. A scroll handler would do the same job worse. */
  if ("IntersectionObserver" in window) {
    const watcher = new IntersectionObserver(sync, {
      root: albumRail,
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    plates.forEach((plate) => watcher.observe(plate));
  }

  /* A finger can already drag the rail. A mouse could only press the arrows,
     so it gets the same grip. Touch is left alone: the browser does it better. */
  let holding = false;
  let grabbedAt = 0;
  let grabbedFrom = 0;

  const release = () => {
    if (!holding) return;
    holding = false;
    albumRail.classList.remove("is-dragging");
    // restoring the property lets the browser settle on the nearest plate
    albumRail.style.scrollSnapType = "";
  };

  albumRail.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    holding = true;
    grabbedAt = event.clientX;
    grabbedFrom = albumRail.scrollLeft;
    albumRail.classList.add("is-dragging");
    albumRail.style.scrollSnapType = "none";
    albumRail.setPointerCapture(event.pointerId);
  });

  albumRail.addEventListener("pointermove", (event) => {
    if (!holding) return;
    event.preventDefault();
    albumRail.scrollLeft = grabbedFrom - (event.clientX - grabbedAt);
  });

  albumRail.addEventListener("pointerup", release);
  albumRail.addEventListener("pointercancel", release);

  const settle = () => {
    measure();
    if (current < 0) {
      albumRail.scrollLeft = centreOf(middle(0));
      current = 0;
      if (index) index.textContent = pad(1);
    } else {
      albumRail.scrollLeft = centreOf(middle(current));
    }
  };

  if ("ResizeObserver" in window) {
    const resized = new ResizeObserver(() => settle());
    resized.observe(albumRail);
    plates.forEach((plate) => resized.observe(plate));
  }

  settle();
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
