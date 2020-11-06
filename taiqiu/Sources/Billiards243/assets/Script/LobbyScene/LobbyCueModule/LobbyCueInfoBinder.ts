import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { SimplePlayerCueVO } from "../../VO/SimplePlayerCueVO";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { C_Lobby_SellCue } from "../../Networks/Clients/Cue/C_Lobby_SellCue";
import { PlayerVO } from "../../VO/PlayerVO";
import { C_Lobby_UpgradeCue } from "../../Networks/Clients/Cue/C_Lobby_UpgradeCue";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { C_Lobby_UseCue } from "../../Networks/Clients/Cue/C_Lobby_UseCue";
import { PlayerCueVO } from "../../VO/PlayerCueVO";
import { StoreManager } from "../../../Framework/Managers/StoreManager";
import { Assets } from "../../../Framework/Core/Assets";
import { LobbyCueMaintainBinder } from "./LobbyCueMaintainBinder";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { GameEvent } from "../../GameEvent";
import { showPopup } from "../../Common/showPopup";
import { PopupType } from "../../PopupType";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { CLanguage } from "../../../Framework/Components/CLanguage";
import { CDragonBones } from "../../../Framework/Components/CDragonBones";
import { getLang } from "../../../Framework/Utility/dx/getLang";
import { PayKinds, PayType } from "../PayModeModule/PayDefine";
import { GoodsType } from "../PayModeModule/GoodsType";
import { JTimer } from "../../../Framework/Timers/JTimer";
import { FFunction } from "../../../Framework/Core/FFunction";
import { Fun } from "../../../Framework/Utility/dx/Fun";

export class LobbyCueInfoBinder extends FBinder 
{
    public static ClassName:string = "LobbyCueInfoBinder";
    
    private cueIcon:cc.Sprite = null;
    private imgCue:cc.Sprite = null;
    private imgCueAnim:dragonBones.ArmatureDisplay = null;
    private cueName:CLanguage = null;
    private btnMaintain:cc.Node = null;
    private btnSell:cc.Node = null;
    private btnUse:cc.Node = null;
    private btnUpgrade:cc.Node = null;
    private player:PlayerVO = null;
    private simplePlayerCue:SimplePlayerCueVO = null;
    private playerCue:PlayerCueVO = null;
    private lobbyCueMaintain:LobbyCueMaintainBinder = null;
    private cueMaintainNode:cc.Node = null;

    private rightIcon:cc.Sprite = null;
    private leftIcon:cc.Sprite = null;
    private rightCueStar:cc.Sprite[] = [];
    private leftCueStar:cc.Sprite[] = [];
    private right_dynamics:cc.Label = null;
    private right_addSai:cc.Label = null;
    private right_gunsight:cc.Label = null;
    private right_zhanli:cc.Label = null;
    private left_dynamics:cc.Label = null;
    private left_addSai:cc.Label = null;
    private left_gunsight:cc.Label = null;
    private left_zhanli:cc.Label = null;
    private lbMoney:cc.RichText = null;
    private imgGold:cc.Sprite = null;

    private ifAdv: boolean = false; // 是否可以升级
    private upgradeTween: cc.Tween;
    private mainDefendTween: cc.Tween;
    
    public initViews()
    {
        super.initViews();
        super.addEvents();

        this.cueIcon = getNodeChildByName(this.asset,"cueIcon",cc.Sprite);
        this.imgCue = getNodeChildByName(this.asset,"img_cue",cc.Sprite);
        this.imgCueAnim = getNodeChildByName(this.asset, "img_cueAnim", dragonBones.ArmatureDisplay);
        this.cueName = getNodeChildByName(this.asset,"cueName",CLanguage);
        let btnNode = getNodeChildByName(this.asset,"btnNode");
        this.btnMaintain = getNodeChildByName(btnNode,"btn_maintain");
        this.btnSell = getNodeChildByName(btnNode,"btn_sell");
        this.btnUse = getNodeChildByName(btnNode,"btn_use");
        this.btnUpgrade = getNodeChildByName(this.asset,"btn_ShengJi");
        this.btnMaintain.on(cc.Node.EventType.TOUCH_END, () => {
            this.openDefendCue();
        }, this);
        this.btnSell.on(cc.Node.EventType.TOUCH_END, () => {
            this.sendSellCue();
        }, this);
        this.btnUse.on(cc.Node.EventType.TOUCH_END, () => {
            this.sendUseCue();
        }, this);
        this.btnUpgrade.on(cc.Node.EventType.TOUCH_END, () => {
            this.sendUpgradeCue();
        }, this);
        this.player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);

        let rightCueStarNode = getNodeChildByName(this.asset,"curStarRight");
        for(let i = 0; i < 5; i++) {
            this.rightCueStar[i] = getNodeChildByName(rightCueStarNode,"star"+(i+1),cc.Sprite);
        }
        let leftCueStarNode = getNodeChildByName(this.asset,"curStarLeft");
        for(let i = 0; i < 5; i++) {
            this.leftCueStar[i] = getNodeChildByName(leftCueStarNode,"star"+(i+1),cc.Sprite);
        }
        this.rightIcon = getNodeChildByName(this.asset,"rightIcon",cc.Sprite);
        this.leftIcon = getNodeChildByName(this.asset,"leftIcon",cc.Sprite);
        let labelCue = getNodeChildByName(this.asset, "label_cue");
        this.right_dynamics = getNodeChildByName(labelCue,"right_dynamics",cc.Label);
        this.right_addSai = getNodeChildByName(labelCue,"right_addSai",cc.Label);
        this.right_gunsight = getNodeChildByName(labelCue,"right_gunsight",cc.Label);
        this.right_zhanli = getNodeChildByName(labelCue,"right_zhanli",cc.Label);
        this.left_dynamics = getNodeChildByName(labelCue,"left_dynamics",cc.Label);
        this.left_addSai = getNodeChildByName(labelCue,"left_addSai",cc.Label);
        this.left_gunsight = getNodeChildByName(labelCue,"left_gunsight",cc.Label);
        this.left_zhanli = getNodeChildByName(labelCue,"left_zhanli",cc.Label);
        this.lbMoney = getNodeChildByName(labelCue,"lbMoney",cc.RichText);
        this.imgGold = getNodeChildByName(this.asset,"img_JinBi",cc.Sprite);
        this.playerCue = GameDataManager.GetDictData(GameDataKey.PlayerCue,PlayerCueVO);
    }

    protected addEvents() {
        addEvent(this,LobbyEvent.Server_UpgradeCue,this.onUpdateCueInfo);
        addEvent(this,LobbyEvent.Server_UseCue,this.onUseCue);
        addEvent(this, LobbyEvent.Server_Lobby_UpdateItem, this.setUpgradeConsume);
    }
    
    public onUpdateCueInfo(data)
    {
        this.simplePlayerCue = data.data;
      
        this.updateCueData();
    }

    public onUseCue()
    {
        this.btnUse.active = false;
    }

    public updateCueInfo(data:SimplePlayerCueVO)
    {
        this.simplePlayerCue = data;
        this.btnUse.active = !data.isUse;
        
        let index = data.cueRes;
        this.imgCueAnim.node.active = true;
        this.imgCue.node.active = false;
        CDragonBones.setDragonBones(this.imgCueAnim,`DragonBones/Cue/cue${index}/cue${index}_ske`,`DragonBones/Cue/cue${index}/cue${index}_tex`,
            `cue${index}`,`cue${index}`,0);
        
        this.cueName.key = "Text_qiugan"+Math.floor(data.cueID/100);
        for(let i = 0; i < 5; i++) {
            ResourceManager.LoadSpriteFrame(`Lobby/LobbyCue/LobbyCue?:img_Xing01`,this.rightCueStar[i]);
            ResourceManager.LoadSpriteFrame(`Lobby/LobbyCue/LobbyCue?:img_Xing01`,this.leftCueStar[i]);
        }
        this.updateCueData()
    }

    private updateCueData() {
        let cueInfo = this.playerCue.getCueById(this.simplePlayerCue.cueID);
        ResourceManager.LoadSpriteFrame(`Lobby/LobbyCue/LobbyCue?:${cueInfo.quality}`,this.cueIcon);
        for(let i = 0; i < cueInfo.star; i++) {
            let cueXingName = i > 4 ? "img_Xing03" : "img_Xing02";
            ResourceManager.LoadSpriteFrame(`Lobby/LobbyCue/LobbyCue?:${cueXingName}`,this.rightCueStar[i > 4 ? i - 5 : i]);
        }
        ResourceManager.LoadSpriteFrame(`Lobby/LobbyCue/LobbyCue?:${cueInfo.quality}`,this.rightIcon);
        this.right_dynamics.string = cueInfo.power.toString();
        this.right_addSai.string = cueInfo.gase.toString();
        this.right_gunsight.string = cueInfo.aim.toString();
        this.right_zhanli.string = cueInfo.combat.toString();

        let cueUpgradeInfo = this.playerCue.getCueUpgradeById(this.simplePlayerCue.cueID);
        for(let i = 0; i < cueUpgradeInfo.star; i++) {
            let cueXingName = i > 4 ? "img_Xing03" : "img_Xing02";
            ResourceManager.LoadSpriteFrame(`Lobby/LobbyCue/LobbyCue?:${cueXingName}`,this.leftCueStar[i > 4 ? i - 5 : i]);
        }
        ResourceManager.LoadSpriteFrame(`Lobby/LobbyCue/LobbyCue?:${cueUpgradeInfo.quality}`,this.leftIcon);
        this.left_dynamics.string = cueUpgradeInfo.power.toString();
        this.left_addSai.string = cueUpgradeInfo.gase.toString();
        this.left_gunsight.string = cueUpgradeInfo.aim.toString();
        this.left_zhanli.string = cueUpgradeInfo.combat.toString();

        this.setUpgradeConsume();

        this.btnAction();
    }

    //设置升级消耗
    private setUpgradeConsume() {
        let cueInfo = this.playerCue.getCueById(this.simplePlayerCue.cueID);
        let price = cueInfo.upgrade.toString().split(",");
        if(price.length < 2){
            this.ifAdv = false;
            this.lbMoney.string = `<color=#77FF7E>${getLang("Text_sjqg")}</c>`;
            return;
        }
        this.lbMoney.string = price[1];
        if(Number(price[0]) == 3001) {
            this.ifAdv = this.getCard() >= price[1];
            if (this.ifAdv)
                this.lbMoney.string = `<color=#77FF7E>${price[1]}/${this.getCard()}</c>`;
            else
                this.lbMoney.string = `<color=#77FF7E>${price[1]}/</c><color=#FF0000>${this.getCard()}</c>`;
        }
        ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${Number(price[0])}`,this.imgGold);
    }

    //获取强化卡
    private getCard() {
        for(let i = 0; i < this.player.itemList.length; i++) {
            if(this.player.itemList[i]["id"] == 3001)
                return this.player.itemList[i]["num"];
        }
        return 0;
    }
    
	//发送出售球杆
	private sendSellCue()
	{
        showPopup(PopupType.WINDOW,{
            msg:getLang("Text_csqg"),
            onConfirm:() => {
                C_Lobby_SellCue.Send(this.player.id, this.simplePlayerCue.id);
            }
        },true);
	}

	//发送升级球杆
	private sendUpgradeCue()
	{
		C_Lobby_UpgradeCue.Send(this.player.id, this.simplePlayerCue.id);
	}

	//发送使用球杆
	private sendUseCue()
	{
		C_Lobby_UseCue.Send(this.player.id, this.simplePlayerCue.id);
    }
    
	//打开维护球杆
	private openDefendCue()
	{
        if (this.cueMaintainNode) {
            this.cueMaintainNode.active = true;
            this.lobbyCueMaintain.updateCueMaintainInfo(this.simplePlayerCue.cueID);
        } else {
            this.cueMaintainNode = StoreManager.NewPrefabNode(Assets.GetPrefab("LobbyScene/LobbyCue/LobbyCueMaintain"));
            this.asset.addChild(this.cueMaintainNode);
            this.lobbyCueMaintain = this.addObject(new LobbyCueMaintainBinder());
            this.lobbyCueMaintain.bindView(this.cueMaintainNode);
            this.lobbyCueMaintain.updateCueMaintainInfo(this.simplePlayerCue.cueID);
        }
        
    }
    
    private btnAction() {
        // play
        let toBig = cc.scaleTo(1, 1.5);
        let toNor = cc.scaleTo(0.5, 1);
        this.upgradeTween || (this.upgradeTween = cc.tween(this.btnUpgrade));
        this.mainDefendTween || ( this.mainDefendTween = cc.tween(this.btnMaintain));

        this.upgradeTween.stop();
        if( this.ifAdv) {
            this.upgradeTween.repeatForever(cc.sequence(toBig, toNor)).start();
        } else {
            JTimer.TimeOut(this, 100, Fun(function() {
                this.btnUpgrade.scale = 1;
            },this));
        }

       
        let ifDefend = false; // 是否可维护
        let curCue = this.simplePlayerCue;
        let priceTimes = curCue.defend_3_days.split(",");
        let priceDay = curCue.defend_3_days.split(",");
        let player = this.player;
        let compare = function(type, price): boolean {
            let _ifDefend = false;
            switch (type) {
                case GoodsType.GOLD:
                    _ifDefend = price <= player.gold ;
                    break;
                case GoodsType.DIM: 
                    _ifDefend =price <= player.diamond ;
                    break;
            }

            return _ifDefend;
        }

        this.mainDefendTween.stop();
        if(curCue.isNeedDefend()) {
            ifDefend = compare(parseInt(priceTimes[0]), parseInt(priceTimes[1]));
            ifDefend || (ifDefend = compare(parseInt(priceDay[0]), parseInt(priceDay[1])));
        }
        if(ifDefend) {
            this.mainDefendTween.repeatForever(cc.sequence(toBig, toNor)).start();
        } else {
            JTimer.TimeOut(this, 100, Fun(function() {
                this.btnMaintain.scale = 1;
            },this));
           
        }
      
    }

    public stopAcion() {
        this.upgradeTween.stop();
        this.mainDefendTween.stop();
        this.btnUpgrade.scale = 1;
        this.btnMaintain.scale = 1;
    
    }

}
