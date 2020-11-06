import { FBinder } from "../../../Framework/Core/FBinder";
import { S2C_AliInfo, IAliInfo } from "../../Networks/Protobuf/billiard_pb";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { LanguageManager } from "../../../Framework/Managers/LanguageManager";
import { C_Pay_TurnRedPack } from "../../Networks/Clients/Pay/C_Pay_TurnRedPack";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { GoodsItemVO } from "../../VO/GoodsItemVO";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { PayEvent } from "../../Common/PayEvent";
import { FEvent } from "../../../Framework/Events/FEvent";
import { showPopup } from "../../Common/showPopup";
import { PopupType } from "../../PopupType";
import { GetErrInfo } from "../GetErrInfo";
import { ConfigVO } from "../../VO/ConfigVO";

/**
*@description:支付宝红包兑换界面
**/
export class Pay_RedPackageZFBBinder extends FBinder 
{
	public static ClassName:string = "Pay_RedPackageZFBBinder";
	private t_xing: cc.EditBox;
	private t_ming: cc.EditBox;
	private zfbAuthor: cc.EditBox;
	private Ok_btn: cc.Button;
	private btn_MoreAuthor: cc.Button;
	public xiaLaLayer: cc.Node;
	private lblItem: cc.Node;
	private dot: string = '·'; 
	private data: IAliInfo[] = [];
	private itemPool: cc.NodePool = new cc.NodePool;
	private videBtn: cc.Node;
	private videCom: cc.VideoPlayer;
	private videLayer: cc.Node;
	
	protected initViews():void
	{
		super.initViews();

		this.t_xing = getNodeChildByName(this.asset, "t_name/xing", cc.EditBox);
		this.t_ming = getNodeChildByName(this.asset, "t_name/ming", cc.EditBox);
		this.zfbAuthor = getNodeChildByName(this.asset, "t_zhengjian/author", cc.EditBox);
		this.Ok_btn = getNodeChildByName(this.asset, "sure", cc.Button);
		this.btn_MoreAuthor = getNodeChildByName(this.asset, "btn_more", cc.Button);
		this.xiaLaLayer = getNodeChildByName(this.asset, "xiaLaLayer");
		this.lblItem = getNodeChildByName(this.asset, "lblItem");
		this.videBtn = getNodeChildByName(this.asset, "video");
		this.videLayer = getNodeChildByName(this.asset, "videoLayer");
		this.videCom = getNodeChildByName(this.videLayer, "videoplayer", cc.VideoPlayer);

		// this.videCom = this.videCom["_components"][0];
		
		

		this.Ok_btn.node.on(cc.Node.EventType.TOUCH_END, this.onSure, this);
		this.btn_MoreAuthor.node.on(cc.Node.EventType.TOUCH_END, this.onClickMore, this);
		this.videBtn.on(cc.Node.EventType.TOUCH_END, this.onOpenVideo, this)
		let close = getNodeChildByName(this.asset, "close");
		this.videLayer.children[2].on(cc.Node.EventType.TOUCH_END, ()=> {
			this.closeVideo();
		})
		this.videLayer.active = false;
		// cc.log("======READY_TO_PLAY: " + cc.VideoPlayer.EventType.READY_TO_PLAY );
		// this.videCom.node.on(cc.VideoPlayer.EventType.READY_TO_PLAY + "", this.playVideo);
		// this.player.node.on('meta-loaded', this.meta_loaded, this);
		if(this.videCom) {
			this.videCom.node.on("ready-to-play", this.ready_to_play, this);
			this.videCom.node.on("meta-loaded", this.meta_loaded, this);
			this.videCom.node.on("playing", ()=> {
				console.log("+=============开始视频")
			})
			this.videCom.node.on("paused", ()=> {
				console.log("+=============视频暂停")
			});
			this.videCom.node.on("stopped", ()=>{
				console.log("+=============视频停止")
			});
	
			this.videCom.node.on("completed", ()=>{
				console.log("+=============视频完成")
			});
		}
		
		// this.videCom.resourceType = cc.VideoPlayer.ResourceType.REMOTE;
				// this.player.node.on('completed', this.completed, this);

		close.on(cc.Node.EventType.TOUCH_END,  this.onClose, this);
		this.videBtn.active = false;

		this.initPool();
	}

	protected addEvents () {
		addEvent(this, PayEvent.Pay_AliInfo, this.onPayAliInfo);
		// this.videCom
	}




	// 设置账户细腻
	public setAliInfo(name:string, aliAccount: string) {
		if(!name || !aliAccount) {
			cc.error("===setAliInfo===信息不完整");
			return;
		}
		let nameArr = name.split(this.dot);
		if(nameArr.length > 1) { // 维文
			this.t_ming.string = nameArr[0];
			this.t_xing.string = nameArr[1];
		} else {
			this.t_xing.string = name;
		}
		this.zfbAuthor.string = aliAccount + ""; 
	}
	
	// 保存数据
	private setData(data: S2C_AliInfo) {
		this.data = data.aliInfo;
	}

	// 设置下拉框数据显示
	private setAuthorInfo() {
		this.clearItems();
		this.data.forEach(data=> {
			let node = this.itemPool.get();
			this.xiaLaLayer.addChild(node);
			let lbl = node.children[1].getComponent(cc.Label)
			lbl && (lbl.string = data.aliAccount + "");
			
		})

		let len = this.data.length;
		for(let i = 0; i < len; i++) {
			let node = this.xiaLaLayer.children[i];
			node.active = true;
			node.x = 0;
			node.on(cc.Node.EventType.TOUCH_END, this.onClickItem, this);
		}
		
	}

	private onSure () {
		let nameStr = "";
		let AliInfo = this.zfbAuthor.string;
		let xingStr = this.t_xing.string;
		let mingStr = this.t_ming.string;
		if(xingStr && mingStr) { // 维语名字
			nameStr = mingStr + this.dot + xingStr;
		} else {
			if( !xingStr) {
				cc.error("======名字不完整");
				showPopup(PopupType.TOAST, {msg: GetErrInfo(2001)})
				return;
			}
			nameStr = xingStr;
		}
		
		if(AliInfo.length < 1) {
			cc.error("======支付宝账号不完整");
			showPopup(PopupType.TOAST, {msg: GetErrInfo(1015)});
			return;
		}
		let data: GoodsItemVO = GameDataManager.GetDictData(GameDataKey.CurSelectItem);
		if(!data) {
			cc.error("===========没有商品");
			return;
		} 
		C_Pay_TurnRedPack.Send(data.goodsId, AliInfo, nameStr);
	}

	// 下拉按钮 
	private onClickMore() {
		this.xiaLaLayer.active = !this.xiaLaLayer.active;
		if(this.xiaLaLayer.active) { // 打开下拉
			this.setAuthorInfo();
		}
	}

	private onClickItem (event: cc.Event.EventTouch) {
		let node:cc.Node = event.target;
		let idx = this.xiaLaLayer.children.indexOf(node);
		this.setRemenberByIdx(idx);
	}

	private setRemenberByIdx(idx: number) {
		if(idx > -1 && this.data.length > 0) {
			let name = this.data[idx].aliName;
			let aliAccount = this.data[idx].aliAccount
			this.setAliInfo(name, aliAccount);
			if(this.xiaLaLayer.childrenCount ) {
				this.resetAllItem();
				this.selectItem(this.xiaLaLayer.children[idx]);
			}

		}
	}

	// 获取阿里存储信息通知
	private onPayAliInfo(event: FEvent) {
		let data:S2C_AliInfo = event.data;
		this.setData(data);
		this.setRemenberByIdx(0);

	}

	private initPool() {
		for(let i = 0; i < 5; i++) {
			let item = cc.instantiate(this.lblItem);
			this.itemPool.put(item);
		}
	}

	private clearItems() {
		while(this.xiaLaLayer.children.length > 0) {
			let item = this.xiaLaLayer.children[0];
			this.resetItem(item);
			this.itemPool.put(item);
		}
	}

	private resetAllItem() {
		this.xiaLaLayer.children.forEach(node=> {
			this.resetItem(node);
		})
	}

	// 恢复某个选中文字
	private resetItem(node: cc.Node) {
		node.children[0].active = false;
		node.children[1].color = this.asset.color.fromHEX("#625e70");
	}

	// 选中文职
	private selectItem(node: cc.Node) {
		node.children[0].active = true;
		node.children[1].color = this.asset.color.fromHEX("#ffffff");
	}

	private onClose() {
		this.zfbAuthor.string = "";
		this.t_xing.string = "";
		this.t_ming.string = "";
		dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.Pay_RedPackZFB);
	}

	private onOpenVideo() {
		if(!this.videCom) {
			return
		}
		let config: ConfigVO = GameDataManager.GetDictData(GameDataKey.Config, ConfigVO);
		this.videLayer.active = true;
		this.videCom.resourceType = cc.VideoPlayer.ResourceType.REMOTE;
		this.videCom.remoteURL = config.aliVideoUrl;
		this.videCom.currentTime = 0;
		// this.videCom.schedule(()=> {
		// 	if(this.videCom.isPlaying()){
		// 		this.videCom.unscheduleAllCallbacks();
		// 	} else {
		// 		this.videCom.play();
		// 	}
		// }, 3);
		
	}

	private closeVideo() {
		if(this.videCom) {
			this.videCom.stop();
			this.videCom.remoteURL = "";
		}
		this.videLayer.active = false;
	}
	
	private ready_to_play() {
		console.log("=======视频准备完毕====");
		this.videCom.play();
	}
	private meta_loaded() {
		console.log("=======视频资源加载完毕====");
	}
	
	
}