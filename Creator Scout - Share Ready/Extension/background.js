// CREATOR SCOUT - SERVICE WORKER
// Handles all Google Apps Script communication to bypass popup CORS restrictions

const TEAM_LEAD_GAS_URL = 'https://script.google.com/macros/s/AKfycbyQlblbVzMe-L0RXH2r-E0fLOF36ReLcyDCKmVI4pj_zkKDsoOlAu3QpgPuQRr5gw1cig/exec';

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  handleMessage(request, sender, sendResponse);
  return true; // Keep channel open for async responses
});

// Main message handler
async function handleMessage(request, sender, sendResponse) {
  try {
    const { action, email, profile_url, new_status, personalSheetId, data, initialStatus, scoutName, notes } = request;

    let result;

    switch (action) {
      case 'validateEmail':
        result = await validateEmail(email);
        break;

      case 'checkCreatorStatus':
        result = await checkCreatorStatus(email, profile_url);
        break;

      case 'getCreatorStatus':
        result = await getCreatorStatus(email, profile_url);
        break;

      case 'updateCreatorStatus':
        result = await updateCreatorStatus(email, profile_url, new_status, personalSheetId);
        break;

      case 'saveCreator':
        result = await saveCreator(email, personalSheetId, data, initialStatus);
        break;

      case 'createPersonalSheet':
        result = await createPersonalSheet(email, scoutName);
        break;

      case 'deleteCreator':
        result = await deleteCreator(email, profile_url, personalSheetId);
        break;

      case 'updateNotes':
        result = await updateNotes(email, profile_url, notes, personalSheetId);
        break;

      default:
        result = { error: 'Unknown action', status: 'error' };
    }

    sendResponse(result);
  } catch (error) {
    sendResponse({ error: error.toString(), status: 'error' });
  }
}

// Fetch function: Validate Email
async function validateEmail(email) {
  try {
    if (!email) {
      return { valid: false };
    }

    const url = new URL(TEAM_LEAD_GAS_URL);
    url.searchParams.append('action', 'validateEmail');
    url.searchParams.append('email', email);

    const response = await fetch(url.toString());

    if (!response.ok) {
      return { error: `HTTP ${response.status}: ${response.statusText}`, valid: false };
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('[Background] Invalid response format:', text.substring(0, 200));
      return { error: 'Invalid response format from GAS', valid: false };
    }

    const data = await response.json();
    return { valid: data.valid, sheet_id: data.sheet_id };
  } catch (error) {
    return { error: error.toString(), valid: false };
  }
}

// Fetch function: Check Creator Status (exists check)
async function checkCreatorStatus(email, profile_url) {
  try {
    if (!email || !profile_url) {
      return { error: 'Missing email or profile_url' };
    }

    const url = new URL(TEAM_LEAD_GAS_URL);
    url.searchParams.append('action', 'checkCreatorStatus');
    url.searchParams.append('email', email);
    url.searchParams.append('profile_url', profile_url);

    const response = await fetch(url.toString());

    if (!response.ok) {
      return { error: `HTTP ${response.status}: ${response.statusText}`, status: 'error' };
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('[Background] Invalid response format:', text.substring(0, 200));
      return { error: 'Invalid response format from GAS', status: 'error' };
    }

    const data = await response.json();

    return {
      status: data.status || 'new',
      exists: data.exists || false,
      error: data.error || null
    };
  } catch (error) {
    return { error: error.toString(), status: 'error' };
  }
}

// Fetch function: Get Creator Status (actual status value)
async function getCreatorStatus(email, profile_url) {
  try {
    if (!email || !profile_url) {
      return { error: 'Missing email or profile_url' };
    }

    const url = new URL(TEAM_LEAD_GAS_URL);
    url.searchParams.append('action', 'getCreatorStatus');
    url.searchParams.append('email', email);
    url.searchParams.append('profile_url', profile_url);

    const response = await fetch(url.toString());

    if (!response.ok) {
      return { error: `HTTP ${response.status}: ${response.statusText}`, status: null };
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('[Background] Invalid response format:', text.substring(0, 200));
      return { error: 'Invalid response format from GAS', status: null };
    }

    const data = await response.json();

    return {
      status: data.status || null,
      found: data.found || false,
      notes: data.notes || '',
      error: data.error || null
    };
  } catch (error) {
    return { error: error.toString(), status: null, notes: '' };
  }
}

// Fetch function: Update Creator Status
async function updateCreatorStatus(email, profile_url, new_status, personalSheetId) {
  try {
    if (!email || !profile_url || !new_status) {
      return { error: 'Missing required parameters', status: 'error' };
    }

    const url = new URL(TEAM_LEAD_GAS_URL);
    url.searchParams.append('action', 'updateCreatorStatus');
    url.searchParams.append('email', email);
    url.searchParams.append('profile_url', profile_url);
    url.searchParams.append('new_status', new_status);

    if (personalSheetId) {
      url.searchParams.append('personal_sheet_id', personalSheetId);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      return { error: `HTTP ${response.status}: ${response.statusText}`, status: 'error', success: false };
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('[Background] Invalid response format:', text.substring(0, 200));
      return { error: 'Invalid response format from GAS', status: 'error', success: false };
    }

    const data = await response.json();

    return {
      status: data.status || 'error',
      success: data.success || false,
      error: data.error || null
    };
  } catch (error) {
    return { error: error.toString(), status: 'error', success: false };
  }
}

// Fetch function: Save Creator
async function saveCreator(email, personalSheetId, data, initialStatus) {
  try {
    if (!email || !personalSheetId || !data) {
      return { error: 'Missing required parameters', status: 'error' };
    }

    const url = new URL(TEAM_LEAD_GAS_URL);
    url.searchParams.append('action', 'saveCreator');
    url.searchParams.append('email', email);
    url.searchParams.append('personal_sheet_id', personalSheetId);
    url.searchParams.append('data', JSON.stringify(data));

    if (initialStatus) {
      url.searchParams.append('initial_status', initialStatus);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      return { error: `HTTP ${response.status}: ${response.statusText}`, status: 'error', success: false };
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('[Background] Invalid response format:', text.substring(0, 200));
      return { error: 'Invalid response format from GAS', status: 'error', success: false };
    }

    const result = await response.json();

    return {
      status: result.status || 'error',
      success: result.success || false,
      error: result.error || null
    };
  } catch (error) {
    return { error: error.toString(), status: 'error', success: false };
  }
}

// Fetch function: Create Personal Sheet
async function createPersonalSheet(email, scoutName) {
  try {
    if (!email) {
      return { error: 'Missing email', status: 'error' };
    }

    const url = new URL(TEAM_LEAD_GAS_URL);
    url.searchParams.append('action', 'createPersonalSheet');
    url.searchParams.append('email', email);

    if (scoutName) {
      url.searchParams.append('scout_name', scoutName);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      return { error: `HTTP ${response.status}: ${response.statusText}`, status: 'error', success: false };
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('[Background] Invalid response format:', text.substring(0, 200));
      return { error: 'Invalid response format from GAS', status: 'error', success: false };
    }

    const data = await response.json();

    return {
      status: data.status || 'error',
      success: data.success || false,
      sheet_id: data.sheet_id || null,
      error: data.error || null,
      message: data.message || null
    };
  } catch (error) {
    return { error: error.toString(), status: 'error', success: false };
  }
}

// Fetch function: Delete Creator
async function deleteCreator(email, profile_url, personalSheetId) {
  try {
    if (!email || !profile_url) {
      return { error: 'Missing email or profile_url', status: 'error', success: false };
    }

    const url = new URL(TEAM_LEAD_GAS_URL);
    url.searchParams.append('action', 'deleteCreator');
    url.searchParams.append('email', email);
    url.searchParams.append('profile_url', profile_url);

    if (personalSheetId) {
      url.searchParams.append('personal_sheet_id', personalSheetId);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      return { error: `HTTP ${response.status}: ${response.statusText}`, status: 'error', success: false };
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('[Background] Invalid response format:', text.substring(0, 200));
      return { error: 'Invalid response format from GAS', status: 'error', success: false };
    }

    const data = await response.json();

    return {
      status: data.status || 'error',
      success: data.success || false,
      error: data.error || null
    };
  } catch (error) {
    return { error: error.toString(), status: 'error', success: false };
  }
}

// Fetch function: Update Notes
async function updateNotes(email, profile_url, notes, personalSheetId) {
  try {
    if (!email || !profile_url) {
      return { error: 'Missing email or profile_url', status: 'error', success: false };
    }

    const url = new URL(TEAM_LEAD_GAS_URL);
    url.searchParams.append('action', 'updateNotes');
    url.searchParams.append('email', email);
    url.searchParams.append('profile_url', profile_url);
    url.searchParams.append('notes', notes || '');

    if (personalSheetId) {
      url.searchParams.append('personal_sheet_id', personalSheetId);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      return { error: `HTTP ${response.status}: ${response.statusText}`, status: 'error', success: false };
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('[Background] Invalid response format:', text.substring(0, 200));
      return { error: 'Invalid response format from GAS', status: 'error', success: false };
    }

    const data = await response.json();

    return {
      status: data.status || 'error',
      success: data.success || false,
      error: data.error || null
    };
  } catch (error) {
    return { error: error.toString(), status: 'error', success: false };
  }
}
