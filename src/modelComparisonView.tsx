import { ReactWidget, UseSignal } from '@jupyterlab/apputils';

import * as React from 'react';
import Plot from 'react-plotly.js';

import {Fragment} from "react";
import {ModelComparisonModel} from "./modelComparisonModel";
// import {PartialJSONObject} from "@lumino/coreutils"
import LineUp from "lineupjsx";

export class ModelComparisonView extends ReactWidget {
    constructor(model: ModelComparisonModel) {
        super();
        this._model = model;
    }

    protected render(): React.ReactElement<any> {
        return (
            <React.Fragment>
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
                        <Fragment>
                            <span key="output field">{JSON.stringify(this._model.output)}</span>
                            <Plot
                                data={[
                                    {
                                        x: [1, 2, 3],
                                        //y: [2, (this._model?.output?.data as PartialJSONObject)["text/plain"], 3],
                                        y: [2, 3, 4],
                                        type: 'scatter',
                                        mode: 'lines+markers',
                                        marker: {color: 'red'},
                                    },
                                    {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]}]}
                                layout={{width: 320, height: 240, title: 'A Fancy Plot'}}
                            />
                            <LineUp data={[{a: 1, b: "a"}, {a: 2, b: "b"}]} />
                        </Fragment>
                    )}
                </UseSignal>
            </React.Fragment>
        );
    }

    private _model: ModelComparisonModel;
}