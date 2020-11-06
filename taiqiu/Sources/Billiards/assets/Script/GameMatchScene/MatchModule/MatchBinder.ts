import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { StringUtility } from "../../../Framework/Utility/StringUtility";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { PlayerVO } from "../../VO/PlayerVO";
import { RoomVO } from "../../VO/RoomVO";
import { SimplePlayerVO } from "../../VO/SimplePlayerVO";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../GameEvent";
import { JTimer } from "../../../Framework/Timers/JTimer";
import { PlayGameID } from "../../Common/PlayGameID";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { RoomMatchVO } from "../../VO/RoomMatchVO";
import { CLanguage } from "../../../Framework/Components/CLanguage";
import { PlayerRoleVO } from "../../VO/PlayerRoleVO";
import { PlayerCueVO } from "../../VO/PlayerCueVO";
import { SimplePlayerCueVO } from "../../VO/SimplePlayerCueVO";
import { C_Lobby_ReqCancelMatch } from "../../Networks/Clients/C_Lobby_ReqCancelMatch";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { LobbyEvent } from "../../Common/LobbyEvent";

/**
*@description:游戏玩家匹配模块
**/
export class MatchBinder extends FBinder 
{
	public static ClassName:string = "MatchBinder";
	
	protected tipsNode:cc.Node = null;
	protected playerPanel:cc.Node = null;
	protected otherPanel:cc.Node = null;
	protected cancelBtn:cc.Button = null;
	protected player:PlayerVO = null;
	protected playerCue:PlayerCueVO = null;
	protected imgPerson:cc.Node[] = [];
	protected imgVs:cc.Node = null;
	private headNodeList:cc.Node[] = [];
	private matchTween:cc.Tween[] = [];
	private lastHeadIndex:number = -1;

	private timeout:number = 20; // 超时时间(s)

	protected initViews():void
	{
		super.initViews();
		
		this.tipsNode = getNodeChildByName(this.asset,"tipNode");
		this.playerPanel= getNodeChildByName(this.asset,"PlayerPanel");
		this.otherPanel = getNodeChildByName(this.asset,"OtherPanel");
		this.cancelBtn = getNodeChildByName(this.asset,"CancelBtn").getComponent(cc.Button);
		this.player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		this.playerCue = GameDataManager.GetDictData(GameDataKey.PlayerCue,PlayerCueVO);

		for(let i = 0; i < 2; i++)
			this.imgPerson[i] = getNodeChildByName(this.asset,"img_person"+(i+1));
		this.imgVs = getNodeChildByName(this.asset,"img_VS");
		this.updatePlayerInfo(this.playerPanel,this.player);
		this.updateOtherInfo(this.otherPanel,null);
		this.updateTitle();
		this.updateTips(this.tipsNode);
		this.playMatchAnim();
		this.setCueInfo();

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
	
	public update(data)
	{
		let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
		for (let i = 0; i < room.players.length; i++) 
		{
			if(room.players[i].id==this.player.id)continue;
			this.updateOtherInfo(this.otherPanel,room.players[i]);
		}
	}
	protected updateTitle()
	{
		let roomMatch:RoomMatchVO = GameDataManager.GetDictData(GameDataKey.RoomMatch,RoomMatchVO);
		// console.log("什么情况 1--- ", roomMatch.gameId)
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
		if(getNodeChildByName(this.asset,"Title")){
			let spTitle: CLanguage = getNodeChildByName(this.asset,"Title").getComponent(CLanguage);
			spTitle.key = getSpName();
		}
		let roomInfo = roomMatch.getRoomInfo();
		this.timeout = roomInfo.matchTime;
	}
	protected updatePlayerInfo(panel:cc.Node,info:PlayerVO)
	{
		let image = getNodeChildByName(panel,"headBg/mask/imgHead");
		let nickName = getNodeChildByName(panel,"NickName",cc.Label);
		let level = getNodeChildByName(panel,"Level",cc.Label);
		nickName.string = info.nickName;
		level.string = info.level;
		let playerRole = GameDataManager.GetDictData(GameDataKey.PlayerRole,PlayerRoleVO);
		let isMan = false;
		isMan = parseInt((playerRole.getMyRole().roleId / 1000).toString()) == 1 ? false : true;
		if(this.imgPerson[0])
			ResourceManager.LoadSpriteFrame(`Lobby/LobbyRole/LobbyRole?:${isMan?"img_Nan":"img_Nv"}`,this.imgPerson[0].getComponent(cc.Sprite));
		if(info.head != null) 
		{
			cc.assetManager.loadRemote(info.head, {ext: '.jpg'}, function(err, texture:cc.Texture2D) {
				if(err) return;
				if(image)
					image.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
			})
		}
	}
	protected updateOtherInfo(panel:cc.Node,info:SimplePlayerVO)
	{
		let headContent = getNodeChildByName(panel,"headScrollView/view/headContent");
		let nickName = getNodeChildByName(panel,"NickName",cc.Label);
		let level = getNodeChildByName(panel,"Level",cc.Label);
		if(info!=null)
		{
			//取最后一个头像
			let posX = 0;
			let index = 0;
			for(let i = 0; i < 3; i++) {
				if(posX < this.headNodeList[i].x) {
					posX = this.headNodeList[i].x;
					index = i;
				}
			}
			this.lastHeadIndex = index;
			//设置玩家信息
			let image:cc.Node = getNodeChildByName(this.headNodeList[index],"mask/imgHead");
			nickName.string = StringUtility.Cut(info.nickName, 12);
			level.string = info.level;
			console.log(info.head);
			if(info.head != null) 
			{
				cc.assetManager.loadRemote(info.head, {ext: '.jpg'}, function(err, texture:cc.Texture2D) {
					if(err) return;
					if(image&&cc.isValid(image))
						image.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
				})
			}else{
				//设置默认头像
				ResourceManager.LoadSpriteFrame(`Game/GameMatch/gameMatch?:5`,image.getComponent(cc.Sprite));
			}
		}else{
			nickName.string = "";
			level.string = "";
			for(let i = 0; i < 3; i++) {
				this.headNodeList[i] = getNodeChildByName(headContent,`headBg${i}`);
				let img = getNodeChildByName(this.headNodeList[i],"mask/imgHead").getComponent(cc.Sprite);
				ResourceManager.LoadSpriteFrame(`Game/GameMatch/gameMatch?:${Math.ceil(Math.random()*5)}`,img);
			}
			this.playHeadMatchAnim();
		}
		
	}

	//播放头像匹配动画
	protected playHeadMatchAnim()
	{
		let self = this;
		let time = 0.3;
		for(let i = 0; i < 3; i++) {
			let headNode = self.headNodeList[i];
			self.matchTween[i] = cc.tween(headNode)
				.by(time,{x:-149})
				.call(()=>{
					if(self.lastHeadIndex >= 0) {
						if(self.headNodeList[self.lastHeadIndex].x <= 72) {
							self.stopHeadMatchAnim();
						}
					}
					else if(headNode.x <= -77) {
						headNode.x = 370;
						let img = getNodeChildByName(headNode,"mask/imgHead").getComponent(cc.Sprite);
						ResourceManager.LoadSpriteFrame(`Game/GameMatch/gameMatch?:${Math.ceil(Math.random()*5)}`,img);
					}
				})
				.union()
				.repeatForever()
				.start()
		}
	}

	//停止头像匹配动画
	protected stopHeadMatchAnim()
	{
		for(let i = 0; i < 3; i++) {
			if(this.matchTween[i]) {
				this.matchTween[i].stop();
				this.matchTween[i] = null;
			}
		}
	}

	//匹配时间
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
	//播放匹配动画
	private playMatchAnim()
	{
		this.imgVs.active = false;
		this.playerPanel.x += 1060;
		this.otherPanel.x -= 1060;
		this.imgPerson[0].x += 1060;
		this.imgPerson[1].x -= 1060;
		cc.tween(this.playerPanel).by(0.5, { x: -1060}, {easing: "sineIn"}).start();
		cc.tween(this.otherPanel).by(0.5, { x: 1060}, {easing: "sineIn"}).start();
		cc.tween(this.imgPerson[0]).delay(0.6).by(0.5, { x: -1060}, {easing: "sineIn"}).start();
		cc.tween(this.imgPerson[1]).delay(0.6).by(0.5, { x: 1060}, {easing: "sineIn"}).start();
		cc.tween(this.imgVs)
			.delay(1.2)
			.call(()=>{this.imgVs.active = true;this.imgVs.setScale(2);})
			.to(0.2,{scale:0.8})
			.to(0.05,{scale:1})
			.call(()=>{this.imgVs.getComponent(cc.Animation).play("vsAnim");})
			.start();
	}
	//设置球杆
	private setCueInfo()
	{
		let myCue:SimplePlayerCueVO = this.getMyUseCue();
		let cueInfo = this.playerCue.getCueById(myCue.cueID);
		let cueGrade = getNodeChildByName(this.playerPanel,"img_icon",cc.Sprite);
		let cueName = getNodeChildByName(this.playerPanel,"lb_gan",CLanguage);
		cueName.key = "Text_qiugan"+Math.floor(myCue.cueID/100);
		ResourceManager.LoadSpriteFrame(`Lobby/LobbyCue/LobbyCue?:${cueInfo.quality}`,cueGrade);
		cc.log(`我的球杆 ${myCue.cueID} ${myCue.name}`);
		// console.log(cueInfo.quality,myCue.name);
	}
	//获取我使用的球杆
	private getMyUseCue()
	{
		for(let i = 0; i < this.playerCue.myCues.length; i++) {
			if(this.playerCue.myCues[i].isUse) {
				return this.playerCue.myCues[i];
			}
		}
		return null;
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