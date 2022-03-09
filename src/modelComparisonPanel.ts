import { ServiceManager } from '@jupyterlab/services';
import { StackedPanel } from '@lumino/widgets';
import { ModelComparisonModel } from './modelComparisonModel';
import { ModelComparisonView } from './modelComparisonView';
import { Message } from '@lumino/messaging';

import { SessionContext, sessionContextDialogs } from '@jupyterlab/apputils';

export class ModelComparisonPanel extends StackedPanel {
  private _sessionContext: SessionContext;
  private _model: ModelComparisonModel;
  private _view: ModelComparisonView;

  constructor(manager: ServiceManager.IManager) {
    super();
    this.id = 'ModelComparison-Panel';
    this.title.label = 'ModelComparison Hyperparameter View';
    this.title.closable = true;

    this._sessionContext = new SessionContext({
      sessionManager: manager.sessions,
      specsManager: manager.kernelspecs,
      name: 'Extension Examples'
    });

    void this._sessionContext
      .initialize()
      .then(async value => {
        if (value) {
          await sessionContextDialogs.selectKernel(this._sessionContext);
        }
      })
      .catch(reason => {
        console.error(
          `Failed to initialize the session in ModelComparisonPanel.\n${reason}`
        );
      });

    this._model = new ModelComparisonModel(this._sessionContext);
    this._view = new ModelComparisonView(this._model);

    this.addWidget(this._view);
  }

  dispose(): void {
    this._sessionContext.dispose();
    super.dispose();
  }

  protected onCloseRequest(msg: Message): void {
    super.onCloseRequest(msg);
    this.dispose();
  }
}
