# Creator Scout - Simplified Web Version

**One setup. One URL. Works on any device.**

No browser extensions, no complex configuration. Team members just need to sign in with email.

## How It Works

- **Email = Scout ID** (auto-generated on first login)
- **One URL** for entire team
- **Works everywhere**: Windows, Mac, Linux, any browser

---

## Setup (Team Lead) - 5 Minutes

### Step 1: Create Google Sheet

Create a new Google Sheet with these two sheets:

**Sheet 1: "Creators"** (Column Headers in Row 1)
| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| profile_url | platform | username | status | scout_id | follower_count | bio | status_history | created_at | updated_at |

**Sheet 2: "Scouts"** (Column Headers in Row 1)
| A | B | C | D |
|---|---|---|---|
| email | scout_id | scout_name | last_active |

### Step 2: Deploy Google Apps Script

1. Go to **Google Apps Script** (script.google.com)
2. Create new project
3. **Delete default code**, copy ALL of `apps-script-backend-simple.gs`
4. Find this line (around line 5):
   ```
   const SHEET_ID = 'YOUR_SHEET_ID_HERE';
   ```
   Replace with your Google Sheet ID:
   ```
   const SHEET_ID = '1a2b3c4d5e6f7g8h9i0j'; // From your sheet URL
   ```
5. **Save** (Ctrl+S)
6. Click **"Deploy"** → **"New Deployment"**
7. Select type: **"Web app"**
8. Execute as: **Your account**
9. Allow access: **Anyone**
10. Copy the **deployment URL** (looks like: `https://script.google.com/macros/s/ABC123.../usercontent`)

### Step 3: Share with Team

Send team this link (nothing else needed):
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/usercontent
```

---

## Usage (Employee) - 30 Seconds

1. **Visit the link** team lead sent
2. **Enter your email** → Click "Sign In"
3. **Get your Scout ID** (auto-generated)
4. **Add creators**: Paste URL, select platform, enter username
5. **Done!** List appears instantly

---

## Features

✅ Add creators from LinkedIn/Twitter/Instagram
✅ Auto-tracked by email (same email = same Scout ID)
✅ View your creator list
✅ Track status (pending, contacted, etc.)
✅ Works on phone, tablet, desktop
✅ No extensions, no complicated setup

---

## Files

- `apps-script-backend-simple.gs` — Deploy THIS file to Google Apps Script
- `apps-script-backend.gs` — Original version (for Chrome extension)
- `manifest.json` / `popup.html` / `popup.js` / `content.js` / `background.js` — Chrome extension (optional add-on)

---

## Optional: Chrome Extension for Quick Scouting

After team is using the web version, employees can optionally install the Chrome extension to save creators directly from social media profiles without copying URLs.

1. Go to `chrome://extensions`
2. Enable **"Developer mode"** (top right)
3. Click **"Load unpacked"** 
4. Select the folder with `manifest.json`
5. Click extension → **Settings** → paste Apps Script URL
6. Visit creator profiles on LinkedIn/Twitter/Instagram → click extension → **Save**

---

## Troubleshooting

**"Invalid action" error?**
- Verify SHEET_ID is updated in apps-script-backend-simple.gs
- Re-deploy to Google Apps Script
- Refresh the web page

**Can't see creators list?**
- Make sure "Creators" and "Scouts" sheet names match exactly
- Column headers in Row 1 should match the schema above

**Need to start over?**
- Create new Google Sheet
- Update SHEET_ID in code
- Re-deploy

---

## Architecture

- **Backend**: Google Apps Script (serves web interface + API)
- **Frontend**: Web dashboard (no installation needed)
- **Storage**: Google Sheet (single source of truth)
- **No dependencies**: Pure JavaScript, no libraries

---

## License

MIT
