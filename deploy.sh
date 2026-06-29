#!/usr/bin/env bash
#
# Deploy Words of Hours to GitHub Pages with cache-busted asset filenames.
#
# Edit the source files (css/style.css, js/book.js) as normal, then run this
# script. It content-hashes those files, writes hashed copies (e.g.
# css/style.a1b2c3d4.css), rewrites the references in index.html, removes the
# previous hashed copies, and commits + pushes. Because the filenames change
# whenever the contents change, browsers always fetch the new versions.
#
set -euo pipefail
cd "$(dirname "$0")"

hash_file() {
  if command -v md5 >/dev/null 2>&1; then
    md5 -q "$1"            # macOS / BSD
  else
    md5sum "$1" | awk '{print $1}'  # Linux
  fi
}

CSS_HASH=$(hash_file css/style.css | cut -c1-8)
JS_HASH=$(hash_file js/book.js | cut -c1-8)

# Remove previously generated hashed assets (keep the editable sources).
find css -maxdepth 1 -name 'style.*.css' ! -name 'style.css' -delete
find js  -maxdepth 1 -name 'book.*.js'   ! -name 'book.js'   -delete

# Write the hashed copies.
cp css/style.css "css/style.${CSS_HASH}.css"
cp js/book.js    "js/book.${JS_HASH}.js"

# Point index.html at the hashed filenames (handles both the plain source names
# and any previously-hashed names).
perl -0pi -e "s{css/style[^\"']*\.css}{css/style.${CSS_HASH}.css}g" index.html
perl -0pi -e "s{js/book[^\"']*\.js}{js/book.${JS_HASH}.js}g" index.html

echo "Hashed assets:"
echo "  css/style.${CSS_HASH}.css"
echo "  js/book.${JS_HASH}.js"

git add -A
if git diff --cached --quiet; then
  echo "No changes to deploy."
  exit 0
fi

git commit -m "Deploy: cache-busted assets (css ${CSS_HASH}, js ${JS_HASH})

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
git push origin main
echo "Deployed."
