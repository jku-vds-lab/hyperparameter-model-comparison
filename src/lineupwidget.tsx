import {buildNumberColumn, buildStringColumn, createLineUp, createLocalDataProvider, LocalDataProvider} from "lineupjs";
import React from 'react';

export class LineUpWidget extends React.Component<{}> {

    render(): HTMLElement {
        const arr = [];
        const cats = ['c1', 'c2', 'c3'];
        for (let i = 0; i < 100; ++i) {
            arr.push({
                a: Math.random() * 10,
                d: 'Row ' + i,
                cat: cats[Math.floor(Math.random() * 3)],
                cat2: cats[Math.floor(Math.random() * 3)]
            })
        }

        let target: HTMLElement = document.createElement("div");
        target.className = "lineup-widget";
        let ldp: LocalDataProvider = createLocalDataProvider(
            arr,
            [
                buildNumberColumn("a").build(arr.map(x => x.a)),
                buildStringColumn("d").build(arr.map(x => x.d)),
                buildStringColumn("cat").build(arr.map(x => x.cat)),
                buildStringColumn("cat2").build(arr.map(x => x.cat2))
                ]
        );
        createLineUp(target, ldp);
        return target;
    }
}