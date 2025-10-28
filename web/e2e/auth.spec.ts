import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should load auth page', async ({ page }) => {
    await page.goto('/auth')
    await expect(page.locator('h1')).toContainText('Sign In')
  })

  test('should show guest play option', async ({ page }) => {
    await page.goto('/auth')
    await expect(page.locator('button')).toContainText('Play as Guest')
  })

  test('should have OAuth buttons', async ({ page }) => {
    await page.goto('/auth')
    await expect(page.locator('button')).toContainText('Google')
    await expect(page.locator('button')).toContainText('GitHub')
  })
})