import { FBinder } from "../../../Framework/Core/FBinder";
import { StoreManager } from "../../../Framework/Managers/StoreManager";
import { BaseGameTableBinder } from "../../Base/GameTable/BaseGameTableBinder";
import { PlayGameID } from "../../Common/PlayGameID";
import { GameTableBinder } from "../../GameScene/GameTableModule/GameTableBinder";

/**
*@description:新手引导训练场景
**/
export class GameTrainTableBinder extends GameTableBinder 
{
	public static ClassName:string = "GameTrainTableBinder";
	
	protected initViews():void
	{
		super.initViews();
	}

	protected createBalls()
	{
		if(this.room.gameId==PlayGameID.RedBall)
		{
			this.room.isAllotBall = true;
			this.table.ballParent = StoreManager.NewPrefabNode("GameTrainScene/GameBalls");
		}else this.table.ballParent = StoreManager.NewPrefabNode("GameTrainScene/GameBalls");
	}
}