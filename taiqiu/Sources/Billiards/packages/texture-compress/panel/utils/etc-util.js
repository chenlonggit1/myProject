var path = require('path');
var child_process = require('child_process');
var exec = child_process.exec;

/**
 * ETC工具类
 */
const ETCUtil = {

    /**
     * 设置环境变量
     * @param {*} pathOfETC 
     * @param {*} pathOfPVR 
     */
    setUpEnvironment(pathOfETC, pathOfPVR) {
        process.env.PATH += ":" + pathOfETC;
        process.env.PATH += ":" + pathOfPVR;
    },

    /**
     * ETC1 & Alpha 压缩
     * @param {*} src 源文件
     * @param {*} dstDirectory 输出目录 *.pkm
     */
    async handleETC1(src, dstDirectory, enableAlpha = true) {
        return new Promise((reslove, reject) => {
            let shell = "etcpack " + src + " " + dstDirectory + " -c etc" + (enableAlpha ? " -aa" : "");
            exec(shell, {
                encoding: 'utf8',
                env: process.env
            }, (err, stdout, stderr) => {
                if (err) {
                    reslove({ error: err });
                    console.error("ETC1错误:", src, err);
                    return;
                }
                reslove({ error: null });
            });
        });
    },

    /**
     * ETC2 压缩
     * @param {*} src 源文件
     * @param {*} dstDirectory 输出目录 *.pkm
     */
    async handleETC2(src, dstDirectory) {
        return new Promise((reslove, reject) => {
            let shell = "etcpack " + src + " " + dstDirectory + " -c etc2 -f RGBA";
            exec(shell, {
                encoding: 'utf8',
                env: process.env
            }, (err, stdout, stderr) => {
                if (err) {
                    reslove({ error: err });
                    console.error("ETC2错误:", src, err);
                    return;
                }
                reslove({ error: null });
            });
        });
    },

    /**
     * PVR 压缩
     * @param {*} src 源文件
     * @param {*} dstDirectory 输出目录 *.pvr
     */
    async handlePVR(src, dstDirectory) {
        return new Promise((reslove, reject) => {
            let name = path.basename(src);
            name = name.replace(path.extname(src), "");
            dstDirectory = path.join(dstDirectory, name + ".pvr");
            let pvrshell = 'PVRTexToolCLI -i ' + src + ' -o ' + dstDirectory + ' -square + -pot + -q pvrtcbest -f PVRTC1_4,UBN,lRGB';
            exec(pvrshell, {
                encoding: 'utf8',
                env: process.env
            }, (err, stdout, stderr) => {
                if (err) {
                    reslove({ error: err });
                    console.error("PVR错误:", src, err);
                    return;
                }
                reslove({ error: null });
            });
        });
    },
}

let test = async () => {
    // ETCUtil.setUpEnvironment(
    //     "/Applications/CocosCreator/Creator/2.4.3-rc.7/CocosCreator.app/Contents/Resources/static/tools/texture-compress/mali/OSX_x86",
    //     "/Applications/CocosCreator/Creator/2.4.3-rc.7/CocosCreator.app/Contents/Resources/static/tools/texture-compress/PVRTexTool/OSX_x86");
    ETCUtil.setUpEnvironment(
        "/Applications/CocosCreator/Creator/2.4.3-rc.7/CocosCreator.app/Contents/Resources/static/tools/texture-compress/mali/OSX_x86",
        "/Applications/CocosCreator/Creator/2.4.3-rc.7/CocosCreator.app/Contents/Resources/static/tools/texture-compress/PVRTexTool/OSX_x86");
    // let result = await ETCUtil.handleETC1(
    //     "/Users/berwin/Documents/XJGKS/Workspaces/Doudizhu/packages/texture-compress/panel/utils/hudiexianzi31.png",
    //     "/Users/berwin/Documents/XJGKS/Workspaces/Doudizhu/packages/texture-compress/panel/utils/");
    let result = await ETCUtil.handleETC1(
        "/Users/berwin/Documents/XJGKS/Doudizhu/packages/texture-compress/panel/utils/hudiexianzi31.png",
        "/Users/berwin/Documents/XJGKS/Doudizhu/packages/texture-compress/panel/utils/");
    console.log(result);
    // let result = await ETCUtil.handleETC2("/Users/berwin/Documents/XJGKS/Workspaces/Doudizhu/packages/texture-compress/panel/utils/hudiexianzi31.png", "/Users/berwin/Documents/XJGKS/Workspaces/Doudizhu/packages/texture-compress/panel/utils/");
    // console.log(result);
    // let result = await ETCUtil.handlePVR("/Users/berwin/Documents/XJGKS/Workspaces/Doudizhu/packages/texture-compress/panel/utils/hudiexianzi31.png", "/Users/berwin/Documents/XJGKS/Workspaces/Doudizhu/packages/texture-compress/panel/utils/");
    // console.log(result);
}
// test();


module.exports = ETCUtil;