/**
 * Accessibility E2E Tests
 * 
 * End-to-end tests for accessibility compliance using axe-core.
 * Validates: Requirements 18.1, 18.2, 18.3, 18.4, 18.5, 18.6
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('should have no accessibility violations on main page', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have no accessibility violations in scientific mode', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: /scientific/i }).click();
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have no accessibility violations in settings panel', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /settings/i }).click();
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have no accessibility violations in history panel', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /history/i }).click();
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Check that h1 exists
    await expect(page.locator('h1')).toBeVisible();
    
    // Check heading order
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    let lastLevel = 0;
    
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName);
      const level = parseInt(tagName.charAt(1));
      
      // Heading level should not skip more than one level
      expect(level - lastLevel).toBeLessThanOrEqual(1);
      lastLevel = level;
    }
  });

  test('should have proper landmark regions', async ({ page }) => {
    await page.goto('/');
    
    // Should have main landmark
    await expect(page.getByRole('main')).toBeVisible();
    
    // Should have navigation landmark
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('should have ARIA labels on interactive elements', async ({ page }) => {
    await page.goto('/');
    
    // All buttons should have accessible names
    const buttons = await page.getByRole('button').all();
    
    for (const button of buttons) {
      const name = await button.getAttribute('aria-label') || await button.textContent();
      expect(name?.trim().length).toBeGreaterThan(0);
    }
  });

  test('should announce results to screen readers', async ({ page }) => {
    await page.goto('/');
    
    // Check for ARIA live region
    const liveRegion = page.locator('[aria-live]');
    await expect(liveRegion).toBeVisible();
    
    // Perform a calculation
    await page.keyboard.type('2+2');
    await page.keyboard.press('Enter');
    
    // Result should be in a live region
    await expect(page.locator('[aria-live] >> text=4')).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    
    // First focusable element should be focused
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Continue tabbing
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');
      await expect(focused).toBeVisible();
    }
  });

  test('should have visible focus indicators', async ({ page }) => {
    await page.goto('/');
    
    // Tab to a button
    await page.keyboard.press('Tab');
    
    const focusedElement = page.locator(':focus');
    
    // Check that focus is visible (has outline or other indicator)
    const outlineStyle = await focusedElement.evaluate(el => {
      const style = getComputedStyle(el);
      return {
        outline: style.outline,
        boxShadow: style.boxShadow,
        border: style.border,
      };
    });
    
    // Should have some visible focus indicator
    const hasFocusIndicator = 
      outlineStyle.outline !== 'none' ||
      outlineStyle.boxShadow !== 'none' ||
      outlineStyle.border !== 'none';
    
    expect(hasFocusIndicator).toBe(true);
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    
    // Run axe specifically for color contrast
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .options({ runOnly: ['color-contrast'] })
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have minimum touch target size on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check button sizes
    const buttons = await page.getByRole('button').all();
    
    for (const button of buttons) {
      const box = await button.boundingBox();
      if (box) {
        // Minimum touch target is 44x44 pixels
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('should work with reduced motion preference', async ({ page }) => {
    // Emulate reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    
    // Page should still be functional
    await expect(page.getByRole('application', { name: 'Calculator' })).toBeVisible();
    
    // Perform a calculation
    await page.keyboard.type('1+1');
    await page.keyboard.press('Enter');
    
    await expect(page.getByTestId('result')).toContainText('2');
  });

  test('should support high contrast mode', async ({ page }) => {
    await page.goto('/');
    
    // Enable high contrast in settings
    await page.getByRole('button', { name: /settings/i }).click();
    await page.getByLabel(/high contrast/i).click();
    
    // Run accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
