// Precompiled styles (injected once at script load)
const WIDGET_STYLES = `
    .creator-scout-widget {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      user-select: none;
      animation: slideInRight 0.4s ease-out;
      cursor: grab;
      touch-action: none;
    }

    .creator-scout-widget.dragging {
      cursor: grabbing;
      opacity: 0.9;
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes scoutFadeIn {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes scoutFadeOut {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(-4px);
      }
    }

    .scout-save-message {
      padding: 8px 12px;
      border-radius: 10px;
      font-size: 10px;
      font-weight: 600;
      z-index: 999999;
      animation: scoutFadeIn 0.3s ease-out;
      position: relative;
      margin-top: 4px;
      text-align: center;
    }

    .scout-status-text {
      font-size: 9px;
      font-weight: 600;
      text-align: center;
      padding: 2px 0;
      margin-top: 2px;
      margin-bottom: 2px;
      animation: scoutFadeIn 0.3s ease-out;
    }

    .scout-status-text.status-success {
      color: #4ade80;
    }

    .scout-status-text.status-error {
      color: #f87171;
    }

    .scout-status-text.fade-out {
      animation: scoutFadeOut 0.3s ease-out forwards;
    }

    .scout-save-message.scout-save-message-success {
      background: rgba(34, 197, 94, 0.15);
      color: #4ade80;
      border: 1px solid rgba(34, 197, 94, 0.3);
    }

    .scout-save-message.scout-save-message-error {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .scout-save-message.fade-out {
      animation: scoutFadeOut 0.3s ease-out forwards;
    }

    .scout-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      cursor: pointer;
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.4);
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.15),
        inset 0 1px 2px rgba(255, 255, 255, 0.6),
        inset 0 -1px 1px rgba(0, 0, 0, 0.1);
    }

    .scout-badge:hover {
      transform: translateY(-2px);
      background: rgba(255, 255, 255, 0.3);
      box-shadow:
        0 12px 40px rgba(0, 0, 0, 0.2),
        inset 0 1px 2px rgba(255, 255, 255, 0.6),
        inset 0 -1px 1px rgba(0, 0, 0, 0.1);
    }

    .scout-icon {
      font-size: 16px;
      font-weight: 700;
    }

    .scout-text {
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
    }

    .scout-close {
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      margin-left: 4px;
      opacity: 0.7;
      transition: opacity 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .scout-close:hover {
      opacity: 1;
    }

    .badge-saved {
      background: rgba(234, 179, 8, 0.25);
      color: #eab308;
      border-color: rgba(234, 179, 8, 0.5);
    }

    .scout-badge.badge-saved {
      background: rgba(59, 130, 246, 0.25) !important;
      color: #3b82f6 !important;
      border-color: rgba(59, 130, 246, 0.5) !important;
    }

    .badge-reachedout {
      background: rgba(255, 152, 0, 0.25);
      color: #ff9800;
      border-color: rgba(255, 152, 0, 0.5);
    }

    .scout-badge.badge-reachedout {
      background: rgba(255, 152, 0, 0.25) !important;
      color: #ff9800 !important;
      border-color: rgba(255, 152, 0, 0.5) !important;
    }

    .badge-negotiating {
      background: rgba(255, 193, 7, 0.25);
      color: #ffc107;
      border-color: rgba(255, 193, 7, 0.5);
    }

    .scout-badge.badge-negotiating {
      background: rgba(255, 193, 7, 0.25) !important;
      color: #ffc107 !important;
      border-color: rgba(255, 193, 7, 0.5) !important;
    }

    .badge-lockedin {
      background: rgba(34, 197, 94, 0.25);
      color: #22c55e;
      border-color: rgba(34, 197, 94, 0.5);
    }

    .scout-badge.badge-lockedin {
      background: rgba(34, 197, 94, 0.25) !important;
      color: #22c55e !important;
      border-color: rgba(34, 197, 94, 0.5) !important;
    }

    .badge-cancelled {
      background: rgba(239, 68, 68, 0.25);
      color: #ef4444;
      border-color: rgba(239, 68, 68, 0.5);
    }

    .scout-badge.badge-cancelled {
      background: rgba(239, 68, 68, 0.25) !important;
      color: #ef4444 !important;
      border-color: rgba(239, 68, 68, 0.5) !important;
    }

    .badge-new {
      background: rgba(107, 114, 128, 0.12);
      color: #6b7280;
      border-color: rgba(107, 114, 128, 0.25);
    }

    .scout-badge.badge-new {
      background: rgba(107, 114, 128, 0.12) !important;
      color: #6b7280 !important;
      border-color: rgba(107, 114, 128, 0.25) !important;
    }

    .badge-new {
      background: rgba(107, 114, 128, 0.12);
      color: #6b7280;
      border-color: rgba(107, 114, 128, 0.25);
    }

    .badge-error {
      background: rgba(239, 68, 68, 0.12);
      color: #ef4444;
      border-color: rgba(239, 68, 68, 0.25);
    }

    .scout-widget-popup {
      position: fixed;
      top: 70px;
      right: 20px;
      z-index: 999999;
      background: rgba(30, 30, 40, 0.85);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 6px 8px;
      max-width: 260px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
      animation: popupFadeScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      transform-origin: top right;
      transition: background 0.3s ease;
      color: #ffffff;
    }

    .scout-widget-popup.popup-saved {
      background: rgba(30, 30, 40, 0.85);
      border-color: rgba(255, 255, 255, 0.08);
    }

    .scout-widget-popup.popup-hold {
      background: rgba(30, 30, 40, 0.85);
      border-color: rgba(255, 255, 255, 0.08);
    }

    .scout-widget-popup.popup-locked-in {
      background: rgba(30, 30, 40, 0.85);
      border-color: rgba(255, 255, 255, 0.08);
    }

    .scout-widget-popup.scout-popup-open {
      animation: popupFadeScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes popupFadeScale {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .scout-popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3px;
    }

    .scout-popup-title {
      font-size: 12px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.2px;
      margin: 0;
    }

    .scout-popup-close {
      background: none;
      border: none;
      font-size: 16px;
      cursor: pointer;
      color: rgba(255, 255, 255, 0.4);
      padding: 2px;
      transition: color 0.2s, transform 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .scout-popup-close:hover {
      color: rgba(255, 255, 255, 0.7);
      transform: scale(1.1);
    }

    .scout-status-badge {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 5px 9px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      margin-bottom: 8px;
      letter-spacing: 0.3px;
    }

    .scout-status-badge.badge-new {
      background: rgba(107, 114, 128, 0.15);
      color: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(107, 114, 128, 0.3);
    }

    .scout-status-badge.badge-saved {
      background: rgba(59, 130, 246, 0.15);
      color: rgba(255, 255, 255, 0.95);
      border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .scout-status-badge.badge-error {
      background: rgba(239, 68, 68, 0.15);
      color: rgba(255, 255, 255, 0.95);
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .badge-icon {
      font-weight: 700;
      font-size: 13px;
    }

    .badge-text {
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .scout-popup-actions {
      display: flex;
      flex-direction: row;
      gap: 4px;
      margin-bottom: 4px;
      align-items: stretch;
      margin-top: 4px;
    }

    .scout-status-button-group {
      display: flex;
      gap: 4px;
      width: 100%;
      margin-bottom: 0;
      background: rgba(0, 0, 0, 0.04);
      padding: 3px;
      border-radius: 6px;
    }

    .scout-action-btn {
      flex: 1;
      padding: 4px 10px;
      background: rgba(124, 58, 237, 0.2);
      color: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(124, 58, 237, 0.35);
      border-radius: 12px;
      font-size: 10px;
      font-weight: 600;
      transition: all 0.2s ease;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      letter-spacing: 0.2px;
    }

    .scout-action-btn:hover:not(:disabled) {
      background: rgba(124, 58, 237, 0.3);
      border-color: rgba(124, 58, 237, 0.5);
      box-shadow: 0 0 10px rgba(124, 58, 237, 0.25);
      transform: translateY(-0.5px);
    }

    .scout-action-btn:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 0 6px rgba(124, 58, 237, 0.15);
    }

    .scout-action-btn:disabled {
      background: linear-gradient(135deg, #d1d5db 0%, #e5e7eb 100%);
      color: #9ca3af;
      cursor: not-allowed;
    }

    .scout-status-btn {
      flex: 1;
      padding: 5px 3px;
      background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%);
      color: #ffffff;
      border: 1px solid rgba(124, 58, 237, 0.4);
      border-radius: 8px;
      font-size: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
      white-space: nowrap;
      min-height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      letter-spacing: 0.1px;
    }

    .scout-status-btn:hover:not(:disabled) {
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
      box-shadow: 0 6px 16px rgba(124, 58, 237, 0.4);
      transform: translateY(-1px);
    }

    .scout-status-btn:disabled {
      background: rgba(107, 114, 128, 0.15);
      color: rgba(255, 255, 255, 0.6);
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
      border-color: rgba(107, 114, 128, 0.2);
    }

    .scout-status-btn:disabled:hover {
      background: rgba(107, 114, 128, 0.15);
      box-shadow: none;
    }

    .scout-workflow-buttons {
      display: flex;
      gap: 4px;
      width: 100%;
      margin-bottom: 3px;
    }

    .scout-workflow-btn {
      flex: 1;
      padding: 4px 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      font-size: 9px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
      white-space: nowrap;
      letter-spacing: 0.1px;
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.8);
      min-height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .scout-workflow-btn.current {
      background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%);
      color: #ffffff;
      border-color: rgba(124, 58, 237, 0.6);
      box-shadow: 0 0 12px rgba(124, 58, 237, 0.35);
    }

    .scout-workflow-btn.current:hover {
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
      box-shadow: 0 0 16px rgba(124, 58, 237, 0.45);
      transform: translateY(-1px);
    }

    .scout-workflow-btn.next {
      background: rgba(124, 58, 237, 0.2);
      color: rgba(255, 255, 255, 0.9);
      border-color: rgba(124, 58, 237, 0.35);
    }

    .scout-workflow-btn.next:hover {
      background: rgba(124, 58, 237, 0.3);
      border-color: rgba(124, 58, 237, 0.5);
      box-shadow: 0 0 8px rgba(124, 58, 237, 0.25);
    }

    .scout-workflow-btn:disabled {
      /* DO NOT USE GREY - use .next class instead for disabled appearance */
    }

    .scout-workflow-btn.delete {
      background: rgba(239, 68, 68, 0.15);
      color: #ffffff;
      border-color: rgba(220, 38, 38, 0.35);
      font-size: 8px;
    }

    .scout-workflow-btn.delete:hover {
      background: rgba(239, 68, 68, 0.25);
      border-color: rgba(220, 38, 38, 0.5);
      color: #ffffff;
      box-shadow: 0 0 8px rgba(220, 38, 38, 0.25);
    }

    .scout-notes-section {
      margin-top: 6px;
      padding-top: 6px;
    }

    .scout-notes-box {
      display: flex;
      align-items: flex-start;
      gap: 5px;
      padding: 5px 7px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: 10px;
      transition: all 0.2s ease;
      position: relative;
    }

    .scout-notes-box:focus-within {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(124, 58, 237, 0.3);
      box-shadow: 0 0 10px rgba(124, 58, 237, 0.15);
    }

    .scout-notes-inline {
      outline: none;
      line-height: 1.4;
    }

    .scout-notes-inline::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    .scout-notes-inline:focus {
      outline: none;
      border-color: rgba(124, 58, 237, 0.5) !important;
      box-shadow: 0 0 8px rgba(124, 58, 237, 0.2) !important;
    }

    .scout-notes-tick-btn {
      background: #22c55e;
      border: none;
      color: white;
      font-size: 8px;
      cursor: pointer;
      padding: 4px 8px;
      flex-shrink: 0;
      transition: all 0.2s ease;
      min-width: 24px;
      text-align: center;
      margin-top: 1px;
      font-weight: 700;
      border-radius: 14px;
    }

    .scout-notes-tick-btn:hover {
      background: #4ade80;
      transform: scale(1.05);
    }

    .scout-notes-feedback {
      display: none !important;
    }

    .scout-notes-textarea {
      width: 100%;
      min-height: 50px;
      max-height: 80px;
      padding: 4px 6px;
      border: 1px solid rgba(124, 58, 237, 0.3);
      border-radius: 4px;
      font-size: 11px;
      font-family: inherit;
      color: #333;
      resize: vertical;
      background: rgba(255, 255, 255, 0.9);
      transition: all 0.2s ease;
    }

    .scout-notes-textarea:focus {
      outline: none;
      border-color: rgba(124, 58, 237, 0.5);
      background: white;
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
    }

    .scout-notes-textarea::placeholder {
      color: #999;
    }

    .scout-delete-confirm {
      padding: 10px;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 8px;
      margin-bottom: 6px;
    }

    .scout-delete-success {
      padding: 10px;
      text-align: center;
      font-size: 11px;
      font-weight: 600;
      color: #4ade80;
      background: rgba(34, 197, 94, 0.15);
      border: 1px solid rgba(34, 197, 94, 0.3);
      border-radius: 8px;
    }

    .scout-delete-title {
      font-size: 10px;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 3px;
    }

    .scout-delete-message {
      font-size: 9px;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 6px;
    }

    .scout-delete-buttons {
      display: flex;
      gap: 4px;
    }

    .scout-delete-confirm-btn {
      flex: 1;
      padding: 4px 8px;
      border: none;
      border-radius: 8px;
      font-size: 9px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      background: #ef4444;
      color: white;
    }

    .scout-delete-confirm-btn:hover {
      background: #f87171;
      transform: translateY(-1px);
    }

    .scout-delete-cancel-btn {
      flex: 1;
      padding: 4px 8px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      font-size: 9px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      background: rgba(107, 114, 128, 0.15);
      color: rgba(255, 255, 255, 0.9);
    }

    .scout-delete-cancel-btn:hover {
      background: rgba(107, 114, 128, 0.25);
    }

    .scout-dm-btn {
      padding: 3px 7px;
      width: auto;
      margin-top: 1px;
      font-size: 8px;
      background: rgba(124, 58, 237, 0.2);
      border: 1px solid rgba(124, 58, 237, 0.35);
      border-radius: 14px;
      color: rgba(255, 255, 255, 0.85);
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .scout-dm-btn:hover {
      background: rgba(124, 58, 237, 0.3);
      border-color: rgba(124, 58, 237, 0.5);
      box-shadow: 0 0 6px rgba(124, 58, 237, 0.2);
    }

    .scout-dm-btn:active {
      transform: scale(0.96);
      background: rgba(124, 58, 237, 0.4);
    }

    .scout-floating-button-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999998;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    }

    .scout-floating-button {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 7px 12px;
      height: 30px;
      background: rgba(107, 114, 128, 0.15);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(107, 114, 128, 0.3);
      border-radius: 20px;
      color: #6b7280;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(107, 114, 128, 0.2), 0 0 1px rgba(0, 0, 0, 0.1) inset;
      white-space: nowrap;
    }

    .scout-floating-button.status-new {
      background: rgba(107, 114, 128, 0.15);
      border-color: rgba(107, 114, 128, 0.3);
      color: #6b7280;
    }

    .scout-floating-button.status-new:hover {
      background: rgba(107, 114, 128, 0.25);
      border-color: rgba(107, 114, 128, 0.5);
      box-shadow: 0 6px 16px rgba(107, 114, 128, 0.3), 0 0 1px rgba(0, 0, 0, 0.1) inset;
    }

    .scout-floating-button.status-saved {
      background: rgba(59, 130, 246, 0.15);
      border-color: rgba(59, 130, 246, 0.3);
      color: #3b82f6;
    }

    .scout-floating-button.status-saved:hover {
      background: rgba(59, 130, 246, 0.25);
      border-color: rgba(59, 130, 246, 0.5);
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.3), 0 0 1px rgba(0, 0, 0, 0.1) inset;
    }

    .scout-floating-button.status-reachedout {
      background: rgba(255, 152, 0, 0.15);
      border-color: rgba(255, 152, 0, 0.3);
      color: #ff9800;
    }

    .scout-floating-button.status-reachedout:hover {
      background: rgba(255, 152, 0, 0.25);
      border-color: rgba(255, 152, 0, 0.5);
      box-shadow: 0 6px 16px rgba(255, 152, 0, 0.3), 0 0 1px rgba(0, 0, 0, 0.1) inset;
    }

    .scout-floating-button.status-negotiating {
      background: rgba(255, 193, 7, 0.15);
      border-color: rgba(255, 193, 7, 0.3);
      color: #ffc107;
    }

    .scout-floating-button.status-negotiating:hover {
      background: rgba(255, 193, 7, 0.25);
      border-color: rgba(255, 193, 7, 0.5);
      box-shadow: 0 6px 16px rgba(255, 193, 7, 0.3), 0 0 1px rgba(0, 0, 0, 0.1) inset;
    }

    .scout-floating-button.status-lockedin {
      background: rgba(34, 197, 94, 0.15);
      border-color: rgba(34, 197, 94, 0.3);
      color: #22c55e;
    }

    .scout-floating-button.status-lockedin:hover {
      background: rgba(34, 197, 94, 0.25);
      border-color: rgba(34, 197, 94, 0.5);
      box-shadow: 0 6px 16px rgba(34, 197, 94, 0.3), 0 0 1px rgba(0, 0, 0, 0.1) inset;
    }

    .scout-floating-button.status-cancelled {
      background: rgba(239, 68, 68, 0.15);
      border-color: rgba(239, 68, 68, 0.3);
      color: #ef4444;
    }

    .scout-floating-button.status-cancelled:hover {
      background: rgba(239, 68, 68, 0.25);
      border-color: rgba(239, 68, 68, 0.5);
      box-shadow: 0 6px 16px rgba(239, 68, 68, 0.3), 0 0 1px rgba(0, 0, 0, 0.1) inset;
    }

    .scout-floating-button.status-error {
      background: rgba(239, 68, 68, 0.15);
      border-color: rgba(239, 68, 68, 0.3);
      color: #ef4444;
    }

    .scout-floating-button.status-error:hover {
      background: rgba(239, 68, 68, 0.25);
      border-color: rgba(239, 68, 68, 0.5);
      box-shadow: 0 6px 16px rgba(239, 68, 68, 0.3), 0 0 1px rgba(0, 0, 0, 0.1) inset;
    }

    .scout-floating-button:active {
      transform: translateY(0);
    }

    .scout-button-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: inherit;
    }

    .scout-button-text {
      color: inherit;
      font-weight: 600;
    }

    .scout-close-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      margin-left: 4px;
      padding: 0;
      font-size: 12px;
      opacity: 0.6;
      transition: all 0.2s ease;
      cursor: pointer;
      border-radius: 3px;
      border: none;
      background: none;
      color: inherit;
    }

    .scout-floating-button:hover .scout-close-btn {
      opacity: 1;
      background: rgba(255, 255, 255, 0.1);
    }

    .scout-close-btn:hover {
      opacity: 1;
      transform: scale(1.15);
    }

    .scout-floating-button.scout-loading {
      background: rgba(124, 58, 237, 0.25);
      border-color: rgba(124, 58, 237, 0.4);
      color: #a78bfa;
      opacity: 1;
      pointer-events: none;
    }

    .scout-template-switcher {
      display: flex;
      gap: 2px;
      justify-content: center;
      margin-bottom: 0;
      margin-top: 0;
    }

    .scout-template-btn {
      width: 20px;
      height: 20px;
      padding: 0;
      background: rgba(255, 255, 255, 0.08);
      color: rgba(196, 181, 253, 0.8);
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: 10px;
      font-size: 8px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .scout-template-btn:hover {
      background: rgba(124, 58, 237, 0.15);
      border-color: rgba(124, 58, 237, 0.4);
    }

    .scout-template-btn.active {
      background: rgba(124, 58, 237, 0.3);
      color: rgba(196, 181, 253, 1);
      border-color: rgba(124, 58, 237, 0.5);
      box-shadow: 0 0 8px rgba(124, 58, 237, 0.25);
    }
`;

// In-memory cache for chrome.storage values to avoid blocking calls
let cachedSettings = {
  SCOUT_EMAIL: null,
  GAS_URL: null,
  PERSONAL_SHEET_ID: null,
  AUTO_DM_TEMPLATE: null,
  lastUpdate: 0
};

// Singleton widget instance tracking
let widgetInstance = null;

// Track the last profile URL to detect actual profile changes (not just page updates)
let lastProfileUrl = '';
let lastProfileIdentifier = '';

// Cache creator data to clear on profile change
let currentCreatorData = null;
let lastFetchedStatus = null;
let currentStatus = null;

// Prevent async race conditions: invalidate old responses when profile changes
let activeProfileRequestId = 0;

// Speed Optimization: Lightweight refresh queue (300ms debounce, not blocking)
let refreshTimeout = null;
const REFRESH_QUEUE_DEBOUNCE_MS = 300;

// Get existing widget from DOM (singleton check)
function getExistingWidget() {
  return document.querySelector('.scout-floating-button-container');
}

// Ensure only one widget instance exists
function ensureSingletonWidget() {
  const existing = getExistingWidget();
  if (existing) {
    widgetInstance = existing;
    return true;
  }
  return false;
}

// Non-blocking cache loader (runs in background)
async function updateCacheFromStorage() {
  try {
    const stored = await chrome.storage.local.get([
      'SCOUT_EMAIL',
      'GAS_URL',
      'PERSONAL_SHEET_ID',
      'AUTO_DM_TEMPLATE'
    ]);
    cachedSettings = {
      SCOUT_EMAIL: stored.SCOUT_EMAIL || null,
      GAS_URL: stored.GAS_URL || null,
      PERSONAL_SHEET_ID: stored.PERSONAL_SHEET_ID || null,
      AUTO_DM_TEMPLATE: stored.AUTO_DM_TEMPLATE || null,
      lastUpdate: Date.now()
    };
  } catch (error) {
    console.error('Failed to update cache:', error);
  }
}

// Inject styles once at script start (fast)
function injectWidgetStyles() {
  if (document.getElementById('creator-scout-widget-styles')) return;
  const style = document.createElement('style');
  style.id = 'creator-scout-widget-styles';
  style.textContent = WIDGET_STYLES;
  document.head.appendChild(style);
}

// Create and inject the floating widget
function createFloatingWidget(status, message) {
  injectWidgetStyles();

  let existingWidget = document.getElementById('creator-scout-widget-container');
  if (existingWidget) {
    existingWidget.remove();
  }

  const widget = document.createElement('div');
  widget.id = 'creator-scout-widget-container';
  widget.className = 'creator-scout-widget';

  let statusIcon = '●';
  let statusClass = 'badge-new';

  if (status === 'saved') {
    statusIcon = '✓';
    statusClass = 'badge-saved';
  } else if (status === 'reachedout') {
    statusIcon = '📞';
    statusClass = 'badge-reachedout';
  } else if (status === 'negotiating') {
    statusIcon = '💬';
    statusClass = 'badge-negotiating';
  } else if (status === 'lockedin') {
    statusIcon = '🔒';
    statusClass = 'badge-lockedin';
  } else if (status === 'cancelled') {
    statusIcon = '✕';
    statusClass = 'badge-cancelled';
  } else if (status === 'error') {
    statusClass = 'badge-error';
  }

  widget.innerHTML = `
    <div class="scout-badge ${statusClass}">
      <div class="scout-icon">${statusIcon}</div>
      <div class="scout-text">${message}</div>
      <button class="scout-close" title="Close">✕</button>
    </div>
  `;

  const closeBtn = widget.querySelector('.scout-close');
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    widget.remove();
    document.getElementById('scout-widget-popup')?.remove();
  });

  widget.querySelector('.scout-badge').addEventListener('click', () => {
    showWidgetPopup(status, message);
  });

  // Make widget draggable
  makeWidgetDraggable(widget);

  document.body.appendChild(widget);
}

// Create persistent floating Scout button
function createFloatingButton() {
  injectWidgetStyles();

  // Remove any existing button
  const existing = document.getElementById('scout-floating-button-container');
  if (existing) {
    existing.remove();
  }

  const button = document.createElement('div');
  button.id = 'scout-floating-button-container';
  button.className = 'scout-floating-button-container';

  const status = window.__scoutWidgetStatus || 'new';
  button.innerHTML = `
    <button class="scout-floating-button status-${status}" title="Scout Creator">
      <svg class="scout-button-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <span class="scout-button-text">Scout</span>
      <span class="scout-close-btn" title="Close Scout">✕</span>
    </button>
  `;

  // CRITICAL FIX 2 (Part 2): Load saved drag position before adding to DOM with platform awareness
  // On platform change: resets to default (20px top, 20px right)
  // On same platform: restores last saved position
  const currentPlatform = detectCurrentPlatform();
  const lastPlatform = getCurrentStoredPlatform();
  const storageKey = getPositionStorageKey();

  // If platform changed, reset to default position
  if (lastPlatform && lastPlatform !== currentPlatform) {
    console.log(`[Creator Scout] Platform changed from ${lastPlatform} to ${currentPlatform}. Resetting widget to default position.`);
    // Default position is already set in styles, no need to change
    setCurrentPlatform(); // Update to new platform for next comparison
  } else {
    // Same platform or first load - restore saved position if exists
    chrome.storage.local.get([storageKey], (result) => {
      if (result[storageKey]) {
        const { x, y } = result[storageKey];
        button.style.right = 'auto';
        button.style.left = x + 'px';
        button.style.top = y + 'px';
        console.log(`[Creator Scout] Restored widget position for ${currentPlatform}:`, { x, y });
      } else {
        console.log(`[Creator Scout] No saved position for ${currentPlatform}, using default (20px top, 20px right)`);
      }
    });
    // Update to current platform for next comparison
    setCurrentPlatform();
  }

  document.body.appendChild(button);

  const btn = button.querySelector('.scout-floating-button');
  const closeBtn = button.querySelector('.scout-close-btn');

  btn.addEventListener('click', (e) => {
    if (e.target !== closeBtn) {
      togglePopup();
    }
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeFloatingButton();
  });

  // Make floating button draggable
  makeWidgetDraggable(button);
}

// Close and remove floating button
function closeFloatingButton() {
  const container = document.getElementById('scout-floating-button-container');
  if (container) {
    const btn = container.querySelector('.scout-floating-button');
    btn.style.animation = 'slideInRight 0.3s ease-out reverse forwards';
    setTimeout(() => {
      container.remove();
    }, 300);
  }
  const popup = document.getElementById('scout-widget-popup');
  if (popup) {
    popup.remove();
  }
}

// Track last detected platform
let lastDetectedPlatform = null;

// Detect current platform from URL
function detectCurrentPlatform() {
  const url = window.location.href;

  if (url.includes('linkedin.com')) {
    return 'linkedin';
  } else if (url.includes('twitter.com') || url.includes('x.com')) {
    return 'twitter';
  } else if (url.includes('instagram.com')) {
    return 'instagram';
  }

  return 'unknown';
}

// Get platform-specific storage key for widget position
function getPositionStorageKey() {
  const platform = detectCurrentPlatform();
  return `widgetPosition_${platform}`;
}

// Get current platform from session memory
function getCurrentStoredPlatform() {
  return lastDetectedPlatform;
}

// Set current platform in session memory
function setCurrentPlatform() {
  const platform = detectCurrentPlatform();
  lastDetectedPlatform = platform;
  return platform;
}

// Make widget draggable
function makeWidgetDraggable(element) {
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;

  element.addEventListener('mousedown', (e) => {
    // Don't drag if clicking close button or inside popup
    if (e.target.closest('.scout-close') || e.target.closest('.scout-widget-popup')) {
      return;
    }
    isDragging = true;
    initialX = e.clientX - element.offsetLeft;
    initialY = e.clientY - element.offsetTop;
    element.classList.add('dragging');
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;
    element.style.right = 'auto';
    element.style.left = currentX + 'px';
    element.style.top = currentY + 'px';
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    element.classList.remove('dragging');

    // CRITICAL FIX 2: Save drag position to persistent storage with platform awareness
    // Position is saved per-platform, so switching platforms resets to default
    if (currentX !== undefined && currentY !== undefined) {
      const storageKey = getPositionStorageKey();
      chrome.storage.local.set({
        [storageKey]: {
          x: currentX,
          y: currentY
        }
      });
      console.log(`[Creator Scout] Saved widget position for ${detectCurrentPlatform()}:`, { x: currentX, y: currentY });
    }
  });
}

// Update floating button status dynamically
function updateButtonStatus(status) {
  const btn = document.querySelector('.scout-floating-button');
  if (!btn) return;

  btn.classList.remove('status-new', 'status-saved', 'status-error', 'status-reachedout', 'status-negotiating', 'status-lockedin', 'status-cancelled', 'status-loading');
  btn.classList.add(`status-${status}`);
  window.__scoutWidgetStatus = status;

  const titleText = status === 'saved' ? 'Creator Already Saved' : 'Scout Creator';
  btn.title = titleText;
}

// Toggle popup open/closed
function togglePopup() {
  let popup = document.getElementById('scout-widget-popup');

  if (popup) {
    popup.classList.remove('scout-popup-open');
    setTimeout(() => {
      popup.remove();
    }, 200);
  } else {
    const status = window.__scoutWidgetStatus || 'new';
    const message = status === 'saved' ? 'Already Saved' : 'New Creator';
    showWidgetPopup(status, message);
  }
}

// Show popup with more details
function showWidgetPopup(status, message) {
  let popup = document.getElementById('scout-widget-popup');
  if (popup) {
    popup.classList.remove('scout-popup-open');
    setTimeout(() => popup.remove(), 200);
    return;
  }

  popup = document.createElement('div');
  popup.id = 'scout-widget-popup';

  // Determine popup color class based on status
  let popupColorClass = '';
  if (status === 'saved') popupColorClass = 'popup-saved';
  else if (status === 'reachedout') popupColorClass = 'popup-reachedout';
  else if (status === 'negotiating') popupColorClass = 'popup-negotiating';
  else if (status === 'lockedin') popupColorClass = 'popup-lockedin';
  else if (status === 'cancelled') popupColorClass = 'popup-cancelled';

  popup.className = `scout-widget-popup scout-popup-open ${popupColorClass}`;

  // Calculate popup position based on scout button location
  const scoutButton = document.querySelector('.scout-floating-button-container');
  let popupTop = 70;
  let popupRight = 20;
  if (scoutButton) {
    popupTop = scoutButton.offsetTop + scoutButton.offsetHeight + 10;
    popupRight = window.innerWidth - scoutButton.offsetLeft - scoutButton.offsetWidth + 20;
  }

  // Load activeTemplate to render correct button as active
  chrome.storage.local.get('activeTemplate', (result) => {
    const activeTemplate = result.activeTemplate || 'template1';

    popup.innerHTML = `
      <div class="scout-popup-header">
        <div class="scout-popup-title">Creator Scout</div>
        <button class="scout-popup-close">✕</button>
      </div>
      <div class="scout-workflow-buttons" id="scout-workflow-buttons">
        <!-- Dynamically populated based on current status -->
      </div>
      <div class="scout-popup-actions">
        <button class="scout-action-btn scout-dm-btn">
          Copy Message
        </button>
      </div>
      <div class="scout-template-switcher">
        <button type="button" class="scout-template-btn ${activeTemplate === 'template1' ? 'active' : ''}" data-template="template1" title="Template 1"><span class="scout-template-label">1</span></button>
        <button type="button" class="scout-template-btn ${activeTemplate === 'template2' ? 'active' : ''}" data-template="template2" title="Template 2"><span class="scout-template-label">2</span></button>
        <button type="button" class="scout-template-btn ${activeTemplate === 'template3' ? 'active' : ''}" data-template="template3" title="Template 3"><span class="scout-template-label">3</span></button>
      </div>
    `;

    // Load and display template names
    chrome.storage.local.get('templateNames', (result) => {
      const templateNames = result.templateNames || {
        template1: '1',
        template2: '2',
        template3: '3'
      };

      popup.querySelectorAll('.scout-template-btn').forEach((btn) => {
        const templateId = btn.dataset.template;
        const label = btn.querySelector('.scout-template-label');
        if (label) {
          label.textContent = templateNames[templateId] || templateId.replace('template', '');
        }
      });
    });

    popup.querySelector('.scout-popup-close').addEventListener('click', () => {
      popup.classList.remove('scout-popup-open');
      setTimeout(() => popup.remove(), 200);
    });

    // Setup progressive workflow buttons
    const workflowSequence = ['new', 'saved', 'reachedout', 'negotiating', 'lockedin'];
    const statusLabels = {
      'saved': 'Save',
      'reachedout': 'Reached Out',
      'negotiating': 'Negotiating',
      'lockedin': 'Locked In'
    };

    const renderWorkflowButtons = (currentStatus) => {
      const buttonsContainer = popup.querySelector('#scout-workflow-buttons');
      buttonsContainer.innerHTML = '';

      const currentIndex = workflowSequence.indexOf(currentStatus);
      console.log('[WORKFLOW] Rendering buttons for status:', currentStatus, 'index:', currentIndex);

      // Determine which buttons to show
      if (currentIndex < 3) {
        // Show current and next buttons (new, saved, reachedout)
        const nextIndex = currentIndex + 1;
        const nextStatus = workflowSequence[nextIndex];

        // Current button (enabled)
        const currentBtn = document.createElement('button');
        currentBtn.className = 'scout-workflow-btn current';
        currentBtn.textContent = statusLabels[nextStatus] || 'Next';
        currentBtn.dataset.status = nextStatus;
        currentBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          await handleSaveCreator(nextStatus);
        });
        buttonsContainer.appendChild(currentBtn);

        // Next button (not clickable but visible)
        const followingStatus = workflowSequence[nextIndex + 1];
        const nextBtn = document.createElement('button');
        nextBtn.className = 'scout-workflow-btn next';
        nextBtn.textContent = statusLabels[followingStatus] || 'Following';
        nextBtn.style.pointerEvents = 'none';
        nextBtn.style.opacity = '0.7';
        buttonsContainer.appendChild(nextBtn);
      } else if (currentIndex === 3) {
        // After Negotiating: show "Locked In" and "Delete" buttons, both enabled
        const lockedInBtn = document.createElement('button');
        lockedInBtn.className = 'scout-workflow-btn current';
        lockedInBtn.textContent = 'Locked In';
        lockedInBtn.dataset.status = 'lockedin';
        lockedInBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          await handleSaveCreator('lockedin');
        });
        buttonsContainer.appendChild(lockedInBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'scout-workflow-btn delete';
        deleteBtn.textContent = 'Delete Creator';
        deleteBtn.addEventListener('click', (e) => {
          e.preventDefault();
          showDeleteConfirmation();
        });
        buttonsContainer.appendChild(deleteBtn);
      } else if (currentIndex === 4) {
        // After Locked In: show Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'scout-workflow-btn delete';
        deleteBtn.textContent = 'Delete Creator';
        deleteBtn.addEventListener('click', (e) => {
          e.preventDefault();
          showDeleteConfirmation();
        });
        buttonsContainer.appendChild(deleteBtn);
      }
    };

    const showDeleteConfirmation = () => {
      const buttonsContainer = popup.querySelector('#scout-workflow-buttons');
      const originalHTML = buttonsContainer.innerHTML;

      buttonsContainer.innerHTML = `
        <div class="scout-delete-confirm">
          <div class="scout-delete-title">Delete this creator?</div>
          <div class="scout-delete-message">This action cannot be undone.</div>
          <div class="scout-delete-buttons">
            <button class="scout-delete-confirm-btn" id="scout-delete-confirm">Delete</button>
            <button class="scout-delete-cancel-btn" id="scout-delete-cancel">Cancel</button>
          </div>
        </div>
      `;

      popup.querySelector('#scout-delete-confirm').addEventListener('click', async (e) => {
        e.preventDefault();
        await handleDeleteCreator();
      });

      popup.querySelector('#scout-delete-cancel').addEventListener('click', (e) => {
        e.preventDefault();
        buttonsContainer.innerHTML = originalHTML;
        renderWorkflowButtons(status);
      });
    };

    const handleDeleteCreator = async () => {
      try {
        if (!currentCreatorData || !currentCreatorData.profile_url) {
          showSaveMessage('Creator data not found', 'error');
          return;
        }

        const profileUrl = currentCreatorData.profile_url;
        console.log('[DELETE-POPUP] Deleting:', profileUrl);

        // OPTIMISTIC UPDATE: Update UI immediately
        console.log('[DELETE-POPUP] Updating UI optimistically...');
        const buttonsContainer = popup.querySelector('#scout-workflow-buttons');
        buttonsContainer.innerHTML = `
          <div class="scout-delete-success">
            ✓ Creator deleted successfully
          </div>
        `;

        // Disable interactions during success state
        popup.style.pointerEvents = 'none';
        popup.style.opacity = '0.9';

        // Clear from local cache immediately (both status and notes)
        chrome.storage.local.get(['CREATOR_STATUS_CACHE', 'CREATOR_NOTES_CACHE'], (result) => {
          const statusCache = result.CREATOR_STATUS_CACHE || {};
          const notesCache = result.CREATOR_NOTES_CACHE || {};
          delete statusCache[profileUrl];
          delete notesCache[profileUrl];
          chrome.storage.local.set({
            CREATOR_STATUS_CACHE: statusCache,
            CREATOR_NOTES_CACHE: notesCache
          });
          console.log('[DELETE-POPUP] Local cache cleared (status + notes)');
        });

        // Update state immediately
        currentCreatorData = null;
        currentStatus = 'new';

        // Close widget immediately
        setTimeout(() => {
          popup.classList.remove('scout-popup-open');
          setTimeout(() => popup.remove(), 200);
          updateButtonStatus('new');
          closeFloatingButton();
          console.log('[DELETE-POPUP] Widget closed');
        }, 800);

        // BACKGROUND: Perform the actual GAS deletion asynchronously (non-blocking)
        const stored = await new Promise(resolve => {
          chrome.storage.local.get(['SCOUT_EMAIL', 'PERSONAL_SHEET_ID'], resolve);
        });

        console.log('[DELETE-POPUP] Syncing deletion to GAS in background...');
        chrome.runtime.sendMessage(
          {
            action: 'deleteCreator',
            email: stored.SCOUT_EMAIL,
            profile_url: profileUrl,
            personalSheetId: stored.PERSONAL_SHEET_ID
          },
          (response) => {
            console.log('[DELETE-POPUP] GAS response:', response);
            if (response && response.error) {
              console.error('[DELETE-POPUP] GAS error (background):', response.error);
            } else {
              console.log('[DELETE-POPUP] GAS deletion completed');
            }
          }
        );

      } catch (error) {
        console.error('[DELETE-POPUP] Error:', error);
        // Re-enable interactions on error
        popup.style.pointerEvents = 'auto';
        popup.style.opacity = '1';
        const buttonsContainer = popup.querySelector('#scout-workflow-buttons');
        buttonsContainer.innerHTML = originalHTML;
        renderWorkflowButtons(status);
        showSaveMessage('Error deleting creator', 'error');
      }
    };

    // Initialize workflow and notes
    renderWorkflowButtons(status);
    renderCompactNotes();

    popup.querySelector('.scout-dm-btn').addEventListener('click', async () => {
      await handleSendDM();
    });

    // Setup template switcher buttons
    popup.querySelectorAll('.scout-template-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const templateId = e.target.dataset.template;

        // Update active state ONLY for this widget session (do NOT save to storage)
        popup.querySelectorAll('.scout-template-btn').forEach(b => {
          b.classList.remove('active');
        });
        e.target.classList.add('active');

        // Update global active template for this session only
        window.__dmTemplates = window.__dmTemplates || {};
        window.__dmTemplates.activeTemplate = templateId;
        // NOTE: Intentionally NOT saving to storage - only affects this widget session

        // Just change template, don't auto-copy
        // User will click "Copy Message" button to copy
      });
    });
  });

  // Apply calculated position
  popup.style.top = popupTop + 'px';
  popup.style.right = popupRight + 'px';
  popup.style.left = 'auto';

  document.body.appendChild(popup);

  // LOCK-IN PRICE: Auto-show saved price if status is lockedin
  if (status === 'lockedin') {
    setTimeout(() => {
      showLockInPriceSectionForExistingCreator();
    }, 100);
  }
}

// Render inline notes section (original UI from video)
async function renderCompactNotes() {
  const popup = document.getElementById('scout-widget-popup');
  if (!popup || !currentCreatorData || !currentCreatorData.profile_url) {
    console.log('[NOTES] renderCompactNotes: missing popup or creator data');
    return;
  }

  // Get existing notes
  let notesToDisplay = '';
  if (currentCreatorData.gasNotes) {
    notesToDisplay = currentCreatorData.gasNotes;
  } else {
    const stored = await new Promise(resolve => {
      chrome.storage.local.get(['CREATOR_NOTES_CACHE'], resolve);
    });
    const notesCache = stored.CREATOR_NOTES_CACHE || {};
    notesToDisplay = notesCache[currentCreatorData.profile_url] || '';
  }

  // Remove any existing notes section
  const existingNotes = popup.querySelector('.scout-notes-section');
  if (existingNotes) existingNotes.remove();

  const section = document.createElement('div');
  section.className = 'scout-notes-section';
  section.innerHTML = `
    <div style="margin-top: 8px; padding-top: 8px;">
      <label style="font-size: 9px; font-weight: 600; color: rgba(255, 255, 255, 0.75); display: block; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.3px;">Notes</label>
      <div style="display: flex; gap: 6px; align-items: center;">
        <input type="text" class="scout-notes-input" placeholder="Add note..." value="${notesToDisplay}" style="flex: 1; padding: 6px 8px; border: 1px solid rgba(124, 58, 237, 0.25); border-radius: 8px; font-size: 9px; background: rgba(255, 255, 255, 0.08); color: #ffffff; font-family: inherit;" autocomplete="off">
        <button class="scout-notes-save-btn" style="padding: 4px 8px; background: #22c55e; color: white; border: none; border-radius: 14px; font-size: 8px; font-weight: 700; cursor: pointer; flex-shrink: 0;">✓</button>
      </div>
    </div>
  `;
  popup.appendChild(section);

  const input = section.querySelector('.scout-notes-input');
  const saveBtn = section.querySelector('.scout-notes-save-btn');

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveBtn.click();
  });

  saveBtn.addEventListener('click', async () => {
    const note = input.value.trim();
    await handleNoteSave(note);
  });
}

// Save note using EXACT SAME flow as Price (direct fetch to GAS)
async function handleNoteSave(noteText) {
  try {
    if (!currentCreatorData || !currentCreatorData.profile_url) {
      throw new Error('Creator data not loaded');
    }

    // PERFORMANCE: Optimistic UI update - show saved state immediately (like Price)
    const section = document.querySelector('.scout-notes-section');
    if (section) {
      section.remove();
    }
    showLockInNoteDisplay(noteText);
    showSaveMessage('✓ Note saved', 'success');

    const stored = await new Promise(resolve => {
      chrome.storage.local.get(['SCOUT_EMAIL', 'PERSONAL_SHEET_ID'], resolve);
    });

    if (!stored.SCOUT_EMAIL) {
      throw new Error('Configuration not loaded');
    }

    // Save to GAS in background (same pattern as Price) - direct fetch, not message passing
    const url = new URL(cachedSettings.GAS_URL);
    url.searchParams.append('action', 'updateNotes');
    url.searchParams.append('email', stored.SCOUT_EMAIL);
    url.searchParams.append('profile_url', currentCreatorData.profile_url);
    url.searchParams.append('notes', noteText);

    if (stored.PERSONAL_SHEET_ID) {
      url.searchParams.append('personal_sheet_id', stored.PERSONAL_SHEET_ID);
    }

    const response = await fetch(url.toString());
    const result = await response.json();

    if (result.success || result.status === 'success') {
      // Cache note client-side (same as Price)
      chrome.storage.local.get(['CREATOR_NOTES_CACHE'], (res) => {
        const cachedNotes = res.CREATOR_NOTES_CACHE || {};
        cachedNotes[currentCreatorData.profile_url] = noteText;
        chrome.storage.local.set({ CREATOR_NOTES_CACHE: cachedNotes });
      });
    } else {
      throw new Error(result.error || 'Failed to save note');
    }
  } catch (error) {
    console.error('Error saving note:', error);
    showSaveMessage('Error saving note: ' + error.message, 'error');
  }
}

// Show note in saved state (EXACTLY like Price display)
function showLockInNoteDisplay(note) {
  const popup = document.getElementById('scout-widget-popup');
  if (!popup) return;

  const section = document.createElement('div');
  section.className = 'scout-notes-section';
  section.innerHTML = `
    <div style="margin-top: 8px; padding-top: 8px;">
      <label style="font-size: 9px; font-weight: 600; color: rgba(255, 255, 255, 0.75); display: block; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.3px;">Notes</label>
      <div style="margin-top: 6px; padding: 5px 8px; background: rgba(34, 197, 94, 0.15); border-radius: 10px; border: 1px solid rgba(34, 197, 94, 0.3); display: flex; align-items: center; gap: 5px;">
        <div style="font-size: 9px; font-weight: 600; color: #4ade80; margin: 0; flex: 1;">✓ ${note}</div>
        <button class="scout-notes-edit-btn" style="font-size: 9px; color: #a78bfa; background: none; border: none; cursor: pointer; padding: 0; margin: 0; flex-shrink: 0;" title="Edit">✏️</button>
      </div>
    </div>
  `;

  popup.appendChild(section);

  const editBtn = section.querySelector('.scout-notes-edit-btn');
  editBtn.addEventListener('click', () => {
    section.remove();
    renderCompactNotes();
  });
}

// Get button label text
function getButtonLabel(status) {
  const labels = { 'saved': 'Save', 'reachedout': 'Reached', 'negotiating': 'Negotiate', 'lockedin': 'Lock', 'cancelled': 'Cancel' };
  return labels[status] || status;
}

// Get status message
function getStatusMessage(status) {
  const messages = { 'saved': 'Shortlisted', 'reachedout': 'Reached Out', 'negotiating': 'Negotiating', 'lockedin': 'Locked In', 'cancelled': 'Cancelled' };
  return messages[status] || status;
}

// Helper: Re-render workflow buttons after status change
function updateWorkflowUI(newStatus) {
  const popup = document.getElementById('scout-widget-popup');
  if (!popup) return;

  const workflowSequence = ['new', 'saved', 'reachedout', 'negotiating', 'lockedin'];
  const statusLabels = {
    'saved': 'Save',
    'reachedout': 'Reached Out',
    'negotiating': 'Negotiating',
    'lockedin': 'Locked In'
  };

  const buttonsContainer = popup.querySelector('#scout-workflow-buttons');
  if (!buttonsContainer) return;

  const currentIndex = workflowSequence.indexOf(newStatus);
  buttonsContainer.innerHTML = '';

  if (currentIndex < 4) {
    const nextIndex = currentIndex + 1;
    const nextStatus = workflowSequence[nextIndex];

    const currentBtn = document.createElement('button');
    currentBtn.className = 'scout-workflow-btn current';
    currentBtn.textContent = statusLabels[nextStatus] || 'Next';
    currentBtn.dataset.status = nextStatus;
    currentBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await handleSaveCreator(nextStatus);
    });
    buttonsContainer.appendChild(currentBtn);

    if (nextIndex < 4) {
      const followingStatus = workflowSequence[nextIndex + 1];
      const nextBtn = document.createElement('button');
      nextBtn.className = 'scout-workflow-btn next';
      nextBtn.textContent = statusLabels[followingStatus] || 'Following';
      nextBtn.disabled = true;
      buttonsContainer.appendChild(nextBtn);
    }
  } else if (currentIndex === 4) {
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'scout-workflow-btn delete';
    deleteBtn.textContent = 'Delete Creator';
    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showDeleteConfirmationGlobal();
    });
    buttonsContainer.appendChild(deleteBtn);
  }
}

// Global delete confirmation function
function showDeleteConfirmationGlobal() {
  const popup = document.getElementById('scout-widget-popup');
  if (!popup) return;

  const buttonsContainer = popup.querySelector('#scout-workflow-buttons');
  const originalHTML = buttonsContainer.innerHTML;

  buttonsContainer.innerHTML = `
    <div class="scout-delete-confirm">
      <div class="scout-delete-title">Delete this creator?</div>
      <div class="scout-delete-message">This action cannot be undone.</div>
      <div class="scout-delete-buttons">
        <button class="scout-delete-confirm-btn" id="scout-delete-confirm">Delete</button>
        <button class="scout-delete-cancel-btn" id="scout-delete-cancel">Cancel</button>
      </div>
    </div>
  `;

  popup.querySelector('#scout-delete-confirm').addEventListener('click', async (e) => {
    e.preventDefault();
    await handleDeleteCreatorGlobal();
  });

  popup.querySelector('#scout-delete-cancel').addEventListener('click', (e) => {
    e.preventDefault();
    buttonsContainer.innerHTML = originalHTML;
  });
}

// Global delete handler - OPTIMISTIC UI UPDATES
async function handleDeleteCreatorGlobal() {
  try {
    if (!currentCreatorData || !currentCreatorData.profile_url) {
      showSaveMessage('Creator data not found', 'error');
      return;
    }

    const profileUrl = currentCreatorData.profile_url;
    console.log('[DELETE] Starting delete for:', profileUrl);

    // OPTIMISTIC UPDATE: Update UI immediately before waiting for GAS
    console.log('[DELETE] Updating UI optimistically...');
    showSaveMessage('✓ Creator deleted', 'success');
    currentCreatorData = null;
    currentStatus = 'new';

    // Clear from local cache immediately (both status and notes)
    chrome.storage.local.get(['CREATOR_STATUS_CACHE', 'CREATOR_NOTES_CACHE'], (result) => {
      const statusCache = result.CREATOR_STATUS_CACHE || {};
      const notesCache = result.CREATOR_NOTES_CACHE || {};
      delete statusCache[profileUrl];
      delete notesCache[profileUrl];
      chrome.storage.local.set({
        CREATOR_STATUS_CACHE: statusCache,
        CREATOR_NOTES_CACHE: notesCache
      });
      console.log('[DELETE] Local cache cleared (status + notes)');
    });

    // Close the widget immediately for visual feedback
    setTimeout(() => {
      closeFloatingButton();
      console.log('[DELETE] Widget closed');
    }, 200);

    // BACKGROUND: Perform the actual GAS deletion asynchronously (non-blocking)
    const stored = await new Promise(resolve => {
      chrome.storage.local.get(['SCOUT_EMAIL', 'PERSONAL_SHEET_ID'], resolve);
    });

    console.log('[DELETE] Syncing deletion to GAS in background...');
    chrome.runtime.sendMessage(
      {
        action: 'deleteCreator',
        email: stored.SCOUT_EMAIL,
        profile_url: profileUrl,
        personalSheetId: stored.PERSONAL_SHEET_ID
      },
      (response) => {
        console.log('[DELETE] GAS response:', response);
        if (response && response.error) {
          console.error('[DELETE] GAS error (background):', response.error);
        } else {
          console.log('[DELETE] GAS deletion completed successfully');
        }
      }
    );

  } catch (error) {
    console.error('[DELETE] Error:', error);
    showSaveMessage('Error deleting creator', 'error');
  }
}

// Handle save creator with multi-status support
async function handleSaveCreator(status = 'saved') {
  // PERFORMANCE: Optimistic UI update - update workflow immediately
  updateWorkflowUI(status);

  try {
    let stored;
    try {
      stored = await chrome.storage.local.get([
        'SCOUT_EMAIL',
        'GAS_URL',
        'PERSONAL_SHEET_ID'
      ]);
    } catch (error) {
      // Handle context invalidation
      if (error.message && (error.message.includes('context invalidated') || error.message.includes('port closed'))) {
        console.error('Extension context invalidated - refresh page to continue');
        showSaveMessage('Extension disconnected - refresh page', 'error');
        return;
      }
      throw error;
    }

    if (!currentCreatorData) {
      throw new Error('Creator data not loaded');
    }

    const url = new URL(stored.GAS_URL);
    const isNewCreator = currentStatus === 'new';
    const action = isNewCreator ? 'saveCreator' : 'updateCreatorStatus';
    const actionType = isNewCreator ? 'saving' : 'updating';

    url.searchParams.append('action', action);
    url.searchParams.append('email', stored.SCOUT_EMAIL);
    url.searchParams.append('personal_sheet_id', stored.PERSONAL_SHEET_ID);

    if (isNewCreator) {
      // For new creators: use saveCreator action
      url.searchParams.append('initial_status', status);
      url.searchParams.append('data', JSON.stringify(currentCreatorData));
    } else {
      // For existing creators: use updateCreatorStatus action
      url.searchParams.append('profile_url', currentCreatorData.profile_url);
      url.searchParams.append('new_status', status);
    }

    // TAT OPTIMIZATION: Update UI immediately (optimistic), sync with GAS in background
    // User sees instant feedback, GAS verification happens asynchronously
    updateButtonStatus(status);

    // Update popup color class to match new status
    const popup = document.getElementById('scout-widget-popup');
    if (popup) {
      popup.classList.remove('popup-saved', 'popup-reachedout', 'popup-negotiating', 'popup-lockedin', 'popup-cancelled');
      if (status === 'saved') popup.classList.add('popup-saved');
      else if (status === 'reachedout') popup.classList.add('popup-reachedout');
      else if (status === 'negotiating') popup.classList.add('popup-negotiating');
      else if (status === 'lockedin') popup.classList.add('popup-lockedin');
      else if (status === 'cancelled') popup.classList.add('popup-cancelled');
    }

    // Update badge color class to match new status
    const badge = document.querySelector('.creator-scout-widget .scout-badge');
    if (badge) {
      badge.classList.remove('badge-saved', 'badge-reachedout', 'badge-negotiating', 'badge-lockedin', 'badge-cancelled', 'badge-new', 'badge-error');
      if (status === 'saved') badge.classList.add('badge-saved');
      else if (status === 'reachedout') badge.classList.add('badge-reachedout');
      else if (status === 'negotiating') badge.classList.add('badge-negotiating');
      else if (status === 'lockedin') badge.classList.add('badge-lockedin');
      else if (status === 'cancelled') badge.classList.add('badge-cancelled');
    }

    // Update segment display with new status
    const segmentGroup = document.querySelector('#scout-status-segment-group');
    if (segmentGroup) {
      segmentGroup.querySelectorAll('.scout-status-segment').forEach(segment => {
        segment.classList.remove('active');
        if (segment.getAttribute('data-status') === status) {
          segment.classList.add('active');
        }
      });
    }

    // Sync local runtime state immediately
    currentStatus = status;
    if (currentCreatorData) {
      currentCreatorData.status = status;
    }

    // Persist to cache immediately
    if (currentCreatorData && currentCreatorData.profile_url) {
      chrome.storage.local.get(['CREATOR_STATUS_CACHE'], (result) => {
        const cachedStatus = result.CREATOR_STATUS_CACHE || {};
        cachedStatus[currentCreatorData.profile_url] = status;
        chrome.storage.local.set({ CREATOR_STATUS_CACHE: cachedStatus });
      });
    }

    showCompactStatusText(`✓ ${getStatusMessage(status)}`, 'success');

    // Show lock-in price section immediately if locked
    if (status === 'lockedin') {
      showLockInPriceSection();
    }

    // TAT OPTIMIZATION: Fire GAS sync in background, don't wait for response
    // Verify result asynchronously, show error only if sync fails
    fetch(url.toString())
      .then(response => response.json())
      .then(result => {
        if (!result.success && result.status !== 'success') {
          throw new Error(result.error || 'Save failed');
        }
        console.log(`[Creator Scout] ${actionType} confirmed by GAS`);
      })
      .catch(error => {
        console.error(`Error ${actionType} creator:`, error);
        showCompactStatusText(`✗ Error: ${error.message}`, 'error');

        // Revert optimistic update on GAS error
        const lastStatus = currentStatus || 'new';
        updateWorkflowUI(lastStatus);
      });
  } catch (error) {
    console.error(`Error ${actionType} creator:`, error);
    showCompactStatusText(`✗ Error: ${error.message}`, 'error');

    // PERFORMANCE: Revert optimistic update on error
    const lastStatus = currentStatus || 'new';
    updateWorkflowUI(lastStatus);
  }
}

// Show lock-in price input section (called after Lock button click)
function showLockInPriceSection() {
  const popup = document.getElementById('scout-widget-popup');
  if (!popup) return;

  // Load cached price if exists
  chrome.storage.local.get(['CREATOR_LOCK_IN_PRICE_CACHE'], (result) => {
    const cachedPrices = result.CREATOR_LOCK_IN_PRICE_CACHE || {};
    const profileKey = currentCreatorData?.profile_url;
    const existingPrice = cachedPrices[profileKey];

    // Remove any existing price section
    const existingSection = popup.querySelector('.scout-lock-price-section');
    if (existingSection) {
      existingSection.remove();
    }

    if (existingPrice) {
      // Show existing price with edit button
      showLockInPriceDisplay(existingPrice);
    } else {
      // Show price input
      showLockInPriceInput();
    }
  });
}

// Show lock-in price for existing locked creator (called when widget opens)
function showLockInPriceSectionForExistingCreator() {
  const popup = document.getElementById('scout-widget-popup');
  if (!popup) return;

  // Load cached price if exists
  chrome.storage.local.get(['CREATOR_LOCK_IN_PRICE_CACHE'], (result) => {
    const cachedPrices = result.CREATOR_LOCK_IN_PRICE_CACHE || {};
    const profileKey = currentCreatorData?.profile_url;
    const existingPrice = cachedPrices[profileKey];

    // Remove any existing price section (shouldn't be there yet)
    const existingSection = popup.querySelector('.scout-lock-price-section');
    if (existingSection) {
      existingSection.remove();
    }

    if (existingPrice) {
      // Show existing price with edit button
      showLockInPriceDisplay(existingPrice);
    } else {
      // Show "Add lock-in price" if no price saved yet
      showAddLockInPriceSection();
    }
  });
}

// Show "Add lock-in price" section when locked but no price exists
function showAddLockInPriceSection() {
  const popup = document.getElementById('scout-widget-popup');
  if (!popup) return;

  const section = document.createElement('div');
  section.className = 'scout-lock-price-section';
  section.innerHTML = `
    <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.08);">
      <button class="scout-add-price-btn" style="font-size: 9px; color: #a78bfa; background: none; border: none; cursor: pointer; text-decoration: underline; padding: 0; font-weight: 600;">+ Add lock-in price</button>
    </div>
  `;

  popup.appendChild(section);

  const addBtn = section.querySelector('.scout-add-price-btn');
  addBtn.addEventListener('click', () => {
    section.remove();
    showLockInPriceInput();
  });
}

// Show lock-in price input
function showLockInPriceInput() {
  const popup = document.getElementById('scout-widget-popup');
  if (!popup) return;

  const section = document.createElement('div');
  section.className = 'scout-lock-price-section';
  section.innerHTML = `
    <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.08);">
      <label style="font-size: 9px; font-weight: 600; color: rgba(255,255,255,0.75); display: block; margin-bottom: 4px;">PRICE</label>
      <div style="display: flex; gap: 4px; align-items: center;">
        <input type="text" class="scout-price-input" placeholder="$" style="flex: 1; padding: 4px 6px; border: 1px solid rgba(124, 58, 237, 0.25); border-radius: 8px; font-size: 9px; background: rgba(255,255,255,0.08); color: #ffffff;" autocomplete="off">
        <button class="scout-price-save-btn" style="padding: 4px 8px; background: #22c55e; color: white; border: none; border-radius: 14px; font-size: 8px; font-weight: 700; cursor: pointer; flex-shrink: 0;">✓</button>
      </div>
    </div>
  `;

  popup.appendChild(section);

  const input = section.querySelector('.scout-price-input');
  const saveBtn = section.querySelector('.scout-price-save-btn');

  saveBtn.addEventListener('click', async () => {
    const price = input.value.trim();
    if (!price) {
      showSaveMessage('Enter a price', 'error');
      return;
    }
    await handleLockInPriceSave(price);
  });

  input.focus();
}

// Show lock-in price display
function showLockInPriceDisplay(price) {
  const popup = document.getElementById('scout-widget-popup');
  if (!popup) return;

  const section = document.createElement('div');
  section.className = 'scout-lock-price-section';
  section.innerHTML = `
    <div style="margin-top: 6px; padding: 5px 8px; background: rgba(34, 197, 94, 0.15); border-radius: 10px; border: 1px solid rgba(34, 197, 94, 0.3); display: flex; align-items: center; gap: 5px;">
      <div style="font-size: 9px; font-weight: 600; color: #4ade80; margin: 0; flex: 1;">✓ ${price}</div>
      <button class="scout-price-edit-btn" style="font-size: 9px; color: #a78bfa; background: none; border: none; cursor: pointer; padding: 0; margin: 0; flex-shrink: 0;" title="Edit">✏️</button>
    </div>
  `;

  popup.appendChild(section);

  const editBtn = section.querySelector('.scout-price-edit-btn');
  editBtn.addEventListener('click', () => {
    section.remove();
    showLockInPriceInputWithValue(price);
  });
}

// Show price input with existing value
function showLockInPriceInputWithValue(currentPrice) {
  const popup = document.getElementById('scout-widget-popup');
  if (!popup) return;

  const section = document.createElement('div');
  section.className = 'scout-lock-price-section';
  section.innerHTML = `
    <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.08);">
      <label style="font-size: 9px; font-weight: 600; color: rgba(255,255,255,0.75); display: block; margin-bottom: 4px;">PRICE</label>
      <div style="display: flex; gap: 4px; align-items: center;">
        <input type="text" class="scout-price-input" placeholder="$" value="${currentPrice}" style="flex: 1; padding: 4px 6px; border: 1px solid rgba(124, 58, 237, 0.25); border-radius: 8px; font-size: 9px; background: rgba(255,255,255,0.08); color: #ffffff;" autocomplete="off">
        <button class="scout-price-save-btn" style="padding: 4px 8px; background: #22c55e; color: white; border: none; border-radius: 14px; font-size: 8px; font-weight: 700; cursor: pointer; flex-shrink: 0;">✓</button>
      </div>
    </div>
  `;

  popup.appendChild(section);

  const input = section.querySelector('.scout-price-input');
  const saveBtn = section.querySelector('.scout-price-save-btn');

  saveBtn.addEventListener('click', async () => {
    const price = input.value.trim();
    if (!price) {
      showSaveMessage('Please enter a price', 'error');
      return;
    }
    await handleLockInPriceSave(price);
  });

  input.focus();
  input.select();
}

// Handle lock-in price save
async function handleLockInPriceSave(price) {
  try {
    if (!currentCreatorData || !currentCreatorData.profile_url) {
      throw new Error('Creator data not loaded');
    }

    // PERFORMANCE: Optimistic UI update - show price immediately
    const section = document.querySelector('.scout-lock-price-section');
    if (section) {
      section.remove();
    }
    showLockInPriceDisplay(price);
    showSaveMessage('✓ Price saved', 'success');

    const stored = await new Promise(resolve => {
      chrome.storage.local.get(['SCOUT_EMAIL', 'PERSONAL_SHEET_ID'], resolve);
    });

    if (!stored.SCOUT_EMAIL || !stored.PERSONAL_SHEET_ID) {
      throw new Error('Configuration not loaded');
    }

    // Save to GAS in background (don't block UI)
    const url = new URL(cachedSettings.GAS_URL);
    url.searchParams.append('action', 'lockInPrice');
    url.searchParams.append('email', stored.SCOUT_EMAIL);
    url.searchParams.append('profile_url', currentCreatorData.profile_url);
    url.searchParams.append('price', price);
    url.searchParams.append('personal_sheet_id', stored.PERSONAL_SHEET_ID);

    const response = await fetch(url.toString());
    const result = await response.json();

    if (result.success || result.status === 'success') {
      // Cache price client-side
      chrome.storage.local.get(['CREATOR_LOCK_IN_PRICE_CACHE'], (res) => {
        const cachedPrices = res.CREATOR_LOCK_IN_PRICE_CACHE || {};
        cachedPrices[currentCreatorData.profile_url] = price;
        chrome.storage.local.set({ CREATOR_LOCK_IN_PRICE_CACHE: cachedPrices });
      });
    } else {
      throw new Error(result.error || 'Failed to save price');
    }
  } catch (error) {
    console.error('Error saving lock-in price:', error);
    // Only show error if it wasn't already displayed optimistically
    if (!document.querySelector('.scout-save-message')) {
      showSaveMessage('Error saving price: ' + error.message, 'error');
    }
  }
}

// Handle send DM
async function handleSendDM() {
  try {
    let stored;
    try {
      stored = await chrome.storage.local.get([
        'autoDmTemplate1',
        'autoDmTemplate2',
        'autoDmTemplate3',
        'activeTemplate'
      ]);
    } catch (error) {
      // Handle context invalidation
      if (error.message && (error.message.includes('context invalidated') || error.message.includes('port closed'))) {
        console.error('Extension context invalidated - refresh page to continue');
        showSaveMessage('Extension disconnected - refresh page', 'error');
        return;
      }
      throw error;
    }

    if (!currentCreatorData) {
      throw new Error('Creator data not loaded');
    }

    // Get the active template (default to template1)
    const activeTemplate = stored.activeTemplate || 'template1';
    let template = 'Hi {{creator_name}}! Hope you are doing well.\n\nWe really liked your profile and would love to collaborate with you.';

    // Load the selected template
    if (activeTemplate === 'template1' && stored.autoDmTemplate1) {
      template = stored.autoDmTemplate1;
    } else if (activeTemplate === 'template2' && stored.autoDmTemplate2) {
      template = stored.autoDmTemplate2;
    } else if (activeTemplate === 'template3' && stored.autoDmTemplate3) {
      template = stored.autoDmTemplate3;
    }

    const message = template.replace('{{creator_name}}', currentCreatorData.creator_name || currentCreatorData.username);

    // Log which name source was used
    if (currentCreatorData.creator_name && currentCreatorData.creator_name !== currentCreatorData.username) {
      console.log('[Creator Scout] ✓ Using DOM/Meta extracted name:', currentCreatorData.creator_name);
    } else {
      console.log('[Creator Scout] Using URL-based username:', currentCreatorData.username);
    }

    // Copy message to clipboard
    await navigator.clipboard.writeText(message);

    // Update button state
    const dmBtn = document.querySelector('.scout-dm-btn');
    if (dmBtn) {
      const originalText = dmBtn.textContent;
      dmBtn.textContent = 'Copied!';
      dmBtn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';

      // Restore button after 2 seconds
      setTimeout(() => {
        dmBtn.textContent = originalText;
        dmBtn.style.background = 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)';
      }, 2000);
    }

    // Close popup after 2.5 seconds
    setTimeout(() => {
      const popup = document.getElementById('scout-widget-popup');
      if (popup) {
        popup.classList.remove('scout-popup-open');
        setTimeout(() => popup.remove(), 200);
      }
    }, 2500);
  } catch (error) {
    console.error('Error copying message:', error);
    showSaveMessage('Error: ' + error.message, 'error');
  }
}

// Show temporary save message below widget (now as child of widget so it moves with dragging)
function showSaveMessage(text, type) {
  const messageEl = document.createElement('div');
  messageEl.className = `scout-save-message scout-save-message-${type}`;
  messageEl.textContent = text;

  // Append as child of scout widget popup so message moves with widget when dragged
  const scoutWidget = document.querySelector('.scout-widget-popup');
  if (scoutWidget) {
    scoutWidget.appendChild(messageEl);
  } else {
    // Fallback: append to body if widget not found
    document.body.appendChild(messageEl);
  }

  if (type !== 'error') {
    setTimeout(() => {
      messageEl.classList.add('fade-out');
      setTimeout(() => messageEl.remove(), 300);
    }, 3000);
  }
}

function showCompactStatusText(text, type) {
  const popup = document.getElementById('scout-widget-popup');
  if (!popup) return;

  const buttonsContainer = popup.querySelector('#scout-workflow-buttons');
  if (!buttonsContainer) return;

  // Remove any existing status text
  const existingStatus = buttonsContainer.parentElement.querySelector('.scout-status-text');
  if (existingStatus) {
    existingStatus.remove();
  }

  const statusEl = document.createElement('div');
  statusEl.className = `scout-status-text status-${type}`;
  statusEl.textContent = text;

  buttonsContainer.parentElement.insertBefore(statusEl, buttonsContainer.nextSibling);

  if (type === 'success') {
    setTimeout(() => {
      statusEl.classList.add('fade-out');
      setTimeout(() => statusEl.remove(), 300);
    }, 2500);
  }
}

// Check creator status and show floating button (instant shell rendering)
function checkAndShowWidget() {
  // Check if widget already exists (singleton pattern)
  if (ensureSingletonWidget()) {
    // Widget already mounted, just ensure it's visible
    widgetInstance.style.display = 'flex';
    return;
  }

  // Fast path: Check if configured using cached settings (no blocking await)
  if (!cachedSettings.SCOUT_EMAIL || !cachedSettings.GAS_URL || !cachedSettings.PERSONAL_SHEET_ID) {
    return;
  }

  // Check if on supported page
  if (!checkIfSupportedCreatorPage()) {
    return;
  }

  // INSTANT: Mount empty widget shell immediately (~0ms)
  window.__scoutWidgetStatus = 'new';
  window.__scoutWidgetPrice = null;
  createFloatingButton();
  widgetInstance = getExistingWidget();

  // ASYNC: Extract creator data and fetch status without blocking
  // Use extractCreatorInfoAsync() for DOM-first name extraction (not just URL username)
  // Add timeout to prevent extraction from hanging forever (5 second limit)
  const extractionPromise = Promise.race([
    extractCreatorInfoAsync(),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Extraction timeout')), 5000))
  ]);

  extractionPromise.then((creatorData) => {
    if (!creatorData) {
      updateButtonStatus('error');
      return;
    }

    // Capture current request ID to validate responses later
    const requestId = activeProfileRequestId;

    // CRITICAL FIX: Set global currentCreatorData on initial load
    // This ensures Save Creator works immediately after page load
    currentCreatorData = creatorData;
    window.__currentCreatorData = creatorData; // Expose for debugging

    // Update widget with actual creator data
    updateWidgetCreatorData(creatorData);

    // CRITICAL FIX 1: Initialize lastProfileUrl on first load with full URL
    // This ensures that when SPA navigation happens, it can properly detect profile changes
    lastProfileUrl = window.location.href;

    // CRITICAL FIX 3: Load cached status immediately for persistence across refreshes
    chrome.storage.local.get(['CREATOR_STATUS_CACHE', 'CREATOR_LOCK_IN_PRICE_CACHE'], (result) => {
      const cachedStatus = result.CREATOR_STATUS_CACHE || {};
      const cachedPrices = result.CREATOR_LOCK_IN_PRICE_CACHE || {};
      const profileKey = creatorData.profile_url;

      if (cachedStatus[profileKey]) {
        window.__scoutWidgetStatus = cachedStatus[profileKey];
        currentStatus = cachedStatus[profileKey];
        updateButtonStatus(window.__scoutWidgetStatus);
      }

      // Cache price for later use
      if (cachedPrices[profileKey]) {
        window.__scoutWidgetPrice = cachedPrices[profileKey];
      }
    });

    // Fetch actual scouted status in background
    const url = new URL(cachedSettings.GAS_URL);
    url.searchParams.append('action', 'getCreatorStatus');
    url.searchParams.append('email', cachedSettings.SCOUT_EMAIL);
    url.searchParams.append('profile_url', creatorData.profile_url);

    showLoadingStatus();

    // Fetch with 10-second timeout to prevent stuck loading state
    const fetchController = new AbortController();
    const fetchTimeout = setTimeout(() => fetchController.abort(), 10000);

    fetch(url.toString(), { signal: fetchController.signal })
      .then(response => response.json())
      .then(result => {
        clearTimeout(fetchTimeout);
        // RACE CONDITION FIX: Validate this response is not stale
        // If activeProfileRequestId has changed, a new profile was loaded while this fetch was pending
        if (requestId !== activeProfileRequestId) {
          removeLoadingStatus();
          return;
        }

        removeLoadingStatus();
        // Handle new format: { status: 'new' | 'saved' | 'reachedout' | 'negotiating' | 'lockedin' | 'cancelled' }
        let newStatus = 'new';
        if (result && result.status) {
          newStatus = result.status;
        }

        window.__scoutWidgetStatus = newStatus;
        currentStatus = newStatus;

        // Store notes from GAS response into currentCreatorData
        if (result && result.notes && currentCreatorData) {
          console.log('[NOTES] Storing gasNotes from response:', result.notes.substring(0, 50));
          currentCreatorData.gasNotes = result.notes;
        } else if (result) {
          console.log('[NOTES] No notes in GAS response:', { hasNotes: !!result.notes, creatorDataExists: !!currentCreatorData });
        }

        // Update cache - but clear if creator not found in sheets (was deleted)
        chrome.storage.local.get(['CREATOR_STATUS_CACHE', 'CREATOR_LOCK_IN_PRICE_CACHE'], (res) => {
          const cachedStatus = res.CREATOR_STATUS_CACHE || {};
          const cachedPrices = res.CREATOR_LOCK_IN_PRICE_CACHE || {};
          const profileUrl = creatorData.profile_url;

          // If creator not found in sheets, clear stale cache for this creator
          if (result && result.found === false) {
            delete cachedStatus[profileUrl];
            delete cachedPrices[profileUrl];
            window.__scoutWidgetPrice = null;
          } else {
            // Creator exists in sheets - update with latest data
            cachedStatus[profileUrl] = newStatus;

            // LOCK-IN PRICE: Cache price if returned from GAS
            if (result && result.lock_in_price) {
              cachedPrices[profileUrl] = result.lock_in_price;
              window.__scoutWidgetPrice = result.lock_in_price;
            } else {
              // Creator exists but no price - clear stale price
              delete cachedPrices[profileUrl];
              window.__scoutWidgetPrice = null;
            }
          }

          chrome.storage.local.set({
            CREATOR_STATUS_CACHE: cachedStatus,
            CREATOR_LOCK_IN_PRICE_CACHE: cachedPrices
          });
        });

        updateButtonStatus(window.__scoutWidgetStatus);
      })
      .catch(error => {
        clearTimeout(fetchTimeout);
        console.error('Error checking widget status:', error);
        removeLoadingStatus();
        // CRITICAL FIX: Set default status to 'new' on fetch failure
        // Prevents currentStatus from remaining null, which causes buttons to use wrong API action
        window.__scoutWidgetStatus = 'new';
        currentStatus = 'new';
        updateButtonStatus('new');
      });
  }).catch(error => {
    console.error('Error extracting creator data:', error);
    removeLoadingStatus();
    // Fall back to using URL-extracted data so widget still functions
    const syncData = extractCreatorInfo();
    if (syncData) {
      currentCreatorData = syncData;
      window.__currentCreatorData = syncData;
      updateWidgetCreatorData(syncData);
      // Still fetch status in background with fallback data
      const url = new URL(cachedSettings.GAS_URL);
      url.searchParams.append('action', 'getCreatorStatus');
      url.searchParams.append('email', cachedSettings.SCOUT_EMAIL);
      url.searchParams.append('profile_url', syncData.profile_url);

      const fallbackController = new AbortController();
      const fallbackTimeout = setTimeout(() => fallbackController.abort(), 10000);

      fetch(url.toString(), { signal: fallbackController.signal })
        .then(response => response.json())
        .then(result => {
          clearTimeout(fallbackTimeout);
          if (result && result.status) {
            window.__scoutWidgetStatus = result.status;
            currentStatus = result.status;
            updateButtonStatus(result.status);
          }
        })
        .catch(e => {
          clearTimeout(fallbackTimeout);
          window.__scoutWidgetStatus = 'new';
          currentStatus = 'new';
          updateButtonStatus('new');
        });
    } else {
      updateButtonStatus('error');
    }
  });
}

// Show loading status indicator
function showLoadingStatus() {
  const btn = document.querySelector('.scout-floating-button');
  if (btn && !btn.classList.contains('scout-loading')) {
    btn.classList.add('scout-loading');
    const textEl = btn.querySelector('.scout-button-text');
    if (textEl) {
      textEl.textContent = 'Loading...';
    }
  }
}

// Remove loading status indicator
function removeLoadingStatus() {
  const btn = document.querySelector('.scout-floating-button');
  if (btn) {
    btn.classList.remove('scout-loading');
    const textEl = btn.querySelector('.scout-button-text');
    if (textEl) {
      textEl.textContent = 'Scout';
    }
  }
}

// Update widget creator data without recreating (maintains persistent instance)
function updateWidgetCreatorData(creatorData) {
  const widgetContainer = getExistingWidget();
  if (!widgetContainer) return;

  // Store creator data in widget attributes
  widgetContainer.dataset.creatorProfile = creatorData.profile_url;
  widgetContainer.dataset.creatorName = creatorData.creator_name || '';
  widgetContainer.dataset.creatorHandle = creatorData.creator_handle || '';

  // Also store in chrome storage for background access
  chrome.storage.local.set({
    'CURRENT_CREATOR_DATA': creatorData,
    'CURRENT_SCOUT_EMAIL': cachedSettings.SCOUT_EMAIL,
    'CURRENT_GAS_URL': cachedSettings.GAS_URL,
    'CURRENT_PERSONAL_SHEET_ID': cachedSettings.PERSONAL_SHEET_ID
  });
}

// Update widget status display (saved/new/error)
function updateWidgetStatus(statusData) {
  const btn = document.querySelector('.scout-floating-button');
  if (!btn) {
    console.log('[Scout] updateWidgetStatus: button not found');
    return;
  }

  console.log('[Scout] updateWidgetStatus called with:', statusData);

  // Handle new format: { status: 'loading' | 'new' | 'saved' }
  if (statusData && statusData.status) {
    window.__scoutWidgetStatus = statusData.status;
    if (statusData.status !== 'loading') {
      currentStatus = statusData.status;
    }
    console.log('[Scout] Widget status set to:', statusData.status);
    if (statusData.status === 'loading') {
      console.log('[Scout] Showing loading status');
      showLoadingStatus();
    } else {
      console.log('[Scout] Removing loading status');
      removeLoadingStatus();
    }
    updateButtonStatus(window.__scoutWidgetStatus);
  }
  // Handle old format: { exists: boolean }
  else if (statusData && statusData.hasOwnProperty('exists')) {
    window.__scoutWidgetStatus = statusData.exists ? 'saved' : 'new';
    currentStatus = window.__scoutWidgetStatus;
    console.log('[Scout] Widget status set to (old format):', window.__scoutWidgetStatus);
    updateButtonStatus(window.__scoutWidgetStatus);
  }
  // CRITICAL FIX: Default to 'new' if response format is unexpected
  else {
    console.warn('[Scout] updateWidgetStatus: unexpected format:', statusData, '- defaulting to new');
    window.__scoutWidgetStatus = 'new';
    currentStatus = 'new';
    removeLoadingStatus();
    updateButtonStatus('new');
  }
}

// Check if current page is a supported creator profile
function checkIfSupportedCreatorPage() {
  const url = window.location.href;

  // LinkedIn: profile pages
  if (url.includes('linkedin.com')) {
    return url.includes('/in/') || url.includes('/company/');
  }

  // Twitter/X: profile pages (exclude home, explore, etc)
  if (url.includes('twitter.com') || url.includes('x.com')) {
    const pathMatch = url.match(/(?:twitter\.com|x.com)\/([a-zA-Z0-9_]+)/);
    return pathMatch && !['home', 'explore', 'notifications', 'messages', 'bookmarks', 'settings'].includes(pathMatch[1]);
  }

  // Instagram: profile pages
  if (url.includes('instagram.com')) {
    return url.match(/instagram\.com\/([a-zA-Z0-9_.-]+)\/?$/) !== null;
  }

  return false;
}


// Fetch creator status from GAS (used by handleProfileChange flow)
async function fetchCreatorStatus(creatorData) {
  const url = new URL(cachedSettings.GAS_URL);
  url.searchParams.append('action', 'getCreatorStatus');
  url.searchParams.append('email', cachedSettings.SCOUT_EMAIL);
  url.searchParams.append('profile_url', creatorData.profile_url);

  // Timeout protection: fail if fetch takes more than 10 seconds
  return Promise.race([
    fetch(url.toString()).then(r => r.json()),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Fetch timeout')), 10000))
  ]);
}

// Queue profile refresh to debounce rapid navigation (300ms)
function queueProfileRefresh() {
  clearTimeout(refreshTimeout);
  refreshTimeout = setTimeout(() => {
    handleProfileChange();
  }, REFRESH_QUEUE_DEBOUNCE_MS);
}

// Handle profile change: refresh creator data and widget state
async function handleProfileChange() {
  if (!cachedSettings.SCOUT_EMAIL || !cachedSettings.GAS_URL || !cachedSettings.PERSONAL_SHEET_ID) {
    return;
  }

  if (!checkIfSupportedCreatorPage()) {
    const widget = getExistingWidget();
    if (widget) {
      widget.style.display = 'none';
    }
    return;
  }

  // Detect actual profile changes using profile data, not URL (more robust for SPAs)
  const profileIdentifier = window.location.pathname + window.location.hostname;
  if (profileIdentifier === lastProfileIdentifier) {
    return;
  }

  // Close any open widget popup when profile changes - remove immediately
  const openPopup = document.getElementById('scout-widget-popup');
  if (openPopup) {
    openPopup.remove();
  }

  // Handle platform changes
  const lastPlatform = getCurrentStoredPlatform();
  const currentPlatform = detectCurrentPlatform();

  if (lastPlatform && lastPlatform !== currentPlatform) {
    const widget = getExistingWidget();
    if (widget) {
      widget.remove();
    }
    widgetInstance = null;
    setTimeout(() => checkAndShowWidget(), 600);
    return;
  }

  lastProfileIdentifier = profileIdentifier;
  lastProfileUrl = window.location.href;

  let widget = getExistingWidget();
  if (widget && !document.body.contains(widget)) {
    createFloatingButton();
    widget = getExistingWidget();
  } else if (!widget) {
    createFloatingButton();
    widget = getExistingWidget();
  } else {
    widget.style.display = 'flex';
  }

  widgetInstance = widget;
  const requestId = ++activeProfileRequestId;

  currentCreatorData = null;
  lastFetchedStatus = null;
  currentStatus = null;
  window.__scoutWidgetStatus = 'new';
  window.__scoutWidgetPrice = null;

  updateWidgetStatus({ status: 'loading' });
  await new Promise(r => setTimeout(r, 400));

  const creatorData = await extractCreatorInfoAsync();

  if (requestId !== activeProfileRequestId) {
    return;
  }

  if (!creatorData) {
    updateWidgetStatus({ status: 'error' });
    return;
  }

  currentCreatorData = creatorData;
  window.__currentCreatorData = creatorData;
  updateWidgetCreatorData(creatorData);

  // CRITICAL FIX: Do NOT load from cache during profile change
  // Cache might be corrupted. Wait for GAS to return the authoritative status.
  // Only GAS response updates the widget during navigation.

  const statusPromise = fetchCreatorStatus(creatorData);

  try {
    const status = await statusPromise;

    if (requestId !== activeProfileRequestId) {
      return;
    }

    lastFetchedStatus = status;

    if (currentCreatorData && currentCreatorData.profile_url) {
      chrome.storage.local.get(['CREATOR_STATUS_CACHE', 'CREATOR_LOCK_IN_PRICE_CACHE'], (res) => {
        const cachedStatus = res.CREATOR_STATUS_CACHE || {};
        const cachedPrices = res.CREATOR_LOCK_IN_PRICE_CACHE || {};
        const profileUrl = currentCreatorData.profile_url;

        // If creator not found in sheets, clear stale cache
        if (status && status.found === false) {
          delete cachedStatus[profileUrl];
          delete cachedPrices[profileUrl];
          window.__scoutWidgetPrice = null;
        } else if (status && status.status) {
          // Creator exists - update with latest data
          cachedStatus[profileUrl] = status.status;

          if (status.lock_in_price) {
            cachedPrices[profileUrl] = status.lock_in_price;
            window.__scoutWidgetPrice = status.lock_in_price;
          } else {
            // Creator exists but no price - clear stale price
            delete cachedPrices[profileUrl];
            window.__scoutWidgetPrice = null;
          }
        }

        chrome.storage.local.set({
          CREATOR_STATUS_CACHE: cachedStatus,
          CREATOR_LOCK_IN_PRICE_CACHE: cachedPrices
        });
      });
    }

    updateWidgetStatus(status);
  } catch (err) {
    if (requestId !== activeProfileRequestId) return;
    updateWidgetStatus({ status: 'new' });
  }
}

// Setup event-driven SPA navigation detection
function setupSPANavigation() {
  const originalPushState = window.history.pushState;
  window.history.pushState = function(...args) {
    originalPushState.apply(this, args);
    window.dispatchEvent(new CustomEvent('creator-scout-locationchange'));
  };

  const originalReplaceState = window.history.replaceState;
  window.history.replaceState = function(...args) {
    originalReplaceState.apply(this, args);
    window.dispatchEvent(new CustomEvent('creator-scout-locationchange'));
  };

  window.addEventListener('popstate', () => {
    window.dispatchEvent(new CustomEvent('creator-scout-locationchange'));
  });

  window.addEventListener('creator-scout-locationchange', () => {
    queueProfileRefresh();
  });

  // Fallback URL change detection
  let lastDetectedUrl = window.location.href;
  setInterval(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastDetectedUrl) {
      lastDetectedUrl = currentUrl;
      window.dispatchEvent(new CustomEvent('creator-scout-locationchange'));
    }
  }, 500);
}

// Initialize widget on page load - LOAD SETTINGS FIRST
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    // Load settings first (fast, required to know if widget should show)
    await updateCacheFromStorage();
    setupSPANavigation();

    // Twitter/X initial load requires additional DOM render time before extraction
    // This ensures the profile header (H1) is rendered before we attempt extraction
    const url = window.location.href;
    const isTwitterX = url.includes('twitter.com') || url.includes('x.com');
    if (isTwitterX) {
      setTimeout(checkAndShowWidget, 100);
    } else {
      checkAndShowWidget();
    }
  });
} else {
  // Load settings first (fast, required to know if widget should show)
  updateCacheFromStorage().then(() => {
    setupSPANavigation();

    // Twitter/X initial load requires additional DOM render time before extraction
    const url = window.location.href;
    const isTwitterX = url.includes('twitter.com') || url.includes('x.com');
    if (isTwitterX) {
      setTimeout(checkAndShowWidget, 100);
    } else {
      checkAndShowWidget();
    }
  });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getCreatorInfo') {
    extractCreatorInfoAsync().then(creatorInfo => {
      sendResponse(creatorInfo);
    });
    return true; // Indicate async response
  } else if (request.action === 'updateWidgetStatus') {
    const { status } = request;
    updateButtonStatus(status);
    sendResponse({ success: true });
  }
});

// Extract creator information from page asynchronously
async function extractCreatorInfoAsync() {
  const url = window.location.href;
  let platform, username, profileUrl;

  if (url.includes('linkedin.com')) {
    platform = 'LinkedIn';
    username = extractLinkedInUsername(url);
    profileUrl = url.split('?')[0];
  } else if (url.includes('twitter.com') || url.includes('x.com')) {
    platform = 'Twitter/X';
    username = extractTwitterUsername(url);
    profileUrl = url.split('?')[0];
  } else if (url.includes('instagram.com')) {
    platform = 'Instagram';
    username = extractInstagramUsername(url);
    profileUrl = url.split('?')[0];
  }

  if (!username || !platform) {
    return null;
  }

  const creatorName = await extractCreatorName() || username;

  return {
    profile_url: profileUrl,
    platform: platform,
    username: username,
    creator_name: creatorName
  };
}

// Keep synchronous version for backwards compatibility (immediate extraction only)
function extractCreatorInfo() {
  const url = window.location.href;
  let platform, username, profileUrl;

  if (url.includes('linkedin.com')) {
    platform = 'LinkedIn';
    username = extractLinkedInUsername(url);
    profileUrl = url.split('?')[0];
  } else if (url.includes('twitter.com') || url.includes('x.com')) {
    platform = 'Twitter/X';
    username = extractTwitterUsername(url);
    profileUrl = url.split('?')[0];
  } else if (url.includes('instagram.com')) {
    platform = 'Instagram';
    username = extractInstagramUsername(url);
    profileUrl = url.split('?')[0];
  }

  if (!username || !platform) {
    return null;
  }

  return {
    profile_url: profileUrl,
    platform: platform,
    username: username,
    creator_name: username
  };
}

// Twitter/X profile name extraction
async function extractTwitterName() {
  for (const delay of [0, 150, 400]) {
    if (delay) {
      await new Promise(r => setTimeout(r, delay));
    }

    const h1Elements = [...document.querySelectorAll('h1')];

    for (const el of h1Elements) {
      const text = el.innerText?.trim();
      if (!text) continue;

      const rect = el.getBoundingClientRect();
      const inProfileZone = rect.top > 0 && rect.top < 150 && rect.left > 0 && rect.left < 400;
      if (!inProfileZone) continue;

      const sentenceCount = (text.match(/[.!?]/g) || []).length;
      const wordCount = text.split(/\s+/).length;

      if (
        text.length > 2 &&
        text.length < 80 &&
        wordCount < 5 &&
        sentenceCount === 0 &&
        !text.startsWith('@') &&
        !text.includes('Hi ') &&
        !text.includes('Hope') &&
        !text.includes('collaborate') &&
        !text.includes('would love')
      ) {
        return text.replace(/\s+/g, ' ').trim().replace(/^[\{\(]\d+[\}\)]\s*/, '');
      }
    }

    const meta = document
      .querySelector('meta[property="og:title"]')
      ?.content
      ?.split('(@')[0]
      ?.trim();

    if (meta && meta.length > 2) {
      return meta.replace(/^[\{\(]\d+[\}\)]\s*/, '');
    }
  }

  return extractNameFromUrl();
}

// UNIFIED ASYNC EXTRACTION - DOM-FIRST PRIORITY
// This is the authoritative creator name extraction function
// Priority: DOM (with retries) → Meta OG:Title → URL Parsing (LAST RESORT ONLY)
async function extractCreatorName() {
  const url = window.location.href;

  if (url.includes('twitter.com') || url.includes('x.com')) {
    return await extractTwitterName();
  }

  const delays = [0, 100, 300];

  for (let i = 0; i < delays.length; i++) {
    const delay = delays[i];
    if (delay) {
      await new Promise(r => setTimeout(r, delay));
    }

    const headings = [...document.querySelectorAll('h1, h2')];

    for (const el of headings) {
      const text = el.innerText?.trim();

      if (
        text &&
        text.length > 2 &&
        text.length < 80 &&
        !text.includes('Connect') &&
        !text.includes('Message') &&
        !text.includes('Followers') &&
        !text.includes('Notification') &&
        !text.includes('notification') &&
        !text.includes('linkedin.com') &&
        !text.includes('/')
      ) {
        const cleaned = text
          .replace(/·.*/g, '')
          .replace(/\b(he\/him|she\/her|they\/them)\b/gi, '')
          .trim();

        if (cleaned && cleaned.length > 2) {
          return cleaned;
        }
      }
    }

    try {
      const meta = document
        .querySelector('meta[property="og:title"]')
        ?.content
        ?.split('|')[0]
        ?.trim();

      if (meta && meta.length > 2 && meta.length < 80 && !meta.includes('/')) {
        return meta;
      }
    } catch (e) {
      // Non-critical
    }
  }

  return extractNameFromUrl();
}

// Extract creator name from URL as LAST RESORT ONLY
// This should only be called after ALL DOM and meta extraction attempts fail
function extractNameFromUrl() {
  const url = window.location.href;

  // LinkedIn: /in/username or /company/username
  let match = url.match(/linkedin\.com\/(in|company)\/([^/?]+)/);
  if (match) {
    const slug = match[2];
    // Convert slug to title case: mehul-kumar1351 → Mehul Kumar
    const name = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      // Remove numbers at end if they're ID suffixes
      .replace(/\s+\d+$/, '');
    return name;
  }

  // Twitter/X: /username
  match = url.match(/(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)/);
  if (match) {
    const username = match[1];
    return username;
  }

  // Instagram: /username
  match = url.match(/instagram\.com\/([a-zA-Z0-9_.-]+)/);
  if (match) {
    const username = match[1];
    return username;
  }

  return null;
}

// Legacy platform-specific functions removed - using unified extractCreatorName() instead

// Extract LinkedIn username from URL ONLY
function extractLinkedInUsername(url) {
  // LinkedIn URL format: linkedin.com/in/username or linkedin.com/company/username
  const match = url.match(/linkedin\.com\/(in|company)\/([^/?]+)/);
  if (match) {
    return match[2];
  }
  return null;
}

// Extract Twitter/X username from URL ONLY
function extractTwitterUsername(url) {
  // Twitter URL format: twitter.com/username or x.com/username
  // Must be first path segment and not a navigation page
  const match = url.match(/(?:twitter\.com|x\.com)\/([^/?]+)/);
  if (match) {
    const username = match[1];
    // Filter out navigation pages: home, explore, etc.
    const navPages = ['home', 'explore', 'notifications', 'messages', 'bookmarks', 'settings', 'search', 'discover'];
    if (!navPages.includes(username.toLowerCase())) {
      return username;
    }
  }
  return null;
}

// Extract Instagram username from URL ONLY
function extractInstagramUsername(url) {
  // Instagram URL format: instagram.com/username
  const match = url.match(/instagram\.com\/([^/?]+)/);
  if (match) {
    return match[1];
  }
  return null;
}
