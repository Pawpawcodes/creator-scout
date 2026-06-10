// TEAM LEAD APPS SCRIPT - CENTRALIZED (CHROME EXTENSION COMPATIBLE)
// Team Lead deploys this ONCE to their own Google Account
// Scouts use this deployment URL to save creators to Master Sheet + their personal sheets
// CORS headers removed - Chrome extension uses host_permissions instead

const MASTER_SHEET_NAME = 'Master';
const SCOUTS_SHEET_NAME = 'Scouts';

// CRITICAL: Normalize profile URLs to ensure consistent lookups
// Removes query params, tracking codes, and trailing slashes
function normalizeProfileUrl(url) {
  if (!url) return url;
  // Remove query params and fragments
  url = url.split('?')[0].split('#')[0];
  // Remove trailing slash
  url = url.replace(/\/$/, '');
  return url;
}

// Ensure Master and Scouts sheets exist with proper headers
function ensureMasterSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Ensure Master sheet
  let masterSheet = ss.getSheetByName(MASTER_SHEET_NAME);
  if (!masterSheet) {
    masterSheet = ss.insertSheet(MASTER_SHEET_NAME);
    masterSheet.appendRow([
      'Scout ID',
      'Profile URL',
      'Platform',
      'Username',
      'Status',
      'Created At',
      'Updated At',
      'Lock-In Price'
    ]);
  }

  // Ensure Scouts sheet (registry of email → scout_id → sheet_id)
  let scoutsSheet = ss.getSheetByName(SCOUTS_SHEET_NAME);
  if (!scoutsSheet) {
    scoutsSheet = ss.insertSheet(SCOUTS_SHEET_NAME);
    scoutsSheet.appendRow([
      'Scout ID',
      'Email',
      'Sheet ID'
    ]);
  }

  return { masterSheet, scoutsSheet };
}

function doGet(e) {
  try {
    const action = e.parameter.action;
    const email = e.parameter.email;

    if (action === 'validateEmail') {
      if (!email) {
        return sendJSON({ valid: false });
      }
      const isValid = validateScoutEmail(email);
      const sheetId = isValid ? getSheetIdByEmail(email) : null;
      return sendJSON({ valid: isValid, sheet_id: sheetId });
    }

    if (!email) {
      return sendJSON({ error: 'Missing email parameter' });
    }

    // Validate email exists in Scouts tab
    if (!validateScoutEmail(email)) {
      return sendJSON({ error: 'Email not registered. Contact team lead.' });
    }

    if (action === 'saveCreator') {
      const data = JSON.parse(e.parameter.data || '{}');
      const personalSheetId = e.parameter.personal_sheet_id;
      const initialStatus = e.parameter.initial_status || 'saved';

      if (!personalSheetId) {
        return sendJSON({ error: 'Missing personal_sheet_id parameter' });
      }

      const result = handleSaveCreator(email, personalSheetId, data, initialStatus);
      return sendJSON(result);
    }

    if (action === 'checkCreatorStatus') {
      const profile_url = e.parameter.profile_url;
      const result = handleCheckCreatorStatus(email, profile_url);
      return sendJSON(result);
    }

    if (action === 'getCreatorStatus') {
      const profile_url = e.parameter.profile_url;
      const result = handleGetCreatorStatus(email, profile_url);
      return sendJSON(result);
    }

    if (action === 'updateCreatorStatus') {
      const profile_url = e.parameter.profile_url;
      const new_status = e.parameter.new_status;
      const personalSheetId = e.parameter.personal_sheet_id;

      if (!profile_url || !new_status) {
        return sendJSON({ error: 'Missing profile_url or new_status' });
      }

      const result = handleUpdateCreatorStatus(email, profile_url, new_status, personalSheetId);
      return sendJSON(result);
    }

    if (action === 'lockInPrice') {
      const profile_url = e.parameter.profile_url;
      const price = e.parameter.price;
      const personalSheetId = e.parameter.personal_sheet_id;

      if (!profile_url || !price) {
        return sendJSON({ error: 'Missing profile_url or price' });
      }

      const result = handleLockInPrice(email, profile_url, price, personalSheetId);
      return sendJSON(result);
    }

    if (action === 'createPersonalSheet') {
      const scoutName = e.parameter.scout_name || email.split('@')[0];
      const result = handleCreatePersonalSheet(email, scoutName);
      return sendJSON(result);
    }

    return sendJSON({ error: 'Invalid action' });
  } catch (err) {
    return sendJSON({ error: err.toString() });
  }
}

function validateScoutEmail(email) {
  try {
    const { scoutsSheet } = ensureMasterSheets();
    const data = scoutsSheet.getDataRange().getValues();
    const normalizedEmail = email.trim().toLowerCase();

    for (let i = 1; i < data.length; i++) {
      const sheetEmail = (data[i][1] || '').toString().trim().toLowerCase();
      if (sheetEmail === normalizedEmail) {
        return true;
      }
    }
    return false;
  } catch (error) {
    return false;
  }
}

function getScoutId(email) {
  try {
    const { scoutsSheet } = ensureMasterSheets();
    const data = scoutsSheet.getDataRange().getValues();
    const normalizedEmail = email.trim().toLowerCase();

    for (let i = 1; i < data.length; i++) {
      const sheetEmail = (data[i][1] || '').toString().trim().toLowerCase();
      if (sheetEmail === normalizedEmail) {
        return data[i][0];
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

function getSheetIdByEmail(email) {
  try {
    const { scoutsSheet } = ensureMasterSheets();
    const data = scoutsSheet.getDataRange().getValues();
    const normalizedEmail = email.trim().toLowerCase();

    for (let i = 1; i < data.length; i++) {
      const sheetEmail = (data[i][1] || '').toString().trim().toLowerCase();
      if (sheetEmail === normalizedEmail) {
        return (data[i][2] || '').toString().trim() || null;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

function handleCheckCreatorStatus(email, profile_url) {
  if (!profile_url) {
    return { error: 'Missing profile_url', status: 'error' };
  }

  try {
    const { masterSheet } = ensureMasterSheets();
    const scoutId = getScoutId(email);

    if (!scoutId) {
      return { error: 'Scout not found', status: 'error' };
    }

    const data = masterSheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === scoutId && data[i][1] === profile_url) {
        return { status: 'saved', exists: true };
      }
    }

    return { status: 'new', exists: false };
  } catch (error) {
    return { error: error.toString(), status: 'error' };
  }
}

function handleGetCreatorStatus(email, profile_url) {
  if (!profile_url) {
    return { error: 'Missing profile_url', status: null };
  }

  try {
    const { masterSheet } = ensureMasterSheets();
    const scoutId = getScoutId(email);

    if (!scoutId) {
      return { error: 'Scout not found', status: null };
    }

    // CRITICAL: Normalize URL for consistent lookup
    const normalizedUrl = normalizeProfileUrl(profile_url);
    console.log(`[GET STATUS] Normalized URL: ${profile_url} → ${normalizedUrl}`);

    const data = masterSheet.getDataRange().getValues();
    let allMatches = [];
    let foundRow = null;

    // Find ALL matching rows to detect duplicates
    for (let i = 1; i < data.length; i++) {
      const sheetUrl = normalizeProfileUrl(data[i][1]);
      if (data[i][0] === scoutId && sheetUrl === normalizedUrl) {
        allMatches.push({
          rowNum: i + 1,
          status: data[i][4],
          price: data[i][7],
          updatedAt: data[i][6]
        });
        foundRow = i + 1;  // Keep updating to get LAST match (newest)
      }
    }

    if (allMatches.length > 1) {
      console.log(`[GET STATUS] Found ${allMatches.length} rows for scoutId=${scoutId}, url=${normalizedUrl}`);
      // Return LAST match (newest based on order in sheet)
      const lastMatch = allMatches[allMatches.length - 1];
      console.log(`[GET STATUS] Returning last match: row=${lastMatch.rowNum}, status=${lastMatch.status}`);
    }

    if (!foundRow) {
      console.log(`[GET STATUS] No match found for scoutId=${scoutId}, url=${normalizedUrl}`);
      return { status: null, found: false, lock_in_price: null };
    }

    // Read the LAST matching row
    const lastRowIndex = foundRow - 1;
    const creatorStatus = (data[lastRowIndex][4] || 'saved').toString();
    const lockInPrice = (data[lastRowIndex][7] || null);

    console.log(`[GET STATUS] Returning: row=${foundRow}, status=${creatorStatus}, price=${lockInPrice}`);
    return { status: creatorStatus, found: true, lock_in_price: lockInPrice };
  } catch (error) {
    console.log(`[GET STATUS] Error: ${error.toString()}`);
    return { error: error.toString(), status: null, lock_in_price: null };
  }
}

function handleUpdateCreatorStatus(email, profile_url, new_status, personalSheetId) {
  try {
    const { masterSheet } = ensureMasterSheets();
    const scoutId = getScoutId(email);

    if (!scoutId) {
      return { error: 'Scout not found', status: 'error' };
    }

    // CRITICAL: Normalize URL for consistent lookup
    const normalizedUrl = normalizeProfileUrl(profile_url);
    console.log(`[UPDATE STATUS] Normalized URL: ${profile_url} → ${normalizedUrl}`);

    const masterData = masterSheet.getDataRange().getValues();
    let foundRow = null;
    let allMatches = [];

    // Find ALL matching rows, return LAST match (newest)
    for (let i = 1; i < masterData.length; i++) {
      const sheetUrl = normalizeProfileUrl(masterData[i][1]);
      if (masterData[i][0] === scoutId && sheetUrl === normalizedUrl) {
        allMatches.push(i + 1);
        foundRow = i + 1;  // Keep updating to get LAST match
      }
    }

    if (allMatches.length > 1) {
      console.log(`[UPDATE STATUS] Found ${allMatches.length} rows for scoutId=${scoutId}, url=${normalizedUrl}: ${allMatches.join(',')}`);
      console.log(`[UPDATE STATUS] Updating LAST match: row=${foundRow}`);
    }

    if (!foundRow) {
      console.log(`[UPDATE STATUS] No match found for scoutId=${scoutId}, url=${normalizedUrl}`);
      return { error: 'Creator not found', status: 'error' };
    }

    const oldStatus = masterData[foundRow - 1][4];
    masterSheet.getRange(foundRow, 5).setValue(new_status);
    masterSheet.getRange(foundRow, 7).setValue(new Date().toISOString());
    console.log(`[UPDATE STATUS] Updated row ${foundRow}: ${oldStatus} → ${new_status}`);

    // Update personal sheet if provided
    if (personalSheetId) {
      try {
        const personalSheet = SpreadsheetApp.openById(personalSheetId);
        const personalMasterSheet = personalSheet.getSheetByName('Master');

        if (personalMasterSheet) {
          const personalData = personalMasterSheet.getDataRange().getValues();
          for (let i = 1; i < personalData.length; i++) {
            if (personalData[i][0] === profile_url) {
              personalMasterSheet.getRange(i + 1, 4).setValue(new_status);
              personalMasterSheet.getRange(i + 1, 6).setValue(new Date().toISOString());
              break;
            }
          }
        }
      } catch (error) {
        Logger.log('Warning: Could not update personal sheet: ' + error.toString());
      }
    }

    return { status: 'success', success: true };
  } catch (error) {
    return { error: error.toString(), status: 'error' };
  }
}

function handleLockInPrice(email, profile_url, price, personalSheetId) {
  try {
    const { masterSheet } = ensureMasterSheets();
    const scoutId = getScoutId(email);

    if (!scoutId) {
      return { error: 'Scout not found', status: 'error' };
    }

    // CRITICAL: Normalize URL for consistent lookup
    const normalizedUrl = normalizeProfileUrl(profile_url);
    console.log(`[LOCK IN PRICE] Normalized URL: ${profile_url} → ${normalizedUrl}`);

    // Update Master Sheet - Lock-In Price is column 8 (index 7)
    const masterData = masterSheet.getDataRange().getValues();
    let foundRow = null;
    let allMatches = [];

    // Find ALL matching rows, return LAST match (newest)
    for (let i = 1; i < masterData.length; i++) {
      const sheetUrl = normalizeProfileUrl(masterData[i][1]);
      if (masterData[i][0] === scoutId && sheetUrl === normalizedUrl) {
        allMatches.push(i + 1);
        foundRow = i + 1;  // Keep updating to get LAST match
      }
    }

    if (allMatches.length > 1) {
      console.log(`[LOCK IN PRICE] Found ${allMatches.length} rows: ${allMatches.join(',')}, updating row=${foundRow}`);
    }

    if (!foundRow) {
      return { error: 'Creator not found in Master Sheet', status: 'error' };
    }

    masterSheet.getRange(foundRow, 8).setValue(price);

    // Update personal sheet if provided - Lock-In Price is column 7 (index 6)
    if (personalSheetId) {
      try {
        const personalSheet = SpreadsheetApp.openById(personalSheetId);
        const personalMasterSheet = personalSheet.getSheetByName('Master');

        if (personalMasterSheet) {
          const personalData = personalMasterSheet.getDataRange().getValues();
          for (let i = 1; i < personalData.length; i++) {
            if (personalData[i][0] === profile_url) {
              personalMasterSheet.getRange(i + 1, 7).setValue(price);
              break;
            }
          }
        }
      } catch (error) {
        Logger.log('Warning: Could not update personal sheet price: ' + error.toString());
      }
    }

    return { status: 'success', success: true, price: price };
  } catch (error) {
    return { error: error.toString(), status: 'error' };
  }
}

function handleSaveCreator(email, personalSheetId, data, initialStatus = 'saved') {
  const { profile_url, platform, username } = data;

  if (!profile_url || !platform || !username) {
    return { error: 'Missing required fields: profile_url, platform, username', status: 'error' };
  }

  const scoutId = getScoutId(email);
  if (!scoutId) {
    return { error: 'Scout not found for email: ' + email, status: 'error' };
  }

  const { masterSheet } = ensureMasterSheets();

  // CRITICAL: Normalize URL for consistent duplicate check
  const normalizedUrl = normalizeProfileUrl(profile_url);
  console.log(`[SAVE CREATOR] Normalized URL: ${profile_url} → ${normalizedUrl}`);

  // Check if creator already exists in Master Sheet for this scout
  const masterData = masterSheet.getDataRange().getValues();
  for (let i = 1; i < masterData.length; i++) {
    const sheetUrl = normalizeProfileUrl(masterData[i][1]);
    if (masterData[i][0] === scoutId && sheetUrl === normalizedUrl) {
      console.log(`[SAVE CREATOR] Creator already exists at row ${i + 1}`);
      return { error: 'Creator already scouted', status: 'saved' };
    }
  }

  const now = new Date().toISOString();

  // Save to Master Sheet with initial status and empty price column
  console.log(`[SAVE CREATOR] Saving new creator: status=${initialStatus}`);
  masterSheet.appendRow([
    scoutId,
    profile_url,
    platform,
    username,
    initialStatus,
    now,
    now,
    '' // Lock-In Price (empty initially)
  ]);

  // Save to personal sheet
  try {
    const personalSheet = SpreadsheetApp.openById(personalSheetId);
    const personalMasterSheet = personalSheet.getSheetByName('Master');

    if (personalMasterSheet) {
      // Check if sheet has headers, if not add them
      const personalData = personalMasterSheet.getDataRange().getValues();
      if (personalData.length === 0) {
        personalMasterSheet.appendRow([
          'Profile URL',
          'Platform',
          'Username',
          'Status',
          'Created At',
          'Updated At',
          'Lock-In Price'
        ]);
      }

      personalMasterSheet.appendRow([
        profile_url,
        platform,
        username,
        initialStatus,
        now,
        now,
        '' // Lock-In Price (empty initially)
      ]);
    }
  } catch (error) {
    // If personal sheet fails, still succeed but log
    Logger.log('Warning: Could not save to personal sheet: ' + error.toString());
  }

  return { status: 'success', success: true };
}

// ============================================================================
// PERSONAL SHEET CREATION
// ============================================================================

function handleCreatePersonalSheet(email, scoutName) {
  try {
    const { scoutsSheet } = ensureMasterSheets();
    const normalizedEmail = email.trim().toLowerCase();

    // Check if scout already has a personal sheet
    const scoutData = scoutsSheet.getDataRange().getValues();
    for (let i = 1; i < scoutData.length; i++) {
      const sheetEmail = (scoutData[i][1] || '').toString().trim().toLowerCase();
      if (sheetEmail === normalizedEmail && scoutData[i][2]) {
        return {
          error: 'Scout already has a personal sheet',
          sheet_id: scoutData[i][2].toString().trim(),
          status: 'existing'
        };
      }
    }

    // Create new personal sheet
    const personalSheetId = createPersonalSheetForScout(email, scoutName);

    if (!personalSheetId) {
      return { error: 'Failed to create personal sheet', status: 'error' };
    }

    // Update Scouts sheet with the new sheet ID
    const scoutId = getScoutId(email);
    if (scoutId) {
      updateScoutsSheetWithPersonalSheetId(scoutId, personalSheetId);
    }

    return {
      status: 'success',
      success: true,
      sheet_id: personalSheetId,
      message: 'Personal sheet created and linked'
    };
  } catch (error) {
    return { error: error.toString(), status: 'error' };
  }
}

function createPersonalSheetForScout(email, scoutName) {
  try {
    // Create a new Google Sheet
    const personalSheet = SpreadsheetApp.create(`Creator Scout - ${scoutName}`);
    const personalSheetId = personalSheet.getId();

    // Rename default sheet to "Master"
    const sheet = personalSheet.getSheets()[0];
    sheet.setName('Master');

    // Add headers to Master sheet
    sheet.appendRow([
      'Profile URL',
      'Platform',
      'Username',
      'Status',
      'Created At',
      'Updated At',
      'Lock-In Price'
    ]);

    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, 7);
    headerRange.setBackground('#0a66c2');
    headerRange.setFontColor('white');
    headerRange.setFontWeight('bold');

    // Set column widths
    sheet.setColumnWidth(1, 250); // Profile URL
    sheet.setColumnWidth(2, 100); // Platform
    sheet.setColumnWidth(3, 150); // Username
    sheet.setColumnWidth(4, 100); // Status
    sheet.setColumnWidth(5, 180); // Created At
    sheet.setColumnWidth(6, 180); // Updated At
    sheet.setColumnWidth(7, 150); // Lock-In Price

    // Freeze header row
    sheet.setFrozenRows(1);

    return personalSheetId;
  } catch (error) {
    Logger.log('Error creating personal sheet: ' + error.toString());
    return null;
  }
}

function updateScoutsSheetWithPersonalSheetId(scoutId, personalSheetId) {
  try {
    const { scoutsSheet } = ensureMasterSheets();
    const data = scoutsSheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === scoutId) {
        scoutsSheet.getRange(i + 1, 3).setValue(personalSheetId);
        return true;
      }
    }
    return false;
  } catch (error) {
    Logger.log('Error updating Scouts sheet: ' + error.toString());
    return false;
  }
}

// MINIMAL CHROME EXTENSION COMPATIBLE JSON RESPONSE
function sendJSON(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
