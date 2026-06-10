// Speed Optimization 1: Non-blocking initialization
// Render UI shell immediately, load data async
let lastCheckedCreator = null;
let lastStatusCheckTime = 0;
const STATUS_CHECK_DEBOUNCE_MS = 2000;

// HARDCODED: Team Lead's Apps Script Deployment URL
// Replace with your actual deployment URL
const TEAM_LEAD_GAS_URL = 'https://script.google.com/macros/s/AKfycbyQlblbVzMe-L0RXH2r-E0fLOF36ReLcyDCKmVI4pj_zkKDsoOlAu3QpgPuQRr5gw1cig/exec';

document.addEventListener('DOMContentLoaded', () => {
  // Show onboarding by default (fastest render)
  showOnboardingView();

  // Load configuration async (non-blocking)
  checkConfigurationStatus();

  // Setup event listeners for edit templates modal
  const editTemplatesBtn = document.getElementById('editTemplatesBtn');
  const closeEditModalBtn = document.getElementById('closeEditModal');
  const editTemplatesForm = document.getElementById('editTemplatesForm');

  if (editTemplatesBtn) {
    editTemplatesBtn.addEventListener('click', openEditModal);
  }

  if (closeEditModalBtn) {
    closeEditModalBtn.addEventListener('click', closeEditModal);
  }

  if (editTemplatesForm) {
    editTemplatesForm.addEventListener('submit', handleEditTemplatesSubmit);
  }

  // Close modal when clicking outside
  const editTemplatesModal = document.getElementById('editTemplatesModal');
  if (editTemplatesModal) {
    editTemplatesModal.addEventListener('click', (e) => {
      if (e.target === editTemplatesModal) {
        closeEditModal();
      }
    });
  }

  // Setup settings modal close button
  const settingsCloseBtn = document.getElementById('settingsCloseBtn');
  if (settingsCloseBtn) {
    settingsCloseBtn.addEventListener('click', () => {
      window.close();
    });
  }

  // Setup edit preview button
  const editPreviewBtn = document.getElementById('editPreviewBtn');
  if (editPreviewBtn) {
    editPreviewBtn.addEventListener('click', openTemplateEditor);
  }

  // Setup settings form submission
  const settingsForm = document.getElementById('settingsForm');
  if (settingsForm) {
    settingsForm.addEventListener('submit', handleSettingsFormSubmit);
  }

  // Setup status pill event listeners
  setupStatusPillListeners();

  // Setup action button event listeners
  setupActionButtonListeners();
});

// Listen for profile change notifications from content script (direct message)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'profileChanged') {
    // Re-check creator status when profile changes
    chrome.storage.local.get([
      'SCOUT_EMAIL',
      'GAS_URL',
      'PERSONAL_SHEET_ID'
    ], (stored) => {
      checkCreatorStatus(stored);
    });
  }
});

// Listen for storage changes (detects profile changes even if popup was closed)
chrome.storage.onChanged.addListener((changes, areaName) => {
  console.log('[Creator Scout Popup] Storage changed:', { areaName, changes });
  if (areaName === 'local' && (changes.LAST_PROFILE_URL || changes.PROFILE_CHANGED_TIMESTAMP)) {
    console.log('[Creator Scout Popup] Profile changed detected, reloading status...');
    // Profile has changed - reload creator status
    chrome.storage.local.get([
      'SCOUT_EMAIL',
      'GAS_URL',
      'PERSONAL_SHEET_ID'
    ], (stored) => {
      if (stored.SCOUT_EMAIL && stored.GAS_URL && stored.PERSONAL_SHEET_ID) {
        console.log('[Creator Scout Popup] Calling checkCreatorStatus...');
        checkCreatorStatus(stored);
      }
    });
  }
});

// Speed Optimization: Non-blocking configuration check
// Show view immediately, hydrate data async
function checkConfigurationStatus() {
  chrome.storage.local.get([
    'SCOUT_EMAIL',
    'GAS_URL',
    'PERSONAL_SHEET_ID'
  ], (stored) => {
    const isConfigured = stored.SCOUT_EMAIL && stored.GAS_URL && stored.PERSONAL_SHEET_ID;

    if (isConfigured) {
      // Already showing onboarding, switch to settings
      // Load settings data async (non-blocking)
      loadSettingsToModal(stored);
      showSettingsView();
      // Load dashboard data in background
      loadDashboardData();
    }
  });
}

// Show onboarding view
function showOnboardingView() {
  document.getElementById('onboardingView').classList.remove('hidden');
  document.getElementById('collapsedView').classList.add('hidden');
  document.getElementById('compactView').classList.add('hidden');
  document.getElementById('dashboardView').classList.add('hidden');
  document.getElementById('settingsModal').classList.add('hidden');

  // Setup onboarding form submission
  document.getElementById('onboardingForm').addEventListener('submit', handleOnboardingSubmit);
}

// Show settings view directly (default after setup)
function showSettingsView() {
  document.getElementById('onboardingView').classList.add('hidden');
  document.getElementById('collapsedView').classList.add('hidden');
  document.getElementById('compactView').classList.add('hidden');
  document.getElementById('dashboardView').classList.add('hidden');
  document.getElementById('settingsModal').classList.remove('hidden');

  const settingsForm = document.getElementById('settingsForm');
  if (settingsForm) {
    settingsForm.removeEventListener('submit', handleSettingsSubmit);
    settingsForm.addEventListener('submit', handleSettingsSubmit);
  }
}


// Show collapsed view (default after setup)
function showCollapsedView() {
  document.getElementById('onboardingView').classList.add('hidden');
  document.getElementById('collapsedView').classList.remove('hidden');
  document.getElementById('compactView').classList.add('hidden');
  document.getElementById('dashboardView').classList.add('hidden');

  // Setup collapsed view button listeners
  const settingsBtn = document.getElementById('collapsedSettings');
  if (settingsBtn) {
    settingsBtn.removeEventListener('click', openSettings);
    settingsBtn.addEventListener('click', openSettings);
  }

  const expandBtn = document.getElementById('collapsedExpand');
  if (expandBtn) {
    expandBtn.removeEventListener('click', expandToCompactView);
    expandBtn.addEventListener('click', expandToCompactView);
  }

  const settingsForm = document.getElementById('settingsForm');
  if (settingsForm) {
    settingsForm.removeEventListener('submit', handleSettingsSubmit);
    settingsForm.addEventListener('submit', handleSettingsSubmit);
  }
}

// Expand from collapsed to compact view
function expandToCompactView() {
  document.getElementById('collapsedView').classList.add('hidden');
  document.getElementById('compactView').classList.remove('hidden');

  const compactSettings = document.getElementById('compactSettings');
  if (compactSettings) {
    compactSettings.removeEventListener('click', openSettings);
    compactSettings.addEventListener('click', openSettings);
  }

  const settingsForm = document.getElementById('settingsForm');
  if (settingsForm) {
    settingsForm.removeEventListener('submit', handleSettingsSubmit);
    settingsForm.addEventListener('submit', handleSettingsSubmit);
  }
}

// Show compact view (minimized, accessible via expand)
function showCompactView() {
  document.getElementById('onboardingView').classList.add('hidden');
  document.getElementById('collapsedView').classList.add('hidden');
  document.getElementById('compactView').classList.remove('hidden');
  document.getElementById('dashboardView').classList.add('hidden');

  // Setup compact view elements
  const compactSettings = document.getElementById('compactSettings');
  if (compactSettings) {
    compactSettings.removeEventListener('click', openSettings);
    compactSettings.addEventListener('click', openSettings);
  }

  const settingsForm = document.getElementById('settingsForm');
  if (settingsForm) {
    settingsForm.removeEventListener('submit', handleSettingsSubmit);
    settingsForm.addEventListener('submit', handleSettingsSubmit);
  }
}

// Show dashboard view (full UI, hidden by default)
function showDashboardView() {
  document.getElementById('onboardingView').classList.add('hidden');
  document.getElementById('collapsedView').classList.add('hidden');
  document.getElementById('compactView').classList.add('hidden');
  document.getElementById('dashboardView').classList.remove('hidden');

  // Setup settings button
  const settingsToggle = document.getElementById('settingsToggle');
  if (settingsToggle) {
    settingsToggle.removeEventListener('click', openSettings);
    settingsToggle.addEventListener('click', openSettings);
  }

  const settingsForm = document.getElementById('settingsForm');
  if (settingsForm) {
    settingsForm.removeEventListener('submit', handleSettingsSubmit);
    settingsForm.addEventListener('submit', handleSettingsSubmit);
  }
}

// Speed Optimization 2: Optimistic UI for onboarding
// Show loading state immediately, validate/save async
async function handleOnboardingSubmit(e) {
  e.preventDefault();

  const email = document.getElementById('scoutEmail').value.trim().toLowerCase();
  const submitBtn = e.target.querySelector('button[type="submit"]');

  if (!email) {
    showMessage('Please enter your email', 'error', 'onboardingMessage');
    return;
  }

  // Disable button immediately (instant feedback)
  submitBtn.disabled = true;
  submitBtn.textContent = 'Setting up...';
  showMessage('⟳ Connecting workspace...', 'info', 'onboardingMessage');

  // Do validation and storage async (non-blocking)
  validateEmailWithGAS(email, TEAM_LEAD_GAS_URL)
    .then((result) => {
      if (!result.valid) {
        showMessage('No sheet assigned. Contact lead.', 'error', 'onboardingMessage');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Continue →';
        return;
      }

      if (!result.sheet_id) {
        showMessage('No sheet assigned. Contact lead.', 'error', 'onboardingMessage');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Continue →';
        return;
      }

      // Save config with auto-fetched sheet_id
      chrome.storage.local.set({
        'SCOUT_EMAIL': email,
        'GAS_URL': TEAM_LEAD_GAS_URL,
        'PERSONAL_SHEET_ID': result.sheet_id
      });

      // Switch to settings view
      const stored = { SCOUT_EMAIL: email, GAS_URL: TEAM_LEAD_GAS_URL, PERSONAL_SHEET_ID: result.sheet_id };
      loadSettingsToModal(stored);
      showSettingsView();

      // Load dashboard data in background
      loadDashboardData();
    })
    .catch((error) => {
      showMessage('Error validating email: ' + error.message, 'error', 'onboardingMessage');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Continue →';
    });
}

// Load dashboard data (works for both compact and dashboard views)
async function loadDashboardData() {
  const stored = await chrome.storage.local.get([
    'SCOUT_EMAIL',
    'GAS_URL',
    'PERSONAL_SHEET_ID'
  ]);

  // Display logged-in email (in dashboard view)
  const loggedInEmail = document.getElementById('loggedInEmail');
  if (loggedInEmail && stored.SCOUT_EMAIL) {
    loggedInEmail.textContent = stored.SCOUT_EMAIL;
  }

  // Initialize widgets as hidden/ready
  const statusWidget = document.getElementById('statusWidget');
  if (statusWidget) {
    statusWidget.style.display = 'none';
  }

  const compactStatusWidget = document.getElementById('compactStatusWidget');
  if (compactStatusWidget) {
    compactStatusWidget.style.display = 'none';
  }

  await loadSettingsToModal(stored);
  await checkCreatorStatus(stored);
}

// Load settings into modal
async function loadSettingsToModal(stored) {
  // Display email as readonly text
  if (stored.SCOUT_EMAIL) {
    const emailDisplay = document.getElementById('settingsEmailDisplay');
    if (emailDisplay) {
      emailDisplay.textContent = stored.SCOUT_EMAIL;
    }
  }

  // Load all three templates from storage
  const templates = await chrome.storage.local.get([
    'autoDmTemplate1',
    'autoDmTemplate2',
    'autoDmTemplate3',
    'activeTemplate'
  ]);

  // Default templates if not yet set
  const template1 = templates.autoDmTemplate1 || 'Hi {{creator_name}}! Hope you are doing well.\n\nWe really liked your profile and would love to collaborate with you.';
  const template2 = templates.autoDmTemplate2 || 'Hey {{creator_name}},\n\nYour content resonates with our audience. Let\'s discuss potential collaboration opportunities!';
  const template3 = templates.autoDmTemplate3 || 'Hi {{creator_name}},\n\nWe admire your work and think there could be a great partnership opportunity. Are you open to chatting?';

  // Set active template (default to template1)
  const activeTemplate = templates.activeTemplate || 'template1';

  // Set hidden input for form submission
  const autoDmField = document.getElementById('autoDmTemplate');
  if (activeTemplate === 'template1') {
    autoDmField.value = template1;
  } else if (activeTemplate === 'template2') {
    autoDmField.value = template2;
  } else if (activeTemplate === 'template3') {
    autoDmField.value = template3;
  }

  // Load template names from storage
  const templateNames = await chrome.storage.local.get('templateNames');
  const names = templateNames.templateNames || {
    template1: '1',
    template2: '2',
    template3: '3'
  };

  // Store templates globally for use in button handlers
  window.__dmTemplates = {
    template1,
    template2,
    template3,
    activeTemplate,
    names
  };

  // Update button labels with template names (for settings modal)
  const btn1 = document.getElementById('templateBtn1');
  const btn2 = document.getElementById('templateBtn2');
  const btn3 = document.getElementById('templateBtn3');

  if (btn1) {
    const label1 = btn1.querySelector('.template-label');
    if (label1) label1.textContent = names.template1;
  }
  if (btn2) {
    const label2 = btn2.querySelector('.template-label');
    if (label2) label2.textContent = names.template2;
  }
  if (btn3) {
    const label3 = btn3.querySelector('.template-label');
    if (label3) label3.textContent = names.template3;
  }

  // Setup template pill buttons and preview
  setupTemplateButtons(activeTemplate);
}

// Setup template pill button listeners
function setupTemplateButtons(activeTemplate) {
  // Setup template pills in settings modal
  document.querySelectorAll('.settings-template-pill').forEach(btn => {
    btn.removeEventListener('click', handleSettingsTemplateClick);
    btn.addEventListener('click', handleSettingsTemplateClick);
  });

  // Setup legacy template pills (for dashboard view if used)
  document.querySelectorAll('.template-pill').forEach(btn => {
    btn.removeEventListener('click', handleTemplateButtonClick);
    btn.addEventListener('click', handleTemplateButtonClick);
  });

  // Update preview with active template
  updateTemplatePreview(activeTemplate);

  // Update UI to highlight active button
  updateTemplateButtonUI(activeTemplate);
}

// Update template preview in settings modal
function updateTemplatePreview(templateId) {
  const previewElement = document.getElementById('autoDmTemplatePreview');
  if (!previewElement || !window.__dmTemplates) return;

  const content = window.__dmTemplates[templateId];
  if (content) {
    previewElement.textContent = content;
  }

  // Update hidden input for form submission
  const autoDmField = document.getElementById('autoDmTemplate');
  if (autoDmField) {
    autoDmField.value = content;
  }
}

// Handle settings template pill click
function handleSettingsTemplateClick(e) {
  const btn = e.currentTarget;
  const templateId = btn.getAttribute('data-template');

  if (!templateId) return;

  // Update active template in storage
  chrome.storage.local.set({ activeTemplate: templateId });

  // Update global state
  if (window.__dmTemplates) {
    window.__dmTemplates.activeTemplate = templateId;
  }

  // Update preview and UI
  updateTemplatePreview(templateId);
  updateTemplateButtonUI(templateId);
}

// Handle template pill button click
function handleTemplateButtonClick(e) {
  const templateId = e.currentTarget.dataset.template;

  // Update global active template
  window.__dmTemplates.activeTemplate = templateId;

  // Update textarea with new template content
  const textarea = document.getElementById('autoDmTemplate');
  if (window.__dmTemplates && textarea) {
    textarea.value = window.__dmTemplates[templateId];
  }

  // Update button UI
  updateTemplateButtonUI(templateId);

  // Save active template to storage
  chrome.storage.local.set({ activeTemplate: templateId });
}

// Update template button UI to show active state
function updateTemplateButtonUI(activeTemplate) {
  // Update legacy template pills (dashboard)
  document.querySelectorAll('.template-pill').forEach(btn => {
    btn.classList.remove('active');
  });

  // Update settings template pills (settings modal)
  document.querySelectorAll('.settings-template-pill').forEach(btn => {
    btn.classList.remove('active');
  });

  // Add active class to all matching template buttons
  document.querySelectorAll(`[data-template="${activeTemplate}"]`).forEach(btn => {
    btn.classList.add('active');
  });
}

// Open settings modal
function openSettings() {
  document.getElementById('settingsModal').classList.remove('hidden');

  // Re-attach edit button listener (ensures it works after any DOM changes)
  const editTemplatesBtn = document.getElementById('editTemplatesBtn');
  if (editTemplatesBtn) {
    editTemplatesBtn.removeEventListener('click', openEditModal);
    editTemplatesBtn.addEventListener('click', openEditModal);
  }

  // Reload settings when modal opens (ensures fresh data)
  chrome.storage.local.get([
    'SCOUT_EMAIL',
    'GAS_URL',
    'PERSONAL_SHEET_ID'
  ], (stored) => {
    loadSettingsToModal(stored);
  });
}

// Close settings modal
function closeSettings() {
  document.getElementById('settingsModal').classList.add('hidden');
}

// Open edit templates modal
function openEditModal() {
  const modal = document.getElementById('editTemplatesModal');
  modal.classList.remove('hidden');

  // Load current template names into edit form
  const names = window.__dmTemplates?.names || {
    template1: '1',
    template2: '2',
    template3: '3'
  };

  document.getElementById('editTemplateName1').value = names.template1;
  document.getElementById('editTemplateName2').value = names.template2;
  document.getElementById('editTemplateName3').value = names.template3;
}

// Close edit templates modal
function closeEditModal() {
  document.getElementById('editTemplatesModal').classList.add('hidden');
}

// Handle edit templates form submission
function handleEditTemplatesSubmit(e) {
  e.preventDefault();

  const name1 = document.getElementById('editTemplateName1').value.trim() || '1';
  const name2 = document.getElementById('editTemplateName2').value.trim() || '2';
  const name3 = document.getElementById('editTemplateName3').value.trim() || '3';

  const templateNames = {
    template1: name1,
    template2: name2,
    template3: name3
  };

  // Save to storage
  chrome.storage.local.set({ templateNames });

  // Update global names
  if (window.__dmTemplates) {
    window.__dmTemplates.names = templateNames;
  }

  // Update button labels immediately
  document.getElementById('templateBtn1').querySelector('.template-label').textContent = name1;
  document.getElementById('templateBtn2').querySelector('.template-label').textContent = name2;
  document.getElementById('templateBtn3').querySelector('.template-label').textContent = name3;

  // Close modal
  closeEditModal();
}

// Open template editor (show textarea for editing)
function openTemplateEditor() {
  const previewElement = document.getElementById('autoDmTemplatePreview');
  const preview = document.querySelector('.settings-preview');

  if (!preview || !previewElement) return;

  // Create textarea for editing
  const textarea = document.createElement('textarea');
  textarea.id = 'templateEditorTextarea';
  textarea.className = 'settings-template-editor';
  textarea.value = previewElement.textContent;
  textarea.placeholder = 'Edit template...';

  // Replace preview with textarea
  preview.innerHTML = '';
  preview.appendChild(textarea);
  preview.style.padding = '8px';

  // Focus and select text
  textarea.focus();

  // Save on blur
  textarea.addEventListener('blur', saveTemplateEdit);
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      saveTemplateEdit();
    }
  });
}

// Save template edit
function saveTemplateEdit() {
  const textarea = document.getElementById('templateEditorTextarea');
  if (!textarea) return;

  const newContent = textarea.value.trim();
  const activeTemplate = window.__dmTemplates?.activeTemplate || 'template1';

  // Update global template
  if (window.__dmTemplates) {
    window.__dmTemplates[activeTemplate] = newContent;
  }

  // Update hidden input
  const autoDmField = document.getElementById('autoDmTemplate');
  if (autoDmField) {
    autoDmField.value = newContent;
  }

  // Restore preview
  const previewElement = document.getElementById('autoDmTemplatePreview');
  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'settings-edit-preview-btn';
  editBtn.id = 'editPreviewBtn';
  editBtn.title = 'Edit template';
  editBtn.textContent = '✏️';
  editBtn.addEventListener('click', openTemplateEditor);

  const preview = document.querySelector('.settings-preview');
  preview.innerHTML = '';
  previewElement.textContent = newContent;
  preview.appendChild(previewElement);
  preview.appendChild(editBtn);
}

// Handle settings form submission
function handleSettingsFormSubmit(e) {
  e.preventDefault();

  // Get active template value
  const activeTemplate = window.__dmTemplates?.activeTemplate || 'template1';
  const autoDmField = document.getElementById('autoDmTemplate');

  if (!autoDmField) return;

  // Prepare storage data
  const storageData = {};
  storageData[`autoDmTemplate`] = autoDmField.value;

  // Save to storage
  chrome.storage.local.set(storageData, () => {
    // Show success message
    const settingsMessage = document.getElementById('settingsMessage');
    if (settingsMessage) {
      settingsMessage.textContent = '✓ Settings saved';
      settingsMessage.className = 'message show success';
      setTimeout(() => {
        settingsMessage.classList.remove('show');
      }, 2000);
    }
  });

  // Show success message
  showMessage('✓ Template names updated', 'success', 'settingsMessage');
}

// Speed Optimization 3: Optimistic UI for settings
// Show loading state immediately, validate/save async
async function handleSettingsSubmit(e) {
  e.preventDefault();

  const email = document.getElementById('settingsEmail').value.trim().toLowerCase();
  const activeTemplate = window.__dmTemplates?.activeTemplate || 'template1';
  const currentTemplateText = document.getElementById('autoDmTemplate').value.trim();
  const submitBtn = e.target.querySelector('button[type="submit"]');

  if (!email) {
    showMessage('Please fill in all fields', 'error', 'settingsMessage');
    return;
  }

  // Disable button immediately (instant feedback)
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';
  showMessage('⟳ Updating...', 'info', 'settingsMessage');

  // Get current sheet ID from storage (scouts can't change it)
  const stored = await chrome.storage.local.get(['PERSONAL_SHEET_ID']);
  const personalSheetId = stored.PERSONAL_SHEET_ID;

  // Do validation and storage async (non-blocking)
  validateEmailWithGAS(email, TEAM_LEAD_GAS_URL)
    .then((result) => {
      if (!result.valid) {
        showMessage('Email not registered. Contact your team lead.', 'error', 'settingsMessage');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Update Settings';
        return;
      }

      // Build storage object with all three templates
      const storageData = {
        'SCOUT_EMAIL': email,
        'GAS_URL': TEAM_LEAD_GAS_URL,
        'PERSONAL_SHEET_ID': personalSheetId,
        'activeTemplate': activeTemplate
      };

      // Save the currently edited template to its storage key
      if (activeTemplate === 'template1') {
        storageData['autoDmTemplate1'] = currentTemplateText;
      } else if (activeTemplate === 'template2') {
        storageData['autoDmTemplate2'] = currentTemplateText;
      } else if (activeTemplate === 'template3') {
        storageData['autoDmTemplate3'] = currentTemplateText;
      }

      // Save config
      chrome.storage.local.set(storageData);

      // Show success immediately (no wait)
      showMessage('✓ Settings Updated', 'success', 'settingsMessage');

      // Close modal and refresh status immediately
      closeSettings();
      lastCheckedCreator = null;
      lastStatusCheckTime = 0;
      checkCreatorStatus({ SCOUT_EMAIL: email, GAS_URL: TEAM_LEAD_GAS_URL, PERSONAL_SHEET_ID: personalSheetId });

      // Re-enable button after a moment
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Update Settings';
      }, 500);
    })
    .catch((error) => {
      showMessage('Error validating email: ' + error.message, 'error', 'settingsMessage');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Update Settings';
    });
}

// Validate email exists in Scouts tab and fetch assigned sheet_id via Apps Script
async function validateEmailWithGAS(email, gasUrl) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        action: 'validateEmail',
        email: email.trim().toLowerCase()
      },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error('Could not connect to deployment URL'));
        } else if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve({
            valid: response.valid === true,
            sheet_id: response.sheet_id || null
          });
        }
      }
    );
  });
}

// Speed Optimization 4: Lightweight caching and debouncing
// Avoid repeated extraction and API calls
async function checkCreatorStatus(stored) {
  console.log('[Creator Scout Popup] checkCreatorStatus called');

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log('[Creator Scout Popup] Current tab URL:', tab.url);

  // Check if URL has changed - if so, clear cache and reset debounce
  const currentUrl = tab.url;
  const cachedLastUrl = await chrome.storage.local.get(['LAST_POPUP_URL']);

  if (cachedLastUrl.LAST_POPUP_URL !== currentUrl) {
    console.log('[Creator Scout Popup] URL changed - clearing cache and resetting debounce');
    // URL changed, clear creator cache and debounce
    chrome.storage.local.set({ 'LAST_POPUP_URL': currentUrl });
    lastCheckedCreator = null;
    lastStatusCheckTime = 0;
  } else {
    // Same URL - check debounce
    const now = Date.now();
    if (lastCheckedCreator === stored && now - lastStatusCheckTime < STATUS_CHECK_DEBOUNCE_MS) {
      console.log('[Creator Scout Popup] Skipping duplicate status check (debounced)');
      return;
    }
  }

  // Only work on supported platforms
  const supportedDomains = ['linkedin.com', 'twitter.com', 'x.com', 'instagram.com'];
  const isSupported = supportedDomains.some(domain => tab.url.includes(domain));

  if (!isSupported) {
    console.log('[Creator Scout Popup] Page not supported');
    setStatusWidget('unsupported', 'This page is not supported');
    return;
  }

  const email = stored.SCOUT_EMAIL;
  const gasUrl = stored.GAS_URL;
  const personalSheetId = stored.PERSONAL_SHEET_ID;

  if (!email || !gasUrl || !personalSheetId) {
    // Show status widget in whichever view is active
    const compactWidget = document.getElementById('compactStatusWidget');
    const dashboardWidget = document.getElementById('statusWidget');

    if (compactWidget && !document.getElementById('compactView').classList.contains('hidden')) {
      compactWidget.style.display = 'flex';
    }
    if (dashboardWidget && !document.getElementById('dashboardView').classList.contains('hidden')) {
      dashboardWidget.style.display = 'flex';
    }

    setStatusWidget('setup', 'Please configure settings');
    return;
  }

  try {
    // Ensure widget is visible before calling setStatusWidget
    const compactWidget = document.getElementById('compactStatusWidget');
    const dashboardWidget = document.getElementById('statusWidget');

    if (compactWidget && !document.getElementById('compactView').classList.contains('hidden')) {
      compactWidget.style.display = 'flex';
    }
    if (dashboardWidget && !document.getElementById('dashboardView').classList.contains('hidden')) {
      dashboardWidget.style.display = 'flex';
    }

    // Extract fresh creator data from page (don't use stale cache)
    let creatorData;
    try {
      // Always extract fresh creator data to ensure we're showing correct profile
      creatorData = await chrome.tabs.sendMessage(tab.id, {
        action: 'getCreatorInfo'
      });
      console.log('[Creator Scout Popup] Fresh creator data extracted');
    } catch (error) {
      // Handle context invalidation or messaging errors
      if (error.message && (error.message.includes('context invalidated') || error.message.includes('port closed') || error.message.includes('Could not establish connection'))) {
        console.warn('[Creator Scout Popup] Extension context invalidated - page may need refresh');
        setStatusWidget('error', 'Please refresh the page');
        showMessage('⟳ Please refresh the page to reconnect', 'info', 'compactMessage');
        return;
      }
      throw error;
    }

    console.log('[Creator Scout Popup] Creator data extracted:', creatorData);

    if (!creatorData || !creatorData.profile_url) {
      console.log('[Creator Scout Popup] Failed to extract creator info');
      setStatusWidget('error', 'Could not extract creator profile');
      return;
    }

    // PERFORMANCE FIX 2: Consolidate status fetch (was two sequential calls, now one)
    // Fetch the actual status from the sheet (single call instead of checkScoutedStatus + getCreatorStatus)
    console.log('[Creator Scout Popup] Fetching creator status for:', creatorData.profile_url);
    const statusResult = await fetchCreatorStatusFromSheet(email, creatorData.profile_url, gasUrl, personalSheetId);
    console.log('[Creator Scout Popup] Status result:', statusResult);

    // Check if creator has a status (found in sheet with a valid status value)
    if (statusResult && statusResult.status) {
      console.log('[Creator Scout Popup] Creator is scouted with status:', statusResult.status);

      const statusValue = statusResult.status;
      const statusLabelMap = {
        'saved': 'Shortlisted',
        'reachedout': 'Reached Out',
        'negotiating': 'Negotiating',
        'lockedin': 'Locked In',
        'cancelled': 'Cancelled',
        'new': 'Not Scouted'
      };

      setStatusWidget(statusValue, statusLabelMap[statusValue] || statusValue);

      // Store the actual status
      creatorData.status = statusValue;

      // PERFORMANCE FIX 2: Cache status immediately - merge with existing cache
      chrome.storage.local.get(['CREATOR_STATUS_CACHE'], (result) => {
        const cachedStatus = result.CREATOR_STATUS_CACHE || {};
        cachedStatus[creatorData.profile_url] = statusValue;
        chrome.storage.local.set({
          'CREATOR_STATUS_CACHE': cachedStatus,
          'CURRENT_CREATOR_DATA': JSON.stringify(creatorData)
        });
      });

      // Update content script button status
      try {
        await chrome.tabs.sendMessage(tab.id, {
          action: 'updateWidgetStatus',
          status: statusValue
        });
      } catch (error) {
        console.warn('[Creator Scout Popup] Could not update content script:', error);
        // Non-critical error, continue
      }
    } else {
      console.log('[Creator Scout Popup] Creator is not scouted');
      setStatusWidget('new', 'Creator not scouted yet');

      // Update content script button status
      try {
        await chrome.tabs.sendMessage(tab.id, {
          action: 'updateWidgetStatus',
          status: 'new'
        });
      } catch (error) {
        console.warn('[Creator Scout Popup] Could not update content script:', error);
        // Non-critical error, continue
      }
    }

    // Store current tab info for saving & caching
    chrome.storage.local.set({
      'CURRENT_CREATOR_DATA': creatorData,
      'CURRENT_SCOUT_EMAIL': email,
      'CURRENT_GAS_URL': gasUrl,
      'CURRENT_PERSONAL_SHEET_ID': personalSheetId
    });

    // Update cache tracking to prevent duplicate checks
    lastCheckedCreator = stored;
    lastStatusCheckTime = Date.now();

  } catch (error) {
    console.error('[Creator Scout Popup] Error checking status:', error);

    const compactWidget = document.getElementById('compactStatusWidget');
    const dashboardWidget = document.getElementById('statusWidget');

    if (compactWidget && !document.getElementById('compactView').classList.contains('hidden')) {
      compactWidget.style.display = 'flex';
    }
    if (dashboardWidget && !document.getElementById('dashboardView').classList.contains('hidden')) {
      dashboardWidget.style.display = 'flex';
    }

    setStatusWidget('error', 'Error checking status');
  }
}

// Check if creator already scouted using Apps Script
async function checkScoutedStatus(email, profileUrl, gasUrl, personalSheetId) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      {
        action: 'checkCreatorStatus',
        email: email,
        profile_url: profileUrl
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error checking scouted status:', chrome.runtime.lastError);
          resolve({ exists: false });
        } else {
          resolve(response || { exists: false });
        }
      }
    );
  });
}

// Fetch actual creator status from sheet
async function fetchCreatorStatusFromSheet(email, profileUrl, gasUrl, personalSheetId) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      {
        action: 'getCreatorStatus',
        email: email,
        profile_url: profileUrl
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error fetching creator status:', chrome.runtime.lastError);
          resolve({ status: null });
        } else {
          resolve(response || { status: null });
        }
      }
    );
  });
}

// Setup status pill event listeners (for interactive status switching)
function setupStatusPillListeners() {
  // Remove existing listeners first to avoid duplicates
  const allPills = document.querySelectorAll('.status-pill');
  allPills.forEach(pill => {
    const newPill = pill.cloneNode(true);
    pill.parentNode.replaceChild(newPill, pill);
  });

  // Re-query after replacing
  const compactPills = document.querySelectorAll('#compactStatusSelector .status-pill');
  compactPills.forEach(pill => {
    pill.addEventListener('click', async (e) => {
      e.preventDefault();
      const newStatus = pill.getAttribute('data-status');
      console.log('[Creator Scout] Status pill clicked:', newStatus);
      await handleStatusChange(newStatus);
    });
  });

  // Dashboard view status pills
  const dashboardPills = document.querySelectorAll('.dashboard-view .status-selector-pills .status-pill');
  dashboardPills.forEach(pill => {
    pill.addEventListener('click', async (e) => {
      e.preventDefault();
      const newStatus = pill.getAttribute('data-status');
      console.log('[Creator Scout] Status pill clicked:', newStatus);
      await handleStatusChange(newStatus);
    });
  });
}

// Setup action button event listeners (for status change via action buttons)
function setupActionButtonListeners() {
  // Remove existing listeners first to avoid duplicates
  const allButtons = document.querySelectorAll('.action-status-btn');
  allButtons.forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
  });

  // Re-query after replacing
  const actionButtons = document.querySelectorAll('.action-status-btn');
  actionButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const newStatus = btn.getAttribute('data-status');
      console.log('[Creator Scout] Action button clicked:', newStatus);
      await handleStatusChange(newStatus);
    });
  });
}

// Handle status change - update UI, storage, and backend
async function handleStatusChange(newStatus) {
  try {
    // Get current creator data from storage
    const stored = await new Promise(resolve => {
      chrome.storage.local.get([
        'SCOUT_EMAIL',
        'GAS_URL',
        'PERSONAL_SHEET_ID',
        'CURRENT_CREATOR_DATA'
      ], resolve);
    });

    const { SCOUT_EMAIL, GAS_URL, PERSONAL_SHEET_ID, CURRENT_CREATOR_DATA } = stored;
    if (!SCOUT_EMAIL || !GAS_URL || !PERSONAL_SHEET_ID || !CURRENT_CREATOR_DATA) {
      showMessage('Missing configuration. Please set up again.', 'error', 'compactMessage');
      return;
    }

    const creatorData = typeof CURRENT_CREATOR_DATA === 'string'
      ? JSON.parse(CURRENT_CREATOR_DATA)
      : CURRENT_CREATOR_DATA;

    const profileUrl = creatorData.profile_url;
    if (!profileUrl) {
      showMessage('No creator selected.', 'error', 'compactMessage');
      return;
    }

    // Update UI immediately (optimistic update)
    updateStatusPillsUI(newStatus);
    updateStatusWidgetDisplay(newStatus);

    // Show loading state during update
    const compactWidget = document.getElementById('compactStatusWidget');
    const dashboardWidget = document.getElementById('statusWidget');
    if (compactWidget) compactWidget.classList.add('status-loading');
    if (dashboardWidget) dashboardWidget.classList.add('status-loading');

    // Update in backend via service worker
    const result = await new Promise((resolve) => {
      chrome.runtime.sendMessage(
        {
          action: 'updateCreatorStatus',
          email: SCOUT_EMAIL,
          profile_url: profileUrl,
          new_status: newStatus,
          personalSheetId: PERSONAL_SHEET_ID
        },
        (response) => {
          resolve(response || {});
        }
      );
    });

    if (result.error) {
      showMessage('Failed to update status', 'error', 'compactMessage');
      // Revert UI on error
      loadDashboardData();
      return;
    }

    // Store updated status in local storage
    const updatedCreatorData = { ...creatorData, status: newStatus };

    // PERFORMANCE FIX 2: Cache status immediately for persistence
    chrome.storage.local.get(['CREATOR_STATUS_CACHE'], (result) => {
      const cachedStatus = result.CREATOR_STATUS_CACHE || {};
      cachedStatus[creatorData.profile_url] = newStatus;
      chrome.storage.local.set({
        CURRENT_CREATOR_DATA: JSON.stringify(updatedCreatorData),
        CREATOR_STATUS_CACHE: cachedStatus
      });
    });

    showMessage('Status updated', 'success', 'compactMessage');

  } catch (error) {
    console.error('Error updating status:', error);
    showMessage('Error updating status', 'error', 'compactMessage');
  }
}

// Update status pills UI - set active pill
function updateStatusPillsUI(activeStatus) {
  const allPills = document.querySelectorAll('.status-pill');
  allPills.forEach(pill => {
    const pillStatus = pill.getAttribute('data-status');
    if (pillStatus === activeStatus) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });

  // Also update action buttons to match active status
  const allButtons = document.querySelectorAll('.action-status-btn');
  allButtons.forEach(btn => {
    const btnStatus = btn.getAttribute('data-status');
    if (btnStatus === activeStatus) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Update status widget display based on current status
function updateStatusWidgetDisplay(status) {
  const statusLabelMap = {
    'saved': '✓ Shortlisted',
    'reachedout': '📞 Reached Out',
    'negotiating': '💬 Negotiating',
    'lockedin': '🔒 Locked In',
    'cancelled': '✕ Cancelled'
  };

  const label = statusLabelMap[status] || 'Unknown';

  const compactWidget = document.getElementById('compactStatusWidget');
  const dashboardWidget = document.getElementById('statusWidget');

  if (compactWidget) {
    document.getElementById('compactStatusLabel').textContent = label;
  }
  if (dashboardWidget) {
    document.getElementById('statusLabel').textContent = label;
  }
}

// Set status widget with color coding (works in both compact and dashboard views)
function setStatusWidget(status, label) {
  const statusIconMap = {
    'saved': '✓',
    'reachedout': '📞',
    'negotiating': '💬',
    'lockedin': '🔒',
    'cancelled': '✕',
    'new': '●',
    'error': '●',
    'setup': '●'
  };

  const statusClassMap = {
    'saved': 'status-saved',
    'reachedout': 'status-reachedout',
    'negotiating': 'status-negotiating',
    'lockedin': 'status-lockedin',
    'cancelled': 'status-cancelled',
    'new': 'status-new',
    'error': 'status-error',
    'setup': 'status-new'
  };

  // Update dashboard widget (if visible)
  const widget = document.getElementById('statusWidget');
  if (widget && !document.getElementById('dashboardView').classList.contains('hidden')) {
    if (status === 'unsupported') {
      widget.style.display = 'none';
    } else {
      widget.style.display = 'flex';
      widget.className = 'status-widget';
      document.getElementById('statusLabel').textContent = label;
      document.getElementById('statusIcon').textContent = statusIconMap[status] || '●';
      widget.classList.add(statusClassMap[status] || 'status-new');

      // Show selector pills if creator is scouted (not new)
      const dashboardSelector = document.getElementById('dashboardStatusSelector');
      if (dashboardSelector) {
        dashboardSelector.style.display = status !== 'new' ? 'block' : 'none';
        if (status !== 'new') {
          updateStatusPillsUI(status);
          // Re-attach event listeners after showing pills
          setTimeout(() => setupStatusPillListeners(), 50);
        }
      }
    }
  }

  // Update compact widget (if visible)
  const compactWidget = document.getElementById('compactStatusWidget');
  if (compactWidget && !document.getElementById('compactView').classList.contains('hidden')) {
    if (status === 'unsupported') {
      compactWidget.style.display = 'none';
    } else {
      compactWidget.style.display = 'flex';
      compactWidget.className = 'status-widget';
      document.getElementById('compactStatusLabel').textContent = label;
      document.getElementById('compactStatusIcon').textContent = statusIconMap[status] || '●';
      compactWidget.classList.add(statusClassMap[status] || 'status-new');

      // Show selector pills if creator is scouted (not new)
      const compactSelector = document.getElementById('compactStatusSelector');
      if (compactSelector) {
        compactSelector.style.display = status !== 'new' ? 'block' : 'none';
        if (status !== 'new') {
          updateStatusPillsUI(status);
          // Re-attach event listeners after showing pills
          setTimeout(() => setupStatusPillListeners(), 50);
        }
      }

      // Show action buttons if creator is scouted (not new)
      const compactActionButtons = document.getElementById('compactActionButtons');
      if (compactActionButtons) {
        compactActionButtons.style.display = status !== 'new' ? 'flex' : 'none';
        if (status !== 'new') {
          updateStatusPillsUI(status);
          // Re-attach event listeners after showing buttons
          setTimeout(() => setupActionButtonListeners(), 50);
        }
      }
    }
  }
}

// Show message
function showMessage(text, type, elementId) {
  const message = document.getElementById(elementId);
  if (!message) return;

  message.textContent = text;
  message.className = `message show ${type}`;

  if (type !== 'error') {
    setTimeout(() => {
      message.className = 'message';
    }, 5000);
  }
}
