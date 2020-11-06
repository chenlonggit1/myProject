import { FModule } from "../../../Framework/Core/FModule";
import { GameShowCardBinder } from "./GameShowCardBinder";
import { LoaderType } from "../../../Framework/Enums/LoaderType";


/**
*@description:显示抽中的牌的模块
**/
export class GameShowCardModule extends FModule 
{
	public static ClassName:string = "GameShowCardModule";
	public get assets():any[]{return ["GameCardScene/GameShowCardModule","GameCardScene/ShowCardItem",{type:LoaderType.SPRITE_ATLAS,asset:"GameCardScene/GameCardScene"}]};
	
	public constructor()
	{
		super();
		this.isNeedPreload = true;// 默认不需要预加载资源，只有使用了Mediator管理模块时才起作用
		this.isReleaseAsset = false;// true:销毁模块时释放资源   false:销毁模块时不释放资源
		this.delayReleaseAssetTime = 0;// 销毁模块时延时释放资源，单位ms
	}

	protected createViews():void
	{
		super.createViews();
		this.binder = new GameShowCardBinder();
	}
	

	protected showViews():void
	{
		super.showViews();
	}
	protected hideViews():void
	{
		super.hideViews();
	}
}