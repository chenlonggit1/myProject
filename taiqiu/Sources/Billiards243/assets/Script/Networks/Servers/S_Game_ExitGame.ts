import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { C2S_ExitRoom } from "../Protobuf/billiard_pb";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../GameEvent";
/**
 * 玩家退出游戏
 */
export class S_Game_ExitGame extends GameReceiveHandler 
{

    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = C2S_ExitRoom.decode(msg.content);
        let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        console.log(player.id,"--有玩家退出游戏-------->",data.id);
        dispatchFEventWith(GameEvent.On_OtherPlayerExit);
    }
}
