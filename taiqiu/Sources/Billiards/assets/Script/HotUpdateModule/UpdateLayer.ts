import { Native } from "../Common/Native";
import { HotUpdateUtils } from "./HotUpdateUtils";
import { HotUpdateConfigVO } from "../VO/HotUpdateConfigVO";
import { GameDataManager } from "../GameDataManager";
import { GameDataKey } from "../GameDataKey";
import { addEvent } from "../../Framework/Utility/dx/addEvent";
import { dispatchFEventWith } from "../../Framework/Utility/dx/dispatchFEventWith";
import { WebManager } from "../../Framework/Managers/WebManager";
import { CryptoUtility } from "../../Framework/Utility/CryptoUtility";
import { getLang } from "../../Framework/Utility/dx/getLang";
import { ConfigVO } from "../VO/ConfigVO";

const { ccclass, property } = cc._decorator;

interface RemoteInfo {
    apk_url: string,
    res_url: string,
    res_ver: string,
    project_url: string,
    apk_ver: string,
}

@ccclass
export default class UpdateLayer extends cc.Component {
    /** 更新进度条组件 */
    @property({ type: cc.ProgressBar, tooltip: '更新进度条组件' })
    pro_bar: cc.ProgressBar = null;
    /** 进度描述文本 */
    @property({ type: cc.Label, tooltip: '进度描述文本' })
    lbl_msg: cc.Label = null;
    /** APK更新提示层 */
    @property({ type: cc.Node, tooltip: 'APK更新提示层' })
    tip_apk_node: cc.Node = null;
    /** 跳转设置的提示 */
    @property({ type: cc.Node, tooltip: '跳转设置的提示' })
    tip_setting_node: cc.Node = null;
    /** 热更异常提示层 */
    @property({ type: cc.Node, tooltip: '热更异常提示层' })
    tip_res_node: cc.Node = null;

    @property({ type: cc.Label, tooltip: '热更提示文本' })
    lbl_Tip: cc.Label = null;

    @property({ type: cc.Node, tooltip: '热更根节点' })
    root: cc.Node = null;

    @property({ type: cc.Node, tooltip: 'APK大更新更新提示层' })
    Big_Version_Node: cc.Node = null;


    /** 服务器配置信息 */
    private remote_info: RemoteInfo = null;
    /** apk的绝对路径 */
    private apk_path: string = null;
    /** 安装授权的code码 */
    private install_code: number = null;

    /** 热更新管理器 */
    private assetManager: jsb.AssetsManager = null;
    /** 热更新文件下载失败次数 */
    private failCount: number = 0;
    

    onLoad() 
    {
        this.tip_apk_node.active = false;
        this.tip_res_node.active = false;
    }
    onDisable() {
        this.lbl_msg.string = '';
        this.pro_bar.progress = 0;
    }
    onEnable() {
        this.getRemoteVersion();
    }
    /** 从服务端获取版本信息 */
    getRemoteVersion() 
    {
        // this.lbl_msg.string = getLang("Text_update1");
        this.lbl_Tip.string = getLang("Text_update1");
        this.pro_bar.progress = 0;
        this.scheduleOnce(async () => 
        {
            
            // 根据渠道信息拼接请求地址
            let config:HotUpdateConfigVO = GameDataManager.GetDictData(GameDataKey.HotUpdateConfig,HotUpdateConfigVO);
            let url = config.checkURL + '?channel=' + Native.getAPKChannel();
            console.log("热更新配置路径====>",url);
            if(config.checkURL==null||config.checkURL=="")return;
            let text = await WebManager.GetWebDataAsync(url) as string;
            console.log("获取到远程配置信息====>",text);
            if(text==null||text=="")
            {
                this.lbl_msg.string = getLang("Text_update2");
                this.lbl_Tip.string = getLang("Text_update2");
                this.closeLayer(getLang("Text_update3"),true);
                return;
            }
            
            let info = JSON.parse(text) as RemoteInfo;
           
            if (info) 
            {
                info.apk_url = info.apk_url.replace(/\\/g,"/");
                info.res_url = info.res_url.replace(/\\/g,"/");
                info.project_url = info.project_url.replace(/\\/g,"/");
                if(!info.res_url.endsWith("/"))info.res_url+="/";
                this.remote_info = info;
                this.checkApk();
            } else this.closeLayer(getLang("Text_update4"), true);
        }, 0);
    }
    /** 检查apk版本，判断是否需要更新apk */
    checkApk() 
    {
        let config:HotUpdateConfigVO = GameDataManager.GetDictData(GameDataKey.HotUpdateConfig,HotUpdateConfigVO);
        config.localApkVersion = Native.getAppVersion();

        console.log("-本地App版本->",config.localApkVersion,"-远程app版本-->",this.remote_info.apk_ver);
        
        // 本地和远程版本比对，判定是否提示更新apk
        let need_down = this.compareVer(config.localApkVersion, this.remote_info.apk_ver);
        if (need_down === 1) 
        {
            // 本地和最低版本比对，判定是否需要强制更新
            let must_update = this.compareVer(config.localApkVersion, config.remoteMinApkVer);
            // 强制更新，不提示直接开始下载
            let version = Native.getAppVersion();
            if (must_update === 1) {
                this.root.active = true;
                this.Big_Version_Node.active = true;// 提示用户可以选择是否更新{ 
                    let lbl = getLang("updateVersion");
                    lbl = lbl.replace("{0}", version);
                    lbl = lbl.replace("{1}", this.remote_info.apk_ver);
                    this.lbl_msg.string = lbl;
                    
                // this.downloadApk(); // 
            }
            else {
                this.root.active = true;
                this.tip_apk_node.active = true;
            }
            
        } else // 开始检查资源版本
        { 
            this.pro_bar.progress = 1;
            this.lbl_msg.string = getLang("Text_update5");
            this.lbl_Tip.string = getLang("Text_update5");
            this.scheduleOnce(() => this.getResInfo(), 1);
        }
    }
    /** 跳过apk更新，也跳过资源版本检测 */
    jumpToLoad() 
    {
        this.closeLayer(getLang("Text_update6"), false);
    }
    /** 下载apk */
    downloadApk() 
    {
        console.log("开始下载APK--->",this.remote_info.apk_url);
        
        // 判断当前下载地址是否已经下载，防止下载过程中文件不全无法安装
        const lastPath = cc.assetManager.cacheManager.getCache(this.remote_info.apk_url);
        if (lastPath && lastPath.length > 0)cc.assetManager.cacheManager.removeCache(this.remote_info.apk_url);
        this.root.active = false;
        this.tip_apk_node.active = false;
        this.pro_bar.progress = 0;
        // this.root.active = true;
        this.lbl_msg.string = getLang("Text_update7");
        this.lbl_Tip.string = getLang("Text_update7");
        // 下一帧开始下载，防止删除操作是异步的情况
        this.scheduleOnce(() => 
        {
            cc.assetManager.loadRemote(this.remote_info.apk_url, 
            {
                ext: '.apk',
                onFileProgress: (finished: number, total: number) => 
                {
                    if (total <= 0)return;
                    this.pro_bar.progress = new Decimal(finished).div(total).toDP(2).toNumber();
                    this.lbl_msg.string = `${getLang("Text_update8",[new Decimal(total).div(1024 * 1024).toDP(2),new Decimal(finished).div(1024 * 1024).toDP(2)])}`;
                    this.lbl_Tip.string = `${getLang("Text_update8",[new Decimal(total).div(1024 * 1024).toDP(2),new Decimal(finished).div(1024 * 1024).toDP(2)])}`;
                }
            }, (err: Error, asset: cc.Asset) => 
            {
                if (err) 
                {
                    cc.error(err);
                    cc.assetManager.cacheManager.removeCache(this.remote_info.apk_url);
                    this.closeLayer(getLang("Text_update9"), true);
                    return;
                }
                this.pro_bar.progress = 1;
                this.lbl_msg.string = getLang("Text_update10");
                this.lbl_Tip.string = getLang("Text_update10");
                this.root.active = false;
                this.apk_path = cc.assetManager.cacheManager.getCache(asset.nativeUrl);
                this.installApp();
            });
        }, 0);
    }
    /** 安装apk */
    installApp() 
    {
        addEvent(this,'getInstallPermission',(evt) =>
        {
            console.log("获取安装权限----》",evt.data.code,evt.data.requestCode);
            
            if (evt.data.code === 1) // 有安装权限
            { 
                addEvent(this,'installError',() =>this.closeLayer(getLang("Text_update11"), true));
                Native.installApp(this.apk_path);
            }else // 没有安装权限
            { 
                this.install_code = evt.data.requestCode;
                this.root.active = true;
                this.tip_setting_node.active = true;
            }
        });
        Native.getInstallPermission();
    }
    /** 显示安装权限提示 */
    tipInstall() 
    {
        // 监听从后台切换到前台的回调
        cc.game.once(cc.game.EVENT_SHOW,() =>this.installApp(),this);
        Native.gotoSetting(this.install_code);
    }
    /** 获取热更检测的地址和版本信息 */
    getResInfo() 
    {
        if (!CC_JSB)return;
        this.tip_apk_node.active = false;
        this.root.active = false;
        this.pro_bar.progress = 0;
        this.lbl_msg.string = getLang("Text_update12");
        this.lbl_Tip.string = getLang("Text_update12");
        let config:HotUpdateConfigVO = GameDataManager.GetDictData(GameDataKey.HotUpdateConfig,HotUpdateConfigVO);
        console.log("============getResInfo============");
        this.scheduleOnce(async () => 
        {
            let manifest_info: jsb.ManifestJSON;
            const project = HotUpdateUtils.storagePath + '/project.manifest';
            let is_project = jsb.fileUtils.isFileExist(project);


            console.log("本地project.manifest------>",is_project);
            
            // 如果文件夹不存在，先把文件夹创建好
            HotUpdateUtils.createStoragePath();
            if (is_project)manifest_info = JSON.parse(jsb.fileUtils.getStringFromFile(project)) as jsb.ManifestJSON;
            else 
            {
                console.log("远程project.manifest下载地址--->",this.remote_info.project_url);
                let str = await WebManager.GetWebDataAsync(this.remote_info.project_url);
                console.log("获取到远程初始project.manifest-->",str);
                if(str==null||str=="")return;
                // 默认本地没有文件配置，从服务器获取打包时的project.manifest文件
                manifest_info = JSON.parse(str as string) as jsb.ManifestJSON;
                jsb.fileUtils.writeStringToFile(str as string, project);
                console.log("写入远程project.manifest到本地------>",str);
            }
            manifest_info.packageUrl = this.remote_info.res_url;
            manifest_info.remoteManifestUrl = this.remote_info.res_url + 'project.manifest';
            manifest_info.remoteVersionUrl = this.remote_info.res_url + 'version.manifest';
            console.log("-本地热更版本->",manifest_info.version,"-远端热更版本->",this.remote_info.res_ver);

            console.log("-远端Ver地址->",manifest_info.remoteVersionUrl,"-远端Project地址->",manifest_info.remoteManifestUrl);
            
            const state_code = this.compareVer(manifest_info.version, this.remote_info.res_ver);
            if (state_code === 0) 
            {
                console.log("本地与远端热更版本相同！！！");
                config.localResVersion = manifest_info.version;
                // 版本相同，跳过热更
                this.closeLayer(getLang("Text_update13"), false);
            } else if (state_code === -1) 
            {
                console.log("本地版本大于远程版本，需要清除本地缓存文件后重启游戏！！！");
                // 本地版本大于远程版本，需要清除本地缓存文件后重启游戏
                this.clickFix();
            } else 
            {
                console.log("本地版本小于远程版本，直接执行热更！！！");
                // 本地版本小于远程版本，直接执行热更
                const info_str = JSON.stringify(manifest_info);
                jsb.fileUtils.writeStringToFile(info_str, project);
                this.checkRes(info_str);
            }
        }, 0);
    }
    /** 执行热更检测 */
    checkRes(info: string) 
    {
        if (!CC_JSB)return;
        let config:HotUpdateConfigVO = GameDataManager.GetDictData(GameDataKey.HotUpdateConfig,HotUpdateConfigVO);
        const manifest = new jsb.Manifest(info, HotUpdateUtils.storagePath);
        this.assetManager = new jsb.AssetsManager('', HotUpdateUtils.storagePath);
        this.assetManager.loadLocalManifest(manifest, HotUpdateUtils.storagePath);
        this.assetManager.setVersionCompareHandle((versionA: string, versionB: string) => 
        {
            console.log("比对版本--->",versionA,versionB);
            // versionA 本地资源版本号，versionB 远程资源版本号
            const need_update = this.compareVer(versionA, versionB);
            if (need_update === 1)return -1;
            else 
            {
                config.localResVersion = versionA;
                return 0;
            }
        });
        this.assetManager.setVerifyCallback((path: string, asset: { md5: string }) => {

            // return true;
            const data = jsb.fileUtils.getDataFromFile(path);
            if (data) 
            {
                
                // let hex = crypto.createHash("md5").update(data).digest('hex');
                let hex = CryptoUtility.GetMD5String(data);
                // console.log("hex===>",hex,asset.md5,hex === asset.md5,"<-",asset["path"]);
                // const hex = Transcode.MD5_Encrypt(data.buffer);
                if (hex === asset.md5)return true;
                else return false;
            } else return false;
        });

        console.log("远端配置--->",this.assetManager.getLocalManifest().getManifestFileUrl());
        
        if (this.assetManager.getLocalManifest() && this.assetManager.getLocalManifest().isLoaded()) 
        {
            console.log("开始检查热更！！！！");
            this.assetManager.setEventCallback(this.checkCb.bind(this));
            this.assetManager.checkUpdate();
        } else this.closeLayer(getLang("Text_update14"), true);
    }
    /** 资源版本检测的回调方法 */
    checkCb(event: jsb.EventAssetsManager)
    {
        switch (event.getEventCode()) 
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.error('没有发现本地的资源配置文件，热更新失败！');
                this.closeLayer(getLang("Text_update15"), true);
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                cc.error('下载服务端资源配置文件失败，热更新失败！');
                this.closeLayer(getLang("Text_update16"), true);
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log('当前已经是最新版本，跳过热更新！');
                this.assetManager.setEventCallback(null);
                this.closeLayer(getLang("Text_update13"), false);
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                console.log('发现新版本，开始准备热更新！');
                this.assetManager.setEventCallback(this.updateCb.bind(this));
                this.failCount = 0;
                this.assetManager.update();
                this.lbl_msg.string = `${getLang("Text_update18",[new Decimal(event.getTotalBytes()).div(1024 * 1024).toDP(2)])}`;
                this.lbl_Tip.string = `${getLang("Text_update18",[new Decimal(event.getTotalBytes()).div(1024 * 1024).toDP(2)])}`;
                this.pro_bar.progress = 0;
                break;
            default:
                break;
        }
    }
    /** 热更资源下载 */
    updateCb(event: jsb.EventAssetsManager) 
    {
        let needRestart = false;
        let failed = false;
        switch (event.getEventCode()) 
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                console.log('没有发现本地的资源配置文件，热更新失败！');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                this.lbl_msg.string = `${getLang("Text_update8",[new Decimal(event.getTotalBytes()).div(1024 * 1024).toDP(2), new Decimal(event.getDownloadedBytes()).div(1024 * 1024).toDP(2)])}`;
                this.lbl_Tip.string = `${getLang("Text_update8",[new Decimal(event.getTotalBytes()).div(1024 * 1024).toDP(2), new Decimal(event.getDownloadedBytes()).div(1024 * 1024).toDP(2)])}`;
                this.pro_bar.progress = cc.misc.clamp01(event.getPercentByFile());
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                console.log('下载服务端资源配置文件失败，热更新失败！');
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log('当前已经是最新版本，跳过热更新！');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                console.log('热更新完毕：' + event.getMessage());
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                console.log('文件下载失败：' + event.getMessage());
                this.failCount++;
                if (this.failCount < 5) 
                {
                    this.assetManager.downloadFailedAssets();
                } else 
                {
                    console.log('太多文件下载失败，退出热更新！');
                    this.failCount = 0;
                    failed = true;
                }
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                console.log('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                console.log(event.getMessage());
                break;
            default:
                break;
        }
        if (failed) 
        {
            console.log("热更失败？？？？",this.failCount);
            
            // 提示用户热更失败
            this.assetManager.setEventCallback(null);
            this.tip_res_node.active = true;
        }
        if (needRestart) {

            console.log("热更完成，即将重启！！！！");
            // 热更完成，需要重启
            this.assetManager.setEventCallback(null);
            const searchPaths = jsb.fileUtils.getSearchPaths();
            const newPaths = this.assetManager.getLocalManifest().getSearchPaths();
            Array.prototype.unshift.apply(searchPaths, newPaths);
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);
            this.pro_bar.progress = 1;
            // this.lbl_msg.string = getLang("Text_update19");
            this.lbl_Tip.string =  getLang("Text_update19");
            this.lbl_msg.node.color = cc.Color.RED;
            this.scheduleOnce(() => cc.game.restart(), 1);
        }
    }
    /** 比较版本号大小,返回0是版本一致，1是远程大于本地，-1是远程小于本地 */
    compareVer(local: string, remote: string) 
    {
        let remote_list = remote.split('.').map((item) => 
        {
            return parseInt(item, 10);
        });
        let local_list = local.split('.').map((item) => 
        {
            return parseInt(item, 10);
        });
        for (let i = 0, j = local_list.length; i < remote_list.length; i++) 
        {
            if (i > j) 
            {
                // eg:1.0.0 < 1.0.0.1，远程版本大于本地版本
                return 1;
            } else 
            {
                const ver1 = remote_list[i];
                const ver2 = local_list[i];
                if (ver1 === ver2)continue;
                else if (ver1 > ver2) return 1;// 远程版本大于本地版本
                else return -1;// 远程版本小于本地版本
            }
        }
        // 远程版本和本地版本一致
        return 0;
    }
    /** 关闭当前层 */
    closeLayer(msg: string, is_error: boolean, time: number = 1) 
    {
        console.log("关闭热更界面--->",msg,is_error);
        this.pro_bar.progress = 1;
        this.lbl_msg.string = msg;
        this.lbl_msg.node.color = cc.Color.RED;
        this.lbl_Tip.string = msg;
        this.scheduleOnce(() => 
        {
            this.root.active = false;
            dispatchFEventWith("closeUpdate",is_error ? msg : null);
            // Main.eventTarget.emit(Main.EventName.Close_Update, is_error ? msg : null);
        }, time);
    }
    /** 点击修复按钮，移除本地缓存，然后重启 */
    clickFix() 
    {
        this.tip_res_node.active = false;
        HotUpdateUtils.removeStoragePath();
        HotUpdateUtils.removeStorageTemp();
        this.pro_bar.progress = 1;
        this.lbl_msg.string = getLang("Text_update20");
        this.lbl_Tip.string = getLang("Text_update20");
        this.lbl_msg.node.color = cc.Color.RED;
        this.scheduleOnce(() =>cc.game.restart(), 1);
    }


    /** 跳转下载页面 */
    onclick2DownWeb() {
        let config: ConfigVO = GameDataManager.GetDictData(GameDataKey.Config);
        // cc.sys.openURL(this.remote_info.apk_url);
        cc.sys.openURL(config.uprageUrl);

        // this.root.active = false;
        // this.Big_Version_Node.active = false;
    }

    onClicCancelkDownWeb() {
        this.root.active = false;
        this.Big_Version_Node.active = false;
        cc.game.end();
        // ھازىرقى نۇسخىسى {1} يېڭىلاشقا تېگىشلىك نۇسخىسى {0} ،بۇ چوڭ نۇسخىغا چوقۇم يېڭىلاش كېرەك
    }

}