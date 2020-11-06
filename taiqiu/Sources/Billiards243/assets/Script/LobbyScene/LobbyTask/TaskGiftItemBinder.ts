import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { SimpleActiveTaskVO } from "../../VO/SimpleActiveTaskVO";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { CDragonBones } from "../../../Framework/Components/CDragonBones";

/**
*@description:大厅任务模块
**/
export class TaskGiftItemBinder extends FBinder 
{
	public static ClassName:string = "TaskGiftItemBinder";

	private imgGift:cc.Node = null;
	private imgGiftGet:cc.Node = null;
	private imgRedPoint:cc.Node = null;
	private giftText:cc.Label = null;
	private giftAnim:dragonBones.ArmatureDisplay = null;

	protected initViews():void
	{
		super.initViews();

		this.imgGift = getNodeChildByName(this.asset, "img_gift");
		this.imgGiftGet = getNodeChildByName(this.asset, "img_giftGet");
		this.imgRedPoint = getNodeChildByName(this.asset, "img_redPoint");
		this.giftText = getNodeChildByName(this.asset, "gift_text", cc.Label);
		this.giftAnim = getNodeChildByName(this.asset, "giftAnim", dragonBones.ArmatureDisplay);
	}

	//设置活跃奖励
	public setTaskGift(data:SimpleActiveTaskVO,currentActive:number,isGet:boolean)
	{
		this.giftText.string = data.milepost.toString();
		ResourceManager.LoadSpriteFrame(`Lobby/LobbyTask/LobbyTask?:img_XiangZi0${data.icon}`,this.imgGift.getComponent(cc.Sprite));
		if(data.milepost <= currentActive) {
			this.imgGift.active = false;
			this.imgGiftGet.active = isGet;
			this.imgRedPoint.active = !isGet;
			this.giftAnim.node.active = !isGet;
			if(isGet) 
				ResourceManager.LoadSpriteFrame(`Lobby/LobbyTask/LobbyTask?:img_XiangZiDaKai0${data.icon}empty`,this.imgGiftGet.getComponent(cc.Sprite));
			else 
				this.giftAnim.playAnimation(`img_XiangZiDaKai0${data.icon}`,0);
		}
	}

	

}