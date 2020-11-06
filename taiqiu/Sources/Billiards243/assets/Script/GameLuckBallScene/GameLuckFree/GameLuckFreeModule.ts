import { GameLuckFreeBinder } from "./GameLuckFreeBinder";
import { ModuleBasePopup } from "../../PopupModule/ModuleBasePopup";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { GameEvent } from "../../GameEvent";


/**
*@description:幸运一球桌子模块
**/
export class GameLuckFreeModule extends ModuleBasePopup {
	public static ClassName: string = "GameLuckFreeModule";
	public get assets(): any[] { return ["GameLuckBallScene/GameLuckFreePupop"] };

	public constructor() {
		super();
		this.isNeedPreload = false;// 默认不需要预加载资源，只有使用了Mediator管理模块时才起作用
		this.isReleaseAsset = false;// true:销毁模块时释放资源   false:销毁模块时不释放资源
		this.delayReleaseAssetTime = 0;// 销毁模块时延时释放资源，单位ms
	}

	protected createViews(): void {
		super.createViews();
		this.binder = new GameLuckFreeBinder();
	}



	// protected onShowPayPupop(data: any) {
	// 	cc.log(data);
	// 	if(this.binder==null)return;
	// 	(this.binder as GameLuckFreeChallengeBinder).loadData(data);
	// }




	public showViews(): void {
		super.showViews();
		// 弹出动画
		this.popup(this.node, () => { });
	}
	protected hideViews(): void {
		// 弹下动画
		this.popdown(this.node, () => {
			super.hideViews();
		});
	}

}