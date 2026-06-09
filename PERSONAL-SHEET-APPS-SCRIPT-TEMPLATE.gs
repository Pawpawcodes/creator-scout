// PERSONAL SHEET APPS SCRIPT - SCOUT
// Each scout deploys this to their own Personal Sheet
// Handles local creator tracking and syncing

const MASTER_SHEET_NAME = 'Master';
const TEAM_LEAD_DEPLOYMENT_URL = 'YOUR_TEAM_LEAD_DEPLOYMENT_URL_HERE'; // Replace with actual URL

// Ensure Master sheet exists with proper headers
function ensurePersonalMasterSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let masterSheet = ss.getSheetByName(MASTER_SHEET_NAME);
  if (!masterSheet) {
    masterSheet = ss.insertSheet(MASTER_SHEET_NAME);
    masterSheet.appendRow([
      'Profile URL',
      'Platform',
      'Username',
      'Status',
      'Created At',
      'Updated At'
    ]);

    // Format header row
    const headerRange = masterSheet.getRange(1, 1, 1, 6);
    headerRange.setBackground('#0a66c2');
    headerRange.setFontColor('white');
    headerRange.setFontWeight('bold');
    headerRange.setFontSize(11);

    // Set column widths
    masterSheet.setColumnWidth(1, 250); // Profile URL
    masterSheet.setColumnWidth(2, 100); // Platform
    masterSheet.setColumnWidth(3, 150); // Username
    masterSheet.setColumnWidth(4, 100); // Status
    masterSheet.setColumnWidth(5, 180); // Created At
    masterSheet.setColumnWidth(6, 180); // Updated At

    // Freeze header row
    masterSheet.setFrozenRows(1);
  }

  return masterSheet;
}

function doGet(e) {
  try {
    const action = e.parameter.action;

    if (action === 'addCreator') {
      const data = JSON.parse(e.parameter.data || '{}');
      const result = handleAddCreator(data);
      return sendJSON(result);
    }

    if (action === 'updateStatus') {
      const profile_url = e.parameter.profile_url;
      const new_status = e.parameter.new_status;
      const result = handleUpdateStatus(profile_url, new_status);
      return sendJSON(result);
    }

    if (action === 'getCreators') {
      const result = handleGetCreators();
      return sendJSON(result);
    }

    if (action === 'getCreatorStatus') {
      const profile_url = e.parameter.profile_url;
      const result = handleGetCreatorStatus(profile_url);
      return sendJSON(result);
    }

    if (action === 'deleteCreator') {
      const profile_url = e.parameter.profile_url;
      const result = handleDeleteCreator(profile_url);
      return sendJSON(result);
    }

    return sendJSON({ error: 'Invalid action' });
  } catch (err) {
    return sendJSON({ error: err.toString() });
  }
}

function handleAddCreator(data) {
  const { profile_url, platform, username, status = 'saved' } = data;

  if (!profile_url || !platform || !username) {
    throw new Error('Missing required fields: profile_url, platform, username');
  }

  const masterSheet = ensurePersonalMasterSheet();
  const masterData = masterSheet.getDataRange().getValues();

  // Check if creator already exists
  for (let i = 1; i < masterData.length; i++) {
    if (masterData[i][0] === profile_url) {
      return { error: 'Creator already exists in personal sheet', status: 'exists' };
    }
  }

  const now = new Date().toISOString();

  // Add to personal sheet
  masterSheet.appendRow([
    profile_url,
    platform,
    username,
    status,
    now,
    now
  ]);

  return { status: 'success', success: true };
}

function handleUpdateStatus(profile_url, new_status) {
  if (!profile_url || !new_status) {
    throw new Error('Missing profile_url or new_status');
  }

  const masterSheet = ensurePersonalMasterSheet();
  const masterData = masterSheet.getDataRange().getValues();

  for (let i = 1; i < masterData.length; i++) {
    if (masterData[i][0] === profile_url) {
      const rowNum = i + 1;
      masterSheet.getRange(rowNum, 4).setValue(new_status); // Status column
      masterSheet.getRange(rowNum, 6).setValue(new Date().toISOString()); // Updated At
      return { status: 'success', success: true };
    }
  }

  return { error: 'Creator not found', status: 'error' };
}

function handleGetCreators() {
  try {
    const masterSheet = ensurePersonalMasterSheet();
    const masterData = masterSheet.getDataRange().getValues();

    const creators = [];
    for (let i = 1; i < masterData.length; i++) {
      creators.push({
        profile_url: masterData[i][0],
        platform: masterData[i][1],
        username: masterData[i][2],
        status: masterData[i][3],
        created_at: masterData[i][4],
        updated_at: masterData[i][5]
      });
    }

    return { status: 'success', count: creators.length, creators: creators };
  } catch (error) {
    return { error: error.toString(), status: 'error' };
  }
}

function handleGetCreatorStatus(profile_url) {
  if (!profile_url) throw new Error('Missing profile_url');

  try {
    const masterSheet = ensurePersonalMasterSheet();
    const masterData = masterSheet.getDataRange().getValues();

    for (let i = 1; i < masterData.length; i++) {
      if (masterData[i][0] === profile_url) {
        return {
          status: masterData[i][3],
          found: true,
          platform: masterData[i][1],
          username: masterData[i][2],
          created_at: masterData[i][4],
          updated_at: masterData[i][5]
        };
      }
    }

    return { status: null, found: false };
  } catch (error) {
    return { error: error.toString(), status: null };
  }
}

function handleDeleteCreator(profile_url) {
  if (!profile_url) throw new Error('Missing profile_url');

  try {
    const masterSheet = ensurePersonalMasterSheet();
    const masterData = masterSheet.getDataRange().getValues();

    for (let i = 1; i < masterData.length; i++) {
      if (masterData[i][0] === profile_url) {
        masterSheet.deleteRow(i + 1);
        return { status: 'success', success: true };
      }
    }

    return { error: 'Creator not found', status: 'error' };
  } catch (error) {
    return { error: error.toString(), status: 'error' };
  }
}

function sendJSON(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
