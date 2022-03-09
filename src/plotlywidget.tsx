import React from 'react';
import { ReactWidget } from '@jupyterlab/apputils';

const PlotlyComponent = (): JSX.Element => {
  return (
    <div>
      <p>Imagine a Plotly Widget here.</p>
    </div>
  );
};

export class PlotlyWidget extends ReactWidget {
  constructor() {
    super();
    this.addClass('jp-PlotlyWidget');
  }

  render(): JSX.Element {
    return <PlotlyComponent />;
  }
}
