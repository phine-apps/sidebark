/*
 * Sidebark - Your loyal Shiba companion in the browser.
 * Copyright (C) 2026 phine-apps
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import SiteDock from '../../src/components/SiteDock'
import { PinnedSite } from '../../src/services/storage'

const mockSites: PinnedSite[] = [
  {
    id: '1',
    url: 'https://example.com',
    name: 'Example',
    favicon: 'https://example.com/favicon.ico',
  },
  {
    id: '2',
    url: 'https://test.com',
    name: 'Test',
    favicon: 'https://test.com/favicon.ico',
  },
]

const renderWithDnd = (ui: React.ReactElement) => {
  return render(<DndProvider backend={HTML5Backend}>{ui}</DndProvider>)
}

describe('SiteDock', () => {
  const defaultProps = {
    sites: mockSites,
    startIndex: 0,
    currentUrl: null,
    pendingDeletion: null,
    onLoadSite: vi.fn(),
    onRemoveSite: vi.fn(),
    onConfirmRemove: vi.fn(),
    onCancelRemove: vi.fn(),
    onReorder: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all site icons', () => {
    renderWithDnd(<SiteDock {...defaultProps} />)

    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(2)
    expect(images[0]).toHaveAttribute('src', 'https://example.com/favicon.ico')
    expect(images[1]).toHaveAttribute('src', 'https://test.com/favicon.ico')
  })

  it('should call onLoadSite when a site is clicked', () => {
    const onLoadSite = vi.fn()
    renderWithDnd(<SiteDock {...defaultProps} onLoadSite={onLoadSite} />)

    const siteItems = screen.getAllByRole('img')
    fireEvent.click(siteItems[0].parentElement!)

    expect(onLoadSite).toHaveBeenCalledWith('https://example.com')
  })

  it('should highlight active site', () => {
    renderWithDnd(
      <SiteDock {...defaultProps} currentUrl="https://example.com" />
    )

    const siteItems = screen.getAllByRole('img')
    const activeItem = siteItems[0].closest('.bg-shiba\\/20')
    expect(activeItem).toBeInTheDocument()
  })

  it('should show delete button on hover', async () => {
    renderWithDnd(<SiteDock {...defaultProps} />)

    const siteItems = screen.getAllByRole('img')
    const container = siteItems[0].parentElement!

    // Hover over the site
    fireEvent.mouseEnter(container)

    // Delete button should be present (even if opacity is 0)
    const deleteButton = container.querySelector('button')
    expect(deleteButton).toBeInTheDocument()
  })

  it('should call onRemoveSite when delete button is clicked', () => {
    const onRemoveSite = vi.fn()
    renderWithDnd(<SiteDock {...defaultProps} onRemoveSite={onRemoveSite} />)

    const siteItems = screen.getAllByRole('img')
    const container = siteItems[0].parentElement!
    const deleteButton = container.querySelector('button')

    fireEvent.click(deleteButton!)

    expect(onRemoveSite).toHaveBeenCalledWith(0) // startIndex + index
  })

  describe('Pending Deletion', () => {
    it('should show confirmation dialog when pendingDeletion matches index', () => {
      renderWithDnd(<SiteDock {...defaultProps} pendingDeletion={0} />)

      expect(screen.getByText(/sure|本当/i)).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /yes|はい|是/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /no|いいえ|否/i })
      ).toBeInTheDocument()
    })

    it('should not show confirmation dialog for other items', () => {
      renderWithDnd(<SiteDock {...defaultProps} pendingDeletion={1} />)

      // Only one confirmation dialog should appear
      const confirmDialogs = screen.getAllByText(/sure|本当/i)
      expect(confirmDialogs).toHaveLength(1)
    })

    it('should call onConfirmRemove when Yes is clicked', () => {
      const onConfirmRemove = vi.fn()
      renderWithDnd(
        <SiteDock
          {...defaultProps}
          pendingDeletion={0}
          onConfirmRemove={onConfirmRemove}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /yes|はい|是/i }))

      expect(onConfirmRemove).toHaveBeenCalledWith(0)
    })

    it('should call onCancelRemove when No is clicked', () => {
      const onCancelRemove = vi.fn()
      renderWithDnd(
        <SiteDock
          {...defaultProps}
          pendingDeletion={0}
          onCancelRemove={onCancelRemove}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /no|いいえ|否/i }))

      expect(onCancelRemove).toHaveBeenCalledTimes(1)
    })
  })

  describe('Start Index Offset', () => {
    it('should correctly calculate global index with startIndex offset', () => {
      const onRemoveSite = vi.fn()
      renderWithDnd(
        <SiteDock
          {...defaultProps}
          startIndex={5}
          onRemoveSite={onRemoveSite}
        />
      )

      const siteItems = screen.getAllByRole('img')
      const container = siteItems[0].parentElement!
      const deleteButton = container.querySelector('button')

      fireEvent.click(deleteButton!)

      // Should be startIndex (5) + local index (0) = 5
      expect(onRemoveSite).toHaveBeenCalledWith(5)
    })

    it('should correctly highlight active site with startIndex offset', () => {
      renderWithDnd(
        <SiteDock
          {...defaultProps}
          startIndex={5}
          currentUrl="https://test.com"
        />
      )

      const siteItems = screen.getAllByRole('img')
      // Second item should be active
      const activeItem = siteItems[1].closest('.bg-shiba\\/20')
      expect(activeItem).toBeInTheDocument()
    })
  })

  it('should render empty when sites array is empty', () => {
    const { container } = renderWithDnd(
      <SiteDock {...defaultProps} sites={[]} />
    )

    const images = container.querySelectorAll('img')
    expect(images).toHaveLength(0)
  })
})
