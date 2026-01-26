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

import { useState, useEffect, useRef } from 'react'
import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { StorageService, PinnedSite, AppState } from './services/storage'
import ShibaCompanion from './components/ShibaCompanion'
import SiteDock from './components/SiteDock'
import SiteIframe from './components/SiteIframe'
import SettingsOverlay from './components/SettingsOverlay'
import Onboarding from './components/Onboarding'
import clsx from 'clsx'
import { t, TranslationKey } from './i18n'

function App() {
  const [state, setState] = useState<AppState | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [currentUrl, setCurrentUrl] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [shibaTrigger, setShibaTrigger] = useState(0)
  const [shibaError, setShibaError] = useState<TranslationKey | null>(null)
  const [pendingDeletion, setPendingDeletion] = useState<number | null>(null)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!navRef.current) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height
        // Subtractions for Shiba (60), AddButton (40), Padding (32), PageButtons (50)
        const availableHeight = height - 190
        const calculated = Math.max(1, Math.floor(availableHeight / 56))
        setItemsPerPage(calculated)
      }
    })
    observer.observe(navRef.current)
    return () => observer.disconnect()
  }, [state])

  useEffect(() => {
    StorageService.getAppState().then((loadedState) => {
      // Migrate existing sites to have unique IDs if missing
      const migratedSites = loadedState.pinnedSites.map((site, idx) => ({
        ...site,
        id: site.id || `${site.url}-${Date.now()}-${idx}`,
      }))
      setState({ ...loadedState, pinnedSites: migratedSites })
      setCurrentUrl(loadedState.lastOpenedURL)
    })
  }, [])

  if (!state) return <div className="bg-theme-bg h-screen w-full" />

  const handleAddSite = async (url: string, name?: string) => {
    // Basic normalization: remove trailing slash
    const normalize = (u: string) => u.replace(/\/$/, '')
    const normalizedUrl = normalize(url)

    if (
      state.pinnedSites.some((site) => normalize(site.url) === normalizedUrl)
    ) {
      setShibaError('duplicateSite')
      setShibaTrigger((prev) => (prev > 0 ? -prev : prev - 1))
      return
    }

    const hostname = new URL(url).hostname
    const newSite: PinnedSite = {
      id: `${url}-${Date.now()}`,
      url,
      name: name || hostname,
      favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`,
    }

    const updatedSites = [...state.pinnedSites, newSite]
    try {
      await StorageService.setPinnedSites(updatedSites)
      setState({ ...state, pinnedSites: updatedSites })
      setCurrentUrl(url)
      await StorageService.setLastOpenedURL(url)

      // Switch to the last page where the new site is
      setPage(Math.ceil(updatedSites.length / itemsPerPage) - 1)
      setShibaError(null)
      setShibaTrigger((prev) => (prev < 0 ? -prev : prev + 1))
    } catch (error: unknown) {
      console.error('Failed to add site:', error)
      const errorKey =
        error instanceof Error && error.message === 'LIMIT_EXCEEDED_COUNT'
          ? 'limitExceededCount'
          : 'limitExceededSize'
      setShibaError(errorKey as TranslationKey)
      setShibaTrigger((prev) => (prev > 0 ? -prev : prev - 1))
    }
  }

  const handleRemoveSite = (index: number) => {
    setPendingDeletion(index)
  }

  const confirmRemoveSite = async (index: number) => {
    const updatedSites = [...state.pinnedSites]
    updatedSites.splice(index, 1)
    await StorageService.setPinnedSites(updatedSites)
    setState({ ...state, pinnedSites: updatedSites })

    // Adjust page if current is empty
    const newTotalPages = Math.ceil(updatedSites.length / itemsPerPage)
    if (page >= newTotalPages && page > 0) {
      setPage(newTotalPages - 1)
    }
    setPendingDeletion(null)
  }

  const handleReorderSites = async (from: number, to: number) => {
    const updatedSites = [...state.pinnedSites]
    const [moved] = updatedSites.splice(from, 1)
    updatedSites.splice(to, 0, moved)
    await StorageService.setPinnedSites(updatedSites)
    setState({ ...state, pinnedSites: updatedSites })
  }

  const handleToggleView = async (isMobile: boolean) => {
    await StorageService.setUseMobileView(isMobile)
    setState({ ...state, useMobileView: isMobile })
    chrome.runtime.sendMessage({
      type: 'TOGGLE_MOBILE_VIEW',
      enabled: isMobile,
    })
    // Force iframe reload if currentUrl exists
    if (currentUrl) {
      const temp = currentUrl
      setCurrentUrl(null)
      setTimeout(() => setCurrentUrl(temp), 10)
    }
  }

  const handleLoadSite = async (url: string) => {
    setCurrentUrl(url)
    await StorageService.setLastOpenedURL(url)
  }

  const handleUpdateTrigger = async (trigger: string) => {
    await StorageService.setTabTrigger(trigger)
    setState({ ...state!, tabTrigger: trigger })
  }

  const totalPages = Math.ceil(state.pinnedSites.length / itemsPerPage)
  const currentSites = state.pinnedSites.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  )

  const handlePageChange = (dir: number) => {
    setPage(Math.max(0, Math.min(totalPages - 1, page + dir)))
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        id="sidebark-container"
        className="flex flex-row-reverse h-screen w-full overflow-hidden bg-[#1a1a1a]"
      >
        <nav
          ref={navRef}
          id="nav-dock"
          className="w-[60px] flex flex-col pb-4 bg-theme-dock border-l border-theme-border z-50 items-center"
        >
          <ShibaCompanion
            onOpenSettings={() => setShowSettings(true)}
            reactionTrigger={shibaTrigger}
            errorMessage={shibaError ? t(shibaError) : undefined}
          />
          <SiteDock
            sites={currentSites}
            startIndex={page * itemsPerPage}
            currentUrl={currentUrl}
            pendingDeletion={pendingDeletion}
            onLoadSite={handleLoadSite}
            onRemoveSite={handleRemoveSite}
            onConfirmRemove={confirmRemoveSite}
            onCancelRemove={() => setPendingDeletion(null)}
            onReorder={handleReorderSites}
          />

          <div className="mt-auto flex flex-col gap-3 items-center w-full">
            {totalPages > 1 && (
              <div className="flex flex-col gap-2 items-center">
                <PageButton
                  dir={-1}
                  disabled={page === 0}
                  onPageChange={handlePageChange}
                  onDrop={(fromIdx) => {
                    const targetIdx = Math.max(0, (page - 1) * itemsPerPage)
                    handleReorderSites(fromIdx, targetIdx)
                    setPage(page - 1)
                  }}
                >
                  ▲
                </PageButton>
                <PageButton
                  dir={1}
                  disabled={page === totalPages - 1}
                  onPageChange={handlePageChange}
                  onDrop={(fromIdx) => {
                    const targetIdx = Math.min(
                      state.pinnedSites.length - 1,
                      (page + 1) * itemsPerPage
                    )
                    handleReorderSites(fromIdx, targetIdx)
                    setPage(page + 1)
                  }}
                >
                  ▼
                </PageButton>
              </div>
            )}

            <button
              onClick={() => setCurrentUrl(null)}
              className="w-10 h-10 rounded-full bg-shiba text-[#333333] text-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-lg"
              title={t('addSite')}
            >
              +
            </button>
          </div>
        </nav>

        <main className="flex-1 relative">
          {currentUrl ? (
            <SiteIframe url={currentUrl} />
          ) : (
            <Onboarding
              onPinCurrent={async () => {
                const [tab] = await chrome.tabs.query({
                  active: true,
                  currentWindow: true,
                })
                if (tab?.url) handleAddSite(tab.url, tab.title)
              }}
              onAddManual={handleAddSite}
            />
          )}

          {showSettings && (
            <SettingsOverlay
              useMobileView={state.useMobileView}
              onToggleView={handleToggleView}
              tabTrigger={state.tabTrigger}
              onUpdateTrigger={handleUpdateTrigger}
              onClose={() => setShowSettings(false)}
            />
          )}
        </main>
      </div>
    </DndProvider>
  )
}

export default App

interface PageButtonProps {
  dir: number
  disabled: boolean
  children: React.ReactNode
  onPageChange: (dir: number) => void
  onDrop: (fromIdx: number) => void
}

const PageButton = ({
  dir,
  disabled,
  children,
  onPageChange,
  onDrop,
}: PageButtonProps) => {
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastPageSwitch = useRef(0)

  const [{ isOver }, drop] = useDrop({
    accept: 'SITE',
    hover: () => {
      const now = Date.now()
      if (disabled || now - lastPageSwitch.current < 1000) return

      if (!hoverTimer.current) {
        hoverTimer.current = setTimeout(() => {
          onPageChange(dir)
          lastPageSwitch.current = Date.now()
          hoverTimer.current = null
        }, 800)
      }
    },
    drop: (item: { index: number }) => {
      if (disabled) return
      onDrop(item.index)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  })

  useEffect(() => {
    if (!isOver && hoverTimer.current) {
      clearTimeout(hoverTimer.current)
      hoverTimer.current = null
    }
  }, [isOver])

  return (
    <button
      ref={(node) => {
        drop(node)
      }}
      onClick={() => onPageChange(dir)}
      disabled={disabled}
      className={clsx(
        'w-10 h-8 flex items-center justify-center rounded transition-all shadow-sm',
        isOver
          ? 'bg-shiba text-[#333333] scale-110'
          : 'bg-theme-card text-theme-text',
        disabled
          ? 'opacity-30 cursor-not-allowed'
          : 'hover:text-shiba hover:scale-105 active:scale-95'
      )}
    >
      {children}
    </button>
  )
}
