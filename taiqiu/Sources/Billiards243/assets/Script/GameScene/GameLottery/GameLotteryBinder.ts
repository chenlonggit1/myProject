import { FBinder } from "../../../Framework/Core/FBinder";
import { GameLayer } from "../../../Framework/Enums/GameLayer";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { ModuleNames } from "../../ModuleNames";
import { PlayerVO } from "../../VO/PlayerVO";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../GameEvent";
import { StoreManager } from "../../../Framework/Managers/StoreManager";
import { Assets } from "../../../Framework/Core/Assets";
import { GameLotteryItemBinder } from "./GameLotteryItemBinder";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { GameLotteryAwardBinder } from "./GameLotteryAwardBinder";
/**
*@description:游戏提示模块
**/
export class GameLotteryBinder extends FBinder 
{
	public static ClassName:string = "GameLotteryBinder";
	
	private tipNode:cc.Node = null;
	private lotteryContent:cc.Node = null;
	private player:PlayerVO = null;
	private lotteryItems:GameLotteryItemBinder[] = [];
	private btnConfirm:cc.Node = null;

	protected initViews():void
	{
		super.initViews();
		
		this.tipNode = getNodeChildByName(this.asset, "tipNode");
		this.lotteryContent = getNodeChildByName(this.asset, "lotteryContent");
		this.btnConfirm = getNodeChildByName(this.asset, "btn_confirm");
		this.btnConfirm.on("click", () => {
			this.onConfirmClick();
		}, this);
		this.player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		this.setLottery();
	}

	protected addEvents():void
	{
		super.addEvents();
		addEvent(this,LobbyEvent.Server_RewardLottery,this.setLotteryAward);
		
	}

	//设置抽奖
	setLottery()
	{
		for(let i = 0; i < 10; i++)
		{
			let lotteryItemNode = StoreManager.NewPrefabNode(Assets.GetPrefab("GameScene/GameLottery/LotteryItem"));
			this.lotteryContent.addChild(lotteryItemNode);
			this.lotteryItems[i] = this.addObject(new GameLotteryItemBinder());
			this.lotteryItems[i].bindView(lotteryItemNode);
			lotteryItemNode.setScale(0.8);
			this.lotteryItems[i].setLotteryIndex(i,()=> {
				this.closeLotteryClick();
			});
		}
	}

	//关闭抽奖卡牌点击
	closeLotteryClick()
	{
		this.tipNode.active = false;
		for(let i = 0; i < 10; i++)
		{
			this.lotteryItems[i].setLotteryClick();
		}
	}

	//领奖
	setLotteryAward(data)
	{
		let awardData = data.data;
		let lotteryAwardNode = StoreManager.NewPrefabNode(Assets.GetPrefab("GameScene/GameLottery/LotteryAward"));
		this.asset.addChild(lotteryAwardNode);
		let lotteryAward:GameLotteryAwardBinder = this.addObject(new GameLotteryAwardBinder());
		lotteryAward.bindView(lotteryAwardNode);
		let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		let index = player.lotteryIndex;
		this.lotteryItems[index].setLotteryItem(awardData.lotteryItem);
		lotteryAward.setLotteryAward(awardData.lotteryItem, ()=>{
			let time = 500;
			let curTime = 100;
			for(let i = 0; i < 10; i++)
			{
				curTime += time * 0.8;
				time *= 0.8;
				setTimeout(() => {
					if(i < index)
						this.lotteryItems[i].setLotteryItem(awardData.lotteryItems[i]);
					else if(i > index)
						this.lotteryItems[i].setLotteryItem(awardData.lotteryItems[i-1]);
				},  curTime);
			}
			setTimeout(()=>{
				this.btnConfirm.active = true;
			},1500);
		});
		
	}

	private	onConfirmClick()
	{
		dispatchFEventWith(GameEvent.On_Lottery_Complete);
		dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.Game_Lottery, null, GameLayer.UI);
	}

}