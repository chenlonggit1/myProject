import { CButton } from "../../../Framework/Components/CButton";
import { FBinder } from "../../../Framework/Core/FBinder";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { Fun } from "../../../Framework/Utility/dx/Fun";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { StringUtility } from "../../../Framework/Utility/StringUtility";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { GameEvent } from "../../GameEvent";
import { ModuleNames } from "../../ModuleNames";
import { C_Game_NewRound } from "../../Networks/Clients/C_Game_NewRound";
import { PlayerRoleVO } from "../../VO/PlayerRoleVO";
import { PlayerVO } from "../../VO/PlayerVO";
import { RoomVO } from "../../VO/RoomVO";
import { RoomMatchVO } from "../../VO/RoomMatchVO";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { S2C_GameSettle } from "../../Networks/Protobuf/billiard_pb";
import { Native } from "../../Common/Native";
import { C_Lobby_ReqShare } from "../../Networks/Clients/C_Lobby_ReqShare";
import { ConfigVO } from "../../VO/ConfigVO";
import { PlayGameID } from "../../Common/PlayGameID";
import { CLanguage } from "../../../Framework/Components/CLanguage";
import { getLang } from "../../../Framework/Utility/dx/getLang";
/**
*@description:游戏结算模块
**/
export class GameSettleBinder extends FBinder 
{
	public static ClassName:string = "GameSettleBinder";
	
	protected playerItems:cc.Node[] = [];
	protected rematchBtn:CButton = null;
	protected replayBtn:CButton = null;
	protected replayTip:cc.Node = null;
	protected returnBtn:CButton = null;
	protected shareBtn:CButton = null;
	protected roomMatch:RoomMatchVO = null;

	protected initViews():void
	{
		super.initViews();
		this.returnBtn = getNodeChildByName(this.asset,"ReturnBtn",CButton);
		this.shareBtn = getNodeChildByName(this.asset,"Btns/btn_share",CButton);
		this.rematchBtn = getNodeChildByName(this.asset,"Btns/btn_toMatch",CButton);
		this.replayBtn = getNodeChildByName(this.asset,"Btns/btn_onceAgain",CButton);
		this.replayTip = getNodeChildByName(this.asset,"Btns/btn_onceAgain/tip");
		this.roomMatch = GameDataManager.GetDictData(GameDataKey.RoomMatch,RoomMatchVO);

		let playerNode:cc.Node = getNodeChildByName(this.asset,"Players");
		this.returnBtn.click = Fun(this.onExitGame,this);

		this.shareBtn.click = Fun(this.onShareGame,this);
		this.rematchBtn.click = Fun(this.onReMatchGame,this);
		this.replayBtn.click = Fun(this.onReplayGame,this);
		for (let i = 0; i < playerNode.childrenCount; i++) 
			this.playerItems[i] = playerNode.children[i];
	}

	protected addEvents():void
	{
		super.addEvents();
		addEvent(this,GameEvent.On_Lottery_Complete,this.lotteryComplete);
		addEvent(this,GameEvent.On_OtherPlayerExit,()=>{
			this.replayBtn.interactable = false;
			this.replayTip.active = true;
		});
	}

	/**退出游戏返回到游戏大厅 */
	protected onExitGame()
	{
		dispatchModuleEvent(ModuleEvent.DISPOSE_MODULE, ModuleNames.Game_Settle);
		dispatchFEventWith(GameEvent.On_ExitGame,{isForce:false});
	}
	/**重新匹配 */
	protected onReMatchGame()
	{
		dispatchModuleEvent(ModuleEvent.DISPOSE_MODULE, ModuleNames.Game_Settle);
		dispatchFEventWith(GameEvent.On_ReMatchGame);
	}
	/**分享游戏 */
	protected onShareGame()
	{
		let config:ConfigVO = GameDataManager.GetDictData(GameDataKey.Config,ConfigVO);
		let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		let origin = "";
		if(cc.sys.isNative) origin = Native.getAPKChannel();
		let url = `${config.share_url}?game_id=${config.game_id}&invoke_id=${player.id}&tq_channel=${origin}`;
		if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS) {
			Native.wxShare(url,config.share_title,config.share_desc,2);
			C_Lobby_ReqShare.Send();
		}
	}
	/**再玩一次 */
	protected onReplayGame()
	{
		this.replayBtn.interactable = false;
		C_Game_NewRound.Send();
	}

	public update(settleInfo:S2C_GameSettle)
	{
		let players = [];
		let winPlayers = {};
		this.replayBtn.interactable = true;
		this.replayTip.active = false;
		let winBg = getNodeChildByName(this.asset, "winBg");
		let loseBg = getNodeChildByName(this.asset, "loseBg");
		let winNode = getNodeChildByName(this.asset,"Infos/Win");
		let winAnim:cc.Animation = getNodeChildByName(winNode,"Title/img_ShengLi",cc.Animation);
		let loseNode = getNodeChildByName(this.asset,"Infos/Lose");
		let msgBox = getNodeChildByName(this.asset,"Infos/MsgBox");
		let msgBoxLabel = getNodeChildByName(msgBox, "Label", CLanguage);
		
		let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		let playerRole:PlayerRoleVO = GameDataManager.GetDictData(GameDataKey.PlayerRole,PlayerRoleVO);
		let AddExp:cc.Label = getNodeChildByName(this.asset,"Infos/Player/AddExp",cc.Label);
		let expBar:cc.ProgressBar = getNodeChildByName(this.asset,"Infos/Player/ExpBar",cc.ProgressBar);
		let level:cc.Label = getNodeChildByName(this.asset,"Infos/Player/Level",cc.Label);
		let mySelf:cc.Sprite = getNodeChildByName(this.asset,"Infos/Player/myself",cc.Sprite);
		let other:cc.Sprite = getNodeChildByName(this.asset,"Infos/Player/other",cc.Sprite);

		let giftProgressBar:cc.ProgressBar = getNodeChildByName(this.asset, "giftProgressBar",cc.ProgressBar);
		let giftIcon = getNodeChildByName(giftProgressBar.node,"gift");
		let giftTipNode = getNodeChildByName(giftProgressBar.node, "ban");
		giftTipNode.active = false;
		let giftTip = getNodeChildByName(giftTipNode,"tip",cc.Label);
		let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
		let roomInfo = this.roomMatch.getRoomInfo();
		
		if(giftProgressBar) {
			giftProgressBar.progress = roomInfo.gameNum > 0 ? (roomInfo.gameNum - 1) / 3 : 0;
			giftProgressBar.node.stopAllActions();
			cc.tween(giftProgressBar).to(1,{progress:roomInfo.gameNum/3}).start();
		}
		giftIcon.on("click", () => {
			giftTipNode.active = !giftTipNode.active;
			let num = roomInfo.gameNum - 3 >= 0 ? 0 : 3 - roomInfo.gameNum;
			giftTip.string = getLang("Text_cj3",[num]);
		}, this);
		if(roomInfo.gameNum >= 3) {
			dispatchFEventWith(GameEvent.On_Show_Lottery);
			this.rematchBtn.node.active = false;
			this.replayBtn.node.active = false;
			this.returnBtn.node.active = false;
			this.shareBtn.node.active = false;
		}
		// settleInfo.code   1-自然结束  2-多次犯规结束 3-黑八进袋结束 4-对方强退
		if(msgBox)msgBox.active = settleInfo.code!=1;
		if(settleInfo.code == 2) msgBoxLabel.key = "Text_js3";
		else if(settleInfo.code == 3) msgBoxLabel.key = "Text_jsts1";
		else if(settleInfo.code = 4) {
			this.replayBtn.interactable = false;
			this.replayTip.active = true;
			msgBoxLabel.key = "Text_jsts2";
		}
		for (let i = 0; i < settleInfo.winner.length; i++) 
		{
			winPlayers[settleInfo.winner[i].id] = true;
			if(settleInfo.winner[i].id==player.id)players.unshift(settleInfo.winner[i]);
			else players.push(settleInfo.winner[i]);
		}
		for (let j = 0; j < settleInfo.losers.length; j++) 
		{
			if(settleInfo.losers[j].id==player.id)players.unshift(settleInfo.losers[j]);
			else players.push(settleInfo.losers[j]);
		}
		let isWin = winPlayers[player.id]!=null;
		if(winBg)winBg.active = isWin;
		if(loseBg)loseBg.active = !isWin;
		if(winNode)winNode.active = isWin;
		if(loseNode)loseNode.active = !isWin;
		if(isWin) {
			if(player.isChinese) winAnim.play("winAnim");
			else winAnim.play("weiWinAnim");
		}
		let p = players[0];
		if(room.players.length==0)return;
		let isMan = parseInt((room.players[0].roleId / 1000).toString()) == 1 ? false : true;
		ResourceManager.LoadSpriteFrame(`Lobby/LobbyRole/LobbyRole?:${isMan?"img_Nan":"img_Nv"}`,mySelf);
		if(other) {
			isMan = parseInt((room.players[1].roleId / 1000).toString()) == 1 ? false : true;
			ResourceManager.LoadSpriteFrame(`Lobby/LobbyRole/LobbyRole?:${isMan?"img_Nan":"img_Nv"}`,other);
		}
		AddExp.string = "+"+p.exp+"  EXP";
		level.string = playerRole.getMyRole().star.toString();
		let nextRole = playerRole.getRole(playerRole.getMyRole().roleId + 1);
		if (nextRole){
			expBar.progress = (playerRole.getMyRole().exp - p.exp)/nextRole.roleExp;
			expBar.node.stopAllActions();
			cc.tween(expBar).to(1,{progress:playerRole.getMyRole().exp/nextRole.roleExp}).start();
		}
		else 
			expBar.progress = 1;
				
		for (let k = 0; k < players.length; k++) 
			this.updatePlayer(players[k],this.playerItems[k],winPlayers[players[k].id]);

		//判断玩家中有机器人，直接置灰再来一局
		for (let k = 0; k < room.players.length; k++) {
			if(room.players[k].id < 0) {
				this.replayBtn.interactable = false;
				this.replayTip.active = true;
				break;
			}
		}
		this.setSettleInfo(p,isWin,settleInfo);
	}

	//设置结算信息
	protected setSettleInfo(p,isWin,settleInfo:S2C_GameSettle)
	{
		let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
		let roomInfo = this.roomMatch.getRoomInfo();
		let addMoney:cc.Label = getNodeChildByName(this.asset,"Infos/Money",cc.Label);
		let moneyIcon:cc.Sprite = getNodeChildByName(this.asset,"Infos/Money/icon",cc.Sprite);
		let scrollViewContent = getNodeChildByName(this.asset,"Infos/settleScrollView/view/content");
		let score:cc.Label = getNodeChildByName(scrollViewContent,"Score",cc.Label);
		let raise:cc.Label = getNodeChildByName(scrollViewContent,"Raise",cc.Label);
		let fee:cc.Label = getNodeChildByName(scrollViewContent,"Fee",cc.Label);
		
		if(raise) raise.node.active = false;
		if(fee) fee.node.active = false;
		//扣除台费
		if(roomInfo.fee > 0) {
			fee.node.active = true;
			fee.string = `-${roomInfo.fee}`;
		}
		//赢家底分和加倍扣除抽成,输家不扣除抽成
		//底分计算 底分*(1-抽成)
		//加倍计算 底分*(加倍次数-1)*(1-抽成)
		//抽牌玩法需要加入剩余牌计算
		let revenue = roomInfo.percentage;
		let val = room.roomScore;
		let raiseValue = (room.doubleNum - 1)*room.roomScore;
		if(room.gameId==PlayGameID.Card15 || room.gameId == PlayGameID.Card54){
			let num = 0;
			if(isWin){
				for (let j = 0; j < settleInfo.losers.length; j++) 
					num += settleInfo.losers[j].needCards.length;
			}
			else{
				for (let j = 0; j < settleInfo.losers.length; j++) 
				{
					if(settleInfo.losers[j].id==player.id) 
						num = settleInfo.losers[j].needCards.length;
				}
			}
			val *= num;
			raiseValue*= num;
		}
		if(room.doubleNum > 1) raise.node.active = true;
		if(isWin) {
			if(revenue > 0) {
				score.string = `+${Math.ceil(val*(1-revenue))}`;
				if(room.doubleNum > 1) 
					raise.string = `+${Math.ceil(raiseValue*(1-revenue))}`;
			} else {
				score.string = `+${val}`;
				if(room.doubleNum > 1) 
					raise.string = `+${raiseValue}`;
			}
		} else {
			score.string = `-${val}`;
			if(room.doubleNum > 1) 
				raise.string = `-${raiseValue}`;
		}

		let money = p.money-roomInfo.fee;
		addMoney.string = money>=0?"+"+money:money+"";
		ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${p.moneyType}`,moneyIcon);
		if(p.moneyType != 1&&moneyIcon)
			moneyIcon.node.rotation = -16;
		let fontName = p.money < 0 ? "jinbizuanshizi02" : "jinbizuanshizi01"
		ResourceManager.LoadFont(fontName,score);
		ResourceManager.LoadFont(fontName,raise);
		ResourceManager.LoadFont(fontName,fee);
		ResourceManager.LoadFont(fontName,addMoney);
	}

	//抽奖完成
	protected lotteryComplete()
	{
		this.rematchBtn.node.active = true;
		this.replayBtn.node.active = true;
		this.returnBtn.node.active = true;
		this.shareBtn.node.active = true;
		let roomInfo = this.roomMatch.getRoomInfo();
		let giftProgressBar:cc.ProgressBar = getNodeChildByName(this.asset, "giftProgressBar",cc.ProgressBar);
		
		if(giftProgressBar) {
			giftProgressBar.progress = roomInfo.gameNum/3;
		}
	}

	//更新玩家
	protected updatePlayer(p:any,n:cc.Node,isWin:boolean)
	{
		let winFlag:cc.Node = getNodeChildByName(n,"WinFlag");
		let nickName:cc.Label = getNodeChildByName(n,"NickName",cc.Label);
		let headImg:cc.Sprite = getNodeChildByName(n,"headBg/mask/imgHead",cc.Sprite);
		if(p!=null)nickName.string= StringUtility.Cut(p.nick, 12);
		else nickName.string= "";
		winFlag.active = isWin;
		if(p.head != null) 
		{
			cc.assetManager.loadRemote(p.head, {ext: '.jpg'}, function(err, texture:cc.Texture2D) {
				if(err) return;
				headImg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
			})
		}
	}
	public dispose()
	{
		let expBar:cc.ProgressBar = getNodeChildByName(this.asset,"Infos/Player/ExpBar",cc.ProgressBar);
		expBar.node.stopAllActions();
		super.dispose();
	}
}