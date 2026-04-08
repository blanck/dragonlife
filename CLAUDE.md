# DragonLife - Math Game

## Quick Start
```bash
npm install
npm run dev
```

## Tech Stack
- Vite + React + TypeScript
- No external UI library — custom CSS with touch-friendly design
- Browser localStorage for persistence (database planned later)

## Project Structure
- `src/App.tsx` — Main app component with all screens (welcome, register, home, categories, challenge)
- `src/types.ts` — TypeScript types
- `src/categories.ts` — Math category definitions
- `src/questions.ts` — Question generators for each category
- `src/storage.ts` — localStorage wrapper
- `src/index.css` — All styles (dark theme, mobile-first)

## Key Design Decisions
- Single-page app with screen state management (no router yet)
- Touch-friendly: min 56px button height, large tap targets
- 5 questions per round, 4+ correct = level up
- Coins: 10 base + 5 per streak multiplier
- Categories unlock based on grade selection (+2 grade buffer)

## Development Notes
- Run `npm run dev` to start with hot reload
- Run `npx tsc --noEmit` to type check
- Keep the UI simple and touch-friendly — this will run on tablets
