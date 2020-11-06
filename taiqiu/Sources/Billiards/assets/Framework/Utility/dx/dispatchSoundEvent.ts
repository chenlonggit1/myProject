import { SoundEvent } from "../../Events/SoundEvent";
import { EventManager } from "../../Managers/EventManager";

export function dispatchSoundEvent(type:string,data?:any):void
{
    EventManager.dispatchEvent(new SoundEvent(type,data));
}