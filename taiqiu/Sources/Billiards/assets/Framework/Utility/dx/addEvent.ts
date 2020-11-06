import { EventManager } from './../../Managers/EventManager';
export function addEvent(target:any,eventType:string,fun:Function):void
{
    EventManager.addEvent(target,eventType,fun);
}