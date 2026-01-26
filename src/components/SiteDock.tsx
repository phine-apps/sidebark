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

import { useDrag, useDrop } from 'react-dnd'
import { PinnedSite } from '../services/storage'
import clsx from 'clsx'
import { t } from '../i18n'

interface SiteDockProps {
  sites: PinnedSite[]
  startIndex: number
  currentUrl: string | null
  pendingDeletion: number | null
  onLoadSite: (url: string) => void
  onRemoveSite: (index: number) => void
  onConfirmRemove: (index: number) => void
  onCancelRemove: () => void
  onReorder: (from: number, to: number) => void
}

const ItemType = 'SITE'

interface DraggableItemProps {
  site: PinnedSite
  index: number
  isActive: boolean
  isPendingDelete: boolean
  onLoad: () => void
  onRemove: () => void
  onConfirm: () => void
  onCancel: () => void
  onMove: (from: number, to: number) => void
}

const DraggableItem = ({
  site,
  index,
  isActive,
  isPendingDelete,
  onLoad,
  onRemove,
  onConfirm,
  onCancel,
  onMove,
}: DraggableItemProps) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        onMove(item.index, index)
        item.index = index
      }
    },
  })

  return (
    <div
      ref={(node) => {
        drag(drop(node))
      }}
      className={clsx(
        'relative w-11 h-11 mb-3 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:scale-105 group',
        isActive
          ? 'bg-shiba/20 ring-1 ring-shiba shadow-[0_0_15px_rgba(245,158,11,0.3)]'
          : 'bg-theme-card hover:ring-1 hover:ring-shiba/50',
        isDragging && 'opacity-0'
      )}
      onClick={onLoad}
    >
      <img src={site.favicon} alt={site.name} className="w-8 h-8 rounded" />
      {!isPendingDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-30 shadow-sm"
        >
          ×
        </button>
      )}

      {isPendingDelete && (
        <div
          className="absolute right-14 top-1/2 -translate-y-1/2 bg-theme-bubble text-theme-bubble-text p-4 rounded-xl shadow-2xl z-[100] min-w-[220px] max-w-[calc(100vw-100px)] border border-theme-border flex flex-col gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-sm font-bold leading-relaxed">
            {t('confirmDelete')}
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={onConfirm}
              className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 transition-colors shadow-md active:scale-95"
            >
              {t('yes')}
            </button>
            <button
              onClick={onCancel}
              className="px-3 py-1.5 bg-gray-400 text-white text-xs font-bold rounded-lg hover:bg-gray-500 transition-colors shadow-md active:scale-95"
            >
              {t('no')}
            </button>
          </div>
          <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-theme-bubble"></div>
        </div>
      )}

      <div
        className={clsx(
          'absolute right-14 top-1 bg-shiba text-[#333333] px-3 py-1.5 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity truncate max-w-[calc(100vw-100px)] z-50 shadow-lg font-bold pointer-events-none',
          isPendingDelete && 'hidden'
        )}
        title={site.name}
      >
        {site.name}
      </div>
    </div>
  )
}

const SiteDock = ({
  sites,
  startIndex,
  currentUrl,
  pendingDeletion,
  onLoadSite,
  onRemoveSite,
  onConfirmRemove,
  onCancelRemove,
  onReorder,
}: SiteDockProps) => {
  return (
    <div className="flex flex-col items-center w-full pt-2 z-30 overflow-visible">
      {sites.map((site, index) => {
        const globalIndex = startIndex + index
        return (
          <DraggableItem
            key={site.id}
            site={site}
            index={globalIndex}
            isActive={currentUrl === site.url}
            isPendingDelete={pendingDeletion === globalIndex}
            onLoad={() => onLoadSite(site.url)}
            onRemove={() => onRemoveSite(globalIndex)}
            onConfirm={() => onConfirmRemove(globalIndex)}
            onCancel={onCancelRemove}
            onMove={onReorder}
          />
        )
      })}
    </div>
  )
}

export default SiteDock
