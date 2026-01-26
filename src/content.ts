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

// Global trigger replacement content script with Space and Tab trigger support

let tabTrigger = '@tab'

// Initial load
chrome.storage.sync.get(['tabTrigger'], (result) => {
  if (result.tabTrigger) {
    tabTrigger = result.tabTrigger
  }
})

// Sync on change
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.tabTrigger) {
    tabTrigger = changes.tabTrigger.newValue
  }
})

const fetchTabUrl = async () => {
  const response = await chrome.runtime.sendMessage({ type: 'GET_TAB_URL' })
  return response?.url || null
}

const handleReplacement = async (target: HTMLElement, suffix: string = '') => {
  const fullTrigger = tabTrigger + suffix
  const url = await fetchTabUrl()
  if (!url) return false

  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement
  ) {
    const value = target.value
    const start = target.selectionStart!
    const textBefore = value.substring(0, start)

    if (textBefore.endsWith(fullTrigger)) {
      const newTextBefore =
        textBefore.substring(0, textBefore.length - fullTrigger.length) +
        url +
        ' '
      const newValue = newTextBefore + value.substring(start)
      target.value = newValue

      const newPos = newTextBefore.length
      target.setSelectionRange(newPos, newPos)
      target.dispatchEvent(new Event('input', { bubbles: true }))
      return true
    }
  } else if (target.isContentEditable) {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return false

    const range = selection.getRangeAt(0)
    const textNode = range.startContainer
    const offset = range.startOffset

    if (textNode.nodeType === Node.TEXT_NODE) {
      const content = textNode.nodeValue || ''
      const textBefore = content.substring(0, offset)

      if (textBefore.endsWith(fullTrigger)) {
        const newTextBefore =
          textBefore.substring(0, textBefore.length - fullTrigger.length) +
          url +
          ' '
        const newContent = newTextBefore + content.substring(offset)
        textNode.nodeValue = newContent

        const newOffset = newTextBefore.length
        try {
          const newRange = document.createRange()
          newRange.setStart(textNode, newOffset)
          newRange.setEnd(textNode, newOffset)
          selection.removeAllRanges()
          selection.addRange(newRange)
        } catch (e) {
          console.error('Failed to restore selection:', e)
        }
        target.dispatchEvent(new Event('input', { bubbles: true }))
        return true
      }
    }
  }
  return false
}

// Handle Space trigger via input event
document.addEventListener(
  'input',
  (event) => {
    const target = event.target as HTMLElement
    if (!target) return

    // Optimization: Only send message if the input ends with the trigger sequence
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement
    ) {
      if (!target.value.includes(tabTrigger)) return
    } else if (target.isContentEditable) {
      if (!target.innerText.includes(tabTrigger)) return
    }

    handleReplacement(target, ' ')
  },
  true
)

// Handle Tab trigger via keydown event
document.addEventListener(
  'keydown',
  async (event) => {
    if (event.key === 'Tab') {
      const target = event.target as HTMLElement
      if (!target) return

      // Check if trigger is present before current cursor
      const replaced = await handleReplacement(target, '')
      if (replaced) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
  },
  true
)
