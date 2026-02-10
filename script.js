const noBtn = document.getElementById("no-btn");
const ctaArea = document.getElementById("cta-area");
const noAside = document.getElementById("no-aside");
const yesBtn = document.querySelector(".btn-yes");

if (noBtn && ctaArea) {
  let hideAsideTimer = null;

  const showAside = () => {
    if (!noAside) return;
    noAside.classList.add("is-visible");
    noAside.setAttribute("aria-hidden", "false");
    if (hideAsideTimer) {
      window.clearTimeout(hideAsideTimer);
    }
    hideAsideTimer = window.setTimeout(() => {
      noAside.classList.remove("is-visible");
      noAside.setAttribute("aria-hidden", "true");
    }, 500);
  };

  const moveNoButton = () => {
    const areaRect = ctaArea.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    const yesRect = yesBtn ? yesBtn.getBoundingClientRect() : null;

    const maxLeft = Math.max(8, areaRect.width - btnRect.width - 8);
    const maxTop = Math.max(8, areaRect.height - btnRect.height - 8);

    const toAreaCoords = (rect) => ({
      left: rect.left - areaRect.left,
      top: rect.top - areaRect.top,
      right: rect.right - areaRect.left,
      bottom: rect.bottom - areaRect.top,
    });

    const yesAreaRect = yesRect ? toAreaCoords(yesRect) : null;
    const buffer = 16;

    let nextLeft = 0;
    let nextTop = 0;
    let tries = 0;
    let ok = false;

    while (!ok && tries < 30) {
      nextLeft = Math.floor(Math.random() * maxLeft);
      nextTop = Math.floor(Math.random() * maxTop);

      if (!yesAreaRect) {
        ok = true;
        break;
      }

      const candidate = {
        left: nextLeft,
        top: nextTop,
        right: nextLeft + btnRect.width,
        bottom: nextTop + btnRect.height,
      };

      const overlaps =
        candidate.left < yesAreaRect.right + buffer &&
        candidate.right > yesAreaRect.left - buffer &&
        candidate.top < yesAreaRect.bottom + buffer &&
        candidate.bottom > yesAreaRect.top - buffer;

      ok = !overlaps;
      tries += 1;
    }

    noBtn.style.right = "auto";
    noBtn.style.transform = "translateX(0)";
    noBtn.style.left = `${nextLeft}px`;
    noBtn.style.top = `${nextTop}px`;

    showAside();
  };

  noBtn.addEventListener("pointerenter", moveNoButton);
  noBtn.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    moveNoButton();
  });

  noBtn.addEventListener("click", (event) => {
    event.preventDefault();
    moveNoButton();
  });

  ctaArea.addEventListener("pointermove", (event) => {
    const btnRect = noBtn.getBoundingClientRect();
    const dx = event.clientX - (btnRect.left + btnRect.width / 2);
    const dy = event.clientY - (btnRect.top + btnRect.height / 2);
    const distance = Math.hypot(dx, dy);

    if (distance < 50) {
      moveNoButton();
    }
  });
}
