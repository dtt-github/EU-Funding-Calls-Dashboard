# EU Funding Calls Dashboard

A fast, intelligent, static dashboard for all open and forthcoming EU Funding & Tenders calls — covering **939 topics** across **29 EU programmes** including Horizon Europe, Digital Europe, EDF, Erasmus+, Creative Europe, and more.

**[Live Demo →](https://dtt-github.github.io/EU-Funding-Calls-Dashboard/)**

## Features

### Intelligent Search
- **Fuzzy matching** via [Fuse.js](https://www.fusejs.io/) — handles typos and partial words
- **Synonym expansion** — search "construction" and find calls about manufacturing, materials, infrastructure, etc.
- **Keyword enrichment** — each call is tagged with industry-relevant terms for better discoverability
- Results ranked by relevance when searching

### Filtering & Navigation
- **Programme tabs** — quick switch between Horizon Europe, Digital Europe, EDF, Erasmus+ and more
- **Filter pills** — filter by Programme, Status (Open / Forthcoming), Action Type, and Stage
- **Pagination** — 25 calls per page with full page navigation
- Filters, search, and tabs all work together and reset pagination automatically

### Call Selection & Sharing
- **Click the ★ star** on any call to mark it as a target
- Selected calls appear in a prominent "My Target Calls" section at the top
- **Sign in** with email + password (Supabase) to save selections to your account
- **Share your selections** — click the Share button to copy a link; recipients see your picks highlighted in blue
- Multiple users can maintain independent selections on the same dashboard
- **Export IDs** button copies selected topic IDs as JSON to clipboard
- Falls back to browser `localStorage` when not signed in

### Data & Visualization
- **939 calls** fetched live from the [EU SEDIA API](https://api.tech.ec.europa.eu/search-api/prod/rest/search)
- **536 open** + **403 forthcoming** calls (as of data fetch date)
- Doughnut charts: by Programme, by Status, by Action Type
- Live countdown to the next submission deadline
- Direct links to the EU Funding & Tenders Portal for every topic

### Design
- Light/dark theme following system preference, with manual toggle
- Fully responsive — works on desktop, tablet, and mobile
- Zero build step — pure HTML, CSS, and vanilla JS
- Loads fast on GitHub Pages (gzipped JSON ~100 KB)

## Quick Start

Open `index.html` directly in a browser, or serve locally:

```bash
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## User Authentication (Supabase)

The dashboard uses [Supabase](https://supabase.com/) for email + password authentication and per-user selections stored in PostgreSQL.

### Setup

1. Create a Supabase project at [supabase.com](https://supabase.com/)
2. Run `scripts/supabase-setup.sql` in the Supabase SQL Editor to create the `selections` table and RLS policies
3. Copy your **Project URL** and **anon public key** from Settings → API
4. Paste them into `js/config.js`
5. Commit and push — authentication is now live

### Sharing Selections

1. Sign in → select calls with ★ star → click **Share**
2. A link like `https://...?shared=USER_ID` is copied to your clipboard
3. Anyone opening the link sees your selections highlighted in blue (read-only)
4. They can sign in themselves to make their own selections alongside yours

### Anonymous Fallback

Without signing in, selections are saved in browser `localStorage` and work the same as before.

## Deploying to GitHub Pages

1. Push this repository to GitHub
2. Go to **Settings → Pages**
3. Set source to **Deploy from a branch**, select `main` / `/ (root)`
4. Your site will be live at `https://<username>.github.io/<repo-name>/`

## Refreshing Call Data

### Automatic (GitHub Actions)

A workflow at `.github/workflows/update-calls.yml` runs **every Monday at 06:00 UTC** and fetches fresh data from the EU SEDIA API. If the data changed, it auto-commits and pushes — GitHub Pages redeploys automatically.

You can also trigger it manually from the repo's **Actions** tab → "Update EU Funding Calls" → **Run workflow**.

### Manual

```bash
python3 scripts/fetch_calls.py
```

This queries the official EU Search API at `api.tech.ec.europa.eu` with:
- **API Key**: `SEDIA`
- **Filter**: grants (type 1, 2, 8), open + forthcoming (status 31094501, 31094502)
- **Pagination**: 100 results per page across all pages

## Project Structure

```
├── index.html                  Single-page dashboard
├── css/styles.css              All styles (dark/light themes, responsive)
├── js/
│   ├── app.js                  Search, filters, pagination, selection, charts
│   ├── auth.js                 Supabase auth + selection CRUD
│   └── config.js               Supabase project URL + anon key
├── data/
│   └── calls.json              All 939 call entries (minified)
├── scripts/
│   ├── fetch_calls.py          Script to refresh call data from SEDIA API
│   └── supabase-setup.sql      SQL to create selections table + RLS
├── .github/workflows/
│   └── update-calls.yml        Weekly auto-refresh via GitHub Actions
└── README.md
```

## Data Fields

Each call in `calls.json` has:

| Field | Description |
|-------|-------------|
| `topicId` | Unique topic identifier (e.g. `HORIZON-CL4-2026-05-DIGITAL-EMERGING-02`) |
| `title` | Full call title |
| `programme` | EU programme name (Horizon Europe, Digital Europe, etc.) |
| `programmeId` | SEDIA programme ID |
| `cluster` | Horizon Europe cluster (CL1–CL6, MSCA, ERC, etc.) |
| `callIdentifier` | Parent call identifier |
| `actionType` | RIA, IA, CSA, Grant, Prize, etc. |
| `deadline` | Submission deadline (YYYY-MM-DD) |
| `stage` | `single` or `two-stage` |
| `callStatus` | `open` or `forthcoming` |
| `keywords` | Comma-separated keywords from the EU portal |
| `portalUrl` | Direct link to the topic on the EU portal |

## Tech Stack

- **HTML5** — semantic markup, no framework
- **CSS3** — custom properties for theming, Grid/Flexbox for layout
- **Vanilla JavaScript** — no build step, no transpilation
- **[Chart.js 4](https://www.chartjs.org/)** — doughnut charts (CDN)
- **[Fuse.js 7](https://www.fusejs.io/)** — fuzzy search (CDN)
- **[Supabase JS v2](https://supabase.com/docs/reference/javascript)** — auth + database (CDN)
- **GitHub Actions** — automated weekly data refresh
- **[EU SEDIA API](https://api.tech.ec.europa.eu/)** — data source

## Data Source

All call data sourced from the [EU Funding & Tenders Portal](https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/calls-for-proposals) via the SEDIA Search API. This is official European Commission data.

## License

MIT
