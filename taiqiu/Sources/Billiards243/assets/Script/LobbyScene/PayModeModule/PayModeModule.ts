import { FModule } from "../../../Framework/Core/FModule";
import { PayModeBinder } from "./PayModeBinder";
import { ModuleBasePopup } from "../../PopupModule/ModuleBasePopup";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { PayEvent } from "../../Common/PayEvent";
import { PayOrderVO } from "../../VO/PayOrderVO";
import { Native } from "../../Common/Native";
import { FEvent } from "../../../Framework/Events/FEvent";


/**
*@description:支付选择
**/
export class PayModeModule extends ModuleBasePopup 
{
	public static ClassName:string = "PayModeModule";
	public get assets():any[]{return ["Pay/PayMode"]};
	
	public constructor()
	{
		super();
		this.isNeedPreload = false;// 默认不需要预加载资源，只有使用了Mediator管理模块时才起作用
		this.isReleaseAsset = false;// true:销毁模块时释放资源   false:销毁模块时不释放资源
		this.delayReleaseAssetTime = 0;// 销毁模块时延时释放资源，单位ms
	}

	protected createViews():void
	{
		super.createViews();
		this.binder = new PayModeBinder();
	}

	protected addEvents():void {
		addEvent(this, PayEvent.Pay_ServerOrder, this.onServerOrder);
	}

	protected showViews():void
	{
		super.showViews();
		this.popup(this.node, ()=> {

		})
		
	}
	protected hideViews():void
	{
		
		this.popdown(this.node, ()=> {
			super.hideViews();
		})
	}

	private onServerOrder(event: FEvent) {
		// debugger;
		let order: PayOrderVO = event.data;
		if (order.payType === 1 && order.body) {
			// 支付宝支付
			Native.aliPay(order.body);
		} else if (order.payType === 2 && order.body) {
			// 微信支付
			if (order.body.payUrl) {
				this.wx_h5_pay(order.body.payUrl);
			} else { 
				Native.wxPay(order.body.appid, order.body.partnerid,
					order.body.prepayid, order.body.noncestr,
					order.body.package, order.body.timestamp,
					order.body.sign);
			}
		} else if (order.payType === 3 && order.body) { // 银联支付
			if (order.body.url) {
				cc.sys.openURL(order.body.url);
			} else {
				console.log("========银联支付", order.body + "", "=====",  order.mode);
				Native.ylPay(order.body+"", order.mode); // TODO 支付环境 先写死正式
			}
		}
	}

	 /** 微信h5支付 */
	 wx_h5_pay(url: string) {
        this.remove_webview();
        const timeout_id = setTimeout(() => {
            this.remove_webview();
            cc.log('timeout:' + url);
            cc.sys.openURL(url);
        }, 4000);
        const node = new cc.Node('web_view');
        node.width = 0;
        node.height = 0;
        node.parent = cc.Canvas.instance.node;
        const web_view = node.addComponent(cc.WebView);
        web_view.setJavascriptInterfaceScheme('weixin');
        web_view.setOnJSCallback((target: cc.WebView, wx_url: string) => {
            clearTimeout(timeout_id);
            this.remove_webview();
            cc.log('weixin:--->' + wx_url);
            cc.sys.openURL(wx_url);
        });
        web_view.url = url;
    }
	
	remove_webview() {
        const old_node = cc.Canvas.instance.node.getChildByName('web_view');
        if (old_node && old_node.isValid) {
            old_node.destroy();
        }
    }
}