import { FBinder } from "../../../Framework/Core/FBinder";
import LumosEffect from "../../../Framework/Effects/LumosEffect";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { JTimer } from "../../../Framework/Timers/JTimer";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { getCamera } from "../../../Framework/Utility/dx/getCamera";
import { getLang } from "../../../Framework/Utility/dx/getLang";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { graySprite } from "../../../Framework/Utility/dx/graySprite";
import { CanvasOffset } from "../../Common/CanvasOffset";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { showPopup } from "../../Common/showPopup";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { GameEvent } from "../../GameEvent";
import { GoodsType } from "../../LobbyScene/PayModeModule/GoodsType";
import { PayOrder } from "../../Pay/PayOrder";
import { PopupType } from "../../PopupType";
import { GameLuckBallVO } from "../../VO/GameLuckBallVO";
import { GoodsItemVO } from "../../VO/GoodsItemVO";
import { ShopGoodsVo } from "../../VO/ShopGoodsVo";
import { SimpleLuckTimesVO } from "../../VO/SimpleLuckTimesVO";

 
/**
*@description:幸运一球桌子模块
**/ 
export class GameLuckInfoBinder extends FBinder {

    private freeTip: cc.Node = null; // 免费中间往下位置提示
    private chargeTip: cc.Node = null; // 收费中间往下位置提示
    private freeCountNode: cc.Node = null;// 免费次数小红点
    private freeCountLabel: cc.Label = null;//免费次数数量
    private freeStartBtn: cc.Node = null;//免费挑战按钮

    private chargeReward: cc.Node = null; // 左上角收费显示
    private freeReward: cc.Node = null; // 左上角免费显示
    private whiteCenter: cc.Node = null;// 白球中心点
    private rewardCenter: cc.Node[] = [];// 中奖区域
    private currentGrade: cc.Label = null;// 困难等级
    private gradeNode: cc.Node = null;// 困难等级
    private gameLuckReward: any = null;// 奖励数据
    private rewardCount: number = 4; // 免费是3个，收费是4 
    private camera: cc.Camera = null;
    private iregret: cc.Node = null;// 中间提示
    private regretLabel: cc.Label = null;// 中间提示的文字

    private gameLuckInfo: SimpleLuckTimesVO = null;// 用户的幸运一杆参数
    private luckType: number = 0;// 玩法类型
    private chargeGameStartBtn: cc.Node = null;// 收费弹窗里面的开始按钮
    private chargeCountLabel: cc.Label = null;
    private chargeBtns: cc.Node[] = [];//收费界面的购买按钮
    private chargeTimeLable: cc.Label = null;// 免费次数倒计时
    private redBallStopResult: number = 0;//红球停止后的当前位置
    private timer: JTimer = null; // 计时器相关
    private countDownCountLabel: number = 0;// 倒计时数字
    private timerNode: cc.Node = null;// 倒计时容器、
    private onChangeBallInfo: any = { ballsPos: {}, rewardCenter: {}, luckType: 0 };
    private chargeRewardItemNode: cc.Node[] = [];//收费奖励item
    private freeRewardItemNode: cc.Node[] = [];//收费奖励item
    private currentLevel: number = 0;// 当前等级
    private itemIndexArr: number[] = [1, 2, 4, 8];// 中环奖励
    private isStartedCharge = false;

    private hitRings = [];

    private Luck_Goods_data: GoodsItemVO[];

    public initViews() {
        super.initViews();
        this.camera = getCamera("3D Camera");
        this.freeTip = getNodeChildByName(this.asset, "freeTip");
        this.freeStartBtn = getNodeChildByName(this.freeTip, "btn");
        this.freeCountNode = getNodeChildByName(this.freeTip, "btn/countNode");
        this.freeCountLabel = getNodeChildByName(this.freeTip, "btn/countNode/count", cc.Label);
        this.iregret = getNodeChildByName(this.asset, "iregret");
        this.regretLabel = getNodeChildByName(this.iregret, "regretLabel", cc.Label);
        this.chargeTip = getNodeChildByName(this.asset, "chargeTip");
        this.chargeGameStartBtn = getNodeChildByName(this.chargeTip, "btn_start");
        this.chargeCountLabel = getNodeChildByName(this.chargeGameStartBtn, "countNode/count", cc.Label);
        this.chargeBtns[0] = getNodeChildByName(this.chargeTip, "btnLayout/ben_LvSe");
        this.chargeBtns[1] = getNodeChildByName(this.chargeTip, "btnLayout/btn_HongSe");
        this.chargeBtns[2] = getNodeChildByName(this.chargeTip, "btnLayout/btn_LanSe");
        this.chargeTimeLable = getNodeChildByName(this.chargeTip, 'labelbg/timeLabel', cc.Label);//收费提示中的倒计时
        this.timerNode = getNodeChildByName(this.chargeTip, 'labelbg')
        this.chargeReward = getNodeChildByName(this.asset, "chargeReward");
        this.freeReward = getNodeChildByName(this.asset, "freeReward");
        this.whiteCenter = getNodeChildByName(this.asset, "whiteCenter");
        this.gradeNode = getNodeChildByName(this.asset, "img_NanDuDi");
        this.currentGrade = getNodeChildByName(this.gradeNode, "grade", cc.Label);
        this.gameLuckReward = GameDataManager.GetDictData(GameDataKey.GameLuckBall, GameLuckBallVO).gameLuckConfig; // 奖励等级
        this.gameLuckInfo = GameDataManager.GetDictData(GameDataKey.GameLuckBall, GameLuckBallVO).gameLuckTimes;
        let btnCue = getNodeChildByName(this.asset, "btn_QiuGan");
		btnCue.on(cc.Node.EventType.TOUCH_END, ()=>{
			dispatchFEventWith(LobbyEvent.Open_CueInfo);
		}, this);
        // cc.log(this.gameLuckReward)
        for (var i = 1; i <= this.rewardCount; i++) 
        {
            let rN:cc.Node = getNodeChildByName(this.asset, "rewardCenter" + i);
            rN.scale = 0;
            this.rewardCenter.push(rN);
        }

        this.freeStartBtn.on(cc.Node.EventType.TOUCH_END, () => {
            this.freeTipStartBtn(); // 开始免费机会
        }, this);

        this.chargeGameStartBtn.on(cc.Node.EventType.TOUCH_END, () => {
            this.onChargeStartGame();// 开始收费机会
            this.updateRewardGray();
        }, this);

        let chatIcon = getNodeChildByName(this.asset,"btn_LiaoTian");
		chatIcon.on(cc.Node.EventType.TOUCH_END, ()=>{
			// dispatchFEventWith(LobbyEvent.Open_CueInfo);
			dispatchFEventWith( GameEvent.onShowChatWindow);
        }, this);
        
       
        let shopVo: ShopGoodsVo = GameDataManager.GetDictData(GameDataKey.ShopGoods);
        if(shopVo==null)return;
        this.Luck_Goods_data = shopVo.getItemsByType(GoodsType.Luck_Gan);
        for(let i = 0; i < this.chargeBtns.length; i++) { // 付费按钮
            let data;
            this.Luck_Goods_data && (data = this.Luck_Goods_data[i]);
            data && (this.chargeBtns[i].children[0].getComponent(cc.Label).string = getLang("Text_xyyg11",[data.price / 100,data.count]));
             
            this.chargeBtns[i].on(cc.Node.EventType.TOUCH_END, ()=> {
                
                if(!data) {
                    cc.error("=========幸运一杆 没有数据=======");
                    return;
                } 
                PayOrder(data.goodsId); 
            })
        }


 
    }
    //改变左上角的奖励状态
    private changeLeftTopReward(itemParent: cc.Node, freeFlag: number) {
        if (freeFlag == 0) return false;
        let resArr = this.returnRes(freeFlag)

        for (let i = 0; i < resArr.length; i++) {
            var item = getNodeChildByName(itemParent, 'lineItem' + resArr[i]);
            var rewardLayout = getNodeChildByName(item, 'rewardLayout');
            rewardLayout.active = false;
            var ready = getNodeChildByName(item, 'img_DuiHao');
            ready.active = true;
        }
    }

    private retLeftTopReward() {
        let target = this.itemIndexArr;
        for (let i = 0; i < this.chargeReward.childrenCount; i++) {
            var item = getNodeChildByName(this.chargeReward, 'lineItem' + target[i]);
            var rewardLayout = getNodeChildByName(item, 'rewardLayout');
            rewardLayout.active = true;
            var ready = getNodeChildByName(item, 'img_DuiHao');
            ready.active = false;
        }
        for (let i = 0; i < this.freeReward.childrenCount; i++) {
            var item = getNodeChildByName(this.freeReward, 'lineItem' + target[i]);
            var rewardLayout = getNodeChildByName(item, 'rewardLayout');
            rewardLayout.active = true;
            var ready = getNodeChildByName(item, 'img_DuiHao');
            ready.active = false;
        }
    }

 
    protected onStartTableEvent() {
        this.gradeNode.active = true;
        // cc.log("this.onChangeBallInfo====",this.onChangeBallInfo)
        dispatchFEventWith(GameEvent.onChangBallPos, this.onChangeBallInfo); // 向table传输数据，然后修改球的位置
    }





    protected addEvents() {
        super.addEvents();

        addEvent(this, GameEvent.onFreeStartGame, this.onFreeStartGame);
        addEvent(this, GameEvent.onFreeClosePupop, this.onFreeClosePupop);

        addEvent(this, GameEvent.onChargeStartGame, this.onChargeStartGame);
        addEvent(this, GameEvent.onChargeClosePupop, this.onChargeClosePupop);

        addEvent(this, GameEvent.onStartTableEvent, this.onStartTableEvent);
        addEvent(this, GameEvent.Game_LuckInfo, this.initGameLuckInfo);

        addEvent(this, GameEvent.onGameLuckResultInfo, this.onGameLuckResultInfo); //红球停止运动并且响应后
        addEvent(this, GameEvent.onGetRedBallStopResult, this.onGetRedBallStopResult); //红球停止运动后返回的当前位置

        addEvent(this, GameEvent.onGameLuckResultReward, this.onGameLuckResultReward); //红球停止运动后返回的当前位置


    }

    //接收到2016 中环后的奖励
    private onGameLuckResultReward(data: any) {
        // cc.log("2016==", data.data)

        if(data.data==null)
        {
            this.showCenterTip("Text_xyyg7")
        }else
        {
            showPopup(PopupType.GET_REWARD, {
                list: data.data.items,
                onConfirm: () => 
                {
                    this.updateRewardGray();
                    // this.onClosePopup();
                }
            }, false);
        }
    }


    // 收费弹窗关闭按钮事件
    private onChargeClosePupop() {
        this.chargeTip.active = true;

        this.chargeReward.active = true;
        this.freeReward.active = false;
        this.gradeNode.active = true;

        if (this.gameLuckInfo.vipTimes > 0) {
            this.chargeGameStartBtn.active = true;
            this.chargeCountLabel.string = this.gameLuckInfo.vipTimes + '';
        } else {
            for (let i = 0; i < this.chargeBtns.length; i++) {
                this.chargeBtns[i].active = true;
            }
            this.chargeGameStartBtn.active = false;
        }
        this.onShowHitCenter(0);// 
        
        if (this.gameLuckInfo.remainTime > 0) {
            this.setCountDownNumber(this.gameLuckInfo.remainTime);// 设置计时器
            this.timerNode.active = true;

        } else {
            this.timerNode.active = false;
        }

        this.showChargeReward();
    }

    /**
    * 
    * @param count 倒计时
    */
    private setCountDownNumber(count: number) {
        // let now: any = new Date().getTime()
        this.stopTimer();

        this.countDownCountLabel = count;
        this.chargeTimeLable.string = this.toHHmmss(this.countDownCountLabel)+""
        this.timer = this.addObject(JTimer.GetTimer(1000));
        this.timer.addTimerCallback(this, this.onTimeTick);
        this.timer.start();
    }
    private onTimeTick() {
        this.countDownCountLabel -= 1;
        if (this.countDownCountLabel == 0) {
            this.countDownCountLabel = 0;
            this.stopTimer()
        } else {
            this.chargeTimeLable.string = this.toHHmmss(this.countDownCountLabel) +""
        }
    }

    private stopTimer() {
        if (!this.timer) return;
        this.timer.reset();
    }

    private toHHmmss(data) {
        var day = Math.floor(data / (24 * 3600)); // Math.floor()向下取整 
        var hour = Math.floor((data - day * 24 * 3600) / 3600);
        var minute = Math.floor((data - day * 24 * 3600 - hour * 3600) / 60);
        var second = data - day * 24 * 3600 - hour * 3600 - minute * 60;
        var time = ((hour < 10) ? "0" + hour : hour) + ":" + ((minute < 10) ? "0" + minute : minute) + ":" + ((second < 10) ? "0" + second : second);
        // cc.log(time)
        return time;
    }

    //红球停止运动后返回的当前位置
    private onGetRedBallStopResult(data: any) 
    {
        this.redBallStopResult = data.data;
        if (this.redBallStopResult == 0) {
            this.showCenterTip("Text_xyyg7")
        }else
        {
            if(this.hitRings.indexOf(this.redBallStopResult-1)==-1)
                this.hitRings.push(this.redBallStopResult-1);
        }
    }

    private showCenterTip(text: string) {
        this.regretLabel.string = getLang(text);
        // this.regretLabel.string = text;
        cc.tween(this.iregret).to(
            0.5, { scale: 1 }, { easing: 'backOut' }
        ).start();
    }

    // 红球停止运动后会向服务器发送数据响应后
    private onGameLuckResultInfo(res: any) {
        // cc.log("2015===", res.data);
        let data = res.data;
        this.gameLuckInfo = data;
        if (data.level != this.currentLevel) { //判断是否晋级
            this.showCenterTip("Text_xyyg8")
            this.loadLeftTopReward(this.gameLuckReward[data.level])
            this.retLeftTopReward();
            this.hitRings.length = 0;
        } else {

        }
        
        this.changeLeftTopReward(this.freeReward, data.freeFlag);
        this.changeLeftTopReward(this.chargeReward, data.vipFlag);

        if (data.freeTimes > 0) {
            this.freeTip.active = true;
            this.freeCountNode.active = true;
            this.freeCountLabel.string = data.freeTimes + "";
            this.luckType = 1;

        } else {
            if(this.luckType==1)this.hitRings.length = 0;
            // 说明没有免费次数了，判断是否有收费次数
            this.luckType = 2;
            this.chargeTip.active = true;
            if (data.vipTimes > 0) {
                // 显示收费里面的开始游戏按钮
                this.chargeGameStartBtn.active = true;
                this.chargeCountLabel.string = data.vipTimes + '';
            } else {
                // 显示购买按钮
                for (let i = 0; i < this.chargeBtns.length; i++) {
                    this.chargeBtns[i].active = true;
                }
                this.chargeGameStartBtn.active = false;
            }
        }
        this.currentLevel = data.level
        this.currentGrade.string = this.currentLevel + ''; // 难度
        // 设置计时器
        // cc.log('data.remainTime==',data.remainTime)
        if (data.remainTime > 0) {
            this.timerNode.active = true;
            this.setCountDownNumber(data.remainTime);// 设置计时器
        } else {
            this.timerNode.active = false;

        }
        // cc.log(this.gameLuckReward,this.currentLevel)
        this.onChangeBallInfo.ballsPos = this.gameLuckReward[this.currentLevel];// 奖励等级
        this.onChangeBallInfo.rewardCenter = this.rewardCenter; // 中心点一般不变
        this.onChangeBallInfo.luckType = this.luckType;// 玩法类型
    }

    //显示收费奖励
    private showChargeReward() {

        for (let i = 0; i < this.chargeRewardItemNode.length; i++) {
            let item = this.chargeRewardItemNode[i];
            setTimeout(() => {
                cc.tween(item).to(0.8, { x: -167, opacity: 255 }).start()
            }, 100 * i);
        }

    }

    private showFreeReward() {
        for (let i = 0; i < this.freeRewardItemNode.length; i++) {
            let item = this.freeRewardItemNode[i];
            setTimeout(() => {
                cc.tween(item).to(0.8, { x: -167, opacity: 255 }).start()
            }, 100 * i);
        }
    }



    

    // 在mediator选择弹窗时，传入的玩法类型，免费或者收费
    protected initGameLuckInfo(data) {
        this.luckType = data.data.luckType;
        
        var data2 = this.gameLuckInfo;
        if (!data2) return false;
        // cc.log('initGameLuckInfoinitGameLuckInfoinitGameLuckInfo')
        this.loadReward(data2);

        if (data2.freeTimes > 0) {
            this.freeCountNode.active = true;
            this.freeCountLabel.string = data2.freeTimes + "";
        } else {
            this.freeCountNode.active = false;
        }
    }


    // 显示提示
    protected onFreeClosePupop() {
        // 这里显示后，但是控制不了
        this.freeTip.active = true;
        this.freeReward.active = true;

        this.chargeTip.active = false;
        this.chargeReward.active = false;
        this.gradeNode.active = true;

        this.onShowHitCenter(1);// 
        this.showFreeReward();
    }

    // 这是点击免费挑战的响应
    private onFreeStartGame() {
        this.freeReward.active = true;
        this.onShowHitCenter(1);// 
        this.showFreeReward();
        this.onStartTableEvent();

    }


    protected updateRewardGray()
    {
        console.log("更新灰度图====>",this.hitRings);
        
        for (let i = 0; i < this.rewardCenter.length; i++) 
        {
            let sp = this.rewardCenter[i].getComponent(cc.Sprite);
            sp.enabled = false;
            setTimeout(() => 
            {
                graySprite(this.hitRings.indexOf(i)!=-1,sp);
                sp.enabled = true;
            }, 0);
        }
    }
    private onChargeStartGame() 
    {
        //显示收费奖励
        this.chargeTip.active = false;
        this.chargeReward.active = true;
        this.freeReward.active = false;
        this.freeTip.active = false;
        // 这里要重置球的位置
        for (let i = 0; i < this.rewardCenter.length; i++) 
        {
            let hitReward = getNodeChildByName(this.rewardCenter[i], 'hitReward', LumosEffect);
            hitReward.onDisable();
            var node = getNodeChildByName(this.rewardCenter[i], 'hitReward')
            node.opacity = 0;
        }
        this.iregret.setScale(0)
        this.onShowHitCenter(0);// 
        this.onStartTableEvent();
        this.showChargeReward();
        
    }
    private freeTipStartBtn() {
        this.freeTip.active = false;
        this.chargeTip.active = false;
        this.iregret.setScale(0)

        // 这里要重置球的位置
        for (let i = 0; i < this.rewardCenter.length; i++) 
        {
            let hitReward = getNodeChildByName(this.rewardCenter[i], 'hitReward', LumosEffect);  
            hitReward.onDisable();
            var node = getNodeChildByName(this.rewardCenter[i], 'hitReward')
            node.opacity = 0;
        }
        this.onStartTableEvent();
    }

    private onShowHitCenter(count) 
    {
        for (let i = 0; i < this.rewardCenter.length - count; i++) {
            let item = this.rewardCenter[i]
            setTimeout(() => 
            {
                cc.tween(item).to(
                    1, { scale: 1 }, { easing: 'backOut' }
                ).start();
            }, 100 * i)
        }
    }

    //渲染info的奖励
    private loadReward(data: any) {
        this.currentLevel = data.level;// 当前等级
        // cc.log(this.gameLuckReward,level)
        var reward = this.gameLuckReward[this.currentLevel]; //  直接渲染免费和收费的
        var whiteBall = reward.whiteBall.split(',');
        whiteBall = cc.v3(whiteBall[0], 5.78, whiteBall[1]);
        var white2dPos: any = this.camera.getWorldToScreenPoint(whiteBall);
        white2dPos = cc.v2(white2dPos.x, white2dPos.y).sub(CanvasOffset.Offset);

        this.whiteCenter.x = white2dPos.x - cc.view.getVisibleSize().width / 2;;
        this.whiteCenter.y = white2dPos.y - cc.view.getVisibleSize().height / 2;

        var centerPosition = reward.centerPosition.split(',')
        var centerPosition = reward.centerPosition.split(',')
        var centerSize = reward.radius.split(',')

        for (var i = 0; i < this.rewardCenter.length; i++) {
            this.rewardCenter[i].x = centerPosition[0];
            this.rewardCenter[i].y = centerPosition[1];
            this.rewardCenter[i].setContentSize(parseInt(centerSize[i]), parseInt(centerSize[i]))
        }

        this.loadLeftTopReward(reward)

        this.changeLeftTopReward(this.freeReward, data.freeFlag);
        this.changeLeftTopReward(this.chargeReward, data.vipFlag);

        
        this.currentGrade.string = this.currentLevel + "";

        this.onChangeBallInfo.ballsPos = this.gameLuckReward[this.currentLevel];
        this.onChangeBallInfo.rewardCenter = this.rewardCenter;
        this.onChangeBallInfo.luckType = this.luckType
        // cc.log('this.onChangeBallInfo')
        dispatchFEventWith(GameEvent.onChangBallPos, this.onChangeBallInfo); // 向table传输数据，然后修改球的位置
    }

    // 渲染左上角的奖励
    private loadLeftTopReward(reward:any){
        var freeAward = reward.freeAward.split('|');
        var award = reward.award.split('|');

        for (var i = 0; i < freeAward.length; i++) {
            // for (var i = freeAward.length-1; i >= 0; i--) { // 倒序
            var freeAwardItem = freeAward[i];
            let itemIndexArr = this.itemIndexArr;
            var item = getNodeChildByName(this.freeReward, 'lineItem' + itemIndexArr[i]);
            this.freeRewardItemNode.push(item);
            var rewardLayout = getNodeChildByName(item, 'rewardLayout');
            if (freeAwardItem.indexOf(';') > -1) { // 多个奖励
                var rewardArr = freeAwardItem.replace(';', ',').split(',');
                var icon1 = getNodeChildByName(rewardLayout, 'icon1', cc.Sprite);
                var icon2 = getNodeChildByName(rewardLayout, 'icon2', cc.Sprite);
                var reward1 = getNodeChildByName(rewardLayout, 'label1', cc.Label);
                var reward2 = getNodeChildByName(rewardLayout, 'label2', cc.Label);
                ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${rewardArr[0]}`, icon1);
                ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${rewardArr[2]}`, icon2);
                reward1.string = "X" + rewardArr[1];
                reward2.string = "X" + rewardArr[3];
            } else {
                var rewardArr = freeAwardItem.split(',');
                var icon1 = getNodeChildByName(rewardLayout, 'icon1', cc.Sprite);
                var reward1 = getNodeChildByName(rewardLayout, 'label1', cc.Label);
                ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${rewardArr[0]}`, icon1);
                reward1.string = "X" + rewardArr[1];
            }
            item.active = true;
        }
        for (var i = 0; i < award.length; i++) 
        {
            var awardItem = award[i];
            let itemIndexArr = this.itemIndexArr;
            var item = getNodeChildByName(this.chargeReward, 'lineItem' + itemIndexArr[i]);
            this.chargeRewardItemNode.push(item);
            var rewardLayout = getNodeChildByName(item, 'rewardLayout');
            if (awardItem.indexOf(';') > -1) { // 多个奖励
                var rewardArr = awardItem.replace(';', ',').split(',');
                var icon1 = getNodeChildByName(rewardLayout, 'icon1', cc.Sprite);
                var icon2 = getNodeChildByName(rewardLayout, 'icon2', cc.Sprite);
                var reward1 = getNodeChildByName(rewardLayout, 'label1', cc.Label);
                var reward2 = getNodeChildByName(rewardLayout, 'label2', cc.Label);
                ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${rewardArr[0]}`, icon1);
                ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${rewardArr[2]}`, icon2);
                reward1.string = "X" + rewardArr[1];
                reward2.string = "X" + rewardArr[3];
            } else {
                var rewardArr = awardItem.split(',');
                var icon1 = getNodeChildByName(rewardLayout, 'icon1', cc.Sprite);
                var reward1 = getNodeChildByName(rewardLayout, 'label1', cc.Label);
                ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${rewardArr[0]}`, icon1);
                reward1.string = "X" + rewardArr[1];
            }
            item.active = true;

        }
    }


    /** 不懂计算，写死了吧 */
    private returnRes(flag: number) {
        let result = [], target = this.itemIndexArr;
        target.forEach(num => {
            if (flag & num) {
                result.push(num)
            }
        })
        return result;
    }
}