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
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ShibaCompanion from '../../src/components/ShibaCompanion'

describe('ShibaCompanion', () => {
  it('should render the Shiba image', () => {
    render(<ShibaCompanion onOpenSettings={() => {}} />)

    const img = screen.getByRole('img', { name: /shiba/i })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'icons/icon48.png')
  })

  it('should call onOpenSettings when clicked', () => {
    const onOpenSettings = vi.fn()
    render(<ShibaCompanion onOpenSettings={onOpenSettings} />)

    const container = screen.getByRole('img', { name: /shiba/i }).parentElement
    fireEvent.click(container!)

    expect(onOpenSettings).toHaveBeenCalledTimes(1)
  })

  it('should display a message when reactionTrigger is positive', async () => {
    const { rerender } = render(
      <ShibaCompanion onOpenSettings={() => {}} reactionTrigger={0} />
    )

    // Initially no message
    expect(screen.queryByText(/woof|sniff|found/i)).not.toBeInTheDocument()

    // Trigger a positive reaction
    rerender(<ShibaCompanion onOpenSettings={() => {}} reactionTrigger={1} />)

    // A random message should appear
    await waitFor(() => {
      const bubble = document.querySelector('.bg-theme-bubble')
      expect(bubble).toBeInTheDocument()
    })
  })

  it('should display error message when reactionTrigger is negative', async () => {
    const errorMessage = 'Test error message'
    const { rerender } = render(
      <ShibaCompanion
        onOpenSettings={() => {}}
        reactionTrigger={0}
        errorMessage={errorMessage}
      />
    )

    // Trigger a negative reaction with error
    rerender(
      <ShibaCompanion
        onOpenSettings={() => {}}
        reactionTrigger={-1}
        errorMessage={errorMessage}
      />
    )

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('should display confirm dialog when confirmRequest is provided', () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()

    render(
      <ShibaCompanion
        onOpenSettings={() => {}}
        confirmRequest={{
          message: 'Are you sure?',
          onConfirm,
          onCancel,
        }}
      />
    )

    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /yes|はい|是/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /no|いいえ|否/i })
    ).toBeInTheDocument()
  })

  it('should call onConfirm when Yes button is clicked', () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()

    render(
      <ShibaCompanion
        onOpenSettings={() => {}}
        confirmRequest={{
          message: 'Are you sure?',
          onConfirm,
          onCancel,
        }}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /yes|はい|是/i }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onCancel).not.toHaveBeenCalled()
  })

  it('should call onCancel when No button is clicked', () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()

    render(
      <ShibaCompanion
        onOpenSettings={() => {}}
        confirmRequest={{
          message: 'Are you sure?',
          onConfirm,
          onCancel,
        }}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /no|いいえ|否/i }))
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('should not trigger settings when clicking confirm buttons', () => {
    const onOpenSettings = vi.fn()
    const onConfirm = vi.fn()

    render(
      <ShibaCompanion
        onOpenSettings={onOpenSettings}
        confirmRequest={{
          message: 'Test',
          onConfirm,
          onCancel: () => {},
        }}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /yes|はい|是/i }))
    expect(onOpenSettings).not.toHaveBeenCalled()
  })
})
