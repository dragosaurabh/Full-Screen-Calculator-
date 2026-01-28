/**
 * Plotly.js type declarations
 */

declare namespace Plotly {
  interface Layout {
    xaxis?: Partial<LayoutAxis>;
    yaxis?: Partial<LayoutAxis>;
    margin?: Partial<Margin>;
    showlegend?: boolean;
    legend?: Partial<Legend>;
    hovermode?: 'closest' | 'x' | 'y' | 'x unified' | 'y unified' | false;
    dragmode?: 'zoom' | 'pan' | 'select' | 'lasso' | 'orbit' | 'turntable' | false;
    paper_bgcolor?: string;
    plot_bgcolor?: string;
    'xaxis.range[0]'?: number;
    'xaxis.range[1]'?: number;
    'yaxis.range[0]'?: number;
    'yaxis.range[1]'?: number;
  }

  interface LayoutAxis {
    range?: [number, number];
    title?: string;
    gridcolor?: string;
    zerolinecolor?: string;
  }

  interface Margin {
    l: number;
    r: number;
    t: number;
    b: number;
  }

  interface Legend {
    x?: number;
    xanchor?: 'auto' | 'left' | 'center' | 'right';
    y?: number;
  }

  interface Config {
    responsive?: boolean;
    displayModeBar?: boolean;
    modeBarButtonsToRemove?: string[];
    displaylogo?: boolean;
    scrollZoom?: boolean;
    toImageButtonOptions?: {
      format?: 'png' | 'svg' | 'jpeg' | 'webp';
      filename?: string;
      height?: number;
      width?: number;
      scale?: number;
    };
  }
}
