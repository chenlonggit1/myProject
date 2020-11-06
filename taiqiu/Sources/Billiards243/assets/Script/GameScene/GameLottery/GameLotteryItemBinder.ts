import { FBinder } from "../../../Framework/Core/FBinder";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { PlayerVO } from "../../VO/PlayerVO";
import { C_Lobby_Lottery } from "../../Networks/Clients/Lottery/C_Lobby_Lottery";
import { RoomMatchVO } from "../../VO/RoomMatchVO";
import { getLang } from "../../../Framework/Utility/dx/getLang";
/**
*@description:游戏提示模块
**/
export class GameLotteryItemBinder extends FBinder 
{
	public static ClassName:string = "GameLotteryItemBinder";
	
	private isOpenLottery:boolean = false;
	private lotteryNode:cc.Node = null;
	private icon:cc.Sprite = null;
	private name:cc.Label = null;
	private num:cc.Label = null;
	private lotteryAnim:cc.Node = null;
	private lotteryIdx:number = 0;
	private clickConfirm:Function = null;

	protected initViews():void
	{
		super.initViews();
		
		this.lotteryNode = getNodeChildByName(this.asset,"info");
		this.icon = getNodeChildByName(this.lotteryNode,"icon",cc.Sprite);
		this.name = getNodeChildByName(this.lotteryNode,"name",cc.Label);
		this.num = getNodeChildByName(this.lotteryNode,"num",cc.Label);
		this.lotteryAnim = getNodeChildByName(this.asset,"lotteryAnim");
	}

	protected addEvents():void
	{
		super.addEvents();
		this.asset.off("click");
        this.asset.on("click", () => {
			this.onOpenLottery();
		}, this);
	}

    protected removeEvents()
    {
        this.asset.off("click");
        super.removeEvents();
	}

	setLotteryIndex(index:number, clickConfirm:Function)
	{
		this.lotteryIdx = index;
		if (clickConfirm)
            this.clickConfirm = clickConfirm;
	}

	setLotteryClick()
	{
		this.isOpenLottery = true;
	}
	
	public setLotteryItem(data)
	{
		this.lotteryNode.active = true;
		let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		ResourceManager.LoadSpriteFrame(`Game/GameLottery/GameLottery?:img_Ka0${data.grade}`,this.asset.getComponent(cc.Sprite));
		ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${data.id}`,this.icon);
		this.num.string = "X" + data.num;
		let itemInfo = player.getItemInfo(data.id);
		this.name.string = getLang(itemInfo.code);
	}

	public setLotteryAward(data)
	{
		this.lotteryNode.active = true;
		let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		ResourceManager.LoadSpriteFrame(`Game/GameLottery/GameLottery?:img_Ka0${data.grade}`,this.asset.getComponent(cc.Sprite));
		ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${data.id}`,this.icon);
		let itemInfo = player.getItemInfo(data.id);
		this.num.string = "";
		let name = getLang(itemInfo.code);
		this.name.string = name + "X" + data.num;
	}

	private onOpenLottery()
	{
		if(this.isOpenLottery) return;
		if (this.clickConfirm)
            this.clickConfirm();
		this.isOpenLottery = true;
		let roomMatch:RoomMatchVO = GameDataManager.GetDictData(GameDataKey.RoomMatch,RoomMatchVO);
		let roomInfo= roomMatch.getRoomInfo();
		C_Lobby_Lottery.Send(roomInfo.id);
		let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		player.lotteryIndex = this.lotteryIdx;
		this.lotteryAnim.active = true;
	}


}