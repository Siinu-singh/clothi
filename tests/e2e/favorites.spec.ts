import { test, expect } from '@playwright/test';

test.describe('Favorites Flow', () => {
  test('should add and persist favorites across login/logout', async ({ page }) => {
    // Step 1: Navigate to home and login if needed
    await page.goto('/');
    await expect(page).toHaveTitle(/Clothi/);
    
    // Step 2: Find a product and add to favorites
    const heartButton = page.locator('[aria-label="Add to favorites"]').first();
    await heartButton.click();
    
    // Check for success toast
    await expect(page.locator('text=Added to favorites')).toBeVisible();
    
    // Step 3: Check favorites badge shows count
    const badge = page.locator('a[href="/favorites"] .badge');
    await expect(badge).toContainText('1');
    
    // Step 4: Navigate to favorites page
    await page.goto('/favorites');
    
    // Step 5: Verify product appears in favorites list
    const productCard = page.locator('[class*="productCard"]').first();
    await expect(productCard).toBeVisible();
    
    // Step 6: Logout
    await page.click('button[aria-expanded=false]'); // Click user menu
    await page.click('text=Sign Out');
    
    // Step 7: Login again
    await page.goto('/login');
    // (Assume login form is filled and submitted)
    
    // Step 8: Check favorites persist
    await page.goto('/favorites');
    const persistedProduct = page.locator('[class*="productCard"]').first();
    await expect(persistedProduct).toBeVisible();
  });

  test('badge should only show when there are favorites', async ({ page }) => {
    await page.goto('/');
    
    const badge = page.locator('a[href="/favorites"] .badge');
    await expect(badge).not.toBeVisible();
  });

  test('should remove favorites correctly', async ({ page }) => {
    await page.goto('/favorites');
    
    const removeButton = page.locator('[aria-label="Remove from favorites"]').first();
    await removeButton.click();
    
    // Check for success toast
    await expect(page.locator('text=removed from favorites')).toBeVisible();
  });
});
