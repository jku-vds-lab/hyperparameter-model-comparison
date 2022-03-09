import LineUp, {
  builder,
  buildNumberColumn
} from 'lineupjs';
import React from 'react';

export class LineUpWidget
  extends React.Component<ILineUpWidgetProps>
  implements IFilterChangedHandler
{
  private lineup: LineUp | null = null;
  private container: HTMLElement;
  private reference: React.RefObject<HTMLDivElement>;

  constructor(props: ILineUpWidgetProps) {
    super(props);
    this.container = document.createElement('div');
    this.container.className = 'lineup-widget';
    this.reference = React.createRef();
    props.watchForFilter.push(this);
  }

  render() {
    return <div className="mc-table" ref={this.reference} />;
  }

  componentDidMount() {
    this.lineup = builder(this.props.data)
      .sidePanel(false)
      .column(buildNumberColumn('n_hidden'))
      .column(buildNumberColumn('lr'))
      .column(buildNumberColumn('top_k'))
      .column(buildNumberColumn('n_epochs'))
      .column(buildNumberColumn('n_layers'))
      .column(buildNumberColumn('batch_size'))
      .column(buildNumberColumn('p_dropout'))
      .column(buildNumberColumn('seq_length'))
      .column(buildNumberColumn('loss'))
      .build(this.container);

    this.reference.current?.appendChild(this.container);
  }

  handleFilterChanged(selected: number[]): void {
    const selectedCol = this.lineup?.data.find(
      d => d.desc.label === 'Selections'
    );
    // trigger groupByMe at least once to force an update
    do {
      selectedCol?.groupByMe();
    } while (!!selectedCol && selectedCol?.isGroupedBy() < 0);
    this.lineup?.setSelection([0, 1, 2]);
  }
}
