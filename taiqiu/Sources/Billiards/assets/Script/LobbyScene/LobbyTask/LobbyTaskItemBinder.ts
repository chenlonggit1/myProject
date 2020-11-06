import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { GameLayer } from "../../../Framework/Enums/GameLayer";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { C_Lobby_GetTaskReward } from "../../Networks/Clients/Task/C_Lobby_GetTaskReward";
import { SimplePlayerTaskVO } from "../../VO/SimplePlayerTaskVO";
import { CLanguage } from "../../../Framework/Components/CLanguage";
import { getLang } from "../../../Framework/Utility/dx/getLang";

/**
*@description:大厅任务模块
**/
export class LobbyTaskItemBinder extends FBinder 
{
	public static ClassName:string = "LobbyTaskItemBinder";
	private playerTask:SimplePlayerTaskVO = null;

	private imgDraw:CLanguage = null;
	private btnGoComplete:CLanguage = null;
	private imgGift:cc.Sprite = null;
	private taskTitle:cc.Label = null;
	private rewardNode:cc.Node = null;
	private lbReward:cc.Label[] = [];
	private imgReward:cc.Sprite[] = [];

	private lbProgress:cc.Label = null;
	private isComplete:boolean = false;

	protected initViews():void
	{
		super.initViews();

		this.imgDraw = getNodeChildByName(this.asset, "img_draw",CLanguage);
		this.btnGoComplete = getNodeChildByName(this.asset, "btn_goComplete",CLanguage);
		this.imgGift = getNodeChildByName(this.asset, "img_gift");
		this.taskTitle = getNodeChildByName(this.asset, "taskTitle",cc.Label);
		this.lbProgress = getNodeChildByName(this.asset, "lbProgress",cc.Label);
		this.rewardNode = getNodeChildByName(this.asset,"rewardNode");
		for(let i = 0; i < 4; i++) {
			this.lbReward[i] = getNodeChildByName(this.rewardNode, "lbReward"+(i+1),cc.Label);
			this.imgReward[i] = getNodeChildByName(this.rewardNode, "imgReward"+(i+1),cc.Sprite);
		}
		this.initTaskInfo();
	}

	protected addEvents()
	{
		super.addEvents();
		this.btnGoComplete.node.off(cc.Node.EventType.TOUCH_END);
		this.btnGoComplete.node.on(cc.Node.EventType.TOUCH_END, () => {
			this.goComplete();
		}, this);
		
	}

	public initTaskInfo()
	{
		this.isComplete = false;
		this.imgDraw.node.active = false;
		this.btnGoComplete.node.active = true;
		this.lbProgress.node.active = true;
		this.btnGoComplete.key="btn_QuWanCheng"
		this.rewardNode.x = 0;
		for(let i = 0; i < 4; i++) {
			this.lbReward[i].node.active = false;
			this.imgReward[i].node.active = false;
		}
	}

	public setTaskItem(data) {
		this.playerTask = data;
		// let text = data.taskText.toString().split("X");
		// this.taskTitle.string = `${text[0]}${data.totalProgress}${text[1]}`;
		this.taskTitle.string = getLang(data.taskText,[data.totalProgress]);
		this.lbProgress.string = `${getLang("Text_plan")}：${data.currentProgress}/${data.totalProgress}`;
		if (data.dayActive > 0){
			this.lbReward[0].node.active = true;
			this.imgReward[0].node.active = true;
			this.lbReward[0].string = "X" + data.dayActive;
			getNodeChildByName(this.rewardNode, "imgReward1", CLanguage).key = "taskDaily";
		}
		else if(data.weekActive > 0){
			this.lbReward[0].node.active = true;
			this.imgReward[0].node.active = true;
			this.lbReward[0].string = "X" + data.weekActive;
			getNodeChildByName(this.rewardNode, "imgReward1", CLanguage).key = "taskWeek";

		}
		else {
			this.rewardNode.x = -140;
			this.lbReward[0].node.active = false;
			this.imgReward[0].node.active = false;
		}
		let index = 1;

		for(let key in data.rewards) {
			this.lbReward[index].node.active = true;
			this.imgReward[index].node.active = true;
			this.lbReward[index].string = "X" + data.rewards[key];

			if (index == 1) 
				ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${key}`,this.imgGift);
				ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${key}`,this.imgReward[index].node.getComponent(cc.Sprite));

			index++;
		} 
		//任务完成
			if(data.state == 1){
				this.isComplete = true;
				this.btnGoComplete.key="btn_LingQu"
			} else if(data.state == 2) {
				this.imgDraw.node.active = true;
				// this.imgDraw.key = "img_YiLingQu";
				this.btnGoComplete.node.active = false;
				this.lbProgress.node.active = false;
			}
		// }

	}

	public goComplete() {
		if(this.isComplete) {
			C_Lobby_GetTaskReward.Send(this.playerTask.id);
		} else {
			dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.Lobby_Task, null, GameLayer.UI);
		}
	}
}