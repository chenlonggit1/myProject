import { FObject } from "../../Framework/Core/FObject";
import { C_NewGuide_UpdateGuide } from "../Networks/Clients/C_NewGuide_UpdateGuide";


export class NewPlayerVO extends FObject
{
    _curGuideeIdx: number = 0;

    get curGuideeIdx () {
        return this._curGuideeIdx;
    }

    set curGuideeIdx(idx: number) {
        this._curGuideeIdx = idx;
        if(idx >= 5) { // 训练
            this.data["train"] = true;
        }
        // this.sysnServer();
    }

    get isNeedTrain() {
        // return false;
        return !this.data["train"];
    }

    get isNeedTask() {
        return !this.data["task"];
    }

    get isNeedGan() {
        return !this.data["ganWH"];
    }

    get isNeedGanUp() {
        return !this.data["ganUp"];
    }

    isNeedGuide: boolean = true;
    isDebug: boolean = true;
    data: any={};

    gameId : number = 1;
    changId: number = 1;
    moneyId: number = 1;
    private _gan_whIdx: number = 101;
    private _gan_upradeIdx: number = 201;

    get gan_whIdx() {
        return this._gan_whIdx
    }

    set gan_whIdx(idx: number) {
        if(idx <  this._gan_whIdx) {
            cc.warn("gan_whIdx数据有问题");
            return;
        }
        this.data["wh"] = idx;
        this._gan_whIdx = idx;
        if(idx % 100 > 3) {
        this.data["ganWH"] = true;
        } 
    }

    get gan_upradeIdx() {
        return this._gan_upradeIdx
    }

    set gan_upradeIdx(idx: number) {
        if(idx <  this._gan_upradeIdx) {
            cc.warn("gan_upradeIdx数据有问题");
            return;
        }
        this.data["upgrade"] = idx;
        this._gan_upradeIdx = idx;
        if(idx % 100 > 3) {
            this.data["ganUp"] = true;
        } 
    }
    public updateData(steps: string) {
        this.data = {};
        console.log("==========新手引导数据======"+ steps)
        if(!steps) {
            // this.resetData();
            this.isNeedGuide = false;
            return;
        }
        let data = JSON.parse(steps);
        if(!Object.keys(data).length) {
            this.resetData();
            return;
        }
        this.data = data;
        this._gan_whIdx = this.data["wh"] || 101;
        this._gan_upradeIdx = this.data["upgrade"] || 201;

        if(data["train"] && data["ganWH"] && data["ganUp"]) { 
            this.isNeedGuide = false;
        }
    } 


    sysnServer() {
        this.data["guideIdx"] = this._curGuideeIdx;
        let data = JSON.stringify(this.data);
       
        cc.log("====同步新手引导数据===",data);
        C_NewGuide_UpdateGuide.Send(data);
        this.updateData(data);
    }


    resetData() {
        this.data = {};
        this._curGuideeIdx = 0;
        this._gan_whIdx = 101;
        this._gan_upradeIdx = 201;
    }

}
