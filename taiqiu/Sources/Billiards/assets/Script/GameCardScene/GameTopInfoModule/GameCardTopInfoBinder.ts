import { FBinder } from "../../../Framework/Core/FBinder";
import { PlayerVO } from "../../VO/PlayerVO";
import { TableVO } from "../../VO/TableVO";
import { RoomVO } from "../../VO/RoomVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { GamePlayerInfoBinder } from "../../GameScene/GameTopInfoModule/GamePlayerInfoBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { StoreManager } from "../../../Framework/Managers/StoreManager";
import { RoomMatchVO } from "../../VO/RoomMatchVO";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { C_Game_ReqDouble } from "../../Networks/Clients/C_Game_ReqDouble";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { GameEvent } from "../../GameEvent";
import { JTimer } from "../../../Framework/Timers/JTimer";

/**
*@description:GameTopInfoModule
**/
export class GameCardTopInfoBinder extends FBinder 
{
	public static ClassName:string = "GameTopInfoBinder";
	private players:GamePlayerInfoBinder[] = [];
	private player:PlayerVO = null;
	protected table:TableVO = null;
	private room:RoomVO = null;
	private roomMatch:RoomMatchVO = null;
	private lbScore:cc.Label = null;
	private imgScore:cc.Sprite = null;
	
	private cardNode:cc.Node = null;
	private cardItems:cc.Node[] = [];
	private itemWidth = 103*0.7;
	private startX = null;
	private gap = null;
	private chatNodeArr :cc.Node [] = [];// 聊天框节点
	private chatLabelArr :cc.Label [] = [];// 聊天框文本
	private expressNodeArr :cc.Sprite [] = [];// 表情



	protected initViews():void
	{
		super.initViews();



		this.room = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
		this.roomMatch = GameDataManager.GetDictData(GameDataKey.RoomMatch,RoomMatchVO);
		this.player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		this.table = GameDataManager.GetDictData(GameDataKey.Table,TableVO);
		let content = getNodeChildByName(this.asset,"Content");
		let playerNode:cc.Node = getNodeChildByName(content,"Players");

		for(let i=1;i<=3;i++){
			let node = getNodeChildByName(content,"chat"+i);
			let label = getNodeChildByName(node,"text",cc.Label);
			let exp = getNodeChildByName(content,"exp"+i,cc.Sprite);
			this.chatNodeArr.push(node)
			this.chatLabelArr.push(label)
			this.expressNodeArr.push(exp)
		}


		let chatIcon = getNodeChildByName(content,"btn_LiaoTian");
		chatIcon.on(cc.Node.EventType.TOUCH_END, ()=>{
			// dispatchFEventWith(LobbyEvent.Open_CueInfo);
			dispatchFEventWith( GameEvent.onShowChatWindow);
		}, this);

		
		for (let i = 0; i < playerNode.childrenCount; i++) 
		{
			this.players[i] = this.addObject(new GamePlayerInfoBinder());
			this.players[i].playerIndex = i;
			this.players[i].bindView(playerNode.children[i]);
		}
		this.cardNode = getNodeChildByName(content,"Cards");
		let doubleBtn = getNodeChildByName(content, "Infos/btn_double");
		this.lbScore = getNodeChildByName(content, "Infos/lb_score",cc.Label);
		this.imgScore = getNodeChildByName(content, "Infos/img_JinBi",cc.Sprite)
		doubleBtn.on(cc.Node.EventType.TOUCH_END, () => {
			C_Game_ReqDouble.Send();
		}, this);
		let btnSet = getNodeChildByName(content, "btn_SheZhi");
		btnSet.on(cc.Node.EventType.TOUCH_END, ()=>{
			dispatchFEventWith(LobbyEvent.Open_LobbySet);
		}, this);
		let btnCue = getNodeChildByName(content, "btn_QiuGan");
		btnCue.on(cc.Node.EventType.TOUCH_END, ()=>{
			dispatchFEventWith(LobbyEvent.Open_CueInfo);
		}, this);
		this.room.roomScore = this.roomMatch.getRoomScore();
		this.updatePlayers();
		this.updateMultiple();
	}
	protected addEvents() {
		super.addEvents();
		addEvent(this,GameEvent.Update_Game_Multiple,this.updateMultiple);
        addEvent(this, GameEvent.onGetPlayerChat, this.onGetPlayerChat);

	}

	public newRound()
	{
		this.room.roomScore = this.roomMatch.getRoomScore();
		this.updatePlayers();
		this.updateMultiple();
	}
	//更新玩家信息
	public updatePlayers():void
	{
		// this.playerInfo.update(this.player);
		this.updateCards();
		for (let i = 0; i < this.room.players.length; i++) 
		{
			if(i<this.players.length)
			{
				this.players[i].update(this.room.players[i]);
				let ballNum:cc.Node = getNodeChildByName(this.players[i].asset,"ballNum");
				if(ballNum!=null)ballNum.getComponent(cc.Label).string = "X"+this.room.players[i].cards.length;
			}
		}
	}
	public updateCountDown(clear:boolean=false)
	{
		let roomInfo = this.roomMatch.getRoomInfo();
		let time = clear?0:this.room.endTime*1000;
		for (let i = 0; i < this.players.length; i++) 
		{
			if(this.room.players.length<=i)continue;
			let countDown = this.room.optPlayer==this.room.players[i].id?time:0;
			this.players[i].updateCountDown(countDown,roomInfo.rod*1000);
		}
	}
	protected updateCards()
	{
		let cards = null;
		for (let m = 0; m < this.room.players.length; m++) 
		{
			if(this.room.players[m].id==this.player.id)
			{
				cards = this.room.players[m].cards;
				break;
			}
		}
		if(!cards)return;
		let len = cards.length;
		if(this.startX==null)
		{
			let width = len*this.itemWidth;
			this.gap = (this.cardNode.width-width)/(len+1);
			this.startX = (this.itemWidth-this.cardNode.width)*0.5+this.gap;
		}
		while(this.cardItems.length>len)
		{
			let item = this.cardItems.shift();
			StoreManager.StoreNode(item);
		}
		while(this.cardItems.length<len)
		{
			let item:cc.Node = StoreManager.NewPrefabNode("GameCardScene/InfoCardItem");
			this.cardItems.push(item);
			this.cardNode.addChild(item);
		}
		for (let i = 0; i < len; i++) 
		{
			let card = cards[i];
			let item = this.cardItems[i];
			item.setScale(0.7);
			let cardImg = getNodeChildByName(item,"Card",cc.Sprite);
			let ball = getNodeChildByName(item,"Ball",cc.Sprite);
			ResourceManager.LoadSpriteFrame("GameCardScene/GameCardScene?:"+card.toString(),cardImg);
			ResourceManager.LoadSpriteFrame("Game/EightBall/EightBall?:ball_"+card.value,ball);
			item.x = this.startX+(this.itemWidth+this.gap)*i;
		}
	}
	//更新倍数
	public updateMultiple()
	{
		this.lbScore.string = (this.room.doubleNum * this.room.roomScore).toString();
		ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${this.room.moneyId}`,this.imgScore);
	}

	private onGetPlayerChat(data:any){
		let playerIndex = 0;

        let chat = data.data;

		let player = this.room.players;
		for(let i =0;i<player.length;i++){
			if(player[i].id == chat.id){
				playerIndex = i;
				break;
			}
		}

		let usePlayer = this.chatNodeArr[playerIndex];
        let usePlayerLabel = this.chatLabelArr[playerIndex];
		let express = this.expressNodeArr[playerIndex];
		let timerCount = 3;
		let chatType = 1;// 文字或者表情，虽然都可以隐藏，只是会在同时发表情和文字时，最先显示那个也会隐藏最后那个
		
		
		if(chat.emoji.indexOf('exp') != -1){
            // 表情
            ResourceManager.LoadSpriteFrame(`Game/TopInfo/eightBall_TopInfo?:${chat.emoji}`, express);
            express.node.active = true;
            chatType = 1;

        }else{
            usePlayerLabel.string = chat.emoji;
            usePlayer.active = true;
            chatType = 2;
        }

        let onTimeTick = function(){
            timerCount-=1;
            if(timerCount == 0){
                if(chatType == 1){
                    express.node.active = false;
                }else{
                    usePlayer.active = false;
                }
                timer.reset();
            }
        }

        let timer = this.addObject(JTimer.GetTimer(1000));
        timer.addTimerCallback(this, onTimeTick);
        timer.start();

        
	}
}