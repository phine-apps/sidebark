import { test, expect } from './fixtures'

test('load extension and add site', async ({ page, extensionId }) => {
  // Load the sidepanel page
  await page.goto(`chrome-extension://${extensionId}/sidepanel.html`)

  // Verify welcome message
  await expect(page.getByText('Welcome to Sidebark!')).toBeVisible()

  // Add a site manually
  const url = 'https://example.com'
  await page.getByPlaceholder('example.com').fill(url)
  await page.getByRole('button', { name: 'Add Site' }).click()

  // Verify the site is added (iframe is shown)
  await expect(page.locator('iframe')).toHaveAttribute('src', url)

  // Verify Onboarding is gone
  await expect(page.getByText('Welcome to Sidebark!')).not.toBeVisible()
})

test('toggle settings', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/sidepanel.html`)

  // Click Shiba to open settings
  await page.locator('#nav-dock').getByAltText('Shiba').click()

  // Verify Settings overlay appears
  await expect(page.getByText('Settings')).toBeVisible()

  // Verify some settings content
  await expect(page.getByText('View Mode')).toBeVisible()

  // Close settings
  await page.getByText('Close').click()

  // Verify Settings overlay disappears
  await expect(page.getByText('Settings')).not.toBeVisible()
})
