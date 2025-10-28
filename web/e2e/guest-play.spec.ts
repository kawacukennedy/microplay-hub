import { test, expect } from '@playwright/test'

test.describe('Guest Play Flow', () => {
  test('should complete full guest play flow', async ({ page }) => {
    // Start on landing page
    await page.goto('/')

    // Click play now
    await page.click('text=Play Now')

    // Should redirect to games page
    await expect(page).toHaveURL(/\/games/)

    // Click on Runner game
    await page.click('text=Runner')

    // Should show game levels or direct play
    await expect(page).toHaveURL(/\/games\/runner/)

    // For now, assume direct play - click play
    await page.click('text=Play Now')

    // Should load game
    await expect(page.locator('canvas')).toBeVisible()

    // Wait for game to load (simplified - in real test would wait for specific game state)
    await page.waitForTimeout(2000)

    // Game should be playable
    // Note: Actual game interaction would require more complex test setup
  })

  test('should handle guest session creation', async ({ page }) => {
    await page.goto('/auth')

    // Click guest play
    await page.click('text=Play as Guest')

    // Should create session and redirect
    // Check for session cookie
    const cookies = await page.context().cookies()
    const guestCookie = cookies.find(cookie => cookie.name === 'guest_session')
    expect(guestCookie).toBeTruthy()
  })
})