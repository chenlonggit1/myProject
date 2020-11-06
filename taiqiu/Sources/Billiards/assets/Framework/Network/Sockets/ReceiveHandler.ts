
import { IClient } from "../../Interfaces/Network/IClient";
import { IClientMessage } from "../../Interfaces/Network/IClientMessage";
import { IReceiveHandler } from "../../Interfaces/Network/IReceiveHandler";
import { trace } from "../../Utility/dx/trace";
import { ObjectUtility } from "../../Utility/ObjectUtility";

export class ReceiveHandler implements IReceiveHandler 
{
    public static ClassName:string = "ReceiveHandler";
	public onDeal(client:IClient, msg:IClientMessage):void
    {
        
    }
    public onDealError(client:IClient, msg:IClientMessage, error:String):void
    {
        var className:String = ObjectUtility.GetObjectClassName(this);
        trace(className,"   ========>   处理消息失败！！！");
    }
    public dispose():void
    {
    }
}
