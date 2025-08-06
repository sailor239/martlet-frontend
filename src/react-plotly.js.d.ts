declare module 'react-plotly.js' {
  import * as React from 'react';
  import { Layout, Data, Config } from 'plotly.js';

  interface PlotParams {
    data: Data[];
    layout?: Partial<Layout>;
    config?: Partial<Config>;
    style?: React.CSSProperties;
    useResizeHandler?: boolean;
    className?: string;
    onInitialized?: (figure: any) => void;
    onUpdate?: (figure: any) => void;
    onPurge?: () => void;
  }

  const Plot: React.FC<PlotParams>;

  export default Plot;
}
