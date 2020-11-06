import { FObject } from "../../Framework/Core/FObject";
import { SimplePlayerCueVO } from "./SimplePlayerCueVO";
import { SimpleCueUpgrade } from "./SimpleCueUpgrade";
import { dispatchFEventWith } from "../../Framework/Utility/dx/dispatchFEventWith";
import { LobbyEvent } from "../Common/LobbyEvent";

export class PlayerCueVO extends FObject
{
    public static ClassName:string = "PlayerCueVO";

    public myCues:SimplePlayerCueVO[] = [];
    public allCues:SimplePlayerCueVO[] = [];
    public cuesUpgrade:SimpleCueUpgrade[] = [];
    //更新我的球杆
    public updateMyCues(data):void
    {
        if (data.playerCue.length == 0) this.myCues = [];

        for (let i = 0; i < data.playerCue.length; i++) {
            let cueIndex = data.playerCue[i].cueID;
            let index = this.getMyHasCue(cueIndex);
            let myCue = this.getCue(cueIndex);
            let cueInfo = this.getCueById(cueIndex);
            if(index > -1) {
                let isUse = this.myCues[index].isUse;
                this.myCues[index].update(myCue);
                this.myCues[index].id = data.playerCue[i].id;
                this.myCues[index].defendTimes = data.playerCue[i].defendTimes;
                this.myCues[index].defendDay = data.playerCue[i].defendDay;
                this.myCues[index].isUse = isUse;
                this.myCues[index].star = data.playerCue[i].grade;
                this.myCues[index].cueID = data.playerCue[i].cueID;
                this.myCues[index].quality = cueInfo.quality;
            } else {
                this.myCues.push(new SimplePlayerCueVO());
                this.myCues[this.myCues.length-1].update(myCue);
                this.myCues[this.myCues.length-1].id = data.playerCue[i].id;
                this.myCues[this.myCues.length-1].defendTimes = data.playerCue[i].defendTimes;
                this.myCues[this.myCues.length-1].defendDay = data.playerCue[i].defendDay;
                this.myCues[this.myCues.length-1].star = data.playerCue[i].grade;
                this.myCues[this.myCues.length-1].cueID = data.playerCue[i].cueID;
                this.myCues[this.myCues.length-1].isUse = data.playerCue[i].isUse;
                this.myCues[this.myCues.length-1].quality = cueInfo.quality;
            }
        }
        this.getMyDeleteCue(data.playerCue);
        this.checkRedpoint();
    }

    //获取自己是否移除球杆
    public getMyDeleteCue(data):number
    {
        let result = -1;
        let cueList1 = [];
        let cueList2 = [];
        let cuelist = [];
        for(let i = 0; i < this.myCues.length; i++) {
            cueList1.push(this.myCues[i].cueID);
        }
        for (let j = 0; j < data.length; j++) {
            cueList2.push(data.cueID);
        }
        for(let i = 0; i < cueList1.length; i++) {
            if(cueList2.indexOf(cuelist[1]) < 0) {
                cuelist.push(cueList1[i]);
            }
        }
        for(let i = 0; i < this.myCues.length; i++) {
            for (let j = 0; j < cuelist.length; j++) {
                if(this.myCues[i].cueID == cuelist[j]) {
                    this.myCues.splice(i,1);
                    i--;
                }
            }
        }
        return result;
    }
    //获取自己是否有球杆
    public getMyHasCue(cueID):number
    {
        let result = -1;
        for(let i = 0; i < this.myCues.length; i++) {
            if(Math.floor(this.myCues[i].cueID / 100) == Math.floor(cueID / 100)){
                return i;
            }
        }
        return result;
    }
    //获取自己是否有球杆
    public getIsMyHasCue(cueID):number
    {
        let result = -1;
        for(let i = 0; i < this.myCues.length; i++) {
            if(Math.floor(this.myCues[i].cueID / 100) == Math.floor(cueID / 100)){
                return i;
            }
        }
        return result;
    }
    //升级单个球杆
    public upgradeSignleCues(data):void
    {
        for(let i = 0; i < this.myCues.length; i++) {
            if(this.myCues[i].id == data.id) {
                this.myCues[i].cueID = data.cueID;
                let myCue = this.getCueById(data.cueID);
                this.myCues[i].quality = myCue.quality;
                this.myCues[i].star = myCue.star;
                break;
            }
        }
    }
    //维护球杆
    public defendCues(data):void
    {
        for(let i = 0; i < this.myCues.length; i++) {
            if(this.myCues[i].id == data.id) {
                this.myCues[i].defendTimes = data.defendTimes;
                this.myCues[i].defendDay = data.defendDay;
                break;
            }
        }
    }
    //获取我的球杆
    public getMyCueByCueID(cueID):SimplePlayerCueVO
    {
        for(let i = 0; i < this.myCues.length; i++) {
            if(this.myCues[i].cueID == cueID) {
                return this.myCues[i];
            }
        }
        return null;
    }

    //使用球杆
    public useCue(data):void
    {
        for(let i = 0; i < this.myCues.length; i++) {
            this.myCues[i].isUse = this.myCues[i].id == data.id;
        }
        this.checkRedpoint();
    }
    //更新所有球杆
    public updateAllCues(data):void
    {
        let index = 0;
        this.allCues = [];
        for (let key in data) {
            this.allCues.push(new SimplePlayerCueVO());
            this.allCues[index].update(data[key]);
            this.allCues[index].cueID = Number(key);
            index++;
        }
    }
    //更新球杆升级信息
    public updateCueUpgrade(data):void
    {
        let index = 0;
        this.cuesUpgrade = [];
        for (let key in data) {
            this.cuesUpgrade.push(new SimpleCueUpgrade());
            this.cuesUpgrade[index].update(data[key]);
            this.cuesUpgrade[index].cueID = Number(key);
            index++;
        }
    }

    //获取球杆
    public getCue(cueID):SimplePlayerCueVO
    {
        for(let i = 0; i < this.allCues.length; i++){
            if(Math.floor(this.allCues[i].cueID / 100) == Math.floor(cueID / 100)){
                return this.allCues[i];
            }
        }
        return null;
    }

    //获取我的球杆
    public getCueById(cueID):SimpleCueUpgrade
    {
        for(let i = 0; i < this.cuesUpgrade.length; i++) {
            if(this.cuesUpgrade[i].cueID == cueID){
                return this.cuesUpgrade[i];
            }
        }
        return null;
    }

    //获取我的球杆升级
    public getCueUpgradeById(cueID):SimpleCueUpgrade
    {
        for(let i = 0; i < this.cuesUpgrade.length; i++){
            if(this.cuesUpgrade[i].cueID == cueID + 1){
                return this.cuesUpgrade[i];
            }
        }
        for(let i = 0; i < this.cuesUpgrade.length; i++){
            if(this.cuesUpgrade[i].cueID == cueID){
                return this.cuesUpgrade[i];
            }
        }
        return null;
    }

    //卖出球杆
    public sellCue(id):void
    {
        for (let i = 0; i < this.myCues.length; i++) {
            if(this.myCues[i].id == id){
                this.myCues.splice(i,1);
                break;
            }
        }
    }

    //获取我使用的球杆
    public getMyUseCue():SimplePlayerCueVO
    {
        for(let i = 0; i < this.myCues.length; i++) {
			if(this.myCues[i].isUse) {
				return this.myCues[i];
			}
		}
        return null
    }

    //获取球杆资源
    public getCueRes(cueID):number
    {
        for(let i = 0; i < this.allCues.length; i++){
            if(this.allCues[i].cueID == cueID){
                return this.allCues[i].cueRes;
            }
        }
        return 1;
    }

    private checkRedpoint() {
        let cue = this.getMyUseCue();
        if(cue) {
            dispatchFEventWith(LobbyEvent.Update_LobbyRedPoint,{type:3,isOpen:cue.isNeedDefend()});
        }
    }
}
