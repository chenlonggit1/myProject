import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";
import { C2S_ExitRoom } from "../Protobuf/billiard_pb";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
/**
 * 发送退出游戏
 */
export class C_Game_ExitGame
{
    public static Send()
    {
        let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        let req = C2S_ExitRoom.create();
        req.id = player.id;
        let bytes = C2S_ExitRoom.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.QUIT_GAME);
    }
}
