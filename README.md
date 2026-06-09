# Creator Scout - Centralized

A Chrome extension that helps your team save and track creator profiles from LinkedIn, Twitter/X, and Instagram. Team lead maintains a centralized Master Sheet, scouts track their own creators in personal sheets.

---

## Architecture Overview

**Team Lead** → Deploys Apps Script, creates Master Sheet + personal sheets for each scout, stores sheet IDs  
**Scouts** → Use extension to save creators, which sync to their personal sheets and the Master Sheet

- **Master Sheet** (Team Lead only): All creators from all scouts, organized by Scout ID
- **Personal Sheets** (Team Lead creates one per scout): Individual scout creators
- **Scouts Tab**: Scout ID | Email | Sheet ID (used for email validation and ID lookup)
- **Email Validation**: Extension validates email and automatically retrieves personal sheet ID

---

## Quick Start

### Team Lead Setup (10 minutes)

1. Create a Google Sheet called "Creator Scout Master"
2. Deploy `TEAM-LEAD-APPS-SCRIPT-TEMPLATE.gs` to your Google Account
3. Create personal Google Sheets for each scout (name them "Creator Scout - [Scout Name]")
4. In the "Scouts" tab, add each scout with their sheet ID:
   ```
   Scout ID | Email | Sheet ID
   SCOUT_001 | alice@company.com | [personal_sheet_id]
   SCOUT_002 | bob@company.com | [personal_sheet_id]
   ```
5. Share with scouts: the deployment URL + the zip file

### Scout Setup (2 minutes per scout)

1. Extract the zip file
2. Open Chrome → `chrome://extensions` → Enable Developer mode → Load unpacked → Select the Extension folder
3. Click the extension icon → Enter:
   - Your email address
   - Team lead's deployment URL
4. **Done!** Start scouting creators

---

## Detailed Setup

### Step 1: Team Lead - Create Master Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a **Blank spreadsheet** and name it "Creator Scout Master"
3. Keep it open for the next step

---

### Step 2: Team Lead - Deploy Apps Script

1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. Delete any existing code
3. Copy the entire code from `TEAM-LEAD-APPS-SCRIPT-TEMPLATE.gs`
4. Paste it into the Apps Script editor
5. Click **Deploy** (top right)
6. Select **New deployment**
7. Choose **Web app** from the dropdown
8. Set:
   - **Execute as**: Your email
   - **Who has access**: Anyone
9. Click **Deploy**
10. Grant permissions when prompted
11. Copy the deployment URL from the dialog
    - Format: `https://script.google.com/macros/s/[LONG_ID]/useless`

**Save this URL — you'll share it with all scouts.**

Your Google Sheet will auto-create two tabs:
- **Master**: Stores all creators from all scouts
- **Scouts**: Registry of scout emails → scout IDs

---

### Step 3: Team Lead - Create Scout Sheets & Register

1. For each scout, create a new Google Sheet named "Creator Scout - [Scout Name]"
2. Copy the sheet ID from the URL:
   - URL: `https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit`
   - Sheet ID: `1a2b3c4d5e6f7g8h9i0j`
3. In your Master Sheet, click the **Scouts** tab
4. Add each scout:
   ```
   SCOUT_001 | alice@company.com | 1a2b3c4d5e6f7g8h9i0j
   SCOUT_002 | bob@company.com | 2x3y4z5a6b7c8d9e0f1g
   ```
5. Share the deployment URL + zip file with your scouts

---

### Step 4: Scout - Install Extension

1. Download and extract the `Extension/` folder
2. Open Chrome → go to `chrome://extensions/`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked**
5. Select the `Extension/` folder
6. Optional: Pin Creator Scout to your toolbar

---

### Step 5: Scout - Configure Extension

1. Click the **Creator Scout** extension icon
2. Enter:
   - **Scout Email**: Your email
   - **Deployment URL**: The URL from your team lead
3. Click **Save Settings**
4. If email is not registered, contact your team lead

**You're done!** Start scouting creators.

---

### Step 7: Test It Works

1. Go to any LinkedIn, Twitter/X, or Instagram **profile**
2. Click the **Creator Scout** extension icon
3. You should see a status widget
4. Click **Save Creator**
5. Check your personal Google Sheet — creator appears in the **Master** tab
6. Check team lead's Master Sheet — creator appears with your Scout ID

---

## How It Works

```
You visit a creator profile
         ↓
Click Creator Scout extension icon
         ↓
Extension validates your email with Apps Script
         ↓
Apps Script returns your personal sheet ID (from Scouts tab)
         ↓
Extension extracts creator info (username, platform, URL)
         ↓
Sends to Team Lead's Apps Script deployment URL
         ↓
Apps Script saves to Team Lead's Master Sheet (with your Scout ID)
         ↓
Apps Script saves to your Personal Sheet (using stored ID)
         ↓
Creator added to both sheets ✓
```

---

## Supported Platforms

✅ **LinkedIn** — Personal profiles, Creator profiles  
✅ **Twitter / X** — User profiles  
✅ **Instagram** — Creator profiles, Business profiles  

Make sure you're on the actual profile page (not search results or home feed).

---

## Status Indicator

The extension icon shows color-coded status:

| Color | Status | Meaning |
|-------|--------|---------|
| 🟢 Green | Saved | Creator already in your list |
| ⚫ Gray | New | Creator not scouted yet |
| 🔴 Red | Error | Something went wrong |
| 🔵 Blue | Setup | Settings need configuration |

---

## Master Sheet Structure (Team Lead)

Your Master Sheet automatically has these columns:

| Column | Content |
|--------|---------|
| Scout ID | Identifier for the scout (e.g., SCOUT_001) |
| Profile URL | Direct link to creator |
| Platform | LinkedIn / Twitter/X / Instagram |
| Username | Creator's username |
| Status | Always "saved" |
| Created At | When creator was saved |
| Updated At | Last update |

The **Scouts** tab contains:

| Column | Content |
|--------|---------|
| Scout ID | Unique identifier (e.g., SCOUT_001) |
| Email | Scout's email address |

---

## Personal Sheet Structure (Each Scout)

Your personal sheet automatically has a **Master** tab with:

| Column | Content |
|--------|---------|
| Profile URL | Direct link to creator |
| Platform | LinkedIn / Twitter/X / Instagram |
| Username | Creator's username |
| Status | Always "saved" |
| Created At | When you saved them |
| Updated At | Last update |

---

## Troubleshooting

### "Email not registered. Contact team lead."
- Your email must be added to the Master Sheet's **Scouts** tab by your team lead
- Check that the email you entered exactly matches the email in the Scouts tab
- Contact your team lead to register

### "Could not extract creator profile"
- You must be on a profile page, not search results or home
- Try refreshing the page and trying again
- Make sure the creator's profile URL is in the address bar

### "Error validating email"
- Check that your Deployment URL is correct (copy it exactly from team lead)
- Make sure your email matches exactly in the Master Sheet's Scouts tab
- Make sure the Team Lead successfully deployed the Apps Script

### Nothing happens when I click "Save Creator"
- Check browser console for errors: Right-click → Inspect → Console
- Verify all three settings are entered: email, deployment URL, personal sheet ID
- Try refreshing the page

### Creator doesn't appear in my personal sheet
- Refresh your Google Sheet (F5 or Cmd+R)
- Check that you're looking at the **Master** sheet tab
- Check browser console for errors

### Creator not showing in team lead's Master Sheet
- Refresh the team lead's Google Sheet
- Check that your Scout ID is correct in the Scouts tab
- Check browser console for errors

### Test the deployment URL directly:
```
https://script.google.com/macros/s/[YOUR_ID]/useless?action=validateEmail&email=your.email@company.com
```

You should see:
```json
{"valid":true}
```

If false, your email isn't registered in the Scouts tab.

---

## Data Privacy & Security

✅ **Team Lead's Master Sheet**
- Only accessible to team lead
- Contains all creators with scout IDs
- No one else can access it

✅ **Scout Personal Sheets**
- Only each scout can access their own sheet
- Scouts cannot see other scouts' data
- Completely isolated by email

✅ **Secure Design**
- Apps Script deployed to team lead's account
- Only team lead controls the deployment URL
- No authentication bypass — email must be registered
- No data collection or tracking
- Extension doesn't report to external servers

---

## Team Coordination

### Adding a New Scout
1. Team lead creates a new personal Google Sheet for the scout
2. Team lead adds scout row to Master Sheet's **Scouts** tab: Scout ID | Email | Sheet ID
3. Team lead shares deployment URL with scout
4. Scout enters email + deployment URL in extension
5. Scout can now save creators

### Removing a Scout
1. Team lead deletes the scout's row from the **Scouts** tab
2. Scout can no longer save (email validation fails)
3. Scout's personal sheet can be deleted or archived by team lead

### Sharing Creator Insights
- Each scout can manually share their personal sheet with teammates for review
- Team lead's Master Sheet provides a complete view of all creators

---

## Folder Structure

```
Creator Scout/
├── README.md                             # Setup guide + docs
├── TEAM-LEAD-APPS-SCRIPT-TEMPLATE.gs    # Deploy this (team lead only)
└── Extension/                            # Chrome extension
    ├── manifest.json
    ├── popup.html
    ├── popup.js
    ├── content.js
    └── styles.css
```

---

## FAQ

**Q: Can I see other scouts' creators?**  
A: Only if they share their personal sheet with you. Isolation is the default.

**Q: Can scouts see the Master Sheet?**  
A: No. They only use the Apps Script URL and their personal sheets. Master Sheet is team lead only.

**Q: What if I lose access to my personal sheet?**  
A: Contact your team lead. They can create a new one and update the Scouts tab.

**Q: What happens to my data if I leave?**  
A: Your personal sheet stays in your Google account. Team lead's Master Sheet keeps a record of all your creators.

**Q: Where do I find the deployment URL?**  
A: Your team lead has it. It was given to you when they shared the extension. If you lost it, ask your team lead.

---

## Need Help?

1. Check the Troubleshooting section above
2. Verify each setup step is completed in order
3. Check browser console (Right-click → Inspect → Console) for error messages
4. Test the deployment URL directly (see troubleshooting section)
5. Contact your team lead if email registration is the issue

---

Good luck scouting! 🚀
