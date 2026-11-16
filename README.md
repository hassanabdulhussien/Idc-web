# IDC — Interactive React Demo

A playful, pixel-inspired web experience built with React and Vite. Visitors move through a five-screen flow with interactive controls, visual progress, and a restart option.

## What it demonstrates

- Component-based UI with reusable layout and decoration components.
- React state and refs for screen transitions and interaction tracking.
- Interactive buttons, a care meter, and a joke generator.
- A lightweight Vite build configured for deployment on Vercel.

## Tech stack

React 18 · JavaScript · CSS · Vite

## Run locally

Use Node.js 24, matching the version declared in `package.json`.

```bash
npm install
npm run dev
```

Create and preview a production build:

```bash
npm run build
npm run preview
```

## Project structure

| Path | Purpose |
| --- | --- |
| `src/App.jsx` | Screen flow and shared interaction state |
| `src/screens/` | Individual steps in the experience |
| `src/components/` | Layout, progress, decorations, and interactive controls |
| `src/styles.css` | Application styling |
| `vercel.json` | Deployment configuration |

## Author

Built by [Hassan Abdulhussien](https://github.com/hassanabdulhussien), Software Developer.
