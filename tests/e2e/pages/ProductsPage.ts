import { Page, Locator } from '@playwright/test'

/**
 * Page Object Model for the Products/Shop page
 */
export class ProductsPage {
  readonly page: Page
  readonly productCards: Locator
  readonly searchInput: Locator
  readonly categoryFilter: Locator
  readonly loadingSpinner: Locator
  readonly noProductsMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.productCards = page.locator('[data-testid="product-card"], .product-card, article')
    this.searchInput = page.locator('[data-testid="search-input"], input[type="search"], input[placeholder*="Search"]')
    this.categoryFilter = page.locator('[data-testid="category-filter"], select')
    this.loadingSpinner = page.locator('[data-testid="loading"], .loading, .spinner')
    this.noProductsMessage = page.locator('[data-testid="no-products"], text="No products"')
  }

  async goto() {
    await this.page.goto('/shop')
    await this.page.waitForLoadState('networkidle')
  }

  async getProductCount(): Promise<number> {
    return await this.productCards.count()
  }

  async clickProduct(index: number) {
    await this.productCards.nth(index).click()
  }

  async clickFirstProduct() {
    await this.productCards.first().click()
  }

  async searchProducts(query: string) {
    await this.searchInput.fill(query)
    await this.page.keyboard.press('Enter')
    await this.page.waitForLoadState('networkidle')
  }

  async filterByCategory(category: string) {
    await this.categoryFilter.selectOption(category)
    await this.page.waitForLoadState('networkidle')
  }
}
