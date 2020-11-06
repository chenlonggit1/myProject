'use strict';
var fs = require('fs');
var path = require('path');
var zlib = require('zlib');
var crypto = require('crypto');
var sizeOf = require('image-size');
const Electron = require('electron');

var child_process = require('child_process');
var execSync = child_process.execSync;
var exec = child_process.exec;

const PROJ_PATH = Editor.Project.path;
let TARGET_FOLDER = "res";

function fillNumberPrefix(num, length) {
    return ("000000000000000000" + num).substr(-length);
}

function fillNumberSuffix(num, length) {
    return (num + "                    ").substr(0, length);
}

var pack = {
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
    readToolsEnv: function (cfgFile) {
        if (fs.existsSync(cfgFile)) {
            var saveData = fs.readFileSync(cfgFile, 'utf-8');
            var data = JSON.parse(saveData);
            this.config = data;
        } else {
            this.log("PACK读取配置文件不存在:" + cfgFile);
        }
        this.log("开始压缩纹理，配置:" + JSON.stringify(this.config));
        if ("" !== this.config.pathOfPVR) {
            process.env.PATH += ':' + this.config.pathOfPVR;
            this.log("PVR环境:", this.config.pathOfPVR);
        }
        if ("" !== this.config.pathOfETC) {
            process.env.PATH += ':' + this.config.pathOfETC;
            this.log("ETC环境:", this.config.pathOfETC);
        }
    },

    async startPack(cfgFile, log) {
        this._log = log;
        //set env
        this.readToolsEnv(cfgFile);

        if (this.config.handlePaths.length <= 0) {
            this.log("请先添加处理目录");
            return;
        }

        if (this.config.textureEnabled) {
            this.log("插件ETC&PVR处理暂未开放，请使用Creator自带的ETC进行PKM文件输出");
            return;
        }

        for (let i = 0; i < this.config.handlePaths.length; i++) {
            const handlePath = this.config.handlePaths[i];
            await this.startATask(handlePath);
        }

        if (!this.config.textureEnabled && this.config.zlibEnabled) {
            this.log("!!!只GZIP压缩pkm文件，不进行PVR/ETC处理!!!");
            this.allTaskFinished();
        } else {
            this.finishAllEtcTaskPack();
        }
    },

    // 所有任务完成
    allTaskFinished() {
        //写入ios配置.
        if (this.config.iOSEnabled) {
            execSync('rm -fr ' + this.resRootPathIOS);
            this.log("移除目录:" + this.resRootPathIOS);
            execSync('mv ' + this.destIOSResRoot + ' ' + this.resRootPathIOS);
            Electron.shell.showItemInFolder(this.resRootPathIOS);
        }

        //写入android 配置
        if (this.config.androidEnabled) {
            execSync('rm -fr ' + this.resRootPathAndroid);
            this.log("移除目录:" + this.resRootPathAndroid);
            execSync('mv ' + this.destAndroidResRoot + ' ' + this.resRootPathAndroid);
            Electron.shell.showItemInFolder(this.resRootPathAndroid);
        }

        var date = new Date();
        this.log('只纹理压缩完成! [' + date.toLocaleDateString() + ' ' + date.toLocaleTimeString() + ']');
    },

    async startATask(handlePath) {
        let buildPath = PROJ_PATH + "/build/jsb-default/";
        if (!fs.existsSync(buildPath)) {
            buildPath = PROJ_PATH + "/build/jsb-link/";
        }
        process.chdir(buildPath);
        this.buildPath = buildPath;
        // let resPath = buildPath + TARGET_FOLDER;
        let resPath = handlePath;
        this.resPath = resPath;

        // 获取目标路径最后一段名字
        let paths = resPath.split(path.sep).filter(p => p && p.trim());
        TARGET_FOLDER = paths.pop();

        //define iOS TARGET_FOLDER path.
        let resPathIOS = buildPath + this.WORKBENCH_IOS + path.sep + TARGET_FOLDER;
        this.resConfigIOS = resPathIOS + path.sep + "pack.config";
        this.resRootPathIOS = buildPath + this.WORKBENCH_IOS;

        //define android TARGET_FOLDER path.
        let resPathAndroid = buildPath + this.WORKBENCH_ANDROID + path.sep + TARGET_FOLDER;
        this.resConfigAndroid = resPathAndroid + path.sep + "pack.config";
        this.resRootPathAndroid = buildPath + this.WORKBENCH_ANDROID;

        //create parent path.
        if (this.config.iOSEnabled && !fs.existsSync(this.resRootPathIOS)) {
            fs.mkdirSync(this.resRootPathIOS);
        }
        if (this.config.androidEnabled && !fs.existsSync(this.resRootPathAndroid)) {
            fs.mkdirSync(this.resRootPathAndroid);
        }

        //read ios & android config
        if (this.config.iOSEnabled && fs.existsSync(this.resConfigIOS)) {
            let content = fs.readFileSync(this.resConfigIOS, 'UTF-8');
            this.packedIOSResConfig = JSON.parse(content);
        } else {
            this.packedIOSResConfig = {};
        }
        if (this.config.androidEnabled && fs.existsSync(this.resConfigAndroid)) {
            let content = fs.readFileSync(this.resConfigAndroid, 'UTF-8');
            this.packedAndroidResConfig = JSON.parse(content);
        } else {
            this.packedAndroidResConfig = {};
        }
        this.srcfiles = [];

        //ios & android temp path.
        this.destIOSResPath = buildPath + "pack-temp-ios/" + TARGET_FOLDER;
        this.destIOSResRoot = buildPath + "pack-temp-ios";

        this.destAndroidResPath = buildPath + "pack-temp-android/" + TARGET_FOLDER;
        this.destAndroidResRoot = buildPath + "pack-temp-android";

        if (this.config.iOSEnabled && !fs.existsSync(this.destIOSResRoot)) {
            fs.mkdirSync(this.destIOSResRoot);
        }
        if (this.config.androidEnabled && !fs.existsSync(this.destAndroidResRoot)) {
            fs.mkdirSync(this.destAndroidResRoot);
        }

        this.resIOSFileConfig = {};
        this.resAndroidFileConfig = {};
        this.log("开始拷贝:" + resPath);
        this.log("安卓目标:" + this.destIOSResPath);
        this.log("IOS目标:" + this.destAndroidResPath);
        this.copyDir(resPath, this.destIOSResPath, this.destAndroidResPath);

        if (!this.config.textureEnabled && this.config.zlibEnabled) {
            this.log("!!!只GZIP压缩pkm文件，不进行PVR/ETC处理!!!");
            await this.gzipPkmFiles();
        } else {
            await this.packFiles(0);
        }
    },

    /**
     * pvr 压缩.
     */
    async packPVR(srcPath, sfile, dfile) {
        return new Promise((reslove, reject) => {
            let outputPath = srcPath + '/out.pvr';
            let pvrshell = 'PVRTexToolCLI -i ' + sfile + ' -o ' + outputPath + ' -square + -pot + -q pvrtcbest -f PVRTC1_4,UBN,lRGB';
            exec(pvrshell, {
                encoding: 'utf8',
                env: process.env
            }, (err, stdout, stderr) => {
                let finish = true;
                if (fs.existsSync(outputPath)) {
                    this.copyAndGzipFile(outputPath, dfile, () => {
                        reslove({ finish: true, dest: dfile });
                    });
                    fs.unlink(outputPath);
                } else {
                    this.log('压缩PVR失败:' + err);
                    fs.writeFileSync(dfile, buffer);
                    reslove({ finish: false, dest: null });
                    finish = false;
                }
            });
        });
    },

    /**
     * ETC1 压缩 带alpha通道.
     */
    packETCAplha(srcPath, sfile, dfile, dfile2) {
        let self = this;
        return new Promise((reslove, reject) => {
            let packTemp = sfile.replace(/\.[^/.]+$/, "");
            let outputPath = packTemp + '.pkm';
            let shell = 'etcpack ' + sfile + ' ' + srcPath + ' -c etc -aa';
            if (!this.config.alphaEnabled) {
                shell = 'etcpack ' + sfile + ' ' + srcPath + ' -c etc';
            }
            exec(shell, {
                encoding: 'utf8',
                env: process.env
            }, (err, stdout, stderr) => {
                let finish = true;
                if (fs.existsSync(outputPath)) {
                    if (dfile2) {
                        this.copyAndGzipFile(outputPath, dfile2);
                    }
                    this.copyAndGzipFile(outputPath, dfile, () => {
                        reslove({ finish: true });
                    });
                    fs.unlink(outputPath, function () {
                        // self.log("unlink:" + outputPath);
                    });
                } else {
                    finish = false;
                    let buffer = fs.readFileSync(sfile);
                    fs.writeFileSync(dfile, buffer);
                    self.log('ETC压缩失败, ' + sfile);
                    reslove({ finish: finish, dest: dfile });
                }
            });
        });
    },

    /**
     * ETC2 压缩.
     */
    async packETC2(srcPath, sfile, dfile, dfile2) {
        return new Promise((reslove, reject) => {
            let packTemp = sfile.replace(/\.[^/.]+$/, "");
            let outputPath = packTemp + '.pkm';
            let shell = 'etcpack ' + sfile + ' ' + srcPath + ' -c etc2 -f RGBA';
            exec(shell, {
                encoding: 'utf8',
                env: process.env
            }, (err, stdout, stderr) => {
                let finish = true;
                if (fs.existsSync(outputPath)) {
                    if (dfile2) {
                        this.copyAndGzipFile(outputPath, dfile2);
                    }
                    this.copyAndGzipFile(outputPath, dfile, () => {
                        reslove({ finish: finish, dest: dfile });
                    });
                    fs.unlink(outputPath);
                } else {
                    finish = false;
                    let buffer = fs.readFileSync(sfile);
                    fs.writeFileSync(dfile, buffer);
                    this.log('ETC2压缩失败, ' + sfile);
                    reslove({ finish: finish, dest: null });
                }
            });
        });
    },

    /**
     * gzip 压缩图片
     * @param {*} src   源文件
     * @param {*} dst   目标文件
     */
    async copyAndGzipFileSync(src, dst) {
        return new Promise((reslove, reject) => {
            let dstStream = fs.createWriteStream(dst);
            dstStream.once("close", () => {
                reslove({ src, dst });
            });
            if (this.config.zlibEnabled)
                fs.createReadStream(src).pipe(zlib.createGzip()).pipe(dstStream);
            else
                fs.createReadStream(src).pipe(dstStream);
        });
    },

    copyAndGzipFile(src, dst, handler) {
        let dstStream = fs.createWriteStream(dst);
        dstStream.once("close", () => {
            handler && handler(src, dst);
        });
        if (this.config.zlibEnabled)
            fs.createReadStream(src).pipe(zlib.createGzip()).pipe(dstStream);
        else
            fs.createReadStream(src).pipe(dstStream);
    },

    /**
     * 拷贝文件.
     */
    async copyFile(sfile, dfile) {
        return new Promise((reslove, reject) => {
            if (fs.existsSync(dfile)) {
                fs.unlink(dfile);
            }
            fs.readFile(sfile, (err, buffer) => {
                let finish = true;
                if (err) {
                    this.log('读文件失败: ' + err);
                    finish = false;
                    reslove({ finish: finish, dest: null });
                    // if (callBack) {
                    //     callBack(finish, null);
                    // }
                } else {
                    fs.writeFile(dfile, buffer, (err) => {
                        if (err) {
                            finish = false;
                            this.log('写文件失败: ' + err);
                        }
                        reslove({ finish: finish, dest: dfile });
                        // if (callBack) {
                        //     callBack(finish, dfile);
                        // }
                    });
                }
            });
        });
    },

    /**
     * 压缩android 资源
     */
    async packAndroidRes(src, name, sfile, dfileAndroid, md5, key) {
        return new Promise(async (reslove, reject) => {
            let packedMD5Android = this.packedAndroidResConfig[key];
            let packedAPath = sfile.replace('\/' + TARGET_FOLDER + '\/', path.sep + this.WORKBENCH_ANDROID + path.sep + TARGET_FOLDER + path.sep);
            if (packedMD5Android === md5 && fs.existsSync(packedAPath)) {
                let { finish, dest } = await this.copyFile(packedAPath, dfileAndroid);
                if (finish) {
                    this.log('Android纹理未修改 ' + name);
                    reslove({ finish: true, dest: dfileAndroid });
                } else {
                    this.log('Android拷贝文件失败!!!  ' + packedAPath);
                    reslove({ finish: false, dest: null });
                }
            } else {
                this.log('开始压缩[ETC1]  ' + name + ", md5:" + md5);
                let { finish, dest } = await this.packETCAplha(src, sfile, dfileAndroid);
                if (finish) {
                    this.log('压缩完成 ' + name);
                    reslove({ finish: true, dest: dfileAndroid });
                } else {
                    this.log('ETC1压缩失败!!! ' + sfile);
                    let buffer = fs.readFileSync(sfile);
                    fs.writeFileSync(dfileAndroid, buffer);
                    reslove({ finish: false, dest: null });
                }
            }
        });
    },

    async gzipPkmFiles() {
        // 记录任务
        let tasks = [];
        let handlerOfFile = (src) => {
            if (this.isPkmFile(src)) {
                let _tmp = src.replace(/\.[^/.]+$/, "");
                let dst = _tmp + "_gzip_tmp.pkm";
                let originStat = fs.statSync(src);
                tasks.push({
                    src: src,
                    dst: dst,
                    size: originStat.size,
                });
            }
        }

        this.config.iOSEnabled && this.justCopyDir(this.resPath, this.destIOSResPath, handlerOfFile);
        this.config.androidEnabled && this.justCopyDir(this.resPath, this.destAndroidResPath, handlerOfFile);

        for (let i = 0; i < tasks.length; i++) {
            let { src, dst, size } = tasks[i];
            await this.copyAndGzipFileSync(src, dst);
            let showSrc = src.replace(this.destAndroidResPath, "");
            showSrc = TARGET_FOLDER + showSrc.replace(this.destIOSResPath, "");
            let stat = fs.statSync(dst);
            this.log("[GZIP]完成" + fillNumberSuffix("[" + (size / 1024).toFixed(2) + "KB/" + (stat.size / 1024).toFixed(2) + "KB]:", 24) + "\t" + showSrc);
            fs.unlinkSync(src);
            fs.renameSync(dst, src);
        }
    },

    async packFiles(index) {
        let self = this;
        if (this.srcfiles.length > index) {
            let packfile = this.srcfiles[index];
            let src = packfile.sourcePath;
            let sfile = packfile.source;
            let dfileIOS = packfile.destinationIOS;
            let dfileAndroid = packfile.destinationAndroid;
            let path = packfile.name;
            let buffer = fs.readFileSync(sfile);
            var dimensions = sizeOf(sfile);
            let w = dimensions.width;
            let h = dimensions.height;

            let key = sfile.replace(PROJ_PATH, '');

            let fsHash = crypto.createHash('md5');
            fsHash.update(buffer);
            let md5 = fsHash.digest('hex');
            this.log('checking  ' + path + ", md5:" + md5);
            let self = this;
            let packaedMD5 = "";
            let packedPath = ""
            if (this.config.androidEnabled) {
                packaedMD5 = this.packedAndroidResConfig[key];
                packedPath = sfile.replace('\/' + TARGET_FOLDER + '\/', path.sep + this.WORKBENCH_ANDROID + path.sep + TARGET_FOLDER + path.sep);
            }
            if (this.config.iOSEnabled) {
                packaedMD5 = this.packedIOSResConfig[key];
                packedPath = sfile.replace('\/' + TARGET_FOLDER + '\/', path.sep + this.WORKBENCH_IOS + path.sep + TARGET_FOLDER + path.sep);
            }
            if (md5 === packaedMD5 && fs.existsSync(packedPath)) {
                //图片未修改，直接用原来已经压缩好的资源.
                if (self.config.iOSEnabled) {
                    let { finish, dest } = await this.copyFile(packedPath, dfileIOS);
                    if (finish) {
                        self.resIOSFileConfig[key] = md5;
                        this.log('纹理未修改 ' + path);
                        if (self.config.androidEnabled) {
                            //压缩Android端的纹理
                            let { finish, dest } = await self.packAndroidRes(src, path, sfile, dfileAndroid, md5, key);
                            if (finish) {
                                self.resAndroidFileConfig[key] = md5;
                            }
                            process.nextTick(async () => await self.packFiles(++index));
                        }
                    } else {
                        this.log('拷贝文件失败!!!  ' + packedPath);
                    }
                } else if (self.config.androidEnabled) {
                    //压缩Android端的纹理
                    let { finish, dest } = await self.packAndroidRes(src, path, sfile, dfileAndroid, md5, key);
                    if (finish) {
                        self.resAndroidFileConfig[key] = md5;
                    }
                    process.nextTick(async () => await self.packFiles(++index));
                }
            } else if (w > 0 && w == h && ((w & (w - 1)) == 0)) {
                this.log('图片宽度：' + w + ' 图片高度：' + h);
                if (self.config.iOSEnabled) {
                    this.log('开始压缩图片[PVRTC] ' + path);
                    //正方形开始且是2的n次幂，用pvr压缩纹理.
                    let { finish, dest } = this.packPVR(src, sfile, dfileIOS);
                    if (finish) {
                        this.log('PVR压缩完成');
                        self.resIOSFileConfig[key] = md5;
                        if (self.config.androidEnabled) {
                            //压缩Android端纹理
                            let { finish, dest } = await self.packAndroidRes(src, path, sfile, dfileAndroid, md5, key);
                            if (finish) {
                                self.resAndroidFileConfig[key] = md5;
                                process.nextTick(async () => await self.packFiles(++index));
                            }
                        }
                    } else {
                        this.log('压缩失败!!! ' + sfile);
                    }
                } else if (self.config.androidEnabled) {
                    //压缩Android端纹理
                    let { finish, dest } = await self.packAndroidRes(src, path, sfile, dfileAndroid, md5, key);
                    if (finish) {
                        self.resAndroidFileConfig[key] = md5;
                        process.nextTick(async () => await self.packFiles(++index));
                    }
                }
            } else {
                //文件有修改, 调用压缩纹理
                this.log('图片宽度：' + w + ' 图片高度：' + h);
                if (self.config.iOSEnabled) { // ios
                    this.log('开始压缩[ETC2]  ' + path + ", md5:" + md5);
                    let { finish, dest } = await this.packETC2(src, sfile, dfileIOS, '');
                    if (finish) {
                        this.log('压缩完成 ');
                        self.resIOSFileConfig[key] = md5;
                        if (self.config.androidEnabled) {
                            self.resAndroidFileConfig[key] = md5;
                            let { finish, dest } = await self.packAndroidRes(src, path, sfile, dfileAndroid, md5, key);
                            if (finish) {
                                self.resAndroidFileConfig[key] = md5;
                                process.nextTick(async () => await self.packFiles(++index));
                            }
                        }
                        /*self.packFiles(++index);*/
                    } else {
                        this.log('压缩失败!!! ' + sfile);
                        process.nextTick(async () => await self.packFiles(++index));
                    }
                } else if (self.config.androidEnabled) { // android
                    self.resAndroidFileConfig[key] = md5;
                    let { finish, dest } = await self.packAndroidRes(src, path, sfile, dfileAndroid, md5, key);
                    if (finish) {
                        self.resAndroidFileConfig[key] = md5;
                        process.nextTick(async () => await self.packFiles(++index));
                    }
                }
            }
        } else {
            // this.finishPack();
        }
    },

    finishAllEtcTaskPack: function () {
        this.log('写入配置...');
        //写入ios配置.
        if (this.config.iOSEnabled) {
            let iOSConfig = JSON.stringify(this.resIOSFileConfig);
            let iOSConfigPath = this.destIOSResPath + '/pack.config';
            fs.writeFileSync(iOSConfigPath, iOSConfig, 'utf8');
            execSync('rm -fr ' + this.resRootPathIOS);
            execSync('mv ' + this.destIOSResRoot + ' ' + this.resRootPathIOS);
        }

        //写入android 配置
        if (this.config.androidEnabled) {
            let androidConfig = JSON.stringify(this.resAndroidFileConfig);
            let androidConfigPath = this.destAndroidResPath + '/pack.config';
            fs.writeFileSync(androidConfigPath, androidConfig, 'utf8');

            execSync('rm -fr ' + this.resRootPathAndroid);
            execSync('mv ' + this.destAndroidResRoot + ' ' + this.resRootPathAndroid);
        }

        var date = new Date();
        this.log('纹理压缩完成! [' + date.toLocaleDateString() + ' ' + date.toLocaleTimeString() + ']');
    },

    justCopyDir: function (src, dst, handler) {
        !fs.existsSync(dst) && fs.mkdirSync(dst);
        this.justCopyFiles(src, dst, handler);
    },

    justCopyFiles: function (src, dst, handler) {
        let self = this;
        let paths = fs.readdirSync(src);
        paths.forEach((path) => {
            let _src = src + '/' + path;
            let _dst = dst + '/' + path;
            let stat = fs.statSync(_src);
            if (stat.isFile()) {
                let buffer = fs.readFileSync(_src);
                fs.writeFileSync(_dst, buffer);
                handler && handler(_dst);
            } else if (stat.isDirectory()) {
                self.justCopyDir(_src, _dst, handler);
            }
        });
    },

    copyDir: function (srcDir, destIOSDir, destAndroidDir) {
        if (this.config.iOSEnabled && !fs.existsSync(destIOSDir)) {
            fs.mkdirSync(destIOSDir);
        }
        if (this.config.androidEnabled && !fs.existsSync(destAndroidDir)) {
            fs.mkdirSync(destAndroidDir);
        }
        this.copyFiles(srcDir, destIOSDir, destAndroidDir);
    },

    copyFiles: function (src, destIOSDir, destAndroidDir) {
        let self = this;
        let paths = fs.readdirSync(src);
        paths.forEach((path) => {
            let sfile = src + '/' + path;
            let dfileIOS = destIOSDir + '/' + path;
            let dfileAndroid = destAndroidDir + '/' + path;
            let stat = fs.statSync(sfile);
            if (stat.isFile() && self.isFileNeedPack(path, sfile)) {
                let packfile = {
                    source: sfile,
                    destinationIOS: dfileIOS,
                    destinationAndroid: dfileAndroid,
                    sourcePath: src,
                    name: path
                };
                this.srcfiles.push(packfile);
            } else if (stat.isDirectory()) {
                self.copyDir(sfile, dfileIOS, dfileAndroid);
            } else {
                let buffer = fs.readFileSync(sfile);
                this.config.iOSEnabled && fs.writeFileSync(dfileIOS, buffer);
                this.config.androidEnabled && fs.writeFileSync(dfileAndroid, buffer);
            }
        });
    },

    //文件是否要压缩.
    isFileNeedPack: function (filename, fullPath) {
        if (filename.endsWith('.png') ||
            filename.endsWith('.jpg')) {
            return true;
        }
        return false;
    },

    //文件是否要压缩.
    isPkmFile: function (filename, fullPath) {
        if (filename.endsWith('.pkm')) {
            return true;
        }
        return false;
    },
}



module.exports = pack;