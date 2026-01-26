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

export interface PinnedSite {
  id: string
  url: string
  name: string
  favicon: string
}

export interface AppState {
  pinnedSites: PinnedSite[]
  lastOpenedURL: string | null
  useMobileView: boolean
  tabTrigger: string
}

const MAX_SITES = 30
const MAX_BYTES_PER_ITEM = 8000 // Leaving some padding from 8192

export const StorageService = {
  async getAppState(): Promise<AppState> {
    return new Promise((resolve) => {
      chrome.storage.sync.get(
        ['pinnedSites', 'lastOpenedURL', 'useMobileView', 'tabTrigger'],
        (result) => {
          resolve({
            pinnedSites: result.pinnedSites || [],
            lastOpenedURL: result.lastOpenedURL || null,
            useMobileView: result.useMobileView !== false,
            tabTrigger: result.tabTrigger || '@tab',
          })
        }
      )
    })
  },

  async setPinnedSites(pinnedSites: PinnedSite[]): Promise<void> {
    if (pinnedSites.length > MAX_SITES) {
      throw new Error('LIMIT_EXCEEDED_COUNT')
    }

    const dataString = JSON.stringify(pinnedSites)
    if (new TextEncoder().encode(dataString).length > MAX_BYTES_PER_ITEM) {
      throw new Error('LIMIT_EXCEEDED_SIZE')
    }

    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ pinnedSites }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve()
        }
      })
    })
  },

  async setLastOpenedURL(url: string): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ lastOpenedURL: url }, () => resolve())
    })
  },

  async setUseMobileView(enabled: boolean): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ useMobileView: enabled }, () => resolve())
    })
  },

  async setTabTrigger(trigger: string): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ tabTrigger: trigger }, () => resolve())
    })
  },
}
