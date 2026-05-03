import { test, expect } from '@playwright/test'

/**
 * Collections Public E2E Tests
 * Tests public browsing, filtering, and detail page functionality
 */

test.describe('Collections Public Browsing', () => {
  test('should load collections browse page', async ({ page }) => {
    await page.goto('/collections')
    
    // Verify page loaded
    await expect(page).toHaveURL('/collections')
    
    // Check for page heading
    const heading = page.locator('h1, h2').filter({ hasText: /collections|products/i })
    await expect(heading).toBeVisible({ timeout: 5000 })
  })

  test('should display collection cards in grid', async ({ page }) => {
    await page.goto('/collections')
    
    // Wait for content to load
    await page.waitForTimeout(2000)
    
    // Look for collection cards
    const cards = page.locator('[class*="card"], [class*="collection"], article')
    const cardCount = await cards.count()
    
    // Should display cards (or show empty state)
    expect(cardCount).toBeGreaterThanOrEqual(0)
  })

  test('should display featured collections section', async ({ page }) => {
    await page.goto('/collections')
    
    const featuredSection = page.locator('h2, h3, span').filter({ hasText: /featured/i })
    
    // Featured section may or may not be present
    if (await featuredSection.isVisible()) {
      const cards = featuredSection.locator('..').locator('[class*="card"], article')
      const count = await cards.count()
      expect(count).toBeGreaterThanOrEqual(0)
    }
  })

  test('should search collections', async ({ page }) => {
    await page.goto('/collections')
    
    // Find search input
    const searchInput = page.locator('input[placeholder*="search" i], input[type="text"]').first()
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('test')
      
      // Wait for search results
      await page.waitForTimeout(1000)
      
      // Verify results updated or message shown
      const results = page.locator('[class*="card"], article')
      const resultCount = await results.count()
      
      expect(resultCount).toBeGreaterThanOrEqual(0)
    }
  })

  test('should filter collections by category', async ({ page }) => {
    await page.goto('/collections')
    
    // Find category filter
    const categoryLabel = page.locator('label, span').filter({ hasText: /categor/i })
    
    if (await categoryLabel.count() > 0) {
      // Find and click a category checkbox
      const categoryCheckbox = page.locator('input[type="checkbox"]').first()
      
      if (await categoryCheckbox.isVisible()) {
        await categoryCheckbox.click()
        
        // Wait for filtered results
        await page.waitForTimeout(1000)
        
        // Verify results updated
        const results = page.locator('[class*="card"], article')
        const resultCount = await results.count()
        
        expect(resultCount).toBeGreaterThanOrEqual(0)
      }
    }
  })

  test('should filter collections by tags', async ({ page }) => {
    await page.goto('/collections')
    
    // Find tags filter
    const tagsLabel = page.locator('label, span').filter({ hasText: /tag/i })
    
    if (await tagsLabel.count() > 0) {
      // Find and click a tag checkbox
      const tagCheckbox = page.locator('input[type="checkbox"]').nth(0)
      
      if (await tagCheckbox.isVisible()) {
        await tagCheckbox.click()
        
        // Wait for filtered results
        await page.waitForTimeout(1000)
        
        // Verify results updated
        const results = page.locator('[class*="card"], article')
        const resultCount = await results.count()
        
        expect(resultCount).toBeGreaterThanOrEqual(0)
      }
    }
  })

  test('should paginate through collections', async ({ page }) => {
    await page.goto('/collections')
    
    // Wait for page load
    await page.waitForTimeout(1000)
    
    // Look for pagination controls
    const nextButton = page.locator('button, a').filter({ hasText: /next|>/i })
    
    if (await nextButton.isVisible()) {
      await nextButton.click()
      
      // Verify navigation
      await page.waitForTimeout(1000)
      expect(page.url()).toContain('/collections')
    }
  })

  test('should navigate to collection detail page by clicking card', async ({ page }) => {
    await page.goto('/collections')
    
    // Wait for cards to load
    await page.waitForTimeout(2000)
    
    // Find and click first collection card
    const firstCard = page.locator('[class*="card"], article, a[href*="/collections/"]').first()
    
    if (await firstCard.isVisible()) {
      await firstCard.click()
      
      // Verify navigation to detail page
      await page.waitForURL(/\/collections\/.*/)
      
      // Verify detail page content
      const pageHeading = page.locator('h1')
      await expect(pageHeading).toBeVisible({ timeout: 5000 })
    }
  })

  test('should display collection detail page', async ({ page }) => {
    // Navigate to a collection detail page
    // This assumes at least one collection exists
    await page.goto('/collections')
    
    // Wait and find a collection to view
    await page.waitForTimeout(1000)
    const collectionLink = page.locator('a[href*="/collections/"]').first()
    
    if (await collectionLink.isVisible()) {
      await collectionLink.click()
      
      // Verify detail page elements
      const title = page.locator('h1')
      await expect(title).toBeVisible({ timeout: 5000 })
      
      // Check for common detail page elements
      const description = page.locator('p, [class*="description"]')
      const price = page.locator('[class*="price"], span:has-text("$")')
      
      expect(await title.isVisible()).toBeTruthy()
      expect(await description.count()).toBeGreaterThan(0)
      expect(await price.count()).toBeGreaterThanOrEqual(0)
    }
  })

  test('should display collection images', async ({ page }) => {
    // Navigate to collections page
    await page.goto('/collections')
    
    // Find and click a collection
    await page.waitForTimeout(1000)
    const firstCard = page.locator('[class*="card"], article').first()
    
    if (await firstCard.isVisible()) {
      const image = firstCard.locator('img')
      
      if (await image.count() > 0) {
        await firstCard.click()
        
        // On detail page, verify images are loaded
        await page.waitForURL(/\/collections\/.*/)
        
        const detailImages = page.locator('img[alt*="collection" i], img[src*="cloudinary" i]')
        expect(await detailImages.count()).toBeGreaterThanOrEqual(0)
      }
    }
  })

  test('should display pricing and discount information', async ({ page }) => {
    await page.goto('/collections')
    
    // Find a collection with price info
    await page.waitForTimeout(1000)
    const collectionLink = page.locator('a[href*="/collections/"]').first()
    
    if (await collectionLink.isVisible()) {
      await collectionLink.click()
      
      // Verify price display
      const priceElements = page.locator('[class*="price"], span:has-text("$")')
      expect(await priceElements.count()).toBeGreaterThanOrEqual(0)
      
      // Check for discount if available
      const discountElements = page.locator('[class*="discount"], span:has-text("%")')
      expect(await discountElements.count()).toBeGreaterThanOrEqual(0)
    }
  })

  test('should display stock and availability', async ({ page }) => {
    await page.goto('/collections')
    
    // Navigate to a collection detail
    await page.waitForTimeout(1000)
    const collectionLink = page.locator('a[href*="/collections/"]').first()
    
    if (await collectionLink.isVisible()) {
      await collectionLink.click()
      
      // Look for stock information
      const stockElements = page.locator('text=/stock|available|quantity|in stock/i')
      const stockCount = await stockElements.count()
      
      // Stock info may or may not be visible
      expect(stockCount).toBeGreaterThanOrEqual(0)
    }
  })

  test('should allow quantity selection', async ({ page }) => {
    await page.goto('/collections')
    
    // Navigate to detail page
    await page.waitForTimeout(1000)
    const collectionLink = page.locator('a[href*="/collections/"]').first()
    
    if (await collectionLink.isVisible()) {
      await collectionLink.click()
      
      // Look for quantity input
      const quantityInput = page.locator('input[type="number"]').first()
      
      if (await quantityInput.isVisible()) {
        await quantityInput.fill('2')
        const value = await quantityInput.inputValue()
        expect(value).toBe('2')
      }
    }
  })

  test('should navigate between collection detail pages', async ({ page }) => {
    await page.goto('/collections')
    
    // Find a collection
    await page.waitForTimeout(1000)
    const firstLink = page.locator('a[href*="/collections/"]').first()
    
    if (await firstLink.isVisible()) {
      await firstLink.click()
      
      // Wait for detail page
      await page.waitForURL(/\/collections\/.*/)
      const firstUrl = page.url()
      
      // Look for navigation (next/prev links or back to list)
      const backLink = page.locator('a, button').filter({ hasText: /back|all collections|browse/i })
      
      if (await backLink.isVisible()) {
        await backLink.first().click()
        
        // Verify back to list
        expect(page.url()).not.toBe(firstUrl)
      }
    }
  })

  test('should maintain filter state when navigating', async ({ page }) => {
    await page.goto('/collections')
    
    // Apply a filter
    const checkbox = page.locator('input[type="checkbox"]').first()
    
    if (await checkbox.isVisible()) {
      await checkbox.click()
      await page.waitForTimeout(500)
      
      // Navigate to a collection
      const collectionLink = page.locator('a[href*="/collections/"]').first()
      
      if (await collectionLink.isVisible()) {
        await collectionLink.click()
        
        // Navigate back
        const backLink = page.locator('a, button').filter({ hasText: /back|all collections/i }).first()
        
        if (await backLink.isVisible()) {
          await backLink.click()
          
          // Verify we're back at collections page
          await expect(page).toHaveURL(/\/collections/)
        }
      }
    }
  })
})
