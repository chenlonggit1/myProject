import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { SimplePlayerCueVO } from "../../VO/SimplePlayerCueVO";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { PlayerCueVO } from "../../VO/PlayerCueVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { C_Lobby_BuyCue } from "../../Networks/Clients/Cue/C_Lobby_BuyCue";
import { PlayerVO } from "../../VO/PlayerVO";
import { C_Lobby_UseCue } from "../../Networks/Clients/Cue/C_Lobby_UseCue";
import { StoreManager } from "../../../Framework/Managers/StoreManager";
import { Assets } from "../../../Framework/Core/Assets";
import { formatDate } from "../../../Framework/Utility/dx/formatDate";
import { showPopup } from "../../Common/showPopup";
import { PopupType } from "../../PopupType";
import { CLanguage } from "../../../Framework/Components/CLanguage";
import { CDragonBones } from "../../../Framework/Components/CDragonBones";
import { getLang } from "../../../Framework/Utility/dx/getLang";

export class LobbyCueItemBinder extends FBinder 
{
    public static ClassName:string = "LobbyCueItemBinder";
    
    private btnBuy:CLanguage = null;
    private inUse:cc.Node = null;
    private imgIcon:cc.Sprite = null;
    private cueName:CLanguage = null;
    private cueStar:cc.Sprite[] = [];
    private cueGold:cc.Label = null;
    private cueTime:cc.Label = null;
    private imgMoney:cc.Sprite = null;
    private imgCue:cc.Sprite = null;
    private imgCueAnim:dragonBones.ArmatureDisplay = null;
    private dynamics:cc.Label = null;
    private addSai:cc.Label = null;
    private gunsight:cc.Label = null;
    private playerCue:PlayerCueVO = null;
    private player:PlayerVO = null;
    private simplePlayerCue:SimplePlayerCueVO = null;
    private isBuy:boolean = true;
    private batteryNode:cc.Node = null;
    private batteryList:cc.Node[] = [];
    private onConfirm:Function = null;

    private lbl_DefenseTip: cc.Node = null

    public initViews()
    {
        super.initViews();

        this.btnBuy = getNodeChildByName(this.asset,"btn_buy",CLanguage);
		this.inUse = getNodeChildByName(this.asset,"inUse");

        this.imgIcon = getNodeChildByName(this.asset,"img_icon",cc.Sprite);
        this.cueName = getNodeChildByName(this.asset,"cueName",CLanguage);
        let cueStarNode = getNodeChildByName(this.asset,"curStar");
        for(let i = 0; i < 5; i++) {
            this.cueStar[i] = getNodeChildByName(cueStarNode,"star"+(i+1),cc.Sprite);
        }
        this.cueGold = getNodeChildByName(this.asset,"cueGold",cc.Label);
        this.cueTime = getNodeChildByName(this.asset, "cueTime", cc.Label);
        this.imgMoney = getNodeChildByName(this.asset, "img_JinBi",cc.Sprite);
        this.imgCue = getNodeChildByName(this.asset,"img_cue",cc.Sprite);
        this.imgCueAnim = getNodeChildByName(this.asset, "img_cueAnim", dragonBones.ArmatureDisplay);

        this.dynamics = getNodeChildByName(this.asset,"lbDynamics",cc.Label);
        this.addSai = getNodeChildByName(this.asset,"lbJiasai",cc.Label);
        this.gunsight = getNodeChildByName(this.asset,"lbGunsight",cc.Label);

        this.batteryNode = getNodeChildByName(this.asset, "batteryNode");

        this.lbl_DefenseTip = getNodeChildByName(this.asset, "lbl_defense");
        for(let i = 0; i < 5; i++) {
            this.batteryList[i] = getNodeChildByName(this.batteryNode, `batteryContent/battery${i}`);
        }

        this.playerCue = GameDataManager.GetDictData(GameDataKey.PlayerCue,PlayerCueVO);
        this.player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
    }

    protected addEvents()
    {
        this.asset.off("click");
        this.btnBuy.node.off("click");
        this.asset.on("click", () => {
			this.onConfirmClick();
		}, this);
        this.btnBuy.node.on("click", () => {
			this.sendBuyCue();
        }, this);

    }

    protected removeEvents()
    {
        this.asset.off("click");
        this.btnBuy.node.off("click");
        super.removeEvents();
    }

    public initCueInfo() {
        this.btnBuy.node.active = true;
        this.inUse.active = false;
        ResourceManager.LoadSpriteFrame(`Lobby/LobbyCue/LobbyCue?:btn_GouMai`,this.btnBuy.getComponent(cc.Sprite));
        for(let i = 0; i < 5; i++) {
            ResourceManager.LoadSpriteFrame(`Lobby/LobbyCue/LobbyCue?:img_Xing01`,this.cueStar[i]);
        }
        this.btnBuy.key = "btn_GouMai";
    }

    public updateCueItemInfo(data:SimplePlayerCueVO, isBuy:boolean, onConfirm:Function) {
        this.isBuy = isBuy;
        this.simplePlayerCue = data;
        ResourceManager.LoadSpriteFrame(`Lobby/LobbyCue/LobbyCue?:img_${data.quality}`,this.imgIcon);
        this.cueName.key = "Text_qiugan"+Math.floor(data.cueID/100);
        if(data.price == 0 || !this.isBuy){ 
            this.cueGold.node.active = false;
            this.imgMoney.node.active = false;
            if(this.isBuy) this.btnBuy.node.active = false;
        }else{
            this.cueGold.node.active = true;
            this.imgMoney.node.active = true;
            let price = data.price.toString().split(",");
            this.cueGold.string = price[1];
            ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${Number(price[0])}`,this.imgMoney);
        }

        // if(!this.isBuy || data.price == 0) { // 没有价格或者已购买 
        //     this.cueGold.node.active = false;
        //     this.imgMoney.node.active = false;
        // } else {
        //     this.cueGold.node.active = true;
        //     this.imgMoney.node.active = true;
        // }
        // this.batteryNode.x =  data.isUse?  this.imgMoney.node.x : 70;
        this.setDefendInfo();

        for(let i = 0; i < data.star; i++) {
            let cueXingName = i > 4 ? "img_Xing03" : "img_Xing02";
            ResourceManager.LoadSpriteFrame(`Lobby/LobbyCue/LobbyCue?:${cueXingName}`,this.cueStar[i > 4 ? i - 5 : i]);
        }
        
        let index = data.cueRes;
        this.imgCueAnim.node.active = true;
        this.imgCue.node.active = false;
        CDragonBones.setDragonBones(this.imgCueAnim,`DragonBones/Cue/cue${index}/cue${index}_ske`,`DragonBones/Cue/cue${index}/cue${index}_tex`,
            `cue${index}`,`cue${index}`,0);
        
        let cueInfo = this.playerCue.getCueById(data.cueID);
        let cueMaintainInfo = this.playerCue.getMyCueByCueID(data.cueID);
        this.dynamics.string = cueInfo.power.toString();
        this.addSai.string = cueInfo.gase.toString();
        this.gunsight.string = cueInfo.aim.toString();

          // 如果球杆 是正在使用球杆 并且需要维护 闪烁 // data.isUse &&  
        if(cueMaintainInfo && data.isNeedDefend()) {
            // this.batteryNode;
            this.lbl_DefenseTip.active = true;
            this.batteryNode.active = false;
            // let blinkAciton =  cc.blink(1, 0);sss
            
        } else {
            this.lbl_DefenseTip.active = false;
        }



        if(!cueMaintainInfo) return;
        if(!this.isBuy && cueMaintainInfo.defendDay == 0 && cueMaintainInfo.defendTimes == 0) {
            let temp = cueMaintainInfo.damage.split(",");
            this.dynamics.string = temp[0];
            this.addSai.string = temp[1];
            this.gunsight.string = temp[2];
        } 
        
        this.btnBuy.node.active = !data.isUse;
        this.inUse.active = data.isUse;
        if(!this.isBuy)
            this.btnBuy.key = "btn_ShiYong";
            // ResourceManager.LoadSpriteFrame(`Lobby/LobbyCue/LobbyCue?:btn_ShiYong`,this.btnBuy.getComponent(cc.Sprite));
        
        if (onConfirm)
            this.onConfirm = onConfirm;

      
    }

    //打开球杆信息
    private onConfirmClick()
    {
        if (this.onConfirm)
            this.onConfirm();
    }

    //设置维护信息
    private setDefendInfo() {
        this.cueTime.string = "";
        if(this.simplePlayerCue.defendDay > 0)
            this.cueTime.string = formatDate(this.simplePlayerCue.defendDay,"yyyy-mm-dd");
        else if(this.simplePlayerCue.defendTimes > 0)
            this.cueTime.string += ` ${this.simplePlayerCue.defendTimes}`;

        this.batteryNode.active = !this.isBuy;
        //有维护天数、不显示维护电池
        if(this.simplePlayerCue.defendDay > 0) this.batteryNode.active = false;
        else {
            let batteryColor = cc.Color.GREEN;
            if(this.simplePlayerCue.defendTimes < 10)
                batteryColor = cc.Color.RED;
            else if(this.simplePlayerCue.defendTimes < 20)
                batteryColor = cc.Color.YELLOW;
            this.batteryNode.color = batteryColor;
            let showIndex = Math.floor(this.simplePlayerCue.defendTimes/5);
            for(let i = 0; i < 5; i++) {
                this.batteryList[i].active = showIndex > i;
                this.batteryList[i].color = batteryColor;
            }
        }
    }

    //发送购买球杆/使用球杆
	private sendBuyCue()
	{
        if(this.isBuy) {
            showPopup(PopupType.WINDOW,{
                msg:getLang("Text_goumaiqg"),
                onConfirm:() => {
                    C_Lobby_BuyCue.Send(this.player.id, this.simplePlayerCue.cueID);
                }
            },true);
        }
        else
            C_Lobby_UseCue.Send(this.player.id, this.simplePlayerCue.id);
    }
    

}
