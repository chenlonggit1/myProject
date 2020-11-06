import { FEvent } from "./FEvent";
import { GameLayer } from "../Enums/GameLayer";

export class UIEvent extends FEvent
{
    public static ClassName:string = "UIEvent";
	/**将UI添加到指定的层级**/
	public static ADD_TO_LAYER:string = "AddToLayer";
	/**
	 *销毁指定层里的所有module 
	 */		
	public static DISPOSE_LAYER_ELEMENTS:string = "DisposeLayerElements";
	/**
	 * 隐藏指定层里的所有module 
	 */		
	public static HIDE_LAYER_ELEMENTS:string = "HideLayerElements";

	private _gameLayer:GameLayer = null;
	private _view:any = null;

	public constructor(type:string,view?:any,data?:any,GameLayer?:GameLayer)
	{
		super(type,data);
		this._gameLayer = GameLayer;
		this._view = view;
	}
	public get gameLayer():GameLayer{return this._gameLayer;}
	public get view():any{return this._view;}
}