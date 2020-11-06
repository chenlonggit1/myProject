import { FModule } from "../../../Framework/Core/FModule";
import { GameFreeKickBinder } from "./GameFreeKickBinder";
import { RoomVO } from "../../VO/RoomVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { PlayerVO } from "../../VO/PlayerVO";


/**
*@description:任意球摆球模块
**/
export class GameFreeKickModule extends FModule 
{
	public static ClassName:string = "GameFreeKickModule";
	public get assets():any[]{return ["GameScene/GameFreeKickModule"]};
	
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
		this.binder = new GameFreeKickBinder();
	}
	public onPlayerIllegality(playerID:number,type:number)
	{
		if(this.binder==null)return;
		let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
		let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		if(room.optPlayer!=player.id||playerID==player.id)return;// 不是玩家自己击球或者玩家自己犯规了
		if(type!=0)(this.binder as GameFreeKickBinder).setFreeKickBall(player.id,true);
	}
	public onPlayerOption(playerID:number)
	{
		if(this.binder==null)return;
		(this.binder as GameFreeKickBinder).setOptionPlayer(playerID);
	}
	public onPlayerShotBall(data:any)
	{
		if(this.binder==null)return;
		(this.binder as GameFreeKickBinder).shoot(data.playerID,data.angle,data.force,data.velocity,data.powerScale);
	}
	/**开始新一局 */
	public onStartNewRound()
	{
		
	}
}