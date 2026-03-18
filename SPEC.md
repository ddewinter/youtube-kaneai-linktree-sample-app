# LinkBio — Demo App for KaneAI Video

## Purpose

A simple link-in-bio app (like Linktree) built for the KaneAI tutorial video. This app serves three roles in the video:

1. **Section 2 (60-Second Demo)**: KaneAI generates test scenarios and runs them against this app
2. **Section 4 (Localhost Testing)**: The app runs locally — KaneAI connects and tests it on localhost
3. **Section 5 (Auto-Healing)**: We change the UI (rename a button, swap a component), rerun the tests, and show KaneAI adapting
4. **Section 6 (API Testing)**: KaneAI validates the REST API endpoints in plain English

The app needs to be visually clear on camera, simple enough that viewers understand it instantly, and have enough interactive elements to generate interesting test cases.

## Tech Stack

- **Frontend**: React (Vite) — single page app
- **Backend**: Express.js
- **Database**: SQLite (via better-sqlite3) — persistent but zero-config
- **No auth** — no login, no accounts, no sessions
- **Runs on**: `localhost:3000` (API) and `localhost:5173` (frontend dev server), or serve the built frontend from Express on `localhost:3000`

For simplicity during filming, build the frontend and serve it from Express so there's only one URL to point KaneAI at: `http://localhost:3000`

## Pages

### 1. Editor Page (`/`)

This is where you manage your links. Layout:

**Header area:**
- Profile name (editable text field, defaults to "Kevin Stratvert")
- Profile tagline (editable text field, defaults to "Tech tutorials for everyone")

**Add link form:**
- Title field (text input, placeholder: "Link title")
- URL field (text input, placeholder: "https://...")
- "Add Link" button (this is the button we'll rename during the auto-healing demo)

**Link list:**
- Each link shows: title, URL (truncated), and three action buttons: Edit, Delete, Move Up/Move Down
- Links display in order (position field)
- Edit opens an inline edit mode (fields become editable in place)
- Delete removes the link with no confirmation (keep it simple)
- Move Up/Move Down reorder the links

**Footer area:**
- "View My Page" button — navigates to the public page
- Link count display: "5 links"

### 2. Public Page (`/p`)

The shareable link-in-bio page. Layout:

**Profile section:**
- Profile name (large text)
- Profile tagline (smaller text below)
- Simple avatar placeholder (colored circle with initials)

**Links section:**
- Each link rendered as a full-width button/card
- Clicking a link opens the URL in a new tab
- Links display in the same order as the editor

**Footer:**
- "Built with LinkBio" text (small, at bottom)

### 3. Theme Picker (for auto-healing demo)

On the editor page, add a simple theme selector — 3 options:

- **Light** (default): white background, dark text, blue accent buttons
- **Dark**: dark background, light text, purple accent buttons
- **Colorful**: gradient background, white text, rounded colorful buttons

The theme applies to the public page only. This gives us a visible UI change for the auto-healing demo — swap the theme, the public page looks completely different, but KaneAI should still find and click the right elements.

## API Endpoints

All endpoints under `/api`:

### Links

```
GET    /api/links          — Returns all links, ordered by position
POST   /api/links          — Create a new link. Body: { title: string, url: string }
GET    /api/links/:id      — Returns a single link by ID
PUT    /api/links/:id      — Update a link. Body: { title?: string, url?: string }
DELETE /api/links/:id      — Delete a link
PUT    /api/links/reorder  — Reorder links. Body: { ids: number[] } (array of link IDs in new order)
```

### Profile

```
GET    /api/profile         — Returns profile info: { name, tagline, theme }
PUT    /api/profile         — Update profile. Body: { name?: string, tagline?: string, theme?: string }
```

### Response format

All responses return JSON:

```json
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "error": "Description of what went wrong" }
```

### Validation rules

- Link title: required, 1-100 characters
- Link URL: required, must start with http:// or https://
- Profile name: required, 1-50 characters
- Profile tagline: optional, 0-200 characters
- Theme: must be one of "light", "dark", "colorful"

These validation rules matter because KaneAI can test them — "Try creating a link with an empty title and verify the API returns an error."

## Seed Data

On first run, pre-populate with 3 links so the app isn't empty during filming:

1. **YouTube** — title: "YouTube Channel", url: "https://www.youtube.com/@kevinstratvert"
2. **Website** — title: "My Website", url: "https://kevinstratvert.com"
3. **Twitter** — title: "Twitter/X", url: "https://x.com/kevinstratvert"

Profile: name "Kevin Stratvert", tagline "Tech tutorials for everyone", theme "light"

## KaneAI Test Scenarios (what we'll demo)

These are the test cases we expect to generate/write in KaneAI. They map to video sections:

### For Section 2 — 60-Second Demo (Scenario Generation)

Upload this as a prompt or text file to KaneAI's scenario generation:

```
App: LinkBio — a link-in-bio page builder running at http://localhost:3000

Scenario 1: Link Management
- Verify the editor page loads with existing links
- Add a new link with title "Instagram" and URL "https://instagram.com/kevinstratvert"
- Verify the new link appears in the list
- Edit the link title to "Instagram Profile"
- Delete the link and verify it's removed

Scenario 2: Public Page
- Navigate to the public page at /p
- Verify the profile name "Kevin Stratvert" is displayed
- Verify all links are visible as buttons
- Click a link and verify it opens in a new tab
- Change the theme to "Dark" from the editor and verify the public page updates
```

### For Section 5 — Auto-Healing Demo

Before: Button says "Add Link"
Change: Rename button to "Create New Link" (or swap to a different component)
Expected: KaneAI reruns the test that clicks "Add Link" and still finds the right button

### For Section 6 — API Testing

Natural language prompts for KaneAI:
- "Send a GET request to /api/links and verify it returns a list of links"
- "POST a new link with title 'LinkedIn' and URL 'https://linkedin.com' and verify the response includes an ID"
- "Try to POST a link with an empty title and verify the API returns an error"
- "DELETE a link by ID and verify a subsequent GET doesn't include it"

## Design Notes

- Keep the UI clean and large — this will be on a 1080p screen recording. No tiny text.
- Use clear, readable fonts (system font stack is fine)
- Buttons should be obviously clickable — good contrast, hover states
- The editor and public pages should look visually distinct so viewers can tell them apart on camera
- No animations or transitions that would make screen recording look choppy

## What NOT to Build

- No user authentication
- No image uploads
- No analytics/tracking
- No deployment features
- No social media integrations
- No custom domains
- No drag-and-drop (move up/down buttons are simpler and more testable)
