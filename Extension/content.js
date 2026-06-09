// Creator Scout - Content Script (Fixed Panel UI)
// Simple, reliable approach: inject once in top-right corner

const CONFIG = {
  API_BASE: null, // Will be loaded from storage
  INJECTION_ID: 'scout-ui',
  EMAIL_KEY: 'scout_user_email',
  API_URL_KEY: 'scout_api_base',
  NOTIFICATION_DURATION: 3000,
};

// Default API URL fallback (MUST be configured in extension settings)
const DEFAULT_API_BASE = null;

// ============================================================================
// STATE
// ============================================================================

let currentProfile = {
  url: window.location.href,
  username: null,
  platform: null,
  status: 'new'
};

// ============================================================================
// STYLES
// ============================================================================

function injectStyles() {
  if (document.getElementById('scout-styles')) return;

  const style = document.createElement('style');
  style.id = 'scout-styles';
  style.textContent = `
    .scout-panel {
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 99999;
      min-width: 220px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .scout-status-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      margin-bottom: 12px;
      text-align: center;
    }

    .scout-badge-linkedin { background: #0a66c2; color: white; }
    .scout-badge-instagram { background: #e1306c; color: white; }
    .scout-badge-twitter { background: #1da1f2; color: white; }

    .scout-attribution {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 12px;
      word-break: break-word;
    }

    .scout-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .scout-btn {
      padding: 10px 14px;
      border: none;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      width: 100%;
      text-align: center;
      color: white;
    }

    .scout-btn-primary-linkedin { background: #0a66c2; color: white; }
    .scout-btn-primary-linkedin:hover { background: #084fa9; }

    .scout-btn-secondary-linkedin { background: #e5e7eb; color: #111827; }
    .scout-btn-secondary-linkedin:hover { background: #d1d5db; }

    .scout-btn-tertiary-linkedin { background: #f3f4f6; color: #111827; }
    .scout-btn-tertiary-linkedin:hover { background: #e5e7eb; }

    .scout-btn-primary-instagram { background: #e1306c; color: white; }
    .scout-btn-primary-instagram:hover { background: #c91f5f; }

    .scout-btn-secondary-instagram { background: #e5e7eb; color: #111827; }
    .scout-btn-secondary-instagram:hover { background: #d1d5db; }

    .scout-btn-tertiary-instagram { background: #f3f4f6; color: #111827; }
    .scout-btn-tertiary-instagram:hover { background: #e5e7eb; }

    .scout-btn-primary-twitter { background: #1da1f2; color: white; }
    .scout-btn-primary-twitter:hover { background: #1a91da; }

    .scout-btn-secondary-twitter { background: #e5e7eb; color: #111827; }
    .scout-btn-secondary-twitter:hover { background: #d1d5db; }

    .scout-btn-tertiary-twitter { background: #f3f4f6; color: #111827; }
    .scout-btn-tertiary-twitter:hover { background: #e5e7eb; }

    .scout-notification {
      position: fixed;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      z-index: 9999;
      animation: slideIn 0.3s ease-out;
      border: none;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      white-space: nowrap;
      pointer-events: none;
    }

    @keyframes slideIn {
      from {
        transform: translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .scout-close-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: none;
      border: none;
      color: #6b7280;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s;
    }

    .scout-close-btn:hover {
      color: #111827;
    }
  `;

  document.head.appendChild(style);
}

// ============================================================================
// CONFIGURATION
// ============================================================================

function loadConfiguration() {
  return new Promise((resolve) => {
    chrome.storage.local.get([CONFIG.API_URL_KEY], (result) => {
      CONFIG.API_BASE = result[CONFIG.API_URL_KEY] || DEFAULT_API_BASE;
      if (!CONFIG.API_BASE) {
        console.warn('⚠️ API URL not configured. Please configure it in extension Settings.');
      }
      resolve();
    });
  });
}

// ============================================================================
// PLATFORM DETECTION & PROFILE DATA EXTRACTION
// ============================================================================

function detectPlatform() {
  const hostname = window.location.hostname;
  if (hostname.includes('linkedin.com')) return 'linkedin';
  if (hostname.includes('instagram.com')) return 'instagram';
  if (hostname.includes('x.com') || hostname.includes('twitter.com')) return 'twitter';
  return null;
}

function extractFollowerCount() {
  const platform = detectPlatform();

  if (platform === 'linkedin') {
    // Try multiple selector strategies for LinkedIn
    let count = null;

    // Strategy 1: Look in topcard area
    const topcard = document.querySelector('[data-test-id="topcard"]');
    if (topcard) {
      const text = topcard.textContent;
      const match = text.match(/(\d+(?:,\d+)*)\s*(?:follower|connection)/i);
      if (match) count = match[1].replace(/,/g, '');
    }

    // Strategy 2: Look for connection/follower count in profile
    if (!count) {
      const allText = document.body.textContent;
      const match = allText.match(/(\d+(?:,\d+)*)\s*(?:follower|connection)s?\b/i);
      if (match) count = match[1].replace(/,/g, '');
    }

    return count;
  }

  if (platform === 'instagram') {
    // Instagram stores follower count in specific buttons/links
    // Strategy 1: Look for follower count button
    const buttons = Array.from(document.querySelectorAll('button, a'));
    for (let el of buttons) {
      const text = el.textContent.trim();
      // Look for pattern like "1,234 followers"
      if (text.match(/^[\d,]+\s+followers?$/i)) {
        const match = text.match(/^([\d,]+)/);
        if (match) return match[1].replace(/,/g, '');
      }
    }

    // Strategy 2: Check header area
    const header = document.querySelector('header');
    if (header) {
      const text = header.textContent;
      const match = text.match(/(\d+(?:,\d+)*)\s+followers?/i);
      if (match) return match[1].replace(/,/g, '');
    }

    return null;
  }

  if (platform === 'twitter') {
    // Twitter/X follower count in profile header
    // Strategy 1: Look for follower text pattern
    const profileText = document.body.textContent;
    const match = profileText.match(/(\d+(?:\.?\d+)?[KMB]?)\s*followers?/i);
    if (match) return match[1];

    // Strategy 2: Check specific profile sections
    const profileHeader = document.querySelector('[data-testid="primaryColumn"]');
    if (profileHeader) {
      const text = profileHeader.textContent;
      const match = text.match(/(\d+(?:\.?\d+)?[KMB]?)\s*followers?/i);
      if (match) return match[1];
    }

    return null;
  }

  return null;
}

function extractBio() {
  const platform = detectPlatform();

  if (platform === 'linkedin') {
    // Strategy 1: Look in topcard area
    const topcard = document.querySelector('[data-test-id="topcard"]');
    if (topcard) {
      const headline = topcard.querySelector('[data-test-id="topcard-headline"]');
      if (headline) {
        return headline.textContent.trim().split('\n')[0] || null;
      }
    }

    // Strategy 2: Get headline from text content
    const headlineElem = document.querySelector('[data-test-id="topcard-headline"]');
    if (headlineElem) {
      return headlineElem.textContent.trim().split('\n')[0] || null;
    }

    // Strategy 3: Look for About section
    const aboutSection = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('About'));
    if (aboutSection?.nextElementSibling) {
      return aboutSection.nextElementSibling.textContent.trim().substring(0, 150) || null;
    }

    return null;
  }

  if (platform === 'instagram') {
    // Look for bio in header or profile section
    const allText = document.body.textContent;
    // Find text after username/name but before follower counts
    const lines = allText.split('\n').map(l => l.trim()).filter(l => l);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Skip numbers and follower/following/posts labels
      if (line.match(/^\d+\s*(followers?|following|posts)$/i)) {
        continue;
      }
      // Skip edit profile, follow buttons, etc
      if (line.match(/^(edit profile|follow|following|message)$/i)) {
        continue;
      }
      // Take first substantive text as bio
      if (line.length > 3 && !line.includes('@')) {
        return line.substring(0, 150);
      }
    }

    return null;
  }

  if (platform === 'twitter') {
    // Strategy 1: Look for description element
    const bioElement = document.querySelector('[data-testid="UserDescription"]');
    if (bioElement) {
      return bioElement.textContent.trim().substring(0, 150) || null;
    }

    // Strategy 2: Look in profile area
    const profileArea = document.querySelector('[data-testid="primaryColumn"]');
    if (profileArea) {
      // Get text after name/handle but before follower counts
      const text = profileArea.textContent;
      const bioMatch = text.match(/(?:@\w+)\s*([^]*?)(?:followers?|following)/);
      if (bioMatch) return bioMatch[1].trim().substring(0, 150) || null;
    }

    return null;
  }

  return null;
}

function getUsername() {
  const hostname = window.location.hostname;
  const path = window.location.pathname;

  if (hostname.includes('linkedin.com')) {
    const match = path.match(/\/in\/([^/?]+)/);
    return match ? match[1] : null;
  }
  if (hostname.includes('instagram.com')) {
    const match = path.match(/\/([^/?]+)\/?$/);
    return match && match[1] !== '' ? match[1] : null;
  }
  if (hostname.includes('x.com') || hostname.includes('twitter.com')) {
    const match = path.match(/\/([^/?]+)(?:\/.*)?$/);
    return match && match[1] !== '' ? match[1] : null;
  }
  return null;
}

function getProfileUrl() {
  return window.location.href;
}

function getScoutInfo() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['scout_id', 'scout_name', 'scout_email'], (result) => {
      resolve({
        scoutId: result.scout_id || 'unknown',
        scoutName: result.scout_name || '',
        scoutEmail: result.scout_email || ''
      });
    });
  });
}

function getMessageTemplate() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['scout_message_template'], (result) => {
      const template = result.scout_message_template || 'Hey @{username}! We work on product launches and would love to collaborate. Are you open to sponsored partnerships?';
      resolve(template);
    });
  });
}

// ============================================================================
// UI UTILITIES
// ============================================================================

function showNotification(message) {
  const notif = document.createElement('div');
  notif.className = 'scout-notification';
  notif.textContent = message;
  document.body.appendChild(notif);

  // Position notification below the panel
  const panel = document.getElementById(CONFIG.INJECTION_ID);
  if (panel) {
    const panelRect = panel.getBoundingClientRect();
    notif.style.top = (panelRect.bottom + 10) + 'px';
  } else {
    notif.style.top = '20px';
  }

  setTimeout(() => notif.remove(), CONFIG.NOTIFICATION_DURATION);
}

function createButton(text, className, onClick) {
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.className = `scout-btn ${className}`;
  btn.type = 'button';
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  });
  return btn;
}

// ============================================================================
// PANEL CREATION
// ============================================================================

async function createPanel(platform, username, status) {
  const panel = document.createElement('div');
  panel.id = CONFIG.INJECTION_ID;
  panel.className = `scout-panel scout-panel-${platform}`;

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'scout-close-btn';
  closeBtn.textContent = '✕';
  closeBtn.type = 'button';
  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    panel.remove();
  });
  panel.appendChild(closeBtn);

  // Status badge
  const badge = document.createElement('div');
  badge.className = `scout-status-badge scout-badge-${platform}`;
  badge.textContent = (status || 'new').toUpperCase();
  panel.appendChild(badge);

  // Scout attribution
  const scoutInfo = await getScoutInfo();
  const attribution = document.createElement('div');
  attribution.className = 'scout-attribution';
  const attributionText = scoutInfo.scoutName
    ? `Scout: ${scoutInfo.scoutName} (${scoutInfo.scoutId})`
    : `Scout ID: ${scoutInfo.scoutId}`;
  attribution.textContent = attributionText;
  panel.appendChild(attribution);

  // Profile data
  const followerCount = extractFollowerCount();
  if (followerCount) {
    const dataDiv = document.createElement('div');
    dataDiv.className = 'scout-attribution';
    dataDiv.style.fontSize = '12px';
    dataDiv.textContent = `👥 ${followerCount} followers`;
    panel.appendChild(dataDiv);
  }

  const bio = extractBio();
  if (bio) {
    const bioDiv = document.createElement('div');
    bioDiv.className = 'scout-attribution';
    bioDiv.style.fontSize = '11px';
    bioDiv.style.color = '#4b5563';
    bioDiv.style.marginTop = '8px';
    bioDiv.textContent = bio;
    panel.appendChild(bioDiv);
  }

  // Buttons
  const buttons = document.createElement('div');
  buttons.className = 'scout-buttons';

  buttons.appendChild(createButton('💾 Save', `scout-btn-primary-${platform}`, handleSaveCreator));
  buttons.appendChild(createButton('✓ Contacted', `scout-btn-secondary-${platform}`, handleMarkContacted));
  buttons.appendChild(createButton('📋 Copy', `scout-btn-tertiary-${platform}`, () => handleCopyMessage(username)));
  buttons.appendChild(createButton('💬 Send DM', `scout-btn-primary-${platform}`, handleOpenDM));

  panel.appendChild(buttons);
  return panel;
}

// ============================================================================
// API CALLS
// ============================================================================

async function checkCreator(url) {
  if (!CONFIG.API_BASE) {
    console.warn('❌ API URL not configured');
    return 'new';
  }
  try {
    console.log('🔍 Checking creator status for URL:', url);
    const response = await fetch(`${CONFIG.API_BASE}?action=check&url=${encodeURIComponent(url)}`);

    if (!response.ok) {
      console.warn('⚠️ Check API returned:', response.status, response.statusText);
      return 'new';
    }

    const data = await response.json();
    const status = data.status || 'new';
    console.log('✅ Creator status:', status);
    return status;
  } catch (error) {
    console.error('❌ Check creator error:', error.message);
    return 'new';
  }
}

async function saveCreator(url, platform, username) {
  if (!CONFIG.API_BASE) {
    return { success: false, error: 'API not configured' };
  }
  try {
    const scoutInfo = await getScoutInfo();
    const followerCount = extractFollowerCount();
    const bio = extractBio();

    const payload = {
      profile_url: url,
      platform: platform,
      username: username,
      scout_id: scoutInfo.scoutId,
      scout_name: scoutInfo.scoutName,
      email: scoutInfo.scoutEmail,
      follower_count: followerCount || '',
      bio: bio || ''
    };
    console.log('📤 Saving creator with payload:', payload);

    const response = await fetch(`${CONFIG.API_BASE}?action=add`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    console.log('📥 API Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API error response:', errorText);
      return { success: false };
    }

    const data = await response.json();
    console.log('✅ API success response:', data);
    return data;
  } catch (error) {
    console.error('❌ Save creator error:', error.message, error);
    return { success: false };
  }
}

async function updateStatus(url, status) {
  if (!CONFIG.API_BASE) {
    return false;
  }
  try {
    const scoutInfo = await getScoutInfo();
    const payload = {
      profile_url: url,
      status: status,
      scout_id: scoutInfo.scoutId,
      scout_name: scoutInfo.scoutName,
      email: scoutInfo.scoutEmail
    };
    console.log('📤 Updating status with payload:', payload);

    const response = await fetch(`${CONFIG.API_BASE}?action=updateStatus`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    console.log('📥 API Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API error response:', errorText);
      return false;
    }

    const data = await response.json();
    console.log('✅ API success response:', data);
    return data.success === true;
  } catch (error) {
    console.error('❌ Update status error:', error.message, error);
    return false;
  }
}

// ============================================================================
// BUTTON HANDLERS
// ============================================================================

async function handleSaveCreator() {
  if (!CONFIG.API_BASE) {
    showNotification('❌ Configure API URL in Settings first');
    return;
  }

  const result = await saveCreator(
    currentProfile.url,
    currentProfile.platform,
    currentProfile.username
  );

  if (result.success === false) {
    showNotification('❌ Failed to save');
    return;
  }

  if (result.already_exists) {
    const message = `⚠️ Already scouted by ${result.scout_id} on ${new Date(result.timestamp).toLocaleDateString()}`;
    showNotification(message);
    currentProfile.status = result.status || 'pending';
    updateStatusDisplay(currentProfile.status);
  } else {
    currentProfile.status = 'pending';
    updateStatusDisplay('pending');
    showNotification('✅ Creator saved!');
  }
}

async function handleMarkContacted() {
  const success = await updateStatus(currentProfile.url, 'contacted');
  if (success) {
    currentProfile.status = 'contacted';
    updateStatusDisplay('contacted');
    showNotification('✅ Marked as contacted!');
  } else {
    showNotification('❌ Failed to update');
  }
}

async function handleCopyMessage(username) {
  const template = await getMessageTemplate();
  const message = template.replace('{username}', username);
  navigator.clipboard.writeText(message).then(() => {
    showNotification('📋 Message copied!');
  }).catch(() => {
    showNotification('❌ Failed to copy');
  });
}

function updateStatusDisplay(status) {
  const badge = document.querySelector(`#${CONFIG.INJECTION_ID} .scout-status-badge`);
  if (badge) {
    badge.textContent = (status || 'new').toUpperCase();
  }
}

async function handleOpenDM() {
  const template = await getMessageTemplate();
  const message = template.replace('{username}', currentProfile.username);
  const platform = currentProfile.platform;
  const username = currentProfile.username;

  if (platform === 'linkedin') {
    window.open(`https://www.linkedin.com/messaging/compose/?recipients=${username}`, '_blank');
    setTimeout(() => {
      showNotification(`💬 DM ready - paste message manually`);
    }, 500);
  } else if (platform === 'twitter') {
    window.open(`https://twitter.com/messages/compose?recipient_id=${username}`, '_blank');
    setTimeout(() => {
      showNotification(`💬 DM ready - paste message manually`);
    }, 500);
  } else if (platform === 'instagram') {
    window.open(`https://www.instagram.com/direct/t/${username}`, '_blank');
    setTimeout(() => {
      showNotification(`💬 DM ready - paste message manually`);
    }, 500);
  }

  navigator.clipboard.writeText(message).catch(() => {});
}

// ============================================================================
// INJECTION
// ============================================================================

async function injectPanel() {
  // Check if already injected (prevents duplicate panels)
  if (document.getElementById(CONFIG.INJECTION_ID)) {
    return;
  }

  const panel = await createPanel(
    currentProfile.platform,
    currentProfile.username,
    currentProfile.status
  );
  document.body.appendChild(panel);
}

async function initializeProfile() {
  const platform = detectPlatform();
  const username = getUsername();

  // Only proceed on valid profile pages
  if (!platform || !username) {
    return;
  }

  // Update profile state
  currentProfile = {
    url: getProfileUrl(),
    username: username,
    platform: platform,
    status: 'new'
  };

  // Fetch current status from backend
  const status = await checkCreator(currentProfile.url);
  currentProfile.status = status;

  // Inject panel
  injectPanel();
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Load configuration and inject when ready
async function initializeExtension() {
  injectStyles();
  await loadConfiguration();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeProfile);
  } else {
    initializeProfile();
  }
}

initializeExtension();

// Handle SPA navigation (LinkedIn, Twitter, Instagram all use client-side routing)
let lastUrl = window.location.href;
const navCheckInterval = setInterval(() => {
  const newUrl = window.location.href;
  if (newUrl !== lastUrl) {
    lastUrl = newUrl;
    // Remove old panel
    const panel = document.getElementById(CONFIG.INJECTION_ID);
    if (panel) panel.remove();
    // Reinitialize for new profile
    initializeProfile();
  }
}, 1000);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  clearInterval(navCheckInterval);
});
