import { FModule } from "../../../Framework/Core/FModule";
import { ContactPointBinder } from "./ContactPointBinder";


/**
*@description:击球点
**/
export class ContactPointModule extends FModule {
	public static ClassName: string = "ContactPointModule";
	public get assets(): any[] { return ["GameScene/ContactPoint"] };

	public constructor() {
		super();
		this.isNeedPreload = true;// 默认不需要预加载资源，只有使用了Mediator管理模块时才起作用
		this.isReleaseAsset = false;// true:销毁模块时释放资源   false:销毁模块时不释放资源
		this.delayReleaseAssetTime = 0;// 销毁模块时延时释放资源，单位ms
	}

	protected createViews(): void {
		super.createViews();
		this.binder = new ContactPointBinder();
	}

	protected showViews(): void {
		super.showViews();
	}

	protected hideViews(): void {
		super.hideViews();
	}

	public onPlayerOption(playerID:number)
	{
		if(this.binder==null)return;
		(this.binder as ContactPointBinder).setOptionPlayer(playerID);
	}
}