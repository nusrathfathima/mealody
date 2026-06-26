# Deploying Mealody (with working AI) — Step by Step

Mealody calls the Claude AI, which needs a secret API key. You can't put that key in a public
GitHub file, so we use a tiny **serverless function** on **Vercel** that holds the key secretly
and relays the AI calls. This guide walks you through it.

Your project folder looks like this:

```
mealody/
├─ index.html        ← the app (front-end)
├─ api/
│  └─ generate.js    ← serverless function (keeps your key secret)
├─ package.json
└─ .gitignore
```

---

## STEP 1 — Get an Anthropic API key

1. Go to https://console.anthropic.com and sign up / log in.
2. Add a small amount of credit (Billing → add ~$5; plenty for a portfolio demo).
3. Go to **API Keys** → **Create Key**. Copy it somewhere safe.
   - It looks like `sk-ant-...`
   - **Never** paste this into your code or commit it to GitHub.

---

## STEP 2 — Put the project on GitHub

1. Create a new repo on GitHub called `mealody`.
2. On your computer, in the `mealody` folder:

```
cd B:\mealody
git init
git add .
git commit -m "Mealody — AI meal planner with serverless backend"
git branch -M main
git remote add origin https://nusrathfathima:YOUR_TOKEN@github.com/nusrathfathima/mealody.git
git push -u origin main
```

(Use your Personal Access Token like your other repos.)

---

## STEP 3 — Deploy on Vercel

1. Go to https://vercel.com and sign up with your **GitHub account** (free).
2. Click **Add New… → Project**.
3. Find and **Import** your `mealody` repo.
4. Vercel auto-detects it's a static site + serverless function. Leave defaults.
5. **Before clicking Deploy**, open **Environment Variables** and add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** paste your `sk-ant-...` key
   - Click **Add**.
6. Click **Deploy**.

After ~30 seconds you'll get a live URL like `https://mealody.vercel.app`.
Open it and try "Plan my week" — the AI now works live, with your key kept secret on the server. 🎉

---

## STEP 4 — (Optional) Custom domain

If you want `mealody.yourdomain.com`:
1. In Vercel → your project → **Settings → Domains**.
2. Add your domain and follow the DNS instructions (similar to what you did for your portfolio).

---

## STEP 5 — Add it to your portfolio

Once it's live, add a project card linking to your Vercel URL (live demo) and the GitHub repo (code).
We can build that card together — just say the word.

---

## Updating later (polishing after deployment)

Any time you change the app:
```
cd B:\mealody
git add .
git commit -m "describe your change"
git push
```
Vercel automatically redeploys within a minute. That's it.

---

## Costs & safety notes

- You're billed per AI request (pennies for normal portfolio traffic).
- To avoid surprises: in the Anthropic console you can set a **monthly spend limit**.
- Your key is only ever stored in Vercel's environment variables — never in the public code.
- If you ever expose the key by accident, revoke it in the Anthropic console and create a new one.

---

## How it works (for interviews — good to understand!)

1. The browser sends the prompt to **your** endpoint: `/api/generate`.
2. That serverless function (running on Vercel) adds your secret API key and forwards the
   request to Anthropic.
3. Anthropic responds; your function passes the result back to the browser.
4. The key never leaves the server, so it's safe even though the front-end is public.

This is the standard pattern for using any paid API safely from a public website.
