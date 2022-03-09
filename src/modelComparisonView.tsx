import { ReactWidget, UseSignal } from '@jupyterlab/apputils';

import * as React from 'react';
import Plot from 'react-plotly.js';
import { ModelComparisonModel } from './modelComparisonModel';
import { LineUpWidget } from './lineupwidget';
import { JSONValue } from '@lumino/coreutils';

// import {PartialJSONObject} from "@lumino/coreutils"

export class ModelComparisonView extends ReactWidget {
  constructor(model: ModelComparisonModel) {
    super();
    this._model = model;
  }

  protected render(): React.ReactElement {
    //y: [2, (this._model?.output?.data as PartialJSONObject)["text/plain"], 3],

    const dimensions: {
      range: number[];
      label: string;
      values: JSONValue[];
    }[] = [];
    Object.keys(this._model.data[0]).forEach(param => {
      dimensions.push({
        range: [
          Math.min(...this._model.data.map(x => x[param] as number)),
          Math.max(...this._model.data.map(x => x[param] as number))
        ],
        label: param,
        values: this._model.data.map(x => x[param])
      });
    });

    return (
      <div className="mc-container">
        <button
          key="header-thread"
          className="jp-example-button"
          onClick={(): void => {
            this._model.execute('ModelComparison.param');
          }}
        >
          Compute 3+5
        </button>
        <UseSignal signal={this._model.stateChanged}>
          {(): JSX.Element => (
            <div className="mc-plot">
              <span key="output field">
                {JSON.stringify(this._model.output)}
              </span>
              <Plot
                data={[
                  {
                    type: 'parcoords',
                    line: {
                      color: 'blue',
                      colorbar: {
                        thickness: 100
                      }
                    },
                    dimensions: dimensions
                  }
                ]}
              />
            </div>
          )}
        </UseSignal>
        {/* TODO: brutal event handling ... */}
        <LineUpWidget
          data={this._model.data}
          watchForFilter={this._model.onFilterChanged}
        />
      </div>
    );
  }

  private _model: ModelComparisonModel;
}
