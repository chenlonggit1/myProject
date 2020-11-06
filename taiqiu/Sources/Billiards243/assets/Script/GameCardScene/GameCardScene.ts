import { FScene } from "../../Framework/Core/FScene";
import { GameCardMediator } from "./GameCardMediator";
import { Application } from "../../Framework/Core/Application";
import { ApplicationContext } from "../ApplicationContext";


const {ccclass, property} = cc._decorator;
/**
*@description:GameCardScene
**/
@ccclass
export default class GameCardScene extends FScene
{
    onLoad()
    {
        Application.Bootstrap(ApplicationContext,cc.v2(1792,828));
        super.onLoad();
    }
    start()
    {
        if(this.mediator==null)
            this.mediator = new GameCardMediator();
        super.start();
    }
}
