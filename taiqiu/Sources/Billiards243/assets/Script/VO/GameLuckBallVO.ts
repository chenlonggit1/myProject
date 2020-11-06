import { FObject } from "../../Framework/Core/FObject";

import { SimpleLuckBallItamVO } from "./SimpleLuckBallItamVO";
import { SimpleLuckTimesVO } from "./SimpleLuckTimesVO";


export class GameLuckBallVO extends FObject {
    public static className:string = "GameLuckBallVO";
   
    public gameLuckConfig:SimpleLuckBallItamVO[] = [];// 存储幸运一击的数据
    public gameLuckTimes:SimpleLuckTimesVO = null;// 存储用户免费收费机会info

    
    public addData(data){
        this.gameLuckConfig = data;
    }

    public addLuckTimes(data:any){

        this.gameLuckTimes = data;
    }
}