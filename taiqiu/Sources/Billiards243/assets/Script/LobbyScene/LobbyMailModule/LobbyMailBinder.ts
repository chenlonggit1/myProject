import { FBinder } from "../../../Framework/Core/FBinder";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { CNodePool } from "../../../Framework/Components/CNodePool";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { formatDate } from "../../../Framework/Utility/dx/formatDate";
import { C_Lobby_RewardMail } from "../../Networks/Clients/Mail/C_Lobby_RewardMail";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { CScrollView } from "../../../Framework/Components/CScrollView";
import { ScrollEasy } from "../../../Framework/Components/ScrollEasy";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";

/**
*@description:邮箱
**/
export class LobbyMailBinder extends FBinder 
{
	public static ClassName:string = "LobbyMailBinder";
	
    private btnClose:cc.Node = null;
    private btnGetall:cc.Node = null;
	private sv:CScrollView = null;
    private svTool:ScrollEasy = null;
	private itemPool:CNodePool = null;
	private itemNodeList: {[mailid: number]: cc.Node} = {};
	private mailInfo:any[] = [];
	private mailContent:cc.Node = null;
	private mailBg:cc.Node = null;
	private isOpenMailInfo:boolean = false;
	private mailTip:cc.Node = null;
    
	protected initViews():void 
	{
		super.initViews();

		// 注册按钮点击事件
		this.btnClose = cc.find("button_close", this.asset);
		this.btnClose.on("click", this.onClickClose, this);
		this.btnGetall = cc.find("button_getall", this.asset);
		this.btnGetall.on("click", this.onClicGetall, this);
		this.mailContent = getNodeChildByName(this.asset,"mailContent");
		this.mailBg = getNodeChildByName(this.asset, "mailBg");
		this.mailTip = getNodeChildByName(this.asset,"mailTip");
		// 绑定滑窗
		this.bindSv();
	}

	protected addEvents()
	{
		super.addEvents();
		addEvent(this,LobbyEvent.Server_GetMail,this.updateMail);
		addEvent(this,LobbyEvent.Server_GetReward,this.rewardMail);
	}

	public updateMail(data):void
	{
		this.mailInfo = data.data;
		this.mailTip.active = this.mailInfo.length == 0;
		// 绑定数据
		this.svTool.BindData(this.mailInfo);
		// 初始化滑窗
		this.svTool.InitSv(0);

		this.isOpenMailInfo = false;
		this.sv.node.active = true;
		this.btnGetall.active = true;
		this.mailContent.active = false;
		this.mailBg.height = 585;
	}

	private rewardMail(data)
	{
		//设置领取状态 0为一键领取
		let index = data.data.id;
		for(let i = 0; i < this.mailInfo.length; i++) {
			if(index == 0) {
				this.updateRewardState(this.itemNodeList[this.mailInfo[i].mailId]);
				this.mailInfo[i].mailState = 2;
			}
			else if(this.mailInfo[i].mailId == index) {
				this.updateRewardState(this.itemNodeList[this.mailInfo[i].mailId]);
				this.mailInfo[i].mailState = 2;
			}
		}
		let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        player.rewardMail(this.mailInfo);
		this.svTool.BindData(this.mailInfo);
	}

	public dispose():void
	{
		super.dispose();
	}
	private bindSv()
	{
        // 绑定简易滑窗
		this.sv = getNodeChildByName(this.asset, "scrollview_mail").getComponent(CScrollView);
        this.sv.bindScrollEasy();
		this.svTool = this.sv.scrollEasy;
		// 移除item
		let svItem = cc.find("layout_list/sprite_item", this.sv.content);
        svItem.removeFromParent();
        svItem.active = true;
        // 创建节点池
        let rewardItem = cc.find("layout_content/layout_items/sprite_item", svItem);
        rewardItem.removeFromParent();
        this.itemPool = new CNodePool(rewardItem);
		// 绑定item
		this.svTool.BindItem(svItem, 5, this.setSvItem.bind(this));
	}
	private setSvItem(n: cc.Node, data: any)
    {
		// 过滤
		if (!n || !data) return;
		
		// 绑定节点
		this.itemNodeList[data.mailId] = n;
		n.off("click");
		n.on("click", this.openMailInfo.bind(this, data));
        
        // 设置文本
        let lbtitle = cc.find("layout_content/node_info/label_title", n).getComponent(cc.Label);
        lbtitle.string = data.title;
        // let lbType = cc.find("layout_content/node_info/label_type", n).getComponent(cc.Label);
        // lbType.string = data.content;
        let lbLasttime = cc.find("layout_content/node_info/label_lasttime", n).getComponent(cc.Label);
        lbLasttime.string = formatDate(data.time,"yyyy-mm-dd");;

        // 回收奖品item
        let items = cc.find("layout_content/layout_items", n);
        this.itemPool.PutArr(items.children);

        // 设置items
        for (let i in data.awards)
        {
            let newItem = this.itemPool.Get();
			let sp = cc.find("sprite_icon", newItem).getComponent(cc.Sprite);
			ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${data.awards[i].id}`,sp);
            let lbNum = cc.find("label_num", newItem).getComponent(cc.Label);
            lbNum.string = data.awards[i].num;
            items.addChild(newItem);
        }

		//邮件状态，0-未读，1-已读未领取,2-已读已领取
		// 开关按钮
		let btnGet = cc.find("button_get", n);
		// 注册按钮事件
		btnGet.off("click");
		btnGet.on("click", this.onClickGet.bind(this, data.mailId));
		let complete = cc.find("complete",n);
		complete.active = data.mailState == 2;
		btnGet.active = data.mailState < 2;
		if(data.awards.length == 0) {
			btnGet.active = false;
			complete.active = false;
		}
	}
	
	//更新领取状态
	private updateRewardState(node:cc.Node) {
		if(this.isOpenMailInfo){
			let btnGet = getNodeChildByName(this.mailContent,"button_get");
			let complete = getNodeChildByName(this.mailContent,"complete");
			complete.active = true;
			btnGet.active = false;
		} 
		let btnGet = cc.find("button_get", node);
		let complete = cc.find("complete",node);
		complete.active = true;
		btnGet.active = false;
	}

    private onClickGet(id: number):void
    {
		C_Lobby_RewardMail.Send(id);
    }
	private onClickClose():void
	{
		if(this.isOpenMailInfo) {
			this.isOpenMailInfo = false;
			this.sv.node.active = true;
			this.btnGetall.active = true;
			this.mailContent.active = false;
			this.mailBg.height = 585;
		} else {
			dispatchModuleEvent(ModuleEvent.HIDE_MODULE,ModuleNames.Lobby_Mail);
		}
	}
	private onClicGetall():void
	{
        C_Lobby_RewardMail.Send(0);
	}
	private openMailInfo(data)
	{
		this.isOpenMailInfo = true;
		let title = getNodeChildByName(this.mailContent,"title",cc.Label);
		let content = getNodeChildByName(this.mailContent,"content",cc.Label);
		this.sv.node.active = false;
		this.btnGetall.active = false;
		this.mailContent.active = true;
		this.mailBg.height = 630;
		title.string = data.title;
		content.string = data.content;
		// 回收奖品item
		let items = getNodeChildByName(this.mailContent,"layout_items")
        this.itemPool.PutArr(items.children);
		for (let i in data.awards)
        {
            let newItem = this.itemPool.Get();
			let sp = cc.find("sprite_icon", newItem).getComponent(cc.Sprite);
			ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${data.awards[i].id}`,sp);
            let lbNum = cc.find("label_num", newItem).getComponent(cc.Label);
            lbNum.string = data.awards[i].num;
            items.addChild(newItem);
		}
		let btnGet = getNodeChildByName(this.mailContent,"button_get");
		btnGet.off("click");
		btnGet.on("click", this.onClickGet.bind(this, data.mailId));
		let complete = getNodeChildByName(this.mailContent,"complete");
		complete.active = data.mailState == 2;
		btnGet.active = data.mailState < 2;
		if(data.awards.length == 0) {
			btnGet.active = false;
			complete.active = false;
		}
	}
}