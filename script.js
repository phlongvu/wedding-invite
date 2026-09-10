/* Where the RSVP answers go. Paste the web app URL from the Apps Script
   deployment here; RSVP.md in the repository root walks through making it.
   Left empty, the form still thanks the guest and their answer goes nowhere,
   which is worth knowing before the invitations are sent. */
const RSVP_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwLoydBGCen58_RmEt1N392zPTEtjkTpQPjSihuYXEVCmyWB9LulxDtjqFtrBhzYmGRcQ/exec";

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

/* The band is painted the deep tone underneath, so the white names are legible
   from the first paint rather than flashing white on sand while the bytes are
   in the air. If the file never arrives at all, the footer drops back to the
   plain one it replaced. Lazy is right here and wrong for the countdown and
   the cut-out: this one sits in the flow at the foot of the page, so a guest
   who has scrolled this far has already asked for it. */
const footerPhoto = document.getElementById("footerPhoto");
const footer = document.getElementById("footer");

if (footerPhoto && footer) {
  footerPhoto.addEventListener("error", () => {
    footerPhoto.hidden = true;
    footer.classList.add("no-photo");
  });
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

/* ---------- Câu chuyện tình yêu ---------- */

/* How many photographs each set holds, and nothing else: the files are named
   by number, so the count is the whole manifest. Raise a count and the viewer
   picks the new photographs up; leave one at zero and that chapter takes
   itself off the page. */
/* Each set, and the pixel size of each photograph in it. The count is the
   length of the list, so the two can never disagree, and the sizes are real
   rather than assumed: this shoot mixes 2:3 with one landscape frame and the
   beach set is 3:4, so one ratio for all of them would reserve the wrong box
   and drop the page a step as each picture landed. */
const ALBUMS = {
  hoi: { title: "Lễ đám hỏi", shots: [[1200, 1801], [1200, 1801], [1200, 800], [1200, 1801], [1200, 1801], [1200, 1801]] },
  bien: { title: "Ngày ra biển", shots: [[1200, 1600], [1200, 1600], [1200, 1599], [1200, 1599], [1200, 1599], [1200, 1600], [1200, 1600], [1200, 1600]] },
};

const albumViewer = document.getElementById("albumViewer");
const viewerRoll = document.getElementById("viewerRoll");
const viewerTitle = document.getElementById("viewer-heading");

/* Built on first open, then kept. Writing forty image tags into the page would
   have the browser fetch them the moment the dialog opened even if the guest
   only wanted the first few; building them here means the roll costs nothing
   until it is asked for, and nothing again on a second visit. */
const built = new Set();

function fillViewer(key) {
  const album = ALBUMS[key];
  if (!album || !viewerRoll) return;

  if (viewerTitle) viewerTitle.textContent = album.title;

  if (!built.has(key)) {
    const roll = document.createDocumentFragment();
    album.shots.forEach(([w, h], i) => {
      const n = i + 1;
      const pad = String(n).padStart(2, "0");
      const image = document.createElement("img");
      image.src = `assets/${key}-${pad}-1200.jpg`;
      image.srcset = `assets/${key}-${pad}-600.jpg 600w, assets/${key}-${pad}-1200.jpg 1200w`;
      image.sizes = "(max-width: 760px) 88vw, 640px";
      image.width = w;
      image.height = h;
      image.decoding = "async";
      // the first is what the guest is looking at; the rest can wait
      if (n > 1) image.loading = "lazy";
      image.alt = n === 1 ? `${album.title}, ảnh của Phi Long và Kim Chi` : "";
      if (n > 1) image.setAttribute("aria-hidden", "true");
      roll.appendChild(image);
    });
    viewerRoll.replaceChildren(roll);
    built.add(key);
  } else {
    viewerRoll.scrollIntoView({ block: "start", behavior: "instant" });
  }

  if (albumViewer) albumViewer.scrollTop = 0;
}

if (albumViewer) {
  wireDialog(albumViewer, null, document.getElementById("closeViewer"));

  document.querySelectorAll(".chapter-more").forEach((button) => {
    const key = button.dataset.album;
    button.addEventListener("click", () => {
      fillViewer(key);
      openDialog(albumViewer);
    });
  });
}

/* A chapter with no photographs yet is not a chapter with broken pictures in
   it. The lead plate is the test: if the file is not there, the chapter goes,
   and when the last chapter goes the heading goes with it. */
function wireChapter(key, chapterId, leadId) {
  const chapter = document.getElementById(chapterId);
  const lead = document.getElementById(leadId);
  const button = chapter && chapter.querySelector(".chapter-more");
  if (!chapter || !lead) return;

  const drop = () => {
    chapter.hidden = true;
    const story = document.getElementById("story");
    if (story && !story.querySelector(".chapter:not([hidden])")) story.hidden = true;
  };

  lead.addEventListener("error", drop);
  if (!ALBUMS[key] || ALBUMS[key].shots.length < 1) drop();
  else if (button) {
    button.textContent = `Xem cả bộ, ${ALBUMS[key].shots.length} ảnh`;
  }
}

wireChapter("hoi", "chapterHoi", "hoiLead");
wireChapter("bien", "chapterBien", "bienLead");

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

const rsvpError = document.getElementById("rsvpError");
const rsvpTrap = document.getElementById("rsvpWebsite");
let sending = false;

/* crypto.randomUUID is not there over plain http or on older phones, and this
   only has to be unlikely to repeat, not unguessable. */
function newId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function showRsvpError(message) {
  if (!rsvpError) return;
  rsvpError.textContent = message;
  rsvpError.hidden = false;
}

function setSending(on) {
  sending = on;
  if (rsvpError) rsvpError.hidden = true;
  if (!rsvpSubmit) return;
  rsvpSubmit.disabled = on;
  rsvpSubmit.textContent = on ? "Đang gửi…" : "Gửi xác nhận";
}

/* Two goes at the same answer, and the sheet ignores the second.

   A web app on Apps Script answers through a redirect, and whether the browser
   is then allowed to read that answer varies by deployment. So the first
   request asks for the reply: when it arrives the answer is confirmed written.
   When it does not, the request itself still left and the row was still
   written, but there is no way to tell that apart from a script that fell
   over -- so it goes again in a mode where the browser never expects to read
   anything, which cannot be blocked for that reason.

   That second send is what the id is for. Both carry the same one, the sheet
   writes an id once, and the row cannot be duplicated. Only a request that
   never reached the network at all throws out of here. */
async function sendRsvp(answer) {
  if (!RSVP_ENDPOINT) {
    console.warn(
      "RSVP: chưa đặt RSVP_ENDPOINT trong script.js, câu trả lời không được lưu ở đâu cả. Xem RSVP.md."
    );
    return "unsent";
  }

  const body = new URLSearchParams(answer);

  try {
    const reply = await fetch(RSVP_ENDPOINT, { method: "POST", body, redirect: "follow" });
    const said = await reply.json();
    if (said && said.ok) return "confirmed";
    throw new Error(said && said.error ? said.error : "sheet refused");
  } catch (err) {
    await fetch(RSVP_ENDPOINT, { method: "POST", body, mode: "no-cors" });
    return "sent";
  }
}

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

  rsvpForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending) return;

    const choice = attendingChoice();
    const coming = Boolean(choice) && choice.value === "yes";

    const answer = {
      // One per press. The sheet drops a repeat of an id it has already
      // written, which is what makes sending twice safe (see sendRsvp).
      id: newId(),
      fullname: rsvpName ? rsvpName.value.trim() : "",
      attending: coming ? "yes" : "no",
      guests: coming ? String(Number(guestCount && guestCount.value) || 1) : "0",
      website: rsvpTrap ? rsvpTrap.value : "",
    };

    setSending(true);

    try {
      await sendRsvp(answer);
    } catch (err) {
      /* Only a request that never left lands here. The guest's answers are
         still in the form, so the press can simply be repeated. */
      setSending(false);
      showRsvpError(
        "Không gửi được, có vẻ mạng đang trục trặc. Bạn thử bấm lại giúp mình nhé."
      );
      return;
    }

    setSending(false);

    if (thanksText) {
      thanksText.textContent = coming
        ? "Chúng mình đã nhận được xác nhận của bạn. Rất mong được gặp bạn trong ngày trọng đại!"
        : "Chúng mình đã nhận được phản hồi của bạn. Cảm ơn bạn đã cho chúng mình biết.";
    }

    rsvpForm.reset();
    syncRsvpState();
    syncStepper();

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
  const dotRow = document.getElementById("albumDots");

  /* One mark per photograph, built here rather than written out: the rail is
     the only place the count is declared, and a hand-kept row of seventeen
     would drift the first time a photograph is added. */
  const dots = source.map((_, n) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "album-dot";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-selected", n === 0 ? "true" : "false");
    dot.setAttribute("aria-label", `Ảnh ${n + 1}`);
    dot.addEventListener("click", () => goTo(n));
    if (dotRow) dotRow.appendChild(dot);
    return dot;
  });

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
  let at = count;
  let gliding = false;
  let glideId = 0;
  let glideTimer = 0;
  let restTimer = 0;
  // where the last press was headed, as a place in the whole cloned run; -1 at rest
  let aim = -1;

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

  /* Where the rail rests with the first plate of the middle run centred. */
  const home = () => centreOf(plates[count]);

  /* How far the rail has wandered from that resting place, rounded to whole
     runs and put back. Rounding is what keeps it steady: the rail is allowed
     half a run either way before it is carried round, so resting sits as far
     from both edges as it can. A band that merely started at the resting
     place left the rail on its own boundary at some widths, and any nudge
     tripped a reposition mid-glide -- which is what made stepping from the
     first photograph to the second jump. Rounding also unwinds several runs
     at once, so a drag that outruns the observer cannot leave the rail
     stranded a run or two out. */
  const keepCentred = () => {
    if (!runWidth || gliding) return;
    const runs = Math.round((albumRail.scrollLeft - home()) / runWidth);
    if (runs) shift(-runs * runWidth);
  };

  /* Which plate is centred, as a position in the whole cloned run rather than
     as a photograph number. Distance from the centre, not overlap: several
     plates are fully visible at once on a wide screen, and asking an observer
     alone which one was showing left the count stuck on the last to report. */
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

    return best;
  };

  const sync = () => {
    /* Reporting only. Carrying the run round from here meant doing it while the
       guest's own scroll was still in flight, which cancels that scroll and
       leaves the rail stopped between two photographs with nothing to snap it
       back. The rail is only ever repositioned once it has come to rest. */
    settled();
    at = settledOn();
    const n = ((at % count) + count) % count;
    if (n === current) return;
    current = n;
    dots.forEach((dot, i) => dot.setAttribute("aria-selected", i === n ? "true" : "false"));
  };

  /* The end of a glide, and the only place that lowers the flag. The token is
     what makes it safe: a glide that has been overtaken by a later one no
     longer matches, so its own timer cannot end the glide that replaced it.
     Without that, every press left a live 1200ms timer behind -- reassigning
     glideTimer overwrites the handle but does not cancel the timer -- and the
     one left by the first press fired in the middle of the fourth, lowered the
     flag and carried the run round, which cancelled that glide and stopped the
     rail between two photographs. */
  const landed = (id) => {
    if (id !== glideId) return;
    window.clearTimeout(glideTimer);
    gliding = false;
    aim = -1;
    keepCentred();
  };

  /* The rail has stopped moving, whoever was moving it. scrollend says so
     exactly where it exists; the timer is the fallback, fed by the observer
     rather than by a scroll handler. */
  const settled = () => {
    window.clearTimeout(restTimer);
    restTimer = window.setTimeout(keepCentred, 200);
  };

  if ("onscrollend" in albumRail) {
    albumRail.addEventListener("scrollend", () => {
      if (gliding) landed(glideId);
      else keepCentred();
    });
  }

  /* Step to the plate physically next door, not to that photograph's copy in
     the middle run. Aiming at the middle copy meant going on from the last
     photograph ran the rail all the way back across the other sixteen to reach
     the first, which is the opposite of carrying on.

     Counted from where the last press was headed rather than from where the
     rail happens to be: mid-glide the nearest plate is still the one behind,
     so six quick presses asked for the same two or three plates over and over
     and only three of them landed. */
  const step = (by) => {
    const from = aim >= 0 ? aim : settledOn();
    const plate = plates[from + by];
    if (!plate) return;

    aim = from + by;
    gliding = true;
    const id = ++glideId;
    window.clearTimeout(glideTimer);

    albumRail.scrollTo({
      left: centreOf(plate),
      behavior: prefersReducedMotion ? "instant" : "smooth",
    });

    glideTimer = window.setTimeout(() => landed(id), prefersReducedMotion ? 30 : 900);
  };

  /* A mark is a jump of several plates, and the shorter way round is not
     always forwards. The rail repeats every run, so both directions reach the
     photograph; taking the nearer one keeps the glide short and never crosses
     the whole album to arrive one place away. */
  const goTo = (n) => {
    let by = n - current;
    if (by > count / 2) by -= count;
    else if (by < -count / 2) by += count;
    if (by) step(by);
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

  /* Re-measuring is always safe; putting the rail back is not. This runs from a
     ResizeObserver, and it writes the scroll position directly, so firing while
     a hand is on the rail or a glide is in flight yanks it out from under them.
     Measure either way, and only re-centre once nothing is moving. */
  const settle = () => {
    measure();
    if (holding || gliding) return;

    if (current < 0) {
      albumRail.scrollLeft = centreOf(middle(0));
      current = 0;
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
