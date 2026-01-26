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

import { X, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { t } from '../i18n'

interface SettingsOverlayProps {
  useMobileView: boolean
  onToggleView: (isMobile: boolean) => void
  tabTrigger: string
  onUpdateTrigger: (trigger: string) => void
  onClose: () => void
}

const SettingsOverlay = ({
  useMobileView,
  onToggleView,
  tabTrigger,
  onUpdateTrigger,
  onClose,
}: SettingsOverlayProps) => {
  const [localTrigger, setLocalTrigger] = useState(tabTrigger)
  const [error, setError] = useState<string | null>(null)

  const validateAndSave = (value: string) => {
    setLocalTrigger(value)

    if (!value.startsWith('@')) {
      setError(t('triggerErrorStart'))
      return
    }

    if (value.length < 3) {
      setError(t('triggerErrorLength'))
      return
    }

    const alphanumericAfterAt = value.slice(1)
    if (!/^[a-z0-9]+$/i.test(alphanumericAfterAt)) {
      setError(t('triggerErrorAlnum'))
      return
    }

    setError(null)
    onUpdateTrigger(value)
  }

  return (
    <div className="absolute inset-0 bg-theme-overlay backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-theme-card p-6 rounded-xl w-80 border border-theme-border relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-theme-muted hover:text-theme-text"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <img src="/icons/icon48.png" alt="Sidebark" className="w-6 h-6" />
          <h2 className="text-shiba text-xl font-bold">{t('settings')}</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-theme-muted block">
              {t('viewMode')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onToggleView(true)}
                className={`py-2 text-sm rounded transition-colors ${
                  useMobileView
                    ? 'bg-shiba text-[#333333] font-bold'
                    : 'bg-theme-dock text-theme-muted hover:bg-theme-border'
                }`}
              >
                {t('mobile')}
              </button>
              <button
                onClick={() => onToggleView(false)}
                className={`py-2 text-sm rounded transition-colors ${
                  !useMobileView
                    ? 'bg-shiba text-[#333333] font-bold'
                    : 'bg-theme-dock text-theme-muted hover:bg-theme-border'
                }`}
              >
                {t('pc')}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-theme-muted block">
              {t('tabTrigger')}
            </label>
            <div className="relative">
              <input
                type="text"
                value={localTrigger}
                onChange={(e) => validateAndSave(e.target.value)}
                className={`w-full bg-theme-dock border ${
                  error ? 'border-red-500' : 'border-theme-border'
                } text-theme-text p-2 rounded text-base focus:outline-none focus:border-shiba`}
                placeholder="@tab"
              />
              {error && (
                <div className="flex items-center gap-1 mt-1 text-[11px] text-red-500">
                  <AlertCircle size={10} />
                  {error}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">{t('triggerExample')}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400 block">
              {t('dataSync')}
            </label>
            <div className="text-sm text-green-500 bg-green-500/10 py-1 px-2 rounded inline-block">
              {t('enabledSync')}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          disabled={!!error}
          className={`w-full mt-8 py-2 text-base rounded transition-colors ${
            error
              ? 'bg-theme-dock text-theme-muted cursor-not-allowed'
              : 'bg-theme-dock hover:bg-theme-border text-theme-text'
          }`}
        >
          {t('close')}
        </button>
      </div>
    </div>
  )
}

export default SettingsOverlay
