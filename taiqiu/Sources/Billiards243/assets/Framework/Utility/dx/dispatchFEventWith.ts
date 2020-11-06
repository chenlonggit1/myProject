import { EventManager } from './../../Managers/EventManager';
export function dispatchFEventWith(type:string,data?:any):void
{
    EventManager.dispatchEventWith(type,data);
}