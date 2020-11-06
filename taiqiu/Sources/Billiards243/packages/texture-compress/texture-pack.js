'use strict';
var fs = require('fs');
var path = require('path');
var sizeOf = require('image-size');
var child_process = require('child_process');
var execSync = child_process.execSync;
const Electron = require('electron');

const FileUtil = require("./panel/utils/file-util");
const ETCUtil = require("./panel/utils/etc-util");
const ZipUtil = require("./panel/utils/zip-util");

const PROJ_PATH = Editor.Project.path;

function _formatNumber(num, length) {
    return ("000000000000000000" + num).substr(-length);
}

/**
 * 纹理压缩处理类
 */
const TexturePack = {
    WORKBENCH_ANDROID: "packResAndroid",
    WORKBENCH_IOS: "packResIOS",
    config: {
        androidEnabled: true,
        iOSEnabled: false,
        zlibEnabled: true,
        alphaEnabled: true,
        textureEnabled: true,
        pathOfPVR: "",
        pathOfETC: "",
        pathOfTarget: "",
        handlePaths: [],
    },
    _log: null,
    log: function (...args) {
        this._log && this._log(args);
    },
    _readToolsEnv: function (cfgFile) {
        if (fs.existsSync(cfgFile)) {
            var saveData = fs.readFileSync(cfgFile, 'utf-8');
            var data = JSON.parse(saveData);
            this.config = data;
            for (const key in data) {
                this.log("配置 " + key + ":" + data[key]);
            }
        } else {
            this.log("PACK读取配置文件不存在:" + cfgFile);
        }
        this.log("ETC环境:", this.config.pathOfETC);
        this.log("PVR环境:", this.config.pathOfPVR);
        ETCUtil.setUpEnvironment(this.config.pathOfETC, this.config.pathOfPVR);
    },

    async startPack(cfgFile, log) {
        this._log = log;
        //set env
        this._readToolsEnv(cfgFile);

        if (this.config.handlePaths.length <= 0) {
            this.log("请先添加处理目录");
            return;
        }

        let jsbPath = PROJ_PATH + "/build/jsb-default/";
        if (!fs.existsSync(jsbPath))
            jsbPath = PROJ_PATH + "/build/jsb-link/";
        process.chdir(jsbPath);
        let tmpAndroidPath = path.join(jsbPath, "temp_pack_android");
        let tmpiOSPath = path.join(jsbPath, "temp_pack_ios");

        // 1.先创建临时目录
        // 2.将处理的目录拷贝到临时目录
        for (let i = 0; i < this.config.handlePaths.length; i++) {
            const handlePath = this.config.handlePaths[i];
            // 获取目标路径最后一段名字
            let paths = handlePath.split(path.sep).filter(p => p && p.trim());
            let folderName = paths.pop();
            let dstAndroid = path.join(tmpAndroidPath, folderName);
            let dstIOS = path.join(tmpiOSPath, folderName);
            this.log("开始拷贝:", handlePath);
            this.config.androidEnabled && FileUtil.copyDirectory(handlePath, dstAndroid);
            this.config.iOSEnabled && FileUtil.copyDirectory(handlePath, dstIOS);
        }
        // 3.处理ETC压缩
        let needZipAndroidPNGFiles = [];   // 有将pkm文件重命名为png，所以这需要保存进行压缩处理
        let needZipIOSPNGFiles = [];       // 有将pkm/pvr文件重命名为png，所以这需要保存进行压缩处理
        if (this.config.textureEnabled) {
            if (this.config.androidEnabled) { // 安卓使用ETC1压缩
                let textureFiles = FileUtil.listDirectorySync(tmpAndroidPath, (_path) => !_path.endsWith(".png") && !_path.endsWith(".jpg"));
                let _countLen = (textureFiles.length + "").length;
                for (let i = 0; i < textureFiles.length; i++) {
                    const textureFile = textureFiles[i];
                    let textureDir = path.dirname(textureFile);
                    this.log("Android-[ETC1" + (this.config.alphaEnabled ? "+Alpha" : "") + "][" + _formatNumber(i + 1, _countLen) + "/" + textureFiles.length + "]:" + textureFile.replace(tmpAndroidPath, ""));
                    // ETC1 压缩
                    await ETCUtil.handleETC1(textureFile, textureDir, this.config.alphaEnabled);
                    // 移除源文件
                    fs.unlinkSync(textureFile);
                    // 重命名
                    let newPath = textureFile.replace(path.extname(textureFile), ".pkm");
                    FileUtil.rename(newPath, textureFile);
                    needZipAndroidPNGFiles.push(textureFile);
                }
            }
            if (this.config.iOSEnabled) {
                let textureFiles = FileUtil.listDirectorySync(tmpiOSPath, (_path) => !_path.endsWith(".png") && !_path.endsWith(".jpg"));
                let _countLen = (textureFiles.length + "").length;
                for (let i = 0; i < textureFiles.length; i++) {
                    const textureFile = textureFiles[i];
                    let textureDir = path.dirname(textureFile);
                    const { width, height } = sizeOf(textureFile);
                    let extname = ".pvr";
                    if (width > 0 && width == height && ((width & (width - 1)) == 0)) {
                        this.log("iOS-[ PVR][" + _formatNumber(i + 1, _countLen) + "/" + textureFiles.length + "]:" + textureFile.replace(tmpiOSPath, ""));
                        //正方形开始且是2的n次幂，用pvr压缩纹理.
                        await ETCUtil.handlePVR(textureFile, textureDir);
                        extname = ".pvr";
                    } else {
                        this.log("iOS-[ETC2][" + _formatNumber(i + 1, _countLen) + "/" + textureFiles.length + "]:" + textureFile.replace(tmpiOSPath, ""));
                        await ETCUtil.handleETC2(textureFile, textureDir);
                        extname = ".pkm";
                    }
                    // 移除源文件
                    fs.unlinkSync(textureFile);
                    // 重命名
                    let newPath = textureFile.replace(path.extname(textureFile), extname);
                    FileUtil.rename(newPath, textureFile);
                    needZipIOSPNGFiles.push(textureFile);
                }

            }
        }
        // 4.处理GZIP压缩，只对PKM文件有效
        if (this.config.zlibEnabled) {
            if (this.config.androidEnabled) {
                let needZipAndroidPKMFiles = FileUtil.listDirectorySync(tmpAndroidPath, (_path) => !_path.endsWith(".pkm"));
                let needZipFiles = needZipAndroidPNGFiles.concat(needZipAndroidPKMFiles);
                let _countLen = (needZipFiles.length + "").length;
                for (let i = 0; i < needZipFiles.length; i++) {
                    const needZipFile = needZipFiles[i];
                    const extname = path.extname(needZipFile);
                    const dst = needZipFile.replace(extname, "_zip" + extname)
                    this.log("Android-[压缩][" + _formatNumber(i + 1, _countLen) + "/" + needZipFiles.length + "]:" + needZipFile.replace(tmpAndroidPath, ""));
                    await ZipUtil.zip(needZipFile, dst);
                    fs.unlinkSync(needZipFile);
                    FileUtil.rename(dst, needZipFile);
                }
            }
            if (this.config.iOSEnabled) {
                let needZipIOSPKM_PVRFiles = FileUtil.listDirectorySync(tmpiOSPath, (_path) => !_path.endsWith(".pkm") && !_path.endsWith(".pvr"));
                let needZipFiles = needZipIOSPNGFiles.concat(needZipIOSPKM_PVRFiles);
                let _countLen = (needZipFiles.length + "").length;
                for (let i = 0; i < needZipFiles.length; i++) {
                    const needZipFile = needZipFiles[i];
                    const extname = path.extname(needZipFile);
                    const dst = needZipFile.replace(extname, "_zip" + extname)
                    this.log("iOS-[压缩][" + _formatNumber(i + 1, _countLen) + "/" + needZipFiles.length + "]:" + needZipFile.replace(tmpiOSPath, ""));
                    await ZipUtil.zip(needZipFile, dst);
                    fs.unlinkSync(needZipFile);
                    FileUtil.rename(dst, needZipFile);
                }

            }
        }
        // 5.输出到正式目录
        if (this.config.androidEnabled) {
            execSync('rm -fr ' + this.WORKBENCH_ANDROID);
            execSync('mv ' + tmpAndroidPath + ' ' + this.WORKBENCH_ANDROID);
            Electron.shell.showItemInFolder(this.WORKBENCH_ANDROID);
        }
        if (this.config.iOSEnabled) {
            execSync('rm -fr ' + this.WORKBENCH_IOS);
            execSync('mv ' + tmpiOSPath + ' ' + this.WORKBENCH_IOS);
            Electron.shell.showItemInFolder(this.WORKBENCH_IOS);
        }
        this.log("处理完成");

    },

}
module.exports = TexturePack;