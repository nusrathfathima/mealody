# Mealody 🍲

**Plan a week of meals around what's already in your kitchen.**

Live app: [mealody.nusrathfathima.com](https://mealody.nusrathfathima.com)
Portfolio: [nusrathfathima.com](https://nusrathfathima.com)

![Mealody screenshot](docs/screenshot-hero.png)

## The problem

Most meal-planning tools start from a recipe and hand you a shopping list of ingredients you don't have. Mealody starts from the other end: tell it what's in your kitchen, and it plans around that.

## What it does

- **A short conversation, not a form.** Four quick questions — ingredients, leftovers, vibe, cuisine — asked one at a time, chat-style.
- **A full week, generated progressively.** 21 meals (breakfast, lunch, dinner × 7 days) appear day by day rather than after one long wait, with a one-line reason for each dish.
- **Real recipes, generated on demand.** Tap any meal for ingredients scaled to your serving count, numbered steps, timing and a tip — fetched the moment you ask, then cached so repeat dishes are free.
- **Favorites & your own recipes.** Heart a dish from any week, or add your own family recipes by hand or with AI help. Picked dishes are woven into future weeks automatically — but only when their ingredients actually fit what's available that week.
- **Groceries, organized by store.** Send a recipe's ingredients to a shopping list with one tap, check items off, add notes and quantities, and share the whole list to WhatsApp or anywhere else.
- **Exports.** Download the week as a PDF (with or without full recipes) or as a shareable image.
- **Settings that persist.** Diet, servings and allergies are set once and remembered.

## Why it's built this way

Mealody is built with plain HTML, CSS and JavaScript — a deliberate choice to demonstrate a solid grasp of the fundamentals frameworks build on top of, and it keeps the app fast, dependency-free, and simple to deploy.

A few things worth knowing about:

- **The API key never reaches the browser.** The page calls my own serverless function (`api/generate.js`), which adds the Anthropic key server-side before forwarding the request. The function also clamps the maximum response size, so the endpoint can't be abused to run up a bill even if called directly.
- **The week generates in batches**, not one giant request — faster to first content, and a failure only affects a few days instead of the whole week.
- **Recipes are lazy and cached.** Nothing is generated until a card is tapped; a background queue then fills in the rest. Every recipe is cached by dish name, so a dish you've seen before is free the next time — which also roughly halves the AI cost of the feature.
- **Dish matching is deterministic, not left to the AI.** Whether a saved favorite fits into a new week (say, a paneer dish on a week planned around chicken) is decided in code before anything is sent to the model, so the rule always holds rather than depending on the AI reliably following an instruction.
- **Dark mode is checked for real contrast**, not just eyeballed — every color pairing is measured against accessibility contrast ratios rather than judged by how it looks on one screen.
- **Storage is currently client-side.** Favorites, personal recipes, grocery lists and settings live in the browser's `localStorage`. That keeps the app free to run and login-free to use, with the known tradeoff that data doesn't sync across devices — a backend is the planned next step (see below).

## Stack

| Layer | Choice |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| AI | Claude Haiku via the Anthropic API |
| Backend | One serverless function (`api/generate.js`) on Vercel |
| Hosting | Vercel, auto-deployed from this repo |
| Storage | Browser `localStorage` (no database yet) |
| Sharing | `html2canvas` for image export, Web Share API for grocery lists |

## Running it locally

There's no build step — it's a static file plus one serverless function.

```bash
git clone https://github.com/nusrathfathima/mealody.git
cd mealody
```

Open `index.html` directly in a browser to explore the UI. AI-powered features (plan generation, recipes) need the serverless function, so for those:

```bash
npm i -g vercel
vercel dev
```

Set `ANTHROPIC_API_KEY` in a `.env` file or your Vercel project settings — the key is never read from the frontend.

## Project structure

```
mealody/
├── index.html          # The entire app: markup, styles, and logic
├── api/
│   └── generate.js      # Serverless function — proxies requests to Anthropic
└── docs/                # Product spec and supporting docs
```

## What's next

- **A real backend** for saved recipes and grocery lists — accounts, a Postgres database, and background sync — so data follows the user across devices instead of living in one browser.
- Smaller ideas in progress: a remembered pantry, an installable offline-capable version (PWA), and a full step-by-step "cook mode."

## About this project

I built Mealody to solve a problem I actually have — deciding what to cook with what's already around — and used it as a chance to get comfortable with the full stack of building and shipping a real AI-powered product: prompting and cost control, protecting a secret API key, designing for both light and dark mode, and making a hundred small UX calls that don't show up in a feature list but shape whether an app feels good to use. It's the centerpiece of my developer portfolio at [nusrathfathima.com](https://nusrathfathima.com), where I write in more depth about the decisions behind it.
