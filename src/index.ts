import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { addIcon } from '@jupyterlab/ui-components';
//import {MainAreaWidget, ICommandPalette} from '@jupyterlab/apputils';
import { ICommandPalette } from '@jupyterlab/apputils';
//import {PlotlyWidget} from "./plotlywidget";
import { ModelComparisonPanel } from './modelComparisonPanel';

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'ModelComparison:ModelComparison-plugin',
  autoStart: true,
  requires: [ICommandPalette],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette) => {
    console.log('JupyterLab extension ModelComparison is activated!');

    // commands = app.commands
    const { commands, shell } = app;

    async function createPanel(): Promise<ModelComparisonPanel> {
      const panel = new ModelComparisonPanel(app.serviceManager);
      shell.add(panel, 'main');
      return panel;
    }

    commands.addCommand('modelcomparison/open-plotly-widget', {
      // execute: () => {
      //     const widget = new MainAreaWidget<PlotlyWidget>({content: new PlotlyWidget()});
      //     widget.title.label = "HyperXray";
      //     widget.title.icon = addIcon;
      //     app.shell.add(widget, 'main');
      // },
      execute: createPanel,
      icon: addIcon,
      // double negation ensures data type of variable is boolean (wtf)
      isEnabled: () => true, //!!logConsolePanel && logConsolePanel.source !== null,
      label: 'Open Model Comparison Pane',
      caption: 'Open Model Comparison Pane'
    });

    palette.addItem({
      command: 'modelcomparison/open-plotly-widget',
      category: 'Model Comparison'
    });
  }
};

export default plugin;
