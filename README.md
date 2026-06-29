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
