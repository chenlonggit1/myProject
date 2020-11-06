import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../GameEvent";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { showPopup } from "../../Common/showPopup";
import { PopupType } from "../../PopupType";
import { C_Lobby_Config } from "../../Networks/Clients/C_Lobby_Config";
import { Native } from "../../Common/Native";
import { C_Lobby_ReqShare } from "../../Networks/Clients/C_Lobby_ReqShare";
import { ConfigVO } from "../../VO/ConfigVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { PlayerVO } from "../../VO/PlayerVO";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { PlayerCueVO } from "../../VO/PlayerCueVO";

/**
*@description:大厅底部栏模块
**/
export class LobbyBottomBarBinder extends FBinder 
{
	public static ClassName:string = "LobbyBottomBarBinder";

	private btnShop:cc.Node = null;
	private btnShare:cc.Node = null;
	private btnMail:cc.Node = null;
	private mailRedPoint:cc.Node = null;
	private btnTask:cc.Node = null;
	private taskRedPoint:cc.Node = null;
	private btnActivity:cc.Node = null;
	private btnRedpacket:cc.Node = null;
	private btnVip:cc.Node = null;
	private btnCue:cc.Node = null;
	
	protected initViews():void
	{
		super.initViews();

		this.btnShop = getNodeChildByName(this.asset, "btn_shop");
		this.btnShop.on(cc.Node.EventType.TOUCH_START, () => {
			dispatchFEventWith(LobbyEvent.Open_LobbyShop);
		}, this);
		let bottomNode = getNodeChildByName(this.asset, "bottomNode");
		this.btnShare = getNodeChildByName(bottomNode, "btn_share");
		this.btnShare.on(cc.Node.EventType.TOUCH_START, () => {
			let config:ConfigVO = GameDataManager.GetDictData(GameDataKey.Config,ConfigVO);
			let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
			let origin = "";
			if(cc.sys.isNative) origin = Native.getAPKChannel();
			let url = `${config.share_url}?game_id=${config.game_id}&invoke_id=${player.id}&tq_channel=${origin}`;
			if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS) {
				Native.wxShare(url,config.share_title,config.share_desc,2);
				C_Lobby_ReqShare.Send();
			}
		}, this);
		this.btnMail = getNodeChildByName(bottomNode, "btn_mail");
		this.mailRedPoint = getNodeChildByName(this.btnMail, "redPoint");
		this.btnMail.on(cc.Node.EventType.TOUCH_START, () => {
			dispatchFEventWith(LobbyEvent.Open_LobbyMail);
		}, this);
		this.btnTask = getNodeChildByName(bottomNode, "btn_task");
		this.taskRedPoint = getNodeChildByName(this.btnTask, "redPoint");
		this.btnTask.on(cc.Node.EventType.TOUCH_START, () => {
			dispatchFEventWith(LobbyEvent.Open_LobbyTask);
		}, this);
		this.btnActivity = getNodeChildByName(bottomNode, "btn_activity");
		this.btnActivity.on(cc.Node.EventType.TOUCH_START, () => {
			dispatchFEventWith(LobbyEvent.Open_LobbyActivity);
		}, this);
		this.btnRedpacket = getNodeChildByName(bottomNode, "btn_redpacket");
		this.btnRedpacket.on(cc.Node.EventType.TOUCH_START, () => {
			dispatchFEventWith(LobbyEvent.Open_LobbyRedPacket);
		}, this);
		this.btnVip = getNodeChildByName(bottomNode, "btn_vip");
		this.btnVip.on(cc.Node.EventType.TOUCH_START, () => {
			dispatchFEventWith(LobbyEvent.Open_LobbyMember);
		}, this);
		this.btnCue = getNodeChildByName(bottomNode, "btn_cue");
		this.btnCue.on(cc.Node.EventType.TOUCH_START, () => {
			dispatchFEventWith(LobbyEvent.Open_CueInfo);
		}, this);
	}

	protected addEvents()
    {
        super.addEvents();
		addEvent(this,LobbyEvent.Update_LobbyRedPoint,this.updateRedPoint);
	}

	/**
	 * 更新红点
	 * data.type 1邮件 2任务
	 * data.isOpen 是否打开红点
	 */
	private updateRedPoint(data)
	{
		let redPointData = data.data;
		if(redPointData.type == 1) {
			if(this.mailRedPoint.active == redPointData.isOpen) return;
			this.mailRedPoint.active = redPointData.isOpen;
		}else if(redPointData.type == 2) {
			if(this.taskRedPoint.active == redPointData.isOpen) return;
			this.taskRedPoint.active = redPointData.isOpen;
		} else if(redPointData.type == 3) { // 球杆耐久不足
			this.btnCue.children[0].active = redPointData.isOpen; 
		}
	}

	public updateView() {
		let playCue:PlayerCueVO = GameDataManager.GetDictData(GameDataKey.PlayerCue);
		if(playCue) {
			let useCue = playCue.getMyUseCue();
			if(useCue)
				this.btnCue.children[0].active = useCue.isNeedDefend();
		}
	}
}