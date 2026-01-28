/**
 * GraphCanvas Component
 * 
 * Plotly.js wrapper for function plotting.
 * Supports pan, zoom, hover tooltips, and multiple series.
 * 
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
 */

import React, { useMemo, useCallback, lazy, Suspense } from 'react';
import type { GraphFunction } from '../../types';

// Lazy load Plotly to reduce initial bundle size
const Plot = lazy(() => import('react-plotly.js'));

export interface GraphCanvasProps {
  functions: GraphFunction[];
  xRange: [number, number];
  yRange: [number, number];
  onRangeChange: (xRange: [number, number], yRange: [number, number]) => void;
  onExport?: (format: 'png' | 'svg') => void;
  width?: number | string;
  height?: number | string;
}

// Generate distinct colors for graph series
const SERIES_COLORS = [
  '#2563eb', // blue
  '#dc2626', // red
  '#16a34a', // green
  '#9333ea', // purple
  '#ea580c', // orange
  '#0891b2', // cyan
  '#be185d', // pink
  '#65a30d', // lime
  '#7c3aed', // violet
  '#0d9488', // teal
];

/**
 * Sample a function expression to generate plot data
 */
function sampleFunction(
  expression: string,
  xRange: [number, number],
  numPoints: number = 500
): { x: number[]; y: number[] } {
  const [xMin, xMax] = xRange;
  const step = (xMax - xMin) / numPoints;
  const x: number[] = [];
  const y: number[] = [];
  
  // Create a safe evaluation function
  const evalExpr = (xVal: number): number => {
    try {
      // Replace common math functions and x variable
      const expr = expression
        .replace(/\bx\b/g, `(${xVal})`)
        .replace(/\bsin\b/g, 'Math.sin')
        .replace(/\bcos\b/g, 'Math.cos')
        .replace(/\btan\b/g, 'Math.tan')
        .replace(/\bsqrt\b/g, 'Math.sqrt')
        .replace(/\babs\b/g, 'Math.abs')
        .replace(/\bexp\b/g, 'Math.exp')
        .replace(/\blog\b/g, 'Math.log')
        .replace(/\bln\b/g, 'Math.log')
        .replace(/\bpi\b/gi, 'Math.PI')
        .replace(/\be\b/g, 'Math.E')
        .replace(/\^/g, '**');
      
      // eslint-disable-next-line no-eval
      const result = eval(expr);
      return typeof result === 'number' && isFinite(result) ? result : NaN;
    } catch {
      return NaN;
    }
  };
  
  for (let i = 0; i <= numPoints; i++) {
    const xVal = xMin + i * step;
    const yVal = evalExpr(xVal);
    x.push(xVal);
    y.push(yVal);
  }
  
  return { x, y };
}

export function GraphCanvas({
  functions,
  xRange,
  yRange,
  onRangeChange,
  width = '100%',
  height = 400,
}: GraphCanvasProps): React.ReactElement {
  // Generate plot data for each function
  const plotData = useMemo(() => {
    return functions
      .filter(fn => fn.visible)
      .map((fn, index) => {
        const { x, y } = sampleFunction(fn.expression, xRange);
        return {
          x,
          y,
          type: 'scatter' as const,
          mode: 'lines' as const,
          name: fn.expression,
          line: {
            color: fn.color || SERIES_COLORS[index % SERIES_COLORS.length] || '#2563eb',
            width: 2,
          },
          hovertemplate: `x: %{x:.4f}<br>y: %{y:.4f}<extra>${fn.expression}</extra>`,
        };
      });
  }, [functions, xRange]);

  // Handle range changes from Plotly interactions
  const handleRelayout = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any) => {
      if (event['xaxis.range[0]'] !== undefined && event['xaxis.range[1]'] !== undefined) {
        const newXRange: [number, number] = [
          event['xaxis.range[0]'] as number,
          event['xaxis.range[1]'] as number,
        ];
        const newYRange: [number, number] = event['yaxis.range[0]'] !== undefined
          ? [event['yaxis.range[0]'] as number, event['yaxis.range[1]'] as number]
          : yRange;
        onRangeChange(newXRange, newYRange);
      }
    },
    [onRangeChange, yRange]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const layout: any = useMemo(() => ({
    xaxis: {
      range: xRange,
      title: 'x',
      gridcolor: '#e5e7eb',
      zerolinecolor: '#9ca3af',
    },
    yaxis: {
      range: yRange,
      title: 'y',
      gridcolor: '#e5e7eb',
      zerolinecolor: '#9ca3af',
    },
    margin: { l: 50, r: 20, t: 20, b: 50 },
    showlegend: functions.length > 1,
    legend: {
      x: 1,
      xanchor: 'right',
      y: 1,
    },
    hovermode: 'closest',
    dragmode: 'pan',
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'white',
  }), [xRange, yRange, functions.length]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const config: any = useMemo(() => ({
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    displaylogo: false,
    scrollZoom: true,
    toImageButtonOptions: {
      format: 'png',
      filename: 'graph',
      height: 600,
      width: 800,
      scale: 2,
    },
  }), []);

  return (
    <div 
      className="graph-canvas"
      role="img"
      aria-label={`Graph showing ${functions.filter(f => f.visible).length} function(s)`}
    >
      <Suspense fallback={
        <div 
          className="flex items-center justify-center bg-gray-100 rounded"
          style={{ width, height }}
        >
          <span className="text-gray-500">Loading graph...</span>
        </div>
      }>
        <Plot
          data={plotData}
          layout={layout}
          config={config}
          style={{ width, height }}
          onRelayout={handleRelayout}
          useResizeHandler
        />
      </Suspense>
    </div>
  );
}

export default GraphCanvas;
