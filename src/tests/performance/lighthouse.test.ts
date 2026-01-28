/**
 * Lighthouse Performance Tests
 * 
 * Tests to verify Lighthouse performance metrics.
 * These tests check for performance best practices that contribute to high Lighthouse scores.
 * 
 * Note: Actual Lighthouse audits should be run in CI using lighthouse-ci.
 * These tests verify the prerequisites for good Lighthouse scores.
 * 
 * Validates: Requirements 21.5
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { resolve, join } from 'path';

// Get project root - works in both Node and Vitest environments
const projectRoot = process.cwd();

describe('Lighthouse Performance Prerequisites', () => {
  describe('Performance', () => {
    it('should have optimized images (SVG preferred)', () => {
      const assetsPath = resolve(projectRoot, 'src/assets');
      
      if (!existsSync(assetsPath)) {
        return; // Skip if assets folder doesn't exist
      }
      
      const files = readdirSync(assetsPath);
      const imageFiles = files.filter((f: string) =>
        f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.svg')
      );
      
      // SVG files are preferred for icons
      const svgFiles = imageFiles.filter((f: string) => f.endsWith('.svg'));
      const rasterFiles = imageFiles.filter((f: string) => !f.endsWith('.svg'));
      
      // Most images should be SVG for scalability and performance
      if (imageFiles.length > 0) {
        expect(svgFiles.length).toBeGreaterThanOrEqual(rasterFiles.length);
      }
    });

    it('should have minimal CSS', () => {
      const distPath = resolve(projectRoot, 'dist/assets');
      
      if (!existsSync(distPath)) {
        console.log('Skipping CSS size test - dist folder not found.');
        return;
      }
      
      const files = readdirSync(distPath);
      const cssFiles = files.filter((f: string) => f.endsWith('.css'));
      
      let totalCssSize = 0;
      for (const file of cssFiles) {
        const filePath = join(distPath, file);
        const stats = statSync(filePath);
        totalCssSize += stats.size;
      }
      
      // CSS should be under 100KB uncompressed
      const maxCssSize = 100 * 1024;
      console.log(`Total CSS size: ${(totalCssSize / 1024).toFixed(2)}KB`);
      expect(totalCssSize).toBeLessThan(maxCssSize);
    });

    it('should use code splitting for large dependencies', () => {
      const viteConfigPath = resolve(projectRoot, 'vite.config.ts');
      
      if (!existsSync(viteConfigPath)) {
        return;
      }
      
      const content = readFileSync(viteConfigPath, 'utf-8');
      
      // Should have manual chunks configuration for vendor splitting
      expect(content.includes('manualChunks') || content.includes('rollupOptions')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have proper HTML structure in index.html', () => {
      const indexPath = resolve(projectRoot, 'index.html');
      
      if (!existsSync(indexPath)) {
        return;
      }
      
      const content = readFileSync(indexPath, 'utf-8');
      
      // Should have lang attribute
      expect(content.includes('lang=')).toBe(true);
      
      // Should have viewport meta tag
      expect(content.includes('viewport')).toBe(true);
      
      // Should have title
      expect(content.includes('<title>')).toBe(true);
    });

    it('should have semantic HTML in components', () => {
      const shellPath = resolve(projectRoot, 'src/components/Calculator/CalculatorShell.tsx');
      
      if (!existsSync(shellPath)) {
        return;
      }
      
      const content = readFileSync(shellPath, 'utf-8');
      
      // Should use semantic elements
      expect(content.includes('<main') || content.includes('<section') || content.includes('<nav')).toBe(true);
      
      // Should have ARIA attributes
      expect(content.includes('aria-')).toBe(true);
      
      // Should have role attributes where needed
      expect(content.includes('role=')).toBe(true);
    });
  });

  describe('Best Practices', () => {
    it('should use HTTPS for external resources', () => {
      const indexPath = resolve(projectRoot, 'index.html');
      
      if (!existsSync(indexPath)) {
        return;
      }
      
      const content = readFileSync(indexPath, 'utf-8');
      
      // Should not have http:// URLs (except localhost)
      const httpMatches = content.match(/http:\/\/(?!localhost)/g);
      expect(httpMatches).toBeNull();
    });
  });
});
