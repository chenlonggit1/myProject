import { Application } from "../../Framework/Core/Application";
import { FScene } from "../../Framework/Core/FScene";
import { GameLayer } from "../../Framework/Enums/GameLayer";
import { Physics3DUtility } from "../../Framework/Utility/Physics3DUtility";
import { ApplicationContext } from "../ApplicationContext";
import { GameDataKey } from "../GameDataKey";
import { GameDataManager } from "../GameDataManager";
import { PlayerVO } from "../VO/PlayerVO";
import { TableVO } from "../VO/TableVO";
import { NewPlayerGuideMediator } from "./NewPlayerGuideMediator";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameTrainScene extends FScene
{

    @property(cc.Integer)
    private shootForce:number = 400;
    @property(cc.Integer)
    private boresight:number = 400;
    @property(cc.Float)
    private sleepTimeLimit:number = 0.4;
    @property(cc.Float)
    private sleepSpeedLimit:number = 0.6;

    onLoad()
    {
        Application.Bootstrap(ApplicationContext,cc.v2(1792,828));
        super.onLoad();
    }
    start()
    {
        if(CC_EDITOR)return;
        
        let root3D = this.getLayer(GameLayer.Root3D);
        if(root3D!=null)
        {
            for (let i = 0; i < root3D.childrenCount; i++) 
            {
                let cName = root3D.children[i].name;
                if(cName.indexOf("Camera")!=-1||cName=="Lights")continue;
                root3D.children[i].removeFromParent();
                i--;
            }
        }
        if(this.mediator==null)
            this.mediator = new NewPlayerGuideMediator();
        super.start();

        let table = GameDataManager.GetDictData(GameDataKey.Table,TableVO);
        let player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        if(player.id==0)
        {
            Physics3DUtility.SleepTimeLimit = this.sleepTimeLimit;
            Physics3DUtility.SleepSpeedLimit = this.sleepSpeedLimit;
            table.shootForce = cc.v3(this.shootForce,0,0);
            table.boresight = this.boresight;
        }
    }
}
