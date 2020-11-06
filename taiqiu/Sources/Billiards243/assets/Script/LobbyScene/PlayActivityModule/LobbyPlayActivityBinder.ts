import { CButton } from "../../../Framework/Components/CButton";
import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { S2C_PushAuthentication } from "../../Networks/Protobuf/billiard_pb";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";

/**
*@description:大厅左边活动栏模块
**/
export class LobbyPlayActivityBinder extends FBinder 
{
	public static ClassName:string = "LobbyPlayActivityBinder";
	
	protected initViews():void
	{
		super.initViews();
		let luckBallBtn:cc.Node = getNodeChildByName(this.asset,"activityNode/btn_luckBall");
		let moreBtn:cc.Node = getNodeChildByName(this.asset,"activityNode/btn_more");
		let luckyBtn:cc.Node = getNodeChildByName(this.asset,"activityNode/btn_lucky");
		let buyBtn:cc.Node = getNodeChildByName(this.asset,"activityNode/btn_buy");
		//暂时隐藏活动
		let activity: S2C_PushAuthentication =  GameDataManager.GetDictData(GameDataKey.Gift_Activity);
		luckBallBtn.active = activity && typeof activity.luckyRod != "undefined" && activity.luckyRod == 1;
		moreBtn.active = false;
		luckyBtn.active = false;
		buyBtn.active = false;
		
		luckBallBtn.on("click", () => {
			dispatchFEventWith(LobbyEvent.On_Play_LuckBall);
		}, this);
	}

	protected addEvents()
	{
		super.addEvents();
	}
}