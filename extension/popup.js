// popup.js - Popup UI logic

const SCOUT_ID_KEY = 'scout_id';
const SCOUT_NAME_KEY = 'scout_name';
const SCOUT_EMAIL_KEY = 'scout_email';
const API_URL_KEY = 'scout_api_base';
const MESSAGE_TEMPLATE_KEY = 'scout_message_template';
const DEFAULT_MESSAGE = 'Hey @{username}! We work on product launches and would love to collaborate. Are you open to sponsored partnerships?';

// Initialize popup
function init() {
  checkSetupStatus();
  attachEventListeners();
}

// Check if API URL is configured before showing login
function checkSetupStatus() {
  chrome.storage.local.get([SCOUT_ID_KEY, SCOUT_EMAIL_KEY, API_URL_KEY], (result) => {
    const hasLogin = result[SCOUT_ID_KEY] && result[SCOUT_EMAIL_KEY];
    const hasApiUrl = result[API_URL_KEY];

    if (hasLogin) {
      // Already logged in
      showDashboard();
      displayScoutInfo();
    } else if (!hasApiUrl) {
      // Not logged in and API URL not configured - show setup prompt
      showSetupPrompt();
    } else {
      // Not logged in but API URL is configured - show login
      showLoginScreen();
    }
  });
}

// UI State Functions
function showSetupPrompt() {
  document.getElementById('setup-section').style.display = 'block';
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('dashboard-section').style.display = 'none';
}

function showLoginScreen() {
  document.getElementById('setup-section').style.display = 'none';
  document.getElementById('login-section').style.display = 'block';
  document.getElementById('dashboard-section').style.display = 'none';
}

function showDashboard() {
  document.getElementById('setup-section').style.display = 'none';
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('dashboard-section').style.display = 'block';
}

function handleSetupClick() {
  showSettingsModal();
}

async function handleLogin() {
  const email = document.getElementById('login-email-input').value.trim();
  const messageDiv = document.getElementById('login-message');

  if (!email) {
    messageDiv.textContent = '❌ Please enter your email';
    messageDiv.style.color = '#dc2626';
    return;
  }

  if (!email.includes('@')) {
    messageDiv.textContent = '❌ Please enter a valid email';
    messageDiv.style.color = '#dc2626';
    return;
  }

  chrome.storage.local.get([API_URL_KEY], async (result) => {
    const apiUrl = result[API_URL_KEY];

    if (!apiUrl) {
      messageDiv.innerHTML = '❌ API URL not configured. <a href="#" id="api-config-link" style="color: #1e40af; text-decoration: underline;">Configure in settings</a>';
      messageDiv.style.color = '#dc2626';

      // Attach event listener to the dynamically created link
      const configLink = document.getElementById('api-config-link');
      if (configLink) {
        configLink.addEventListener('click', (e) => {
          e.preventDefault();
          showSettingsModal();
        });
      }
      return;
    }

    messageDiv.textContent = '⏳ Signing in...';
    messageDiv.style.color = '#6b7280';

    try {
      // Call backend getScoutId action
      const response = await fetch(`${apiUrl}?action=getScoutId&email=${encodeURIComponent(email)}`);

      if (!response.ok) {
        messageDiv.textContent = '❌ Connection error. Check your API URL in settings.';
        messageDiv.style.color = '#dc2626';
        return;
      }

      const data = await response.json();

      if (!data.success) {
        messageDiv.textContent = `❌ ${data.message || 'Login failed'}`;
        messageDiv.style.color = '#dc2626';
        return;
      }

      // Store scout identity from backend
      chrome.storage.local.set({
        [SCOUT_ID_KEY]: data.scout_id,
        [SCOUT_EMAIL_KEY]: email
      }, () => {
        messageDiv.textContent = '✅ Signed in!';
        messageDiv.style.color = '#059669';
        setTimeout(() => {
          showDashboard();
          displayScoutInfo();
          document.getElementById('login-email-input').value = '';
          messageDiv.textContent = '';
        }, 500);
      });
    } catch (error) {
      messageDiv.textContent = '❌ Network error';
      messageDiv.style.color = '#dc2626';
      console.error('Login error:', error);
    }
  });
}

function handleLogout() {
  chrome.storage.local.remove([SCOUT_ID_KEY, SCOUT_NAME_KEY, SCOUT_EMAIL_KEY], () => {
    showLoginScreen();
    document.getElementById('login-email-input').value = '';
    document.getElementById('login-message').textContent = '';
  });
}

function displayScoutInfo() {
  chrome.storage.local.get([SCOUT_ID_KEY], (result) => {
    const scoutId = result[SCOUT_ID_KEY] || 'Loading...';
    document.getElementById('scout-id-display').textContent = scoutId;
  });
}

function copyScoutId() {
  chrome.storage.local.get([SCOUT_ID_KEY], (result) => {
    const scoutId = result[SCOUT_ID_KEY];
    navigator.clipboard.writeText(scoutId).then(() => {
      const btn = document.getElementById('copy-scout-id-btn');
      const originalText = btn.textContent;
      btn.textContent = '✅ Copied!';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 2000);
    });
  });
}

// Settings Modal Functions
function showSettingsModal() {
  const modal = document.getElementById('settings-modal');
  modal.style.display = 'block';
  loadSettings();
}

function closeSettingsModal() {
  const modal = document.getElementById('settings-modal');
  modal.style.display = 'none';
}

function loadSettings() {
  chrome.storage.local.get([SCOUT_NAME_KEY, API_URL_KEY, MESSAGE_TEMPLATE_KEY], (result) => {
    const scoutNameInput = document.getElementById('scout-name-input');
    const apiUrlInput = document.getElementById('api-url-input');
    const messageTemplateInput = document.getElementById('message-template-input');

    if (scoutNameInput && result[SCOUT_NAME_KEY]) {
      scoutNameInput.value = result[SCOUT_NAME_KEY];
    }

    if (apiUrlInput && result[API_URL_KEY]) {
      apiUrlInput.value = result[API_URL_KEY];
    }

    if (messageTemplateInput) {
      messageTemplateInput.value = result[MESSAGE_TEMPLATE_KEY] || DEFAULT_MESSAGE;
    }
  });
}

function saveSettings() {
  const scoutName = document.getElementById('scout-name-input').value.trim();
  const apiUrl = document.getElementById('api-url-input').value.trim();
  const messageTemplate = document.getElementById('message-template-input').value.trim();
  const messageDiv = document.getElementById('settings-message');

  if (!scoutName) {
    messageDiv.textContent = '❌ Please enter your scout name';
    messageDiv.style.color = '#dc2626';
    return;
  }

  if (!apiUrl) {
    messageDiv.textContent = '❌ Please enter Google Apps Script URL';
    messageDiv.style.color = '#dc2626';
    return;
  }

  if (!apiUrl.includes('script.google.com')) {
    messageDiv.textContent = '❌ Invalid Google Apps Script URL';
    messageDiv.style.color = '#dc2626';
    return;
  }

  if (!messageTemplate) {
    messageDiv.textContent = '❌ Please enter a message template';
    messageDiv.style.color = '#dc2626';
    return;
  }

  messageDiv.textContent = '⏳ Saving settings...';
  messageDiv.style.color = '#6b7280';

  chrome.storage.local.set({
    [SCOUT_NAME_KEY]: scoutName,
    [API_URL_KEY]: apiUrl,
    [MESSAGE_TEMPLATE_KEY]: messageTemplate
  }, () => {
    messageDiv.textContent = '✅ Settings saved!';
    messageDiv.style.color = '#059669';
    setTimeout(() => {
      closeSettingsModal();
      messageDiv.textContent = '';
      // Re-check setup status after settings saved
      checkSetupStatus();
    }, 1000);
  });
}

// Attach event listeners
function attachEventListeners() {
  document.getElementById('setup-btn')?.addEventListener('click', handleSetupClick);
  document.getElementById('login-btn')?.addEventListener('click', handleLogin);
  document.getElementById('logout-btn')?.addEventListener('click', handleLogout);

  // Allow Enter key to login
  document.getElementById('login-email-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
  });

  document.getElementById('open-dashboard')?.addEventListener('click', () => {
    alert('Open your Google Sheet directly to view all creators. The URL is configured in your Apps Script backend.');
  });

  document.getElementById('settings')?.addEventListener('click', showSettingsModal);

  document.getElementById('close-settings-btn')?.addEventListener('click', closeSettingsModal);

  document.getElementById('save-settings-btn')?.addEventListener('click', saveSettings);

  // Close modal when clicking outside it
  document.getElementById('settings-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'settings-modal') {
      closeSettingsModal();
    }
  });
}

// Initialize when popup loads
init();
