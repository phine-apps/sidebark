/*
 * Sidebark - Your loyal Shiba companion in the browser.
 * Copyright (C) 2026 phine-apps
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error))

const MOBILE_RULE_ID = 2

async function updateMobileView(enabled: boolean) {
  if (enabled) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [MOBILE_RULE_ID],
      addRules: [
        {
          id: MOBILE_RULE_ID,
          priority: 2,
          action: {
            type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
            requestHeaders: [
              {
                header: 'User-Agent',
                operation: chrome.declarativeNetRequest.HeaderOperation.SET,
                value:
                  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1',
              },
              {
                header: 'Sec-CH-UA',
                operation: chrome.declarativeNetRequest.HeaderOperation.SET,
                value:
                  '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
              },
              {
                header: 'Sec-CH-UA-Mobile',
                operation: chrome.declarativeNetRequest.HeaderOperation.SET,
                value: '?1',
              },
              {
                header: 'Sec-CH-UA-Platform',
                operation: chrome.declarativeNetRequest.HeaderOperation.SET,
                value: '"iOS"',
              },
            ],
          },
          condition: {
            urlFilter: '*',
            resourceTypes: [
              chrome.declarativeNetRequest.ResourceType.SUB_FRAME,
            ],
          },
        },
      ],
    })
  } else {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [MOBILE_RULE_ID],
    })
  }
}

// Listen for messages from sidepanel or content scripts
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'TOGGLE_MOBILE_VIEW') {
    updateMobileView(message.enabled).then(() =>
      sendResponse({ success: true })
    )
    return true // Keep channel open
  }

  if (message.type === 'GET_TAB_URL') {
    chrome.tabs
      .query({ active: true, lastFocusedWindow: true })
      .then(([tab]) => {
        sendResponse({ url: tab?.url || null })
      })
      .catch((err) => {
        console.error('Error fetching tab URL:', err)
        sendResponse({ url: null })
      })
    return true // Keep channel open
  }
})

// Sync rules on startup
chrome.storage.sync.get(['useMobileView'], (result) => {
  const useMobile = result.useMobileView !== false // Default to true
  updateMobileView(useMobile)
})

export {} // Make it a module
