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

import { useState } from 'react'
import { t } from '../i18n'

interface OnboardingProps {
  onPinCurrent: () => void
  onAddManual: (url: string) => void
}

const Onboarding = ({ onPinCurrent, onAddManual }: OnboardingProps) => {
  const [url, setUrl] = useState('')

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-theme-bg">
      <img
        src="icons/icon128.png"
        alt="Shiba"
        className="w-24 h-24 mb-6 animate-bounce"
      />
      <h1 className="text-2xl font-bold text-theme-text mb-4">
        {t('welcome')}
      </h1>
      <p className="text-theme-muted text-sm mb-8 max-w-xs">
        {t('onboardingSub')}
      </p>

      <div className="space-y-4 w-full max-w-[240px]">
        <button
          onClick={onPinCurrent}
          className="w-full py-3 bg-shiba hover:bg-shiba-dark text-[#333333] font-bold rounded-lg transition-colors shadow-lg"
        >
          {t('pinCurrent')}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-theme-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-theme-bg px-2 text-theme-muted">
              {t('orManually')}
            </span>
          </div>
        </div>

        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t('placeholderUrl')}
          className="w-full bg-theme-card border border-theme-border text-theme-text p-2 rounded text-sm focus:outline-none focus:border-shiba"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && url) {
              onAddManual(url.startsWith('http') ? url : `https://${url}`)
              setUrl('')
            }
          }}
        />
        <button
          onClick={() => {
            if (url) {
              onAddManual(url.startsWith('http') ? url : `https://${url}`)
              setUrl('')
            }
          }}
          className="w-full py-2 bg-theme-dock hover:bg-theme-border text-theme-text text-sm rounded transition-colors"
        >
          {t('addSite')}
        </button>
      </div>
    </div>
  )
}

export default Onboarding
