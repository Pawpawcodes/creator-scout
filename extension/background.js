// background.js - Service worker for extension lifecycle

const EMAIL_KEY = 'scout_user_email';

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Open welcome page or settings (optional)
    chrome.tabs.create({ url: 'chrome://extensions/?id=' + chrome.runtime.id });
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getConfig') {
    // Configuration must be loaded from chrome.storage.local in popup settings
    sendResponse({ apiBase: process.env.EXTENSION_API_BASE || null });
  } else if (request.action === 'getUserEmail') {
    // Get user email from local storage
    chrome.storage.local.get([EMAIL_KEY], (result) => {
      const email = result[EMAIL_KEY] || null;
      sendResponse(email);
    });
    return true; // Will respond asynchronously
  }
});
