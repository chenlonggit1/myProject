import { Application } from "../../Framework/Core/Application";
import { FScene } from "../../Framework/Core/FScene";
import { SceneEvent } from "../../Framework/Events/SceneEvent";
import { EventManager } from "../../Framework/Managers/EventManager";
import { LanguageManager } from "../../Framework/Managers/LanguageManager";
import { addEvent } from "../../Framework/Utility/dx/addEvent";
import { dispatchFEvent } from "../../Framework/Utility/dx/dispatchFEvent";
import { formatString } from "../../Framework/Utility/dx/formatString";
import { getURLParam } from "../../Framework/Utility/dx/getURLParam";
import { ApplicationContext } from "../ApplicationContext";
import { GameDataKey } from "../GameDataKey";
import { GameDataManager } from "../GameDataManager";
import { GameEvent } from "../GameEvent";
import { C_Lobby_EnterRoom } from "../Networks/Clients/C_Lobby_EnterRoom";
import { NewPlayerGuideMediator } from "../NewPlayerGuide/NewPlayerGuideMediator";
import { ConfigVO } from "../VO/ConfigVO";
import { NewPlayerVO } from "../VO/NewPlayerVO";
import { PlayerVO } from "../VO/PlayerVO";
import { RoomVO } from "../VO/RoomVO";
import { LoginMediator } from "./LoginMediator";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginScene extends FScene {
    @property(cc.Node)
    private startBtn: cc.Node = null;
    @property(cc.EditBox)
    private serverEditor: cc.EditBox = null;
    @property(cc.EditBox)
    private accountEditor: cc.EditBox = null;
    @property(cc.Label)
    private gameWarn0: cc.Label = null;
    @property(cc.Label)
    private gameWarn1: cc.Label = null;

    @property(cc.ProgressBar)
    private loadingProgress: cc.ProgressBar = null;
    onLoad() {
        this.mediator = new LoginMediator();
        Application.Bootstrap(ApplicationContext, cc.v2(1792, 828));
        super.onLoad();
        this.getSetting();
        addEvent(this, GameEvent.MatchPlayer_Succ, this.onMatchOk);
        addEvent(this, GameEvent.EnterRoom_Succ, this.onEnterRoom);
        addEvent(this, "closeUpdate", this.onHotEnd);
    }

    start() {
        super.start();
        this.setgameWarn();
        let config: ConfigVO = GameDataManager.GetDictData(GameDataKey.Config, ConfigVO);
        if(config.isNewGame) {
            config.isNewGame = false;
            this.startLoading();
        } else {
            this.loadingProgress.progress = 1;
        }
    }

    onDestroy() {
        EventManager.removeEvent(this);
    }

    private getSetting() {
        if (cc.sys.isBrowser) {
            let configs = ["39.97.171.53:7009", "192.168.1.45:7009", "192.168.1.91:7009", "110.43.52.168:7009", "59.110.71.34:7009"];
            let servers = ["39.97.171.53:8081", "192.168.1.45:9090", "192.168.1.91:9090", "110.43.52.168:8081", "59.110.71.34:8081"];
            let token = getURLParam("token");
            let server = getURLParam("server");
            let config: ConfigVO = GameDataManager.GetDictData(GameDataKey.Config, ConfigVO);
            if (token) this.accountEditor.string = token;
            else {
                let account = GameDataManager.GetShareData("token");
                if (!account) this.accountEditor.string = new Date().getTime().toString();
                else this.accountEditor.string = account;
            }
            if (server) {
                if (!isNaN(Number(server))) {
                    config.configURL = formatString("http://{0}/getSystemConfig", [configs[server]]);
                    config.serverUrl = servers[server];
                    this.serverEditor.string = config.configURL;
                } else this.serverEditor.string = server;
            } else {
                if (config.isTestAddress) {
                    //内测服地址
                    config.configURL = formatString("http://{0}/getSystemConfig", ["59.110.71.34:7009"]);
                    config.serverUrl = "59.110.71.34:8081";
                }
                let serverStr = GameDataManager.GetShareData("server");
                if (serverStr) this.serverEditor.string = serverStr;
            }
        } else if (cc.sys.isNative) {
            let config: ConfigVO = GameDataManager.GetDictData(GameDataKey.Config, ConfigVO);
            if (config.isTestAddress) {
                //内测服地址
                config.configURL = formatString("http://{0}/getSystemConfig", ["59.110.71.34:7009"]);
                config.serverUrl = "59.110.71.34:8081";
            }
            this.accountEditor.node.parent.active = false;
            this.serverEditor.node.parent.active = false;
        }
    }
    startGame(): void {
        if (cc.sys.isNative) (this.mediator as LoginMediator).loginServer(1);
        else {
            this.startBtn.active = false;
            let player: PlayerVO = GameDataManager.GetDictData(GameDataKey.Player, PlayerVO);
            let config: ConfigVO = GameDataManager.GetDictData(GameDataKey.Config, ConfigVO);
            if (this.serverEditor.string != "") {
                config.configURL = this.serverEditor.string;
                GameDataManager.SetShareData("server", config.serverUrl);
            }
            if (this.accountEditor.string != "") {
                player.loginType = 0;
                player.token = this.accountEditor.string;
                GameDataManager.SetShareData("token", player.token);
            }
            (this.mediator as LoginMediator).loginServer(0);
        }
    }

    private setgameWarn() {
        let player: PlayerVO = GameDataManager.GetDictData(GameDataKey.Player, PlayerVO);
        if (player.isChinese) return;
        this.gameWarn0.string = `ناچار ئويۇننى چەكلەپ،ئوغرى نۇسخا ئويۇننى رەت قىلايلى،ئۆزىمىزنى ياخشى قوغداپ،ئالدىنىپ قېلىشنىڭ ئالدىنى ئالايلى
        ئويۇننى مۇۋاپىق ئويناش زېھىن ئېچىشقا پايدىلىق،ۋاقىتنى ياخشى ئورۇنلاشتۇرۇپ،ساغلام تۇرمۇشدىن ھوزۇرلىنايلى
        `;
        this.gameWarn1.string = "";
    }

    // 匹配成功 进入房间
    protected onMatchOk() {
        cc.log("===新手引导匹配成功====");
        let newPlayer: NewPlayerVO = GameDataManager.GetDictData(GameDataKey.NewPlayerGuide);
        newPlayer && newPlayer.isNeedGuide && newPlayer.isNeedTrain && setTimeout(() => C_Lobby_EnterRoom.Send(), 2000);
    }

    protected onEnterRoom() {
        let room: RoomVO = GameDataManager.GetDictData(GameDataKey.Room);
        if (!room) {
            return;
        }
        cc.log("===进入新手引导房间====")
        let newPlayer: NewPlayerVO = GameDataManager.GetDictData(GameDataKey.NewPlayerGuide);
        if(newPlayer && newPlayer.isNeedGuide && newPlayer.isNeedTrain) {
            let gameMediator = new NewPlayerGuideMediator();
            gameMediator.initialize();
            dispatchFEvent(new SceneEvent(SceneEvent.CHANGE_SCENE, "GameTrainScene", gameMediator));
        }
    }

    // 暂时做个假的loading加载 
    private startLoading() {
        
        this.startBtn.active = false;
        this.gameWarn0.node.active = false;
        this.gameWarn1.node.active = false;
        this.loadingProgress.schedule(()=> {
            var player: PlayerVO = GameDataManager.GetDictData(GameDataKey.Player, PlayerVO);
            this.loadingProgress.progress = this.loadingProgress.progress + 0.05;
            if(this.loadingProgress.progress >= 1) {
                this.loadingProgress.unscheduleAllCallbacks();
                this.gameWarn0.node.active = true;
                player.isChinese&& (this.gameWarn1.node.active = true);
                if(cc.sys.isBrowser) {
                    this.startBtn.active = true;
                }
            }
        }, 0.1);
    }

    private onHotEnd() {
        cc.log("=========onHotEnd==============");
        this.startBtn.active = true;
    }
}