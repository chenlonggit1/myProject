import { SimplePlayerVO } from "./SimplePlayerVO";
import { SimpleLotteryVO } from "./SimpleLotteryVO";
import { SimpleItemInfoVO } from "./SimpleItemInfoVO";
import { SimplePlayerMailVO } from "./SimplePlayerMailVO";
import { dispatchFEventWith } from "../../Framework/Utility/dx/dispatchFEventWith";
import { LobbyEvent } from "../Common/LobbyEvent";

export class PlayerVO extends SimplePlayerVO 
{
    public static ClassName:string = "PlayerVO";
    /**金币 */
    public gold:number = 0;
    /**钻石 */
    public diamond:number = 0;
    /**红包券 */
    public redPacket:number = 0;
    /**当前经验 */
    public levelExp:number = 0;
    /**升级经验 */
    public levelNeedExp:number = 0;

    /**玩家语言 中文/维语 */
    public isChinese:boolean = false;

    /**增加经验之前的数据 */
    public oldLevelExp:number = 0;
    /**升级之前的需要的经验总值 */
    public oldLevelNeedExp:number = 0;

    public token:string = "";

    /**
     * 0-模拟登录,1-通过code登录，2-通过access_token
     */
    public loginType:number = 0;

    /**道具数量 */
    public itemList:object[] = [];
    /**抽奖 */
    public lotteryList:SimpleLotteryVO[] = [];
    /**道具信息 */
    public itemInfoList:SimpleItemInfoVO[] = [];
    /**邮件信息 */
    public mailInfoList:SimplePlayerMailVO[] = [];
    /**抽奖ID */
    public lotteryIndex:number = 0;
    /** 公众号名称 */
    public pulicName: string = "Bilyartkulubi";

    public isShiming: boolean = false;

    /**是否打开公告 */
    public isOpenNotice:boolean = false;

    public reset()
    {
        super.reset();
    }

    //设置道具列表
    public setItemList(data)
    {
        if(data.length == 0) 
            this.itemList.push({"id":3001,"num":0});
        else 
            for(let i = 0; i < data.length; i++) {
                this.itemList.push(data[i]);
            }
    }

    //更新道具列表
    public updateItemList(data)
    {
        for(let i = 0; i < this.itemList.length; i++) {
            if(this.itemList[i]["id"] == data.id) {
                this.itemList[i]["num"] = data.num;
            }
        }
    }

    //更新抽奖列表
    public updateLotteryList(data)
    {
        let index = 0;
        this.lotteryList = [];
        for (let key in data) {
            this.lotteryList.push(new SimpleLotteryVO());
            this.lotteryList[index].update(data[key]);
            index++;
        }
    }

    //更新道具信息列表
    public updateItemInfoList(data)
    {
        let index = 0;
        this.itemInfoList = [];
        for (let key in data) {
            this.itemInfoList.push(new SimpleItemInfoVO());
            this.itemInfoList[index].update(data[key]);
            index++;
        }
    }

    //获取道具信息
    public getItemInfo(id:number)
    {
        for(let i = 0; i < this.itemInfoList.length; i++)
        {
            if(this.itemInfoList[i].id == id)
                return this.itemInfoList[i];
        }
        return null;
    }

    //更新邮件
    public updateMailInfo(data)
    {
        let index = 0;
        this.mailInfoList = [];
        for(let key in data) {
            this.mailInfoList.push(new SimplePlayerMailVO());
            this.mailInfoList[index].update(data[key]);
            this.mailInfoList[index].isAward = data[key].awards.length > 0;
            index++;
        }
        this.updateMailRedPoint();
    }

    //领取邮件
    public rewardMail(data) {
        for(let i = 0; i < data.length; i++) {
            this.mailInfoList[i].mailState = data[i].mailState;
        }
        this.updateMailRedPoint();
    }

    //新邮件
    public newMail(data) {
        let index = this.mailInfoList.length;
        this.mailInfoList.push(new SimplePlayerMailVO());
        this.mailInfoList[index].update(data);
        this.mailInfoList[index].isAward = data.awards.length > 0;
        this.updateMailRedPoint();
    }

    //更新红点
    public updateMailRedPoint()
    {
        let redPoint = false;
        for(let i = 0; i < this.mailInfoList.length; i++) {
            if(this.mailInfoList[i].isAward && this.mailInfoList[i].mailState < 2) {
                redPoint = true;
                break;
            }
        }
        dispatchFEventWith(LobbyEvent.Update_LobbyRedPoint,{type:1,isOpen:redPoint});
    }
}
