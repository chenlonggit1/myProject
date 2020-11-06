/** 工具类，提供各种静态方法 */
export class HotUpdateUtils 
{
    /** 热更新存储路径 */
    public static storagePath = (CC_JSB ? jsb.fileUtils.getWritablePath() : '/') + 'remote_asset';
    /** 热更新临时存储路径 */
    public static storageTemp = (CC_JSB ? jsb.fileUtils.getWritablePath() : '/') + 'remote_asset_temp';
    /**
     * 拷贝源对象到目标对象中，镜像复制，会移除目标对象原有的属性
     *
     * @static
     * @param {object} target 目标对象
     * @param {object} source 源对象
     * @memberof Utils
     */
    public static copyObject(target: object, source: object) {
        for (const key in target) {
            if (target.hasOwnProperty && target.hasOwnProperty(key)) {
                delete target[key];
            } else {
                delete target[key];
            }
        }
        Object.assign(target, source);
    }
    
    /** 创建热更文件夹 */
    public static createStoragePath() {
        if (!jsb.fileUtils.isDirectoryExist(this.storagePath)) {
            jsb.fileUtils.createDirectory(this.storagePath);
        }
    }
    /** 删除热更文件夹 */
    public static removeStoragePath() {
        if (!CC_JSB) {
            cc.log('删除缓存文件夹只支持原生平台');
            return false;
        }
        if (jsb.fileUtils.isDirectoryExist(this.storagePath)) {
            return jsb.fileUtils.removeDirectory(this.storagePath);
        }
        return false;
    }
    /** 删除热更临时文件夹 */
    public static removeStorageTemp() {
        if (!CC_JSB) {
            cc.log('删除缓存文件夹只支持原生平台');
            return false;
        }
        if (jsb.fileUtils.isDirectoryExist(this.storageTemp)) {
            return jsb.fileUtils.removeDirectory(this.storageTemp);
        }
        return false;
    }
}
