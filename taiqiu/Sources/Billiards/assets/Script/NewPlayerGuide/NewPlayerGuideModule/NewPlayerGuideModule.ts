import { Assets } from "../../../Framework/Core/Assets";
import { FFunction } from "../../../Framework/Core/FFunction";
import { FModule } from "../../../Framework/Core/FModule";
import { GameLayer } from "../../../Framework/Enums/GameLayer";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { SceneEvent } from "../../../Framework/Events/SceneEvent";
import { LanguageManager } from "../../../Framework/Managers/LanguageManager";
import { ModuleManager } from "../../../Framework/Managers/ModuleManager";
import { StoreManager } from "../../../Framework/Managers/StoreManager";
import { configure } from "../../../Framework/Plugins/Protobuf";
import { JTimer } from "../../../Framework/Timers/JTimer";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { dispatchFEvent } from "../../../Framework/Utility/dx/dispatchFEvent";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { Fun } from "../../../Framework/Utility/dx/Fun";
import { getCamera } from "../../../Framework/Utility/dx/getCamera";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { PointUtility } from "../../../Framework/Utility/PointUtility";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { showPopup } from "../../Common/showPopup";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { GameEvent } from "../../GameEvent";
import { GameBallCueBinder } from "../../GameScene/GameBallCueModule/GameBallCueBinder";
import { GameBallCueModule } from "../../GameScene/GameBallCueModule/GameBallCueModule";
import { GameFreeKickBinder } from "../../GameScene/GameFreeKickModule/GameFreeKickBinder";
import { GameLotteryBinder } from "../../GameScene/GameLottery/GameLotteryBinder";
import { GameLotteryItemBinder } from "../../GameScene/GameLottery/GameLotteryItemBinder";
import { GameOptionBinder } from "../../GameScene/GameOptionModule/GameOptionBinder";
import { GameOptionModule } from "../../GameScene/GameOptionModule/GameOptionModule";
import { GamePlayerInfoBinder } from "../../GameScene/GameTopInfoModule/GamePlayerInfoBinder";
import { GameTopInfoModule } from "../../GameScene/GameTopInfoModule/GameTopInfoModule";
import { GuideEvent } from "../../GuideEvent";
import { LobbyBottomBarModule } from "../../LobbyScene/BottomBarModule/LobbyBottomBarModule";
import { LobbyActivityBinder } from "../../LobbyScene/LobbyActivityModule/LobbyActivityBinder";
import { LobbyCueBinder } from "../../LobbyScene/LobbyCueModule/LobbyCueBinder";
import { LobbyCueInfoBinder } from "../../LobbyScene/LobbyCueModule/LobbyCueInfoBinder";
import { GoodsId } from "../../LobbyScene/PayModeModule/PayDefine";
import { ModuleNames } from "../../ModuleNames";
import { C_Game_QuitGame } from "../../Networks/Clients/C_Game_QuitGame";
import { C_NewGuide_Lottery } from "../../Networks/Clients/Lottery/C_NewGuide_Lottery";
import { S2C_AllItem, S2C_Award } from "../../Networks/Protobuf/billiard_pb";
import { NewGuideConfig } from "../../NewGuideConfig";
import { PopupType } from "../../PopupType";
import { SceneNames } from "../../SceneNames";
import { NewPlayerVO } from "../../VO/NewPlayerVO";
import { PlayerCueVO } from "../../VO/PlayerCueVO";
import { PlayerVO } from "../../VO/PlayerVO";
import { RoomMatchVO } from "../../VO/RoomMatchVO";
import { TableVO } from "../../VO/TableVO";
import { GuidehanderBinder } from "../GuidehanderBinder";
import { NewPlayerGuideBinder } from "./NewPlayerGuideBinder";



/**
*@description:新手引导模块
**/
export class NewPlayerGuideModule extends FModule {
	public static ClassName: string = "NewPlayerGuideModule";
	public get assets(): any[] { return ["NewPlayerGuide/NewPlayerGuide"] };
	private hookNames: any[] = [];
	public curScene: cc.Scene = null;
	private mask: cc.Node = null;
	private hander: GuidehanderBinder = null;
	private moduleMap: Map<string, cc.Node> = new Map();
	private FunceMap: Map<string, Function> = new Map();
	private uiLayer: cc.Node;
	private contentLayer: cc.Node;
	private isFirst: boolean = true;
	finishedStepCallBack = null;;
	private node_assitLine: cc.Node;
	private node_content: cc.Node;
	private lbl_content: cc.Label;
	private wallLayer: cc.Node;
	private config = null;
	private guideVO: NewPlayerVO;
	private isShowGuide: boolean;
	private AssitLine: cc.Graphics;

	public constructor() {
		super();
		this.isNeedPreload = false;// 默认不需要预加载资源，只有使用了Mediator管理模块时才起作用
		this.isReleaseAsset = true;// true:销毁模块时释放资源   false:销毁模块时不释放资源
		this.delayReleaseAssetTime = 0;// 销毁模块时延时释放资源，单位ms
	}
	protected createViews(): void {
		super.createViews();
		this.binder = new NewPlayerGuideBinder();
		this.guideVO = GameDataManager.GetDictData(GameDataKey.NewPlayerGuide);
		console.log("新手引导 createViews ",this.guideVO._curGuideeIdx);

		// 将显示层级置为最高
		this.node.parent = null;
		this.curScene = cc.director.getScene();
		this.curScene.addChild(this.node);
		this.node.x = cc.winSize.width / 2;
		this.node.y = cc.winSize.height / 2;


		// 初始画辅助线
		this.node_assitLine = getNodeChildByName(this.node, "line");
		// this.AssitLine = this.node_assitLine.getComponent(cc.Graphics)

		this.mask = getNodeChildByName(this.node, "mask");
		this.mask.active = false;
		this.node_content = getNodeChildByName(this.node, "kuang");
		this.lbl_content = getNodeChildByName(this.node_content, "content", cc.Label);
		this.wallLayer = getNodeChildByName(this.node, "wallLayer");
		this.node_content.active = false;
		this.node_content.zIndex = 150;
		this.wallLayer.zIndex = 200;
		let roomVo: RoomMatchVO = GameDataManager.GetDictData(GameDataKey.RoomMatch, RoomMatchVO);
		let newPlayer: NewPlayerVO = GameDataManager.GetDictData(GameDataKey.NewPlayerGuide, NewPlayerVO);
		
		if(!this.node.isValid) {
			return;
		}


		if (this.curScene.name == "GameTrainScene") { // 训练场
			if(!newPlayer.isNeedTrain) {
				return;
			}
			roomVo.moneyId = newPlayer.moneyId;
			roomVo.changId = newPlayer.changId;
			roomVo.gameId = newPlayer.gameId;

			var self = this;
			// this.FunceMap[GameFreeKickBinder.name] = GameFreeKickBinder.prototype["onFreeKickBallTouchEvent"];
			// GameFreeKickBinder.prototype["onFreeKickBallTouchEvent"] = 
			this.hook(GameFreeKickBinder, "onFreeKickBallTouchEvent", function (evt) {
				let goOn = self.onFreeKickBallTouchEvent(evt, this);
				goOn && self.FunceMap[GameFreeKickBinder.ClassName].call(this, evt);
			});
			this.hook(GameLotteryBinder, "setLottery", function () {
				for (let i = 0; i < 10; i++) {
					let lotteryItemNode = StoreManager.NewPrefabNode(Assets.GetPrefab("GameScene/GameLottery/LotteryItem"));
					this.lotteryContent.addChild(lotteryItemNode);
					this.lotteryItems[i] = this.addObject(new GameLotteryItemBinder());
					this.lotteryItems[i].bindView(lotteryItemNode);
					lotteryItemNode.setScale(0.8);
					this.lotteryItems[i].setLotteryIndex(i, () => {
						C_NewGuide_Lottery.Send(1011);
						this.closeLotteryClick();
						self.unHook(GameLotteryBinder, "setLottery");
					});
				}
			}, false);
			let uiLayer: cc.Node = getNodeChildByName(this.curScene, "Canvas/UI");
			uiLayer.on(cc.Node.EventType.CHILD_ADDED, this.onAddChild, this);
			this.uiLayer = uiLayer;
		} else if (this.curScene.name == "LobbyScene") { // 大厅引导
			if(!newPlayer.isNeedGan && !newPlayer.isNeedGanUp) {
				return;
			}
			let uiLayer: cc.Node = getNodeChildByName(this.curScene, "Canvas/Content");
			this.uiLayer = uiLayer;
			if (this.guideVO.gan_whIdx == 101 || this.guideVO.gan_upradeIdx == 102) {
				uiLayer.on(cc.Node.EventType.CHILD_ADDED, this.onAddChild, this);
			}
			

			this.CueNewGuide();

		}
	}


	

	closeModule() {
		this.reset();
		this.dispose();
	}

	getNeedDefendCue() {
		var palyerCue: PlayerCueVO = GameDataManager.GetDictData(GameDataKey.PlayerCue, PlayerCueVO);
	    for(let i =0; i < palyerCue.myCues.length; i++) {
			if(palyerCue.myCues[i].isNeedDefend()){
				return palyerCue.myCues[i];
			}
		} 
	}

	// 球杆 维护升级 软引导
	private CueNewGuide() {
		var self = this;
		// 设置 测试
		var player: PlayerVO = GameDataManager.GetDictData(GameDataKey.Player, PlayerVO);
		var palyerCue: PlayerCueVO = GameDataManager.GetDictData(GameDataKey.PlayerCue, PlayerCueVO);


		setTimeout(() => {
			let cue = this.getNeedDefendCue();
			let upQuan = player.itemList.filter(item => {
				return item["id"] == GoodsId.Advcard;
			})
			if (cue && cue.isNeedDefend && this.guideVO.gan_whIdx == 101) {
				this.config = NewGuideConfig.config[this.guideVO.gan_whIdx];
			} else if (upQuan && upQuan[0]["num"] && this.guideVO.gan_upradeIdx == 201) {
				this.config = NewGuideConfig.config[this.guideVO.gan_upradeIdx];
			} else {
				this.config = null;
			}
		}, 500);


		// 球杆自己界面加载时
		this.hook(LobbyCueBinder, "setGameCue", function (index) {
			self.FunceMap[LobbyCueBinder.ClassName] && self.FunceMap[LobbyCueBinder.ClassName].call(this, index);
			// self.finishedStepCallBack && self.finishedStepCallBack(this);
			if (self.guideVO.gan_whIdx != 102 && self.guideVO.gan_upradeIdx != 202) {
				return;
			}
			if (index != 1) { // 自己
				setTimeout(() => {
					self.hander.active = true;
					let cue = this.cueContentNode.children[0];
					if (cue) {
						self.hadPosByNode(cue, () => {
							if (self.guideVO.gan_whIdx == 102) {
								self.guideVO.gan_whIdx = 103;
							} else if (self.guideVO.gan_upradeIdx == 202) {
								self.guideVO.gan_upradeIdx = 203;
							}
						})
					}
				}, 300);
			} else {
				self.hander.active = false;
			}
		})

		// 球杆详情 更新数据函数
		this.hook(LobbyCueInfoBinder, "updateCueInfo", function (data) {
			self.FunceMap[LobbyCueInfoBinder.ClassName] && self.FunceMap[LobbyCueInfoBinder.ClassName].call(this, data);
			let node: cc.Node = this.asset;
			// 点击引导后回调
			let func = function () {
				if (self.guideVO.gan_whIdx % 100 == 3) {
					self.guideVO.gan_whIdx = 104;
				} else if (self.guideVO.gan_upradeIdx % 100 == 3) {
					self.guideVO.gan_upradeIdx = 204;
				}
				self.guideVO.sysnServer();
				if(self.guideVO.gan_whIdx % 100 > 3 && self.guideVO.gan_upradeIdx % 100 > 3){
					// self.reset();
					self.closeModule();
				}
			}

			let btnFUnc = function () {
				self.hander.active = false;
			}

			// 获取返回按钮 注册点击监听关闭 
			let retNode = getNodeChildByName(node.parent, "btn_back");
			retNode && retNode.off("click");
			retNode && retNode.on("click", btnFUnc)

			setTimeout(() => {
				if (self.guideVO.gan_whIdx % 100 == 3) {
					self.hander.active = true;
					let config = NewGuideConfig.config[103];
					let desNode = getNodeChildByName(node, config.hand);
					self.hadPosByNode(desNode, func, cc.Node.EventType.TOUCH_END)

				} else if (self.guideVO.gan_upradeIdx % 100 == 3) {
					self.hander.active = true;
					let config = NewGuideConfig.config[203];
					let desNode = getNodeChildByName(node, config.hand);
					self.hadPosByNode(desNode, func, cc.Node.EventType.TOUCH_END)
				}
			}, 300);

		})

		addEvent(this, ModuleEvent.SHOW_MODULE, (evt: ModuleEvent) => {
			if (evt.moduleName == ModuleNames.Lobby_CueInfo) {

			}

		});


		var addIdx = () => {
			this.config = NewGuideConfig.config[this.config.index];
			if (this.config.race == 2) {
				this.guideVO.gan_whIdx = this.guideVO.gan_whIdx + 1;
			} else if (this.config.race == 3) {
				this.guideVO.gan_upradeIdx = this.guideVO.gan_upradeIdx + 1;
			}

		}

		addEvent(this, ModuleEvent.HIDE_MODULE, (evt: ModuleEvent) => {
			this.hander.active = false;
			if (evt.moduleName == ModuleNames.Lobby_Activity) { // 活动关闭 引导打开球杆
				var newGuide: NewPlayerVO = GameDataManager.GetDictData(GameDataKey.NewPlayerGuide);
				if (!this.config) return;
				if (this.guideVO.gan_whIdx != 101 && this.guideVO.gan_upradeIdx != 201) {
					return;
				}

				var module = ModuleManager.GetModule(ModuleNames.Lobby_BottomBar) as any;

				this.hadPosByNode(module.binder.btnCue, () => {
					addIdx();
				}, cc.Node.EventType.TOUCH_START, module.binder.btnCue);
			}

			if (evt.moduleName == ModuleNames.Lobby_Task) { // 退出任务检测是否需要新手引导
				let upQuan = player.itemList.filter(item => {
					return item["id"] == GoodsId.Advcard;
				})
				if (upQuan[0]["num"] > 0 && self.guideVO.gan_upradeIdx == 201) {
					var module = ModuleManager.GetModule(ModuleNames.Lobby_BottomBar) as any;
					this.config = NewGuideConfig.config[201];
					this.hadPosByNode(module.binder.btnCue, () => {
						addIdx();
						self.config = null;
					}, cc.Node.EventType.TOUCH_START, module.binder.btnCue);
				}
			}

		});
	}


	protected addEvents() {
		addEvent(this, GameEvent.Server_Game_Settle, this.onSettle);
		addEvent(this, LobbyEvent.Update_LobbyRedPoint, this.updateRedPoint);


	}

	protected showViews(): void {
		super.showViews();
	}
	protected hideViews(): void {
		super.hideViews();
		this.reset();
	}

	protected bindViews() {
		super.bindViews();
		this.hander = new GuidehanderBinder();
		let hander = getNodeChildByName(this.node, "hand");
		this.hander.bindView(hander);
		this.hander.active = false;

	}

	/**
 * 更新红点
 * data.type 1邮件 2任务
 * data.isOpen 是否打开红点
 */
	private updateRedPoint(data) {
		let redPointData = data.data;

		if (redPointData.type == 2) { // 有任务

		} else if (redPointData.type == 3) { // 球杆耐久不足
			// this.guideVO.curGuideeIdx = 100;
			// this.nextStep();
		}
	}

	private onAddChild(node: cc.Node) {
		if (this.uiLayer.childrenCount < 4) {
			return;
		}
		this.uiLayer.children.forEach(node => {
			this.moduleMap[node.name] || (this.moduleMap[node.name] = node);

		})

		if (this.moduleMap["GameFreeKickModule"] && this.isFirst) {
			this.isFirst = false;
			this.nextStep();
		}

		if (this.moduleMap["BottomBarModule"] && this.isFirst) {
			this.isFirst = false;
			this.freeGUide();
		}
	}

	public transPos(node: cc.Node, desNode: cc.Node): cc.Vec3 {
		let nodeWorldPos = node.convertToWorldSpaceAR(cc.v3());
		let desPos = desNode.convertToNodeSpaceAR(nodeWorldPos);
		return desPos;
	}

	public transSceenPos(node: cc.Node, originCameraName: string) {

		let world = node.convertToWorldSpaceAR(cc.v3());
		let camera: cc.Camera = getCamera(originCameraName);
		return camera.getWorldToScreenPoint(world);

	}

	public transSceen2Node(pos, originCameraName: string, node: cc.Node,) {
		let camera: cc.Camera = getCamera(originCameraName);
		let world = camera.getScreenToWorldPoint(pos);
		return node.convertToNodeSpaceAR(world);
	}

	private onSettle() {
		cc.log('===可以抽奖了===')
	}

	nextStep() {
		this.node_content.active = false;
		this.hander.showLightRound = false;
		this.hander.stopAllACtion();
		let newdaata: NewPlayerVO = GameDataManager.GetDictData(GameDataKey.NewPlayerGuide, NewPlayerVO);
		let idx = newdaata.curGuideeIdx + 1;
		newdaata.curGuideeIdx = idx;
		cc.log("新手引导进行下一步", idx);
		let config: any = NewGuideConfig.config[idx];
		this.config = config;
		if (!config) {
			this.reset();
			if (!newdaata.isNeedGuide) {
				dispatchModuleEvent(ModuleEvent.HIDE_MODULE, GuideEvent.newPlayerModule);
				this.dispose();
			}
			cc.error("引导结束===");
			return;
		}
		setTimeout(() => {
			if (this[config.module]) {
				this[config.module]();
			} else {
				cc.error("没有此引导", config.module);
			}
		}, 100);
		// 判断是否有文本
		this.node_content.active = !!config.isShowTip;
		if (config.content) {
			if(LanguageManager.CurrentIndex) {
				this.lbl_content.string = config.content_w;
			} else{ // 中文
				this.lbl_content.string = config.content;
			}
		}

		this.handPos(config, this.nextStep.bind(this))

		this.guideVO && this.guideVO.sysnServer();


	}

	// 手指定位
	handPos(config, clickFunc) {
		// 手指位置判定
		let tmpNode: cc.Node = null;
		let psNode: cc.Node = null;
		if (config.hand) {
			let node: cc.Node = this.moduleMap[config.module];
			if (!node) {
				setTimeout(() => {
					this.handPos(config, clickFunc);
				}, 500);
				return;
			}

			psNode = getNodeChildByName(node, config.hand);
			let pos = this.transPos(psNode, this.node);

			tmpNode = cc.instantiate(psNode);
			this.node.addChild(tmpNode);
			tmpNode.position = pos;


			this.hander.active = true
			this.hander.postion = pos;
			this.hander.ShakeAction();
		}

		// 下一步判定
		if (!this[config.module]) {
			this.hander.showLightRound = true;
			if (config.nextType == 10) { // 点任意处下一步
				let touchFunc = () => {
					this.hander.active = false;
					this.node.off(cc.Node.EventType.TOUCH_END);
					tmpNode && tmpNode.destroy();
					clickFunc && clickFunc();
				};
				tmpNode && tmpNode.on(cc.Node.EventType.TOUCH_END, touchFunc)
				this.node.on(cc.Node.EventType.TOUCH_END, touchFunc)
			} else if (config.nextType == 11) { // 点任指定处下一步
				let touchFunc = (evt) => {
					this.hander.active = false;
					psNode.dispatchEvent(evt);
					tmpNode && tmpNode.destroy();
					clickFunc && clickFunc();
				};
				tmpNode && tmpNode.on(cc.Node.EventType.TOUCH_START, touchFunc);
			}

		}

		this.mask.active = !!config.mask;
	}

	// 手指定位
	hadPosByNode(targetNode: cc.Node, BtnCallBack, event = "click", addNode: cc.Node = null) {
		if(!this.node || !this.node.isValid) {
			this.closeModule();
			return;
		}
		let preNode: cc.Node = getNodeChildByName(this.node, targetNode.name);
		this.hander.active = true
		if (preNode) {
			return;
		}

		let tmpNode: cc.Node = null;
		let psNode: cc.Node = targetNode;
		let pos = this.transPos(psNode, this.node);

		tmpNode = cc.instantiate(psNode);
		this.node.addChild(tmpNode);
		tmpNode.position = pos;
		this.hander.asset.removeFromParent(false);
		if (!addNode) {
			this.node.addChild(this.hander.asset);
			this.hander.postion = pos;
		} else {
			addNode.addChild(this.hander.asset);
			// this.hander.asset.position = cc.v3(cc.v2(0, 0));
			this.hander.asset.x = 0;
			this.hander.asset.y = 0;
			this.hander.hand.x = 0;
			this.hander.hand.y = 0;
		}
		tmpNode.opacity = 0;
		this.hander.ShakeAction();
		let touchFunc = (evt) => {
			psNode.resumeSystemEvents(false);
			BtnCallBack && BtnCallBack();
			this.hander.active = false;
			if (event == "click") {
				psNode.emit(event, evt);
			} else {
				psNode.dispatchEvent(evt);
			}
			tmpNode && tmpNode.destroy();
			
		};
		// tmpNode._touchListener.setSwallowTouches(false);
		psNode.pauseSystemEvents(false);
		tmpNode && tmpNode.on(event, touchFunc);
		this.guideVO.sysnServer();
	}

	hook(module, funcName: string, func, isRecord: boolean = true) {
		this.FunceMap[module.ClassName] = module.prototype[funcName];
		module.prototype[funcName] = func;
		let item = {
			module: module,
			funcName: funcName,
		};

		isRecord && this.hookNames.push(item);
	}

	unHook(module, funcName: string) {
		if (!module || !funcName) {
			return;
		}
		let name = module.ClassName;
		this.FunceMap[name] && (module.prototype[funcName] = this.FunceMap[name]);
		delete this.FunceMap[name];
	}

	reset() {
		if(this.node) {
			this.hander && (this.hander.active = false);
			this.node_content.active = false;
			this.mask.active = false;
			this.wallLayer.children.forEach(node => node.active = false);
			this.uiLayer && this.uiLayer.off(cc.Node.EventType.CHILD_ADDED);
		}
		// this.wallLayer.active = true;
		for (let i in this.hookNames) {
			let item = this.hookNames[i]
			item && this.unHook(item.module, item.funcName);
		}

	}

	stopMenu(idx: number = 0, flag: boolean = true) {

		let node = this.wallLayer.children[idx];

		if (node) {
			this.wallLayer.children.forEach(node => node.active = !flag);
			node.active = flag;
		} else {
			this.wallLayer.children.forEach(node => node.active = flag);
		}


	}

	// 自由引导任务 和 球杆
	freeGUide() {
		this.finishedStepCallBack = () => {

		}

	}

	pausePlayerTime() {
		let module = ModuleManager.GetModule(GameTopInfoModule.ClassName) as any;
		let players: GamePlayerInfoBinder[] = module.binder.players;
		players[0]["timePro"].node.active = false;
		players[0]["countDown"].node.active = false;
		players[0]["stopTimer"]();
		this.FunceMap["startTimer"] = players[0]["startTimer"];
		players[0]["startTimer"] = function () {
			players[0]["timePro"].node.active = false;
			players[0]["countDown"].node.active = false;
			return;
		}
	}

	startPlayerTime() {
		let module = ModuleManager.GetModule(GameTopInfoModule.ClassName) as any;
		let players: GamePlayerInfoBinder[] = module.binder.players;
		players[0]["timePro"].node.active = true;
		players[0]["countDown"].node.active = true;
		players[0]["startTimer"] = this.FunceMap["startTimer"];
		delete this.FunceMap["startTimer"];
	}



	// 开局摆球模块新手引导 =======================start
	onGameFreeKickModuleGuide() {
		this.stopMenu(5);
		let gameOptionModule: cc.Node = this.moduleMap["GameOptionModule"];
		gameOptionModule.pauseSystemEvents(true);

		let GameFreeKickModuleNode: cc.Node = this.moduleMap["GameFreeKickModule"];
		let halfScene: cc.Node = getNodeChildByName(GameFreeKickModuleNode, "halfScene");
		let baiQiuGuang: cc.Node = getNodeChildByName(GameFreeKickModuleNode, "baiQiuGuang");
		let width = baiQiuGuang.width / 2;
		let world = halfScene.convertToWorldSpaceAR(cc.v2(halfScene.width / 2 - baiQiuGuang.width / 2, 0));
		let baiQiuGuang_tmp = cc.instantiate(baiQiuGuang);
		let table: TableVO = GameDataManager.GetDictData(GameDataKey.Table, TableVO);
		if (!table.whiteBall || !GameFreeKickModuleNode) {
			setTimeout(() => {
				this.onGameFreeKickModuleGuide();
			}, 500);
			return;
		}
		this.pausePlayerTime();

		// 屏蔽设置重新开始按钮
		let gameSetModule = ModuleManager.GetModule(ModuleNames.GameSetModule) as any;
		gameSetModule.binder.retConnectBtn.off(cc.Node.EventType.TOUCH_END);

		this.hander.active = true;
		let pos = this.transSceenPos(table.whiteBall, "3D Camera");
		pos = this.transSceen2Node(pos, "Main Camera", this.node);

		this.node.addChild(baiQiuGuang_tmp);
		let nodePos = this.node.convertToNodeSpaceAR(world);
		baiQiuGuang_tmp.setPosition(nodePos);
		baiQiuGuang_tmp.active = true;
		this.hander.postion = pos;
		// 手指来回移动
		this.hander.moveAction(cc.v2(baiQiuGuang_tmp.x, baiQiuGuang_tmp.y));

		this.finishedStepCallBack = (data: any) => {
			let ballWorldPos: cc.Vec3 = data;
			let Main_Camera = getCamera("Main Camera");
			let sceenPos = Main_Camera.getWorldToScreenPoint(world);
			let offX = ballWorldPos.x - sceenPos.x;
			let offy = ballWorldPos.y - sceenPos.y;

			if (offX * offX + offy * offy > width * width) {
				return false;
			}
			this.finishedStepCallBack = null;
			baiQiuGuang_tmp.destroy();
			this.hander.stopAllACtion();
			this.hander.active = false;
			// GameFreeKickBinder.prototype["onFreeKickBallTouchEvent"] = this.FunceMap[GameFreeKickBinder.name];
			// delete this.FunceMap[GameFreeKickBinder.name];
			gameOptionModule.resumeSystemEvents(true);
			this.nextStep();
			return true;
		}

	}

	onFreeKickBallTouchEvent(evt, freeBinder) {
		if (evt.type == cc.Node.EventType.TOUCH_START) {
			freeBinder["whiteOldPos"] = freeBinder.table.whiteBall.position;
			cc.log(freeBinder["whiteOldPos"]);
		} else if (evt.type == cc.Node.EventType.TOUCH_END) {
			let camera: cc.Camera = getCamera("3D Camera");
			let ballWorldPos = (freeBinder.table.whiteBall as cc.Node).convertToWorldSpaceAR(cc.v3());
			ballWorldPos = camera.getWorldToScreenPoint(ballWorldPos);
			let isOk = this.finishedStepCallBack && this.finishedStepCallBack(ballWorldPos);
			if (!isOk) {
				freeBinder.updateWhiteBallPos(freeBinder["whiteOldPos"], false);
				freeBinder.table.isBallDragging = false;
				freeBinder.freeKickMask.node.off(cc.Node.EventType.TOUCH_MOVE, freeBinder.onFreeKickBallTouchEvent, freeBinder);
				freeBinder.freeKickMask.node.setContentSize(25, 25);
				freeBinder.freeKickMask.clear();
				//////////////
				freeBinder.drawFreeKickBall(cc.color(255, 255, 0, 0), 25);
				freeBinder.updateWhiteBallPos(freeBinder.table.lastWhiteBallPos, true);
				freeBinder.onResetWhiteBall();// 白球摆球放下的位置存在其他球，需要归位
				freeBinder.updateFreeKickMaskPos();

				freeBinder.stopSceneAnim();
				freeBinder.hideFreeKick();
				freeBinder.playArrowsAnim();
			} else {
				// //4.841
				freeBinder.updateWhiteBallPos(cc.v3(freeBinder["whiteOldPos"].x, freeBinder["whiteOldPos"].y, 4.841), true);
			}
			return isOk;

		}
		return true;
	}

	// 开局摆球模块新手引导 =======================end

	// 引导移动击球辅助线
	onGameBallCueBinderGuide() {
		cc.log("引导移动击球辅助线")
		this.stopMenu(5);
		let gameOptionModule: cc.Node = this.moduleMap["GameOptionModule"];
		gameOptionModule.pauseSystemEvents(true);

		let table: TableVO = GameDataManager.GetDictData(GameDataKey.Table, TableVO);
		this.FunceMap[GameBallCueBinder.ClassName] = GameBallCueBinder.prototype["drawBoresight"];
		var self = this;

		let whitePos = this.transSceenPos(table.whiteBall, "3D Camera");
		whitePos = this.transSceen2Node(whitePos, "Main Camera", this.node);

		let B12Pos = this.transSceenPos(table.balls[12], "3D Camera");
		B12Pos = this.transSceen2Node(B12Pos, "Main Camera", this.node);

		this.node_assitLine.position = whitePos;

		this.hander.hand.x = 0;
		this.hander.hand.y = 150;
		this.hander.active = true;

		this.hander.moveAction(cc.v2(150, 0));

		let B0 = table.ballScreenPoints["B0"];
		let B12 = table.ballScreenPoints["B12"];
		let dis = cc.Vec2.distance(B0, B12);

		// let hu =  whiteV2.signAngle(B12V2);
		let angle = 0;
		// if(whitePos.y < B12Pos.y) {
		// 	angle = -(180 - angle);
		// } else {
		// 	angle = angle;
		// }

		// angle = 0;
		this.node_assitLine.width = dis;
		this.node_assitLine.angle = angle;
		this.node_assitLine.active = true;
		cc.log("==sdasd==", dis, "---", angle);
		var isComm = false;
		let moduleGameCue = ModuleManager.GetModule(ModuleNames.Game_BallCue) as any;
		// x: 930.224
		// y: 545.8175427246093
		// z: 0
		moduleGameCue.binder.updateBallCueAngle(cc.v3(0, 30, 0));
		moduleGameCue.binder.drawBoresight();

		this.hook(GameBallCueBinder, "drawBoresight", function () {
			if (Math.round(this.shootAngle) == Math.round(angle)) {
				isComm = true;
			}

			if (isComm) {
				cc.Canvas.instance.node.off(cc.Node.EventType.TOUCH_START, this.onBallCueTouchEvent, this);
				cc.Canvas.instance.node.off(cc.Node.EventType.TOUCH_MOVE, this.onBallCueTouchEvent, this);
				cc.Canvas.instance.node.off(cc.Node.EventType.TOUCH_END, this.onBallCueTouchEvent, this);
				cc.Canvas.instance.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onBallCueTouchEvent, this);
				self.unHook(GameBallCueBinder, "drawBoresight");
				gameOptionModule.resumeSystemEvents(true);
				self.nextStep();
				// this.shootAngle = angle;
			}
			self.FunceMap[GameBallCueBinder.ClassName] && self.FunceMap[GameBallCueBinder.ClassName].call(this);
		})
	}


	// 引导微调角度
	onGameOptionModule() {
		this.stopMenu(2, false);

		let gameOptionModule: cc.Node = this.moduleMap["GameOptionModule"];
		let FineTurning: cc.Node = getNodeChildByName(gameOptionModule, "FineTurning/HitPoint");
		let ShootPower: cc.Node = getNodeChildByName(gameOptionModule, "ShootPower/HitPoint");
		ShootPower.pauseSystemEvents(true);

		let pos = this.transPos(FineTurning.parent, this.node);
		let halfHigh = FineTurning.height / 2;
		let topPos = cc.v2(pos.x, pos.y + 100);
		let lowPos = cc.v2(pos.x, pos.y - 100);

		this.hander.active = true;
		this.hander.postion = cc.v3(topPos);
		this.hander.moveAction(lowPos, 1, true);
		var module = ModuleManager.GetModule(ModuleNames.Game_BallCue) as any;
		
		let dis = 0;

		var self = this;
		let room = GameDataManager.GetDictData(GameDataKey.Room);
		room.gan = 1; // 不让第一杆加力
		// var shootBall = ModuleManager.GetModule(ModuleNames)
		FineTurning.on(cc.Node.EventType.TOUCH_MOVE, function (evt: cc.Event.EventTouch) {
			if (evt.type == cc.Node.EventType.TOUCH_MOVE) {
				let offsetPos = evt.getLocation().sub(evt.getPreviousLocation());
				dis += Math.abs(offsetPos.y);
			}
			if (dis > 100) { // _bubblingListeners = 
				FineTurning.off(cc.Node.EventType.TOUCH_MOVE);
				FineTurning.off(cc.Node.EventType.TOUCH_END);
				FineTurning.off(cc.Node.EventType.TOUCH_CANCEL);
				self.hander.stopAllACtion();
				self.hander.active = false;
				module.binder.shootAngle = 0; // 自己设置角度
				ShootPower.resumeSystemEvents(true);
				self.nextStep();
			}
		})
	}

	// 引导力量
	onGuidePower() {
		this.stopMenu(1, false);
		let gameOptionModule: cc.Node = this.moduleMap["GameOptionModule"];
		let ShootPower: cc.Node = getNodeChildByName(gameOptionModule, "ShootPower/HitPoint");

		let pos = this.transPos(ShootPower.parent, this.node);
		let halfHigh = ShootPower.height / 2;
		let topPos = cc.v2(pos.x, pos.y + halfHigh - 40);
		let lowPos = cc.v2(pos.x, pos.y - halfHigh + 150);

		this.hander.active = true;
		this.hander.postion = cc.v3(topPos);
		this.hander.moveAction(lowPos);
		let dis = 0;

		var self = this;
		self.FunceMap[GameOptionBinder.ClassName] = GameOptionBinder.prototype["onPowerTouch"];
		ShootPower.off(cc.Node.EventType.TOUCH_MOVE);
		ShootPower.off(cc.Node.EventType.TOUCH_END);
		let module: any = ModuleManager.GetModule(GameOptionModule.ClassName);
		let gameOptionBinder: GameOptionBinder = module.binder;
		let oldsetOptionPlayer = gameOptionBinder.setOptionPlayer;
		gameOptionBinder.setOptionPlayer = function (playerID: number) {
			if (this.player.id == playerID) { // 自己
				self.node.active = true;
				gameOptionBinder.setOptionPlayer = oldsetOptionPlayer;
				setTimeout(function () {
					self.stopMenu(5, false);
					self.nextStep();
				}, 100);
				oldsetOptionPlayer.call(this, playerID);
			}
		}
		let touchFunc = function (evt: cc.Event.EventTouch) {
			if (evt.type == cc.Node.EventType.TOUCH_MOVE) {
				let offsetPos = evt.getLocation().sub(evt.getPreviousLocation());
				dis += -offsetPos.y;
			} else {
				if (dis < 100) {
					module.binder.power.fillRange = 0;
					return;
				} else {
					ShootPower.off(cc.Node.EventType.TOUCH_MOVE);
					ShootPower.off(cc.Node.EventType.TOUCH_END);
					ShootPower.off(cc.Node.EventType.TOUCH_CANCEL);
					self.node_assitLine.active = false;
					self.node.active = false;
					module.binder.power.fillRange = 1;
					self.reset();
				}
			}
			self.hander.active = false;
			module.binder.onPowerTouch(evt);
			
		}

		ShootPower.on(cc.Node.EventType.TOUCH_MOVE, touchFunc);
		ShootPower.on(cc.Node.EventType.TOUCH_END, touchFunc);
		ShootPower.on(cc.Node.EventType.TOUCH_CANCEL, touchFunc);

	}

	// ==========end

	onYIndaoOk() {
		
		let player: PlayerVO = GameDataManager.GetDictData(GameDataKey.Player, PlayerVO);
		let quitCallBack = () => {
			GameDataManager.SetDictData(GameDataKey.Room, null);
			GameDataManager.SetDictData(GameDataKey.Table, null);
			if (player.id == 0) return
			dispatchFEventWith(GuideEvent.newGuideFinished);
			C_Game_QuitGame.Send();
		}
		showPopup(PopupType.WINDOW, {
			// msg:getLang("Text_fanbei1",[room.doubleNum*room.roomScore]),
			msg: LanguageManager.CurrentIndex ? "يېتەكلەش تاماملاندى،چېكىنەمسىز" : "新手引导已经完毕，是否退出此局?",
			onConfirm: () => {
				this.startPlayerTime();
				this.nextStep();
				quitCallBack();
			},
			onCancel: () => {
				this.startPlayerTime();
				this.nextStep();
			},
		}, true);
	}


	// 球杆商店界面打开
	onCueItemBinder() {


	}

	// 维护按钮
	onCueWeihu() {

	}

	// 球杆 升级
	onCueUpgrade() {

	}

	

}