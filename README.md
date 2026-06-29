# Words of Hours

A page-turning children's storybook, built as a static site for GitHub Pages.
It is the presentation layer for a mystery-hunt–style puzzle created for the
**Wafflehaus Puzzle Exchange**.

- `index.html` — the book
- `css/style.css` — storybook styling, frame & flip animation
- `js/book.js` — page data (from `book-instructions.csv`) and the page-turn logic
- `images/` — cover + 24 illustration pages

Turn pages by clicking the left/right half of the book, using the on-screen
arrows, the ← / → keys, or swiping on touch devices.

## Deploy to GitHub Pages

```bash
cd ~/repo/words-of-hours
git init && git add -A && git commit -m "Words of Hours storybook"
gh repo create words-of-hours --public --source=. --push   # or push to an existing remote
```

Then in the GitHub repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, folder `/ (root)`. The site appears at `https://<user>.github.io/words-of-hours/`.

To preview locally: `python3 -m http.server` then open http://localhost:8000.
