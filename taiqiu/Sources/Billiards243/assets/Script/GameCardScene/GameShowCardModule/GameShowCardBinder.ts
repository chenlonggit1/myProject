import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { TableVO } from "../../VO/TableVO";
import { RoomVO } from "../../VO/RoomVO";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { SimpleCardVO } from "../../VO/SimpleCardVO";
import { StoreManager } from "../../../Framework/Managers/StoreManager";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { JTimer } from "../../../Framework/Timers/JTimer";
import { Fun } from "../../../Framework/Utility/dx/Fun";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { PointUtility } from "../../../Framework/Utility/PointUtility";

/**
*@description:显示抽中的牌的模块
**/
export class GameShowCardBinder extends FBinder 
{
	public static ClassName:string = "GameShowCardBinder";

	protected table:TableVO = null;
	protected room:RoomVO = null;
	protected player:PlayerVO = null;
	protected cardItems:cc.Node[] = [];

	protected backCards:cc.Node[] = [];
	protected initViews():void
	{
		super.initViews();
		this.table = GameDataManager.GetDictData(GameDataKey.Table,TableVO);
		this.player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		this.room = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
		let cardNode:cc.Node = getNodeChildByName(this.asset,"Cards");
		let backCardNode:cc.Node = getNodeChildByName(this.asset,"BackCards");
		let cards = null;
		for (let i = 0; i < this.room.players.length; i++) 
		{
			if(this.player.id==this.room.players[i].id)
			{
				cards = this.room.players[i].cards;
				break;
			}
		}
		let len = cards.length;
		let itemWidth = 103*1.5;
		let width = len*itemWidth;
		let gap = (cardNode.width-width)/(len+1);
		let startX = (itemWidth-cardNode.width)*0.5+gap;



		
		for (let i = 0; i < len; i++) 
		{
			let item:cc.Node = StoreManager.NewPrefabNode("GameCardScene/ShowCardItem");
			let card = cards[i];
			this.cardItems.push(item);
			item.setScale(1.5);
			let cardImg = getNodeChildByName(item,"Card",cc.Sprite);
			let ball = getNodeChildByName(item,"Ball",cc.Sprite);
			// console.log(i,"---显示牌--->",card.toString());
			ResourceManager.LoadSpriteFrame("GameCardScene/GameCardScene?:"+card.toString(),cardImg);
			ResourceManager.LoadSpriteFrame("Game/EightBall/EightBall?:ball_"+card.value,ball);
			cardNode.addChild(item);
			item.x = startX+(itemWidth+gap)*i;
		}
		JTimer.TimeOut(this,3000,Fun(()=>
		{
			dispatchModuleEvent(ModuleEvent.DISPOSE_MODULE,ModuleNames.Game_ShowCard);
		},this));

		for (let k = 0; k < backCardNode.childrenCount; k++) 
			this.backCards[k] = backCardNode.children[k];
		this.layoutCards();
	}

	protected layoutCards()
	{
		let mid = Math.floor(this.backCards.length/2);
		

		for (let i = 0; i < this.backCards.length; i++) 
		{
			let rot = (i-mid)*12;
			let pos = PointUtility.LengthenPoint(cc.v2(0,0),rot-90,120);
			this.backCards[i].angle = -rot;
			this.backCards[i].x = pos.x;
			this.backCards[i].y = pos.y;
		}
	}

	public dispose()
	{
		JTimer.ClearTimeOut(this);
		while(this.cardItems.length>0)
			StoreManager.StoreNode(this.cardItems.shift());
		super.dispose();
	}
}