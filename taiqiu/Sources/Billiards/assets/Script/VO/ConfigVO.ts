import { FObject } from "../../Framework/Core/FObject";

export class ConfigVO extends FObject 
{
    public static ClassName:string = "ConfigVO";
    // // 外网测试服务器
    // public serverUrl = "ws://39.97.171.53:8081";
    // /**获取配置信息 */
    public configURL:string = "http://39.97.168.0:7009/getSystemConfig";
    // public configURL:string = "http://39.97.171.53:7009/getSystemConfig"; 
    // public configURL:string  = "http://192.168.0.162:7009/getSystemConfig";
    // public configURL:string  = "http://59.110.71.34:7009/getSystemConfig";
    // 外网测试服务器
    public serverUrl = "";
    /**微信公众号 */
    public wechatGZH:string = "";
    /**分享地址 */
    public share_url:string = "";
    /**分享标题 */
    public share_title:string = "";
    /**分享描述 */
    public share_desc:string = "";
    /**游戏ID */
    public game_id:string = "";
    
    /**使用Debug输出信息 */
    public isDebug:boolean = false;
    /**用于做瞄准线的debug */
    public isDebugBoresig:boolean = false;

    public isNeedCheckUpdate:boolean = true;
    /**打开内测服 */
    public isTestAddress:boolean = false;

    /** 教程视频地址 */
    public aliVideoUrl: string = "http://39.97.168.0:8066/video/noviceGuide.mp4";

    /** 是否重新开始的游戏 */
    public isNewGame: boolean = true;

    /** 更新游戏地址 */
    public uprageUrl: string = "http://wechat.shtghaha.com/wechat_web/jump.html?id=63";
}
