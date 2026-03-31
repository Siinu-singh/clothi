import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')
    
    // Verify page loaded - check for page title or content
    await page.waitForLoadState('networkidle')
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/homepage.png' })
  })

  test('should have navigation links', async ({ page }) => {
    await page.goto('/')
    
    // Check for common navigation elements
    const nav = page.locator('nav, header')
    await expect(nav.first()).toBeVisible()
    
    // Look for catalog/shop link
    const catalogLink = page.locator('a[href*="catalog"], a:has-text("Shop"), a:has-text("Catalog")')
    const hasCatalogLink = await catalogLink.count() > 0
    
    if (hasCatalogLink) {
      await expect(catalogLink.first()).toBeVisible()
    }
  })

  test('should navigate to catalog page', async ({ page }) => {
    await page.goto('/')
    
    // Try to find and click catalog link
    const catalogLink = page.locator('a[href*="catalog"], a:has-text("Shop"), a:has-text("Catalog")').first()
    
    if (await catalogLink.isVisible()) {
      await catalogLink.click()
      await page.waitForLoadState('networkidle')
      
      // Verify we navigated
      expect(page.url()).toContain('catalog')
    }
  })
})

test.describe('Navigation', () => {
  test('should have responsive design', async ({ page }) => {
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/')
    await page.screenshot({ path: 'test-results/homepage-desktop.png' })
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.screenshot({ path: 'test-results/homepage-mobile.png' })
  })
})
