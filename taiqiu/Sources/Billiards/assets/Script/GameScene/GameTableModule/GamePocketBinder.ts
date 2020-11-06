import { FBinder } from "../../../Framework/Core/FBinder";
import { GameLayer } from "../../../Framework/Enums/GameLayer";
import { UIEvent } from "../../../Framework/Events/UIEvent";
import { StoreManager } from "../../../Framework/Managers/StoreManager";
import { dispatchFEvent } from "../../../Framework/Utility/dx/dispatchFEvent";
import { getCamera } from "../../../Framework/Utility/dx/getCamera";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { stageHeight } from "../../../Framework/Utility/dx/stageHeight";
import { stageWidth } from "../../../Framework/Utility/dx/stageWidth";
import { CanvasOffset } from "../../Common/CanvasOffset";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { C_Game_PocketBall } from "../../Networks/Clients/C_Game_PocketBall";
import { C_Game_SyncTableInfo } from "../../Networks/Clients/C_Game_SyncTableInfo";
import { ConfigVO } from "../../VO/ConfigVO";
import { PlayerVO } from "../../VO/PlayerVO";
import { RoomVO } from "../../VO/RoomVO";
import GameBall from "../GameBall";
import { TableVO } from "../../VO/TableVO";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../GameEvent";
import { AudioManager } from "../../../Framework/Managers/AudioManager";

/**
 * 用于记录击球碰撞到了球袋，做进球处理
 */
export class GamePocketBinder extends FBinder 
{
    public static ClassName:string = "GamePocketBinder";
    /**所有的球袋 */
    protected pockets:cc.SphereCollider3D[] = [];
    protected camera:cc.Camera = null;
    protected room:RoomVO = null;
    protected player:PlayerVO = null;
    protected table:TableVO = null;
    protected initViews()
    {
        super.initViews();
        this.camera = getCamera("3D Camera");
        let tableNode = getNodeChildByName(this.asset,"GameTable/Pockets");
        let pocketInfos:any[] = [];

        let config:ConfigVO = GameDataManager.GetDictData(GameDataKey.Config,ConfigVO);
        this.room = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
        this.player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        this.table = GameDataManager.GetDictData(GameDataKey.Table,TableVO);

        for (let i = 0; i < 6; i++) 
        {
            let p:cc.Node = getNodeChildByName(tableNode,"Pocket"+(i+1));
            if(p==null)continue;
            let collider = p.getComponent(cc.SphereCollider3D);
            collider.on("trigger-enter",this.onPocketTriggerEnter,this);
            this.pockets.push(collider);
            pocketInfos.push({id:(i+1),position:p.position});
            if(config.isDebug)
            {
                let position = p.position.clone();
                let worldPos = p.convertToWorldSpaceAR(cc.v3());
                let screenPos:any = this.camera.getWorldToScreenPoint(worldPos);
                screenPos = cc.v2(screenPos.x,screenPos.y).sub(CanvasOffset.Offset);
                p.x+=p.scaleX*0.5;
                let sizePos = p.convertToWorldSpaceAR(cc.v3());
                let sizeScreenPos:any = this.camera.getWorldToScreenPoint(sizePos);
                sizeScreenPos = cc.v2(sizeScreenPos.x,sizeScreenPos.y).sub(CanvasOffset.Offset);
                p.setPosition(position);
            }
        }
        C_Game_SyncTableInfo.Send(pocketInfos);
    }
    protected clearViews()
    {
        super.clearViews();
        for (let i = 0; i < this.pockets.length; i++) 
        {
            let collider = this.pockets[i];
            collider.off("trigger-enter",this.onPocketTriggerEnter,this);
        }
    }
    /**球撞到了球袋，把当前入袋的球删除 */
    protected onPocketTriggerEnter(evt)
    {
        //// 测试玩家
        // if(this.player.id==0)return;
        let self = evt.selfCollider.node;
        let pocketPos = parseInt(self.name.replace("Pocket",""));
        let ball:cc.Node = evt.otherCollider.node;
        let id = ball.getComponent(GameBall).id;
        AudioManager.PlayEffect("Pocket");
        ///////////// 直接移除落袋的台球，不再等服务器的返回数据
        let rigi:cc.RigidBody3D = ball.getComponent(cc.RigidBody3D);
        rigi.setAngularVelocity(cc.v3());
        rigi.setLinearVelocity(cc.v3());
        rigi.sleep();
        if(ball.parent)ball.removeFromParent();
        let index = this.table.balls.indexOf(ball);
        if(index>-1)this.table.balls.splice(index,1);

        if(this.player.id==0)// 在测试场景中
		{
            dispatchFEventWith(GameEvent.Server_Pocket_Ball,{playerID:this.player.id,numbers:[id]});
            dispatchFEventWith(GameEvent.On_Set_BallHoleAni,{playerID:this.player.id,numbers:[id],pocketPos:pocketPos,pocketNode:self});
			return;
        }
        C_Game_PocketBall.Send([id],pocketPos);
        dispatchFEventWith(GameEvent.On_Set_BallHoleAni,{playerID:this.player.id,numbers:[id],pocketPos:pocketPos,pocketNode:self});
        dispatchFEventWith(GameEvent.On_Fixed_BallScreenPos);
    }
}
