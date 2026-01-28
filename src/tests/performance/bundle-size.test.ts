/**
 * Bundle Size Performance Tests
 * 
 * Tests to verify bundle size stays under limits.
 * Validates: Requirements 21.4
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import { gzipSync } from 'zlib';

// Maximum allowed main bundle size in bytes (250KB gzipped)
// Note: Plotly is lazy-loaded separately and is ~1.5MB gzipped
const MAX_MAIN_BUNDLE_SIZE_GZIPPED = 250 * 1024;

// Get project root - works in both Node and Vitest environments
const projectRoot = process.cwd();

describe('Bundle Size', () => {
  it('main bundle (excluding lazy-loaded chunks) should be under 250KB gzipped', () => {
    const distPath = resolve(projectRoot, 'dist/assets');
    
    // Skip if dist doesn't exist (not built yet)
    if (!existsSync(distPath)) {
      console.log('Skipping bundle size test - dist folder not found. Run npm run build first.');
      return;
    }
    
    const files = readdirSync(distPath);
    // Only check main index bundle, exclude lazy-loaded chunks like react-plotly
    const mainJsFiles = files.filter((f: string) => 
      f.endsWith('.js') && 
      f.startsWith('index') && 
      !f.includes('plotly') &&
      !f.includes('chunk')
    );
    
    let totalGzippedSize = 0;
    
    for (const file of mainJsFiles) {
      const filePath = join(distPath, file);
      const content = readFileSync(filePath);
      const gzipped = gzipSync(content);
      totalGzippedSize += gzipped.length;
      console.log(`  ${file}: ${(gzipped.length / 1024).toFixed(2)}KB gzipped`);
    }
    
    console.log(`Total main bundle size (gzipped): ${(totalGzippedSize / 1024).toFixed(2)}KB`);
    
    expect(totalGzippedSize).toBeLessThan(MAX_MAIN_BUNDLE_SIZE_GZIPPED);
  });

  it('graphing module (Plotly) should be in a separate chunk', () => {
    const distPath = resolve(projectRoot, 'dist/assets');
    
    // Skip if dist doesn't exist
    if (!existsSync(distPath)) {
      console.log('Skipping lazy-load test - dist folder not found.');
      return;
    }
    
    const files = readdirSync(distPath);
    
    // Plotly should be in its own chunk (react-plotly-*.js)
    const plotlyChunk = files.find((f: string) => f.includes('plotly') && f.endsWith('.js'));
    expect(plotlyChunk).toBeDefined();
    
    // Main bundle should not contain the full plotly library
    const mainJsFiles = files.filter((f: string) => 
      f.endsWith('.js') && 
      f.startsWith('index')
    );
    
    for (const file of mainJsFiles) {
      const filePath = join(distPath, file);
      const content = readFileSync(filePath, 'utf-8');
      
      // Main bundle should not contain Plotly's core rendering code
      // (small references for lazy loading are OK)
      expect(content.includes('Plotly.newPlot')).toBe(false);
    }
  });

  it('programmer module code should be tree-shakeable', () => {
    const programmerPath = resolve(projectRoot, 'src/engine/modes/programmer.ts');
    
    if (!existsSync(programmerPath)) {
      console.log('Skipping programmer module test - file not found.');
      return;
    }
    
    const content = readFileSync(programmerPath, 'utf-8');
    
    // Should use named exports for tree-shaking
    expect(content.includes('export const')).toBe(true);
    
    // Should not have side effects at module level
    expect(content.includes('console.log')).toBe(false);
  });
});
