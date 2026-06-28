/* Words of Hours — page-turning storybook */

// Plate data, in book-page order (from book-instructions.csv).
// label = the page-number medallion shown top-right
// emoji = "The story continues on page <emoji>."
const PLATES = [
  { img: "page-1.jpg",  emoji: "☔️", label: 3 },
  { img: "page-2.jpg",  emoji: "👵", label: 7 },
  { img: "page-3.jpg",  emoji: "🪣", label: 5 },
  { img: "page-4.jpg",  emoji: "👍", label: 5 },
  { img: "page-5.jpg",  emoji: "🪖", label: 5 },
  { img: "page-6.jpg",  emoji: "🥓", label: 9 },
  { img: "page-7.jpg",  emoji: "👨‍🚒", label: 4 },
  { img: "page-8.jpg",  emoji: "😋", label: 3 },
  { img: "page-9.jpg",  emoji: "🎂", label: 7 },
  { img: "page-10.jpg", emoji: "🎻", label: 4 },
  { img: "page-11.jpg", emoji: "❤️", label: 3 },
  { img: "page-12.jpg", emoji: "🍻", label: 2 },
  { img: "page-13.jpg", emoji: "🕰️", label: 9 },
  { img: "page-14.jpg", emoji: "🎀", label: 3 },
  { img: "page-15.jpg", emoji: "❄️", label: 3 },
  { img: "page-16.jpg", emoji: "🎡", label: 6 },
  { img: "page-17.jpg", emoji: "🐮", label: 7 },
  { img: "page-18.jpg", emoji: "🩺", label: 9 },
  { img: "page-19.jpg", emoji: "🍓", label: 7 },
  { img: "page-20.jpg", emoji: "😴", label: 2 },
  { img: "page-21.jpg", emoji: "🔫", label: 3 },
  { img: "page-22.jpg", emoji: "🔎", label: 7 },
  { img: "page-23.jpg", emoji: "🗓️", label: 3 },
  { img: "page-24.jpg", emoji: "🥢", label: 9 },
];

const COVER = { type: "cover" };
const END = { type: "end" };
const PAGES = [COVER, ...PLATES, END];

const FLOURISH = "❦"; // ❦
const DIVIDER = "❧"; // ❧ (rotated floral heart)

const book = document.getElementById("book");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const slider = document.getElementById("pageSlider");

let idx = 0;
let animating = false;

/* ---------- builders ---------- */
function sheetEl(className) {
  const s = document.createElement("div");
  s.className = "sheet " + className;
  return s;
}

function buildVisual(i) {
  const page = PAGES[i];

  if (page.type === "cover") {
    const s = sheetEl("cover");
    s.innerHTML = `
      <div class="cover-img" style="background-image:url('images/cover-image.jpg')"></div>
      <div class="scrim"></div>
      <div class="cover-frame"></div>
      <div class="cover-inner">
        <h1>Words of Hours</h1>
        <div class="bylines">
          <span class="byline"><b>Stories by Mother Goose</b></span>
          <span class="byline">Illustrations by Nano Banana</span>
          <p class="subtitle">Featuring fan-favorite nursery rhyme classics like <em>Un Petit d'un Petit</em></p>
        </div>
      </div>`;
    return s;
  }

  if (page.type === "end") {
    const s = sheetEl("end");
    s.innerHTML = `
      <div class="flourish">${DIVIDER} &#10047; ${DIVIDER}</div>
      <div class="endmark">Fin</div>
      <div class="flourish">${FLOURISH}</div>`;
    return s;
  }

  // illustration plate
  const s = sheetEl("plate");
  s.innerHTML = `
    <div class="frame"></div>
    <span class="corner tl">${FLOURISH}</span>
    <span class="corner tr">${FLOURISH}</span>
    <span class="corner bl">${FLOURISH}</span>
    <span class="corner br">${FLOURISH}</span>
    <div class="pagenum">${page.label}</div>
    <div class="art"><img src="images/${page.img}" alt="Illustration" draggable="false" /></div>
    <div class="caption">
      <div class="line">The story continues on page <span class="emoji">${page.emoji}</span>.</div>
    </div>`;
  return s;
}

function makePage(i) {
  const p = document.createElement("div");
  p.className = "page";
  p.appendChild(buildVisual(i));
  return p;
}

/* ---------- render & flip ---------- */
let flipEl = null;

function renderBase(i) {
  book.querySelectorAll(".page").forEach((e) => e.remove());
  book.appendChild(makePage(i));
}

function clearFlip() {
  if (flipEl) {
    flipEl.remove();
    flipEl = null;
  }
  animating = false;
}

function showStatic(i) {
  clearFlip();
  renderBase(i);
  idx = i;
  updateUI();
}

function turn(dir) {
  const target = idx + dir;
  if (target < 0 || target >= PAGES.length) return;

  // interruptible: snap any in-progress flip to its current page, then start fresh
  if (flipEl) {
    clearFlip();
    renderBase(idx);
  }

  const old = idx;
  const flip = document.createElement("div");
  flip.className = "flipper";

  const front = document.createElement("div");
  front.className = "face front";
  const back = document.createElement("div");
  back.className = "face back";
  flip.append(front, back);

  if (dir > 0) {
    // forward: reveal target underneath; flip current page away to the left
    front.appendChild(buildVisual(old));
    renderBase(target); // underneath = target
    book.appendChild(flip);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => (flip.style.transform = "rotateY(-180deg)"))
    );
  } else {
    // backward: keep current underneath; swing target (prev) in from the left
    front.appendChild(buildVisual(target));
    flip.style.transform = "rotateY(-180deg)";
    book.appendChild(flip);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => (flip.style.transform = "rotateY(0deg)"))
    );
  }

  flipEl = flip;
  animating = true;
  idx = target; // optimistic: lets rapid clicks chain immediately
  updateUI();

  flip.addEventListener(
    "transitionend",
    () => {
      if (flipEl === flip) {
        renderBase(target);
        flipEl = null;
        animating = false;
      }
    },
    { once: true }
  );
}

function updateUI() {
  prevBtn.disabled = idx === 0;
  nextBtn.disabled = idx === PAGES.length - 1;
  if (slider && slider.value !== String(idx)) slider.value = idx;
}

/* ---------- input ---------- */
nextBtn.addEventListener("click", () => turn(1));
prevBtn.addEventListener("click", () => turn(-1));

slider.max = PAGES.length - 1;
slider.addEventListener("input", () => {
  const t = parseInt(slider.value, 10);
  if (t !== idx) showStatic(t); // instant jump, no flip animation
});

let downX = null, downY = null;
book.addEventListener("mousedown", (e) => { downX = e.clientX; downY = e.clientY; });

book.addEventListener("click", (e) => {
  // don't turn when the user is selecting/highlighting text
  const sel = window.getSelection();
  if (sel && sel.toString().length > 0) return;
  // don't turn if the pointer was dragged (a selection gesture)
  if (downX !== null && (Math.abs(e.clientX - downX) > 6 || Math.abs(e.clientY - downY) > 6)) return;

  const rect = book.getBoundingClientRect();
  if (e.clientX - rect.left > rect.width / 2) turn(1);
  else turn(-1);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === " ") { turn(1); e.preventDefault(); }
  else if (e.key === "ArrowLeft") { turn(-1); e.preventDefault(); }
});

// basic swipe
let touchX = null;
book.addEventListener("touchstart", (e) => (touchX = e.changedTouches[0].clientX), { passive: true });
book.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 40) turn(dx < 0 ? 1 : -1);
  touchX = null;
});

/* ---------- preload + init ---------- */
["cover-image.jpg", ...PLATES.map((p) => p.img)].forEach((src) => {
  const im = new Image();
  im.src = "images/" + src;
});

showStatic(0);
