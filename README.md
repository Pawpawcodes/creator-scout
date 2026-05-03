# Creator Scout

Simple, lightweight tool to scout and track creators across LinkedIn, Twitter/X, and Instagram.

- ✅ Works on any device/browser
- ✅ Email-based identity (auto-generates Scout IDs)
- ✅ Zero setup for employees
- ✅ Google Sheet as single source of truth

---

## Setup (Team Lead) - 5 Minutes

### 1. Create Google Sheet

Create a new Google Sheet with two sheets:

**Sheet: "Creators"** (Headers in Row 1)
```
A: profile_url
B: platform
C: username
D: status
E: scout_id
F: follower_count
G: bio
H: status_history
I: created_at
J: updated_at
```

**Sheet: "Scouts"** (Headers in Row 1)
```
A: email
B: scout_id
C: scout_name
D: last_active
```

### 2. Deploy to Google Apps Script

1. Go to [script.google.com](https://script.google.com) → New project
2. Delete default code
3. Copy all code from `apps-script-backend.gs`
4. Find line 5: `const SHEET_ID = 'YOUR_SHEET_ID_HERE';`
5. Replace with your Google Sheet ID (from your sheet URL)
6. **Save** → **Deploy** → **New Deployment**
7. Type: **Web app** → Execute as: **Your account** → Allow access: **Anyone**
8. Copy the deployment URL

### 3. Share with Team

Send team this link (that's it):
```
https://script.google.com/macros/s/YOUR_ID/usercontent
```

---

## Usage (Employee) - 30 Seconds

1. Click the link team lead sent
2. Enter your email → **Sign In**
3. Get your Scout ID (auto-generated)
4. **Add Creator**: Paste URL + select platform + enter username → Save
5. See your creator list

---

## Optional: Chrome Extension

For faster in-page scouting from social media profiles:

1. In Chrome: **Settings** → **Extensions** → Enable **Developer mode**
2. **Load unpacked** → Select the `extension/` folder
3. Click extension → **Settings** → Paste deployment URL
4. Visit creator profiles → Click extension → **Save**

See `extension/` folder for details.

---

## File Structure

```
creator-scout/
├── apps-script-backend.gs    (Deploy THIS to Google Apps Script)
├── README.md                 (You are here)
├── .gitignore
└── extension/                (Optional Chrome extension)
    ├── manifest.json
    ├── popup.html
    ├── popup.js
    ├── background.js
    └── content.js
```

---

## Tech Stack

- **Backend**: Google Apps Script (free, no server needed)
- **Frontend**: Pure JavaScript + HTML/CSS
- **Storage**: Google Sheets API
- **No dependencies**: Works everywhere

---

## License

MIT
