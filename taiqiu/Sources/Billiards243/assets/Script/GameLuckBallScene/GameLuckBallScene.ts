import { Application } from "../../Framework/Core/Application";
import { FScene } from "../../Framework/Core/FScene";
import { ApplicationContext } from "../ApplicationContext";
import { GameLuckBallMediator } from "./GameLuckBallMediator";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameLuckBallScene extends FScene
{
    onLoad()
    {
        Application.Bootstrap(ApplicationContext,cc.v2(1792,828));
        super.onLoad();
    }
    start()
    {
        if(this.mediator==null)
            this.mediator = new GameLuckBallMediator();
        super.start();
    }
}
