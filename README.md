
# The Messenger's Path

**Full Disclosure:** This is a game I've completely vibe-coded as a fun experiment, paying homage to the text-based adventure games of the DOS era. While it's not perfect, I hope it inspires you to bring back text adventures with depth in story and branching choices.

## Overview
A modern, immersive text adventure game playable in your browser or CLI. Navigate branching choices, manage stats, and uncover clues as you journey through a world inspired by classic DOS-era adventures.

## Features
- Playable in web browser (static HTML/JS/CSS, no backend required)
- Branching storylines and meaningful choices
- Stat and inventory management
- Clue and ally system
- Modern, accessible UI

## Getting Started
1. Clone this repository.
2. Install dependencies (for local server):
   ```sh
   npm install --no-save serve
   ```
3. Start the local server:
   ```sh
   npx serve webui -l 5173
   ```
4. Open your browser to [http://localhost:5173](http://localhost:5173)

## Usage
- To play in the browser, use the local server as above or visit the [GitHub Pages site](https://techiedip.github.io/The-Messengers-Path/) (if enabled).
- To play in the CLI, run:
  ```sh
  npm run dev
  ```

## Folder Structure
- `webui/` — Web UI (HTML, JS, CSS, content JSON)
- `src/` — TypeScript game engine (CLI, shared logic)
- `docs/` — Design notes, context, and testing

## License
MIT
