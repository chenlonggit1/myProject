import { FMediator } from "../../Framework/Core/FMediator";
import { GameLayer } from "../../Framework/Enums/GameLayer";
import { ModuleEvent } from "../../Framework/Events/ModuleEvent";
import { SceneEvent } from "../../Framework/Events/SceneEvent";
import { JTimer } from "../../Framework/Timers/JTimer";
import { addEvent } from "../../Framework/Utility/dx/addEvent";
import { dispatchFEvent } from "../../Framework/Utility/dx/dispatchFEvent";
import { dispatchModuleEvent } from "../../Framework/Utility/dx/dispatchModuleEvent";
import { Fun } from "../../Framework/Utility/dx/Fun";
import { LobbyEvent } from "../Common/LobbyEvent";
import { GameDataKey } from "../GameDataKey";
import { GameDataManager } from "../GameDataManager";
import { ModuleNames } from "../ModuleNames";
import { C_Lobby_Config } from "../Networks/Clients/C_Lobby_Config";
import { C_Lobby_EnterRoom } from "../Networks/Clients/C_Lobby_EnterRoom";
import { GameProxy } from "../Networks/GameProxy";
import { GameEvent } from "../GameEvent";
import { C_Lobby_MyCue } from "../Networks/Clients/Cue/C_Lobby_MyCue";
import { PlayerVO } from "../VO/PlayerVO";
import { LanguageManager } from "../../Framework/Managers/LanguageManager";
import { AudioManager } from "../../Framework/Managers/AudioManager";
import { Native } from "../Common/Native";
import { HotUpdateConfigVO } from "../VO/HotUpdateConfigVO";
import { showPopup } from "../Common/showPopup";
import { PopupType } from "../PopupType";
import { getLang } from "../../Framework/Utility/dx/getLang";
import { C_Lobby_GetRole } from "../Networks/Clients/Role/C_Lobby_GetRole";
import { WebManager } from "../../Framework/Managers/WebManager";
import { ConfigVO } from "../VO/ConfigVO";
import { ReconnectionHandler } from "./ReconnectionHandler";
import { C_Heartbeat } from "../Networks/Clients/C_Heartbeat";
import { Application } from "../../Framework/Core/Application";
import { dispatchFEventWith } from "../../Framework/Utility/dx/dispatchFEventWith";
import { NewPlayerVO } from "../VO/NewPlayerVO";
import { C_NewGuide_Match } from "../Networks/Clients/C_NewGuide_Match"; 
import { SceneNames } from "../SceneNames";
import { LobbyMediator } from "../LobbyScene/LobbyMediator";

export class LoginMediator extends FMediator 
{
    private nextMediator:FMediator = null;
    private nextSceneName:string = null; 
    private isAssetLoadComplete:boolean = false;
    private isCanChangeScene:boolean = true;
    private isNeedRequestInfo:boolean = true;
    
    
    protected initDatas()
    {
        super.initDatas();
        this.getServerConfig();
        this.setConfig();
        Application.SetButtonSound();
        Application.AddFont();
    }

    protected setConfig()
    {
        let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        let languageIndex = GameDataManager.GetShareData("language",null,1);
        LanguageManager.ChangeLanguage(parseInt(languageIndex));
        player.isChinese = parseInt(languageIndex)==0;
    }

    protected async getServerConfig()
    {
        dispatchModuleEvent(ModuleEvent.SHOW_MODULE,ModuleNames.Preload,null,GameLayer.Window,{msg:getLang("Text_update22"),isShowMask:true});
        let config:ConfigVO = GameDataManager.GetDictData(GameDataKey.Config,ConfigVO);
        let updateConfig:HotUpdateConfigVO = GameDataManager.GetDictData(GameDataKey.HotUpdateConfig,HotUpdateConfigVO);
        let result:any = await WebManager.GetWebDataAsync(config.configURL);
        console.log("--获取到服务器配置->",config.configURL,"-->",result);
        dispatchModuleEvent(ModuleEvent.HIDE_MODULE,ModuleNames.Preload);
        if(result==null||result=="")showPopup(PopupType.CONFIRM_WINDOW,{msg:getLang("Text_update23")},true);
        else
        {
            let data = JSON.parse(result);
            if(config.serverUrl==null||config.serverUrl=="")
                config.serverUrl = data.login_url;
            config.wechatGZH = data.wx_billiard_gzh;
            config.share_url = data.share_url;
            config.share_title = data.share_title;
            config.share_desc = data.share_desc;
            config.game_id = data.game_id;
            updateConfig.checkURL = data.check_url;
            updateConfig.remoteMinApkVer = data.min_apk_ver;
            if(cc.sys.isNative)
            {
                let id = GameDataManager.GetDictData("appid");
                if(id!=null&&id!="")Native.initWX(id);
                ///////////////////////////////////临时关闭热更
                // config.isNeedCheckUpdate = false;
                ///////////////////////////////////////////////
                if(config.isNeedCheckUpdate)this.showModule(ModuleNames.HotUpdate,GameLayer.Window);
                else this.onHotUpdateClose();
            }
        }
    }
    addEvents():void
    {
        addEvent(this,LobbyEvent.Login_Succ,this.onLoginServerSucc);
        addEvent(this,LobbyEvent.Login_Retry,this.onRetryLogin);
        addEvent(this,GameEvent.OtherPlayer_PhysicSleep,this.onOtherPhysicSleep);
        addEvent(this,GameEvent.Server_Game_Settle,this.onServerGameSettle);
        addEvent(this,GameEvent.onReconnectLoad,this.reConnectData);
        addEvent(this,GameEvent.EnterRoom_Succ,this.onStartGame);
        addEvent(this,"loginCallback",this.onWXLoginCallback);
        addEvent(this,"closeUpdate",this.onHotUpdateClose); // GameEvent.EnterRoom_Succ
        // addEvent(this, GameEvent.MatchPlayer_Succ, this.onMatchOk);
        // addEvent(this, GameEvent.EnterRoom_Succ, this.onEnterRoom);
        
    }

    protected onHotUpdateClose()
    {
        if(cc.sys.isNative)
            this.autoLastLogin();
    }

    public connectServer()
    {
        new GameProxy().initialize();
        dispatchModuleEvent(ModuleEvent.SHOW_MODULE,ModuleNames.Preload,null,GameLayer.Popup,{isShowMask:true,msg:getLang("Text_dl")});
    }
    public loginServer(type)
    {
        if(type==1)// 微信登陆
        {
            if(this.autoLastLogin())return;
            console.log("============登录没有token====")
            if(Native.getWXState()!=0)Native.wxLogin();
            else showPopup(PopupType.TOAST,{msg:getLang("Text_Login_NotFindWX")});
        }else this.connectServer();
    }
    /**登录失效，重新拉取微信登录 */
    private onRetryLogin(evt)
    {
        if(!cc.sys.isNative)return;
       
        GameDataManager.SetShareData("token",null);
        this.loginServer(1);
    } 
    /**
     * 自己应用上次登陆
     */
    protected autoLastLogin():boolean
    {
        let token = GameDataManager.GetShareData("token");
        if(token!=null&&token!="")
        {
            console.log("============登录已经有token====")
            let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
            player.token = token;
            if(cc.sys.isNative)player.loginType = 2;
            else player.loginType = 0;
            this.connectServer();
            return true;
        }
        return false;
    }

    /**微信登陆返回回调 */
    protected onWXLoginCallback(evt)
    {
        let code = evt.data;
        console.log("====微信code===>",code);
        if(code==null||code=="")
        {
            console.log("获取微信Code失败！！！");
            return;
        }
        let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        player.token = code;
        player.loginType = 1;
        this.connectServer();
        
    }
    /**尝试下在游戏重新连接 */
    public retConnectSocket(){
        cc.log('尝试下在游戏重新连接')
        this.onLoginServerSucc()
    }
    /**连接服务器成功 */
    protected onLoginServerSucc()
    {
        cc.log('连接服务器成功连接服务器成功')
        this.setGameData();
        C_Heartbeat.Send(1);
        let config:ConfigVO = GameDataManager.GetDictData(GameDataKey.Config,ConfigVO);
        config.isNeedCheckUpdate = false;
        if(this.isNeedRequestInfo) {
            C_Lobby_EnterRoom.Send();
            this.isNeedRequestInfo = false;
        }
    }
    
    //设置游戏数据
    private setGameData()
    {
        let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        GameDataManager.SetShareData("token",player.token);
        let isOpenMusic = GameDataManager.GetShareData("openMusic");
        let isOpenSound = GameDataManager.GetShareData("openSound");
        //登录成功设置语言、音乐、音效
        if(isOpenMusic != null) {
            AudioManager.IsCanPlayMusic = isOpenMusic == "true";
        } else GameDataManager.SetShareData("openMusic",AudioManager.IsCanPlayMusic);

        if(isOpenSound != null) {
            AudioManager.IsCanPlayEffect = isOpenSound == "true";
        } else GameDataManager.SetShareData("openSound",AudioManager.IsCanPlayEffect);
        
    }


    /** 延时加载下一个场景 */
    protected onDelayLoadNextScene()
    {
        for(let i = 1; i < 18; i++)
            C_Lobby_Config.Send(i);

        let player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        C_Lobby_MyCue.Send(player.id);
        C_Lobby_GetRole.Send();//获取角色
        C_Lobby_Config.Send(18); //  获取商品配置
        let newPlayer: NewPlayerVO = GameDataManager.GetDictData(GameDataKey.NewPlayerGuide, NewPlayerVO);
        if(newPlayer.isNeedGuide && newPlayer.isNeedTrain) { // 需要进入新手引导
            cc.log("=====需要新手引导===", newPlayer.isNeedGuide, newPlayer.isNeedTrain)
            C_NewGuide_Match.Send();
            return; 
        }

        let sceneData = ReconnectionHandler.GetNextSceneData();
        cc.log("========sceneName==", sceneData.scene);
        this.nextSceneName = sceneData.scene;
        this.nextMediator = sceneData.mediator;
        this.isCanChangeScene = sceneData.canChangeScene;
        this.nextMediator.initialize();
        this.nextMediator.preloadAssets().addCallback(this,this.onLoadAssetComplete,null);
    }
    /**资源加载完成，切换到大厅场景 */
    private onLoadAssetComplete()
    {
        this.isAssetLoadComplete = true;
        this.changeNextScene();
    }
    private reConnectData()
    {
        this.isCanChangeScene = false;
    }
    protected onOtherPhysicSleep(evt)
    {
        if(this.isCanChangeScene)return;
        this.isCanChangeScene = true;
        ReconnectionHandler.ReSetRoomData(evt.data);
        this.changeNextScene();
    }
    //重连收到结算，直接进入大厅场景
    protected onServerGameSettle(evt)
    {
        console.log(cc.director.getScene().name);
        this.nextSceneName = SceneNames.Lobby;
        this.nextMediator = new LobbyMediator();
        dispatchFEvent(new SceneEvent(SceneEvent.CHANGE_SCENE,this.nextSceneName,this.nextMediator));
    }
    protected changeNextScene()
    {
        if(!this.isAssetLoadComplete||!this.isCanChangeScene)return;
        dispatchFEvent(new SceneEvent(SceneEvent.CHANGE_SCENE,this.nextSceneName,this.nextMediator));
    }
    protected onStartGame()
    {
        this.onDelayLoadNextScene();
    }
}
