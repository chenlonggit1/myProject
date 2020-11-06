import { CLanguage } from "../../../Framework/Components/CLanguage";
import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { JTimer } from "../../../Framework/Timers/JTimer";
import { Native } from "../../Common/Native";


/**
*@description:大厅客服模块
**/
export class LobbyServerBinder  extends FBinder 
{
	public static ClassName:string = "LobbyServerBinder";
	
	private tip:cc.Node = null;// 复制成功后的提示
	private timer:JTimer = null;// 计时器
	protected initViews():void
	{
		super.initViews();

		let btnBack = getNodeChildByName(this.asset,"img_TongYongDi/btn_GuanBi");

		btnBack.on(cc.Node.EventType.TOUCH_END, () => {
			dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.LobbyServerSystem);
		}, this);

		this.tip = getNodeChildByName(this.asset,"img_TongYongDi/copySuccess");

		let qq_item =  getNodeChildByName(this.asset,"img_TongYongDi/qq");
		let wx_item =  getNodeChildByName(this.asset,"img_TongYongDi/wx");

		let qq_copy =  getNodeChildByName(qq_item,"qq_copy");
		let qq_label =  getNodeChildByName(qq_item,"qqLabel",cc.Label);

		qq_copy.on(cc.Node.EventType.TOUCH_END, () => {
			this.copyRes(qq_label.string)
		}, this);


		let wx_copy =  getNodeChildByName(wx_item,"wx_copy");
		let wx_label =  getNodeChildByName(wx_item,"wxLabel",cc.Label);
		wx_label.string = "KartOyuni";
		wx_copy.on(cc.Node.EventType.TOUCH_END, () => {
			this.copyRes(wx_label.string)
		}, this);

	}
	// 复制
	private copyRes(string:string){
		Native.copyToClipboard(string);
		this.showTip();
	}

	private showTip():void{
		if(this.timer){
			this.timer.reset();
		}
		this.tip.active = true;
		let timerCount = 1;
		let onTimeTick = function () {
			timerCount -= 1;
			if (timerCount == 0) {
				this.tip.active = false;
				this.timer.reset();
				this.timer = null;
			}
		}
		this.timer = this.addObject(JTimer.GetTimer(1000));
		this.timer.addTimerCallback(this, onTimeTick);
		this.timer.start();
	}
}