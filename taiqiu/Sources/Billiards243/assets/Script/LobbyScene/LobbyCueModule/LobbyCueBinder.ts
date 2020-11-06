import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { PlayerVO } from "../../VO/PlayerVO";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { GameLayer } from "../../../Framework/Enums/GameLayer";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { StoreManager } from "../../../Framework/Managers/StoreManager";
import { Assets } from "../../../Framework/Core/Assets";
import { C_Lobby_MyCue } from "../../Networks/Clients/Cue/C_Lobby_MyCue";
import { C_Lobby_AllCue } from "../../Networks/Clients/Cue/C_Lobby_AllCue";
import { LobbyCueItemBinder } from "./LobbyCueItemBinder";
import { LobbyCueInfoBinder } from "./LobbyCueInfoBinder";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { GameEvent } from "../../GameEvent";
import { PlayerCueVO } from "../../VO/PlayerCueVO";
import { LobbyGoodsNodeBinder } from "../NavigationModule/LobbyGoodsNodeBinder";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { CLanguage } from "../../../Framework/Components/CLanguage";

/**
*@description:大厅个人信息模块
**/
export class LobbyCueBinder extends FBinder 
{
	public static ClassName:string = "LobbyCueBinder";
	
	private lobbyCueInfo:LobbyCueInfoBinder = null;
	private lobbyCueItems:LobbyCueItemBinder[] = [];

	private cueTitleImg:CLanguage = null;
	private cueNode:cc.Node = null;
	private gameCueTitle:CLanguage[] = [];
	private gameCueTitleIndex = 0;
	private gameCueLayerIndex = 0;
	private cueTip:cc.Node = null;;
	private cueScroll:cc.Node = null;
	private cueContentNode:cc.Node = null;
	private player:PlayerVO = null;
	private playerCue:PlayerCueVO = null;
	private lobbyCueInfoNode:cc.Node = null;
	private cueTimeOut:number[] = [];
	private cuePool:cc.NodePool = null;

	protected initViews():void
	{
		super.initViews();
		super.addEvents();
		
		let btnBack = getNodeChildByName(this.asset,"btn_back");
		btnBack.on(cc.Node.EventType.TOUCH_END, () => {
			this.onBackClickEvent();
		}, this);

		this.cueTitleImg = getNodeChildByName(this.asset,"img_cueBg/img_cue", CLanguage);
		this.cueNode = getNodeChildByName(this.asset, "cueNode");
		let gameCueTitleNode = getNodeChildByName(this.cueNode, "cueTitleNode");
		for(let i = 0; i < 2; i++) {
			this.gameCueTitle[i] = getNodeChildByName(gameCueTitleNode, `cueTitle${i+1}`, CLanguage);
			this.gameCueTitle[i].node.on(cc.Node.EventType.TOUCH_END, () => {
				this.setGameCue(i);
			}, this);
		}
		let btnTujian = getNodeChildByName(this.cueNode,"btn_TuJian");
		this.cueTip = getNodeChildByName(this.cueNode, "cueTip");
		btnTujian.on(cc.Node.EventType.TOUCH_END, () => {
			console.log("图鉴--即所有球杆");
		}, this);
		this.cueScroll = getNodeChildByName(this.cueNode,"cueScrollView");
		this.cueScroll.on('scrolling', this.onScrollingEvent, this);
		this.cueContentNode = getNodeChildByName(this.cueNode,"cueScrollView/view/content");
		this.player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		this.initCuePool();
		this.addGoodsNode();
	}

	protected addEvents() {
		addEvent(this,LobbyEvent.Server_BuyCue,this.onServerBuyCue);
		addEvent(this,LobbyEvent.Server_MyCue,this.onServerMyCue);
	}

	//初始化球杆对象池
	private initCuePool()
	{
		this.cuePool = new cc.NodePool();
		for(let i = 0; i < 10; i++){
			let cueNode = StoreManager.NewPrefabNode(Assets.GetPrefab("LobbyScene/LobbyCue/LobbyCueItem"));
			this.cuePool.put(cueNode);
		}
	}

	//获取任务对象
	private getCueNode():cc.Node
	{
		let enemy = null;
		if (this.cuePool.size() > 0) {
			enemy = this.cuePool.get();
		} else {
			enemy = StoreManager.NewPrefabNode(Assets.GetPrefab("LobbyScene/LobbyCue/LobbyCueItem"));
		}
		return enemy;
	}

	//回收任务对象
	private cueKilled(cueNode,idx)
	{
		this.lobbyCueItems[idx] && this.lobbyCueItems[idx].initCueInfo();
		this.cuePool.put(cueNode);
	}

	//清空列表
	private clearCueContent()
	{
		let idx = 0;
		while(this.cueContentNode.childrenCount > 0) {
			let n = this.cueContentNode.children[0];
			this.cueKilled(n, idx);
			idx++;
		}
	}
	
	//添加物品节点
	private addGoodsNode() {
		let goodsNode = StoreManager.NewPrefabNode(Assets.GetPrefab("LobbyScene/Navigation/GoodsNode")); 
		if(goodsNode.name != "goodsNode") { // 重新手引导切入大厅容易出现 获得的goodsNode为 popWindow的情况
			goodsNode = StoreManager.NewPrefabNode(Assets.GetPrefab("LobbyScene/Navigation/GoodsNode"));
		}
		getNodeChildByName(this.asset,"LobbyNavigation").addChild(goodsNode);
		let goodsNodeInfo = this.addObject(new LobbyGoodsNodeBinder());
		goodsNodeInfo.bindView(goodsNode);
	}

	//设置游戏球杆
	public setGameCue(index) {
		if (this.gameCueTitleIndex == index) return;
		this.gameCueTitleIndex = index;
		let cueNameList = ["btn_WoDeQiuGan0", "btn_GouMaiQiuGan0"];
		for(let i = 0; i < 2; i++) {
			this.gameCueTitle[i].key = cueNameList[i] + (index == i ? 1 : 2);
		}
		
		if (index == 0) 
			this.sendMyCue();
		else
			this.onServerAllCue();
	}

	//打开球杆详情
	private openCueInfo(index) {
		this.cueNode.active = false;
		this.gameCueLayerIndex++;
		// ResourceManager.LoadSpriteFrame(`Lobby/LobbyCue/LobbyCue?:img_QiuGanXiangQing`,this.cueTitleImg);
		this.cueTitleImg.key = "img_QiuGanXiangQing";
		if (!this.lobbyCueInfoNode) {
			let cueInfoNode = StoreManager.NewPrefabNode(Assets.GetPrefab("LobbyScene/LobbyCue/LobbyCueInfo"));
			this.asset.addChild(cueInfoNode);
			this.lobbyCueInfo = this.addObject(new LobbyCueInfoBinder());
			this.lobbyCueInfo.bindView(cueInfoNode);
			this.lobbyCueInfoNode = cueInfoNode;
		}
		else
			this.lobbyCueInfoNode.active = true;
		if(this.gameCueTitleIndex == 0)
			this.lobbyCueInfo.updateCueInfo(this.playerCue.myCues[index]);
		else {
			let myCuesIndex = this.playerCue.getIsMyHasCue(this.playerCue.allCues[index].cueID);
			let cues = myCuesIndex > -1 ? this.playerCue.myCues[myCuesIndex] : this.playerCue.allCues[index];
			this.lobbyCueInfo.updateCueInfo(cues);
		}
	}

	private onScrollingEvent() {
		var viewRect = cc.rect(- this.cueScroll.width / 2, - this.cueContentNode.y - this.cueScroll.height, this.cueScroll.width, this.cueScroll.height);
        for (let i = 0; i < this.cueContentNode.children.length; i++) {
            const node = this.cueContentNode.children[i];
            if (viewRect.intersects(node.getBoundingBox())) {
                node.opacity = 255;
            }
            else {
                node.opacity = 0;
            }
        }
	}

	//返回
	private onBackClickEvent() {
		if (this.gameCueLayerIndex > 0){
			this.gameCueLayerIndex--;
			this.cueNode.active = true;
			this.lobbyCueInfoNode.active = false;
			// ResourceManager.LoadSpriteFrame(`Lobby/LobbyCue/LobbyCue?:img_QiuGan`,this.cueTitleImg);
			this.cueTitleImg.key = "img_QiuGan";
			this.lobbyCueInfo.stopAcion(); // 关闭界面时停止按钮动作
		} 
		else 
			dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.Lobby_CueInfo, null, GameLayer.UI);
	}

	private onServerBuyCue()
	{
		this.sendMyCue();
	}

	private onServerMyCue()
	{
		if(this.gameCueTitleIndex == 1) {
			this.onServerAllCue();
			return;
		}
		for(let i = 0; i < this.cueTimeOut.length; i++)
			clearTimeout(this.cueTimeOut[i]);
		this.cueTimeOut = [];
		this.playerCue = GameDataManager.GetDictData(GameDataKey.PlayerCue,PlayerCueVO);
		this.clearCueContent();
		this.cueTip.active = this.playerCue.myCues.length == 0;
		for(let i = 0; i < this.playerCue.myCues.length; i++) {
			this.cueTimeOut[i] = setTimeout(()=>{
				this.createCue(i, true, this.playerCue.myCues[i]);
			},100*i);
		}
		this.cueScroll.getComponent(cc.ScrollView).scrollToTop();
		this.onScrollingEvent();
	}

	private onServerAllCue()
	{
		this.clearCueContent();
		this.cueTip.active = false;
		for(let i = 0; i < this.cueTimeOut.length; i++)
			clearTimeout(this.cueTimeOut[i]);
		this.cueTimeOut = [];
		for(let i = 0; i < this.playerCue.allCues.length; i++){
			this.cueTimeOut[i] = setTimeout(()=>{
				let myCuesIndex = this.playerCue.getIsMyHasCue(this.playerCue.allCues[i].cueID);
				let cues = myCuesIndex > -1 ? this.playerCue.myCues[myCuesIndex] : this.playerCue.allCues[i];
				this.createCue(i, myCuesIndex > -1, cues);
			},100*i);
		}
		this.cueScroll.getComponent(cc.ScrollView).scrollToTop();
		this.onScrollingEvent();
	}

	/**创建球杆
	 * index 球杆索引
	 * isClick 是否可以点击(打开球杆信息)
	 */
	private createCue(index, isClick, cue) {
		let cueItemNode = this.getCueNode();
		cueItemNode.opacity = 255;
		this.cueContentNode.addChild(cueItemNode);
		this.lobbyCueItems[index] = new LobbyCueItemBinder();
		this.lobbyCueItems[index].bindView(cueItemNode);
		let clickEvent = null;
		if(isClick)
			clickEvent = ()=> this.openCueInfo(index);
		this.lobbyCueItems[index].updateCueItemInfo(cue, !isClick, clickEvent);
	}

	//发送查询自己球杆
    public sendMyCue()
    {
        C_Lobby_MyCue.Send(this.player.id);
	}

	//发送查询所有球杆
    private sendAllCue()
    {
        C_Lobby_AllCue.Send(this.player.id);
	}
}