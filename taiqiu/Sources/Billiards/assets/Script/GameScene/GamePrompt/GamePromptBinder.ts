import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { PlayerVO } from "../../VO/PlayerVO";
import { RoomVO } from "../../VO/RoomVO";
import { CLanguage } from "../../../Framework/Components/CLanguage";
import { JTimer } from "../../../Framework/Timers/JTimer";
import { Fun } from "../../../Framework/Utility/dx/Fun";
import { getLang } from "../../../Framework/Utility/dx/getLang";
import { PlayerCueVO } from "../../VO/PlayerCueVO";
import { SimplePlayerCueVO } from "../../VO/SimplePlayerCueVO";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { LobbyCueMaintainBinder } from "../../LobbyScene/LobbyCueModule/LobbyCueMaintainBinder";
import { Assets } from "../../../Framework/Core/Assets";
import { StoreManager } from "../../../Framework/Managers/StoreManager";
/**
*@description:游戏提示模块
**/
export class GamePromptBinder extends FBinder 
{
	public static ClassName:string = "GamePromptBinder";
	
	private lianganNode:cc.Node = null;
	private lianganNum:cc.Label = null;
	private downNode:cc.Node = null;
	private downText:cc.Label = null;
	private middleNode:cc.Node = null;
	private middleText:cc.Label = null;
	private imgTip:CLanguage = null;
	private imgMaintain:cc.Node = null;
	private cueMaintainTween:cc.Tween = null;

	private lobbyCueMaintain:LobbyCueMaintainBinder = null;
    private cueMaintainNode:cc.Node = null;


	private room:RoomVO = null;
	private player:PlayerVO = null;
	private isFoul:boolean = false;

	protected initViews():void
	{
		super.initViews();
		
		this.lianganNode = getNodeChildByName(this.asset, "liangan");
		this.lianganNum = getNodeChildByName(this.asset, "liangan/num",cc.Label);
		this.downNode = getNodeChildByName(this.asset, "downBg");
		this.downText = getNodeChildByName(this.asset, "downBg/downTip",cc.Label);
		this.middleNode = getNodeChildByName(this.asset, "middleBg");
		this.middleText = getNodeChildByName(this.asset, "middleBg/middleTip",cc.Label);
		this.imgTip = getNodeChildByName(this.asset,"imgTip",CLanguage);
		this.imgMaintain = getNodeChildByName(this.asset, "img_maintain");
		this.lianganNode.opacity = 0;
		this.downNode.opacity = 0;
		this.middleNode.opacity = 0;
		this.imgTip.node.opacity = 0;
		this.imgMaintain.opacity = 0;

		this.room = GameDataManager.GetDictData(GameDataKey.Room, RoomVO);
		this.player = GameDataManager.GetDictData(GameDataKey.Player, PlayerVO);
	}
	protected addEvents()
	{
		super.addEvents();
		addEvent(this,LobbyEvent.Server_UseCue,this.onUseCue);
		addEvent(this,LobbyEvent.Server_DefendCue,this.onUseCue);
		// 点击修复提示图 跳转维护界面
		this.imgMaintain.on(cc.Node.EventType.TOUCH_END, this.onClickimgMaintain, this);
	}

	//你将击打全色球(花色球)
	public onPlayBallTip(type:number)
	{
		if(type == 1) this.setImgTip("eightBall_Word_HitHalfBall");
        else this.setImgTip("eightBall_Word_HitFullBall");
	}

	//犯规提示
	public setIllegalityTip()
	{
		this.downTip(getLang("Text_guiz4"));
		this.isFoul = true;
	}

	public onUseCue()
	{
		let isMaintain = this.getCueMaintain();
		if(isMaintain) 
			this.playCueMaintainAnim();
		else
			this.stopCueMaintainAnim();
	}

	//开球、首杆进球、该你击球、连杆
	public setOptionTip(playerID:number)
	{
		let isMaintain = this.getCueMaintain();
		if(isMaintain) {
			if(this.player.id == playerID)
				this.playCueMaintainAnim();
			else
				this.stopCueMaintainAnim();
		}
		this.isFoul = false;
		let lastIllegalityNum = [];
		for(let i = 0; i < this.room.players.length; i++) {
			lastIllegalityNum.push(this.room.players[i].foul);
		}
		
		//用于判断犯规
		JTimer.TimeOut(this,100,Fun(()=>{
			if(this.room.gan == 0) {
				if(this.player.id == playerID)
					this.middleTip(getLang("Text_guiz5"));
				else
					this.middleTip(getLang("Text_guiz6"));
			}
			if(this.room.gan == 1 && this.room.cueNum == 1) {
				this.downTip(getLang("Text_guiz7"));
			}
			if(this.player.id == playerID) {
				if(this.room.lastPlayer != playerID && this.room.gan > 0)
					this.setImgTip("eightBall_Word_YourRound");
				if(this.room.cueNum > 1)
					this.setLiangan(this.room.cueNum);
			}
			if(this.room.gan > 0) {
				let temp = [];
				for(let i = 0; i < this.room.players.length; i++) {
					temp.push(this.room.players[i].foul);
				}
				if(this.room.lastPlayer != playerID){
					if(lastIllegalityNum.toString() == temp.toString() && !this.isFoul) {
						this.downTip(getLang("Text_guiz2"));
					} else {
						if(this.room.players[0].foul > 0 && this.player.id != playerID)
							this.middleTip(getLang("Text_guiz3",[this.room.players[0].foul]));
					}
				}
			}
		},this));
	}

	//设置提示
	public setImgTip(name:string)
	{
		this.imgTip.node.opacity = 255;
		this.imgTip.key = name;
		this.playAnim(this.imgTip.node);
	}

	//设置连杆
	public setLiangan(num:number)
	{
		this.lianganNode.opacity = 255;
		this.lianganNum.string = num.toString();
		this.playAnim(this.lianganNode);
	}

	//设置下方提示 首杆进球、常规击球、击球犯规
	public downTip(text:string)
	{
		this.downNode.opacity = 255;
		this.downText.string = text;
		this.playAnim(this.downNode);
	}

	//设置中间提示 开球、第几次犯规
	public middleTip(text:string)
	{
		this.middleNode.opacity = 255;
		this.middleText.string = text;
		this.playAnim(this.middleNode);
	}

	//提示动画
	private playAnim(node:cc.Node)
	{
		cc.tween(node)
			.delay(2)
			.to(0.3, {opacity:0}, {easing: "backOut"})
			.start();
	}

	//播放球杆损坏动画
	private playCueMaintainAnim()
	{
		this.imgMaintain.opacity = 255;
		this.cueMaintainTween = cc.tween(this.imgMaintain)
                .to(0.8, { opacity: 100 })
				.to(0.8, { opacity: 255 })
                .union()
                .repeatForever()
                .start();
	}

	//停止球杆损坏动画
	private stopCueMaintainAnim()
	{
		if(this.cueMaintainTween) {
            this.cueMaintainTween.stop();
            this.cueMaintainTween = null;
        }
		this.imgMaintain.opacity = 0;
	}

	private getCueMaintain()
	{
		let playerCue:PlayerCueVO = GameDataManager.GetDictData(GameDataKey.PlayerCue,PlayerCueVO);
        let simplePlayerCue:SimplePlayerCueVO = playerCue.getMyUseCue();
        if(!simplePlayerCue) return false;
        //球杆损坏
        if(simplePlayerCue.defendDay == 0 && simplePlayerCue.defendTimes == 0) {
			return true;
		}
		return false;
	}

	public dispose()
	{
		this.stopCueMaintainAnim();
		JTimer.ClearTimeOut(this);
		super.dispose();
	}

	// 点击修复提示图标
	private onClickimgMaintain() {
		let PlayerCue:PlayerCueVO = GameDataManager.GetDictData(GameDataKey.PlayerCue);
		if(!PlayerCue || !this.imgMaintain.opacity) {
			return;
		}
		let curCue = PlayerCue.getMyUseCue();
		if (this.cueMaintainNode) {
            this.cueMaintainNode.active = true;
            this.lobbyCueMaintain.updateCueMaintainInfo(curCue.cueID);
        } else {
            this.cueMaintainNode = StoreManager.NewPrefabNode(Assets.GetPrefab("LobbyScene/LobbyCue/LobbyCueMaintain"));
            this.asset.addChild(this.cueMaintainNode);
            this.lobbyCueMaintain = this.addObject(new LobbyCueMaintainBinder());
            this.lobbyCueMaintain.bindView(this.cueMaintainNode);
            this.lobbyCueMaintain.updateCueMaintainInfo(curCue.cueID);
        }
	}
}