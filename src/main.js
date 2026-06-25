import { PageFlip } from 'page-flip';

// ── Font injection via BASE_URL so paths survive GitHub Pages subdirectory ────
{
  const _b = import.meta.env.BASE_URL;
  const s = document.createElement('style');
  s.textContent = [
    `@font-face{font-family:'FrankRuhlLibre';src:url('${_b}fonts/frank-ruhl-libre-regular.ttf')format('truetype');font-weight:400}`,
    `@font-face{font-family:'FrankRuhlLibre';src:url('${_b}fonts/frank-ruhl-libre-bold.ttf')format('truetype');font-weight:700}`,
    `@font-face{font-family:'NotoSerifHebrew';src:url('${_b}fonts/noto-serif-hebrew-400-0.ttf')format('truetype');font-weight:400}`,
    `@font-face{font-family:'NotoSerifHebrew';src:url('${_b}fonts/noto-serif-hebrew-700-1.ttf')format('truetype');font-weight:700}`,
  ].join('');
  document.head.insertBefore(s, document.head.firstChild);
}

// ── Logical page manifest — p002–p059, source of truth ───────────────────────
//
// pdfPage:    page number in the source PDF (2–59)
// readerPage: 1-based index for display (1–58, = pdfPage - 1)
// label:      short label shown in indicator / continue-reading button
// chapterNum: matches TOC entry num; null for non-chapter pages
//
// DO NOT reorder. buildDesktopPages() derives display order from this array.
const LOGICAL_PAGES = [
  { file: 'p002.png', pdfPage:  2, readerPage:  1, label: 'שמעון',          chapterNum: null },
  { file: 'p003.png', pdfPage:  3, readerPage:  2, label: 'הקדשה',           chapterNum: null },
  { file: 'p004.png', pdfPage:  4, readerPage:  3, label: 'תוכן העניינים',   chapterNum: null },
  { file: 'p005.png', pdfPage:  5, readerPage:  4, label: 'פרק א',           chapterNum: 1    },
  { file: 'p006.png', pdfPage:  6, readerPage:  5, label: null,              chapterNum: null },
  { file: 'p007.png', pdfPage:  7, readerPage:  6, label: null,              chapterNum: null },
  { file: 'p008.png', pdfPage:  8, readerPage:  7, label: 'פרק ב',           chapterNum: 2    },
  { file: 'p009.png', pdfPage:  9, readerPage:  8, label: null,              chapterNum: null },
  { file: 'p010.png', pdfPage: 10, readerPage:  9, label: null,              chapterNum: null },
  { file: 'p011.png', pdfPage: 11, readerPage: 10, label: 'פרק ג',           chapterNum: 3    },
  { file: 'p012.png', pdfPage: 12, readerPage: 11, label: null,              chapterNum: null },
  { file: 'p013.png', pdfPage: 13, readerPage: 12, label: null,              chapterNum: null },
  { file: 'p014.png', pdfPage: 14, readerPage: 13, label: 'פרק ד',           chapterNum: 4    },
  { file: 'p015.png', pdfPage: 15, readerPage: 14, label: null,              chapterNum: null },
  { file: 'p016.png', pdfPage: 16, readerPage: 15, label: null,              chapterNum: null },
  { file: 'p017.png', pdfPage: 17, readerPage: 16, label: 'פרק ה',           chapterNum: 5    },
  { file: 'p018.png', pdfPage: 18, readerPage: 17, label: null,              chapterNum: null },
  { file: 'p019.png', pdfPage: 19, readerPage: 18, label: null,              chapterNum: null },
  { file: 'p020.png', pdfPage: 20, readerPage: 19, label: 'פרק ו',           chapterNum: 6    },
  { file: 'p021.png', pdfPage: 21, readerPage: 20, label: null,              chapterNum: null },
  { file: 'p022.png', pdfPage: 22, readerPage: 21, label: null,              chapterNum: null },
  { file: 'p023.png', pdfPage: 23, readerPage: 22, label: 'פרק ז',           chapterNum: 7    },
  { file: 'p024.png', pdfPage: 24, readerPage: 23, label: null,              chapterNum: null },
  { file: 'p025.png', pdfPage: 25, readerPage: 24, label: null,              chapterNum: null },
  { file: 'p026.png', pdfPage: 26, readerPage: 25, label: 'פרק ח',           chapterNum: 8    },
  { file: 'p027.png', pdfPage: 27, readerPage: 26, label: null,              chapterNum: null },
  { file: 'p028.png', pdfPage: 28, readerPage: 27, label: null,              chapterNum: null },
  { file: 'p029.png', pdfPage: 29, readerPage: 28, label: 'פרק ט',           chapterNum: 9    },
  { file: 'p030.png', pdfPage: 30, readerPage: 29, label: null,              chapterNum: null },
  { file: 'p031.png', pdfPage: 31, readerPage: 30, label: null,              chapterNum: null },
  { file: 'p032.png', pdfPage: 32, readerPage: 31, label: 'פרק י',           chapterNum: 10   },
  { file: 'p033.png', pdfPage: 33, readerPage: 32, label: null,              chapterNum: null },
  { file: 'p034.png', pdfPage: 34, readerPage: 33, label: null,              chapterNum: null },
  { file: 'p035.png', pdfPage: 35, readerPage: 34, label: 'פרק יא',          chapterNum: 11   },
  { file: 'p036.png', pdfPage: 36, readerPage: 35, label: null,              chapterNum: null },
  { file: 'p037.png', pdfPage: 37, readerPage: 36, label: null,              chapterNum: null },
  { file: 'p038.png', pdfPage: 38, readerPage: 37, label: 'פרק יב',          chapterNum: 12   },
  { file: 'p039.png', pdfPage: 39, readerPage: 38, label: null,              chapterNum: null },
  { file: 'p040.png', pdfPage: 40, readerPage: 39, label: null,              chapterNum: null },
  { file: 'p041.png', pdfPage: 41, readerPage: 40, label: 'פרק יג',          chapterNum: 13   },
  { file: 'p042.png', pdfPage: 42, readerPage: 41, label: null,              chapterNum: null },
  { file: 'p043.png', pdfPage: 43, readerPage: 42, label: null,              chapterNum: null },
  { file: 'p044.png', pdfPage: 44, readerPage: 43, label: 'פרק יד',          chapterNum: 14   },
  { file: 'p045.png', pdfPage: 45, readerPage: 44, label: null,              chapterNum: null },
  { file: 'p046.png', pdfPage: 46, readerPage: 45, label: null,              chapterNum: null },
  { file: 'p047.png', pdfPage: 47, readerPage: 46, label: 'פרק טו',          chapterNum: 15   },
  { file: 'p048.png', pdfPage: 48, readerPage: 47, label: null,              chapterNum: null },
  { file: 'p049.png', pdfPage: 49, readerPage: 48, label: null,              chapterNum: null },
  { file: 'p050.png', pdfPage: 50, readerPage: 49, label: 'פרק טז',          chapterNum: 16   },
  { file: 'p051.png', pdfPage: 51, readerPage: 50, label: null,              chapterNum: null },
  { file: 'p052.png', pdfPage: 52, readerPage: 51, label: null,              chapterNum: null },
  { file: 'p053.png', pdfPage: 53, readerPage: 52, label: 'פרק יז',          chapterNum: 17   },
  { file: 'p054.png', pdfPage: 54, readerPage: 53, label: null,              chapterNum: null },
  { file: 'p055.png', pdfPage: 55, readerPage: 54, label: null,              chapterNum: null },
  { file: 'p056.png', pdfPage: 56, readerPage: 55, label: 'פרק יח',          chapterNum: 18   },
  { file: 'p057.png', pdfPage: 57, readerPage: 56, label: null,              chapterNum: null },
  { file: 'p058.png', pdfPage: 58, readerPage: 57, label: null,              chapterNum: null },
  { file: 'p059.png', pdfPage: 59, readerPage: 58, label: 'נספח',            chapterNum: null },
];

// ── Desktop display order ─────────────────────────────────────────────────────
//
// page-flip always puts spread[t0] on LEFT and spread[t1] on RIGHT.
// For a Hebrew book (earlier page on RIGHT):
//   swap each pair so the later page is at the even (left) index.
//
// LOGICAL [p002, p003, p004, p005, ...]
// Desktop [p003, p002, p005, p004, ...] → spread: שמאל p003 | ימין p002 ✓
function buildDesktopPages(logicalPages) {
  const result = [];
  for (let i = 0; i < logicalPages.length; i += 2) {
    const earlier = logicalPages[i];
    const later   = logicalPages[i + 1];
    if (later) {
      result.push(later, earlier);
    } else {
      result.push(earlier);
    }
  }
  return result;
}

const STORAGE_KEY = 'shimon-book-last-page'; // stores pdfPage (2–59)

// ── State ────────────────────────────────────────────────────────────────────
let pageFlip            = null;
let bookInitialized     = false;
let currentDisplayPages = [];          // desktop-swapped or logical (mobile)
let readFontSize        = parseInt(localStorage.getItem('shimon-font-size') || '18');
let tocOpen             = false;
let readOpen            = false;

// ── DOM refs ─────────────────────────────────────────────────────────────────
const flipbookEl     = document.getElementById('flipbook');
const coverScreenEl  = document.getElementById('cover-screen');
const coverImgEl     = document.getElementById('cover-img');
const openBookBtnEl  = document.getElementById('open-book-btn');
const continueBtnEl  = document.getElementById('continue-btn');
const coverBookBtnEl = document.getElementById('cover-book-btn');
const stageEl        = document.getElementById('stage');
const pageIndicator  = document.getElementById('page-indicator');
const tocPanel       = document.getElementById('toc-panel');
const tocList        = document.getElementById('toc-list');
const overlay        = document.getElementById('overlay');
const readPanel      = document.getElementById('read-panel');
const readContent    = document.getElementById('read-content');
const btnToc         = document.getElementById('btn-toc');
const btnHome        = document.getElementById('btn-home');
const btnRead        = document.getElementById('btn-read');
const btnPdf         = document.getElementById('btn-pdf');
const btnFs          = document.getElementById('btn-fs');
const btnCloseRead   = document.getElementById('btn-close-read');
const fontDown       = document.getElementById('font-down');
const fontUp         = document.getElementById('font-up');
const forwardButton  = document.getElementById('nav-forward'); // RIGHT side — forward
const backButton     = document.getElementById('nav-back');    // LEFT  side — backward

// ── Helpers ──────────────────────────────────────────────────────────────────
function isPortrait() { return window.innerWidth < 768; }

function getDisplayPages() {
  return isPortrait() ? LOGICAL_PAGES : buildDesktopPages(LOGICAL_PAGES);
}

// ── Cover screen ─────────────────────────────────────────────────────────────
function showCoverScreen() {
  coverScreenEl.classList.remove('hidden');
  stageEl.classList.remove('open');
  forwardButton.classList.remove('visible');
  backButton.classList.remove('visible');
  pageIndicator.textContent = '';

  const savedPdfPage = parseInt(localStorage.getItem(STORAGE_KEY) || '0');
  const savedEntry   = LOGICAL_PAGES.find(p => p.pdfPage === savedPdfPage);
  if (savedEntry) {
    const suffix = savedEntry.label ? ` — ${savedEntry.label}` : '';
    continueBtnEl.textContent = `המשך קריאה${suffix}`;
    continueBtnEl.hidden = false;
  } else {
    continueBtnEl.hidden = true;
  }
}

// ── Open book at a given pdfPage ─────────────────────────────────────────────
function openBook(startPdfPage) {
  const target = (startPdfPage >= 2 && startPdfPage <= 59) ? startPdfPage : 2;

  coverScreenEl.classList.add('hidden');
  stageEl.classList.add('open');
  forwardButton.classList.add('visible');
  backButton.classList.add('visible');

  if (!bookInitialized) {
    initFlipbook(target);
    bookInitialized = true;
  } else {
    const displayIdx = currentDisplayPages.findIndex(p => p.pdfPage === target);
    if (displayIdx >= 0) pageFlip?.turnToPage(displayIdx);
    updateIndicator(target);
  }
}

openBookBtnEl.addEventListener('click',  () => openBook(2));
coverBookBtnEl.addEventListener('click', () => openBook(2));
continueBtnEl.addEventListener('click', () => {
  const saved = parseInt(localStorage.getItem(STORAGE_KEY) || '0');
  openBook(saved >= 2 && saved <= 59 ? saved : 2);
});

// ── Compute flipbook dimensions ──────────────────────────────────────────────
function computeDims() {
  const W = window.innerWidth;
  const toolbarH = W < 600 ? 54 : 60;
  const H = window.innerHeight - toolbarH;
  const portrait = W < 768;

  if (portrait) {
    const side = Math.min(W - 10, H - 16);
    return { w: Math.floor(side), h: Math.floor(side) };
  }
  const navClearance = 140;
  const maxH = H - 48;
  const maxPageW = Math.floor((W - navClearance) / 2);
  const side = Math.min(maxH, maxPageW, 700);
  return { w: side, h: side };
}

// ── Init flipbook ────────────────────────────────────────────────────────────
function initFlipbook(startPdfPage) {
  flipbookEl.innerHTML = '';
  const portrait = isPortrait();
  currentDisplayPages = getDisplayPages();

  currentDisplayPages.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'page';
    const img = document.createElement('img');
    img.src = `${import.meta.env.BASE_URL}pages/${p.file}`;
    img.alt = p.label || '';
    img.loading = i < 4 ? 'eager' : 'lazy';
    div.appendChild(img);
    flipbookEl.appendChild(div);
  });

  const { w, h } = computeDims();
  const startIdx = currentDisplayPages.findIndex(p => p.pdfPage === startPdfPage);
  const startPage = startIdx >= 0 ? startIdx : 0;

  pageFlip = new PageFlip(flipbookEl, {
    width: w,
    height: h,
    size: 'fixed',
    usePortrait: portrait,
    startPage,
    drawShadow: true,
    flippingTime: 650,
    useMouseEvents: true,
    swipeDistance: 30,
    showCover: false,
    mobileScrollSupport: false,
    clickEventForward: true,
  });

  pageFlip.loadFromHTML(document.querySelectorAll('#flipbook .page'));

  pageFlip.on('flip', (e) => {
    const entry = currentDisplayPages[e.data];
    if (!entry) return;
    updateIndicator(entry.pdfPage);
    localStorage.setItem(STORAGE_KEY, String(entry.pdfPage));
  });

  updateIndicator(startPdfPage);
}

// ── Resize: rebuild with same pdfPage ────────────────────────────────────────
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (!bookInitialized || !pageFlip) return;
    const curIdx   = pageFlip.getCurrentPageIndex();
    const curEntry = currentDisplayPages[curIdx];
    const savedPdfPage = curEntry ? curEntry.pdfPage : 2;
    pageFlip.destroy();
    pageFlip = null;
    initFlipbook(savedPdfPage);
  }, 250);
});

// ── Page indicator ───────────────────────────────────────────────────────────
function updateIndicator(pdfPage) {
  const entry = LOGICAL_PAGES.find(p => p.pdfPage === pdfPage);
  if (!entry) { pageIndicator.textContent = ''; return; }
  const total = LOGICAL_PAGES.length;
  const label = entry.label ? ` — ${entry.label}` : '';
  pageIndicator.textContent = `${total} / ${entry.readerPage}${label}`;
}

// ── Navigation (RIGHT = forward, LEFT = backward) ────────────────────────────
forwardButton.addEventListener('click', () => pageFlip?.flipNext());
backButton.addEventListener('click',    () => pageFlip?.flipPrev());

document.addEventListener('keydown', (e) => {
  if (readOpen || !bookInitialized) return;
  if (e.key === 'ArrowRight') { pageFlip?.flipNext(); }
  if (e.key === 'ArrowLeft')  { pageFlip?.flipPrev(); }
});

// ── Home ─────────────────────────────────────────────────────────────────────
btnHome.addEventListener('click', () => {
  if (pageFlip) {
    const curEntry = currentDisplayPages[pageFlip.getCurrentPageIndex()];
    if (curEntry) localStorage.setItem(STORAGE_KEY, String(curEntry.pdfPage));
  }
  showCoverScreen();
});

// ── TOC ──────────────────────────────────────────────────────────────────────
function buildToc(bookData) {
  (bookData.toc || []).forEach((tocEntry) => {
    const div = document.createElement('div');
    div.className = 'toc-item';
    div.setAttribute('role', 'button');
    div.setAttribute('tabindex', '0');
    div.innerHTML = `<span class="toc-num">פרק ${tocEntry.num_heb}</span><span class="toc-title">${tocEntry.title}</span>`;

    const handler = () => {
      const logEntry = LOGICAL_PAGES.find(p => p.chapterNum === tocEntry.num);
      if (logEntry) { openBook(logEntry.pdfPage); closeToc(); }
    };
    div.addEventListener('click', handler);
    div.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
    });
    tocList.appendChild(div);
  });
}

function openToc() {
  tocOpen = true;
  tocPanel.classList.add('open');
  overlay.classList.add('visible');
  btnToc.classList.add('active');
  tocPanel.setAttribute('aria-expanded', 'true');
}
function closeToc() {
  tocOpen = false;
  tocPanel.classList.remove('open');
  overlay.classList.remove('visible');
  btnToc.classList.remove('active');
  tocPanel.setAttribute('aria-expanded', 'false');
}

btnToc.addEventListener('click', () => tocOpen ? closeToc() : openToc());
overlay.addEventListener('click', closeToc);

// ── Read mode ────────────────────────────────────────────────────────────────
function buildReadContent(bookData) {
  const title = document.createElement('h1');
  title.textContent = bookData.book_title || 'שִׁמְעוֹן וְהַדֶּרֶךְ אֶל הַבַּיִת';
  readContent.appendChild(title);

  (bookData.chapters || []).forEach((ch) => {
    const h2 = document.createElement('h2');
    h2.textContent = `פרק ${ch.num_heb} — ${ch.title}`;
    h2.id = `read-ch${ch.num}`;
    readContent.appendChild(h2);
    (ch.paragraphs || []).forEach((para) => {
      const p = document.createElement('p');
      p.textContent = para;
      readContent.appendChild(p);
    });
  });

  const app = bookData.appendix;
  if (Array.isArray(app) && app.length) {
    const h2 = document.createElement('h2');
    h2.textContent = 'נספח — מֵאֲחוֹרֵי הַסִּיפּוּר הָאֲמִיתִּי';
    readContent.appendChild(h2);
    app.forEach((section) => {
      if (typeof section === 'string') {
        const p = document.createElement('p');
        p.textContent = section;
        readContent.appendChild(p);
      } else if (section && typeof section === 'object') {
        if (section.title) {
          const h3 = document.createElement('h3');
          h3.textContent = section.title;
          Object.assign(h3.style, {
            fontSize: '1.1em', fontWeight: '700',
            marginTop: '16px', marginBottom: '6px',
            color: '#4a2e10',
          });
          readContent.appendChild(h3);
        }
        (section.paragraphs || []).forEach((para) => {
          const p = document.createElement('p');
          p.textContent = para;
          readContent.appendChild(p);
        });
      }
    });
  }
}

function applyFontSize() {
  readPanel.style.fontSize = readFontSize + 'px';
  localStorage.setItem('shimon-font-size', String(readFontSize));
}

function openRead() {
  readOpen = true;
  readPanel.classList.add('visible');
  btnRead.classList.add('active');
  document.body.style.overflow = '';
}
function closeRead() {
  readOpen = false;
  readPanel.classList.remove('visible');
  btnRead.classList.remove('active');
  document.body.style.overflow = 'hidden';
}

btnRead.addEventListener('click', () => readOpen ? closeRead() : openRead());
btnCloseRead.addEventListener('click', closeRead);

fontUp.addEventListener('click',   () => { if (readFontSize < 28) { readFontSize += 2; applyFontSize(); } });
fontDown.addEventListener('click', () => { if (readFontSize > 14) { readFontSize -= 2; applyFontSize(); } });

// ── PDF download ─────────────────────────────────────────────────────────────
btnPdf.addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = `${import.meta.env.BASE_URL}pdf/%D7%A9%D7%9E%D7%A2%D7%95%D7%9F_%D7%95%D7%94%D7%93%D7%A8%D7%9A_%D7%90%D7%9C_%D7%94%D7%91%D7%99%D7%AA_%D7%9C%D7%94%D7%93%D7%A4%D7%A1%D7%94.pdf`;
  a.download = 'שמעון_והדרך_אל_הבית.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

// ── Fullscreen ───────────────────────────────────────────────────────────────
btnFs.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
    btnFs.textContent = '✕⛶';
    btnFs.setAttribute('aria-label', 'יציאה ממסך מלא');
  } else {
    document.exitFullscreen();
    btnFs.textContent = '⛶';
    btnFs.setAttribute('aria-label', 'מסך מלא');
  }
});

// ── Data loading ─────────────────────────────────────────────────────────────
async function loadBookData() {
  const response = await fetch(`${import.meta.env.BASE_URL}book_text_final.json`);
  if (!response.ok) throw new Error(`book_text_final.json: ${response.status}`);
  return response.json();
}

// ── Bootstrap ────────────────────────────────────────────────────────────────
async function init() {
  applyFontSize();
  coverImgEl.src = `${import.meta.env.BASE_URL}pages/p001.png`;
  showCoverScreen();
  try {
    const bookData = await loadBookData();
    buildToc(bookData);
    buildReadContent(bookData);
  } catch (err) {
    console.error(err);
  }
}

init();
