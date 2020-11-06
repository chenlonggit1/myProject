import { getCamera } from "../../Framework/Utility/dx/getCamera";
import { stageWidth } from "../../Framework/Utility/dx/stageWidth";
import { stageHeight } from "../../Framework/Utility/dx/stageHeight";
import { Application } from "../../Framework/Core/Application";
import { GameLayer } from "../../Framework/Enums/GameLayer";

export class CanvasOffset
{
    public static ClassName:string = "CanvasOffset";
    public static Offset:cc.Vec2 = cc.v2();
    public static Init()
    {
        let n = cc.Canvas.instance.node;
        let root3D = Application.CurrentScene.getLayer(GameLayer.Root3D);
        let worldPos = n.convertToWorldSpaceAR(cc.v3());
        // console.log(worldPos.toString());
        
        if(root3D.parent instanceof cc.Scene)
        {
            this.Offset = cc.v2(worldPos.x-stageWidth()*0.5,worldPos.y-stageHeight()*0.5);
        }else
        {
            let cam = getCamera("3D Camera");
            let screenPos:any = cam.getWorldToScreenPoint(worldPos);
            this.Offset = cc.v2(screenPos.x-stageWidth()*0.5,screenPos.y-stageHeight()*0.5);
        }
    }
}
