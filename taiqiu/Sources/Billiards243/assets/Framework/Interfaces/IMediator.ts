import { IDispose } from './IDispose';

export interface IMediator extends IDispose
{
    startMediator():void;
    initialize():void;
    sceneName:string;
}