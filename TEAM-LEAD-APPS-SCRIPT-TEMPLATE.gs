// TEAM LEAD APPS SCRIPT - CENTRALIZED (CHROME EXTENSION COMPATIBLE)
// Team Lead deploys this ONCE to their own Google Account
// Scouts use this deployment URL to save creators to Master Sheet + their personal sheets
// CORS headers removed - Chrome extension uses host_permissions instead

const MASTER_SHEET_NAME = 'Master';
const SCOUTS_SHEET_NAME = 'Scouts';

// PERFORMANCE OPTIMIZATION: Targeted creator row lookup (not full index)
// Cache individual creator row numbers instead of building full index
// This avoids expensive sheet scans for single lookups
function getCreatorRowNumber(scoutId, profileUrl) {
  // RESTORED: Never cache row numbers - they become invalid when earlier rows are deleted!
  // Always do a fresh lookup from the sheet.
  // Correctness > Performance

  const { masterSheet } = ensureMasterSheets();

  const lastRow = masterSheet.getLastRow();
  if (lastRow <= 1) {
    console.log(`[GAS ROW LOOKUP] scoutId=${scoutId} | profileUrl=${profileUrl} | result=null (no data)`);
    return null; // No data rows
  }

  // Read only columns A-B for speed (avoid full row reads)
  const range = masterSheet.getRange(2, 1, lastRow - 1, 2);
  const data = range.getValues();

  // Find the LATEST matching row (return last match, not first)
  // If duplicate rows exist, the newest one is at the bottom
  let lastMatchingRow = null;
  const allMatches = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === scoutId && data[i][1] === profileUrl) {
      const actualRowNum = i + 2; // Row numbers start at 1, data starts at row 2
      allMatches.push(actualRowNum);
      lastMatchingRow = actualRowNum;
    }
  }

  // Log all matches for forensics
  if (allMatches.length > 0) {
    console.log(`[GAS ROW LOOKUP] scoutId=${scoutId} | profileUrl=${profileUrl} | matchCount=${allMatches.length} | allRows=${allMatches.join(',')} | returning=${lastMatchingRow}`);
  } else {
    console.log(`[GAS ROW LOOKUP] scoutId=${scoutId} | profileUrl=${profileUrl} | result=null (no match)`);
  }

  return lastMatchingRow;
}

// Invalidate creator row reference when scout's data changes
function invalidateCreatorIndex(scoutId) {
  // Note: We don't invalidate individual creator rows here anymore
  // Rows are only invalidated when status changes, which is rare
  // This keeps the optimization working
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
    const cache = CacheService.getScriptCache();
    const cacheKey = `scout_valid_${email.trim().toLowerCase()}`;
    const cachedResult = cache.get(cacheKey);

    if (cachedResult !== null) {
      return cachedResult === 'true';
    }

    const { scoutsSheet } = ensureMasterSheets();
    const data = scoutsSheet.getDataRange().getValues();
    const normalizedEmail = email.trim().toLowerCase();

    for (let i = 1; i < data.length; i++) {
      const sheetEmail = (data[i][1] || '').toString().trim().toLowerCase();
      if (sheetEmail === normalizedEmail) {
        cache.put(cacheKey, 'true', 86400);
        return true;
      }
    }
    cache.put(cacheKey, 'false', 86400);
    return false;
  } catch (error) {
    return false;
  }
}

function getScoutId(email) {
  try {
    const cache = CacheService.getScriptCache();
    const cacheKey = `scout_id_${email.trim().toLowerCase()}`;
    const cachedId = cache.get(cacheKey);

    if (cachedId) {
      return cachedId;
    }

    const { scoutsSheet } = ensureMasterSheets();
    const data = scoutsSheet.getDataRange().getValues();
    const normalizedEmail = email.trim().toLowerCase();

    for (let i = 1; i < data.length; i++) {
      const sheetEmail = (data[i][1] || '').toString().trim().toLowerCase();
      if (sheetEmail === normalizedEmail) {
        const scoutId = data[i][0];
        // Cache the scout ID for 24 hours
        cache.put(cacheKey, scoutId, 86400);
        return scoutId;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

function getSheetIdByEmail(email) {
  try {
    const cache = CacheService.getScriptCache();
    const cacheKey = `sheet_id_${email.trim().toLowerCase()}`;
    const cachedId = cache.get(cacheKey);

    if (cachedId && cachedId !== 'null') {
      return cachedId;
    }

    const { scoutsSheet } = ensureMasterSheets();
    const data = scoutsSheet.getDataRange().getValues();
    const normalizedEmail = email.trim().toLowerCase();

    for (let i = 1; i < data.length; i++) {
      const sheetEmail = (data[i][1] || '').toString().trim().toLowerCase();
      if (sheetEmail === normalizedEmail) {
        const sheetId = (data[i][2] || '').toString().trim() || null;
        // Cache the sheet ID for 24 hours
        cache.put(cacheKey, sheetId || 'null', 86400);
        return sheetId;
      }
    }
    // Cache null result too to avoid repeated lookups
    cache.put(cacheKey, 'null', 86400);
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
    const scoutId = getScoutId(email);

    if (!scoutId) {
      return { error: 'Scout not found', status: 'error' };
    }

    // Use targeted row lookup instead of full sheet scan
    const rowNumber = getCreatorRowNumber(scoutId, profile_url);

    if (rowNumber) {
      return { status: 'saved', exists: true };
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

    console.log(`[GAS LOOKUP] scoutId=${scoutId} | profileUrl=${profile_url}`);

    // RESTORED: Pure simple logic from original working version
    // Always read fresh from sheet, no caching to avoid stale data
    const data = masterSheet.getDataRange().getValues();

    // FORENSIC: Find ALL matching rows
    const allMatchingRows = [];
    let foundRow = null;
    let foundRowNum = null;

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === scoutId && data[i][1] === profile_url) {
        allMatchingRows.push({
          rowNum: i + 1,
          scoutId: data[i][0],
          profileUrl: data[i][1],
          status: data[i][4],
          price: data[i][7]
        });
        // Keep updating to get the LATEST (last) matching row
        foundRow = data[i];
        foundRowNum = i + 1;
      }
    }

    // Log ALL matching rows for forensics
    if (allMatchingRows.length > 0) {
      console.log(`[GAS MATCHING ROWS] Found ${allMatchingRows.length} matching row(s)`);
      for (let match of allMatchingRows) {
        console.log(`[MATCHING ROW] row=${match.rowNum} | scoutId=${match.scoutId} | url=${match.profileUrl} | status=${match.status} | price=${match.price}`);
      }
    }

    if (!foundRow) {
      console.log(`[GAS RETURN] status=null (not found)`);
      return { status: null, found: false, lock_in_price: null };
    }

    // Log the row we're using
    console.log(`[GAS ROW FOUND] rowNumber=${foundRowNum}`);
    console.log(`[GAS ROW DATA] columnA(scoutId)=${foundRow[0]} | columnB(url)=${foundRow[1]} | columnC(platform)=${foundRow[2]} | columnD(username)=${foundRow[3]} | columnE(status)=${foundRow[4]} | columnF(createdAt)=${foundRow[5]} | columnG(updatedAt)=${foundRow[6]} | columnH(price)=${foundRow[7]}`);

    // Return the status from column E (index 4)
    // CRITICAL: Do NOT default to 'saved' when status column is empty
    const creatorStatus = (foundRow[4] || '').toString();
    const lockInPrice = (foundRow[7] || null);

    if (!creatorStatus) {
      // Empty status = not a valid creator record
      console.log(`[GAS RETURN] status=null (empty status in row)`);
      return { status: null, found: false, lock_in_price: null };
    }

    console.log(`[GAS RETURN] status=${creatorStatus} | price=${lockInPrice}`);
    return { status: creatorStatus, found: true, lock_in_price: lockInPrice };
  } catch (error) {
    console.log(`[GAS ERROR] ${error.toString()}`);
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

    // Use targeted row lookup instead of scanning entire sheet
    let foundRow = getCreatorRowNumber(scoutId, profile_url);

    if (!foundRow) {
      // Fallback: Force a fresh scan in case index is stale
      const cache = CacheService.getScriptCache();
      cache.remove(`creator_index_${scoutId}`);
      foundRow = getCreatorRowNumber(scoutId, profile_url);

      if (!foundRow) {
        return { error: 'Creator not found', status: 'error' };
      }
    }

    masterSheet.getRange(foundRow, 5).setValue(new_status);
    masterSheet.getRange(foundRow, 7).setValue(new Date().toISOString());

    // CRITICAL: Invalidate status cache for this creator
    const cache = CacheService.getScriptCache();
    cache.remove(`creator_${scoutId}_${profile_url}`); // Status cache
    // Note: Row number caching is DISABLED - fresh lookup always done

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

    // Use targeted row lookup instead of scanning entire sheet
    const foundRow = getCreatorRowNumber(scoutId, profile_url);

    if (!foundRow) {
      return { error: 'Creator not found in Master Sheet', status: 'error' };
    }

    masterSheet.getRange(foundRow, 8).setValue(price);

    // CRITICAL: Invalidate status cache for this creator
    const cache = CacheService.getScriptCache();
    cache.remove(`creator_${scoutId}_${profile_url}`); // Status cache
    // Note: Row number caching is DISABLED - fresh lookup always done

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

  // Use targeted row lookup for O(1) duplicate check instead of scanning entire sheet
  const existingRow = getCreatorRowNumber(scoutId, profile_url);
  if (existingRow) {
    return { error: 'Creator already scouted', status: 'saved' };
  }

  const now = new Date().toISOString();

  // Save to Master Sheet with initial status and empty price column
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

  // Invalidate caches for new creator
  const cache = CacheService.getScriptCache();
  cache.remove(`creator_${scoutId}_${profile_url}`);
  invalidateCreatorIndex(scoutId);

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
