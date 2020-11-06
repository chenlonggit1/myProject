import { FBinder } from "../../../Framework/Core/FBinder";
import { StoreManager } from "../../../Framework/Managers/StoreManager";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { Fun } from "../../../Framework/Utility/dx/Fun";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { PlayGameID } from "../../Common/PlayGameID";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { GameEvent } from "../../GameEvent";
import { PlayerVO } from "../../VO/PlayerVO";
import { RoomVO } from "../../VO/RoomVO";
import { TableVO } from "../../VO/TableVO";
import BallItem from "../BallItem";

/**
*@description:入袋桌球收集模块
**/
export class GamePocketCollectBinder extends FBinder 
{
	public static ClassName:string = "GamePocketCollectBinder";
	protected table:TableVO = null;
	protected room:RoomVO = null;
	protected player:PlayerVO = null;
	protected paths:cc.Vec3[] = [];
	/**球的移动路线 */
	protected ballPaths:cc.Vec3[] = [];
	/**已经停止在轨道上的球 */
	protected balls:BallItem[] = [];
	/**正在掉入袋子的球 */
	protected dropings:BallItem[] = [];

	protected initViews():void
	{
		super.initViews();
		this.room = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
        this.player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		this.table = GameDataManager.GetDictData(GameDataKey.Table,TableVO);
		if(this.ballPaths.length==0)
		{
			let n:cc.Node = getNodeChildByName(this.asset,"Collects");
			for (let i = 0; i < n.childrenCount; i++) 
				this.ballPaths[i] = n.children[i].position.clone();//.convertToWorldSpaceAR(cc.v3());
			this.onGetTableInfo();
		}
	}

	protected addEvents()
	{
		super.addEvents();
		addEvent(this,GameEvent.On_Set_BallHoleAni,this.onSetPocketBall);
		addEvent(this, GameEvent.Table_Init_Complete, this.onGetTableInfo);
	}
	/**初始化时接收到桌子信息 */
	protected onGetTableInfo()
	{
		this.clearViews();
		if(this.room.isReconnection)// 断线重连
		{
			for (let i = 0; i < this.table.pocketBalls.length; i++) 
				this.pocketBall(this.table.pocketBalls[i],false);
		}
	}
	/**清除界面 */
	protected clearViews()
	{
		super.clearViews();
		while(this.balls.length>0)
		{
			let b = this.balls.shift();
			b.node.destroy();
		}
		while(this.dropings.length>0)
		{
			let b = this.dropings.shift();
			b.node.destroy();
		}
	}
	/**将球放入袋子，开始做入袋动画 */
	protected pocketBall(id:number,isEffect:boolean=true)
	{
		if(isEffect) {
			this.paths = [];
			let n:cc.Node = getNodeChildByName(this.asset,"BallHole/BallHole"+this.table.pocketNum);
			for (let i = 0; i < n.childrenCount; i++) 
				this.paths[i] = n.children[i].position.clone();
		}
		this.paths = this.paths.concat(this.ballPaths);

		if(this.paths.length==0)return;
		if(this.room.gameId==PlayGameID.RedBall||this.room.gameId==PlayGameID.LuckBall)
		{
			if(id!=8 && id!=0)id = 16;
		}
		let ball:cc.Node = StoreManager.NewPrefabNode("GameScene/BallItem");
		let item:BallItem = ball.getComponent(BallItem);
		// ball.scale = 2.4;
		item.setMaterials(id);
		let yy = (this.dropings.length+this.balls.length)*ball.scale;
		let endPos = this.paths[this.paths.length-1].clone();
		this.asset.addChild(ball);
		endPos.z-=yy;
		if(isEffect)
		{
			item.callback = Fun(this.dropBallComplete,this);
			let ps = this.paths.concat();
			ps.pop();
			ps.push(endPos);
			// ball.setPosition(this.paths[0].clone());
			item.movePaths(ps);
			if(id > 0)
				this.dropings.push(item);
		}else
		{
			this.balls.push(item);
			ball.setPosition(endPos);
		}
	}
	/**球入袋完成 */
	protected dropBallComplete(item:BallItem)
	{
		let index = this.dropings.indexOf(item);
		if(index!=-1)this.dropings.splice(index,1);
		this.balls.push(item);
	}
	/**接收到有球入袋的消息 */
	public onSetPocketBall(data)
	{
		let pocketBallInfo = data.data;
		this.table.pocketNum = pocketBallInfo.pocketPos;
		this.pocketBall(pocketBallInfo.numbers[0]);
	}
}