# Deployment Guide — שמעון והדרך אל הבית

Target platform: **GitHub Pages only**.

---

## 1. Repository name and `base`

GitHub Pages serves the site from a subdirectory path:
`https://USERNAME.github.io/REPO-NAME/`

Vite must know this prefix at build time.  Set it via the `VITE_BASE` env var:

| Scenario | `VITE_BASE` value |
|---|---|
| Repo page (`github.io/REPO-NAME`) | `/REPO-NAME/` |
| User/org page (`github.io/`) | `/` |

---

## 2. Build

```bash
cd prototype
VITE_BASE="/REPO-NAME/" npm run build
```

Output directory: `prototype/dist/`
Node.js required: 18+

Clean build (recommended before deployment):
```bash
cd prototype
rm -rf dist
VITE_BASE="/REPO-NAME/" npm run build
```

Local preview (after build):
```bash
npm run preview -- --host 127.0.0.1
```

---

## 3. Deployment options

### Option A — GitHub Actions (recommended)

Create `.github/workflows/deploy.yml` at the root of the repository:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: prototype/package-lock.json
      - run: npm ci
        working-directory: prototype
      - run: npm run build
        working-directory: prototype
        env:
          VITE_BASE: /REPO-NAME/
      - uses: actions/upload-pages-artifact@v3
        with:
          path: prototype/dist
      - uses: actions/deploy-pages@v4
        id: deployment
```

In GitHub: **Settings → Pages → Source → GitHub Actions**.

### Option B — `gh-pages` CLI (manual)

```bash
npm install -g gh-pages
cd prototype
rm -rf dist
VITE_BASE="/REPO-NAME/" npm run build
gh-pages -d dist
```

In GitHub: **Settings → Pages → Source → Deploy from branch `gh-pages`**.

---

## 4. Asset path verification

Every asset in `src/main.js` uses `import.meta.env.BASE_URL`.
At build time Vite replaces it with the value of `VITE_BASE`:

| Asset | Code |
|---|---|
| Page images | `${import.meta.env.BASE_URL}pages/p001.png` … `p059.png` |
| PDF | `${import.meta.env.BASE_URL}pdf/שמעון_והדרך_אל_הבית_להדפסה.pdf` |
| Book text | `${import.meta.env.BASE_URL}book_text_final.json` |
| Fonts | injected via `${import.meta.env.BASE_URL}fonts/…` in main.js |

No hardcoded `/pages/`, `/pdf/`, `/fonts/` paths remain in the built output.

---

## 5. Open Graph — after the site goes live

`index.html` currently has `og:title` and `og:description` set.
After deployment, add the absolute URL and image to `index.html`:

```html
<meta property="og:url"   content="https://USERNAME.github.io/REPO-NAME/" />
<meta property="og:image" content="https://USERNAME.github.io/REPO-NAME/pages/p001.png" />
```

Then rebuild and redeploy.

---

## 6. Updating the book after publication

### Update page images (new PDF version)

```bash
# From the project root
python3 scripts/generate_pages.py   # regenerates p001–p059.png
# PNGs land in prototype/public/pages/
cd prototype
VITE_BASE="/REPO-NAME/" npm run build
# then redeploy via Action or gh-pages
```

### Update book text only

Edit `prototype/public/book_text_final.json`, rebuild, and redeploy.
No Python step needed — the JSON is served as a static asset.

### Add or remove pages

1. Update `public/pages/` with new PNGs
2. Edit the `PAGES` array in `src/main.js` (maintain `PAGES[0]` as blank)
3. Update `book_text_final.json` if text changed
4. Rebuild and redeploy

---

## 7. Pre-deployment checklist

- [ ] Set correct `VITE_BASE` (must end with `/`)
- [ ] `prototype/public/pages/` — 59 PNGs: p001.png … p059.png
- [ ] `prototype/public/pdf/` — PDF file present
- [ ] `prototype/public/book_text_final.json` — present
- [ ] `prototype/public/fonts/` — 4 TTF files present
- [ ] `prototype/public/favicon.png` — present
- [ ] Clean build succeeds with no errors
- [ ] Local preview: flipbook opens, RTL navigation works, TOC navigates, Read mode works, PDF downloads
- [ ] Mobile view: portrait mode single-page, navigation arrows visible
- [ ] Update `og:url` and `og:image` with final domain after first deploy

---

## 8. Environment summary

| Key | Value |
|---|---|
| Build tool | Vite 5.4.x |
| Flipbook library | page-flip 2.0.7 |
| Node.js | 18+ |
| Output dir | `prototype/dist/` |
| Build command | `VITE_BASE="/REPO-NAME/" npm run build` (run from `prototype/`) |
| Required secrets | none (VITE_BASE is not secret) |
