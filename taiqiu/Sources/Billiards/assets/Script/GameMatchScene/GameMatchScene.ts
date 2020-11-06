import { FScene } from "../../Framework/Core/FScene";
import { GameMatchMediator } from "./GameMatchMediator";
const {ccclass, property} = cc._decorator;

@ccclass
export default class GameMatchScene extends FScene 
{
    start()
    {
        if(this.mediator==null)
            this.mediator = new GameMatchMediator();
        super.start();
    }
}
