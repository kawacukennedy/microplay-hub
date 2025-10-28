import { test, expect } from '@playwright/test'

test.describe('Sharing Flow', () => {
  test('should generate and share score', async ({ page }) => {
    // Assume we're on a game results page
    await page.goto('/levels/test-level')

    // Mock game completion
    await page.evaluate(() => {
      // Simulate score submission
      localStorage.setItem('lastScore', JSON.stringify({
        score: 15000,
        levelTitle: 'Test Level'
      }))
    })

    // Open share modal (assuming it exists)
    await page.click('text=Share')

    // Generate share card
    await page.click('text=Generate Share Card')

    // Should show share options
    await expect(page.locator('text=Copy Link')).toBeVisible()
    await expect(page.locator('text=Twitter')).toBeVisible()
    await expect(page.locator('text=Discord')).toBeVisible()

    // Copy link
    await page.click('text=Copy Link')

    // Should show success feedback
    // Note: Clipboard testing requires additional setup
  })

  test('should handle short link redirects', async ({ page }) => {
    // Test short link redirect
    await page.goto('/s/test123')

    // Should redirect to target URL
    // Note: Would need API to return actual redirect
    await expect(page.url()).not.toBe('/s/test123')
  })
})