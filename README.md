# DetectGPT

Detect and clean non-ASCII Unicode characters commonly left as watermarks by AI models (ChatGPT, etc.).

Paste any text and instantly see smart quotes, em/en dashes, zero-width spaces, invisible Unicode, and other non-ASCII artifacts — then copy a cleaned ASCII version.

## Features

- Scans for 50+ known non-ASCII characters across 5 categories (quotes, dashes, spaces, invisible, punctuation)
- Shows a detailed breakdown of every detected character with code points and counts
- One-click copy of cleaned ASCII output
- Runs entirely in the browser — no data is sent anywhere

## Development

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

```bash
npm run deploy
```
