import { IDispose } from "./IDispose";

export interface IBinder extends IDispose
{
    initialize():void;
    bindView(asset:cc.Node,...args):void;
}
