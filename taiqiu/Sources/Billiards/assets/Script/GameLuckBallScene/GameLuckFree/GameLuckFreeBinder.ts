import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { GameLayer } from "../../../Framework/Enums/GameLayer";
// import { SimpleLuckBallItamVO } from "../../VO/SimpleLuckBallItamVO";
import { GameLuckBallVO } from "../../VO/GameLuckBallVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../GameEvent";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { SimpleLuckTimesVO } from "../../VO/SimpleLuckTimesVO";
import { SimpleLuckBallItamVO } from "../../VO/SimpleLuckBallItamVO";


/**
*@description:幸运一球桌子模块
**/
export class GameLuckFreeBinder extends FBinder {

    private btn_GuanBi: cc.Node = null;
    private JiangPinDiLayout: cc.Node = null; // 奖励列表layout容器
    private luckConfig: SimpleLuckBallItamVO = null;
    private luckInfo: SimpleLuckTimesVO = null;
    
    private itemPool: cc.NodePool = null;
    private startBtn:cc.Node = null;
    private redCircular:cc.Node = null;
    private countLabel:cc.Label = null;
    private freeReward:any = null;//奖励数据
    public initViews() {
        super.initViews();
        var pupopBg = getNodeChildByName(this.asset, "bg");
        this.JiangPinDiLayout = getNodeChildByName(this.asset, "JiangPinDiLayout");
        this.luckConfig = GameDataManager.GetDictData(GameDataKey.GameLuckBall, GameLuckBallVO).gameLuckConfig;
        this.luckInfo = GameDataManager.GetDictData(GameDataKey.GameLuckBall, GameLuckBallVO).gameLuckTimes;

        this.btn_GuanBi = getNodeChildByName(pupopBg, "btn_GuanBi");
        this.startBtn = getNodeChildByName(pupopBg, "btn_MianFeiTiaoZhan");
        this.redCircular = getNodeChildByName(this.startBtn, "img_CiShuDi");
        this.countLabel = getNodeChildByName(this.redCircular, "count",cc.Label);
        
        this.btn_GuanBi.once(cc.Node.EventType.TOUCH_END, () => {
            dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.Game_LuckFreeChallenge, null, GameLayer.Popup);
            this.showCenterTip();

        }, this);
        this.startBtn.once(cc.Node.EventType.TOUCH_END, () => {
            dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.Game_LuckFreeChallenge, null, GameLayer.Popup);
            this.showLeftTopRaward();
        }, this);


        this.loadData();//渲染界面
        this.initTaskPool();

        this.initViewData();
    }  

    protected addEvents() {
        super.addEvents();
    }
    
    //显示左上角奖励
    public showLeftTopRaward() {
        dispatchFEventWith(GameEvent.Game_LuckInfo, { luckType: 1 });
        
        dispatchFEventWith(GameEvent.onFreeStartGame,this.freeReward);  

    }
    //显示中间下面的提示
    public showCenterTip() {
        dispatchFEventWith(GameEvent.Game_LuckInfo, { luckType: 1 });

        dispatchFEventWith(GameEvent.onFreeClosePupop,this.freeReward);
        
    }

    // 加载数据
    public loadData(){
        var data = this.luckInfo;
        this.freeReward = data;
        if(data.freeTimes > 0){
            this.redCircular.active = true;
            this.countLabel.string = data.freeTimes+'';
        }else{
            this.redCircular.active = false;
            this.countLabel.string = "0";
        }
    }

    /**初始化免费次数的界面 */
    public initViewData() {
        var data = this.luckConfig;
        
        // let Arr = [1,2,4,8];
        // for(let l =0;l<3;l++){
        //     cc.log(this.luckInfo.rewardFlag  >> Arr[l]& 1);

        // }
        // for(let i=0;i<this.luckInfo.rewardFlag;i++){

           

        // }
        var level = this.luckInfo.level;

        var freeAward = data[level].freeAward.split('|');
        var award = data[level].award.split('|');
        // cc.log(freeAward)
        for (var i = 0; i < freeAward.length; i++) {
            // for (var i = freeAward.length-1; i >= 0; i--) {
            var freeAwardItem = freeAward[i];
            var nodeItem = this.getRewardItem();

            if (freeAwardItem.indexOf(';') > -1) { // 多个奖励
                // 说明只有一个，
                var rewardArr = freeAwardItem.replace(';', ',').split(',');
                var icon1 = getNodeChildByName(nodeItem, 'icon1', cc.Sprite)
                var icon2 = getNodeChildByName(nodeItem, 'icon2', cc.Sprite)
                var reward1 = getNodeChildByName(nodeItem, 'reward1', cc.Label)
                var reward2 = getNodeChildByName(nodeItem, 'reward2', cc.Label)
                ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${rewardArr[0]}`, icon1);
                ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${rewardArr[2]}`, icon2);
                reward1.string = "X" + rewardArr[1];
                reward2.string = "X" + rewardArr[3];

            } else { // 单个奖励
                var rewardArr = freeAwardItem.split(',');
                var icon1 = getNodeChildByName(nodeItem, 'icon1', cc.Sprite)
                var reward1 = getNodeChildByName(nodeItem, 'reward1', cc.Label)
                ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${rewardArr[0]}`, icon1);
                reward1.string = "X" + rewardArr[1];
            }
            nodeItem.active = true;
            nodeItem.parent = this.JiangPinDiLayout;

        }



    }

    //初始化任务对象池
    private initTaskPool() {
        this.itemPool = new cc.NodePool();
        for (let i = 0; i < 3; i++) {
            let itemNode = cc.find('img_JiangPinDi' + i, this.JiangPinDiLayout);
            this.itemPool.put(itemNode);
        }
    }

    private getRewardItem() {
        let enemy = null;
        if (this.itemPool.size() > 0) {
            enemy = this.itemPool.get();
        } else {
            enemy = cc.find('img_JiangPinDi', this.JiangPinDiLayout);
        }
        return enemy;
    }

    
	

}