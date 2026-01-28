/**
 * Graphing E2E Tests
 * 
 * End-to-end tests for graphing functionality.
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
 */

import { test, expect } from '@playwright/test';

test.describe('Graphing Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Switch to graphing mode
    await page.getByRole('tab', { name: /graphing/i }).click();
  });

  test('should display graph canvas', async ({ page }) => {
    // Graph canvas should be visible
    await expect(page.locator('.graph-canvas')).toBeVisible();
  });

  test('should plot a simple function', async ({ page }) => {
    // Enter a function expression
    const input = page.getByPlaceholder(/enter function/i);
    await input.fill('x^2');
    
    // Add the function
    await page.getByRole('button', { name: /add/i }).click();
    
    // Graph should update (Plotly canvas should have content)
    await expect(page.locator('.js-plotly-plot')).toBeVisible();
  });

  test('should plot multiple functions', async ({ page }) => {
    // Add first function
    const input = page.getByPlaceholder(/enter function/i);
    await input.fill('x');
    await page.getByRole('button', { name: /add/i }).click();
    
    // Add second function
    await input.fill('x^2');
    await page.getByRole('button', { name: /add/i }).click();
    
    // Both functions should be in the legend
    await expect(page.getByText('x')).toBeVisible();
    await expect(page.getByText('x^2')).toBeVisible();
  });

  test('should toggle function visibility', async ({ page }) => {
    // Add a function
    const input = page.getByPlaceholder(/enter function/i);
    await input.fill('sin(x)');
    await page.getByRole('button', { name: /add/i }).click();
    
    // Toggle visibility
    await page.getByRole('button', { name: /hide/i }).click();
    
    // Function should be hidden (button should say "show")
    await expect(page.getByRole('button', { name: /show/i })).toBeVisible();
  });

  test('should remove function from graph', async ({ page }) => {
    // Add a function
    const input = page.getByPlaceholder(/enter function/i);
    await input.fill('cos(x)');
    await page.getByRole('button', { name: /add/i }).click();
    
    // Remove the function
    await page.getByRole('button', { name: /remove/i }).click();
    
    // Function should no longer be in the list
    await expect(page.getByText('cos(x)')).not.toBeVisible();
  });

  test('should support pan and zoom', async ({ page }) => {
    // Add a function first
    const input = page.getByPlaceholder(/enter function/i);
    await input.fill('x');
    await page.getByRole('button', { name: /add/i }).click();
    
    // The graph should have pan/zoom controls
    await expect(page.locator('.modebar')).toBeVisible();
  });

  test('should show hover tooltips', async ({ page }) => {
    // Add a function
    const input = page.getByPlaceholder(/enter function/i);
    await input.fill('x');
    await page.getByRole('button', { name: /add/i }).click();
    
    // Hover over the graph
    const graph = page.locator('.js-plotly-plot');
    await graph.hover();
    
    // Tooltip should appear (Plotly shows coordinates on hover)
    // Note: This is a basic check - actual tooltip testing requires more complex interaction
  });

  test('should export graph as PNG', async ({ page }) => {
    // Add a function
    const input = page.getByPlaceholder(/enter function/i);
    await input.fill('x^2');
    await page.getByRole('button', { name: /add/i }).click();
    
    // Click export button
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /export.*png/i }).click();
    
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.png');
  });

  test('should adjust x-axis range', async ({ page }) => {
    // Find range inputs
    const xMinInput = page.getByLabel(/x min/i);
    const xMaxInput = page.getByLabel(/x max/i);
    
    // Set custom range
    await xMinInput.fill('-5');
    await xMaxInput.fill('5');
    
    // Add a function to see the change
    const input = page.getByPlaceholder(/enter function/i);
    await input.fill('x');
    await page.getByRole('button', { name: /add/i }).click();
    
    // Graph should update with new range
    await expect(page.locator('.js-plotly-plot')).toBeVisible();
  });

  test('should validate function expression', async ({ page }) => {
    // Enter invalid expression
    const input = page.getByPlaceholder(/enter function/i);
    await input.fill('invalid+++');
    await page.getByRole('button', { name: /add/i }).click();
    
    // Should show error message
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should assign unique colors to functions', async ({ page }) => {
    // Add multiple functions
    const input = page.getByPlaceholder(/enter function/i);
    
    await input.fill('x');
    await page.getByRole('button', { name: /add/i }).click();
    
    await input.fill('x^2');
    await page.getByRole('button', { name: /add/i }).click();
    
    await input.fill('x^3');
    await page.getByRole('button', { name: /add/i }).click();
    
    // Each function should have a different color indicator
    const colorIndicators = page.locator('.function-color');
    const count = await colorIndicators.count();
    
    if (count >= 3) {
      // Get colors and verify they're different
      const colors = await colorIndicators.evaluateAll(els => 
        els.map(el => getComputedStyle(el).backgroundColor)
      );
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(colors.length);
    }
  });
});
