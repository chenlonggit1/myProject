import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { LobbyMediator } from "../../LobbyScene/LobbyMediator";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { GameLayer } from "../../../Framework/Enums/GameLayer";
import { dispatchFEvent } from "../../../Framework/Utility/dx/dispatchFEvent";
import { SceneEvent } from "../../../Framework/Events/SceneEvent";
import { SceneNames } from "../../SceneNames";
import { showPopup } from "../../Common/showPopup";
import { PopupType } from "../../PopupType";
import { C_Game_QuitGame } from "../../Networks/Clients/C_Game_QuitGame";
import { PlayerVO } from "../../VO/PlayerVO";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { GameEvent } from "../../GameEvent";
import { GameProxy } from "../../Networks/GameProxy";
import { ProxyManager } from "../../../Framework/Managers/ProxyManager";
import { RoomVO } from "../../VO/RoomVO";
import { PlayGameID } from "../../Common/PlayGameID";
import { getLang } from "../../../Framework/Utility/dx/getLang";
import { LoginMediator } from "../../LoginScene/LoginMediator";
export class GameSetBinder extends FBinder {
    public static ClassName: string = 'GameSetBinder';
    private player: PlayerVO = null;
    private retConnectBtn:cc.Node = null;
    private btnLayout:cc.Layout = null;
    public initViews() {
        super.initViews();
        this.player = GameDataManager.GetDictData(GameDataKey.Player, PlayerVO);

        let setIcon = getNodeChildByName(this.asset, "btn_SheZhi");
        let closemark = getNodeChildByName(this.asset, "closemark");
        let menus = getNodeChildByName(this.asset, "setting_set_bg");

        this.btnLayout =  getNodeChildByName(menus, "layout",cc.Layout);
        let openSetting = getNodeChildByName(menus, "layout/item1");
        this.retConnectBtn = getNodeChildByName(menus, "layout/item2");
        let exit = getNodeChildByName(menus, "layout/item3");

        setIcon.on(cc.Node.EventType.TOUCH_END, () => {
            // cc.log('setIcon')
            menus.active = true;
            closemark.active = true;
        }, this);


        closemark.on(cc.Node.EventType.TOUCH_END, () => {
            closemark.active = false;
            menus.active = false;
        }, this);
        openSetting.on(cc.Node.EventType.TOUCH_END, () => {
            dispatchFEventWith(LobbyEvent.Open_LobbySet);
        }, this);
        this.retConnectBtn.on(cc.Node.EventType.TOUCH_END, () => {
            closemark.active = false;
            menus.active = false;
            this.retConnect();
        }, this);
        exit.on(cc.Node.EventType.TOUCH_END, () => {
            this.exitGame();
        }, this);

        // setIcon.on(cc.Node.EventType.TOUCH_END, () => {

        // }, this);

    }


    private retConnect() {
        let quitCallBack = () => 
        {
            // let token = this.player.token;
            // ProxyManager.ProxyDispose("GameProxy");
            // this.player.reset();
            
            // setTimeout(() => 
            // {
            //     dispatchModuleEvent(ModuleEvent.SHOW_MODULE,ModuleNames.Preload,null,GameLayer.Window,{msg:getLang("Text_update21"),isShowMask:true});
            //     let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
            //     player.token = token;
            //     player.loginType = 0;
            //     new GameProxy().initialize();
            // }, 100);
            ProxyManager.ProxyDispose("GameProxy");
            GameDataManager.SetDictData(GameDataKey.Room,null);
            GameDataManager.SetDictData(GameDataKey.Table,null);
            GameDataManager.SetDictData(GameDataKey.Player,null);
            let loginMediator:LoginMediator = new LoginMediator();
            dispatchModuleEvent(ModuleEvent.SHOW_MODULE,ModuleNames.Preload,null,GameLayer.Popup);
            dispatchFEvent(new SceneEvent(SceneEvent.CHANGE_SCENE,SceneNames.Login,loginMediator));
        }
        showPopup(PopupType.WINDOW, {
            msg: getLang("Text_sz4"),
            onConfirm: () => {
                quitCallBack();
            }
        }, true);

    }


    private exitGame() {
        let quitCallBack = () => {
            GameDataManager.SetDictData(GameDataKey.Room, null);
            GameDataManager.SetDictData(GameDataKey.Table, null);
            if (this.player.id == 0) return;
            let lobbyMediator: LobbyMediator = new LobbyMediator();
            dispatchModuleEvent(ModuleEvent.SHOW_MODULE, ModuleNames.Preload, null, GameLayer.Popup);
            dispatchFEvent(new SceneEvent(SceneEvent.CHANGE_SCENE, SceneNames.Lobby, lobbyMediator));
        }
        let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
        let text = this.player.isChinese ? getLang("Text_sz5") : 
        `ھازىر چېكىنسىڭىز مەيدانغا كىرىش ھەققىڭىز بىلەن دو \n دەسمايىڭىز قايتۇرۇپ بېرىلمەيدۇ، ئوينىغان مەيدان سانىڭىزغا \n ھېسابلانمايدۇ (ۋەزىپە، مۇكاپات تارتىش)، چېكىنەمسىز؟`;
        if(room.gameId == PlayGameID.LuckBall) text = getLang("Text_sz1"); 
        showPopup(PopupType.WINDOW, {
            msg: text,
            onConfirm: () => {
                C_Game_QuitGame.Send(); 
                quitCallBack();
            }
        }, true);
    }

    protected addEvents() {
        super.addEvents();
        addEvent(this, GameEvent.onShowSetType, this.onShowSetType); //红球停止运动后返回的当前位置

    }

    private onShowSetType(data:any){
        cc.log(data.data);
        if(data.data == "gameLuckBalls"){
            // 不需要显示重新连接
            this.retConnectBtn.active = false;
            this.btnLayout.spacingY = 30;
        }else{
            this.retConnectBtn.active = true;
            this.btnLayout.spacingY = 0;

        }
    }
}