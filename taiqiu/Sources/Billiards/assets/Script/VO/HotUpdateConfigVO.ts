import { FObject } from "../../Framework/Core/FObject";

export class HotUpdateConfigVO extends FObject 
{
    /**检查热更的地址 */
    public checkURL:string = "";

    public localApkVersion:string = "";
    public localResVersion:string = ""


    //////// 远程配置////////////////////
    /**远程配置中允许热更apk的最小版本号 */
    public remoteMinApkVer:string = "";

    
}
