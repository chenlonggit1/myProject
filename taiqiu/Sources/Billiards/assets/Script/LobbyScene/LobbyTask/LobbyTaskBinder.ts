import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { GameLayer } from "../../../Framework/Enums/GameLayer";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { LobbyTaskItemBinder } from "./LobbyTaskItemBinder";
import { StoreManager } from "../../../Framework/Managers/StoreManager";
import { Assets } from "../../../Framework/Core/Assets";
import { TaskGiftItemBinder } from "./TaskGiftItemBinder";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { GameEvent } from "../../GameEvent";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { PlayerTaskVO } from "../../VO/PlayerTaskVO";
import { C_Lobby_GetTask } from "../../Networks/Clients/Task/C_Lobby_GetTask";
import { C_Lobby_GetActiveReward } from "../../Networks/Clients/Task/C_Lobby_GetActiveReward";
import { showPopup } from "../../Common/showPopup";
import { PopupType } from "../../PopupType";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { CLanguage } from "../../../Framework/Components/CLanguage";
import { getLang } from "../../../Framework/Utility/dx/getLang";
import { PlayerVO } from "../../VO/PlayerVO";

/**
*@description:大厅任务模块
**/
export class LobbyTaskBinder extends FBinder 
{
	public static ClassName:string = "LobbyTaskBinder";

	private lobbyTaskItems:LobbyTaskItemBinder[] = [];
	private taskGiftItems:TaskGiftItemBinder[] = [];
	private playerTask:PlayerTaskVO = null;

	private btnNodeList:CLanguage[] = [];
	private redPoint:cc.Node[] = [];
	private taskTitleIndex = 0;

	private lbTime:cc.Label = null;
	private taskScroll:cc.Node = null;
	private taskContent:cc.Node = null;
	private taskProgressBar:cc.ProgressBar = null;
	private taskGiftContent:cc.Node = null;
	private livenessNode:cc.Node = null;
	private lbLiveness:cc.Label = null;
	private imgActive:CLanguage = null;
	private imgTip:cc.Node = null;
	private tipText:cc.Label = null;
	private taskTip:cc.Node = null;
	private taskTimeOut:number[] = [];
	private taskPool:cc.NodePool = null;

	protected initViews():void
	{
		super.initViews();
		super.addEvents();

		let btnBack = getNodeChildByName(this.asset,"btn_back");
		btnBack.on(cc.Node.EventType.TOUCH_END, () => {
			dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.Lobby_Task, null, GameLayer.UI);
		}, this);
		let btnNode = getNodeChildByName(this.asset,"btnNode");
		for(let i = 0; i < 4; i++){
			this.btnNodeList[i] = getNodeChildByName(btnNode, "btnNode"+i,CLanguage);
			this.redPoint[i] = getNodeChildByName(this.btnNodeList[i].node, "redPoint");
			this.btnNodeList[i].node.on(cc.Node.EventType.TOUCH_END, () => {
				this.setTaskTitle(i);
			}, this);
		}
		this.lbTime = getNodeChildByName(this.asset,"time",cc.Label);
		this.taskScroll = getNodeChildByName(this.asset,"taskScrollView");
		this.taskContent = getNodeChildByName(this.asset,"taskScrollView/view/content");
		this.taskScroll.on('scrolling', this.onScrollingEvent, this);
		this.taskProgressBar = getNodeChildByName(this.asset,"taskProgressBar", cc.ProgressBar);
		this.taskGiftContent = getNodeChildByName(this.asset, "taskGiftNode");
		this.livenessNode = getNodeChildByName(this.asset,"img_liveness");
		this.lbLiveness = getNodeChildByName(this.livenessNode,"lb_liveness", cc.Label);
		this.imgActive = getNodeChildByName(this.livenessNode,"img_active", CLanguage);
		this.imgTip = getNodeChildByName(this.asset, "img_tip");
		this.tipText = getNodeChildByName(this.imgTip,"tip_text",cc.Label);
		this.taskTip = getNodeChildByName(this.asset,"taskTip");
		this.playerTask = GameDataManager.GetDictData(GameDataKey.PlayerTask,PlayerTaskVO);
		this.initTaskPool();
	}

	protected addEvents() {
		addEvent(this,LobbyEvent.Server_UpdateTask,this.onServerUpdateTask);
		addEvent(this,LobbyEvent.Server_GetReward,this.onServerGetAward);
		addEvent(this,LobbyEvent.Server_GetAcitveReward,this.onServerGetActiveAward);
		addEvent(this,LobbyEvent.Update_TaskRedPoint,this.setRedPoint);
	}

	//初始化任务对象池
	private initTaskPool()
	{
		this.taskPool = new cc.NodePool();
		for(let i = 0; i < 10; i++){
			let taskNode = StoreManager.NewPrefabNode(Assets.GetPrefab("LobbyScene/LobbyTask/LobbyTaskItem"));
			this.taskPool.put(taskNode);
		}
	}

	//获取任务对象

	private getTaskNode():cc.Node
	{
		let enemy = null;
		if (this.taskPool.size() > 0) {
			enemy = this.taskPool.get();
		} else {
			enemy = StoreManager.NewPrefabNode(Assets.GetPrefab("LobbyScene/LobbyTask/LobbyTaskItem"));
		}
		return enemy;
	}

	//回收任务对象
	private taskKilled(taskNode, idx)
	{
		this.lobbyTaskItems[idx].initTaskInfo();
		this.taskPool.put(taskNode);
	}

	//清空列表
	private clearTaskContent()
	{
		let idx = 0;
		while(this.taskContent.childrenCount > 0) {
			this.taskKilled(this.taskContent.children[0],idx);
			idx++;
		}
	}

	//设置任务标题
	public setTaskTitle(index:number) {
		if (this.taskTitleIndex == index) return;
		this.taskTitleIndex = index;
		let taskNameList = ["btn_MeiRiRenWu0", "btn_MeiZhouRenWu0", "btn_ChengZhangRenWu0", "btn_HuoDongRenWu0"];
		for(let i = 0; i < 4; i++) {
			let wanfaName = taskNameList[i] + (index == i ? 1 : 2)

			// ResourceManager.LoadSpriteFrame(`Lobby/LobbyTask/LobbyTask?:${wanfaName}`,this.btnNodeList[i].getComponent(cc.Sprite));
			this.btnNodeList[i].key = wanfaName;
		}
		this.taskTip.active = this.taskTitleIndex >= 3;
		this.imgTip.active = false;
		this.clearTaskContent();

		if(this.taskTitleIndex < 3) {
			for(let i = 0; i < this.taskTimeOut.length; i++)
				clearTimeout(this.taskTimeOut[i]);
			this.getTask(this.taskTitleIndex+1);
			// 今日、本周活跃度
			if(this.taskTitleIndex == 0)
				this.imgActive.key = "img_JinRiHuoYue";
			else if(this.taskTitleIndex == 1)
				this.imgActive.key = "img_BenZhouHuoYueDu";
		}
		else { 
			this.taskGiftContent.active = this.taskTitleIndex < 2;
			this.livenessNode.active = this.taskTitleIndex < 2;
			this.taskProgressBar.node.active = this.taskTitleIndex < 2;
		}
	}

	//设置红点
	public setRedPoint()
	{
		for(let i = 0; i < 3; i++){
			this.redPoint[i].active = this.playerTask.taskRedPoint[i];
		}
	}

	public getTask(taskType) {
		C_Lobby_GetTask.Send(taskType);
	}

	//更新任务
	private onServerUpdateTask() {
		this.clearTaskContent();
		this.setTaskInfo();
		this.setTaskGift();
	}

	//领取奖励
	private onServerGetAward() {
		this.clearTaskContent();

		this.setTaskInfo();
		this.setTaskGift();
	}

	//领取活跃奖励
	private onServerGetActiveAward(data) {
		showPopup(PopupType.GET_REWARD, {list: data.data.awards}, false);

		let taskList = this.getActiveInfo();
		
		for(let i = 0; i < taskList.length; i++) {
			let isGet = this.playerTask.activeStatus >> (i+1) & 1;
			this.taskGiftItems[i].setTaskGift(taskList[i],this.playerTask.currentActive, Boolean(isGet));
			this.taskGiftContent.children[i].getComponent(cc.Button).interactable = !isGet;
		}
	}

	//设置任务信息
	private setTaskInfo() {
		let taskList = [];
		if(this.taskTitleIndex == 0)
			taskList = this.playerTask.dailyTasks;
		else if(this.taskTitleIndex == 1)
			taskList = this.playerTask.weekTasks;
		else if(this.taskTitleIndex == 2)
			taskList = this.playerTask.growthTasks;
		taskList.sort((a,b)=>{return a.sortState - b.sortState}); 
		for(let i = 0; i < this.taskTimeOut.length; i++)
			clearTimeout(this.taskTimeOut[i]);
		this.taskTimeOut = [];
		for(let i = 0; i < taskList.length; i++) {
			this.taskTimeOut[i] = setTimeout(()=>{
				this.setTask(i,taskList[i]);
			},100*i);
		}
		this.taskScroll.getComponent(cc.ScrollView).scrollToTop();
		this.onScrollingEvent();
	}

	//获取活跃信息
	private getActiveInfo():any[]
	{
		let taskList = [];
		if(this.taskTitleIndex == 0)
			taskList = this.playerTask.dailyActiveTasks;
		else if(this.taskTitleIndex == 1)
			taskList = this.playerTask.weekActiveTasks;
		return taskList;
	}

	//设置任务
	private setTask(index:number,taskList) {
		let taskItemNode = this.getTaskNode();
		taskItemNode.opacity = 255;
		this.taskContent.addChild(taskItemNode);
		if (!this.lobbyTaskItems[index]){
			this.lobbyTaskItems[index] = this.addObject(new LobbyTaskItemBinder());
		}
		this.lobbyTaskItems[index].bindView(taskItemNode);
		this.lobbyTaskItems[index].setTaskItem(taskList);

	}
	
	private onScrollingEvent() {
		var viewRect = cc.rect(- this.taskScroll.width / 2, - this.taskContent.y - this.taskScroll.height, this.taskScroll.width, this.taskScroll.height);
        for (let i = 0; i < this.taskContent.children.length; i++) {
            const node = this.taskContent.children[i];
            if (viewRect.intersects(node.getBoundingBox())) {
                node.opacity = 255;
            }
            else {
                node.opacity = 0;
            }
        }
	}

	/**
	 * 设置任务领奖
	 * taskGiftContent 范围(0,1040)
	 */
	private setTaskGift() {
		this.taskGiftContent.removeAllChildren();
		this.taskGiftContent.active = this.taskTitleIndex < 2;
		this.livenessNode.active = this.taskTitleIndex < 2;
		this.taskProgressBar.node.active = this.taskTitleIndex < 2;
		// this.lbTime.node.active = this.taskTitleIndex < 2;

		let taskList = this.getActiveInfo();
		if(taskList.length == 0 || this.taskTitleIndex >= 2) return;
		let result = 1040/taskList[taskList.length-1].milepost;
		for(let i = 0; i < taskList.length; i++) {
			let taskGiftNode = StoreManager.NewPrefabNode(Assets.GetPrefab("LobbyScene/LobbyTask/TaskGiftItem"));
			this.taskGiftContent.addChild(taskGiftNode);
			this.taskGiftItems[i] = this.addObject(new TaskGiftItemBinder());
			this.taskGiftItems[i].bindView(taskGiftNode);
			taskGiftNode.x = taskList[i].milepost*result;
			let isGet = this.playerTask.activeStatus >> (i+1) & 1;
			this.taskGiftItems[i].setTaskGift(taskList[i],this.playerTask.currentActive,Boolean(isGet));
			taskGiftNode.getComponent(cc.Button).interactable = !isGet;
			taskGiftNode.on('click', ()=>{
				if(this.playerTask.currentActive >= taskList[i].milepost)
					this.getActiveReward(taskList[i].milepost);
				else 
					this.setTip(taskGiftNode.x,taskList[i].reward);
			}, this);
		}
		this.setCurrentActive();
	}

	//设置当前活跃度
	setCurrentActive() {
		this.lbLiveness.string = this.playerTask.currentActive.toString();
		
		let taskList = this.getActiveInfo();
		if(taskList.length == 0 || this.taskTitleIndex >= 2) return;
		let result = this.playerTask.currentActive/taskList[taskList.length-1].milepost;
		this.taskProgressBar.progress = result;
	}

	//发送领取活跃奖励
	private getActiveReward(milepost:number) {
		C_Lobby_GetActiveReward.Send(this.taskTitleIndex+1,milepost);
	}
	
	/**
	 * 设置领奖提示
	 * posX 位置
	 * reward 领奖
	 */
	private setTip(posX:number, reward:string)
	{
		let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		this.imgTip.active = !this.imgTip.active;
		if(this.imgTip.active) {
			this.imgTip.x = posX - 740;
			this.tipText.string = "";
			let text = reward.split(";");
			for(let i = 0; i < text.length; i++) {
				let key = text[i].split(",");
				let itemInfo = player.getItemInfo(parseInt(key[0]));
				let name = getLang(itemInfo.code);
				this.tipText.string += `${key[1]}${name} `;
			}
		}
	}

	//设置倒计时
	private setDownTime(time){
		this.lbTime.string = "倒计时：" + time;
	}

}