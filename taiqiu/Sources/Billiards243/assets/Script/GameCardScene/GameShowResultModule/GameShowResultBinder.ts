import { FBinder } from "../../../Framework/Core/FBinder";
import { TableVO } from "../../VO/TableVO";
import { RoomVO } from "../../VO/RoomVO";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { SimplePlayerVO } from "../../VO/SimplePlayerVO";
import { StringUtility } from "../../../Framework/Utility/StringUtility";
import { StoreManager } from "../../../Framework/Managers/StoreManager";
import { SimpleCardVO } from "../../VO/SimpleCardVO";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { CButton } from "../../../Framework/Components/CButton";
import { Fun } from "../../../Framework/Utility/dx/Fun";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { GameLayer } from "../../../Framework/Enums/GameLayer";
import { S2C_GameSettle } from "../../Networks/Protobuf/billiard_pb";

/**
*@description:GameShowResultModule
**/
export class GameShowResultBinder extends FBinder 
{
	public static ClassName:string = "GameShowResultBinder";
	protected table:TableVO = null;
	protected room:RoomVO = null;
	protected player:PlayerVO = null;
	protected playerItems:cc.Node[] = [];
	protected initViews():void
	{
		super.initViews();
		this.table = GameDataManager.GetDictData(GameDataKey.Table,TableVO);
		this.room = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
		this.player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		let nextBtn:CButton = getNodeChildByName(this.asset,"NextBtn",CButton);
		nextBtn.click = Fun(this.showGameSettle,this);
		let n:cc.Node = getNodeChildByName(this.asset,"Players");
		for (let i = 0; i < n.childrenCount; i++) 
			this.playerItems[i] = n.children[i];
	}

	public update(settleInfo:S2C_GameSettle)
	{
		let players = [];
		let winPlayers = {};
		for (let i = 0; i < settleInfo.winner.length; i++) 
		{
			winPlayers[settleInfo.winner[i].id] = true;
			if(settleInfo.winner[i].id==this.player.id)players.unshift(settleInfo.winner[i]);
			else players.push(settleInfo.winner[i]);
		}
		for (let j = 0; j < settleInfo.losers.length; j++) 
		{
			if(settleInfo.losers[j].id==this.player.id)players.unshift(settleInfo.losers[j]);
			else players.push(settleInfo.losers[j]);
		}
		for (let k = 0; k < players.length; k++) 
			this.updatePlayer(players[k],this.playerItems[k],winPlayers[players[k].id]);
	}

	protected updatePlayer(p:any,n:cc.Node,isWin:boolean)
	{
		let winNode:cc.Node = getNodeChildByName(n,"Win");
		let nickName:cc.Label = getNodeChildByName(n,"Player/NickName",cc.Label);
		let headImg:cc.Sprite = getNodeChildByName(n,"Player/headBg/mask/imgHead",cc.Sprite);
		let huangGuan:cc.Node = getNodeChildByName(n,"Player/HuangGuan");
		let cardNode:cc.Node = getNodeChildByName(n,"Cards");
		let cards = p.cards;
		let needCards = p.needCards;

		console.log("==结算牌========>>>",cards,needCards);
		
		while(cardNode.childrenCount>cards.length)
		{
			let child = cardNode.children[0];
			child.removeFromParent();
		}
		while(cardNode.childrenCount<cards.length)
		{
			let sp:cc.Sprite = StoreManager.NewNode(cc.Sprite);
			cardNode.addChild(sp.node);
		}
		let len = cards.length;
		let itemWidth = 103*1.3;
		let width = len*itemWidth;
		let gap = (cardNode.width-width)/(len+1);
		let startX = (itemWidth-cardNode.width)*0.5+gap;
		let card:SimpleCardVO = new SimpleCardVO();
		for (let i = 0; i < len; i++) 
		{
			let item:cc.Node = cardNode.children[i];
			item.setScale(1.3);
			let sp:cc.Sprite = item.getComponent(cc.Sprite);
			item.x = startX+(itemWidth+gap)*i;
			card.parse(cards[i]);
			ResourceManager.LoadSpriteFrame("GameCardScene/GameCardScene?:"+card.toString(),sp);
			let ballSp:cc.Sprite = StoreManager.NewNode(cc.Sprite);
			item.addChild(ballSp.node);
			ResourceManager.LoadSpriteFrame("Game/EightBall/EightBall?:ball_"+card.value,ballSp);
			ballSp.node.setScale(1.3);
			ballSp.node.y = -20;
			//外框
			if(needCards.indexOf(cards[i]) < 0){
				let kuangSp:cc.Sprite = StoreManager.NewNode(cc.Sprite);
				item.addChild(kuangSp.node);
				ResourceManager.LoadSpriteFrame("GameCardScene/GameCardScene?:kuang",kuangSp);
				kuangSp.node.setPosition(cc.v2(-2,1.8));
				kuangSp.node.setContentSize(105,139);
			}else{
				item.color = cc.color(153,153,153,255);
				ballSp.node.color = cc.color(153,153,153,255);
			}
		}
		
		winNode.active = isWin;
		huangGuan.active = isWin;
		if(p!=null)nickName.string= StringUtility.Cut(p.nick, 12);
		else nickName.string= "";
		if(p.head != null) 
		{
			cc.assetManager.loadRemote(p.head, {ext: '.jpg'}, function(err, texture:cc.Texture2D) {
				if(err) return;
				headImg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
			})
		}
	}

	private showGameSettle()
	{
		dispatchModuleEvent(ModuleEvent.DISPOSE_MODULE,ModuleNames.Game_ShowResult);
		dispatchModuleEvent(ModuleEvent.SHOW_MODULE,ModuleNames.Game_Settle,null,GameLayer.UI);
	}
}