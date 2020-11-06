import { dispatchFEventWith } from "../../Framework/Utility/dx/dispatchFEventWith";

/** 
 * 封装原生方法调用游戏脚本
 * 原生方法中执行脚本的名字必须是Script.XXX的形式,原生方法中调用脚本的方法名需要和该脚本保持一致
 * 为了防止黑屏的bug,回调的方法都延迟10毫秒触发
 */
export class Script 
{
    /** 安装apk失败回调，安装文件不存在 */
    public static installError() {
        setTimeout(() => 
        {
            dispatchFEventWith('installError')
            // globalEventTarget.emit('installError');
        }, 10);
    }
    /** 登录授权回调 */
    public static loginCallback(code?: string) {
        setTimeout(() => {
            dispatchFEventWith('loginCallback',code);
            // globalEventTarget.emit('loginCallback', code);
        }, 10);
    }
    /** 微信分享-结果回调 result 分享结果,1为成功，0为失败 */
    public static shareCallback(result: number): void {
        setTimeout(() => {
            dispatchFEventWith('shareCallback',result);
            // globalEventTarget.emit('shareCallback', result);
        }, 10);
    }
    /** 支付回调code=0(支付成功)code=-2(用户取消支付)code=-1(支付失败，具体原因不明) */
    public static payCallback(code: number) {
        setTimeout(() => {
            dispatchFEventWith('payCallback',code);
            // globalEventTarget.emit('payCallback', code);
        }, 10);
    }
    /**
     * 从剪切板复制文本的回调
     *
     * @export
     * @param {number} code 错误码，0是失败，1是成功
     * @param {string} msg 复制到的文本内容
     */
    public static getTextFromClip(code: number, msg: string) {
        setTimeout(() => {
            dispatchFEventWith('getTextFromClip',{code:code,msg:msg});
            // globalEventTarget.emit('getTextFromClip', code, msg);
        }, 10);
    }
    /**
     * 下载存储权限的返回
     *
     * @export
     * @param {number} code 0是没权限，1是有权限
     * @param {number} requestCode activity指向的代号
     */
    public static getDownloadPermission(code: number, requestCode: number) {
        setTimeout(() => {
            dispatchFEventWith('getDownloadPermission', {code:code,requestCode:requestCode});
            // globalEventTarget.emit('getDownloadPermission', code, requestCode);
        }, 10);
    }
    /**
     * 下载安装权限的返回
     *
     * @export
     * @param {number} code 0是没权限，1是有权限
     * @param {number} requestCode activity指向的代号
     */
    public static getInstallPermission(code: number, requestCode: number) {
        setTimeout(() => {
            dispatchFEventWith('getInstallPermission', {code:code,requestCode:requestCode});
            // globalEventTarget.emit('getInstallPermission', code, requestCode);
        }, 10);
    }
    /**
     * apk下载进度状态返回
     *
     * @export
     * @param {number} state 状态：1是开始下载，2是下载中，3是下载结束，0是下载失败
     * @param {number} progress 当state为2时有效，下载进度int类型
     */
    public static downloadAPK(state: number, progress: number) {
        setTimeout(() => {
            dispatchFEventWith('downloadAPK', {state:state,progress:progress});
            // globalEventTarget.emit('downloadAPK', state, progress);
        }, 10);
    }
    /**
     * 调用摄像头扫描二维码的返回
     *
     * @export
     * @param {number} code 0是失败或取消，1是成功取得值，-1是没有值
     * @param {string} msg
     */
    public static scaner(code: number, msg: string) {
        setTimeout(() => {
            dispatchFEventWith('scaner', {code:code,msg:msg});
            // globalEventTarget.emit('scaner', code, msg);
        }, 10);
    }
    /**
     * 通过相机或者相册选择图片后得到的地址
     *
     * @export
     * @param {string} path 图片地址，空字符串则说明授权失败
     */
    public static getImgPath(path: string) {
        setTimeout(() => {
            dispatchFEventWith('getImgPath', path);
            // globalEventTarget.emit('getImgPath', path);
        }, 10);
    }

    /** 银联支付回调 0是成功，1是取消，2是失败 */
    public static ylCallback(code: number) {
        setTimeout(() => {
            cc.log('银联支付结果：' + code);
        }, 10);
    }

    /** 小程序回调方法，code=1是成功，0是失败 */
    public static miniPayCallback(code: number) {
        setTimeout(() => {
            cc.log('微信小程序支付结果：' + code);
        }, 10);
    }

    /**
     * 原生的一些广播事件
     * 
     * // apk 安装事件
     * EVENT_INSTALL_PACKAGE_ADD
     * EVENT_INSTALL_PACKAGE_REMOVED
     * EVENT_INSTALL_PACKAGE_REPLACED
     * 
     * EVENT_BATTER_CHANGED     // 电池电量改变
     * EVENT_CHARGE_CHANGED     // 充电器是否连接
     * EVENT_NETWORK_CHANGED    // 网络发生了改变
     * 
     * @param eventName 事件名称
     * @param jsonData 事件数据(JSON字符串)
     */
    public static dispatchNativeEvent(eventName: string, jsonData: string) {
        let { name, data } = JSON.parse(jsonData);
        cc.log(`原生事件:${name} 数据:`, data);
    }
}

window['Script'] = Script;