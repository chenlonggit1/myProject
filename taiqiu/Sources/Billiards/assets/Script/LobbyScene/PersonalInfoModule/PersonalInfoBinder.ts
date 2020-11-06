import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { PlayerVO } from "../../VO/PlayerVO";
import { LobbyNavigationBinder } from "../NavigationModule/LobbyNavigationBinder";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { GameLayer } from "../../../Framework/Enums/GameLayer";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { StoreManager } from "../../../Framework/Managers/StoreManager";
import { Assets } from "../../../Framework/Core/Assets";
import { LobbyGoodsNodeBinder } from "../NavigationModule/LobbyGoodsNodeBinder";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../GameEvent";
import { C_Lobby_PersonalInfo } from "../../Networks/Clients/C_Lobby_PersonalInfo";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { C_Lobby_MyCue } from "../../Networks/Clients/Cue/C_Lobby_MyCue";
import { PlayerCueVO } from "../../VO/PlayerCueVO";
import { SimplePlayerCueVO } from "../../VO/SimplePlayerCueVO";
import { PlayerRoleVO } from "../../VO/PlayerRoleVO";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { CLanguage } from "../../../Framework/Components/CLanguage";
import { getLang } from "../../../Framework/Utility/dx/getLang";
import { SimplePlayerRoleVO } from "../../VO/SimplePlayerRoleVO";
import { MemberConfigVO } from "../../VO/MemberConfigVO";
import { CuePropertyVO } from "../../VO/CuePropertyVO";
import { CDragonBones } from "../../../Framework/Components/CDragonBones";

/**
*@description:大厅个人信息模块
**/
export class PersonalInfoBinder extends FBinder 
{
	public static ClassName:string = "PersonalInfoBinder";
	
	private lbNickName:cc.Label = null;
	private lbID:cc.Label = null;
	private imgHead:cc.Node = null;

	private gamePlay:CLanguage[] = [];
	private gamePlayIndex = 0;

	private lbNums:cc.Label = null;
	private lbWinRate:cc.Label = null;
	private lbFlee:cc.Label = null;
	private lbWins:cc.Label = null;
	private lbWinningStreak:cc.Label = null;
	private personalInfo:object[] = [];

	private imgIcon:cc.Sprite = null;
	private cueName:CLanguage = null;
	private imgCue:cc.Sprite = null;
	private imgCueAnim:dragonBones.ArmatureDisplay = null;
	private cueStar:cc.Sprite[] = [];

	private roleText:cc.Label[] = [];
	private roleProgressBar:cc.ProgressBar = null;
	private roleLevel:cc.Label = null;
	private roleName:cc.Label = null;
	private roleImg:cc.Sprite = null;
	private rolePerson:cc.Node[] = [];

	protected initViews():void
	{
		super.initViews();

		let lobbyNavigation = getNodeChildByName(this.asset,"LobbyNavigation");

		this.lbNickName = getNodeChildByName(lobbyNavigation, "playerInfo/lbNickName", cc.Label);
		this.lbID = getNodeChildByName(lobbyNavigation,"playerInfo/lbID", cc.Label);
		this.imgHead = getNodeChildByName(lobbyNavigation, "playerInfo/headBg/mask/imgHead", cc.Sprite);
		this.updatePlayerInfo();

		let btnBack = getNodeChildByName(this.asset,"btn_back");
		btnBack.on(cc.Node.EventType.TOUCH_END, () => {
			dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.Lobby_PersonalInfo, null, GameLayer.UI);
		}, this);
		let gamePlayNode = getNodeChildByName(this.asset, "gamePlayNode");
		for(let i = 0; i < 4; i++) {
			this.gamePlay[i] = getNodeChildByName(gamePlayNode, "gamePlay"+(i+1), CLanguage);
			this.gamePlay[i].node.on(cc.Node.EventType.TOUCH_END, () => {
				this.setGamePlay(i);
			}, this);
		}
		
		let infoNode = getNodeChildByName(this.asset, "infoNode");
		this.lbNums = getNodeChildByName(infoNode, "lbNums", cc.Label);
		this.lbWinRate = getNodeChildByName(infoNode, "lbWinRate", cc.Label);
		this.lbFlee = getNodeChildByName(infoNode, "lbFlee", cc.Label);
		this.lbWins = getNodeChildByName(infoNode, "lbWins", cc.Label);
		this.lbWinningStreak = getNodeChildByName(infoNode, "lbWinningStreak", cc.Label);
		let btnSwitch = getNodeChildByName(this.asset, "btn_switch");
		btnSwitch.on(cc.Node.EventType.TOUCH_END, () => {
			dispatchFEventWith(LobbyEvent.Open_LobbyRole);
		}, this);

		let cueNode = getNodeChildByName(this.asset,"cueNode");
		let cueBg = getNodeChildByName(cueNode,"img_cueBg");
		cueBg.on(cc.Node.EventType.TOUCH_END,()=>{
			dispatchFEventWith(LobbyEvent.Open_CueInfo);
			dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.Lobby_PersonalInfo, null, GameLayer.UI);
		}, this);
		this.imgIcon = getNodeChildByName(cueNode,"img_icon",cc.Sprite);
        this.cueName = getNodeChildByName(cueNode,"cueName",CLanguage);
		// this.imgCue = getNodeChildByName(cueNode,"img_cue",cc.Sprite);
		this.imgCueAnim = getNodeChildByName(cueNode, "img_cueAnim", dragonBones.ArmatureDisplay);
		let cueStarNode = getNodeChildByName(cueNode,"curStar");
        for(let i = 0; i < 5; i++) {
            this.cueStar[i] = getNodeChildByName(cueStarNode,"star"+(i+1),cc.Sprite);
		}

		this.roleLevel = getNodeChildByName(this.asset, `level`,cc.Label);
		this.roleProgressBar = getNodeChildByName(this.asset, `LvProgressBar`,cc.ProgressBar);
		let roleTextNode = getNodeChildByName(this.asset, `LvProgressBar/lbDesc`);
		for(let i = 0; i < 4; i++) {
			this.roleText[i] = getNodeChildByName(roleTextNode, `layout${i}/lbDesc${i}`,cc.Label);
		}
		this.roleName = getNodeChildByName(this.asset, `lbText`,cc.Label);
		this.roleImg = getNodeChildByName(this.asset, `img_level`,cc.Sprite);
		for(let i = 0; i < 2; i++){
			this.rolePerson[i] = getNodeChildByName(this.asset, `img_person/role${i+1}`);
		}

		this.addGoodsNode();
		this.onServerMyCue();
		C_Lobby_PersonalInfo.Send();
	}

	protected addEvents() {
		super.addEvents();
		addEvent(this,LobbyEvent.Update_Personal_Info,this.updatePersonalInfo);
		addEvent(this,LobbyEvent.Server_MyCue,this.onServerMyCue);
		addEvent(this,LobbyEvent.Switch_Role,this.onSwitchRole);
	}

	//更新玩家信息
	private updatePlayerInfo() {
		let player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		this.lbNickName.string = player.nickName;
		this.lbID.string = `${player.id}：ID`;

		if(player.head != null) 
		{
			let self = this;
			cc.assetManager.loadRemote(player.head, {ext: '.jpg'}, function(err, texture:cc.Texture2D) {
				if(err) return;
				self.imgHead.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
			})
		}
	}

	//添加物品节点
	private addGoodsNode() {
		let goodsNode = StoreManager.NewPrefabNode(Assets.GetPrefab("LobbyScene/Navigation/GoodsNode"));
		getNodeChildByName(this.asset,"LobbyNavigation").addChild(goodsNode);
		let goodsNodeInfo = this.addObject(new LobbyGoodsNodeBinder());
		goodsNodeInfo.bindView(goodsNode);
	}

	//设置游戏玩法
	private setGamePlay(index) {
		if (this.gamePlayIndex == index) return;
		this.gamePlayIndex = index;
		let wanfaNameList = ["btn_ZhongShiBaQiu0", "btn_HongQiuWanFa0", "btn_ChouPaiWanFa15Z0","btn_ChouPaiWanFa54Z0"];
		for(let i = 0; i < 4; i++) {
			let wanfaName = wanfaNameList[i] + (index == i ? 1 : 2)
			// ResourceManager.LoadSpriteFrame(`Lobby/PersonalInfo/PersonalInfo?:${wanfaName}`,this.gamePlay[i].getComponent(cc.Sprite));
			this.gamePlay[i].key = wanfaName;
		}
		this.setGamePlayInfo();
	}

	//更新个人信息
	private updatePersonalInfo(data) {
		for(let i = 0; i < data.data.length; i++) {
			this.personalInfo.push(data.data[i]);
		}
		this.setGamePlayInfo();
	}

	//设置玩法信息
	private setGamePlayInfo() {
		let info = this.personalInfo[this.gamePlayIndex];
		if(!info) return;
		this.lbNums.string = info["total"];
		this.lbWinRate.string = info["total"] == 0 ? "0%" : `${Math.round(info["win"]/info["total"]*100)}%`;
		this.lbFlee.string = info["total"] == 0 ? "0%" : `${Math.round(info["run"]/info["total"]*100)}%`;
		this.lbWins.string = info["win"];
		this.lbWinningStreak.string = info["streak"] < 0 ? "0" : info["streak"];
	}

	//设置我的球杆
	private onServerMyCue()
	{
		let playerCue:PlayerCueVO = GameDataManager.GetDictData(GameDataKey.PlayerCue,PlayerCueVO);
		let simplePlayerCue:SimplePlayerCueVO = playerCue.getMyUseCue();
		if(!simplePlayerCue) return;
		ResourceManager.LoadSpriteFrame(`Lobby/LobbyCue/LobbyCue?:img_${simplePlayerCue.quality}`,this.imgIcon);
		this.cueName.key = "Text_qiugan"+Math.floor(simplePlayerCue.cueID/100);
		for(let i = 0; i < simplePlayerCue.star; i++) {
            let cueXingName = i > 4 ? "img_Xing03" : "img_Xing02";
            ResourceManager.LoadSpriteFrame(`Lobby/LobbyCue/LobbyCue?:${cueXingName}`,this.cueStar[i > 4 ? i - 5 : i]);
        }
		// ResourceManager.LoadSpriteFrame(`Lobby/LobbyCuePicture/LobbyCuePicture?:cue${simplePlayerCue.cueRes}`,this.imgCue);
		let index = simplePlayerCue.cueRes;
		CDragonBones.setDragonBones(this.imgCueAnim,`DragonBones/Cue/cue${index}/cue${index}_ske`,`DragonBones/Cue/cue${index}/cue${index}_tex`,
            `cue${index}`,`cue${index}`,0);
	}

	//设置角色信息
	public setRoleInfo()
	{
		let playerRole = GameDataManager.GetDictData(GameDataKey.PlayerRole,PlayerRoleVO);

		for(let i = 0; i < playerRole.myPlayerRoles.length; i++) {
			let roleInfo = playerRole.myPlayerRoles[i];
			if(roleInfo.isUse == 1) {
				this.rolePerson[0].active = i == 0;
				this.rolePerson[1].active = i == 1;
				
				this.roleLevel.string = roleInfo.star.toString();
				// this.roleName.string = roleInfo.name;
				this.roleName.string = i == 0 ? getLang("Text_jsxx1") : getLang("Text_jsxx2");
				let nextRole = playerRole.getRole(playerRole.myPlayerRoles[i].roleId+1);
				ResourceManager.LoadSpriteFrame(`Lobby/LobbyCue/LobbyCue?:${roleInfo.quality}`,this.roleImg);
				if (nextRole)
					this.roleProgressBar.progress = roleInfo.exp/nextRole.roleExp;
				else 
					this.roleProgressBar.progress = 1;

				this.setText();
				break;
			}
		}
	}

	/**
	 * 设置力度、加塞、瞄准器、战力
	 * 角色+球杆+VIP
	 */
	private setText()
	{
		let cueProperty:CuePropertyVO = GameDataManager.GetDictData(GameDataKey.CueProperty,CuePropertyVO);
		cueProperty.updateCueProperty();
		for(let i = 0; i < 4; i++) {
			this.roleText[i].string = "";
		}
		this.roleText[0].string=`+${cueProperty.power}`;
		this.roleText[1].string=`+${cueProperty.gase}`;
		this.roleText[2].string=`+${cueProperty.aim}`;
		this.roleText[3].string=`+${cueProperty.combat}`;
	}

	//切换角色
	private onSwitchRole() 
	{
		this.setRoleInfo();
	}
}