import { ISessionContext } from '@jupyterlab/apputils';
import { IOutput } from '@jupyterlab/nbformat';
import { Kernel, KernelMessage } from '@jupyterlab/services';
import { ISignal, Signal } from '@lumino/signaling';
import { JSONObject } from '@lumino/coreutils';

export class ModelComparisonModel {
  private _future: Kernel.IFuture<
    KernelMessage.IExecuteRequestMsg,
    KernelMessage.IExecuteReplyMsg
  > | null = null;
  private _stateChanged = new Signal<ModelComparisonModel, void>(this);
  private _onFilterChanged: IFilterChangedHandler[];
  private _output: IOutput | null = null;
  private _sessionContext: ISessionContext;

  private _data: JSONObject[] = [
    {
      n_hidden: 128,
      lr: 0.001,
      top_k: 5,
      n_epochs: 20,
      n_layers: 2,
      batch_size: 256,
      p_dropout: 0.5,
      seq_length: 50,
      loss: 0.835
    },
    {
      n_hidden: 128,
      lr: 0.01,
      top_k: 10,
      n_epochs: 15,
      n_layers: 1,
      batch_size: 128,
      p_dropout: 0.2,
      seq_length: 50,
      loss: 3.253
    },
    {
      n_hidden: 256,
      lr: 0.00001,
      top_k: 5,
      n_epochs: 50,
      n_layers: 3,
      batch_size: 256,
      p_dropout: 0.5,
      seq_length: 150,
      loss: 9284.427
    },
    {
      n_hidden: 64,
      lr: 0.1,
      top_k: 2,
      n_epochs: 10,
      n_layers: 1,
      batch_size: 256,
      p_dropout: 0.5,
      seq_length: 200,
      loss: 26.562
    },
    {
      n_hidden: 256,
      lr: 0.001,
      top_k: 5,
      n_epochs: 10,
      n_layers: 4,
      batch_size: 512,
      p_dropout: 0.5,
      seq_length: 50,
      loss: 0.632
    },
    {
      n_hidden: 64,
      lr: 0.1,
      top_k: 5,
      n_epochs: 30,
      n_layers: 3,
      batch_size: 128,
      p_dropout: 0.2,
      seq_length: 20,
      loss: 9.476
    }
  ];

  constructor(_sessionContext: ISessionContext) {
    this._sessionContext = _sessionContext;
    this._onFilterChanged = [];
  }

  get future(): Kernel.IFuture<
    KernelMessage.IExecuteRequestMsg,
    KernelMessage.IExecuteReplyMsg
  > | null {
    return this._future;
  }

  set future(
    value: Kernel.IFuture<
      KernelMessage.IExecuteRequestMsg,
      KernelMessage.IExecuteReplyMsg
    > | null
  ) {
    this._future = value;
    if (!value) {
      return;
    }
    value.onIOPub = this._onIOPub;
  }

  execute(code: string): void {
    if (!this._sessionContext || !this._sessionContext.session?.kernel) {
      return;
    } else {
      this.future = this._sessionContext.session.kernel.requestExecute({
        code
      });
    }
    this._onFilterChanged.forEach(x => x.handleFilterChanged([1, 2, 3]));
  }

  private _onIOPub = (msg: KernelMessage.IIOPubMessage): void => {
    const msgType = msg.header.msg_type;
    switch (msgType) {
      case 'execute_result':
      case 'display_data':
      case 'update_display_data':
        this._output = msg.content as IOutput;
        console.log(this._output);
        this._stateChanged.emit();
        break;
      default:
        break;
    }
    return;
  };

  get data(): JSONObject[] {
    return this._data;
  }

  get output(): IOutput | null {
    return this._output;
  }

  get stateChanged(): ISignal<ModelComparisonModel, void> {
    return this._stateChanged;
  }

  get onFilterChanged(): IFilterChangedHandler[] {
    return this._onFilterChanged;
  }
}
