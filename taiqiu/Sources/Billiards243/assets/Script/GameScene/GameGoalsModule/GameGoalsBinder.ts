import { CDragonBones } from "../../../Framework/Components/CDragonBones";
import { FBinder } from "../../../Framework/Core/FBinder";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { getCamera } from "../../../Framework/Utility/dx/getCamera";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { CanvasOffset } from "../../Common/CanvasOffset";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { GameEvent } from "../../GameEvent";
import { PlayerCueVO } from "../../VO/PlayerCueVO";
import { PlayerVO } from "../../VO/PlayerVO";
import { RoomVO } from "../../VO/RoomVO";
import { TableVO } from "../../VO/TableVO";

/**
*@description:进球动画
**/
export class GameGoalsBinder extends FBinder {
	public static ClassName: string = "GameGoalsBinder";

	protected table:TableVO = null;
	private room:RoomVO = null;
	private player:PlayerVO = null;
	protected camera: cc.Camera = null;
	protected goalsAnim:dragonBones.ArmatureDisplay = null;
	
	protected initViews(): void 
	{
		super.initViews();
		this.table = GameDataManager.GetDictData(GameDataKey.Table,TableVO);
		this.room = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
		this.player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		this.camera = getCamera("3D Camera");
		this.goalsAnim = getNodeChildByName(this.asset,"goalsAnim",dragonBones.ArmatureDisplay);

	}
	protected addEvents() 
	{
		super.addEvents();
		addEvent(this,GameEvent.On_Set_BallHoleAni,this.onSetPocketBall);
	}

	public onSetPocketBall(data)
	{
		let cueIndex = this.getCueIndex();
		//console.log(this.room.optPlayer,this.player.id, cueIndex);
		if(cueIndex < 3) return;
		let pocketBallInfo = data.data;
		this.goalsAnim.node.setPosition(0,0);
		let anchorPos = pocketBallInfo.pocketNode.convertToWorldSpaceAR(cc.v3());
		let anchorScreenPos: any = this.camera.getWorldToScreenPoint(anchorPos);
		anchorScreenPos = cc.v2(anchorScreenPos.x, anchorScreenPos.y).sub(CanvasOffset.Offset);
		let goalsPos = this.goalsAnim.node.convertToWorldSpaceAR(cc.v2(0, 0)).sub(CanvasOffset.Offset);
		this.goalsAnim.node.setPosition(anchorScreenPos.x - goalsPos.x,anchorScreenPos.y - goalsPos.y);
		CDragonBones.setDragonBones(this.goalsAnim,`DragonBones/Goals/jinqiucue${cueIndex}/jinqiucue${cueIndex}_ske`,`DragonBones/Goals/jinqiucue${cueIndex}/jinqiucue${cueIndex}_tex`,
            `jinqiucue${cueIndex}`,`jinqiucue${cueIndex}`,1);
	}

	//设置击球球杆
	private getCueIndex()
	{
		let cueId = 0;
		if(this.room.optPlayer == this.player.id){
			let playerCue = GameDataManager.GetDictData(GameDataKey.PlayerCue,PlayerCueVO);
			for(let i = 0; i < playerCue.myCues.length; i++) {
				if(playerCue.myCues[i].isUse) {
					cueId = playerCue.myCues[i].cueID;
					break;
				}
			}
		}else{
			for (let i = 0; i < this.room.players.length; i++) {
				if(this.room.players[i].id == this.room.optPlayer) {
					cueId = this.room.players[i].cueId;
					break;
				}
			}
		}
		return Math.floor(cueId/100);
	}
	
}