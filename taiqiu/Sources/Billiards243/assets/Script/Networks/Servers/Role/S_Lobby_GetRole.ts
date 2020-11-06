import { IClient } from "../../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../../Framework/Interfaces/Network/IClientMessage";
import { GameDataManager } from "../../../GameDataManager";
import { GameDataKey } from "../../../GameDataKey";
import { dispatchFEventWith } from "../../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../../GameEvent";
import { GameReceiveHandler } from "../../GameReceiveHandler";
import { S2C_getRole } from "../../Protobuf/billiard_pb";
import { PlayerTaskVO } from "../../../VO/PlayerTaskVO";
import { PlayerRoleVO } from "../../../VO/PlayerRoleVO";
import { LobbyEvent } from "../../../Common/LobbyEvent";
/**
 * 接收到服务器匹配结果 的消息
 */
export class S_Lobby_GetRole extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = S2C_getRole.decode(msg.content);
        let playerRole:PlayerRoleVO = GameDataManager.GetDictData(GameDataKey.PlayerRole,PlayerRoleVO);
        playerRole.setMyRoles(data.role);
        dispatchFEventWith(LobbyEvent.Switch_Role);
        // console.log("角色",data.role,playerRole.myPlayerRoles);
    } 
}
