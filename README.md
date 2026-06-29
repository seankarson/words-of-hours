# Words of Hours

A page-turning children's storybook, built as a static site for GitHub Pages.
It is the presentation layer for a mystery-hunt–style puzzle created for the
**Wafflehaus Puzzle Exchange**.

- `index.html` — the book
- `css/style.css` — storybook styling, frame & flip animation (editable source)
- `js/book.js` — page data (from `book-instructions.csv`) and the page-turn logic (editable source)
- `images/` — cover + 24 illustration pages
- `favicon.svg` — goose favicon
- `deploy.sh` — cache-busting deploy script
- `og.html` + `images/social-card.jpg` — link-preview (Open Graph) card

## Regenerating the social-share card

`images/social-card.jpg` (the 1200×630 link preview) is rendered from
`og.html` with headless Chrome. If the cover changes, regenerate it:

```bash
python3 -m http.server 8750 &                       # serve the folder
CHROME="$HOME/.cache/puppeteer/chrome/"*/chrome-mac-arm64/"Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"
"$CHROME" --headless=new --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1280,900 --virtual-time-budget=6000 \
  --screenshot=/tmp/social.png "http://localhost:8750/og.html"
magick /tmp/social.png -crop 1200x630+0+0 +repage -quality 88 images/social-card.jpg
```

(The tall window + crop works around headless Chrome reserving vertical space.)
If you change the image, also bump the `og:image` URL filename so Slack/iMessage
don't serve a cached copy.

Turn pages by clicking the left/right half of the book, using the on-screen
arrows, the ← / → keys, the bottom slider, or swiping on touch devices.

## Deploy to GitHub Pages

Edit `css/style.css` / `js/book.js`, then run:

```bash
./deploy.sh
```

`deploy.sh` content-hashes the CSS/JS into versioned filenames (e.g.
`css/style.a1b2c3d4.css`), rewrites the references in `index.html`, deletes the
old hashed copies, and commits + pushes to `main`. Because the filenames change
whenever the contents change, browsers never serve a stale cached version.

Pages serves from `main` / root (already configured); the site is at
`https://seankarson.github.io/words-of-hours/`.

To preview locally: `python3 -m http.server` then open http://localhost:8000
(run `./deploy.sh` first so the hashed asset files referenced by `index.html`
exist).
