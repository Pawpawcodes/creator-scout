// Creator Scout - Simplified Web-Based Backend
// Team lead: No code changes needed. Just update SHEET_ID below once

const SHEET_ID = 'YOUR_SHEET_ID_HERE';
const SHEET_NAME = 'Creators';
const SCOUTS_SHEET_NAME = 'Scouts';

// ENTRY POINT - Serves web interface
function doGet(e) {
  try {
    const action = e.parameter.action;

    // Serve HTML dashboard
    if (!action) {
      return HtmlService.createHtmlOutput(getHTML());
    }

    // API calls
    if (action === 'getScoutId') {
      return sendJSON({ scout_id: handleGetScoutId(e.parameter.email) });
    }

    if (action === 'getCreators') {
      return sendJSON(handleGetCreators(e.parameter.scout_id));
    }

    if (action === 'addCreator') {
      const result = handleAdd(JSON.parse(e.parameter.data || '{}'));
      return sendJSON(result);
    }

    if (action === 'updateStatus') {
      const result = handleUpdate(JSON.parse(e.parameter.data || '{}'));
      return sendJSON(result);
    }

    return sendJSON({ error: 'Invalid action' });
  } catch (err) {
    return sendJSON({ error: err.message });
  }
}

function doPost(e) {
  try {
    const action = e.parameter.action;

    if (action === 'getScoutId') {
      return sendJSON({ scout_id: handleGetScoutId(e.parameter.email) });
    }

    if (action === 'addCreator') {
      const data = JSON.parse(e.postData.contents || '{}');
      const result = handleAdd(data);
      return sendJSON(result);
    }

    if (action === 'updateStatus') {
      const data = JSON.parse(e.postData.contents || '{}');
      const result = handleUpdate(data);
      return sendJSON(result);
    }

    return sendJSON({ error: 'Invalid action' });
  } catch (err) {
    return sendJSON({ error: err.message });
  }
}

// GET SCOUT ID - Backend source of truth
function handleGetScoutId(email) {
  if (!email) throw new Error('Missing email');

  const scoutsSheet = getScoutsSheet();
  const data = scoutsSheet.getDataRange().getValues();
  const now = new Date().toISOString();

  // Search for existing email
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email) {
      scoutsSheet.getRange(i + 1, 4).setValue(now);
      return data[i][1];
    }
  }

  // New email - generate sequential Scout ID
  const newScoutId = generateNewScoutId(data);
  scoutsSheet.appendRow([email, newScoutId, '', now]);
  return newScoutId;
}

// GET CREATORS
function handleGetCreators(scoutId) {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  const creators = [];

  for (let i = 1; i < data.length; i++) {
    if (data[i][4] === scoutId) {
      creators.push({
        url: data[i][0],
        platform: data[i][1],
        username: data[i][2],
        status: data[i][3],
        followers: data[i][5],
        bio: data[i][6],
        timestamp: data[i][9]
      });
    }
  }

  return creators;
}

// ADD CREATOR
function handleAdd(data) {
  const { profile_url, platform, username, scout_id, email, follower_count, bio } = data;

  if (!profile_url || !platform || !username || !scout_id) {
    throw new Error('Missing required fields');
  }

  const sheet = getSheet();
  const existing = findRow(profile_url);

  if (existing) {
    const status = sheet.getRange(existing, 4).getValue();
    return { already_exists: true, status };
  }

  const now = new Date().toISOString();
  const statusHistory = JSON.stringify([{ status: 'pending', timestamp: now }]);

  sheet.appendRow([
    profile_url,
    platform,
    username,
    'pending',
    scout_id,
    follower_count || '',
    bio || '',
    statusHistory,
    now,
    now
  ]);

  trackScout(scout_id, '', email, now);
  return { status: 'pending' };
}

// UPDATE STATUS
function handleUpdate(data) {
  const { profile_url, status, scout_id, email } = data;

  if (!profile_url || !status || !scout_id) {
    throw new Error('Missing required fields');
  }

  const row = findRow(profile_url);
  if (!row) throw new Error('Creator not found');

  const sheet = getSheet();
  const now = new Date().toISOString();

  sheet.getRange(row, 4).setValue(status);

  const historyCell = sheet.getRange(row, 8).getValue();
  let history = [];
  try {
    history = JSON.parse(historyCell || '[]');
  } catch (e) {
    history = [];
  }
  history.push({ status: status, timestamp: now });
  sheet.getRange(row, 8).setValue(JSON.stringify(history));
  sheet.getRange(row, 10).setValue(now);

  updateScoutActivity(scout_id, '', email, now);
  return { status };
}

// HELPERS
function getSheet() {
  return SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
}

function getScoutsSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  try {
    return ss.getSheetByName(SCOUTS_SHEET_NAME);
  } catch (e) {
    return null;
  }
}

function findRow(url) {
  const data = getSheet().getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === url) return i + 1;
  }
  return null;
}

function trackScout(scoutId, scoutName, email, createdAt) {
  const scoutsSheet = getScoutsSheet();
  if (!scoutsSheet) return;

  const data = scoutsSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === scoutId) {
      scoutsSheet.getRange(i + 1, 3).setValue(scoutName || '');
      scoutsSheet.getRange(i + 1, 4).setValue(new Date().toISOString());
      return;
    }
  }
  scoutsSheet.appendRow([email || '', scoutId, scoutName || '', createdAt]);
}

function updateScoutActivity(scoutId, scoutName, email, lastActive) {
  const scoutsSheet = getScoutsSheet();
  if (!scoutsSheet) return;

  const data = scoutsSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === scoutId) {
      if (email) scoutsSheet.getRange(i + 1, 1).setValue(email);
      if (scoutName) scoutsSheet.getRange(i + 1, 3).setValue(scoutName);
      scoutsSheet.getRange(i + 1, 4).setValue(lastActive);
      return;
    }
  }
}

function generateNewScoutId(scoutsData) {
  let maxNumber = 0;
  for (let i = 1; i < scoutsData.length; i++) {
    const id = scoutsData[i][1];
    if (id && id.toString().startsWith('SCOUT_')) {
      const numStr = id.toString().replace('SCOUT_', '');
      const num = parseInt(numStr, 10);
      if (!isNaN(num) && num > maxNumber) {
        maxNumber = num;
      }
    }
  }
  const nextNumber = maxNumber + 1;
  return 'SCOUT_' + String(nextNumber).padStart(3, '0');
}

// RESPONSE HELPERS
function sendJSON(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// HTML DASHBOARD
function getHTML() {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Creator Scout</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f5f5f5; }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .card { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    h1 { color: #333; margin: 20px 0 10px; }
    .form-group { margin: 15px 0; }
    label { display: block; font-size: 14px; color: #666; margin-bottom: 5px; font-weight: 500; }
    input, select, textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
    input:focus, select:focus, textarea:focus { outline: none; border-color: #4CAF50; box-shadow: 0 0 0 2px rgba(76,175,80,0.1); }
    button { background: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500; }
    button:hover { background: #45a049; }
    button.secondary { background: #666; }
    button.secondary:hover { background: #555; }
    .error { color: #d32f2f; font-size: 14px; margin-top: 5px; }
    .success { color: #388e3c; font-size: 14px; margin-top: 5px; }
    .creators-list { margin-top: 20px; }
    .creator-item { background: #f9f9f9; padding: 15px; margin: 10px 0; border-radius: 4px; border-left: 4px solid #4CAF50; }
    .creator-header { display: flex; justify-content: space-between; align-items: center; }
    .creator-username { font-weight: 600; color: #333; }
    .creator-platform { font-size: 12px; color: #999; }
    .creator-status { display: inline-block; padding: 4px 8px; border-radius: 3px; font-size: 12px; font-weight: 500; }
    .status-pending { background: #fff3cd; color: #856404; }
    .status-contacted { background: #d1ecf1; color: #0c5460; }
    .status-new { background: #e2e3e5; color: #383d41; }
    .hidden { display: none; }
    .section { margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 Creator Scout</h1>

    <!-- Login Section -->
    <div id="loginSection" class="card">
      <h2>Sign In</h2>
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="email" placeholder="your@email.com">
      </div>
      <button onclick="login()">Sign In</button>
      <div id="loginError" class="error hidden"></div>
    </div>

    <!-- Dashboard Section (hidden until logged in) -->
    <div id="dashboardSection" class="card hidden">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2>Dashboard</h2>
          <p style="color: #666; font-size: 14px;">Scout ID: <strong id="scoutId"></strong></p>
        </div>
        <button class="secondary" onclick="logout()">Sign Out</button>
      </div>

      <!-- Add Creator Form -->
      <div class="section">
        <h3>Add Creator</h3>
        <div class="form-group">
          <label>Profile URL</label>
          <input type="url" id="profileUrl" placeholder="https://linkedin.com/in/...">
        </div>
        <div class="form-group">
          <label>Platform</label>
          <select id="platform">
            <option>LinkedIn</option>
            <option>Twitter/X</option>
            <option>Instagram</option>
          </select>
        </div>
        <div class="form-group">
          <label>Username</label>
          <input type="text" id="username" placeholder="@username">
        </div>
        <div class="form-group">
          <label>Followers (optional)</label>
          <input type="number" id="followers" placeholder="10000">
        </div>
        <div class="form-group">
          <label>Bio (optional)</label>
          <textarea id="bio" rows="2" placeholder="Brief bio..."></textarea>
        </div>
        <button onclick="addCreator()">Save Creator</button>
        <div id="addError" class="error hidden"></div>
        <div id="addSuccess" class="success hidden"></div>
      </div>

      <!-- Creators List -->
      <div class="section">
        <h3>Your Creators</h3>
        <div id="creatorsList" class="creators-list"></div>
      </div>
    </div>
  </div>

  <script>
    let currentEmail = null;
    let currentScoutId = null;

    function login() {
      const email = document.getElementById('email').value.trim();
      if (!email) {
        showError('loginError', 'Please enter your email');
        return;
      }

      fetch('?action=getScoutId&email=' + encodeURIComponent(email))
        .then(r => r.json())
        .then(data => {
          if (data.error) {
            showError('loginError', data.error);
          } else {
            currentEmail = email;
            currentScoutId = data.scout_id;
            showDashboard();
            loadCreators();
          }
        })
        .catch(e => showError('loginError', 'Connection failed: ' + e.message));
    }

    function logout() {
      currentEmail = null;
      currentScoutId = null;
      document.getElementById('loginSection').classList.remove('hidden');
      document.getElementById('dashboardSection').classList.add('hidden');
      document.getElementById('email').value = '';
    }

    function showDashboard() {
      document.getElementById('loginSection').classList.add('hidden');
      document.getElementById('dashboardSection').classList.remove('hidden');
      document.getElementById('scoutId').textContent = currentScoutId;
    }

    function addCreator() {
      const data = {
        profile_url: document.getElementById('profileUrl').value,
        platform: document.getElementById('platform').value,
        username: document.getElementById('username').value,
        scout_id: currentScoutId,
        email: currentEmail,
        follower_count: document.getElementById('followers').value || '',
        bio: document.getElementById('bio').value || ''
      };

      fetch('?action=addCreator&data=' + encodeURIComponent(JSON.stringify(data)))
        .then(r => r.json())
        .then(result => {
          if (result.error) {
            showError('addError', result.error);
          } else if (result.already_exists) {
            showError('addError', 'Creator already saved (status: ' + result.status + ')');
          } else {
            document.getElementById('addSuccess').textContent = '✓ Creator saved!';
            document.getElementById('addSuccess').classList.remove('hidden');
            document.getElementById('addError').classList.add('hidden');
            clearForm();
            setTimeout(() => document.getElementById('addSuccess').classList.add('hidden'), 3000);
            loadCreators();
          }
        })
        .catch(e => showError('addError', 'Failed: ' + e.message));
    }

    function loadCreators() {
      fetch('?action=getCreators&scout_id=' + currentScoutId)
        .then(r => r.json())
        .then(creators => {
          const list = document.getElementById('creatorsList');
          if (creators.length === 0) {
            list.innerHTML = '<p style="color: #999;">No creators saved yet</p>';
          } else {
            list.innerHTML = creators.map(c => \`
              <div class="creator-item">
                <div class="creator-header">
                  <div>
                    <div class="creator-username">\${c.username}</div>
                    <div class="creator-platform">\${c.platform}</div>
                  </div>
                  <span class="creator-status status-\${c.status}">\${c.status.toUpperCase()}</span>
                </div>
                <p style="font-size: 13px; color: #666; margin-top: 5px;">\${c.followers ? c.followers + ' followers' : ''}</p>
              </div>
            \`).join('');
          }
        });
    }

    function clearForm() {
      document.getElementById('profileUrl').value = '';
      document.getElementById('platform').value = 'LinkedIn';
      document.getElementById('username').value = '';
      document.getElementById('followers').value = '';
      document.getElementById('bio').value = '';
    }

    function showError(id, msg) {
      const el = document.getElementById(id);
      el.textContent = msg;
      el.classList.remove('hidden');
    }

    // Allow Enter key to login
    document.getElementById('email')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') login();
    });
  </script>
</body>
</html>
`;
}
