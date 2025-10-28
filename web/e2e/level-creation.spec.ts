import { test, expect } from '@playwright/test'

test.describe('Level Creation Flow', () => {
  test('should create and publish a level', async ({ page }) => {
    // Navigate to editor
    await page.goto('/editor')

    // Select game
    await page.selectOption('select', 'runner')

    // Enter level details
    await page.fill('input[placeholder="Enter level title"]', 'Test Level')
    await page.fill('textarea[placeholder="Describe your level..."]', 'A test level')

    // Add tags
    await page.fill('input[placeholder="Add tag and press Enter"]', 'easy')
    await page.keyboard.press('Enter')

    // Use editor canvas (simplified - would need more complex interaction)
    const canvas = page.locator('canvas')
    await expect(canvas).toBeVisible()

    // Save draft
    await page.click('text=Save Draft')
    await expect(page.locator('text=Draft Saved')).toBeVisible()

    // Publish level
    await page.click('text=Publish Level')

    // Should show success or redirect
    // Note: Would need API mocking for full test
  })

  test('should upload assets', async ({ page }) => {
    await page.goto('/editor')

    // Find file input
    const fileInput = page.locator('input[type="file"]')

    // Upload a test image
    await fileInput.setInputFiles({
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: Buffer.from('fake-image-data')
    })

    // Should show uploaded asset
    await expect(page.locator('text=test-image.png')).toBeVisible()
  })
})