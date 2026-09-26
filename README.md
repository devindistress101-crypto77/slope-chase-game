# Slope Chase

Slope Chase is a browser game where players catch the villain known as "The Slope" by matching the correct linear equation.

The player adjusts the slope and intercept on the dials to build a line like:
y = 2x + 1

If the equation matches the villain's hidden line, the villain is caught. Each successful capture earns points, and the game tracks a persistent high score using browser storage.

## Features

- Adjustable slope dial
- Adjustable intercept dial
- Live equation text
- Timer and score system
- Streak bonus
- Persistent save and high score
- Ready to deploy on Vercel

## Tech Stack

- React
- Vite
- JavaScript

## Local Development

```bash
npm install
npm run dev
```

Then open the local URL shown in the terminal.

## Production Build

```bash
npm run build
```

## Deploy to Vercel

1. Push this project to GitHub
2. Import the repository in Vercel
3. Use the default Vite build settings
4. Deploy

## Save and High Score

This game saves progress and the best score in the browser using localStorage, so it works in the deployed app without needing a backend.

## Goal

Catch the villain by matching the correct line before time runs out.
