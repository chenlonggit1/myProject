import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { RoomVO } from "../../VO/RoomVO";
import { GamePlayerInfoBinder } from "./GamePlayerInfoBinder";
import { PlayerVO } from "../../VO/PlayerVO";
import { PlayGameID } from "../../Common/PlayGameID";
import { C_Game_ReqDouble } from "../../Networks/Clients/C_Game_ReqDouble";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { GameEvent } from "../../GameEvent";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { RoomMatchVO } from "../../VO/RoomMatchVO";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { JTimer } from "../../../Framework/Timers/JTimer";

/**
*@description:游戏顶部模块
**/
export class GameTopInfoBinder extends FBinder {
	public static ClassName: string = "GameTopInfoBinder";
	private players: GamePlayerInfoBinder[] = [];
	private player: PlayerVO = null;
	private room: RoomVO = null;
	private roomMatch: RoomMatchVO = null;
	private lbScore: cc.Label = null;
	private imgScore: cc.Sprite = null;

	private myChat: cc.Node = null;// 我的聊天框
	private myChatLabel: cc.Label = null;// 我的聊天框
	private otherChat: cc.Node = null;// 其他人的聊天框
	private otherChatLabel: cc.Label = null;// 其他人的聊天框
	private otherExp: cc.Sprite = null; // 其他玩家的表情
	private myExp: cc.Sprite = null; // 我的表情

	protected initViews(): void {
		super.initViews();
		this.room = GameDataManager.GetDictData(GameDataKey.Room, RoomVO);
		this.roomMatch = GameDataManager.GetDictData(GameDataKey.RoomMatch, RoomMatchVO);
		this.player = GameDataManager.GetDictData(GameDataKey.Player, PlayerVO);
		let content = getNodeChildByName(this.asset, "Content");
		let playerNode: cc.Node = getNodeChildByName(content, "Players");


		for (let i = 0; i < playerNode.childrenCount; i++) {
			this.players[i] = this.addObject(new GamePlayerInfoBinder());
			this.players[i].playerIndex = i;
			this.players[i].bindView(playerNode.children[i]);
		}
		if (this.room.gameId == PlayGameID.RedBall)// 红球玩法
			this.setStrikeBalls();
		let doubleBtn = getNodeChildByName(content, "Infos/btn_double");
		this.lbScore = getNodeChildByName(content, "Infos/lb_score", cc.Label);
		this.imgScore = getNodeChildByName(content, "Infos/img_JinBi", cc.Sprite)


		this.myChat = getNodeChildByName(content, 'myChat');
		this.myChatLabel = getNodeChildByName(this.myChat, 'text', cc.Label);

		this.otherChat = getNodeChildByName(content, 'otherChat')
		this.otherChatLabel = getNodeChildByName(this.otherChat, 'text', cc.Label)

		this.otherExp = getNodeChildByName(content, 'other_exp', cc.Sprite) // 
		this.myExp = getNodeChildByName(content, 'my_exp', cc.Sprite)





		doubleBtn.on(cc.Node.EventType.TOUCH_END, () => {
			C_Game_ReqDouble.Send();
		}, this);
		let btnSet = getNodeChildByName(content, "btn_SheZhi");
		btnSet.on(cc.Node.EventType.TOUCH_END, () => {
			dispatchFEventWith(LobbyEvent.Open_LobbySet);
		}, this);
		let btnCue = getNodeChildByName(content, "btn_QiuGan");
		btnCue.on(cc.Node.EventType.TOUCH_END, () => {
			dispatchFEventWith(LobbyEvent.Open_CueInfo);
		}, this);

		let chatIcon = getNodeChildByName(content, "btn_LiaoTian");
		chatIcon.on(cc.Node.EventType.TOUCH_END, () => {
			// dispatchFEventWith(LobbyEvent.Open_CueInfo);
			dispatchFEventWith(GameEvent.onShowChatWindow);
		}, this);


		this.room.roomScore = this.roomMatch.getRoomScore();
		this.updatePlayers();
		this.updateMultiple();
	}

	protected addEvents() {
		super.addEvents();
		addEvent(this, GameEvent.Update_Game_Multiple, this.updateMultiple);
		addEvent(this, GameEvent.onGetPlayerChat, this.onGetPlayerChat);

	}

	public newRound() {
		this.room.roomScore = this.roomMatch.getRoomScore();
		if (this.room.gameId == PlayGameID.RedBall)// 红球玩法
			this.setStrikeBalls();
		this.updatePlayers();
		this.updateMultiple();
	}

	//设置红球玩法击打球
	private setStrikeBalls()
	{
		let ballIDs = [16, 16, 16, 16, 16, 16, 16];
		for (let i = 0; i < this.room.players.length; i++) {
			if (this.room.players[i].strikeBalls.length == 0)
				this.room.players[i].strikeBalls = ballIDs.concat();
		}
	}

	//更新玩家信息
	public updatePlayers(): void {
		for (let i = 0; i < this.room.players.length; i++) {
			if (i < this.players.length)
				this.players[i].update(this.room.players[i]);
		}
	}
	public updateCountDown(clear: boolean = false) {
		let roomInfo = this.roomMatch.getRoomInfo();
		let time = clear ? 0 : this.room.endTime * 1000;
		for (let i = 0; i < this.players.length; i++) {
			if (this.room.players.length <= i) continue;
			let countDown = this.room.optPlayer == this.room.players[i].id ? time : 0;
			this.players[i].updateCountDown(countDown, roomInfo.rod * 1000);
		}
	}

	//更新倍数
	public updateMultiple() {
		this.lbScore.string = (this.room.doubleNum * this.room.roomScore).toString();
		ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${this.room.moneyId}`, this.imgScore);
	}

	public onGetPlayerChat(data: any) {
		cc.log(data.data);
		let chat = data.data;
		let usePlayer = null;
		let usePlayerLabel = null;
		let express = null;
		let timerCount = 3;
		let chatType = 1;// 文字或者表情，虽然都可以隐藏，只是会在同时发表情和文字时，最先显示那个也会隐藏最后那个
		if (chat.id == this.player.id) {
			usePlayer = this.myChat
			usePlayerLabel = this.myChatLabel;
			express = this.myExp;
		} else {
			usePlayer = this.otherChat
			usePlayerLabel = this.otherChatLabel;
			express = this.otherExp;

		}

		if (chat.emoji.indexOf('exp') != -1) {
			// 表情
			ResourceManager.LoadSpriteFrame(`Game/TopInfo/eightBall_TopInfo?:${chat.emoji}`, express);
			express.node.active = true;
			chatType = 1;

		} else {
			usePlayerLabel.string = chat.emoji;
			usePlayer.active = true;
			chatType = 2;
		}

		let onTimeTick = function () {
			timerCount -= 1;
			if (timerCount == 0) {
				if (chatType == 1) {
					express.node.active = false;
				} else {
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