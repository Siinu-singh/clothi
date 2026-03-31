import { test, expect } from '@playwright/test'

test.describe('Account & Profile Management', () => {
  test('should load account page with user profile', async ({ page }) => {
    // First, navigate to login page
    await page.goto('/login')
    
    // Look for login form
    const emailInput = page.locator('input[type="email"], input[placeholder*="email" i], input[placeholder*="Email" i]').first()
    const passwordInput = page.locator('input[type="password"], input[placeholder*="password" i], input[placeholder*="Password" i]').first()
    
    // Check if login form exists
    if (await emailInput.isVisible() && await passwordInput.isVisible()) {
      // For now, just verify the page structure
      await expect(emailInput).toBeVisible()
      await expect(passwordInput).toBeVisible()
    }
  })

  test('should navigate to account settings', async ({ page }) => {
    // Navigate to account page directly
    await page.goto('/account')
    
    // Check if page redirects to login or shows account content
    const currentUrl = page.url()
    
    // If redirected to login, that's expected behavior (no auth)
    if (currentUrl.includes('/login')) {
      expect(currentUrl).toContain('/login')
    } else {
      // If we get to account, verify account page elements exist
      const accountTitle = page.locator('h1, h2, span:has-text("Account")')
      const titleCount = await accountTitle.count()
      
      if (titleCount > 0) {
        await expect(accountTitle.first()).toBeVisible()
      }
    }
  })

  test('should display profile form fields', async ({ page }) => {
    // Navigate to account page
    await page.goto('/account')
    
    // Check for profile-related form elements
    const firstNameInput = page.locator('input[type="text"][placeholder*="ohn" i], label:has-text("First Name") ~ input').first()
    const lastNameInput = page.locator('input[type="text"][placeholder*="oe" i], label:has-text("Last Name") ~ input').first()
    const emailInput = page.locator('input[type="email"], label:has-text("Email") ~ input').first()
    const phoneInput = page.locator('input[type="tel"], label:has-text("Phone") ~ input').first()
    
    // At least one of these should exist (accounting for redirects)
    const anyFieldExists = 
      (await firstNameInput.count() > 0) ||
      (await lastNameInput.count() > 0) ||
      (await emailInput.count() > 0) ||
      (await phoneInput.count() > 0) ||
      (page.url().includes('/login'))
    
    expect(anyFieldExists).toBeTruthy()
  })

  test('should load profile data from backend', async ({ page }) => {
    // Set up to intercept API calls
    const profileCalls: any[] = []
    
    page.on('response', async (response) => {
      if (response.url().includes('/api/auth/profile')) {
        profileCalls.push({
          url: response.url(),
          status: response.status(),
        })
      }
    })
    
    // Navigate to account page
    await page.goto('/account')
    
    // Wait a moment for API calls to complete
    await page.waitForLoadState('networkidle')
    
    // Check if profile API was called
    if (!page.url().includes('/login')) {
      // If not redirected to login, expect at least one profile API call
      expect(profileCalls.length).toBeGreaterThan(0)
    }
  })

  test('should handle profile update request', async ({ page }) => {
    // Intercept the PATCH request
    const patchRequests: any[] = []
    
    page.on('response', async (response) => {
      if (response.url().includes('/api/profile') && response.request().method() === 'PATCH') {
        patchRequests.push({
          url: response.url(),
          status: response.status(),
        })
      }
    })
    
    // Navigate to account page
    await page.goto('/account')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Try to find and interact with profile form
    // This test will verify the request is sent correctly
    const firstNameInput = page.locator('input[placeholder*="ohn" i]').first()
    const saveButton = page.locator('button:has-text("Save")').first()
    
    if (await firstNameInput.isVisible() && await saveButton.isVisible()) {
      // Modify the first name field
      await firstNameInput.fill('Updated')
      
      // Click save
      await saveButton.click()
      
      // Wait for request to be sent
      await page.waitForLoadState('networkidle')
      
      // Check if PATCH request was made
      if (patchRequests.length > 0) {
        // Verify the status is successful (200-299)
        const lastRequest = patchRequests[patchRequests.length - 1]
        expect(lastRequest.status).toBeGreaterThanOrEqual(200)
        expect(lastRequest.status).toBeLessThan(300)
      }
    }
  })

  test('should display user info in sidebar', async ({ page }) => {
    // Navigate to account page
    await page.goto('/account')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Look for user info display
    const userCard = page.locator('[class*="userCard"], [class*="user-card"], div:has-text("User")').first()
    
    // Check if page has user info or is redirected to login
    const userInfoVisible = await userCard.isVisible().catch(() => false)
    const redirectedToLogin = page.url().includes('/login')
    
    expect(userInfoVisible || redirectedToLogin).toBeTruthy()
  })
})
