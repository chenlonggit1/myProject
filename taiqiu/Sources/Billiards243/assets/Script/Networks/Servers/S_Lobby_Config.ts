import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { S2C_GetConfig } from "../Protobuf/billiard_pb";
import { PlayerCueVO } from "../../VO/PlayerCueVO";
import { PlayerTaskVO } from "../../VO/PlayerTaskVO";
import { PlayerRoleVO } from "../../VO/PlayerRoleVO";
import { RoomVO } from "../../VO/RoomVO";
import { MemberConfigVO } from "../../VO/MemberConfigVO";
import { RoomMatchVO } from "../../VO/RoomMatchVO";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameLuckBallVO } from "../../VO/GameLuckBallVO";
import { ShopGoodsVo } from "../../VO/ShopGoodsVo";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { LobbyEvent } from "../../Common/LobbyEvent";
/**
 * 接收到服务器匹配结果 的消息
 */
export class S_Lobby_Config extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = S2C_GetConfig.decode(msg.content);
        //type=1球杆升级配置 type=2所有球杆信息
        if(data.configType <= 2) {
            let playerCue:PlayerCueVO = GameDataManager.GetDictData(GameDataKey.PlayerCue,PlayerCueVO);
            if (data.configType == 1)
                playerCue.updateCueUpgrade(JSON.parse(data.body));
            else if (data.configType == 2) 
                playerCue.updateAllCues(JSON.parse(data.body));

            // console.log(JSON.parse(data.body));
        }
        //configType：3每日任务，4每周任务，5成长任务，6活动任务，7日活跃，8周活跃，9场次编码
        else if(data.configType <= 9) {
            let playerTask:PlayerTaskVO = GameDataManager.GetDictData(GameDataKey.PlayerTask,PlayerTaskVO);
            if(data.configType == 3)
                playerTask.updateDailyTasks(JSON.parse(data.body));
            else if(data.configType == 4)
                playerTask.updateWeekTasks(JSON.parse(data.body));
            else if(data.configType == 5)
                playerTask.updateAllGrowthTasks(JSON.parse(data.body));
            else if(data.configType == 7)
                playerTask.updateDailyActiveTasks(JSON.parse(data.body));
            else if(data.configType == 8)
                playerTask.updateWeekActiveTasks(JSON.parse(data.body));
            else if(data.configType == 9) 
                playerTask.updateSelectMatchs(JSON.parse(data.body));
            // console.log(playerTask);
        }
        //10经验，11角色，12道具，13场次配置
        else if(data.configType == 10) {

        } else if(data.configType == 11) {
            // console.log("角色", JSON.parse(data.body));
            let playerRole:PlayerRoleVO = GameDataManager.GetDictData(GameDataKey.PlayerRole,PlayerRoleVO);
            playerRole.updateRoles(JSON.parse(data.body));
            // console.log(playerRole);
        } else if(data.configType == 12) {
            let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
            player.updateItemInfoList(JSON.parse(data.body));
            // console.log("道具", player.itemInfoList);
        } else if(data.configType == 13) {
            console.log("场次配置", JSON.parse(data.body));
            let roomMatch:RoomMatchVO = GameDataManager.GetDictData(GameDataKey.RoomMatch,RoomMatchVO);
            roomMatch.updateRooms(JSON.parse(data.body));
            // console.log(roomMatch.rooms);
            dispatchFEventWith(LobbyEvent.Set_LobbyRoomMatch);
        } else if(data.configType == 14) {
            let memberConfig:MemberConfigVO = GameDataManager.GetDictData(GameDataKey.MemberConfig,MemberConfigVO);
            memberConfig.updateMemberConfigs(JSON.parse(data.body));
            // console.log("VIP",JSON.parse(data.body));
        } else if(data.configType == 15) {
            let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
            player.updateLotteryList(JSON.parse(data.body));
            // console.log("抽奖",player.lotteryList);
        }
        //16幸运一杆配置表，18商品配置表
        else if(data.configType == 16) {
            let gameLuck:GameLuckBallVO = GameDataManager.GetDictData(GameDataKey.GameLuckBall,GameLuckBallVO);
            gameLuck.addData(JSON.parse(data.body))
        } else if(data.configType == 18) {
            let ShopGoods:ShopGoodsVo = GameDataManager.GetDictData(GameDataKey.ShopGoods, ShopGoodsVo);
            ShopGoods.updateLotteryList(JSON.parse(data.body));
            // console.log("商品配置",JSON.parse(data.body));
            dispatchFEventWith(LobbyEvent.Server_Lobby_Shop_Update)
        }
    } 
}
