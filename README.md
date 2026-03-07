# Algorithia

Algorithia (Data City) is an interactive learning experience that mixes a Phaser-powered city builder with React-driven storytelling. Players explore algorithm-themed districts, answer questions, and run guided code simulations through the in-browser interpreter.

## Tech Stack
- React 19 + Vite for the UI shell and routing
- Phaser 3.90 for the game loop and district rendering
- Monaco Editor integrations for the locked Java editor experience
- Framer Motion for lightweight animation flourishes

## Prerequisites
- Node.js 20.10+ (LTS) and npm 10+
- Git for cloning and pushing changes

## Run Locally
1. Clone the repository and move into the project folder:
	```bash
	git clone https://github.com/Drishti-01/Algorithia.git
	cd Algorithia
	```
2. Install project dependencies (this pulls everything listed in `package.json`, including Phaser, Framer Motion, Monaco, React Router, and Vite):
	```bash
	npm install
	```
3. Start the Vite dev server:
	```bash
	npm run dev
	```
4. Visit the URL printed by Vite (usually http://localhost:5173) to explore Algorithia.

## Essential npm Packages
`npm install` installs all of these automatically, but if you need to add them individually to a fresh project or troubleshoot an environment, these are the commands (versions controlled by `package.json`):

```bash
# React core + router
npm install react react-dom react-router-dom

# Game engine
npm install phaser

# Animations
npm install framer-motion

# Editor integrations
npm install monaco-editor @monaco-editor/react

# Build tooling and dev experience
npm install -D vite @vitejs/plugin-react eslint @eslint/js eslint-plugin-react-hooks eslint-plugin-react-refresh globals
```

## Build & QA
- `npm run build` bundles the production assets.
- `npm run preview` serves the production build locally for smoke tests.
- `npm run lint` runs ESLint across the project.

## Project Structure
```
src/
  components/        # Shared UI pieces and panels
  engine/            # Parser + interpreter powering the sim steps
  game/              # Phaser scenes and district logic
  pages/             # Top-level routed views
  sections/          # Landing page marketing sections
  simulation/        # Low-level tokenizer + simulator utilities
  constants/, data/  # Content, question banks, and templates
```

## Environment Notes
- Assets live under `src/assets`; keep file names ASCII to avoid Vite path issues.
- If you add env-specific config, place it in `.env.local` and document the keys here.

## Deployment Checklist
1. Run `npm run lint` and `npm run build` to ensure clean output.
2. Commit your changes and push to the chosen remote.
3. Configure your hosting provider (Vercel, Netlify, GitHub Pages, etc.) to run `npm install && npm run build` and publish the `dist/` folder.

## Contributing
Issues and PRs are welcome. Please include screenshots or short videos for any UX-facing change to simplify review.
