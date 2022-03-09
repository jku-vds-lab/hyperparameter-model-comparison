interface IFilterChangedHandler {
  handleFilterChanged(selected: number[]): void;
}

interface ILineUpWidgetProps {
  data: any[];
  watchForFilter: IFilterChangedHandler[];
}
