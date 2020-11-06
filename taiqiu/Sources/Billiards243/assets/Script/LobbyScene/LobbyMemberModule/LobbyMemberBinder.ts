import { FBinder } from "../../../Framework/Core/FBinder";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { PlayerVO } from "../../VO/PlayerVO";
import { LobbyMemberInfoBinder } from "./LobbyMemberInfoBinder";
import { CNodePool } from "../../../Framework/Components/CNodePool";
import { MemberConfigVO } from "../../VO/MemberConfigVO";
import { PlayerRoleVO } from "../../VO/PlayerRoleVO";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { GameEvent } from "../../GameEvent";
import { C_Lobby_MemberDailyAward } from "../../Networks/Clients/Member/C_Lobby_MemberDailyAward";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { CLanguage } from "../../../Framework/Components/CLanguage";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { ShopGoodsVo } from "../../VO/ShopGoodsVo";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { getLang } from "../../../Framework/Utility/dx/getLang";

/**
*@description:会员
**/
export class LobbyMemberBinder extends FBinder 
{
	public static ClassName:string = "LobbyMemberBinder";

	private lbTitle:cc.Label = null;
	private progressUpgrade:cc.ProgressBar = null;
	private lbTips:cc.Label = null;
	private lbCurlv:cc.Label = null;
	private lbNextlv:cc.Label = null;
	private spCharacter:cc.Sprite = null;
	private items:cc.Node[] = [];
	private btnClose:cc.Node = null;
	private btnLast:cc.Node = null;
	private btnNext:cc.Node = null;
	private btnRecharge:cc.Node = null;
	private btnDailyReward:CLanguage = null;
	private itembinders:LobbyMemberInfoBinder[] = [];
	private player:PlayerVO = null;
	private config:MemberConfigVO = null;
	private curPageVip:number = 0;
	private curPageIndex:number = 0;
	private pageSpace:number = 20;
	private moveTween:cc.Tween = null;
	private dailyRewardNode:cc.Node = null;
	private pool:CNodePool = null;
	
	protected initViews():void 
	{
		super.initViews();

		// 获取节点/组件
		this.lbTitle = cc.find("sprite_title/layout_title/label_title_num", this.asset).getComponent(cc.Label);
		this.progressUpgrade = cc.find("node_upgrade/sprite_progress_bg/progress_upgrade", this.asset).getComponent(cc.ProgressBar);
		this.lbTips = cc.find("node_upgrade/layout_tips/label_tips", this.asset).getComponent(cc.Label);
		this.lbCurlv = cc.find("node_upgrade/layout_cur/label_num", this.asset).getComponent(cc.Label);
		this.lbNextlv = cc.find("node_upgrade/layout_next/label_num", this.asset).getComponent(cc.Label);
		this.spCharacter = cc.find("sprite_character", this.asset).getComponent(cc.Sprite);
		let maskNode = cc.find("pageview_content/mask_view", this.asset);
		this.items = [].concat(maskNode.children) ;

		this.dailyRewardNode = cc.find("daily_reward",this.asset);

		// 注册按钮点击事件
		this.btnClose = cc.find("button_close", this.asset);
		this.btnClose.on("click", this.onClickClose, this);
		this.btnLast = cc.find("pageview_content/button_last", this.asset);
		this.btnLast.on("click", this.onClickNextPage.bind(this, true));
		this.btnNext = cc.find("pageview_content/button_next", this.asset);
		this.btnNext.on("click", this.onClickNextPage.bind(this, false));
		this.btnRecharge = cc.find("button_recharge", this.asset);
		this.btnRecharge.on("click", this.onClickRecharge, this);
		// this.btnDailyReward = cc.find("btn_dailyReward", this.asset);
		this.btnDailyReward = getNodeChildByName(this.asset,"btn_dailyReward", CLanguage)
		this.btnDailyReward.node.on("click", this.onDailyReward, this);

		// 创建节点池
		let rewardItem = cc.find("layout_reward/sprite_item", this.items[0]);
		rewardItem.removeFromParent();
		let pool = new CNodePool(rewardItem);
		// 绑定item
		for (let i in this.items)
		{
			let b = new LobbyMemberInfoBinder();
			b.bindView(this.items[i]);
			b.bindPool(pool);
			this.itembinders.push(b);
		}
		this.pool = new CNodePool(this.dailyRewardNode.children[0])
		this.dailyRewardNode.children[0].removeFromParent();

		// 获取数据
		this.player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		this.config = GameDataManager.GetDictData(GameDataKey.MemberConfig,MemberConfigVO);
	}

	protected addEvents()
	{
		super.addEvents();
		addEvent(this,LobbyEvent.Server_GetMemberInfo,this.onSetMember);
		addEvent(this,LobbyEvent.Server_UpdateDailyReward,this.onSetMember);
	}
	public update():void
	{
		this.onSetMember();
		this.updateCharacter();
		this.setDailyReward();
		this.addDailyReward();
	}
	//设置VIP
	private onSetMember()
	{
		let myLevel = this.config.getMyVipLevel();
		this.updateTitle(myLevel);
		let nextPoint = this.config.getNextVipPoint(myLevel);
		let residue = nextPoint - this.config.memberPoint;
		if(residue <= 0) residue = 0;
		this.updateUpgradeInfo(residue,myLevel+1,myLevel,myLevel+1,this.config.memberPoint / nextPoint)
		this.updateContent(myLevel);
		this.setDailyReward();
		this.addDailyReward();
	}
	
	public updateTitle(num: number):void
	{
		this.lbTitle.string = num.toString();
	}
	public updateUpgradeInfo(tips1: number, tips2: number, cur: number, next: number, pross: number):void
	{
		if(tips2 == this.config.memberConfigs.length) {
			this.lbTips.string = getLang("Text_sjqg");
			this.lbNextlv.string = cur.toString();
		}else{
			this.lbTips.string = `${getLang("Text_vipTip",[tips1,tips2])}`;
			this.lbNextlv.string = next.toString();
		}
		this.lbCurlv.string = cur.toString();
		this.progressUpgrade.progress = pross;
	}
	public updateContent(id: number):void
	{
		this.curPageVip = id;
		let cfg = this.config.memberConfigs[id];
		this.itembinders[0].update(cfg);
		this.curPageIndex = 0;

		// 整理位置
		this.items[0].position = cc.v3(0);
		this.items[1].position = cc.v3(this.items[0].width + this.pageSpace);
	}
	public updateCharacter():void
	{
		let playerRole: PlayerRoleVO = GameDataManager.GetDictData(GameDataKey.PlayerRole,PlayerRoleVO);
		let isMan = false;
		isMan = parseInt((playerRole.getMyRole().roleId / 1000).toString()) == 1 ? false : true;
		ResourceManager.LoadSpriteFrame(`Lobby/LobbyRole/LobbyRole?:${isMan?"img_Nan":"img_Nv"}`,this.spCharacter);
	}
	public dispose():void
	{
		super.dispose();
	}
	private onClickClose():void
	{
		dispatchModuleEvent(ModuleEvent.HIDE_MODULE,ModuleNames.Lobby_Member);
	}
	private onClickRecharge():void
	{
		let shopVO: ShopGoodsVo = GameDataManager.GetDictData(GameDataKey.ShopGoods, ShopGoodsVo);
		shopVO.shopPage = 1;
		dispatchFEventWith(LobbyEvent.Open_LobbyShop);
		this.onClickClose();
	}

	private setDailyReward():void
	{
		this.btnDailyReward.node.getComponent(cc.Button).interactable = this.config.dayGift != 1;
		this.btnDailyReward.key = this.config.dayGift != 1 ? "btn_LingQu" : "yilingqu";
		// ResourceManager.LoadSpriteFrame(`Lobby/LobbyMember/LobbyMember?:${name}`,this.btnDailyReward.getComponent(cc.Sprite)); 
	}
	private addDailyReward():void
	{
		let myLevel = this.config.getMyVipLevel();
		let info = this.config.memberConfigs[myLevel].dayRewards;
		this.pool.PutArr(this.dailyRewardNode.children);
        // 添加节点
		for (let id in info)
        {
            let item = this.pool.Get();
            // 设置纹理
            let sp = item.getChildByName("sprite_icon").getComponent(cc.Sprite);
            ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${id}`,sp);
            // 设置数量
            item.getChildByName("label_num").getComponent(cc.Label).string = info[id].toString();
            // 添加
            this.dailyRewardNode.addChild(item);
		}
		this.btnDailyReward.node.active = Object.keys(info).length > 0;
	}
	private onDailyReward():void
	{
		let myLevel = this.config.getMyVipLevel();
		C_Lobby_MemberDailyAward.Send(myLevel);
	}
	private onClickNextPage(isLeft: boolean):void
	{
		// 过滤
		if (this.moveTween) return;

		let script = this;
		let width = this.items[0].width;
		let list: LobbyMemberInfoBinder[] = [];
		if (isLeft) list = this.curPageIndex == 0 ? [].concat(this.itembinders).reverse() : [].concat(this.itembinders);
		else list = this.curPageIndex == 0 ? [].concat(this.itembinders) : [].concat(this.itembinders).reverse();

		// 获取下页数据
		let nextVip = -1;
		if(isLeft && this.curPageVip > 0)
			nextVip = this.curPageVip - 1;
		else if(!isLeft && this.curPageVip < this.config.memberConfigs.length - 1)
			nextVip = this.curPageVip + 1;
		let nextCfg = this.config.memberConfigs[nextVip];
		this.curPageVip = nextVip != -1 ? nextVip : this.curPageVip;
		if (!nextCfg) return;
		// 设置页面
		let pageBinder = isLeft ? list[0] : list[1];
		pageBinder.update(nextCfg);

		// 构造数据
		let data = 
		{
			_x:0,
			get x() {
				return this._x;
			},
			set x(x) {
				this._x = x;
				if (isLeft) [list[0].asset.x,list[1].asset.x] = [this._x-(width+script.pageSpace),this._x];
				else [list[0].asset.x,list[1].asset.x] = [-this._x,-this._x+(width+script.pageSpace)];
			}
		};
		// 构造动画
		this.moveTween = cc.tween(data)
							.call(() => {
								if (isLeft) [list[0].asset.x,list[1].asset.x] = [-(width+this.pageSpace),0];
								else [list[0].asset.x,list[1].asset.x] = [0,(width+this.pageSpace)];
							})
							.to(0.3,{x:width+this.pageSpace})
							.call(() => {
								this.curPageIndex = this.curPageIndex == 1 ? 0 : 1;
								this.moveTween = null;
							})
							.start();
	}
}