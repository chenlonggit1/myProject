import { FContext } from "../Framework/Core/FContext";
import { ModuleEvent } from "../Framework/Events/ModuleEvent";
import { ClientManager } from "../Framework/Managers/ClientManager";
import { LanguageManager } from "../Framework/Managers/LanguageManager";
import { ModuleManager } from "../Framework/Managers/ModuleManager";
import { dispatchModuleEvent } from "../Framework/Utility/dx/dispatchModuleEvent";
import { GameDataKey } from "./GameDataKey";
import { GameDataManager } from "./GameDataManager";
import { HotUpdateModule } from "./HotUpdateModule/HotUpdateModule";
import { MaskModule } from "./MaskModule/MaskModule";
import { ModuleNames } from "./ModuleNames";
import { GameProtobufClient } from "./Networks/GameProtobufClient";
import { GameProtobufMessage } from "./Networks/GameProtobufMessage";
import { PopupModule } from "./PopupModule/PopupModule";
import { PreloadModule } from "./PreloadModule/PreloadModule";
import { SceneNames } from "./SceneNames";
import { RoomVO } from "./VO/RoomVO";
export class ApplicationContext extends FContext 
{
    public static ClassName:string = "ApplicationContext";
    protected initDatas()
    {
        LanguageManager.LanguageNames = ["CN", "Uighur"];
        ClientManager.SetDefaultClass(GameProtobufClient,GameProtobufMessage);
        GameDataManager.SetDictData("appid","wx004ea14efad44abc");
        cc.game.setFrameRate(50);
        super.initDatas();
    }
    /**初始化全局模块 */
    protected initModules(): void 
    {
        super.initModules();
        ModuleManager.AddModuleClass(ModuleNames.Preload,PreloadModule);
        ModuleManager.AddModuleClass(ModuleNames.Mask,MaskModule);
        ModuleManager.AddModuleClass(ModuleNames.Popup,PopupModule);
        ModuleManager.AddModuleClass(ModuleNames.HotUpdate,HotUpdateModule);
    }
    protected onLoadSceneComplete(data: any, sceneName: string)
    {
        let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room);
        if(sceneName == SceneNames.Game && room.reconnectOption) return;
        dispatchModuleEvent(ModuleEvent.HIDE_MODULE,ModuleNames.Mask);
        dispatchModuleEvent(ModuleEvent.DISPOSE_MODULE,ModuleNames.Preload);
        dispatchModuleEvent(ModuleEvent.DISPOSE_MODULE,ModuleNames.Popup);
        super.onLoadSceneComplete(data,sceneName);
    }
    
}
