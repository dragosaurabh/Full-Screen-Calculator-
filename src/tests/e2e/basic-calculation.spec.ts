/**
 * Basic Calculation E2E Tests
 * 
 * End-to-end tests for basic calculator operations.
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4
 */

import { test, expect } from '@playwright/test';

test.describe('Basic Calculation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display calculator on load', async ({ page }) => {
    // Check that the calculator is visible
    await expect(page.getByRole('application', { name: 'Calculator' })).toBeVisible();
    
    // Check that the display is visible
    await expect(page.getByLabel('Calculator display')).toBeVisible();
    
    // Check that the keypad is visible
    await expect(page.getByLabel('Calculator keypad')).toBeVisible();
  });

  test('should perform basic addition', async ({ page }) => {
    // Click number buttons
    await page.getByRole('button', { name: '2' }).click();
    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: '3' }).click();
    
    // Click equals
    await page.getByRole('button', { name: '=' }).click();
    
    // Check result
    await expect(page.getByTestId('result')).toContainText('5');
  });

  test('should perform basic subtraction', async ({ page }) => {
    await page.getByRole('button', { name: '7' }).click();
    await page.getByRole('button', { name: '-' }).click();
    await page.getByRole('button', { name: '4' }).click();
    await page.getByRole('button', { name: '=' }).click();
    
    await expect(page.getByTestId('result')).toContainText('3');
  });

  test('should perform basic multiplication', async ({ page }) => {
    await page.getByRole('button', { name: '6' }).click();
    await page.getByRole('button', { name: '×' }).click();
    await page.getByRole('button', { name: '8' }).click();
    await page.getByRole('button', { name: '=' }).click();
    
    await expect(page.getByTestId('result')).toContainText('48');
  });

  test('should perform basic division', async ({ page }) => {
    await page.getByRole('button', { name: '9' }).click();
    await page.getByRole('button', { name: '÷' }).click();
    await page.getByRole('button', { name: '3' }).click();
    await page.getByRole('button', { name: '=' }).click();
    
    await expect(page.getByTestId('result')).toContainText('3');
  });

  test('should handle keyboard input', async ({ page }) => {
    // Type expression using keyboard
    await page.keyboard.type('5+5');
    await page.keyboard.press('Enter');
    
    await expect(page.getByTestId('result')).toContainText('10');
  });

  test('should clear expression with C button', async ({ page }) => {
    await page.getByRole('button', { name: '1' }).click();
    await page.getByRole('button', { name: '2' }).click();
    await page.getByRole('button', { name: '3' }).click();
    
    // Clear
    await page.getByRole('button', { name: 'C' }).click();
    
    // Expression should be empty
    await expect(page.getByTestId('expression')).toHaveText('');
  });

  test('should clear with Escape key', async ({ page }) => {
    await page.keyboard.type('123');
    await page.keyboard.press('Escape');
    
    await expect(page.getByTestId('expression')).toHaveText('');
  });

  test('should handle decimal numbers', async ({ page }) => {
    await page.getByRole('button', { name: '3' }).click();
    await page.getByRole('button', { name: '.' }).click();
    await page.getByRole('button', { name: '1' }).click();
    await page.getByRole('button', { name: '4' }).click();
    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: '2' }).click();
    await page.getByRole('button', { name: '=' }).click();
    
    await expect(page.getByTestId('result')).toContainText('5.14');
  });

  test('should handle parentheses', async ({ page }) => {
    // (2 + 3) * 4 = 20
    await page.getByRole('button', { name: '(' }).click();
    await page.getByRole('button', { name: '2' }).click();
    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: '3' }).click();
    await page.getByRole('button', { name: ')' }).click();
    await page.getByRole('button', { name: '×' }).click();
    await page.getByRole('button', { name: '4' }).click();
    await page.getByRole('button', { name: '=' }).click();
    
    await expect(page.getByTestId('result')).toContainText('20');
  });

  test('should show error for division by zero', async ({ page }) => {
    await page.getByRole('button', { name: '5' }).click();
    await page.getByRole('button', { name: '÷' }).click();
    await page.getByRole('button', { name: '0' }).click();
    await page.getByRole('button', { name: '=' }).click();
    
    // Should show error message
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should handle backspace', async ({ page }) => {
    await page.keyboard.type('123');
    await page.keyboard.press('Backspace');
    
    await expect(page.getByTestId('expression')).toContainText('12');
  });
});
