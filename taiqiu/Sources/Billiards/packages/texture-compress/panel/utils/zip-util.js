var fs = require('fs');
var zlib = require('zlib');
/**
 * zlib 压缩工具
 */
const ZipUtil = {

    /**
     * zlib压缩
     */
    async zip(src, dst) {
        return new Promise((reslove, reject) => {
            let dstStream = fs.createWriteStream(dst);
            dstStream.once("close", () => reslove({ error: null }));
            fs.createReadStream(src).pipe(zlib.createGzip()).pipe(dstStream);
        });
    },
}
let test = async () => {
    console.log("start");
    let result = await ZipUtil.zip(
        "/Users/berwin/Documents/XJGKS/Doudizhu/packages/texture-compress/panel/utils/hudiexianzi31.pkm",
        "/Users/berwin/Documents/XJGKS/Doudizhu/packages/texture-compress/panel/utils/hudiexianzi31-zip.pkm");
    console.log(result);
}
// test();

module.exports = ZipUtil;