import { CryptoUtility } from "../../Framework/Utility/CryptoUtility";
import { HotUpdateUtils } from "../HotUpdateModule/HotUpdateUtils";

/** 封装游戏脚本调用原生方法 */
export class Native 
{
    /** Android原生类路径 */
    private static androidPath: string = 'org/cocos2dx/javascript/AndroidHelper';
    /** IOS 原生类名 */
    private static iosClassName: string = 'IOSHelper';
    /** 微信安装情况，0是默认值，未安装，1是已安装 */
    private static wxInstall: number = 0;
    /** 获取微信安装情况 ,0是默认值，未安装，1是已安装 */
    public static getWXState() {
        return this.wxInstall;
    }

    /**
     * 获取热更版本
     */
    public static getResVersion()
    {
        if(cc.sys.isNative)
        {
            const project = HotUpdateUtils.storagePath + '/project.manifest';
            if(jsb.fileUtils.isFileExist(project))
            {
                let manifest_info = JSON.parse(jsb.fileUtils.getStringFromFile(project)) as jsb.ManifestJSON;
                return manifest_info.version;
            }
        }
        return "1.0.0";
    }

    /**
     * 初始化微信sdk
     *
     * @export
     * @param {string} wxID 微信id
     * @returns
     */
    public static initWX(wxID: string) {
        if (!CC_JSB) {
            cc.warn('该方法只支持原生平台');
            return;
        }
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            this.wxInstall = jsb.reflection.callStaticMethod(this.androidPath, 'initWX', '(Ljava/lang/String;)I', wxID);
        }
        if (cc.sys.os === cc.sys.OS_IOS) {
            this.wxInstall = jsb.reflection.callStaticMethod(this.iosClassName, 'initWX:', wxID);
        }
        return this.wxInstall;
    }
    /** 调用微信登录接口 */
    public static wxLogin() {
        if (!CC_JSB) {
            cc.warn('该方法只支持原生平台');
            return;
        }
        if (this.wxInstall === 0) {
            cc.warn('未安装微信');
            return;
        }
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.androidPath, 'wxLogin', '()V');
        }
        if (cc.sys.os === cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod(this.iosClassName, 'wxLogin', '');
        }
    }
    /**
     * 获取微信分享人id
     */
    public static parentId():string
    {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            return jsb.reflection.callStaticMethod(this.androidPath, 'getExtraInfo', '(Ljava/lang/String;)Ljava/lang/String;','id');
        }
        return "";
    }
    /**
     * 调用微信分享功能，分享模式为网页
     *
     * @export
     * @param {string} url 网页地址
     * @param {string} title 标题
     * @param {string} des 描述说明
     * @param {number} type 分享类型，1是分享到朋友圈，其它是分享到好友
     * @returns
     */
    public static wxShare(url: string, title: string, des: string, type: number) {
        if (!CC_JSB) {
            cc.warn('该方法只支持原生平台');
            return;
        }
        if (this.wxInstall === 0) {
            cc.warn('未安装微信');
            return;
        }
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.androidPath, 'wxShare', '(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I)V', url, title, des, type);
        }
        if (cc.sys.os === cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod(this.iosClassName, 'wxShare:title:des:type', url, title, des, type);
        }
    }
    /**
     * 调用微信分享接口，分享模式为图片
     *
     * @export
     * @param {string} filePath 截图文件路径
     * @param {number} type 分享类型，1是分享到朋友圈，其它是分享好友
     */
    public static wxShareRecord(filePath: string, type: number) {
        if (!CC_JSB) {
            cc.warn('该方法只支持原生平台');
            return;
        }
        if (this.wxInstall === 0) {
            cc.warn('未安装微信');
            return;
        }
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.androidPath, 'wxShareRecord', '(Ljava/lang/String;I)V', filePath, type);
        }
        if (cc.sys.os === cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod(this.iosClassName, 'wxShareRecord:type:', filePath, type);
        }
    }
    /**
     * 调用微信支付接口，原生支付方式
     *
     * @export
     * @param {string} appId 微信appid
     * @param {string} partnerId 商户号
     * @param {string} prepayId 预支付交易会话ID
     * @param {string} nonceStr 随机字符串
     * @param {string} packageValue 扩展字段
     * @param {string} timeStamp 时间戳
     * @param {string} sign 签名
     * @returns
     */
    public static wxPay(appId: string, partnerId: string, prepayId: string, nonceStr: string, packageValue: string, timeStamp: string, sign: string) {
        if (!CC_JSB) {
            cc.warn('该方法只支持原生平台');
            return;
        }
        if (this.wxInstall === 0) {
            cc.warn('未安装微信');
            return;
        }
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(
                this.androidPath,
                'wxPay',
                '(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V',
                appId,
                partnerId,
                prepayId,
                nonceStr,
                packageValue,
                timeStamp,
                sign
            );
        }
        if (cc.sys.os === cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod(
                this.iosClassName,
                'wxPay:partnerId:prepayId:nonceStr:packageValue:timeStamp:sign:',
                appId,
                partnerId,
                prepayId,
                nonceStr,
                packageValue,
                timeStamp,
                sign
            );
        }
    }
    /**
     * 调用手机震动
     *
     * @export
     * @param {number} milliseconds 时间（毫秒）
     */
    public static phoneVibration(milliseconds: number) {
        if (!CC_JSB) {
            cc.log('该方法只支持原生平台');
            return;
        }
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.androidPath, 'phoneVibration', '(I)V', milliseconds);
        }
        if (cc.sys.os === cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod(this.iosClassName, 'phoneVibration:', milliseconds+"");
        }
    }
    /**
     * 用默认浏览器打开指定url,也可以直接使用【cc.sys.openURL()】实现
     *
     * @export
     * @param {string} url url地址
     */
    public static openBrowser(url: string) {
        if (!CC_JSB) {
            cc.log('该方法只支持原生平台');
            return;
        }
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.androidPath, 'openBrowser', '(Ljava/lang/String;)V', url);
        }
        if (cc.sys.os === cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod(this.iosClassName, 'openBrowser:', url);
        }
    }
    /**
     * 调用原生拨打电话
     *
     * @export
     * @param {string} phone
     */
    public static callPhone(phone: string) {
        if (!CC_JSB) {
            cc.log('该方法只支持原生平台');
            return;
        }
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.androidPath, 'callPhone', '(Ljava/lang/String;)V', phone);
        }
        if (cc.sys.os === cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod(this.iosClassName, 'callPhone:', phone);
        }
    }

    
    /**
     * 获取应用版本号
     *
     * @export
     * @returns {string}
     */
    public static getAppVersion(): string {
        let ver = '1.0.2';
        if (!CC_JSB) {
            cc.log('该方法只支持原生平台');
            return ver;
        }
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            ver = jsb.reflection.callStaticMethod(this.androidPath, 'getAppVersion', '()Ljava/lang/String;');
        }
        if (cc.sys.os === cc.sys.OS_IOS) {
            ver = jsb.reflection.callStaticMethod(this.iosClassName, 'getAppVersion',"");
        }
        return ver;
    }
    /**
     * 复制文本到剪切板
     *
     * @export
     * @param {string} text 需要复制的文本
     */
    public static copyToClipboard(text: string) {
        if (!CC_JSB) {
            cc.log('该方法只支持原生平台');
            return;
        }
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.androidPath, 'copyToClipboard', '(Ljava/lang/String;)V', text);
        }
        if (cc.sys.os === cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod(this.iosClassName, 'copyToClipboard:', text);
        }
    }
    /**
     * 从剪切板复制文本,因为原生方法需要切换到UI线程中执行，所以结果需要通过原生调用脚本的方式回传
     *
     * @export
     * @returns
     */
    public static getTextFromClip() {
        if (!CC_JSB) {
            cc.log('该方法只支持原生平台');
            return;
        }
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.androidPath, 'getTextFromClip', '()V');
        }
        if (cc.sys.os === cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod(this.iosClassName, 'getTextFromClip',"");
        }
    }
    /**
     * 更新apk时，获取下载权限
     *
     * @export
     */
    public static getDownloadPermission() {
        if (CC_JSB && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.androidPath, 'getDownloadPermission', '()V');
        } else {
            cc.log('获取文件apk存储权限只支持Android');
        }
    }
    /**
     * 更新apk时，获取安装权限
     *
     * @export
     */
    public static getInstallPermission() {
        if (CC_JSB && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.androidPath, 'getInstallPermission', '()V');
        } else {
            cc.log('获取文件apk安装权限只支持Android');
        }
    }
    /**
     * 跳转到设置
     *
     * @export
     * @param {number} requestCode
     */
    public static gotoSetting(requestCode: number) {
        if (CC_JSB && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.androidPath, 'gotoSetting', '(I)V', requestCode);
        } else {
            cc.log('跳转到系统设置只支持Android');
        }
    }
    /**
     * 下载apk
     *
     * @export
     * @param {string} url apk下载地址
     * @param {boolean} isShowDialog 是否显示原生进度框
     */
    public static downloadAPK(url: string, isShowDialog: boolean) {
        if (CC_JSB && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.androidPath, 'downloadAPK', '(Ljava/lang/String;Z)V', url, isShowDialog);
        } else {
            cc.log('下载apk只支持Android');
        }
    }
    /**
     * 执行apk安装
     *
     * @export
     */
    public static installAPK() {
        if (CC_JSB && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.androidPath, 'installAPK', '()V');
        } else {
            cc.log('apk安装只支持Android');
        }
    }
    /** apk安装 */
    public static installApp(path: string) {
        if (CC_JSB && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.androidPath, 'installApp', '(Ljava/lang/String;)V', path);
        } else {
            cc.log('apk安装只支持Android');
        }
    }
    /**
     * 调用二维码扫描
     *
     * @export
     */
    public static scaner() {
        if (CC_JSB && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.androidPath, 'scaner', '()V');
        } else {
            cc.log('扫码只支持Android');
        }
    }
    /**
     * 获取apk渠道信息
     *
     * @export
     * @returns {string}
     */
    public static getAPKChannel(): string {
        let channel = 'kys';
        if (CC_JSB && cc.sys.os === cc.sys.OS_ANDROID) {
            channel = jsb.reflection.callStaticMethod(this.androidPath, 'getAPKChannel', '()Ljava/lang/String;');
            if (channel === null || channel === '') {
                channel = 'kys';
            }
        } else {
            cc.log('获取apk渠道信息只支持Android');
        }
        return channel;
    }
    /**
     * 通过key获取apk其它信息
     *
     * @export
     * @param {string} key 键名
     * @returns {string}
     */
    public static getExtraInfo(key: string): string {
        if (CC_JSB && cc.sys.os === cc.sys.OS_ANDROID) {
            return jsb.reflection.callStaticMethod(this.androidPath, 'getExtraInfo', '(Ljava/lang/String;)Ljava/lang/String;', key);
        } else {
            cc.log('获取渠道额外信息只支持Android');
            return '';
        }
    }
    /**
     * 清理安装过的apk
     *
     * @export
     */
    public static delDir() {
        if (CC_JSB && cc.sys.os === cc.sys.OS_ANDROID) {
            return jsb.reflection.callStaticMethod(this.androidPath, 'delDir', '()Z');
        } else {
            cc.log('清理安装过的apk只支持Android');
            return false;
        }
    }
    /**
     * 通过URL唤起另一个app
     *
     * @export
     * @param {string} url scheme://host:port/path?data=jsonstring
     * @returns
     */
    public static openApp(url: string): number {
        if (CC_JSB && cc.sys.os === cc.sys.OS_ANDROID) {
            return jsb.reflection.callStaticMethod(this.androidPath, 'openApp', '(Ljava/lang/String;)I', url);
        } else {
            cc.log('拉起其它app只支持Android');
            return -1;
        }
    }
    /**
     * 通过包名和activity类名打开app并传递数据
     *
     * @export
     * @param {string} pkg app包名
     * @param {string} cls activity类名
     * @param {string} data json字符串
     */
    public static openAppA(pkg: string, cls: string, data: string): number {
        if (CC_JSB && cc.sys.os === cc.sys.OS_ANDROID) {
            return jsb.reflection.callStaticMethod(this.androidPath, 'openApp', '(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)I', pkg, cls, data);
        } else {
            cc.log('拉起其它app只支持Android');
            return -1;
        }
    }
    /**
     * 通过包名直接打开app，并传递参数
     *
     * @export
     * @param {string} pkg app包名
     * @param {string} data json字符串
     */
    public static openAppB(pkg: string, data: string): number {
        if (CC_JSB && cc.sys.os === cc.sys.OS_ANDROID) {
            return jsb.reflection.callStaticMethod(this.androidPath, 'openApp', '(Ljava/lang/String;Ljava/lang/String;)I', pkg, data);
        } else {
            cc.log('拉起其它app只支持Android');
            return -1;
        }
    }
    /**
     * 保存图片到相册
     *
     * @export
     * @param {string} path 文件在包内的绝对路径
     * @param {string} name 需要保存的文件名
     * @param {string} des 文件描述
     * @returns
     */
    public static saveToPhoto(path: string, name: string, des: string) {
        if (CC_JSB && cc.sys.os === cc.sys.OS_ANDROID) {
            return jsb.reflection.callStaticMethod(
                this.androidPath,
                'saveToPhoto',
                '(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Z',
                path,
                name,
                des
            );
        } else {
            cc.log('保存图片到相册只支持Android');
            return false;
        }
    }
    /**
     * 获取设备唯一识别码，如果从原生平台获取不到就用时间戳md5
     *
     * @export
     * @returns
     */
    public static getUUID() 
    {
        let uuid = '';
        if (CC_JSB && cc.sys.os === cc.sys.OS_ANDROID) {
            uuid = jsb.reflection.callStaticMethod(this.androidPath, 'getUUID', '()Ljava/lang/String;');
        }
        if (uuid === '' || uuid === null || uuid === undefined) {
            const timeStamp = Date.now().toString();
            uuid = CryptoUtility.GetMD5String(timeStamp);
        }
        return uuid;
    }
    /**
     * 调用友盟统计接口：红包兑换道具统计
     *
     * @export
     * @param {string} item 道具名
     * @param {number} number 道具数量
     * @param {number} price 兑换消耗的红包数量
     * @returns
     */
    public static buyProps(item: string, number: number, price: number) {
        if (CC_JSB && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.androidPath, 'buyProps', '(Ljava/lang/String;IF)V', item, number, price);
        } else {
            cc.log('友盟统计红包兑换道具只支持Android');
        }
    }
    /**
     * 调用友盟统计接口：充值购买统计
     *
     * @export
     * @param {number} currencyAmount 充值金额
     * @param {string} currencyType 充值币种
     * @param {number} virtualAmount 充值货币数量
     * @param {number} channel 1~99的支付平台
     * @param {string} orderId 充值订ID
     * @returns
     */
    public static exchange(currencyAmount: number, currencyType: string, virtualAmount: number, channel: number, orderId: string) {
        if (CC_JSB && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(
                this.androidPath,
                'exchange',
                '(FLjava/lang/String;FILjava/lang/String;)V',
                currencyAmount,
                currencyType,
                virtualAmount,
                channel,
                orderId
            );
        } else {
            cc.log('友盟统计充值购买只支持Android');
        }
    }
    /**
     * 调用友盟统计接口：奖励获取统计
     *
     * @export
     * @param {string} item     获取奖励的东西
     * @param {number} num      获取奖励的数量
     * @param {number} price    奖品的单价
     * @param {number} trigger  1~10之间的数，标识获取的类型，1是系统奖励
     */
    public static bonus(item: string, num: number, price: number, trigger: number) {
        if (CC_JSB && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.androidPath, 'bonus', '(Ljava/lang/String;IFI)V', item, num, price, trigger);
        } else {
            cc.log('友盟统计奖励获取只支持Android');
        }
    }
    /**
     * 调用友盟统计接口：登录统计
     *
     * @export
     * @param {string} provider 登录渠道
     * @param {string} id 登录id
     */
    public static sigin(provider: string, id: string) {
        if (CC_JSB && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.androidPath, 'sigin', '(Ljava/lang/String;Ljava/lang/String;)V', provider, id);
        } else {
            cc.log('友盟统计登录只支持Android');
        }
    }
    /**
     * 调用友盟统计接口：退出登录统计
     *
     * @export
     */
    public static signOff() {
        if (CC_JSB && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.androidPath, 'signOff', '()V');
        } else {
            cc.log('友盟统计退出登录只支持Android');
        }
    }

    /**
     * 支付宝登录授权
     *
     * @export
     * @param {string} authInfo 服务器返回的授权信息
     * @returns
     */
    public static aliAuth(authInfo: string) {
        if (CC_JSB && cc.sys.os === cc.sys.OS_ANDROID) {
            return jsb.reflection.callStaticMethod(this.androidPath, 'aliAuth', '(Ljava/lang/String;)V', authInfo);
        } else {
            cc.log('支付宝登录授权只支持Android');
            return -1;
        }
    }

    /**
     * 支付宝支付接口
     *
     * @export
     * @param {string} orderInfo 服务器返回的支付信息
     * @returns
     */
    public static aliPay(orderInfo: string) {
        if (CC_JSB && cc.sys.os === cc.sys.OS_ANDROID) {
            return jsb.reflection.callStaticMethod(this.androidPath, 'aliPay', '(Ljava/lang/String;)V', orderInfo);
        } else {
            cc.log('支付宝支付接口只支持Android');
            return -1;
        }
    }

    /**
     * 获取支付宝sdk的版本号
     *
     * @export
     * @returns
     */
    public static aliSdkVersion() {
        if (CC_JSB && cc.sys.os === cc.sys.OS_ANDROID) {
            return jsb.reflection.callStaticMethod(this.androidPath, 'aliSdkVersion', '()Ljava/lang/String;');
        } else {
            cc.log('支付宝支付接口只支持Android');
            return -1;
        }
    }

    /**
     * 银联支付
     *
     * @export
     * @param {string} tn 银联订单号
     * @param {('00' | '01')} mode '00'是正式环境，'01'是测试环境
     */
    public static ylPay(tn: string, mode: '00' | '01' | string) {
        if (CC_JSB && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.androidPath, 'ylPay', '(Ljava/lang/String;Ljava/lang/String;)V', tn, mode);
        } else {
            cc.log('银联支付接口只支持Android');
        }
    }

    /**
     * 微信小程序支付
     *
     * @export
     * @param {string} miniId 小程序原始id
     * @param {string} param 跳转参数
     */
    public static miniPay(miniId: string, param: string, mode: number) {
        if (CC_JSB && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.androidPath, 'miniPay', '(Ljava/lang/String;Ljava/lang/String;I)V', miniId, param, mode);
        } else {
            cc.log('微信小程序支付只支持Android');
        }
    }
}