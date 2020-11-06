import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { C2S_Login } from "../Protobuf/billiard_pb";
import { Native } from "../../Common/Native";

export class C_Lobby_Login
{
    /**
     * 0-模拟登录,1-通过code登录，2-通过access_token
     */
    public static Send()
    {
        let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        let req = C2S_Login.create();
        req.code = player.token;        
        req.device = cc.sys.isNative?2:1;
        req.loginType = player.loginType;
        if(cc.sys.isNative)
        {
            let pid = Native.parentId();
            req.parentId = pid==""?0:parseInt(pid);
            req.origin = Native.getAPKChannel();
        }
        let bytes = C2S_Login.encode(req).finish();
        
        ClientManager.SendProtobufMessage(ClientNames.Lobby, bytes,PacketID.LOGIN);
    }
}
