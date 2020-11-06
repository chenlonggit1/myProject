import { FBinder } from "../../../Framework/Core/FBinder";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { SimplePlayerVO } from "../../VO/SimplePlayerVO";
import { StringUtility } from "../../../Framework/Utility/StringUtility";
import { RoomVO } from "../../VO/RoomVO";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../GameEvent";
import { JTimer } from "../../../Framework/Timers/JTimer";
import { PlayGameID } from "../../Common/PlayGameID";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { RoomMatchVO } from "../../VO/RoomMatchVO";
import { FFunction } from "../../../Framework/Core/FFunction";
import { CLanguage } from "../../../Framework/Components/CLanguage";
import { PlayerRoleVO } from "../../VO/PlayerRoleVO";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { C_Lobby_ReqCancelMatch } from "../../Networks/Clients/C_Lobby_ReqCancelMatch";

/**
*@description:抽牌玩法匹配界面
**/
export class GameCardMatchBinder extends FBinder 
{
	public static ClassName:string = "GameCardMatchBinder";
	
	protected tipsNode:cc.Node = null;
	protected playerNodes:cc.Node[] = [];
	protected player:PlayerVO = null;
	protected cancelBtn:cc.Button = null;
	protected returnBtn:cc.Node = null;
	protected imgPerson:cc.Sprite = null;

	private timeout: number = 20; // 超时时间(s)

	protected initViews():void
	{
		super.initViews();
		this.tipsNode = getNodeChildByName(this.asset,"tipNode");
		this.player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		let playerNode:cc.Node = getNodeChildByName(this.asset,"Players");
		this.cancelBtn = getNodeChildByName(this.asset,"CancelBtn").getComponent(cc.Button);
		this.returnBtn = getNodeChildByName(this.asset,"FanHuiBtn");
		this.imgPerson = getNodeChildByName(this.asset,"img_person1",cc.Sprite);
		for (let i = 0; i < playerNode.childrenCount; i++) 
			this.playerNodes[i] = playerNode.children[i];
		this.updateTitle();
		this.updateTips(this.tipsNode);
		this.update();

		// 注册按钮点击事件
		this.cancelBtn.node.on("click", this.cancelMatch, this);
		this.cancelBtn.node.active = true;
	}
	protected clearViews():void
	{
		super.clearViews();
	}

	protected addEvents()
	{
		super.addEvents();
		addEvent(this,GameEvent.MatchPlayer_Succ,()=>this.cancelBtn.node.active = false);
		addEvent(this,LobbyEvent.Server_Cancel_Match,this.onCancelMatch);
	}

	public update(data?:any)
	{
		let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
		let players:SimplePlayerVO[] = [this.player];
		for (let i = 0; i < room.players.length; i++) 
		{
			if(room.players[i].id==this.player.id)continue;
			players.push(room.players[i]);
		}
		while(players.length<this.playerNodes.length)
			players.push(null);
		this.updatePlayers(players);
	}
	protected updateTitle()
	{
		let roomMatch:RoomMatchVO = GameDataManager.GetDictData(GameDataKey.RoomMatch,RoomMatchVO);
		let getSpName = () => {
			switch(roomMatch.gameId)
			{
				case PlayGameID.EightBall: return "img_ZhongShiBaQiu02";
				case PlayGameID.RedBall: return "img_HongQiuWanFa02";
				case PlayGameID.Card54: return "img_ChouPaiWanFa54";
				case PlayGameID.Card15: return "img_ChouPaiWanFa15";
				default: return "img_ZhongShiBaQiu02";
			}
		}
		let spTitle: CLanguage = getNodeChildByName(this.asset,"Title").getComponent(CLanguage);
		spTitle.key = getSpName();
		let roomInfo = roomMatch.getRoomInfo();
		this.timeout = roomInfo.matchTime;
	}
	protected updatePlayers(players:SimplePlayerVO[])
	{
		for (let i = 0; i < players.length; i++) 
		{
			if(i>=this.playerNodes.length)continue;
			this.updatePlayerInfo(players[i],this.playerNodes[i]);
		}
	}
	protected updatePlayerInfo(player:SimplePlayerVO,n:cc.Node)
	{
		let image:cc.Sprite = getNodeChildByName(n,"headBg/mask/imgHead",cc.Sprite);
		let nickName = getNodeChildByName(n,"NickName",cc.Label);
		if(player!=null)nickName.string = StringUtility.Cut(player.nickName, 12);
		else nickName.string = "";
		let playerRole = GameDataManager.GetDictData(GameDataKey.PlayerRole,PlayerRoleVO);
		let isMan = false;
		isMan = parseInt((playerRole.getMyRole().roleId / 1000).toString()) == 1 ? false : true;
				
		ResourceManager.LoadSpriteFrame(`Lobby/LobbyRole/LobbyRole?:${isMan?"img_Nan":"img_Nv"}`,this.imgPerson);
		if(player && player.head != null) 
		{
			cc.assetManager.loadRemote(player.head, {ext: '.jpg'}, function(err, texture:cc.Texture2D) {
				if(err) return;
				image.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
			})
		}
	}
	protected updateTips(node:cc.Node):void
	{
		dispatchFEventWith(GameEvent.On_Start_Match);
		// 获取时间Label
		let time = node.getChildByName("time").getComponent(cc.Label);

		let timer:JTimer = this.addObject(JTimer.GetTimer(1000, this.timeout));
		timer.addTimerCallback(this, () => 
		{
			time.string = timer.repeatCount+"S";
			if (timer.repeatCount == 0) time.node.active = false;
		});
		timer.start();
		time.string = this.timeout + "S";

	}
	//取消匹配
	private cancelMatch()
	{
		C_Lobby_ReqCancelMatch.Send();
	}

	private onCancelMatch() {
		// 返回大厅
		this.cancelBtn.node.active = false;
		dispatchFEventWith(GameEvent.On_Match_Back);
	}
}