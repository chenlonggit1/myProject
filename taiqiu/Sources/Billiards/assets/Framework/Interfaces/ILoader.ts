import { IDispose } from "./IDispose";
import { LoaderType } from "../Enums/LoaderType";

export interface ILoader extends IDispose
{
    length:number;
	load(url:any,assetType?:any,loaderType?:LoaderType):void;
    getAssetType(index:number):any;
    getContent(index:number):any
    addCallback(target:any,complete:Function,progress?:Function,error?:Function):void
}
