/*
 * Sidebark - Your loyal Shiba companion in the browser.
 * Copyright (C) 2026 phine-apps
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { StorageService, PinnedSite } from '../../src/services/storage'

describe('StorageService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAppState', () => {
    it('should return default values when storage is empty', async () => {
      vi.mocked(chrome.storage.sync.get).mockImplementation(
        (_keys, callback) => {
          callback({})
          return undefined as unknown as Promise<{ [key: string]: unknown }>
        }
      )

      const state = await StorageService.getAppState()

      expect(state.pinnedSites).toEqual([])
      expect(state.lastOpenedURL).toBeNull()
      expect(state.useMobileView).toBe(true)
      expect(state.tabTrigger).toBe('@tab')
    })

    it('should return stored values', async () => {
      const mockSites: PinnedSite[] = [
        {
          id: '1',
          url: 'https://example.com',
          name: 'Example',
          favicon: 'https://example.com/favicon.ico',
        },
      ]
      vi.mocked(chrome.storage.sync.get).mockImplementation(
        (_keys, callback) => {
          callback({
            pinnedSites: mockSites,
            lastOpenedURL: 'https://example.com',
            useMobileView: false,
            tabTrigger: '@link',
          })
          return undefined as unknown as Promise<{ [key: string]: unknown }>
        }
      )

      const state = await StorageService.getAppState()

      expect(state.pinnedSites).toEqual(mockSites)
      expect(state.lastOpenedURL).toBe('https://example.com')
      expect(state.useMobileView).toBe(false)
      expect(state.tabTrigger).toBe('@link')
    })
  })

  describe('setPinnedSites', () => {
    it('should save pinned sites successfully', async () => {
      vi.mocked(chrome.storage.sync.set).mockImplementation(
        (_data, callback) => {
          if (callback) callback()
          return undefined as unknown as Promise<void>
        }
      )

      const sites: PinnedSite[] = [
        {
          id: '1',
          url: 'https://example.com',
          name: 'Example',
          favicon: 'https://example.com/favicon.ico',
        },
      ]

      await expect(
        StorageService.setPinnedSites(sites)
      ).resolves.toBeUndefined()
      expect(chrome.storage.sync.set).toHaveBeenCalledWith(
        { pinnedSites: sites },
        expect.any(Function)
      )
    })

    it('should throw LIMIT_EXCEEDED_COUNT when exceeding 30 sites', async () => {
      const sites: PinnedSite[] = Array.from({ length: 31 }, (_, i) => ({
        id: `${i}`,
        url: `https://example${i}.com`,
        name: `Example ${i}`,
        favicon: `https://example${i}.com/favicon.ico`,
      }))

      await expect(StorageService.setPinnedSites(sites)).rejects.toThrow(
        'LIMIT_EXCEEDED_COUNT'
      )
    })

    it('should throw LIMIT_EXCEEDED_SIZE when data is too large', async () => {
      // Create a site with very long name to exceed size limit
      const longName = 'a'.repeat(10000)
      const sites: PinnedSite[] = [
        {
          id: '1',
          url: 'https://example.com',
          name: longName,
          favicon: 'https://example.com/favicon.ico',
        },
      ]

      await expect(StorageService.setPinnedSites(sites)).rejects.toThrow(
        'LIMIT_EXCEEDED_SIZE'
      )
    })

    it('should reject when chrome.runtime.lastError is set', async () => {
      vi.mocked(chrome.storage.sync.set).mockImplementation(
        (_data, callback) => {
          // Simulate runtime error
          Object.defineProperty(chrome.runtime, 'lastError', {
            value: { message: 'Storage quota exceeded' },
            configurable: true,
          })
          if (callback) callback()
          return undefined as unknown as Promise<void>
        }
      )

      const sites: PinnedSite[] = [
        {
          id: '1',
          url: 'https://example.com',
          name: 'Example',
          favicon: 'https://example.com/favicon.ico',
        },
      ]

      await expect(StorageService.setPinnedSites(sites)).rejects.toEqual({
        message: 'Storage quota exceeded',
      })

      // Clean up
      Object.defineProperty(chrome.runtime, 'lastError', {
        value: null,
        configurable: true,
      })
    })
  })

  describe('setLastOpenedURL', () => {
    it('should save last opened URL', async () => {
      vi.mocked(chrome.storage.sync.set).mockImplementation(
        (_data, callback) => {
          if (callback) callback()
          return undefined as unknown as Promise<void>
        }
      )

      await StorageService.setLastOpenedURL('https://example.com')

      expect(chrome.storage.sync.set).toHaveBeenCalledWith(
        { lastOpenedURL: 'https://example.com' },
        expect.any(Function)
      )
    })
  })

  describe('setUseMobileView', () => {
    it('should save mobile view setting to true', async () => {
      vi.mocked(chrome.storage.sync.set).mockImplementation(
        (_data, callback) => {
          if (callback) callback()
          return undefined as unknown as Promise<void>
        }
      )

      await StorageService.setUseMobileView(true)

      expect(chrome.storage.sync.set).toHaveBeenCalledWith(
        { useMobileView: true },
        expect.any(Function)
      )
    })

    it('should save mobile view setting to false', async () => {
      vi.mocked(chrome.storage.sync.set).mockImplementation(
        (_data, callback) => {
          if (callback) callback()
          return undefined as unknown as Promise<void>
        }
      )

      await StorageService.setUseMobileView(false)

      expect(chrome.storage.sync.set).toHaveBeenCalledWith(
        { useMobileView: false },
        expect.any(Function)
      )
    })
  })

  describe('setTabTrigger', () => {
    it('should save tab trigger', async () => {
      vi.mocked(chrome.storage.sync.set).mockImplementation(
        (_data, callback) => {
          if (callback) callback()
          return undefined as unknown as Promise<void>
        }
      )

      await StorageService.setTabTrigger('@link')

      expect(chrome.storage.sync.set).toHaveBeenCalledWith(
        { tabTrigger: '@link' },
        expect.any(Function)
      )
    })
  })
})
