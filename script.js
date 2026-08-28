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

const overlay = document.getElementById("envelopeOverlay");
const openButton = document.getElementById("openInvite");

/* The overlay itself blocks pointer events and body scroll is locked in CSS,
   so the guest cannot do anything else while the envelope is opening. */
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function unlockPage() {
  document.body.classList.add("invite-open");
  window.scrollTo(0, 0);

  const firstSection = document.querySelector(".save-the-date");
  if (firstSection) {
    firstSection.setAttribute("tabindex", "-1");
    firstSection.focus({ preventScroll: true });
  }
}

if (overlay && openButton) {
  openButton.addEventListener(
    "click",
    () => {
      openButton.disabled = true;

      if (prefersReducedMotion) {
        overlay.remove();
        unlockPage();
        return;
      }

      overlay.classList.add("is-opening");
      window.setTimeout(() => {
        overlay.remove();
        unlockPage();
      }, 1950);
    },
    { once: true }
  );
} else {
  document.body.classList.add("invite-open");
}

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
