import { FEvent } from './../../Events/FEvent';
import { EventManager } from './../../Managers/EventManager';

export function dispatchFEvent(evt:FEvent):void
{
    EventManager.dispatchEvent(evt);
}