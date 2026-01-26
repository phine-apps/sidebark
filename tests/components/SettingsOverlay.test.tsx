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
import SettingsOverlay from '../../src/components/SettingsOverlay'

describe('SettingsOverlay', () => {
  const defaultProps = {
    useMobileView: true,
    onToggleView: vi.fn(),
    tabTrigger: '@tab',
    onUpdateTrigger: vi.fn(),
    onClose: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render settings title', () => {
    render(<SettingsOverlay {...defaultProps} />)
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('should display view mode buttons', () => {
    render(<SettingsOverlay {...defaultProps} />)
    expect(
      screen.getByRole('button', { name: /mobile|モバイル|移动/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /pc/i })).toBeInTheDocument()
  })

  it('should highlight Mobile button when useMobileView is true', () => {
    render(<SettingsOverlay {...defaultProps} useMobileView={true} />)
    const mobileButton = screen.getByRole('button', {
      name: /mobile|モバイル|移动/i,
    })
    expect(mobileButton).toHaveClass('bg-shiba')
  })

  it('should highlight PC button when useMobileView is false', () => {
    render(<SettingsOverlay {...defaultProps} useMobileView={false} />)
    const pcButton = screen.getByRole('button', { name: /pc/i })
    expect(pcButton).toHaveClass('bg-shiba')
  })

  it('should call onToggleView with true when Mobile is clicked', () => {
    const onToggleView = vi.fn()
    render(<SettingsOverlay {...defaultProps} onToggleView={onToggleView} />)

    fireEvent.click(
      screen.getByRole('button', { name: /mobile|モバイル|移动/i })
    )
    expect(onToggleView).toHaveBeenCalledWith(true)
  })

  it('should call onToggleView with false when PC is clicked', () => {
    const onToggleView = vi.fn()
    render(<SettingsOverlay {...defaultProps} onToggleView={onToggleView} />)

    fireEvent.click(screen.getByRole('button', { name: /pc/i }))
    expect(onToggleView).toHaveBeenCalledWith(false)
  })

  describe('Tab Trigger Validation', () => {
    it('should display input with initial trigger value', () => {
      render(<SettingsOverlay {...defaultProps} tabTrigger="@link" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('@link')
    })

    it('should show error when trigger does not start with @', () => {
      render(<SettingsOverlay {...defaultProps} />)
      const input = screen.getByRole('textbox')

      fireEvent.change(input, { target: { value: 'tab' } })

      expect(screen.getByText(/must start with @|@で開始/i)).toBeInTheDocument()
    })

    it('should show error when trigger is less than 3 characters', () => {
      render(<SettingsOverlay {...defaultProps} />)
      const input = screen.getByRole('textbox')

      fireEvent.change(input, { target: { value: '@t' } })

      expect(screen.getByText(/at least 3|3文字以上/i)).toBeInTheDocument()
    })

    it('should show error when trigger contains non-alphanumeric characters', () => {
      render(<SettingsOverlay {...defaultProps} />)
      const input = screen.getByRole('textbox')

      fireEvent.change(input, { target: { value: '@tab!' } })

      // Check for error div specifically (not the example text)
      const errorDiv = document.querySelector('.text-red-500')
      expect(errorDiv).toBeInTheDocument()
      expect(errorDiv?.textContent).toMatch(/alphanumeric|英数字/i)
    })

    it('should accept valid trigger and call onUpdateTrigger', () => {
      const onUpdateTrigger = vi.fn()
      render(
        <SettingsOverlay {...defaultProps} onUpdateTrigger={onUpdateTrigger} />
      )
      const input = screen.getByRole('textbox')

      fireEvent.change(input, { target: { value: '@link' } })

      expect(onUpdateTrigger).toHaveBeenCalledWith('@link')
    })

    it('should not call onUpdateTrigger when validation fails', () => {
      const onUpdateTrigger = vi.fn()
      render(
        <SettingsOverlay {...defaultProps} onUpdateTrigger={onUpdateTrigger} />
      )
      const input = screen.getByRole('textbox')

      fireEvent.change(input, { target: { value: 'invalid' } })

      expect(onUpdateTrigger).not.toHaveBeenCalled()
    })
  })

  describe('Close functionality', () => {
    it('should call onClose when X button is clicked', () => {
      const onClose = vi.fn()
      render(<SettingsOverlay {...defaultProps} onClose={onClose} />)

      const closeButtons = screen.getAllByRole('button')
      const xButton = closeButtons[0] // X is first button
      fireEvent.click(xButton)

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('should call onClose when Close button is clicked', () => {
      const onClose = vi.fn()
      render(<SettingsOverlay {...defaultProps} onClose={onClose} />)

      fireEvent.click(
        screen.getByRole('button', { name: /close|閉じる|关闭/i })
      )

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('should disable Close button when there is a validation error', () => {
      render(<SettingsOverlay {...defaultProps} />)
      const input = screen.getByRole('textbox')

      fireEvent.change(input, { target: { value: 'invalid' } })

      const closeButton = screen.getByRole('button', {
        name: /close|閉じる|关闭/i,
      })
      expect(closeButton).toBeDisabled()
    })
  })

  it('should display data sync status', () => {
    render(<SettingsOverlay {...defaultProps} />)
    expect(screen.getByText(/enabled|有効|已启用/i)).toBeInTheDocument()
  })
})
