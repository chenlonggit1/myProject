import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { StoreManager } from "../../../Framework/Managers/StoreManager";
import { Assets } from "../../../Framework/Core/Assets";
import { GameLotteryItemBinder } from "./GameLotteryItemBinder";
/**
*@description:游戏提示模块
**/
export class GameLotteryAwardBinder extends FBinder 
{
	public static ClassName:string = "GameLotteryAwardBinder";
	
	private cardNode:cc.Node = null;
	private clickConfirm:Function = null;

	protected initViews():void
	{
		super.initViews();
		
		this.cardNode = getNodeChildByName(this.asset,"cardNode");
		let btnConfirm = getNodeChildByName(this.asset, "btn_confirm");
		btnConfirm.on("click", () => {
			this.onConfirmClick();
		}, this);
	}

	protected addEvents():void
	{
		super.addEvents();
		
	}

	public setLotteryAward(data, clickConfirm)
	{
		let lotteryItemNode = StoreManager.NewPrefabNode(Assets.GetPrefab("GameScene/GameLottery/LotteryItem"));
		this.cardNode.addChild(lotteryItemNode);
		let lotteryItems:GameLotteryItemBinder = this.addObject(new GameLotteryItemBinder());
		lotteryItems.bindView(lotteryItemNode);
		lotteryItems.setLotteryAward(data);
		if (clickConfirm)
            this.clickConfirm = clickConfirm;
	}

	public onConfirmClick()
	{
		this.asset.active = false;
		if (this.clickConfirm)
            this.clickConfirm();
	}
}