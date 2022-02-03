import {ISessionContext} from "@jupyterlab/apputils";
import { IOutput } from '@jupyterlab/nbformat';
import { Kernel, KernelMessage } from '@jupyterlab/services';
import { ISignal, Signal } from '@lumino/signaling';

export class ModelComparisonModel {
    private _future: Kernel.IFuture<KernelMessage.IExecuteRequestMsg, KernelMessage.IExecuteReplyMsg> | null = null;
    private _stateChanged = new Signal<ModelComparisonModel, void>(this);
    private _output: IOutput | null = null;
    private _sessionContext: ISessionContext;

    private _isFilterActive: boolean = false;


    constructor(_sessionContext: ISessionContext) {
        this._sessionContext = _sessionContext;
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
                code,
            });
        }
        this._isFilterActive = !this._isFilterActive;
        this._stateChanged.emit();
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

    get output(): IOutput | null {
        return this._output;
    }

    get stateChanged(): ISignal<ModelComparisonModel, void> {
        return this._stateChanged;
    }

    get isFilterActive(): boolean {
        return this._isFilterActive;
    }
}
