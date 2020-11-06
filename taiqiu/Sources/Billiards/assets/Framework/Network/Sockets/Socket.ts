import { trace } from "../../Utility/dx/trace";

export class Socket {
    public static ClassName: string = "Socket";
    private socket:WebSocket;
    private onConnect: Function;
    private onClose: Function;
    private onSocketData: Function;
    private onError: Function;
    private onTimeOut: Function;
    private thisObject: any;
    private _connected: boolean = false;
    private timeOutID: any = 0;
    private _timeOut: number = 0;
    // 正在连接服务器
    private isConnecting: boolean = false;
    constructor() {
        if (!window["WebSocket"])
            throw Error("WebSocket Error!!!!!!");
    }
    public addCallBacks(thisObject: any, onConnect: Function, onSocketData: Function, onClose: Function, onError: Function, onTimeOut: Function): void {
        this.onConnect = onConnect;
        this.onClose = onClose;
        this.onSocketData = onSocketData;
        this.onError = onError;
        this.onTimeOut = onTimeOut;
        this.thisObject = thisObject;
    }
    public connect(host: string, port: number): void {
        this.connectByUrl("ws://" + host + ":" + port);
    }
    public connectByUrl(url: string): void {
        if (url == null || url == "") return;
        trace("Socket", "===正在连接服务器:" + url);
        this.isConnecting = true;
        this.socket = new window["WebSocket"](url);
        this.socket.binaryType = "arraybuffer";
        this.startConnectTimeOut();
        this._bindEvent();
    }
    private _bindEvent(): void {

        this.socket.onopen = () => this.onSocketConnected();
        this.socket.onclose = (e) => this.onSocketClosed(e);
        this.socket.onerror = (e) => this.onSocketError(e);
        this.socket.onmessage = (e) => this.onSocketGetData(e.data);
        
    }
    protected onSocketGetData(data: any): void {
        if (this.onSocketData)
            this.onSocketData.call(this.thisObject, data);
    }
    protected onSocketConnected(): void {
        this.stopConnectTimeOut();
        this._connected = true;
        if (this.onConnect)
            this.onConnect.call(this.thisObject);
    }
    protected onSocketClosed(evt): void {
        console.log("Socket Closed!!!");
        
        this.stopConnectTimeOut();
        this._connected = false;
        if (this.onClose)
            this.onClose.call(this.thisObject);
    }
    protected onSocketError(evt): void {
        this.stopConnectTimeOut();
        this._connected = false;
        if (this.onError)
            this.onError.call(this.thisObject);
    }
    public send(data: any): void {
        if (!this._connected) return;
        if(this.socket.readyState!=this.socket.OPEN)return;
        this.socket.send(data);
    }
    public close(): void {
        cc.log('socket close')
        this.disconnect();
    }
    public disconnect(): void {
        this.stopConnectTimeOut();
        this._connected = false;
        if (this.socket)
            this.socket.close();
    }
    private onSocketTimeOut(): void {
        if (this.onTimeOut != null) {
            if (this.onTimeOut.length == 0) this.onTimeOut.call(this.thisObject);
            else if (this.onTimeOut.length == 1) this.onTimeOut.call(this.thisObject, this);
        }
        this.socket.close();
        this.stopConnectTimeOut();
    }
    private startConnectTimeOut(): void {
        if (this.isConnecting && this.timeOut > 0) {
            if (this.timeOutID == 0) {
                let that = this;
                this.timeOutID = setTimeout(() => {
                    that.onSocketTimeOut();
                }, this.timeOut);
            }
        }
    }
    private stopConnectTimeOut(): void {
        this.isConnecting = false;
        if (this.timeOutID != 0)
            clearTimeout(this.timeOutID);
        this.timeOutID = 0;
    }
    public get timeOut(): number { return this._timeOut; }
    public set timeOut(value: number) {
        this._timeOut = value;
        this.startConnectTimeOut();
    }
    /**表示此 Socket 对象目前是否已连接**/
    public get connected(): boolean {
        return this._connected;
    }
    public dispose(): void {
        this.close();
        this.socket = null;
        this.onConnect = null;
        this.onClose = null;
        this.onSocketData = null;
        this.onError = null;
        this.onTimeOut = null;
        this.thisObject = null;
    }
}