/*
 * Sidebark - Your loyal Shiba companion in the browser.
 * Copyright (C) 2026 phine-apps
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SiteIframe from '../../src/components/SiteIframe'

describe('SiteIframe', () => {
  it('should render iframe with provided URL', () => {
    render(<SiteIframe url="https://example.com" />)

    const iframe = screen.getByTitle('Content Viewer')
    expect(iframe).toBeInTheDocument()
    expect(iframe).toHaveAttribute('src', 'https://example.com')
  })

  it('should have full width and height', () => {
    render(<SiteIframe url="https://example.com" />)

    const iframe = screen.getByTitle('Content Viewer')
    expect(iframe).toHaveClass('w-full')
    expect(iframe).toHaveClass('h-full')
  })

  it('should have no border', () => {
    render(<SiteIframe url="https://example.com" />)

    const iframe = screen.getByTitle('Content Viewer')
    expect(iframe).toHaveClass('border-none')
  })

  it('should update src when URL prop changes', () => {
    const { rerender } = render(<SiteIframe url="https://example.com" />)

    const iframe = screen.getByTitle('Content Viewer')
    expect(iframe).toHaveAttribute('src', 'https://example.com')

    rerender(<SiteIframe url="https://another.com" />)
    expect(iframe).toHaveAttribute('src', 'https://another.com')
  })
})
