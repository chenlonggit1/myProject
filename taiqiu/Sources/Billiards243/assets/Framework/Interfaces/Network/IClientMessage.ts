import { IDispose } from "../IDispose";

export interface IClientMessage extends IDispose
{
    readonly content:any;
    packetID:number;
    readonly bytes:ArrayBuffer;
	write(value:object):void;
	parser(value:any):void;
	clear():void;
}
