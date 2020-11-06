import { EventManager } from "../../Managers/EventManager";
import { ModuleEvent } from "../../Events/ModuleEvent";
import { GameLayer } from "../../Enums/GameLayer";

export function dispatchModuleEvent(type: string, moduleName: string, instanceName?: string, gameLayer?: GameLayer | cc.Node, data?: any): void {
    EventManager.dispatchEvent(new ModuleEvent(type, moduleName, instanceName, gameLayer, data));
}