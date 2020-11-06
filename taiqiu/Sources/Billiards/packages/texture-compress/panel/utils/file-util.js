var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

/**
 * JS文件工具类
 */
const FileUtil = {

    /**
     * 创建目录们
     * @param {*} directory 
     */
    mkdirsSync(directory) {
        if (fs.existsSync(directory))
            return true;
        if (this.mkdirsSync(path.dirname(directory))) {
            fs.mkdirSync(directory);
            return true;
        }
        return false;
    },
    /**
     * 同步遍历目录
     * @param {*} path 路径
     * @param {*} filter 过滤器 return true:过滤
     * @param {*} list 存放数组
     */
    listDirectorySync(src, filter, list) {
        list = list || [];
        let pa = fs.readdirSync(src);
        pa.forEach((element, _) => {
            let _path = path.join(src, element)
            let info = fs.statSync(_path);
            if (info.isDirectory()) {
                this.listDirectorySync(_path, filter, list);
            } else {
                if (!filter || !filter(_path))
                    list.push(_path);
            }
        });
        return list;
    },

    /**
     * 拷贝文件
     * @param {*} src 
     * @param {*} dst 
     */
    copyFile(src, dst) {
        if (fs.statSync(src).isFile()) {
            fs.writeFileSync(dst, fs.readFileSync(src));
            return;
        }
        let paths = fs.readdirSync(src);
        for (let i = 0; i < paths.length; i++) {
            const _path = paths[i];
            let _src = path.join(src, _path);
            let _dst = path.join(dst, _path);
            let stat = fs.statSync(_src);
            if (stat.isFile()) {
                fs.writeFileSync(_dst, fs.readFileSync(_src));
            } else if (stat.isDirectory()) {
                this.copyDirectory(_src, _dst);
            }
        }
    },

    /**
     * 拷贝目录
     * @param {*} src 
     * @param {*} dst 
     */
    copyDirectory(src, dst) {
        if (!fs.existsSync(dst)) {
            this.mkdirsSync(dst);
        }
        this.copyFile(src, dst);
    },

    /**
     * 移除某个目录
     * @param {*} src 
     */
    deleteDirectory(src) {
        let files = [];
        if (fs.existsSync(src)) {
            files = fs.readdirSync(src);
            for (let i = 0; i < files.length; i++) {
                const _path = path.join(src, files[i]);
                if (fs.statSync(_path).isDirectory()) {
                    this.deleteDirectory(_path);
                } else {
                    fs.unlinkSync(_path);
                }
            }
            fs.rmdirSync(src);
        }
    },

    /**
     * 重命名
     * @param {*} src 
     * @param {*} dst 
     */
    rename(src, dst) {
        fs.renameSync(src, dst);
    },

    /**
     * 文件MD5
     * @param {*} src 
     */
    md5(src) {
        let buffer = fs.readFileSync(src);
        let fsHash = crypto.createHash('md5');
        fsHash.update(buffer);
        return fsHash.digest('hex');
    },
}

//Test
// FileUtil.copyDirectory("/Users/berwin/Documents/XJGKS/Workspaces/Doudizhu/packages/texture-compress/panel/utils/test", "/Users/berwin/Documents/XJGKS/Workspaces/Doudizhu/packages/texture-compress/panel/utils/test-copy");
// FileUtil.copyFile("/Users/berwin/Documents/XJGKS/Workspaces/Doudizhu/packages/texture-compress/panel/utils/test/etc-util.js", "/Users/berwin/Documents/XJGKS/Workspaces/Doudizhu/packages/texture-compress/panel/utils/test/etc-util-copy.js");
// let list = FileUtil.listDirectorySync("/Users/berwin/Documents/XJGKS/Workspaces/Doudizhu/packages/texture-compress/panel/utils/test/");
// console.log(list);
// FileUtil.deleteDirectory("/Users/berwin/Documents/XJGKS/Workspaces/Doudizhu/packages/texture-compress/panel/utils/test-copy/");
// let list = FileUtil.listDirectorySync("/Users/berwin/Documents/XJGKS/Doudizhu/packages/texture-compress/panel/utils/");
// console.log(list);
module.exports = FileUtil;