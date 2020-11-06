import { ReceiveHandler } from "../../Framework/Network/Sockets/ReceiveHandler";
import { IClient } from "../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../Framework/Interfaces/Network/IClientMessage";
import { CryptoUtility } from "../../Framework/Utility/CryptoUtility";
import { Reader } from "../../Framework/Plugins/Protobuf";
import { ERRINFO } from "./ERRDefine";
import { showPopup } from "../Common/showPopup";
import { PopupType } from "../PopupType";
import { GetErrInfo } from "../Pay/GetErrInfo";

export class GameReceiveHandler extends ReceiveHandler 
{

    /** 响应结果，0是成功，1是请求超时（消息已发出），2是请求错误（消息未发出），大于100是服务器响应返回的错误 */
    protected code:number = 0;
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        this.code = CryptoUtility.bytes2Int(CryptoUtility.SpliteBytes(msg.content,0,4,true),true);

        if(this.code) {
           let errstr = GetErrInfo(this.code);
           cc.warn(errstr)
           errstr && showPopup(PopupType.TOAST, {msg: errstr});
        } 
    }
}
