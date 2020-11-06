import { FBinder } from "../../../Framework/Core/FBinder";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { GameEvent } from "../../GameEvent";
import { RoomVO } from "../../VO/RoomVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { SimpleRoomVO } from "../../VO/SimpleRoomVO";
import { PlayerVO } from "../../VO/PlayerVO";
import { showPopup } from "../../Common/showPopup";
import { PopupType } from "../../PopupType";
import { trace } from "../../../Framework/Utility/dx/trace";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { RoomMatchVO } from "../../VO/RoomMatchVO";
import { RelifVO } from "../../VO/RelifVO";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { GoodsType } from "../PayModeModule/PayDefine";
import { getLang } from "../../../Framework/Utility/dx/getLang";
import { C_Lobby_Config } from "../../Networks/Clients/C_Lobby_Config";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";

/**
*@description:大厅房间模块
**/
export class LobbyRoomBinder extends FBinder {
	public static ClassName: string = "LobbyRoomBinder";

	private roomMatch:RoomMatchVO = null;
	private btnBack:cc.Node = null;

	//房间场次 娱乐场、钻石场
	private roomNode: cc.Node = null;
	private roomNodeArray: cc.Node[] = [];

	//游戏玩法 经典玩法、九球玩法
	private gamePlayNode: cc.Node = null;
	private gamePlayContent: cc.Node = null;
	private gamePlayNodeArray: cc.Node[] = [];

	//选择房间门槛 初级场、中级场、高级场
	private selectRoomNode: cc.Node = null;
	private selectRoomArray: cc.Node[] = [];
	private selectRoomScore: cc.Label[] = [];
	private imgSelectRoom: cc.Sprite[] = [];
	private selectRoomCondition: cc.Label[] = [];
	private giftText:cc.Label[] = [];
	private roomBg:cc.Node[] = [];
	private curRoomIndex: number = 1;
	private getGift:number = 3;
	/**moneyId 1:金币场    2：钻石场 */
	private moneyId = -1;
	/**gameId 玩法id  1:经典九球    2：红球玩法     3：抽牌玩法 */
	private gameId = -1;
	/**changId 场次id 1：初级场   2：中级场   3：高级场 */
	private changId = -1;

	protected initViews(): void {
		super.initViews();

		this.roomMatch = GameDataManager.GetDictData(GameDataKey.RoomMatch,RoomMatchVO);

		this.btnBack = getNodeChildByName(this.asset, "btn_back");
		this.btnBack.active = false;
		this.btnBack.on(cc.Node.EventType.TOUCH_START, () => {
			this.onBackClick();
		}, this);

		this.roomNode = getNodeChildByName(this.asset, "roomNode");
		for (let i = 1; i <= this.roomNode.childrenCount; i++) 
		{
			this.roomNodeArray[i] = getNodeChildByName(this.roomNode, "room" + i);
			this.roomNodeArray[i].on(cc.Node.EventType.TOUCH_END, this.onGamePlayBtnClick, this);
		}

		this.gamePlayNode = getNodeChildByName(this.asset, "roomScrollView");
		this.gamePlayContent = getNodeChildByName(this.gamePlayNode, "view/gamePlayNode");
		for (let i = 0; i < this.gamePlayContent.childrenCount; i++) 
		{
			this.gamePlayNodeArray[i] = getNodeChildByName(this.gamePlayContent, "gameplay" + (i+1));
			this.gamePlayNodeArray[i].on(cc.Node.EventType.TOUCH_END, this.selectedGamePlay, this);
		}

		for(let i = 0; i < 2; i++) {
			this.roomBg[i] = getNodeChildByName(this.asset,"lobbyBg"+i);
		}

		this.selectRoomNode = getNodeChildByName(this.asset, "selectRoomNode");
		this.selectRoomArray = this.selectRoomNode.children;
		for (let i = 0; i < this.selectRoomArray.length; i++) {
			this.selectRoomArray[i].on('click', this.gameStart, this);
			this.selectRoomScore[i] = getNodeChildByName(this.selectRoomArray[i], "score", cc.Label);
			this.selectRoomCondition[i] = getNodeChildByName(this.selectRoomArray[i], "condition", cc.Label);
			this.giftText[i] = getNodeChildByName(this.selectRoomArray[i], "giftText", cc.Label);
			this.imgSelectRoom[i] = getNodeChildByName(this.selectRoomArray[i], "img_JinBi", cc.Sprite);
		}
	}

	protected addEvents(){
		super.addEvents();
		addEvent(this, LobbyEvent.Set_LobbyRoomMatch, this.getGameType);
	}

	//返回
	protected onBackClick()
	{
		if (this.curRoomIndex > 1) {
			this.curRoomIndex--;
			if (this.curRoomIndex == 1) {
				this.btnBack.active = false;
				this.roomNode.active = true;
				this.gamePlayNode.active = false;
			} else {
				this.gamePlayNode.active = true;
				this.selectRoomNode.active = false;
				let gameplayList = new Set();
				for(let i = 0; i < this.roomMatch.rooms.length; i++) {
					if(this.moneyId == this.roomMatch.rooms[i].moneyType) {
						gameplayList.add(this.roomMatch.rooms[i].playType);
					}
				}
				for(let i = 0; i < 2; i++) {
					this.roomBg[i].active = gameplayList.size > 2;
				}
			}
		}
	}

	/**选择娱乐场、钻石场 */
	protected onGamePlayBtnClick(evt: cc.Event.EventTouch) {
		let node:cc.Node = evt.target
		let btn = node.getComponent(cc.Button);
		if(!btn.interactable) {
			showPopup(PopupType.TOAST, {msg: getLang("txt_channelClose")});
			return;
		}
		
		this.btnBack.active = true;
		this.roomNode.active = false;
		this.gamePlayNode.active = true;
		this.moneyId = parseInt(evt.target.name.replace("room",""));
		this.curRoomIndex++;
		this.getGamePlay();
	}

	/**选择游戏玩法 */
	protected selectedGamePlay(evt) {
		this.gamePlayNode.active = false;
		this.selectRoomNode.active = true;
		this.gameId = parseInt(evt.target.name.replace("gameplay",""));
		this.curRoomIndex++;
		this.getGameStar();
		this.setCondition();
		for(let i = 0; i < 2; i++) {
			this.roomBg[i].active = false;
		}
	}

	//**开始游戏 */
	protected gameStart(btn) 
	{
		// NOW:先进匹配视图再请求匹配
		// 获取场次
		this.changId = parseInt(btn.name.replace("selectRoom",""));
		// 获取房间配置
		let roomCfg: SimpleRoomVO = null;
		for(let i = 0; i < this.roomMatch.rooms.length; i++) 
		{
			if(this.moneyId == this.roomMatch.rooms[i].moneyType && 
			   this.gameId == this.roomMatch.rooms[i].playType &&
			   this.changId == this.roomMatch.rooms[i].star) 
			{
				roomCfg = this.roomMatch.rooms[i];
			}
		}
		// 过滤
		if (!roomCfg) 
		{
			trace("[LobbyRoomBinder.gameStart]:获取房间配置失败")
			return;
		}
		// 判断是否准入
		let player: PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		let canEnter = () => {
			let m = this.moneyId == 1 ? player.gold : player.diamond;
			if (roomCfg.lowerLimit <= m && (roomCfg.upperLimit == -1 || m <= roomCfg.upperLimit))
				return true;
			else {
				if(roomCfg.lowerLimit > m) {
					let relife: RelifVO = GameDataManager.GetDictData(GameDataKey.RelifeGift, RelifVO);
					relife.setData(roomCfg.moneyType, roomCfg.playType, roomCfg.fee);
					let name = this.moneyId == 1 ? getLang("Text_msg3") : getLang("Text_msg1");
					showPopup(PopupType.TOAST, {msg:name});
					// dispatchFEventWith(LobbyEvent.Open_reLife);
				} 
				else if(m > roomCfg.upperLimit){
					let name = this.moneyId == 1 ? getLang("Text_msg4") : getLang("Text_msg2");
					showPopup(PopupType.TOAST, {msg:name});
				} 
				
				return false;
			}
		}
		// 条件不满足，提示
		if (canEnter()) 
			dispatchFEventWith(LobbyEvent.On_Selected_Room,{gameId:this.gameId,changId:this.changId,moneyId:this.moneyId});
	}

	//获取游戏类型
	public getGameType() {
		let gameTypeList = new Set();
		for(let i = 0; i < this.roomMatch.rooms.length; i++) {
			gameTypeList.add(this.roomMatch.rooms[i].moneyType);
		}
		for (let i = 1; i <= this.roomNode.childrenCount; i++) {
			let isHasGameType = gameTypeList.has(i);
			this.roomNodeArray[i].active = isHasGameType;
			let isOpen = false;
			if(isHasGameType) {
				for(let j = 0; j < this.roomMatch.rooms.length; j++) {
					if(this.roomMatch.rooms[j].moneyType == i 
						&& this.roomMatch.rooms[j].openFlag == 1) {
						isOpen = true;
						break;
					}
				}
				// if(!isOpen) this.roomNodeArray[i].active = false;
				this.btnLock(isOpen, i);
			}
		}
	}

	//获取游戏玩法
	protected getGamePlay() {
		let gameplayList = new Set();
		for(let i = 0; i < this.roomMatch.rooms.length; i++) {
			if(this.moneyId == this.roomMatch.rooms[i].moneyType) {
				gameplayList.add(this.roomMatch.rooms[i].playType);
			}
		}
		for (let i = 0; i < this.gamePlayContent.childrenCount; i++) {
			let isHasGameType = gameplayList.has(i+1);
			this.gamePlayNodeArray[i].active = isHasGameType;
			let isOpen = false;
			if(isHasGameType) {
				for(let j = 0; j < this.roomMatch.rooms.length; j++) {
					if(this.roomMatch.rooms[j].moneyType == this.moneyId 
						&& i+1 == this.roomMatch.rooms[j].playType && this.roomMatch.rooms[j].openFlag == 1) {
						isOpen = true;
						break;
					}
				}
				if(!isOpen) this.gamePlayNodeArray[i].active = false;
			}
		}

		this.gamePlayContent.x = 0;
		this.gamePlayNode.getComponent(cc.ScrollView).enabled = gameplayList.size > 2;
		this.gamePlayNode.x = gameplayList.size > 2 ? -250 : -125;
		for(let i = 0; i < 2; i++) {
			this.roomBg[i].active = gameplayList.size > 2;
		}
	}

	//获取游戏场次
	protected getGameStar() {
		let gameStarList = new Set();
		for(let i = 0; i < this.roomMatch.rooms.length; i++) {
			if(this.moneyId == this.roomMatch.rooms[i].moneyType && this.gameId == this.roomMatch.rooms[i].playType) {
				gameStarList.add(this.roomMatch.rooms[i].star);
			}
		}
		for (let i = 0; i < this.selectRoomNode.childrenCount; i++) {
			let isHasGameType = gameStarList.has(i+1);
			this.selectRoomArray[i].active = isHasGameType;
			let isOpen = false;
			if(isHasGameType) {
				for(let j = 0; j < this.roomMatch.rooms.length; j++) {
					if(this.roomMatch.rooms[j].moneyType == this.moneyId && this.gameId == this.roomMatch.rooms[j].playType 
						&& i+1 == this.roomMatch.rooms[j].star && this.roomMatch.rooms[j].openFlag == 1) {
						isOpen = true;
						break;
					}
				}
				if(!isOpen) this.selectRoomArray[i].active = false;
			}
		}
	}

	//设置入场条件和底分
	protected setCondition() {
		let selectList = [];
		for(let i = 0; i < this.roomMatch.rooms.length; i++) 
		{
			if(this.moneyId == this.roomMatch.rooms[i].moneyType && this.gameId == this.roomMatch.rooms[i].playType) {
				selectList.push(this.roomMatch.rooms[i]);
			}
		}
		let name = ["btn_ChuJiChang","btn_ZhongJiChang","btn_GaoJiChang"];
		for(let i = 0; i < this.selectRoomArray.length; i++){
			this.selectRoomArray[i].active = false;
		}
		for (let i = 0; i < selectList.length; i++) 
		{
			ResourceManager.LoadSpriteFrame(`Lobby/LobbyRoom/LobbyRoom?:${name[i]}${selectList[i].moneyType}`,this.selectRoomArray[i].getComponent(cc.Sprite));
			
			let idx = selectList[i].star - 1;
			this.selectRoomArray[idx].active = true;
			this.selectRoomScore[idx].string = selectList[i].bet;
			let down = selectList[i].lowerLimit;
			let up = selectList[i].upperLimit;
			this.selectRoomCondition[idx].string = up == -1 ? `>${down}` : `${down}-${up}`;
			this.giftText[idx].string = `${selectList[i].gameNum}/${this.getGift}`;
			ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${selectList[i].moneyType}`,this.imgSelectRoom[i]);
		}
	}
	
	public dispose() {
		for (let i = 1; i <= this.roomNode.childrenCount; i++) 
		{
			this.roomNodeArray[i].off(cc.Node.EventType.TOUCH_END, this.onGamePlayBtnClick, this);
		}
		for (let i = 0; i < this.gamePlayContent.childrenCount; i++) 
		{
			this.gamePlayNodeArray[i].off(cc.Node.EventType.TOUCH_END, this.selectedGamePlay, this);
		}
		for (let i = 0; i < this.selectRoomArray.length; i++) {
			this.selectRoomArray[i].off('click', this.gameStart, this);
		}
		super.dispose();
	}

	private btnLock(isOpen:boolean, index:number) {
		let btn = this.roomNodeArray[index].getComponent(cc.Button);
		let lock = btn.node.children[0];
		let lockBtn = lock.getComponent(cc.Button);
		if(!isOpen) {
			btn.interactable = false;
			lockBtn.interactable = false;
			lock.active = true;
			
		} else {

			btn.interactable = true;
			lockBtn.interactable = true;;
			lock.active = false;
		}
	}
}