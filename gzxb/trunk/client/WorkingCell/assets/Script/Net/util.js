var md5 = require('MD5')
var base64 = require('base64')
var EventManager = require("EventManager")

function GetQueryString(name, str) {
    try {
        var reg = new RegExp("(^|&?)" + name + "=([^&]*)(&|$)");
        var r = str.match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;
    } catch (err) {
        return null;
    }
}

function random(min, max) {
    return Math.round(Math.random() * (max - min)) + min
}

function int(v) {
    return Math.floor(v)
}

var c = new Array(30)
var jiang = 0
var jiao = null

function pushJiao(card) {
    card += 10
    for (var i = 0; i < jiao.length; i++) {
        if (jiao[i] == card) {
            return
        }
    }
    jiao.push(card)
}

function PwdMD5(str) {
    return md5.hex_md5(base64.base64encode(md5.hex_md5(str.toLowerCase())))
}

function xlrHttp(url, call) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
            var response = xhr.responseText;
            call(response);
            xhr = null;
        }
    };
    xhr.open("GET", url, true);
    xhr.send();
}

function Http(url, callback, target) {
    cc.loader.load(url, function (err, tex) {
        if (err) {
            console.log("------ " + err);
            return;
        }

        var newframe = new cc.SpriteFrame(tex);
        callback(target, newframe);
    });
}

/*
 *   rotation = 90/180 /270
 */

var RV = 0;

function setRotation(r) {
    RV = r;
}

function convertVector2(v2) {
    switch (RV) {
        case 90:
            var nv = cc.v2(-v2.y, -v2.x);
            return nv;
        case 180:
            var nv = cc.v2(-v2.x, v2.y);
            return nv;
        case 270:
            var nv = cc.v2(v2.y, v2.x);
            return nv;
        default:
            return v2;
    }
}

var preTick = 0

function checkClickRate() {
    var cur = new Date().getTime()
    if (cur - preTick < 250) {
        //提示操作过于频繁？
        return true
    }

    preTick = cur
    return false
}

var gBtnOn = false

function setBtnOn(b) {
    gBtnOn = b
}

function bBtnOn() {
    return gBtnOn
}

var uIconMap = {}
//保存 icon spriteFrame ,当已经有保存，并spriteframe 已经存在，则直接设置icon spriteFrame                       
function addIconCache(uid, node, iconUrl, spriteFrame) {
    if (uid == null)
        return false

    var it = uIconMap[uid]
    if (it == null) {
        it = {}
        it.node = node
        it.iconUrl = iconUrl
        it.spriteFrame = spriteFrame
        uIconMap[uid] = it
    } else {
        if (node) {
            console.log("user " + uid + " node name " + node.parent.name)
            it.node = node
        }

        if (iconUrl)
            it.url = iconUrl

        //传进了spriteFrame 即加载好了icon
        if (it.spriteFrame != null) {
            console.log("user " + uid + " set icon to " + node.parent.name)
            if (node) {
                var sp = it.node.getComponent(cc.Sprite)
                sp.spriteFrame = it.spriteFrame
                it.node.active = true
            }

            return true
        }

        if (spriteFrame) {
            console.log("set new spriteFrame --> user " + uid)
            it.spriteFrame = null
            it.spriteFrame = spriteFrame
        }
    }

    return false
}

function removeFromIconCache(uid) {
    var it = uIconMap[uid]
    if (it) {
        it.node = null
        it.url = null
    }

    uIconMap[uid] = null
}

function randomNumber(m, n) {
    var num = Math.floor(Math.random() * (m - n) + n);
    return num;
}

function lengthUTF8(len) {
    var bytes = new Array();
    for (var i = 0; i < len; i++) {
        bytes.push(0xFF);
    }
    return bytes;
}

function getAngle(x1, y1, x2, y2) {
    // 直角的边长
    var x = Math.abs(x1 - x2);
    var y = Math.abs(y1 - y2);
    // 斜边长
    var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    // 余弦
    var cos = y / z;
    // 弧度
    var radina = Math.acos(cos);
    // 角度
    var angle = 180 / (Math.PI / radina);
    return angle;
}

function getNumString(num) {
    var numStr = num + "";
    var i = numStr.length - 1,
        str = "",
        index = 0,
        backStr = "";
    for (i; i >= 0; i--) {
        if (index == 3) {
            str += ",";
            index = 0;
        }
        index++;
        str += numStr.charAt(i);
    }

    i = str.length - 1;

    for (i; i >= 0; i--) {
        backStr += str.charAt(i);
    }

    return backStr;
}

// 格式化当前时间
function ConverDateToString() {
    var myDate = new Date();
    var strDate = myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds() + ":" + myDate.getMilliseconds();
    return strDate;
}

// 获取当前时间时间戳
function GetTimeStamp() {
    return new Date().getTime();
}

//打印普通日志
function Log(content) {
    let timeString = ConverDateToString();
    console.log(ConverDateToString() + " " + content);
    EventManager.Dispatch("PrintLog", {
        message: content,
        type: "log",
        time: timeString
    });
}

//打印警告日志
function LogWarning(content) {
    let timeString = ConverDateToString();
    console.warn(timeString + " " + content);
    EventManager.Dispatch("PrintLog", {
        message: content,
        type: "warning",
        time: timeString
    });
}

//打印错误日志
function LogError(content) {
    let timeString = ConverDateToString();
    console.warn(timeString + " " + content);
    EventManager.Dispatch("PrintLog", {
        message: content,
        type: "error",
        time: timeString
    });
}


//获取两个节点距离
function getDistance(targetNode, beginNode) {
    let targetNodePos = targetNode.convertToWorldSpaceAR(cc.v2(0, 0));
    let beginNodePos = beginNode.convertToWorldSpaceAR(cc.v2(0, 0));
    let curPosX = targetNodePos.x - beginNodePos.x;
    let curPosY = targetNodePos.y - beginNodePos.y;
    return cc.v2(curPosX, curPosY);
}

//数值转换
function numberToChinese(num, decimalDigit) {
    let result = "";
    if (num / 100000000 > 1) {
        result = `${(num / 100000000).toFixed(decimalDigit)}亿`;
    } else if (num / 10000 > 1) {
        result = `${(num / 10000).toFixed(decimalDigit)}万`;
    } else {
        result = num;
    }
    return result;
}

//数值转换
function numberConvert(num) {
    let result = [], counter = 0;
    num = (num || 0).toString().split('');
    for (let i = num.length - 1; i >= 0; i--) {
        counter++;
        result.unshift(num[i]);
        if (!(counter % 3) && i != 0) { result.unshift(','); }
    }

    return result.join('');
}

module.exports = {
    random: random,
    PwdMD5: PwdMD5,
    GetQueryString: GetQueryString,
    Http: Http,
    xlrHttp: xlrHttp,
    setRotation: setRotation,
    convertVector2: convertVector2,
    checkClickRate: checkClickRate,
    setBtnOn: setBtnOn,
    bBtnOn: bBtnOn,
    addIconCache: addIconCache,
    removeFromIconCache: removeFromIconCache,
    randomNumber: randomNumber,
    getAngle: getAngle,
    getNumString: getNumString,
    ConverDateToString: ConverDateToString,
    GetTimeStamp: GetTimeStamp,
    Log: Log,
    LogWarning: LogWarning,
    LogError: LogError,
    getDistance: getDistance,
    numberToChinese: numberToChinese,
    numberConvert: numberConvert,
}