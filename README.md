# Creator Scout

Scout and track creators across LinkedIn, Twitter/X, and Instagram from a shared Google Sheet.

## Quick Start (Easiest)

**👉 [Use the Simplified Web Version](README-SIMPLIFIED.md)** 

- ✅ Works on any device/browser
- ✅ No extensions needed
- ✅ One URL for entire team
- ✅ 5-minute setup

---

## Features

- **Email-based Scout Identity**: One email = one Scout ID, managed as single source of truth
- **Sequential Scout IDs**: Auto-generated SCOUT_001, SCOUT_002, etc.
- **Cross-browser Sync**: Same email gets same Scout ID on any device
- **Creator Tracking**: Save creators with status (new, pending, contacted)
- **Works Everywhere**: Web dashboard (any device) + optional Chrome extension

---

## Setup Options

### Option 1: Web Version (Recommended) ⭐

**For everyone who wants simple, works-everywhere scouting.**

👉 See [README-SIMPLIFIED.md](README-SIMPLIFIED.md)

- Team lead: Create sheet, deploy `apps-script-backend-simple.gs`, share URL
- Employees: Visit URL, sign in with email, start scouting
- Works on Windows, Mac, Linux, any browser, phones

---

### Option 2: Chrome Extension + Web App

**For teams that want quick in-page scouting from social profiles.**

Combines the web dashboard with optional Chrome extension for one-click saving from LinkedIn/Twitter/Instagram.

#### Team Lead (One-Time)

1. **Create Google Sheet** with two sheets:
   - `Creators` — tracks scouted creators
   - `Scouts` — tracks scout assignments

   **Scouts sheet columns** (headers in row 1):
   - A: email
   - B: scout_id  
   - C: scout_name
   - D: last_active

2. **Deploy Google Apps Script**:
   - Create new Apps Script project
   - Copy `apps-script-backend.gs` code
   - Replace `YOUR_SHEET_ID_HERE` with your Google Sheet ID (from sheet URL)
   - Deploy as new deployment → get public URL

3. **Share deployment URL** with team (e.g., `https://script.google.com/macros/s/ABC123.../usercontent`)

#### Employee (Per-Device)

1. **Install extension** in Chrome
2. **Configure API URL**:
   - Click extension icon → Settings
   - Paste Apps Script deployment URL
   - Click Save
3. **Sign in** with email → get Scout ID
4. **Optional**: Set scout name in Settings for team identification

#### Usage

1. Visit LinkedIn/Twitter/Instagram creator profile
2. Click extension popup
3. Click **💾 Save** to add to shared sheet
4. Click **✓ Contacted** when you've reached out
5. Click **📋 Copy** to copy outreach message
6. Click **💬 Send DM** to open DM interface

## Architecture

- **Backend** (Google Apps Script): Maintains Scout IDs by email, no duplicates possible
- **Frontend** (Chrome extension): User-configurable API URL, team name, message template
- **Storage** (Google Sheet): Single source of truth, shared across all users

## Files

- `manifest.json` — Chrome extension configuration
- `popup.html` / `popup.js` — UI for Settings and Dashboard
- `content.js` — Profile detection and creator panel injection
- `background.js` — Service worker lifecycle
- `apps-script-backend.gs` — Google Apps Script backend

## License

MIT
