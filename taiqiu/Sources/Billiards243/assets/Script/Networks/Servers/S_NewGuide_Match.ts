import { GameReceiveHandler } from "../GameReceiveHandler";
import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { C2S_NoviceGuideMatch } from "../Protobuf/billiard_pb";
import { RelifVO } from "../../VO/RelifVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { LobbyEvent } from "../../Common/LobbyEvent";



export class S_NewGuide_Match extends GameReceiveHandler
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = C2S_NoviceGuideMatch.decode(msg.content);
        this.code != 0 && cc.log("新手引导匹配失败 ");
        // if(this.code == 0) {
        //     dispatchFEventWith(LobbyEvent.ActivityUpdate);
        //     cc.log("f复活礼包数据===========>",data);
        // }
      
    }
}