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

### Call Selection
- **Click the ★ star** on any call to mark it as a target
- Selected calls appear in a prominent "My Target Calls" section at the top
- **Export IDs** button copies selected topic IDs as JSON to clipboard
- Paste exported IDs into `data/selected.json` and commit — all site visitors will see your selections
- Selections persist in browser `localStorage` across sessions

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

## Marking Calls You're Applying For

### Option 1: Interactive (in the browser)
Click the ★ star icon on any row in the Call Explorer table. Your selections are saved in your browser's `localStorage` and appear in the "My Target Calls" section.

### Option 2: Git-committed (visible to all visitors)
1. Click **Export IDs** in the "My Target Calls" section to copy your selected topic IDs
2. Paste them into `data/selected.json`:

```json
[
  "HORIZON-CL4-2026-05-DIGITAL-EMERGING-02",
  "HORIZON-HLTH-2026-01-DISEASE-04"
]
```

3. Commit and push — all visitors will see these calls highlighted

## Deploying to GitHub Pages

1. Push this repository to GitHub
2. Go to **Settings → Pages**
3. Set source to **Deploy from a branch**, select `main` / `/ (root)`
4. Your site will be live at `https://<username>.github.io/<repo-name>/`

## Refreshing Call Data

Call data is stored in `data/calls.json`. To refresh it from the EU SEDIA API:

```bash
# Fetch all open + forthcoming grant calls across all EU programmes
python3 scripts/fetch_calls.py
```

This queries the official EU Search API at `api.tech.ec.europa.eu` with:
- **API Key**: `SEDIA`
- **Filter**: grants (type 1, 2, 8), open + forthcoming (status 31094501, 31094502)
- **Pagination**: 100 results per page across all pages

## Project Structure

```
├── index.html              Single-page dashboard
├── css/styles.css           All styles (dark/light themes, responsive)
├── js/app.js                Search, filters, pagination, selection, charts
├── data/
│   ├── calls.json           All 939 call entries (minified)
│   └── selected.json        Your selected call IDs (git-committed)
├── scripts/
│   └── fetch_calls.py       Script to refresh call data from SEDIA API
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
- **[EU SEDIA API](https://api.tech.ec.europa.eu/)** — data source

## Data Source

All call data sourced from the [EU Funding & Tenders Portal](https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/calls-for-proposals) via the SEDIA Search API. This is official European Commission data.

## License

MIT
