

import { IClientMessage } from "./IClientMessage";
import { IClient } from "./IClient";

export interface IReceiveHandler
{
	/**
     * 处理接收到服务端的消息数据
     */		
    onDeal(client:IClient,msg:IClientMessage):void;
    /**
     * 处理出错
     */		
    onDealError(client:IClient,msg:IClientMessage,error:string):void;
}
