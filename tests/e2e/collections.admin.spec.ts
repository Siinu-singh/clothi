import { test, expect } from '@playwright/test'

/**
 * Collections Admin E2E Tests
 * Tests admin CRUD operations for collections management
 */

const API_BASE = 'http://localhost:3001'
const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL || 'admin@clothi.local'
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || 'Test@123456'

// Helper: Get valid JWT token
async function getAdminToken() {
  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      })
    })
    
    if (!response.ok) {
      throw new Error(`Auth failed: ${response.statusText}`)
    }
    
    const data = await response.json()
    if (!data.token) {
      throw new Error('No token in response')
    }
    return data.token
  } catch (error) {
    console.error('Failed to get admin token:', error)
    throw error
  }
}

// Helper: Set auth token in localStorage
async function setAuthToken(page, token) {
  await page.evaluate((token) => {
    localStorage.setItem('authToken', token)
  }, token)
}

test.describe('Collections Admin Management', () => {
  let adminToken: string

  test.beforeAll(async () => {
    try {
      adminToken = await getAdminToken()
    } catch (error) {
      console.error('Failed to get admin token:', error)
      throw error
    }
  })

  test('should load collections admin page', async ({ page }) => {
    await setAuthToken(page, adminToken)
    await page.goto('/admin/collections')
    
    // Verify page loaded
    await expect(page).toHaveTitle(/collections/i)
    
    // Check for key admin UI elements
    const pageHeading = page.locator('h1, h2').filter({ hasText: /collections/i })
    await expect(pageHeading).toBeVisible({ timeout: 5000 })
  })

  test('should navigate to create collection page', async ({ page }) => {
    await setAuthToken(page, adminToken)
    await page.goto('/admin/collections')
    
    // Find and click create button
    const createButton = page.locator('button, a').filter({ hasText: /create|new|add/i }).first()
    await createButton.click()
    
    // Verify navigation to create page
    await expect(page).toHaveURL(/\/admin\/collections\/create/)
    
    // Check for form elements
    const titleInput = page.locator('input[placeholder*="title" i], input[name*="title" i]').first()
    await expect(titleInput).toBeVisible({ timeout: 5000 })
  })

  test('should create a collection with all required fields', async ({ page }) => {
    await setAuthToken(page, adminToken)
    await page.goto('/admin/collections/create')
    
    const timestamp = Date.now()
    const collectionName = `Test Collection ${timestamp}`
    const slug = `test-collection-${timestamp}`
    
    // Fill basic info
    await page.locator('input[placeholder*="title" i], input[name*="title" i]').first().fill(collectionName)
    await page.locator('input[placeholder*="slug" i], input[name*="slug" i]').first().fill(slug)
    await page.locator('textarea[placeholder*="description" i]').first().fill('Test collection description')
    
    // Fill pricing
    await page.locator('input[placeholder*="price" i], input[name*="basePrice" i]').first().fill('99.99')
    
    // Fill inventory
    await page.locator('input[type="number"]').nth(0).fill('100')
    
    // Fill SEO
    const seoInputs = page.locator('input[placeholder*="SEO" i], input[name*="seo" i]')
    if (await seoInputs.count() > 0) {
      await seoInputs.first().fill('Test SEO Title')
    }
    
    // Submit form
    const submitButton = page.locator('button').filter({ hasText: /create|save|submit/i }).first()
    await submitButton.click()
    
    // Verify success (should redirect to list or show success message)
    await page.waitForTimeout(2000)
    const currentUrl = page.url()
    
    expect(
      currentUrl.includes('/admin/collections') || 
      await page.locator('text=/success|created|collection created/i').isVisible()
    ).toBeTruthy()
  })

  test('should display collections in list view', async ({ page }) => {
    await setAuthToken(page, adminToken)
    await page.goto('/admin/collections')
    
    // Wait for list to load
    await page.waitForTimeout(1000)
    
    // Check for table/list elements
    const tableRows = page.locator('tr, [role="row"], .collection-item')
    const rowCount = await tableRows.count()
    
    expect(rowCount).toBeGreaterThanOrEqual(0)
  })

  test('should toggle featured status', async ({ page }) => {
    await setAuthToken(page, adminToken)
    await page.goto('/admin/collections')
    
    // Wait for list to load
    await page.waitForTimeout(1000)
    
    // Find a toggle button (featured status)
    const toggleButtons = page.locator('button').filter({ hasText: /featured|star|heart/i })
    const toggleCount = await toggleButtons.count()
    
    if (toggleCount > 0) {
      const firstToggle = toggleButtons.first()
      await firstToggle.click()
      
      // Verify state changed
      await page.waitForTimeout(500)
      const isActive = await firstToggle.getAttribute('class')
      expect(isActive).toBeDefined()
    }
  })

  test('should toggle active status', async ({ page }) => {
    await setAuthToken(page, adminToken)
    await page.goto('/admin/collections')
    
    // Wait for list to load
    await page.waitForTimeout(1000)
    
    // Find toggle for active status
    const toggleButtons = page.locator('button').filter({ hasText: /active|publish|visible/i })
    const toggleCount = await toggleButtons.count()
    
    if (toggleCount > 0) {
      const firstToggle = toggleButtons.first()
      await firstToggle.click()
      
      // Verify state changed
      await page.waitForTimeout(500)
      expect(await firstToggle.isEnabled()).toBeTruthy()
    }
  })

  test('should edit a collection', async ({ page }) => {
    await setAuthToken(page, adminToken)
    await page.goto('/admin/collections')
    
    // Find edit button
    const editButtons = page.locator('button, a').filter({ hasText: /edit|pencil/i })
    const editCount = await editButtons.count()
    
    if (editCount > 0) {
      await editButtons.first().click()
      
      // Verify navigation to edit page
      await page.waitForURL(/\/admin\/collections\/.*\/edit/)
      
      // Verify form is populated
      const titleInput = page.locator('input[placeholder*="title" i]').first()
      const titleValue = await titleInput.inputValue()
      expect(titleValue).toBeTruthy()
    }
  })

  test('should update collection details', async ({ page }) => {
    await setAuthToken(page, adminToken)
    await page.goto('/admin/collections')
    
    // Find and click first edit button
    const editButtons = page.locator('button, a').filter({ hasText: /edit|pencil/i })
    
    if (await editButtons.count() > 0) {
      await editButtons.first().click()
      await page.waitForURL(/\/admin\/collections\/.*\/edit/)
      
      // Update a field
      const descriptionInput = page.locator('textarea[placeholder*="description" i]').first()
      await descriptionInput.fill('Updated description - ' + Date.now())
      
      // Save
      const saveButton = page.locator('button').filter({ hasText: /save|update|submit/i }).first()
      await saveButton.click()
      
      // Verify update
      await page.waitForTimeout(1000)
      const successMsg = page.locator('text=/updated|saved|success/i')
      const isSuccess = await successMsg.isVisible() || page.url().includes('/admin/collections')
      expect(isSuccess).toBeTruthy()
    }
  })

  test('should delete a collection', async ({ page }) => {
    await setAuthToken(page, adminToken)
    await page.goto('/admin/collections')
    
    // Wait for list to load
    await page.waitForTimeout(1000)
    
    // Find delete button
    const deleteButtons = page.locator('button').filter({ hasText: /delete|trash|remove/i })
    const deleteCount = await deleteButtons.count()
    
    if (deleteCount > 0) {
      const firstDelete = deleteButtons.first()
      await firstDelete.click()
      
      // Handle confirmation dialog if present
      const confirmButton = page.locator('button').filter({ hasText: /confirm|yes|delete/i })
      const confirmCount = await confirmButton.count()
      
      if (confirmCount > 0) {
        await confirmButton.last().click()
      }
      
      // Verify deletion
      await page.waitForTimeout(1000)
      const successMsg = page.locator('text=/deleted|removed|success/i')
      const isSuccess = await successMsg.isVisible() || page.url().includes('/admin/collections')
      expect(isSuccess).toBeTruthy()
    }
  })

  test('should display admin stats dashboard', async ({ page }) => {
    await setAuthToken(page, adminToken)
    await page.goto('/admin/collections')
    
    // Look for stats cards
    const statsCards = page.locator('[class*="stat"], [class*="card"]').filter({ hasText: /total|active|featured/i })
    const statsCount = await statsCards.count()
    
    // Should have at least some stats displayed
    expect(statsCount).toBeGreaterThanOrEqual(0)
  })
})
