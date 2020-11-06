import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { GameLayer } from "../../../Framework/Enums/GameLayer";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { C_Lobby_ReqSystemNotice } from "../../Networks/Clients/C_Lobby_ReqSystemNotice";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { CNodePool } from "../../../Framework/Components/CNodePool";
import { ISystemNotice, S2C_SystemNotice } from "../../Networks/Protobuf/billiard_pb";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { FEvent } from "../../../Framework/Events/FEvent";

/**
*@description:大厅活动模块
**/
export class LobbyActivityBinder extends FBinder 
{
	public static ClassName:string = "LobbyActivityBinder";

	private activityNode:cc.Node = null;
	private noticeNode:cc.Node = null;
	private activity:cc.Node[] = [];
	private tip:cc.Node = null;
	private activityIndex:number = 0;
	private itemPool:CNodePool = null;
	private noticeInfo:ISystemNotice[] = [];
	private player:PlayerVO = null;
	
	protected initViews():void
	{
		super.initViews();

		let btnBack = getNodeChildByName(this.asset,"btn_back");
		btnBack.on(cc.Node.EventType.TOUCH_END, () => {
			dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.Lobby_Activity, null, GameLayer.UI);
			this.resetAll();
		}, this);

		this.activityNode = getNodeChildByName(this.asset, "activityNode");
		this.noticeNode = getNodeChildByName(this.asset, "img");
		this.tip = getNodeChildByName(this.asset,"tip");
		this.tip.active = false;

		// 初始化pool
		let activityItem = getNodeChildByName(this.activityNode,"btnTitle");
		activityItem.removeFromParent();
		this.itemPool = new CNodePool(activityItem);

		C_Lobby_ReqSystemNotice.Send();
	}

	protected addEvents() {
		super.addEvents();
		addEvent(this,LobbyEvent.Server_System_Notice,this.onSetSystemNotice);
	}

	//设置系统公告
	private onSetSystemNotice(data: FEvent)
	{
		let systemNoticeInfo:S2C_SystemNotice = data.data;
		this.setSystemNotice(systemNoticeInfo.notices);
	}

	public setSystemNotice(notices: ISystemNotice[]){
		notices || (notices = this.noticeInfo);
		if (!notices || notices.length == 0) {
			this.tip.active = true;
			return;
		}
		 // 创建节点池
		 this.tip.active = false;
		
		notices.sort((a,b)=>{return a.order - b.order}); 
		this.noticeInfo = notices;

		for(let i = 0; i < notices.length; i++) {
			let newItem = this.itemPool.Get();
			newItem.active = true;
			this.activityNode.addChild(newItem);
			this.activity[i] = newItem;
			newItem.on(cc.Node.EventType.TOUCH_END, () => {
				if (this.activityIndex == i) return;
				this.setActivity(i);
			}, this);
			if(notices[i].force == 1)
				this.activityIndex = i;
		}
		this.setActivity(this.activityIndex);
	}

	//设置活动
	private setActivity(index)
	{
		this.player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		this.activityIndex = index;
		for(let i = 0; i < this.activity.length; i++) {
			let name = this.activityIndex == i ? 0 : 1;
			ResourceManager.LoadSpriteFrame(`Lobby/LobbyActivity/LobbyActivity?:btnTitle${name}`,this.activity[i].getComponent(cc.Sprite));
			
			let titleImg = getNodeChildByName(this.activity[i],"titleImg",cc.Sprite); 
			let titleUrl = this.player.isChinese ? this.noticeInfo[i]["cnTitle"] : this.noticeInfo[i]["wyTitle"];
			if(titleUrl != null) 
			{
				cc.assetManager.loadRemote(titleUrl, {ext: '.jpg'}, function(err, texture:cc.Texture2D) {
					if(err) return;
					titleImg.spriteFrame = new cc.SpriteFrame(texture);
				})
			}
		}
		this.setActivityImg();
	}

	//设置活动图片
	private setActivityImg() {
		let img = this.noticeNode.getComponent(cc.Sprite);
		let imgUrl = this.player.isChinese ? this.noticeInfo[this.activityIndex]["cnContent"] : this.noticeInfo[this.activityIndex]["wyContent"];
		if(imgUrl != null) 
		{
			cc.assetManager.loadRemote(imgUrl, {ext: '.jpg'}, function(err, texture:cc.Texture2D) {
				if(err) return;
				img.node.active = true;
				img.spriteFrame = new cc.SpriteFrame(texture);
			})
		}
	}

	private resetAll() {
		while(this.activityNode.childrenCount) {
			this.activityNode.children[0].off(cc.Node.EventType.TOUCH_END);
			this.itemPool.Put(this.activityNode.children[0]);
		}
		this.activity = [];
		this.activityIndex = 0;
	}

}