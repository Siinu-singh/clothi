import { Page, Locator } from '@playwright/test'

/**
 * Page Object Model for the Catalog page (product listing)
 */
export class CatalogPage {
  readonly page: Page
  readonly productCards: Locator
  readonly productGrid: Locator
  readonly categoryButtons: Locator
  readonly sizeButtons: Locator
  readonly sortDropdown: Locator
  readonly loadingIndicator: Locator
  readonly resultCount: Locator
  readonly clearFiltersBtn: Locator
  readonly loadMoreBtn: Locator

  constructor(page: Page) {
    this.page = page
    this.productCards = page.locator('a[href^="/product/"]')
    this.productGrid = page.locator('[class*="productGrid"]')
    this.categoryButtons = page.locator('[class*="categoryBtn"]')
    this.sizeButtons = page.locator('[class*="sizeBtn"]')
    this.sortDropdown = page.locator('select[aria-label="Sort products"]')
    this.loadingIndicator = page.locator('[aria-busy="true"]')
    this.resultCount = page.locator('[class*="resultCount"]')
    this.clearFiltersBtn = page.locator('button:has-text("CLEAR ALL")')
    this.loadMoreBtn = page.locator('button:has-text("DISCOVER MORE")')
  }

  async goto() {
    await this.page.goto('/catalog')
    await this.page.waitForLoadState('networkidle')
  }

  async waitForProductsToLoad() {
    // Wait for loading to finish
    await this.page.waitForFunction(() => {
      const loading = document.querySelector('[aria-busy="true"]')
      return !loading
    }, { timeout: 10000 }).catch(() => {})
    
    // Additional wait for products
    await this.page.waitForSelector('a[href^="/product/"]', { timeout: 10000 }).catch(() => {})
  }

  async getProductCount(): Promise<number> {
    await this.waitForProductsToLoad()
    return await this.productCards.count()
  }

  async clickProduct(index: number) {
    await this.waitForProductsToLoad()
    await this.productCards.nth(index).click()
  }

  async clickFirstProduct() {
    await this.waitForProductsToLoad()
    await this.productCards.first().click()
  }

  async filterByCategory(category: string) {
    // Use exact match to avoid "Men" matching "Women"
    await this.page.getByRole('button', { name: category, exact: true }).click()
    await this.waitForProductsToLoad()
  }

  async filterBySize(size: string) {
    await this.sizeButtons.filter({ hasText: size }).click()
  }

  async sortBy(option: string) {
    await this.sortDropdown.selectOption({ label: option })
    await this.waitForProductsToLoad()
  }

  async clearFilters() {
    await this.clearFiltersBtn.click()
    await this.waitForProductsToLoad()
  }

  async getResultCountText(): Promise<string> {
    return await this.resultCount.textContent() || ''
  }
}
