import { IDispose } from "./IDispose";

export interface IContext extends IDispose
{
    initialize():void;
}