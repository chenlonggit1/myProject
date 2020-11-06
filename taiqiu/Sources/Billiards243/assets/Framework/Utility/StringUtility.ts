/**
 *    
 * 字符串操作工具类
 */
export class StringUtility {
    public static ClassName: string = "StringUtility";

    /**
     * 去掉前后空格
     * @param str
     * @returns {string}
     */
    public static TrimSpace(str: string): string {
        return str.replace(/^\s*(.*?)[\s\n]*$/g, '$1');
    }

    /**
     * 获取字符串长度，中文为2
     * @param str
     */
    public static GetLength(str: string): number {
        var strArr = str.split("");
        var length = 0;
        for (var i = 0; i < strArr.length; i++) {
            var s = strArr[i];
            if (this.IsChinese(s)) {
                length += 2;
            } else {
                length += 1;
            }
        }
        return length;
    }

    /**
     * 判断一个字符串是否包含中文
     * @param str
     * @returns {boolean}
     */
    public static IsChinese(str: string): boolean {
        var reg = /^.*[\u4E00-\u9FA5]+.*$/;
        return reg.test(str);
    }
    /**
     * 格式化字符串
     * App.StringUtils.format("comm_cards_json.zi_54x58_%2d", this._id);
     * 
     */
    public static Format(...param: any[]): string {
        var as = [].slice.call(arguments), fmt = as.shift(), i = 0;
        return fmt.replace(/%(\w)?(\d)?([dfsx])/ig, function (_, a, b, c) {
            var arg = as[i++];
            var str = arg >= 10 ? '' : '0';
            var s = b ? new Array(b - 0 + 1).join(a || '') : str;
            if (c == 'd') { s += parseInt(arg); }
            return b ? s.slice(b * -1) : s;
        })
    }

    public static Cut(str: string, len: number): string {
        let str_length = 0;
        let str_len = 0;
        let str_cut = "";
        str_len = str.length;
        for (var i = 0; i < str_len; i++) {
            let a = str.charAt(i);
            str_length++;
            if (escape(a).length > 4) {
                //中文字符的长度经编码之后大于4  
                str_length++;
            }
            str_cut = str_cut.concat(a);
            if (str_length >= len) {
                str_cut = str_cut.concat("...");
                return str_cut;
            }
        }
        //如果给定字符串小于指定长度，则返回源字符串；  
        if (str_length < len) {
            return str;
        }
    }

    public static toUtf8(str: string): string {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    }
}