import { Page, Locator } from '@playwright/test'

/**
 * Page Object Model for the Product Detail page
 */
export class ProductDetailPage {
  readonly page: Page
  readonly productTitle: Locator
  readonly productPrice: Locator
  readonly productDescription: Locator
  readonly mainImage: Locator
  readonly thumbnailImages: Locator
  readonly imageGallery: Locator
  readonly addToCartButton: Locator
  readonly quantityInput: Locator
  readonly sizeButtons: Locator
  readonly colorSwatches: Locator
  readonly wishlistButton: Locator
  readonly reviewsSection: Locator
  readonly reviewsList: Locator
  readonly reviewForm: Locator
  readonly similarSection: Locator
  readonly similarGrid: Locator
  readonly similarCards: Locator
  readonly loadMoreButton: Locator

  constructor(page: Page) {
    this.page = page
    // Product info selectors based on actual CSS classes
    this.productTitle = page.locator('[class*="title"]').first()
    this.productPrice = page.locator('[class*="price"]').first()
    this.productDescription = page.locator('[class*="description"]')
    
    // Image selectors
    this.mainImage = page.locator('[class*="mainImage"] img')
    this.imageGallery = page.locator('[class*="imageGallery"]')
    this.thumbnailImages = page.locator('[class*="thumbnail"]')
    
    // Action buttons
    this.addToCartButton = page.locator('button:has-text("ADD TO CART"), button:has-text("Adding...")')
    this.wishlistButton = page.locator('[class*="wishlistBtn"]')
    this.quantityInput = page.locator('input[type="number"][aria-label="Quantity"]')
    
    // Size and color
    this.sizeButtons = page.locator('[class*="sizeBtn"]')
    this.colorSwatches = page.locator('[class*="swatch"]')
    
    // Reviews section
    this.reviewsSection = page.locator('[class*="reviewsSection"]')
    this.reviewsList = page.locator('[class*="reviewsList"]')
    this.reviewForm = page.locator('form')
    
    // Similar products section
    this.similarSection = page.locator('[class*="similarSection"]')
    this.similarGrid = page.locator('[class*="similarGrid"]')
    this.similarCards = page.locator('[class*="similarCard"]')
    this.loadMoreButton = page.locator('button:has-text("LOAD MORE")')
  }

  async goto(productId: string) {
    await this.page.goto(`/product/${productId}`)
    await this.page.waitForLoadState('networkidle')
  }

  async waitForProductToLoad() {
    // Wait for loading to finish
    await this.page.waitForSelector('[class*="mainImage"] img', { timeout: 10000 }).catch(() => {})
  }

  async getProductTitle(): Promise<string> {
    await this.waitForProductToLoad()
    return await this.productTitle.textContent() || ''
  }

  async getProductPrice(): Promise<string> {
    return await this.productPrice.textContent() || ''
  }

  async clickThumbnail(index: number) {
    await this.thumbnailImages.nth(index).click()
  }

  async getThumbnailCount(): Promise<number> {
    return await this.thumbnailImages.count()
  }

  async addToCart() {
    await this.addToCartButton.click()
  }

  async setQuantity(quantity: number) {
    await this.quantityInput.fill(quantity.toString())
  }

  async selectSize(size: string) {
    await this.sizeButtons.filter({ hasText: size }).click()
  }

  async selectColor(index: number) {
    await this.colorSwatches.nth(index).click()
  }

  async getSimilarProductsCount(): Promise<number> {
    return await this.similarCards.count()
  }

  async clickLoadMoreSimilar() {
    await this.loadMoreButton.click()
    await this.page.waitForLoadState('networkidle')
  }

  async scrollToReviews() {
    const section = this.reviewsSection
    if (await section.isVisible().catch(() => false)) {
      await section.scrollIntoViewIfNeeded()
    }
  }

  async scrollToSimilarProducts() {
    const section = this.similarSection
    if (await section.isVisible().catch(() => false)) {
      await section.scrollIntoViewIfNeeded()
    }
  }

  async getReviewsCount(): Promise<number> {
    return await this.reviewsList.locator('[class*="reviewItem"]').count()
  }

  async isReviewsSectionVisible(): Promise<boolean> {
    return await this.reviewsSection.isVisible().catch(() => false)
  }

  async isSimilarSectionVisible(): Promise<boolean> {
    return await this.similarSection.isVisible().catch(() => false)
  }
}
