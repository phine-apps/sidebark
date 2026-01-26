/*
 * Sidebark - Your loyal Shiba companion in the browser.
 * Copyright (C) 2026 phine-apps
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 */

import { describe, it, expect, afterEach } from 'vitest'
import { t, translations } from '../src/i18n'

describe('i18n', () => {
  const originalNavigator = global.navigator

  afterEach(() => {
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
    })
  })

  const mockLanguage = (lang: string) => {
    Object.defineProperty(global, 'navigator', {
      value: { language: lang },
      writable: true,
    })
  }

  describe('t function', () => {
    it('should return English translation for "en" language', () => {
      mockLanguage('en-US')
      expect(t('welcome')).toBe(translations.en.welcome)
      expect(t('addSite')).toBe('Add Site')
    })

    it('should return Japanese translation for "ja" language', () => {
      mockLanguage('ja-JP')
      expect(t('welcome')).toBe(translations.ja.welcome)
      expect(t('addSite')).toBe('サイトを追加')
    })

    it('should return Chinese translation for "zh" language', () => {
      mockLanguage('zh-CN')
      expect(t('welcome')).toBe(translations.zh.welcome)
      expect(t('addSite')).toBe('添加网站')
    })

    it('should fall back to English for unsupported languages', () => {
      mockLanguage('fr-FR')
      expect(t('welcome')).toBe(translations.en.welcome)
    })

    it('should fall back to English for empty language', () => {
      mockLanguage('')
      expect(t('welcome')).toBe(translations.en.welcome)
    })
  })

  describe('translations consistency', () => {
    it('should have the same keys in all languages', () => {
      const enKeys = Object.keys(translations.en)
      const jaKeys = Object.keys(translations.ja)
      const zhKeys = Object.keys(translations.zh)

      expect(jaKeys).toEqual(enKeys)
      expect(zhKeys).toEqual(enKeys)
    })

    it('should have non-empty values for all keys in all languages', () => {
      const languages = ['en', 'ja', 'zh'] as const
      const keys = Object.keys(translations.en)

      for (const lang of languages) {
        for (const key of keys) {
          expect(
            translations[lang][key as keyof typeof translations.en]
          ).toBeTruthy()
        }
      }
    })
  })

  describe('specific translation keys', () => {
    it('should have correct error messages', () => {
      mockLanguage('en-US')
      expect(t('triggerErrorStart')).toBe('Must start with @')
      expect(t('triggerErrorLength')).toBe('Must be at least 3 chars')
      expect(t('triggerErrorAlnum')).toBe('Alphanumeric only')
    })

    it('should have correct limit messages', () => {
      mockLanguage('en-US')
      expect(t('limitExceededCount')).toContain('30')
      expect(t('limitExceededSize')).toContain('large')
    })
  })
})
