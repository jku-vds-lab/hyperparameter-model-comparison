import {ReactWidget, UseSignal} from '@jupyterlab/apputils';

import * as React from 'react';
import {Fragment} from 'react';
import Plot from 'react-plotly.js';
import {ModelComparisonModel} from "./modelComparisonModel";
// import {PartialJSONObject} from "@lumino/coreutils"
import LineUp, {
    LineUpCategoricalColumnDesc, LineUpColumn,
    LineUpNumberColumnDesc,
    LineUpRanking,
    LineUpStringColumnDesc, LineUpSupportColumn
} from "lineupjsx";

export class ModelComparisonView extends ReactWidget {
    constructor(model: ModelComparisonModel) {
        super();
        this._model = model;
    }

    protected render(): React.ReactElement<any> {
        const arr:any = [];
        const cats = ['c1', 'c2', 'c3'];
        for (let i = 0; i < 100; ++i) {
            arr.push({
                a: Math.random() * 10,
                d: 'Row ' + i,
                cat: cats[Math.floor(Math.random() * 3)],
                cat2: cats[Math.floor(Math.random() * 3)]
            })
        }
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
                            <LineUp data={arr} sidePanel sidePanelCollapsed>
                                <LineUpStringColumnDesc column="d" label="Label" width={100} />
                                <LineUpCategoricalColumnDesc column="cat" categories={cats} color="green" />
                                <LineUpCategoricalColumnDesc column="cat2" categories={cats} color="blue" />
                                <LineUpNumberColumnDesc column="a" domain={[0, 10]} color="blue" />
                                {this._model.isFilterActive && <LineUpRanking groupBy="cat" sortBy="a:desc">
                                    <LineUpSupportColumn type="*" />
                                    <LineUpColumn column="*" />
                                </LineUpRanking> }
                            </LineUp>
                        </Fragment>
                    )}
                </UseSignal>

            </React.Fragment>
        );
    }

    private _model: ModelComparisonModel;
}