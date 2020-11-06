import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { PayEvent } from "../../Common/PayEvent";
import { FEvent } from "../../../Framework/Events/FEvent";
import { S2C_WxOpenIdInfo, S2C_PhoneCodeSuccess } from "../../Networks/Protobuf/billiard_pb";
import { C_Pay_GetWXInfo } from "../../Networks/Clients/Pay/C_Pay_GetWXInfo";
import { C_Pay_TurnRedPack } from "../../Networks/Clients/Pay/C_Pay_TurnRedPack";
import { C_Pay_BinderPhone } from "../../Networks/Clients/Pay/C_Pay_BinderPhone";
import { C_Pay_BinderCode } from "../../Networks/Clients/Pay/C_Pay_BinderCode";
import { showPopup } from "../../Common/showPopup";
import { PopupType } from "../../PopupType";
import { ERRINFO } from "../../Networks/ERRDefine";
import { getLang } from "../../../Framework/Utility/dx/getLang";
import { GetErrInfo } from "../GetErrInfo";

/**
*@description:手机绑定
**/
export class binderPhoneBinder extends FBinder 
{
	public static ClassName:string = "binderPhoneBinder";
	private edit_phone: cc.EditBox;
	private edit_code: cc.EditBox;
	private btn_code: cc.Button;
	private btn_sure: cc.Button;
	private btn_close: cc.Button;
	private t_btnDesc: cc.Label;
	private sec: number = 0;
	private timer: cc.Scheduler;
	static maxTime = 60;
	
	protected initViews():void
	{
		super.initViews();

		this.edit_phone = getNodeChildByName(this.asset, "edit_phone", cc.EditBox);
		this.edit_code = getNodeChildByName(this.asset, "edit_code", cc.EditBox);
		this.btn_code = getNodeChildByName(this.asset, "btn_code", cc.Button);
		this.btn_sure = getNodeChildByName(this.asset, "btn_sure", cc.Button);
		this.btn_close = getNodeChildByName(this.asset, "btn_close", cc.Button);
		this.t_btnDesc = getNodeChildByName(this.asset, "btn_code/lbl_code", cc.Label);

		this.btn_close.node.on(cc.Node.EventType.TOUCH_END, this.onClose, this);
		this.btn_sure.node.on("click", this.onBtnSure, this);
		this.btn_code.node.on("click", this.onBtnCode, this);
	}


	private onClose() {
		this.edit_code.string = "";
		this.edit_phone.string = "";
		
		this.setBtnCodeState(false);
		dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.Pay_BinderPhone);
	}

	addEvents() {
		addEvent(this, PayEvent.Pay_ServerBinderPhone, this.onBinderCall);
	}

	updateView() {
		this.setBtnCodeState(false);
	}

	
	private onBtnSure() {
		// C_Pay_TurnRedPack.Send
		// let phone = 
		let code = this.edit_code.string;
		if(!code) {
			cc.error("验证码输入错误");
			showPopup(PopupType.TOAST, {msg:GetErrInfo(2003)});
			return;
		}
		C_Pay_BinderCode.Send(code);
	}

	private onBtnCode() {
		let phone = this.edit_phone.string;
		if(!phone || !(/^1[3456789]\d{9}$/.test(phone))){ 
			cc.error("手机输入错误");
			showPopup(PopupType.TOAST, {msg:GetErrInfo(2004)});
			return;
		} 
		C_Pay_BinderPhone.Send(phone);
		this.timerStart();
		// showPopup(PopupType.CONFIRM_WINDOW, "1111111111", false);
		// 检测手机格式
		// TODO
		
	}

	private onBinderCall(event: FEvent) {
		let msg:S2C_PhoneCodeSuccess = event.data;
		cc.log("===========绑定手机消息", msg.success);
		if(msg.success) { // 成功 
			showPopup(PopupType.TOAST, {msg: "绑定手机成功"});
			this.onClose();
		}

	}

	private timerStart() {
		this.t_btnDesc.schedule(this.onTimer.bind(this), 1, cc.macro.REPEAT_FOREVER);
		this.onTimer();
	}

	private onTimer() {
		
		let offTime = binderPhoneBinder.maxTime - this.sec;
		if(offTime <= 0) {
			this.setBtnCodeState(false);
			this.sec = 0;
		} else {
			this.t_btnDesc.string = `(${offTime})`;
			this.setBtnCodeState(true);
		}
		this.sec++;
	}

	private setBtnCodeState(isGray: boolean) {
		if(isGray) {
			this.btn_code.interactable = false;
		} else {
			this.btn_code.interactable = true;
			this.t_btnDesc.unscheduleAllCallbacks();
			this.sec = 0;
			let txt = getLang("txt_getcode");
			this.t_btnDesc.string = txt;
		}
	}

	
}