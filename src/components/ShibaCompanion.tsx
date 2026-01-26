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

import { useState, useEffect } from 'react'
import { t } from '../i18n'

interface ShibaCompanionProps {
  onOpenSettings: () => void
  reactionTrigger?: number
  confirmRequest?: {
    message: string
    onConfirm: () => void
    onCancel: () => void
  } | null
  errorMessage?: string
}

const ShibaCompanion = ({
  onOpenSettings,
  reactionTrigger,
  confirmRequest,
  errorMessage,
}: ShibaCompanionProps) => {
  const [bubble, setBubble] = useState<{
    message: string
    duration: number
  } | null>(null)
  const [scale, setScale] = useState(1)

  const speak = (message: string, duration = 3000) => {
    setBubble({ message, duration })
    setScale(1.1)
    if (duration > 0) {
      setTimeout(() => {
        setBubble(null)
        setScale(1)
      }, duration)
    }
  }

  useEffect(() => {
    if (reactionTrigger) {
      // Defer state updates to next tick to avoid synchronous setState in effect
      const timeoutId = setTimeout(() => {
        if (reactionTrigger > 0) {
          const phrases = [t('shibaBark'), t('shibaFound'), t('shibaSniff')]
          speak(phrases[Math.floor(Math.random() * phrases.length)], 2000)
        } else if (errorMessage) {
          speak(errorMessage, 4000)
        }
      }, 0)
      return () => clearTimeout(timeoutId)
    }
  }, [reactionTrigger, errorMessage])

  const activeMessage = confirmRequest?.message || bubble?.message

  return (
    <div
      className="relative cursor-pointer z-10 w-full"
      onClick={onOpenSettings}
      style={{ transform: `scale(${scale})`, transition: 'transform 0.2s' }}
    >
      <img
        src="icons/icon48.png"
        alt="Shiba"
        className="w-full h-auto p-0 m-0 block"
      />
      {activeMessage && (
        <div className="absolute right-14 top-0 bg-theme-bubble text-theme-bubble-text p-2 rounded-lg shadow-lg z-50 text-xs min-w-[120px] border border-theme-border">
          <div className="mb-2 whitespace-normal leading-relaxed">
            {activeMessage}
          </div>
          {confirmRequest && (
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  confirmRequest.onConfirm()
                }}
                className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                {t('yes')}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  confirmRequest.onCancel()
                }}
                className="px-2 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
              >
                {t('no')}
              </button>
            </div>
          )}
          <div className="absolute right-[-6px] top-4 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-theme-bubble"></div>
        </div>
      )}
    </div>
  )
}

export default ShibaCompanion
