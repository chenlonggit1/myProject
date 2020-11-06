import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";
import { C2S_getRole } from "../Protobuf/billiard_pb";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
/**
 * 发送退出比赛
 */
export class C_Game_QuitGame
{
    public static Send()
    {
        let req = C2S_getRole.create();
        let bytes = C2S_getRole.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.GAME_QUIT);
    }
}
