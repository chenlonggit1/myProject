import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../GameEvent";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { StoreManager } from "../../../Framework/Managers/StoreManager";
import { Assets } from "../../../Framework/Core/Assets";
import { LobbyGoodsNodeBinder } from "./LobbyGoodsNodeBinder";
import { SimpleRedPacketVO } from "../../VO/SimpleRedPacketVO";
import { PlayerRoleVO } from "../../VO/PlayerRoleVO";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { MemberConfigVO } from "../../VO/MemberConfigVO";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";

/**
*@description:大厅导航栏模块
**/
export class LobbyNavigationBinder extends FBinder 
{
	public static ClassName:string = "LobbyNavigationBinder";

	private lbVip:cc.Label = null;
	private vipProgressBar:cc.ProgressBar = null;
	private lbNickName:cc.Label = null;
	private imgHead:cc.Node = null;
	private marqueeNode:cc.Node = null;
	private marqueeMask:cc.Node = null;
	private marqueeList:string[] =[];
	private marqueeTween:cc.Tween = null;
	private rolePerson:cc.Node[] = [];
	
	protected initViews():void
	{
		super.initViews();

		this.lbVip = getNodeChildByName(this.asset, "playerInfo/vipNode/lbVip", cc.Label);
		this.vipProgressBar = getNodeChildByName(this.asset, "playerInfo/vipNode/lvProgressBar", cc.ProgressBar);
		this.lbNickName = getNodeChildByName(this.asset, "playerInfo/lbNickName", cc.Label);
		this.imgHead = getNodeChildByName(this.asset, "playerInfo/headBg/mask/imgHead");
		this.imgHead.on(cc.Node.EventType.TOUCH_END, () => {
			dispatchFEventWith(LobbyEvent.Open_PersonalInfo);
		}, this);
		let btnSet = getNodeChildByName(this.asset,"btn_set");
		btnSet.on(cc.Node.EventType.TOUCH_END, () => {
			dispatchFEventWith(LobbyEvent.Open_LobbySet);
		}, this);
		let btnService = getNodeChildByName(this.asset,"btn_service");
		btnService.on(cc.Node.EventType.TOUCH_END, () => {
			dispatchFEventWith(LobbyEvent.Open_LobbyServer);
		}, this);
		this.marqueeNode = getNodeChildByName(this.asset,"img_marquee");
		this.marqueeMask = getNodeChildByName(this.marqueeNode, "mask");
		for(let i = 0; i < 2; i++){
			this.rolePerson[i] = getNodeChildByName(this.asset, `img_person/role${i+1}`);
		}
		this.updatePlayerInfo();
		this.addGoodsNode();
		this.setRoleInfo();
		this.onSetMember();
	}

	protected addEvents()
	{
		super.addEvents();
		addEvent(this,LobbyEvent.Switch_Role,this.onSwitchRole);
		addEvent(this,LobbyEvent.Server_GetMemberInfo,this.onSetMember);
	}

    protected clearViews():void
    {
		// 清理动画
		if (this.marqueeTween)
		{
			this.marqueeTween.stop();
			this.marqueeTween = null;
		}
    }
	public update(data: {type: string, data: any})
	{
		// 接收到红包墙信息，显示在跑马灯上

		if (data.type == LobbyEvent.Server_AddRedPacket)
		{
			let d: SimpleRedPacketVO = data.data
			let s = `${d.nick}抽到了${d.num}红包卷`
			this.playMarqueeAni(s)
		}
	}

	//更新玩家信息
	private updatePlayerInfo() {
		let player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		this.lbNickName.string = player.nickName;
		// let remoteUrl = "https://thirdwx.qlogo.cn/mmopen/vi_32/Q3auHgzwzM67mK17drP34xhkNhE7oiauPuFcE38eNjWU1t9Nn0QwxNrdkQQ2dlVvSIfMOLQFwJPDzxdRVnjpGuA/132"
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
		this.asset.addChild(goodsNode);
		let goodsNodeInfo = this.addObject(new LobbyGoodsNodeBinder());
		goodsNodeInfo.bindView(goodsNode);
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
				break;
			}
		}
	}

	//切换角色
	private onSwitchRole() 
	{
		this.setRoleInfo();
	}

	//设置VIP
	private onSetMember()
	{
		let memberConfig:MemberConfigVO = GameDataManager.GetDictData(GameDataKey.MemberConfig,MemberConfigVO);
		let myLevel = memberConfig.getMyVipLevel();
		this.lbVip.string = "VIP" + myLevel;
		let nextPoint = memberConfig.getNextVipPoint(myLevel);
		this.vipProgressBar.progress = memberConfig.memberPoint / nextPoint;
	}

	//播放跑马灯动画
	public playMarqueeAni(message: string) 
	{
		// 新消息添加到列表里
		this.marqueeList.push(message);

		// 获取显示节点
		let messageNode = this.marqueeMask.getChildByName("messageNode");
		if (!messageNode) 
		{
			messageNode = new cc.Node("messageNode");
			messageNode.addComponent(cc.Label);
			this.marqueeMask.addChild(messageNode);
			messageNode.y = -5;
		}
		let messageLabel = messageNode.getComponent(cc.Label);
		
		// 构造处理消息函数
		let doFunc = () => {
			// 过滤
			if (this.marqueeList.length <= 0) 
			{
				this.marqueeNode.active = false;
				return;
			}

			this.marqueeNode.active = true;
			// 取出顶部消息
			let msg = this.marqueeList.shift();
			// 设置文本
			messageLabel.string = msg;
			(<any>messageLabel)._forceUpdateRenderData(); 
			// 运动时间
			let marqueeTime = 5;
			// 设置始末位置
			let targetPox = - this.marqueeMask.width / 2 - messageNode.width / 2;
			messageNode.x = this.marqueeMask.width / 2 + messageNode.width / 2;
			// 创建动画
			this.marqueeTween = cc.tween(messageNode)
									.to(marqueeTime, { position: cc.v3(targetPox, messageNode.y) })
									.call(() => {
										this.marqueeTween = null;
										// 执行下一条
										doFunc();
									})
			// 执行
			this.marqueeTween.start();
		}

		// 执行
		if (!this.marqueeTween) doFunc();
	}
}