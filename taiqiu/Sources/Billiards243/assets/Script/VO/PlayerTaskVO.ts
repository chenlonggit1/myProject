import { FObject } from "../../Framework/Core/FObject";
import { SimplePlayerTaskVO } from "./SimplePlayerTaskVO";
import { SimpleActiveTaskVO } from "./SimpleActiveTaskVO";
import { SimpleMatchVO } from "./SimpleMatchVO";
import { dispatchFEventWith } from "../../Framework/Utility/dx/dispatchFEventWith";
import { LobbyEvent } from "../Common/LobbyEvent";

export class PlayerTaskVO extends FObject
{
    public static ClassName:string = "PlayerTaskVO";

    //每日任务
    public dailyTasks:SimplePlayerTaskVO[] = [];
    //每周任务
    public weekTasks:SimplePlayerTaskVO[] = [];
    //成长任务
    public growthTasks:SimplePlayerTaskVO[] = [];
    //所有成长任务
    public allGrowthTasks:SimplePlayerTaskVO[] = [];
    //日活跃
    public dailyActiveTasks:SimpleActiveTaskVO[] = [];
    //周活跃
    public weekActiveTasks:SimpleActiveTaskVO[] = [];
    //场次
    public selectMatchs:SimpleMatchVO[] = [];
    //当前活跃度
    public currentActive:number = 0;
    //活跃领取状态
    public activeStatus:number = 0;
    //每日活跃度
    public dailyActive:number = 0;
    //每日活跃领取状态
    public dailyActiveStatus:number = 0;
    //每周活跃度
    public weekActive:number = 0;
    //每周活跃领取状态
    public weekActiveStatus:number = 0;
    //玩家任务红点
    public playRedPoint:boolean = false;
    //任务红点
    public taskRedPoint:boolean[] = [false,false,false];

    //更新每日任务
    public updateDailyTasks(data):void
    {
        let isPush = this.dailyTasks.length == 0;
        if (isPush) {
            let index = 0;
            for (let key in data) {
                this.dailyTasks.push(new SimplePlayerTaskVO());
                this.dailyTasks[index].update(data[key]);
                index++;
            }
        } else {
            for(let i = 0; i < data.length; i++) {
                for(let j = 0; j < this.dailyTasks.length; j++){
                    if(this.dailyTasks[j].taskId == data[i].taskId){
                        this.dailyTasks[j].id = data[i].id;
                        this.dailyTasks[j].taskType = data[i].taskType;
                        this.dailyTasks[j].state = data[i].state;
                        this.dailyTasks[j].currentProgress = data[i].conditions.length == 0 ? 0 : data[i].conditions[0].progress;
                        this.dailyTasks[j].sortState = this.setTaskSort(data[i].state);
                    }
                }
            }
        }
        this.getAllRedPoint();
    }

    //更新每周任务
    public updateWeekTasks(data):void
    {
        let isPush = this.weekTasks.length == 0;
        if (isPush) {
            let index = 0;
            for (let key in data) {
                this.weekTasks.push(new SimplePlayerTaskVO());
                this.weekTasks[index].update(data[key]);
                index++;
            }
        } else {
            for(let i = 0; i < data.length; i++) {
                for(let j = 0; j < this.weekTasks.length; j++){
                    if(this.weekTasks[j].taskId == data[i].taskId){
                        this.weekTasks[j].id = data[i].id;
                        this.weekTasks[j].taskType = data[i].taskType;
                        this.weekTasks[j].state = data[i].state;
                        this.weekTasks[j].currentProgress = data[i].conditions.length == 0 ? 0 : data[i].conditions[0].progress;
                        this.weekTasks[j].sortState = this.setTaskSort(data[i].state);
                    }
                }
            }
        }
        this.getAllRedPoint();
    }

    //更新所有成长任务
    public updateAllGrowthTasks(data):void
    {
        let index = 0;
        for (let key in data) {
            this.allGrowthTasks.push(new SimplePlayerTaskVO());
            this.allGrowthTasks[index].update(data[key]);
            index++;
        }
    }

    //更新成长任务
    public updateGrowthTasks(data):void
    {
        for(let i = 0; i < data.length; i++) {
            for(let j = 0; j < this.allGrowthTasks.length; j++){
                if(this.allGrowthTasks[j].taskId == data[i].taskId && !this.getIsGrowthTask(data[i].taskId)){
                    this.growthTasks.push(this.allGrowthTasks[j]);
                    break;
                }
            }
        }
        for(let i = 0; i < data.length; i++) {
            for(let j = 0; j < this.growthTasks.length; j++){
                if(this.growthTasks[j].taskId == data[i].taskId){
                    this.growthTasks[j].id = data[i].id;
                    this.growthTasks[j].taskType = data[i].taskType;
                    this.growthTasks[j].state = data[i].state;
                    this.growthTasks[j].currentProgress = data[i].conditions.length == 0 ? 0 : data[i].conditions[0].progress;
                    this.growthTasks[j].sortState = this.setTaskSort(data[i].state);
                }
            }
        }
        this.getAllRedPoint();
    }

    /**
     * 处理任务排序
     * @param state 完成状态 0未完成 1未领取 2已领取
     * return 客户端排序 0未领取 1未完成 2已领取
     */
    public setTaskSort(state){
        if(state == 0)
            return 1;
        else if(state == 1)
            return 0;
        return 2;
    }

    //判断是否有成长任务
    public getIsGrowthTask(taskId):boolean
    {
        for(let j = 0; j < this.growthTasks.length; j++){
            if(this.growthTasks[j].taskId == taskId) {
                return true;
            }
        }
        return false;
    }

    //添加新任务
    public addNewTask(data):void
    {
        // this.growthTasks = [];
        for(let j = 0; j < this.allGrowthTasks.length; j++){
            if(this.allGrowthTasks[j].taskId == data.taskId){
                this.growthTasks.push(this.allGrowthTasks[j]);
                break;
            }
        }
        for(let j = 0; j < this.growthTasks.length; j++){
            if(this.growthTasks[j].taskId == data.taskId){
                this.growthTasks[j].id = data.id;
                this.growthTasks[j].taskType = data.taskType;
                this.growthTasks[j].state = data.state;
                this.growthTasks[j].currentProgress = data.conditions.length == 0 ? 0 : data.conditions[0].progress;
                this.growthTasks[j].sortState = this.setTaskSort(data.state);
            }
        }
        this.getAllRedPoint();
    }

    //领取奖励
    public getAward(data):void
    {
        if(data.taskType == 1) {
            for(let i = 0; i < this.dailyTasks.length; i++){
                if(this.dailyTasks[i].id == data.id) {
                    this.dailyTasks[i].state = 2;
                    this.dailyTasks[i].sortState = 2;
                    break;
                }
            }
        }else if(data.taskType == 2) {
            for(let i = 0; i < this.weekTasks.length; i++){
                if(this.weekTasks[i].id == data.id) {
                    this.weekTasks[i].state = 2;
                    this.weekTasks[i].sortState=2;
                    break;
                }
            }
        }else if(data.taskType == 3) {
            for(let i = 0; i < this.growthTasks.length; i++){
                if(this.growthTasks[i].id == data.id) {
                    this.growthTasks.splice(i,1);
                    break;
                }
            }
        }
        this.getAllRedPoint();
    }

    //更新日活跃
    public updateDailyActiveTasks(data):void
    {
        let isPush = this.dailyActiveTasks.length == 0;
        if (isPush) {
            let index = 0;
            for (let key in data) {
                this.dailyActiveTasks.push(new SimpleActiveTaskVO());
                this.dailyActiveTasks[index].update(data[key]);
                index++;
            }
        } 
        this.getAllRedPoint();
    }

    //更新周活跃
    public updateWeekActiveTasks(data):void
    {
        let isPush = this.weekActiveTasks.length == 0;
        if (isPush) {
            let index = 0;
            for (let key in data) {
                this.weekActiveTasks.push(new SimpleActiveTaskVO());
                this.weekActiveTasks[index].update(data[key]);
                index++;
            }
        } 
        this.getAllRedPoint();
    }

    //更新场次
    public updateSelectMatchs(data):void
    {
        let index = 0;
        this.selectMatchs = [];
        for (let key in data) {
            this.selectMatchs.push(new SimpleMatchVO());
            this.selectMatchs[index].update(data[key]);
            index++;
        }
    }

    //更新单个任务
    public updateSingleTask(data) {
        if(data.taskType == 1) {
            for(let j = 0; j < this.dailyTasks.length; j++){
                if(this.dailyTasks[j].taskId == data.taskId)
                    this.dailyTasks[j].state = data.state;
            }
        } else if(data.taskType == 2) {
            for(let j = 0; j < this.weekTasks.length; j++){
                if(this.weekTasks[j].taskId == data.taskId)
                    this.weekTasks[j].state = data.state;
            }
        } else if(data.taskType == 3) {
            for(let j = 0; j < this.growthTasks.length; j++){
                if(this.growthTasks[j].taskId == data.taskId)
                    this.growthTasks[j].state = data.state;
            }
        }
        this.getAllRedPoint();
    }

    //获取单个红点
    public getRedPoint(type):boolean {
        if(type == 1) {
            for(let j = 0; j < this.dailyTasks.length; j++) {
                if(this.dailyTasks[j].state == 1) return true;
            }
            for(let j = 0; j < this.dailyActiveTasks.length; j++) {
                let isGet = this.dailyActiveStatus >> (j+1) & 1;
                if(!isGet && this.dailyActive >= this.dailyActiveTasks[j].milepost) {
                    return true;
                }
            }
        } else if(type == 2) {
            for(let j = 0; j < this.weekTasks.length; j++) {
                if(this.weekTasks[j].state == 1) return true;
            }
            for(let j = 0; j < this.weekActiveTasks.length; j++) {
                let isGet = this.weekActiveStatus >> (j+1) & 1;
                if(!isGet && this.weekActive >= this.weekActiveTasks[j].milepost) {
                    return true;
                }
            }
        } else if(type == 3) {
            for(let j = 0; j < this.growthTasks.length; j++) {
                if(this.growthTasks[j].state == 1) return true;
            }
        }
        return false;
    }

    //查询所有任务红点
    public getAllRedPoint()
    {
        let result = false;
        let temp = JSON.parse(JSON.stringify(this.taskRedPoint));
        for(let i = 0; i < 3; i++) {
            let val = this.getRedPoint(i+1);
            this.taskRedPoint[i] = val;
            if(val) result = true;
        }
        if(JSON.stringify(temp) != JSON.stringify(this.taskRedPoint)) {
            dispatchFEventWith(LobbyEvent.Update_TaskRedPoint);
        }
        // if(this.playRedPoint == result) return;
        this.playRedPoint = result;
        dispatchFEventWith(LobbyEvent.Update_LobbyRedPoint,{type:2,isOpen:result});
    }
}
