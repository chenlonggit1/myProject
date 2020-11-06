import { FObject } from "../../Framework/Core/FObject";
import { SignDayVO } from "./SignDayVO";
import { S2C_SignIfo } from "../Networks/Protobuf/billiard_pb";

export class SignActivityVO extends FObject
{
    public static ClassName:string = "SignActivityVO";
    /** 是否可以签到 */
    public isSignIn: boolean = false;
    
    /** 每天签到情况 */
    public signList: SignDayVO[] = [];

    updateData(data: S2C_SignIfo) {
        let list = data.awards;
        this.isSignIn = data.signStatus;
        this.signList = [];
        for(let i = 0; i < list.length; i++) {
            let day = new SignDayVO();
            let dayS2c =  list[i];
            day.day = dayS2c.signDay;
            day.count = dayS2c.gold || dayS2c.diamond;
            day.awards = dayS2c.awards;
            if(dayS2c.gold) { // 有金币
                day.type = 1;
            } else {
                day.type = 2;
            }   
            day.day <= data.signDayCount && (day.state = true);
            this.signList.push(day);
        }

        if(data.signDayCount >= data.awards.length) {
            this.isSignIn = false;
        }
    }

    getCurSignDay() {
        let day:SignDayVO = null;
        for(let i = 0; i <  this.signList.length; i++) {
            if(!this.signList[i].state) {
                day = this.signList[i];
                break;
            }
        }
        return day;
    }

}
