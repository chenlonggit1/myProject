import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { GameLayer } from "../../../Framework/Enums/GameLayer";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { GameLuckBallVO } from "../../VO/GameLuckBallVO";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { getTime } from "../../../Framework/Utility/dx/getTime";
import { GameEvent } from "../../GameEvent";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { JTimer } from "../../../Framework/Timers/JTimer";
import { ShopGoodsVo } from "../../VO/ShopGoodsVo";
import { GoodsId, GoodsType } from "../../LobbyScene/PayModeModule/PayDefine";
import { GoodsItemVO } from "../../VO/GoodsItemVO";
import { PayOrder } from "../../Pay/PayOrder";
import { getLang } from "../../../Framework/Utility/dx/getLang";

/**
*@description:幸运一球桌子模块
**/
export class GameLuckChargeBinder extends FBinder {

    private btn_GuanBi: cc.Node = null;
    private countDown: cc.Label = null;// 有效时间
    private JiangPinDiLayout: cc.Node = null; // 奖励列表layout容器
    private rewardItem: cc.Node = null;// 奖励列表item
    private rewardTimeOut: number[] = null;// 存计时器的吧
    private taskPool: cc.NodePool = null;
    private luckConfig: any = null;
    private luckInfo: any = null;
    private btnStart: cc.Node = null;//直接开始游戏的按钮
    private payBtns: cc.Node[] = [];
    private btnCountLabel: cc.Label = null;//剩余次数
    private timer: JTimer = null;
    private countDownCountLabel:number = 0;// 计时器倒计时
    private countDownLabel:cc.Node = null;// 倒计时标题头1
    private Luck_Goods_data: GoodsItemVO[] = [];
    public initViews() {
        super.initViews();

        var btnLayout = getNodeChildByName(this.asset, "btnLayout");
        var pupopBg = getNodeChildByName(this.asset, "bg");
        this.JiangPinDiLayout = getNodeChildByName(this.asset, "JiangPinDiLayout");

        this.btnStart = getNodeChildByName(this.asset, "btn_start");
        this.btnCountLabel = getNodeChildByName(this.btnStart, "countNode/count", cc.Label);


        this.rewardItem = getNodeChildByName(this.JiangPinDiLayout, "img_JiangPinDi");

        this.luckConfig = GameDataManager.GetDictData(GameDataKey.GameLuckBall, GameLuckBallVO).gameLuckConfig;
        this.luckInfo = GameDataManager.GetDictData(GameDataKey.GameLuckBall, GameLuckBallVO).gameLuckTimes;

        this.btn_GuanBi = getNodeChildByName(pupopBg, "btn_GuanBi");

        this.btn_GuanBi.once(cc.Node.EventType.TOUCH_END, () => {
            dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.Game_LuckYourself, null, GameLayer.Popup);
            this.showChargeTip()
        }, this);


        this.btnStart.once(cc.Node.EventType.TOUCH_END, () => {
            dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.Game_LuckYourself, null, GameLayer.Popup);
            this.onStartGame()
        }, this);

        this.countDown = getNodeChildByName(pupopBg, "countDown", cc.Label);
        this.countDownLabel = getNodeChildByName(pupopBg, "countDownLabel");

        this.payBtns[0] = getNodeChildByName(this.asset, "btnLayout/ben_LvSe");
        this.payBtns[1] = getNodeChildByName(this.asset, "btnLayout/btn_HongSe");
        this.payBtns[2] = getNodeChildByName(this.asset, "btnLayout/btn_LanSe");
        // this.payBtns[0].on(cc.Node.EventType.TOUCH_END, () => {
        //     console.log("第一个购买按钮");
        // }, this);

        // this.payBtns[1].on(cc.Node.EventType.TOUCH_END, () => {
        //     console.log("第二个购买按钮");
        // }, this);

        // this.payBtns[2].on(cc.Node.EventType.TOUCH_END, () => { 
        //     console.log("第三个购买按钮");
        // }, this);
        let shopVo: ShopGoodsVo = GameDataManager.GetDictData(GameDataKey.ShopGoods);
        this.Luck_Goods_data = shopVo.getItemsByType(GoodsType.Luck_Gan);
        for(let i = 0; i < this.payBtns.length; i++) { // 付费按钮
            let data;
            this.Luck_Goods_data && (data = this.Luck_Goods_data[i]);
            data && (this.payBtns[i].children[0].getComponent(cc.Label).string =  getLang("Text_xyyg11",[data.price / 100,data.count]));
           
            this.payBtns[i].on(cc.Node.EventType.TOUCH_END, ()=> {
                
                if(!data) {
                    cc.error("=========幸运一杆 没有数据=======");
                    return;
                } 
                PayOrder(data.goodsId); 
            })
        }

        this.initTaskPool();
        // this.loadData();//渲染界面
        this.initViewData();

    }
    private onStartGame() {
        dispatchFEventWith(GameEvent.Game_LuckInfo, { luckType: 2 });

        dispatchFEventWith(GameEvent.onChargeStartGame, {});

    }

    private showChargeTip() {
        dispatchFEventWith(GameEvent.Game_LuckInfo, { luckType: 2 });

        dispatchFEventWith(GameEvent.onChargeClosePupop, {});

    }

    /**
     * 
     * @param count 倒计时
     */
    private setCountDownNumber(count: number) {
        this.countDownCountLabel = count
        this.countDown.string = this.toHHmmss(this.countDownCountLabel)+""
        this.timer = this.addObject(JTimer.GetTimer(1000));
        this.timer.addTimerCallback(this, this.onTimeTick);
        this.timer.start();
    }


    private onTimeTick() {
        this.countDownCountLabel-=1;
        if(this.countDownCountLabel==0) {
            this.countDownCountLabel = 0;
            this.stopTimer()
        }else{
            this.countDown.string = this.toHHmmss(this.countDownCountLabel)+""
        }
    }

    private stopTimer()
    {
        if(!this.timer)return;
        this.timer.reset();
    }

    private toHHmmss(data) {
        var day = Math.floor( data/ (24*3600) ); // Math.floor()向下取整 
        var hour = Math.floor( (data - day*24*3600) / 3600); 
        var minute = Math.floor( (data - day*24*3600 - hour*3600) /60 ); 
        var second = data - day*24*3600 - hour*3600 - minute*60; 
        var time = ((hour < 10) ? "0" + hour : hour) + ":" + ((minute < 10) ? "0" + minute : minute) + ":" + ((second < 10) ? "0" + second : second);
        // cc.log(time)
        return time;

    }

    // 加载数据
    public loadData() {
        var data = this.luckInfo;
        // this.freeReward = data;
        // if(data.freeTimes > 0){
        //     this.redCircular.active = true;
        //     this.countLabel.string = data.freeTimes+'';
        // }else{
        //     this.redCircular.active = false;
        //     this.countLabel.string = "0";
        // }
    }
    /**初始化收费次数的界面 */
    public initViewData() {
        var data = this.luckConfig;

        // cc.log(this.luckInfo);

        if (this.luckInfo.vipTimes > 0) {
            this.btnStart.active = true;
            this.btnCountLabel.string = this.luckInfo.vipTimes + '';

        } else {
            for (let i = 0; i < this.payBtns.length; i++) {
                this.payBtns[i].active = true;
            }
            this.btnStart.active = false;

        }

        
        var level = this.luckInfo.level
        var award = data[level].award.split('|');
        if (this.luckInfo.remainTime > 0) {

            this.setCountDownNumber(this.luckInfo.remainTime)
            this.countDown.node.active = true;
            this.countDownLabel.active = true;

        }else{
            this.countDown.node.active = false;
            this.countDownLabel.active = false;
        }
        // cc.log(freeAward)
        for (var i = award.length - 1; i >= 0; i--) {
            var AwardItem = award[i];
            var nodeItem = this.getRewardItem();

            if (AwardItem.indexOf(';') > -1) { // 多个奖励
                // 说明只有一个，
                // cc.log(freeAwardItem)
                var rewardArr = AwardItem.replace(';', ',').split(',');
                // cc.log(rewardArr)
                var icon1 = getNodeChildByName(nodeItem, 'icon1', cc.Sprite)
                var icon2 = getNodeChildByName(nodeItem, 'icon2', cc.Sprite)
                var reward1 = getNodeChildByName(nodeItem, 'reward1', cc.Label)
                var reward2 = getNodeChildByName(nodeItem, 'reward2', cc.Label)
                ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${rewardArr[0]}`, icon1);
                ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${rewardArr[2]}`, icon2);
                reward1.string = "X" + rewardArr[1];
                reward2.string = "X" + rewardArr[3];

            } else { // 单个奖励
                var rewardArr = AwardItem.split(',');
                var icon1 = getNodeChildByName(nodeItem, 'icon1', cc.Sprite)
                var reward1 = getNodeChildByName(nodeItem, 'reward1', cc.Label)
                ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${rewardArr[0]}`, icon1);
                reward1.string = "X" + rewardArr[1];
            }
            nodeItem.active = true;
            nodeItem.parent = this.JiangPinDiLayout;

        }

       
    }

    /**
     * 加载奖励列表
     */


   

    //初始化任务对象池
    private initTaskPool() {
        this.taskPool = new cc.NodePool();
        for (let i = 0; i < 4; i++) {
            let taskNode = cc.find('img_JiangPinDi' + i, this.JiangPinDiLayout);
            this.taskPool.put(taskNode);
        }
    }

    private getRewardItem() {
        let enemy = null;
        if (this.taskPool.size() > 0) {
            enemy = this.taskPool.get();
        } else {
            enemy = cc.find('img_JiangPinDi', this.JiangPinDiLayout);
        }
        return enemy;
    }
}