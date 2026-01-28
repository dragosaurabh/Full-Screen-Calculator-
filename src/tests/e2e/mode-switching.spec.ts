/**
 * Mode Switching E2E Tests
 * 
 * End-to-end tests for switching between calculator modes.
 * Validates: Requirements 2.1, 17.7
 */

import { test, expect } from '@playwright/test';

test.describe('Mode Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should start in basic mode by default', async ({ page }) => {
    // Check that basic mode is selected
    await expect(page.getByRole('tab', { name: /basic/i, selected: true })).toBeVisible();
  });

  test('should switch to scientific mode', async ({ page }) => {
    await page.getByRole('tab', { name: /scientific/i }).click();
    
    // Scientific mode should be selected
    await expect(page.getByRole('tab', { name: /scientific/i, selected: true })).toBeVisible();
    
    // Scientific functions should be visible
    await expect(page.getByRole('button', { name: 'sin' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'cos' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'tan' })).toBeVisible();
  });

  test('should switch to programmer mode', async ({ page }) => {
    await page.getByRole('tab', { name: /programmer/i }).click();
    
    await expect(page.getByRole('tab', { name: /programmer/i, selected: true })).toBeVisible();
    
    // Programmer mode features should be visible
    await expect(page.getByRole('button', { name: 'HEX' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'BIN' })).toBeVisible();
  });

  test('should switch modes with Alt+number shortcuts', async ({ page }) => {
    // Alt+2 for scientific mode
    await page.keyboard.press('Alt+2');
    await expect(page.getByRole('tab', { name: /scientific/i, selected: true })).toBeVisible();
    
    // Alt+3 for programmer mode
    await page.keyboard.press('Alt+3');
    await expect(page.getByRole('tab', { name: /programmer/i, selected: true })).toBeVisible();
    
    // Alt+1 for basic mode
    await page.keyboard.press('Alt+1');
    await expect(page.getByRole('tab', { name: /basic/i, selected: true })).toBeVisible();
  });

  test('should preserve expression when switching modes', async ({ page }) => {
    // Enter an expression
    await page.keyboard.type('123');
    
    // Switch to scientific mode
    await page.getByRole('tab', { name: /scientific/i }).click();
    
    // Expression should still be there
    await expect(page.getByTestId('expression')).toContainText('123');
  });

  test('should switch to graphing mode', async ({ page }) => {
    await page.getByRole('tab', { name: /graphing/i }).click();
    
    await expect(page.getByRole('tab', { name: /graphing/i, selected: true })).toBeVisible();
  });

  test('should switch to matrix mode', async ({ page }) => {
    await page.getByRole('tab', { name: /matrix/i }).click();
    
    await expect(page.getByRole('tab', { name: /matrix/i, selected: true })).toBeVisible();
  });

  test('should switch to statistics mode', async ({ page }) => {
    await page.getByRole('tab', { name: /statistics/i }).click();
    
    await expect(page.getByRole('tab', { name: /statistics/i, selected: true })).toBeVisible();
  });

  test('should switch to financial mode', async ({ page }) => {
    await page.getByRole('tab', { name: /financial/i }).click();
    
    await expect(page.getByRole('tab', { name: /financial/i, selected: true })).toBeVisible();
  });

  test('should switch to converter mode', async ({ page }) => {
    await page.getByRole('tab', { name: /converter/i }).click();
    
    await expect(page.getByRole('tab', { name: /converter/i, selected: true })).toBeVisible();
  });

  test('mode tabs should be keyboard navigable', async ({ page }) => {
    // Focus on mode switcher
    await page.getByRole('tab', { name: /basic/i }).focus();
    
    // Navigate with arrow keys
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', { name: /scientific/i })).toBeFocused();
    
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', { name: /programmer/i })).toBeFocused();
  });
});
