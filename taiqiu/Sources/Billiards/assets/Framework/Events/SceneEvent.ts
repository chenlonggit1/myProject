import { FEvent } from "./FEvent";

export class SceneEvent extends FEvent 
{
    public static ClassName:string = "SceneEvent";
    public static CHANGE_SCENE:string = "OnChangeScene";

    public static SET_CURRENT_SCENE:string = "OnSetCurrentScene";

    public static DESTROY_CURRENT_SCENE:string = "OnDestroyCurrentScene";

    public static LOAD_PROGRESS: string = "OnSceneLoadProgress";

    
    private _sceneName:string = null;
    public constructor(type:string,sceneName:string,data?:object)
    {
        super(type,data);
        this._sceneName = sceneName;
    }
    public get sceneName():string{return this._sceneName;}
}
