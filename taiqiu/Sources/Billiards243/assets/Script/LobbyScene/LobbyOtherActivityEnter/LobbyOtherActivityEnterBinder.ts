import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { ModuleNames } from "../../ModuleNames";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { PlayerVO } from "../../VO/PlayerVO";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { SignActivityVO } from "../../VO/SignActivityVO";
import { S2C_PushAuthentication, S2C_PushAward } from "../../Networks/Protobuf/billiard_pb";

/**
*@description:签到、充值、等活动入口图标
**/
export class LobbyOtherActivityEnterBinder extends FBinder 
{
	public static ClassName:string = "LobbyOtherActivityEnterBinder";
	private signBtn: cc.Node;
	private checkBtn: cc.Node;
	private relifeBtn: cc.Node;
	private mouthVip: cc.Node;
	private firstChong: cc.Node;
	private weekVip: cc.Node;
	
	protected initViews():void
	{
		super.initViews();

		let signBtn = getNodeChildByName(this.asset, "activityNode/btn_sign");
		let checkBtn = getNodeChildByName(this.asset, "activityNode/btn_checkName");
		let relifeBtn = getNodeChildByName(this.asset, "activityNode/btn_relife");
		let mouthVip = getNodeChildByName(this.asset, "activityNode/btn_mouthVip");
		this.firstChong = getNodeChildByName(this.asset, "activityNode/firstPay"); //btn_WeekVip
		this.weekVip = getNodeChildByName(this.asset, "activityNode/btn_WeekVip");
		

		signBtn.on("click", ()=> { // 签到
			dispatchFEventWith(LobbyEvent.Open_LobbySign);
		})

		checkBtn.on("click", ()=> { // 实名认证
			dispatchFEventWith(LobbyEvent.Open_CheckName);
		})

		relifeBtn.on("click", ()=> { // 复活
			dispatchFEventWith(LobbyEvent.Open_reLife);
		})

		mouthVip.on("click", ()=> { // 月卡
			dispatchFEventWith(LobbyEvent.Open_LobbyMouthVip);
		})

		this.firstChong.on("click", ()=> {  // 首充礼包
			dispatchFEventWith(LobbyEvent.Open_LobbyFirstPay);
		})

		// 周礼包
		this.weekVip.on("click", () => {
			dispatchFEventWith(LobbyEvent.Open_LobbyWeekVip);
		})

		this.signBtn = signBtn;
		this.checkBtn = checkBtn;
		this.relifeBtn = relifeBtn;
		this.mouthVip = mouthVip;
		this.checkIconView();
		
	}

	protected addEvents () {
		addEvent(this, LobbyEvent.ActivityUpdate, this.onActivityUpdate);
	}

	private  checkIconView () {
		let activity: S2C_PushAuthentication =  GameDataManager.GetDictData(GameDataKey.Gift_Activity);
		let player: PlayerVO = GameDataManager.GetDictData(GameDataKey.Player);
		let signVo: SignActivityVO = GameDataManager.GetDictData(GameDataKey.SignActivityVo, SignActivityVO);
		this.checkBtn.active = !player.isShiming; 

		 
		this.relifeBtn.active = activity && typeof activity.resurrection != "undefined" && activity.resurrection === 0;
		this.mouthVip.active =  activity && typeof activity.monCard != "undefined" && activity.monCard === 0;
		this.firstChong.active =   activity && typeof activity.firstCharge != "undefined" && activity.firstCharge === 0;
		this.weekVip.active =  activity && typeof activity.weekCard != "undefined" && activity.weekCard === 0;
		signVo && (this.signBtn.active = signVo.isSignIn);

		let data:S2C_PushAward = GameDataManager.GetDictData(GameDataKey.DayMouthGift);
		if(data && data.awards.length > 0) {
			dispatchFEventWith(LobbyEvent.Open_dayMouthGift);
		}
		
	
	}

	private onActivityUpdate () {
		this.checkIconView();
	}
}