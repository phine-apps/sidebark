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
import Onboarding from '../../src/components/Onboarding'

describe('Onboarding', () => {
  const defaultProps = {
    onPinCurrent: vi.fn(),
    onAddManual: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render welcome message', () => {
    render(<Onboarding {...defaultProps} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('should render Shiba icon', () => {
    render(<Onboarding {...defaultProps} />)
    const img = screen.getByRole('img', { name: /shiba/i })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'icons/icon128.png')
  })

  it('should call onPinCurrent when Pin Current Tab button is clicked', () => {
    const onPinCurrent = vi.fn()
    render(<Onboarding {...defaultProps} onPinCurrent={onPinCurrent} />)

    fireEvent.click(
      screen.getByRole('button', { name: /pin current|現在のタブ|固定当前/i })
    )

    expect(onPinCurrent).toHaveBeenCalledTimes(1)
  })

  it('should render URL input field', () => {
    render(<Onboarding {...defaultProps} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('example.com')).toBeInTheDocument()
  })

  describe('Manual URL Addition', () => {
    it('should add https:// prefix when URL does not start with http', () => {
      const onAddManual = vi.fn()
      render(<Onboarding {...defaultProps} onAddManual={onAddManual} />)

      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'example.com' } })
      fireEvent.click(
        screen.getByRole('button', { name: /add site|サイトを追加|添加网站/i })
      )

      expect(onAddManual).toHaveBeenCalledWith('https://example.com')
    })

    it('should not add prefix when URL starts with http', () => {
      const onAddManual = vi.fn()
      render(<Onboarding {...defaultProps} onAddManual={onAddManual} />)

      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'http://example.com' } })
      fireEvent.click(
        screen.getByRole('button', { name: /add site|サイトを追加|添加网站/i })
      )

      expect(onAddManual).toHaveBeenCalledWith('http://example.com')
    })

    it('should not add prefix when URL starts with https', () => {
      const onAddManual = vi.fn()
      render(<Onboarding {...defaultProps} onAddManual={onAddManual} />)

      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'https://example.com' } })
      fireEvent.click(
        screen.getByRole('button', { name: /add site|サイトを追加|添加网站/i })
      )

      expect(onAddManual).toHaveBeenCalledWith('https://example.com')
    })

    it('should add site when Enter is pressed in input', () => {
      const onAddManual = vi.fn()
      render(<Onboarding {...defaultProps} onAddManual={onAddManual} />)

      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'example.com' } })
      fireEvent.keyDown(input, { key: 'Enter' })

      expect(onAddManual).toHaveBeenCalledWith('https://example.com')
    })

    it('should not add site when input is empty', () => {
      const onAddManual = vi.fn()
      render(<Onboarding {...defaultProps} onAddManual={onAddManual} />)

      fireEvent.click(
        screen.getByRole('button', { name: /add site|サイトを追加|添加网站/i })
      )

      expect(onAddManual).not.toHaveBeenCalled()
    })

    it('should not add site when Enter is pressed with empty input', () => {
      const onAddManual = vi.fn()
      render(<Onboarding {...defaultProps} onAddManual={onAddManual} />)

      const input = screen.getByRole('textbox')
      fireEvent.keyDown(input, { key: 'Enter' })

      expect(onAddManual).not.toHaveBeenCalled()
    })

    it('should clear input after adding site via button', () => {
      render(<Onboarding {...defaultProps} />)

      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'example.com' } })
      fireEvent.click(
        screen.getByRole('button', { name: /add site|サイトを追加|添加网站/i })
      )

      expect(input).toHaveValue('')
    })

    it('should clear input after adding site via Enter', () => {
      render(<Onboarding {...defaultProps} />)

      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'example.com' } })
      fireEvent.keyDown(input, { key: 'Enter' })

      expect(input).toHaveValue('')
    })
  })
})
