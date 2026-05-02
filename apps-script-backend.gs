// Creator Scout - Backend with Sequential Scout IDs

// IMPORTANT: Replace with your actual Google Sheet ID
// Extract from your sheet URL: https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
const SHEET_ID = 'YOUR_SHEET_ID_HERE';
const SHEET_NAME = 'Creators';
const SCOUTS_SHEET_NAME = 'Scouts';

// ENTRY - Single action only
function doPost(e) {
  try {
    const action = e.parameter.action;

    if (action === 'getScoutId') {
      return handleGetScoutId(e.parameter.email);
    }

    if (action === 'add') {
      let data = {};
      if (e.postData?.contents) {
        data = JSON.parse(e.postData.contents);
      }
      return handleAdd(data);
    }

    if (action === 'updateStatus') {
      let data = {};
      if (e.postData?.contents) {
        data = JSON.parse(e.postData.contents);
      }
      return handleUpdate(data);
    }

    return sendError('Invalid action');
  } catch (err) {
    return sendError(err.message);
  }
}

function doGet(e) {
  try {
    if (e.parameter.action === 'check') {
      return handleCheck(e.parameter.url);
    }

    if (e.parameter.action === 'getScoutId') {
      return handleGetScoutId(e.parameter.email);
    }

    return sendError('Invalid action');
  } catch (err) {
    return sendError(err.message);
  }
}

// GET SCOUT ID - Backend source of truth
// Single responsibility: given email, return scout_id (existing or new)
function handleGetScoutId(email) {
  if (!email) return sendError('Missing email');

  const scoutsSheet = getScoutsSheet();
  if (!scoutsSheet) return sendError('Scouts sheet not found');

  const data = scoutsSheet.getDataRange().getValues();
  const now = new Date().toISOString();

  // Search for existing email
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email) {
      // Found existing email - update last_active and return scout_id
      scoutsSheet.getRange(i + 1, 4).setValue(now);
      return sendSuccess({ scout_id: data[i][1] });
    }
  }

  // New email - generate sequential Scout ID
  const newScoutId = generateNewScoutId(data);
  scoutsSheet.appendRow([email, newScoutId, '', now]);

  return sendSuccess({ scout_id: newScoutId });
}

// CHECK
function handleCheck(url) {
  if (!url) return sendError('Missing url');

  const row = findRow(url);

  if (!row) {
    return sendSuccess({ exists: false, status: 'new' });
  }

  const sheet = getSheet();
  const data = sheet.getRange(row, 1, 1, 10).getValues()[0];
  const scoutId = data[4];
  const scoutName = getScoutName(scoutId);

  return sendSuccess({
    exists: true,
    status: normalize(data[3]),
    profile_url: data[0],
    platform: data[1],
    username: data[2],
    scout_id: scoutId,
    scout_name: scoutName,
    timestamp: data[9]
  });
}

// ADD
function handleAdd(data) {
  const { profile_url, platform, username, scout_id, scout_name, email, follower_count, bio } = data;

  if (!profile_url || !platform || !username || !scout_id) {
    return sendError('Missing fields');
  }

  const existing = findRow(profile_url);
  const sheet = getSheet();

  if (existing) {
    const status = sheet.getRange(existing, 4).getValue();
    const existingScoutId = sheet.getRange(existing, 5).getValue();
    const existingTimestamp = sheet.getRange(existing, 10).getValue();
    return sendSuccess({
      already_exists: true,
      status: normalize(status),
      scout_id: existingScoutId,
      timestamp: existingTimestamp
    });
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

  // Track scout in Scouts sheet
  trackScout(scout_id, scout_name, email, now);

  return sendSuccess({ status: 'pending' });
}

// UPDATE
function handleUpdate(data) {
  const { profile_url, status, scout_id, scout_name, email } = data;

  if (!profile_url || !status || !scout_id) {
    return sendError('Missing fields');
  }

  const row = findRow(profile_url);
  if (!row) return sendError('Not found');

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

  // Update scout last_active
  updateScoutActivity(scout_id, scout_name, email, now);

  return sendSuccess({ status });
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

function getScoutName(scoutId) {
  const scoutsSheet = getScoutsSheet();
  if (!scoutsSheet) return scoutId;

  const data = scoutsSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === scoutId) return data[i][2] || scoutId;
  }
  return scoutId;
}

function trackScout(scoutId, scoutName, email, createdAt) {
  const scoutsSheet = getScoutsSheet();
  if (!scoutsSheet) return;

  const data = scoutsSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === scoutId) {
      // Update existing scout entry
      scoutsSheet.getRange(i + 1, 3).setValue(scoutName || '');
      scoutsSheet.getRange(i + 1, 4).setValue(new Date().toISOString());
      return;
    }
  }
  // New scout not found (shouldn't happen if handleGetScoutId was called first)
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

// Generate sequential Scout ID: SCOUT_001, SCOUT_002, etc.
function generateNewScoutId(scoutsData) {
  let maxNumber = 0;

  // Find highest existing Scout ID number
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

  // Generate next ID with leading zeros
  const nextNumber = maxNumber + 1;
  return 'SCOUT_' + String(nextNumber).padStart(3, '0');
}

function normalize(s) {
  return s ? s.toString().toLowerCase() : 'new';
}

// RESPONSES
function sendSuccess(data) {
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, ...data }))
    .setMimeType(ContentService.MimeType.JSON);
}

function sendError(msg) {
  return ContentService
    .createTextOutput(JSON.stringify({ success: false, status: 'error', message: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}
