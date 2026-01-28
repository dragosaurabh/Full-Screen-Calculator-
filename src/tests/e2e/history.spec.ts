/**
 * History E2E Tests
 * 
 * End-to-end tests for calculation history functionality.
 * Validates: Requirements 13.1, 13.2, 13.3, 13.4, 13.5
 */

import { test, expect } from '@playwright/test';

test.describe('History', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should add calculation to history', async ({ page }) => {
    // Perform a calculation
    await page.keyboard.type('2+2');
    await page.keyboard.press('Enter');
    
    // Open history panel
    await page.getByRole('button', { name: /history/i }).click();
    
    // Check that the calculation is in history
    await expect(page.getByText('2+2')).toBeVisible();
    await expect(page.getByText('4')).toBeVisible();
  });

  test('should recall expression from history', async ({ page }) => {
    // Perform a calculation
    await page.keyboard.type('5*5');
    await page.keyboard.press('Enter');
    
    // Clear expression
    await page.keyboard.press('Escape');
    
    // Open history and click on entry
    await page.getByRole('button', { name: /history/i }).click();
    await page.getByText('5*5').click();
    
    // Expression should be recalled
    await expect(page.getByTestId('expression')).toContainText('5*5');
  });

  test('should pin history entry', async ({ page }) => {
    // Perform a calculation
    await page.keyboard.type('10/2');
    await page.keyboard.press('Enter');
    
    // Open history
    await page.getByRole('button', { name: /history/i }).click();
    
    // Pin the entry
    await page.getByRole('button', { name: /pin/i }).first().click();
    
    // Entry should be marked as pinned
    await expect(page.getByRole('button', { name: /unpin/i })).toBeVisible();
  });

  test('should clear non-pinned history entries', async ({ page }) => {
    // Perform multiple calculations
    await page.keyboard.type('1+1');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Escape');
    
    await page.keyboard.type('2+2');
    await page.keyboard.press('Enter');
    
    // Open history
    await page.getByRole('button', { name: /history/i }).click();
    
    // Pin first entry
    await page.getByRole('button', { name: /pin/i }).first().click();
    
    // Clear history
    await page.getByRole('button', { name: /clear/i }).click();
    
    // Only pinned entry should remain
    await expect(page.getByText('1+1')).toBeVisible();
    await expect(page.getByText('2+2')).not.toBeVisible();
  });

  test('should persist history across page reloads', async ({ page }) => {
    // Perform a calculation
    await page.keyboard.type('7*8');
    await page.keyboard.press('Enter');
    
    // Reload page
    await page.reload();
    
    // Open history
    await page.getByRole('button', { name: /history/i }).click();
    
    // History should still contain the calculation
    await expect(page.getByText('7*8')).toBeVisible();
  });

  test('should show timestamp on history entries', async ({ page }) => {
    // Perform a calculation
    await page.keyboard.type('3+3');
    await page.keyboard.press('Enter');
    
    // Open history
    await page.getByRole('button', { name: /history/i }).click();
    
    // Should show some time indicator
    await expect(page.getByText(/just now|seconds ago|minutes ago/i)).toBeVisible();
  });
});

test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should open settings panel', async ({ page }) => {
    await page.getByRole('button', { name: /settings/i }).click();
    
    await expect(page.getByRole('dialog', { name: /settings/i })).toBeVisible();
  });

  test('should change precision setting', async ({ page }) => {
    await page.getByRole('button', { name: /settings/i }).click();
    
    // Find precision input and change it
    const precisionInput = page.getByLabel(/precision/i);
    await precisionInput.fill('15');
    
    // Close settings
    await page.getByRole('button', { name: /close/i }).click();
    
    // Perform calculation with many decimals
    await page.keyboard.type('1/3');
    await page.keyboard.press('Enter');
    
    // Result should show more decimal places
    const result = await page.getByTestId('result').textContent();
    expect(result?.split('.')[1]?.length).toBeGreaterThanOrEqual(10);
  });

  test('should toggle angle mode', async ({ page }) => {
    await page.getByRole('button', { name: /settings/i }).click();
    
    // Toggle to degrees
    await page.getByLabel(/degrees/i).click();
    
    // Close settings
    await page.getByRole('button', { name: /close/i }).click();
    
    // Switch to scientific mode
    await page.getByRole('tab', { name: /scientific/i }).click();
    
    // Calculate sin(90) - should be 1 in degrees
    await page.getByRole('button', { name: 'sin' }).click();
    await page.keyboard.type('90)');
    await page.keyboard.press('Enter');
    
    await expect(page.getByTestId('result')).toContainText('1');
  });

  test('should toggle high contrast mode', async ({ page }) => {
    await page.getByRole('button', { name: /settings/i }).click();
    
    // Toggle high contrast
    await page.getByLabel(/high contrast/i).click();
    
    // Check that high contrast class is applied
    await expect(page.locator('body')).toHaveClass(/high-contrast/);
  });

  test('should persist settings across page reloads', async ({ page }) => {
    await page.getByRole('button', { name: /settings/i }).click();
    
    // Change precision
    const precisionInput = page.getByLabel(/precision/i);
    await precisionInput.fill('12');
    
    // Close and reload
    await page.getByRole('button', { name: /close/i }).click();
    await page.reload();
    
    // Open settings again
    await page.getByRole('button', { name: /settings/i }).click();
    
    // Precision should still be 12
    await expect(page.getByLabel(/precision/i)).toHaveValue('12');
  });

  test('should show keyboard shortcuts help', async ({ page }) => {
    await page.getByRole('button', { name: /settings/i }).click();
    
    // Should show keyboard shortcuts section
    await expect(page.getByText(/keyboard shortcuts/i)).toBeVisible();
    await expect(page.getByText(/Enter/)).toBeVisible();
    await expect(page.getByText(/Escape/)).toBeVisible();
  });
});
