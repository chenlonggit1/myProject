import { StoreManager } from "../../../Framework/Managers/StoreManager";
import { Physics3DUtility } from "../../../Framework/Utility/Physics3DUtility";
import { BaseGameTableBinder } from "../../Base/GameTable/BaseGameTableBinder";
import { C_Game_LuckBall } from "../../Networks/Clients/C_Game_LuckBall";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { GameEvent } from "../../GameEvent";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import LumosEffect from "../../../Framework/Effects/LumosEffect";
import { C_Game_LuckStopBall } from "../../Networks/Clients/C_Game_LuckStopBall";

/**
*@description:幸运一球桌子模块
**/
export class GameLuckBallTableBinder extends BaseGameTableBinder 
{
	public static ClassName: string = "GameLuckBallTableBinder";
	public isFirstLoad = true;//  因为物理休眠后的回调在一进入游戏时会自动发送。先给个判断
	private ringNodes: any[] = [];// 圆环的节点
	private gameLuckType: number = 0;// 1、免费，2、收费
	private ballAndRewardInfo: any = null;// 球位置、中圆环节点信息
	private isFirstChangeBallsPos:boolean = false;//是否第一次修改白球定位，因为在后面都是直接更改球的信息


	protected createBalls()
	{
		this.table.ballParent = StoreManager.NewPrefabNode("GameLuckBallScene/GameLuckBalls");
	}

	/**物理休眠后的回调 */
	protected onPhysicSleep() 
	{
		if (Physics3DUtility.IsEnableSendSleep) 
		{
			if (this.isFirstLoad) this.isFirstLoad = false;
			else 
			{
				let ball = this.table.balls.length>0?this.table.balls[0]:null;
				if(ball)C_Game_LuckBall.Send(this.gameLuckType, this.calculateScore(ball));
				else C_Game_LuckBall.Send(this.gameLuckType, 0);	//说明红球不在，直接发送0环
			}
		}
	}


	protected addEvents() {

		super.addEvents();
		addEvent(this, GameEvent.onChangBallPos, this.onChangBallPos);
	}
	
	private onRetBallPos() 
	{
		dispatchFEventWith(GameEvent.On_Start_NewRound);
		dispatchFEventWith(GameEvent.Player_Option, this.player.id);
		this.onSetBallPosAndReward();
	}

	private onSetBallPosAndReward() 
	{
		var data = this.ballAndRewardInfo;
		this.gameLuckType = data.luckType;
		this.ringNodes = data.rewardCenter;
		var whitePos = data.ballsPos.whiteBall.split(',');
		var redBall = data.ballsPos.redBall.split(',');
		this.setBallPos(this.table.whiteBall, cc.v2(parseFloat(whitePos[0]), parseFloat(whitePos[1])));
		this.setBallPos(this.table.balls[0], cc.v2(parseFloat(redBall[0]), parseFloat(redBall[1])));
		this.updateBallScreenPoints();
		dispatchFEventWith(GameEvent.Update_BallCue, { position: this.table.whiteBall.position.clone() });
	}

	private onChangBallPos(data: any) 
	{
		this.ballAndRewardInfo = data.data;
		if(this.isFirstChangeBallsPos == false)
		{
			this.isFirstChangeBallsPos = true;
			this.onSetBallPosAndReward()
		}else this.onRetBallPos();
	}

	private setBallPos(ball, pos) 
	{
		let collider: cc.Collider3D = ball.getComponent(cc.Collider3D);
		let bodyPos = collider.shape['sharedBody'].body.position;
		ball.x = pos.x;
		ball.z = pos.y;
		ball.opacity = 255;
		bodyPos.x = pos.x;
		bodyPos.z = pos.y;
	}

	/**击球 */
	public shoot(): void {
	}
	/**重置幸运球 */
	protected resetLuckBall() {
		// cc.log('resetLuckBall')
	}
	/**计算击球分数 */
	protected calculateScore(ball: cc.Node) {

		let sizePos = ball.convertToWorldSpaceAR(cc.v3());
		let sizeScreenPos: any = this.camera.getWorldToScreenPoint(sizePos);
		sizeScreenPos = cc.v2(sizeScreenPos.x, sizeScreenPos.y)
		sizeScreenPos.x -= cc.view.getVisibleSize().width / 2;
		sizeScreenPos.y -= cc.view.getVisibleSize().height / 2; 
		var sqrt = Math.sqrt(Math.pow(sizeScreenPos.x - this.ringNodes[0].x, 2) + Math.pow(sizeScreenPos.y - this.ringNodes[0].y, 2));// 这里应该是各个圆的平方根
		var resultIndex = 0;// 默认0 ，代表不在环里

		var length = this.gameLuckType == 1 ? this.ringNodes.length - 2 : this.ringNodes.length - 1;
		// cc.log(sqrt)
		for (let i = length; i >= 0; i--) 
		{
			let radius = this.ringNodes[i].width / 2;// 各个环的半径 1 2 3 4
			if (sqrt < radius) 
			{
				resultIndex = i + 1;
				break;
			}
		}

		cc.log('命中=', resultIndex + '环');
		if (resultIndex == 0) 
		{
			
		} else 
		{
			let hitReward = getNodeChildByName(this.ringNodes[resultIndex - 1], 'hitReward', LumosEffect);
			hitReward.startEffect();
		}
		
		dispatchFEventWith(GameEvent.onGetRedBallStopResult, resultIndex);
		return resultIndex;
	}

	//玩家松手后，向服务器发送请求
	public onPlayerStopBall(){
		C_Game_LuckStopBall.Send(this.gameLuckType);
	}
}