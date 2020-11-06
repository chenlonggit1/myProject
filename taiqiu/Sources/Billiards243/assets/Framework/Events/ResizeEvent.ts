import { FEvent } from "./FEvent";


export class ResizeEvent extends FEvent 
{
    public static ClassName:string = "ResizeEvent";
    public static readonly ON_WINDOW_RESIZE:string = "OnWindowResize";

    public oldSize:cc.Vec2;
    public newSize:cc.Vec2;
    public rotation:any = null;
    public constructor(type: string,oldSize:cc.Vec2,newSize:cc.Vec2,data?: any,rotation?:any)
    {
        super(type, data);
        this.oldSize = oldSize;
        this.newSize = newSize;
        this.rotation = rotation;
    }
}
