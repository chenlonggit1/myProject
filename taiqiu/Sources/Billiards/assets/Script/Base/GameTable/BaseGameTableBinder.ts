import { FBinder } from "../../../Framework/Core/FBinder";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { Fun } from "../../../Framework/Utility/dx/Fun";
import { getCamera } from "../../../Framework/Utility/dx/getCamera";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { Physics3DUtility } from "../../../Framework/Utility/Physics3DUtility";
import { CanvasOffset } from "../../Common/CanvasOffset";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { GameEvent } from "../../GameEvent";
import GameBall from "../../GameScene/GameBall";
import { PlayerVO } from "../../VO/PlayerVO";
import { RoomVO } from "../../VO/RoomVO";
import { TableVO } from "../../VO/TableVO";

export class BaseGameTableBinder extends FBinder 
{
    protected player:PlayerVO = null;
	protected room:RoomVO = null;
	protected table:TableVO = null;
    protected camera:cc.Camera = null;
    protected world: CANNON.World;

    protected fun:Function = null;

    protected initViews():void
	{
		super.initViews();
		this.camera = getCamera("3D Camera");
		this.room = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
		this.player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        this.table = GameDataManager.GetDictData(GameDataKey.Table,TableVO);
        this.table.ballScreenPoints = {};
		this.initBalls();
        this.initAnchors();
        this.updateBallScreenPoints();
        this.updateBallRadius();
		// 刚添加刚体到显示列表，需要延时到当前帧最末尾做物理引擎的休眠判断
		setTimeout(() =>this.delayStartPhysic(), 0);
        Physics3DUtility.SetSleepCallback(Fun(this.onPhysicSleep,this,false));
        if (window['CANNON']) 
        {
            if(this.fun==null)this.fun = this.onUpdateStep.bind(this);
            this.world = cc.director.getPhysics3DManager()['physicsWorld']['world'];
            this.world.removeEventListener('postStep',this.fun);
            this.world.addEventListener('postStep', this.fun);
        }
        setTimeout(() => 
        {
            this.updateBallScreenPoints();
            dispatchFEventWith(GameEvent.Table_Init_Complete);
        }, 10);
    }
    protected addEvents()
    {
        super.addEvents();
        addEvent(this,GameEvent.On_Fixed_BallScreenPos,this.onUpdateStep);
    }
    protected clearViews()
	{
        if(this.world)this.world.removeEventListener('postStep', this.fun);
        super.clearViews();
    }
    /**物理世界的更新回调*/
    protected onUpdateStep()
    {
        this.updateBallScreenPoints();
    }
    /**初始化所有的球 */
    protected initBalls()
    {
        this.createBalls();
        if(this.table.ballParent==null)return;
        let ballLen = this.table.ballParent.childrenCount;
		this.asset.addChild(this.table.ballParent);
        this.table.balls.length = 0;
        this.table.whiteBall = null;
		for (let i = 0; i < ballLen; i++) 
		{
			let ball:cc.Node = getNodeChildByName(this.table.ballParent,"B"+i);
			let id = ball.getComponent(GameBall).id;
			if(id==0)this.table.whiteBall = ball;
			else this.table.balls.push(ball);
		}
    }
    /**创建台球 */
    protected createBalls()
    {

    }
    /**初始化所有的锚点 */
    protected initAnchors()
    {
        this.table.anchors.length = 0;
        this.table.anchorScreenPoints.length = 0;
		let anchorNode:cc.Node = getNodeChildByName(this.asset, "GameTable/Anchors");
		for (let i = 0; i < anchorNode.childrenCount; i++) 
		{
            let n = getNodeChildByName(anchorNode, "Anchor" + (i + 1));
            let anchorPos = n.convertToWorldSpaceAR(cc.v3());
			let anchorScreenPos:any = this.camera.getWorldToScreenPoint(anchorPos);
            anchorScreenPos = cc.v2(anchorScreenPos.x,anchorScreenPos.y).sub(CanvasOffset.Offset);
            this.table.anchorScreenPoints.push(anchorScreenPos);
            this.table.anchors.push(n);
        }
    }
    /**更新球在屏幕上的位置 */
    protected updateBallScreenPoints()
    {
        if(this.table.whiteBall==null)return;
        let vbs = [this.table.whiteBall].concat(this.table.balls);
		for (let i = 0; i < vbs.length; i++) 
		{
			let ballWorldPos = vbs[i].convertToWorldSpaceAR(cc.v3());
			let ballScreenPos:any = this.camera.getWorldToScreenPoint(ballWorldPos);
            ballScreenPos = cc.v2(ballScreenPos.x,ballScreenPos.y).sub(CanvasOffset.Offset);
            this.table.ballScreenPoints[vbs[i].name] = ballScreenPos;
		}
    }
    /**更新球半径 */
	protected updateBallRadius()
	{
        if(this.table.whiteBall==null)return;
		let position = this.table.whiteBall.position.clone();
		let screenPos = this.table.ballScreenPoints[this.table.whiteBall.name];
		this.table.whiteBall.x+=this.table.whiteBall.scaleX*0.5;
		let sizePos = this.table.whiteBall.convertToWorldSpaceAR(cc.v3());
		let sizeScreenPos:any = this.camera.getWorldToScreenPoint(sizePos);
		sizeScreenPos = cc.v2(sizeScreenPos.x,sizeScreenPos.y).sub(CanvasOffset.Offset);
		this.table.whiteBall.setPosition(position);
		this.table.ballRadius = Math.abs(sizeScreenPos.x-screenPos.x);
    }
    
    /**延时启动物理引擎，让物理引擎进入到休眠状态 */
	protected delayStartPhysic()
	{
        Physics3DUtility.StartUpdateFrame();
        
	}
	/**物理休眠后的回调 */
	protected onPhysicSleep()
	{
		
    }
}
