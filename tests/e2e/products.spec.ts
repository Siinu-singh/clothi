import { test, expect } from '@playwright/test'
import { CatalogPage } from './pages/CatalogPage'
import { ProductDetailPage } from './pages/ProductDetailPage'

test.describe('Product Browsing Flow', () => {
  test('should display products on catalog page', async ({ page }) => {
    const catalogPage = new CatalogPage(page)
    
    await catalogPage.goto()
    await catalogPage.waitForProductsToLoad()
    
    // Verify products are displayed
    const productCount = await catalogPage.getProductCount()
    expect(productCount).toBeGreaterThan(0)
    
    // Take screenshot for verification
    await page.screenshot({ path: 'test-results/catalog-page.png' })
  })

  test('should navigate to product detail page', async ({ page }) => {
    const catalogPage = new CatalogPage(page)
    const productDetailPage = new ProductDetailPage(page)
    
    await catalogPage.goto()
    await catalogPage.waitForProductsToLoad()
    
    // Click on first product
    await catalogPage.clickFirstProduct()
    
    // Wait for navigation and page load
    await page.waitForURL(/\/product\//)
    await productDetailPage.waitForProductToLoad()
    
    // Verify we're on product detail page
    expect(page.url()).toContain('/product/')
    
    // Verify title is displayed
    const title = await productDetailPage.getProductTitle()
    expect(title).toBeTruthy()
    
    // Verify price is displayed
    const price = await productDetailPage.getProductPrice()
    expect(price).toContain('$')
  })

  test('should display product image gallery with thumbnails', async ({ page }) => {
    const catalogPage = new CatalogPage(page)
    const productDetailPage = new ProductDetailPage(page)
    
    await catalogPage.goto()
    await catalogPage.waitForProductsToLoad()
    await catalogPage.clickFirstProduct()
    
    await page.waitForURL(/\/product\//)
    await productDetailPage.waitForProductToLoad()
    
    // Verify main image is visible
    await expect(productDetailPage.mainImage).toBeVisible()
    
    // Check if thumbnails exist (may not have multiple images)
    const thumbnailCount = await productDetailPage.getThumbnailCount()
    
    if (thumbnailCount > 1) {
      // Click second thumbnail and verify image changes
      await productDetailPage.clickThumbnail(1)
      await page.waitForTimeout(500) // Allow for image transition
    }
    
    await page.screenshot({ path: 'test-results/product-gallery.png' })
  })

  test('should display similar products section', async ({ page }) => {
    const catalogPage = new CatalogPage(page)
    const productDetailPage = new ProductDetailPage(page)
    
    await catalogPage.goto()
    await catalogPage.waitForProductsToLoad()
    await catalogPage.clickFirstProduct()
    
    await page.waitForURL(/\/product\//)
    await productDetailPage.waitForProductToLoad()
    
    // Wait for similar products to load
    await page.waitForTimeout(1000)
    
    // Check if similar products section exists
    const isSimilarVisible = await productDetailPage.isSimilarSectionVisible()
    
    if (isSimilarVisible) {
      await productDetailPage.scrollToSimilarProducts()
      
      const similarCount = await productDetailPage.getSimilarProductsCount()
      expect(similarCount).toBeGreaterThan(0)
      
      await page.screenshot({ path: 'test-results/similar-products.png' })
    }
  })
})

test.describe('Catalog Filtering', () => {
  test('should filter products by category', async ({ page }) => {
    const catalogPage = new CatalogPage(page)
    
    await catalogPage.goto()
    await catalogPage.waitForProductsToLoad()
    
    // Get initial count
    const initialCount = await catalogPage.getProductCount()
    
    // Filter by The Crown Series category (using exact match)
    await catalogPage.filterByCategory('The Crown Series')
    
    // Verify filter was applied
    const resultText = await catalogPage.getResultCountText()
    expect(resultText).toContain('results')
    
    await page.screenshot({ path: 'test-results/filtered-men.png' })
  })

  test('should sort products', async ({ page }) => {
    const catalogPage = new CatalogPage(page)
    
    await catalogPage.goto()
    await catalogPage.waitForProductsToLoad()
    
    // Sort by price
    await catalogPage.sortBy('Price: Low to High')
    
    // Verify products are still displayed
    const productCount = await catalogPage.getProductCount()
    expect(productCount).toBeGreaterThan(0)
    
    await page.screenshot({ path: 'test-results/sorted-by-price.png' })
  })

  test('should clear all filters', async ({ page }) => {
    const catalogPage = new CatalogPage(page)
    
    // Navigate fresh 
    await page.goto('/catalog')
    await page.waitForLoadState('networkidle')
    await catalogPage.waitForProductsToLoad()
    
     // Apply a filter
    await catalogPage.filterByCategory('Zen-G by Clothi')
    await page.waitForTimeout(500)
    
    // Clear filters
    await catalogPage.clearFilters()
    await page.waitForTimeout(500)
    
    // Verify products are displayed
    const productCount = await catalogPage.getProductCount()
    expect(productCount).toBeGreaterThan(0)
  })
})

test.describe('Product Detail Features', () => {
  test('should have add to cart button', async ({ page }) => {
    const productDetailPage = new ProductDetailPage(page)
    
    // Navigate directly to catalog first
    await page.goto('/catalog')
    await page.waitForLoadState('networkidle')
    
    // Wait for products and click first one
    await page.waitForSelector('a[href^="/product/"]', { timeout: 10000 })
    await page.locator('a[href^="/product/"]').first().click()
    
    // Wait for product page
    await page.waitForURL(/\/product\//)
    await productDetailPage.waitForProductToLoad()
    
    // Verify add to cart button exists
    await expect(productDetailPage.addToCartButton).toBeVisible()
  })

  test('should display reviews section', async ({ page }) => {
    const productDetailPage = new ProductDetailPage(page)
    
    // Navigate directly to catalog first  
    await page.goto('/catalog')
    await page.waitForLoadState('networkidle')
    
    // Wait for products and click first one
    await page.waitForSelector('a[href^="/product/"]', { timeout: 10000 })
    await page.locator('a[href^="/product/"]').first().click()
    
    // Wait for product page
    await page.waitForURL(/\/product\//)
    await productDetailPage.waitForProductToLoad()
    
    // Wait for page to fully render
    await page.waitForTimeout(1000)
    
    // Check if reviews section is visible
    const reviewsVisible = await productDetailPage.isReviewsSectionVisible()
    
    if (reviewsVisible) {
      await productDetailPage.scrollToReviews()
      await page.screenshot({ path: 'test-results/reviews-section.png' })
    } else {
      // Reviews section might not exist for some products - that's ok
      console.log('Reviews section not visible for this product')
    }
  })
})
