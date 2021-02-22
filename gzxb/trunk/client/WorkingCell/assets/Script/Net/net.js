var ProtoBuf = require("protobuf");
var GameConfig = require("GameConfig");
var EventManager = require('EventManager');

//网络类
var net = {}

//服務器ip
net.ServerIp = "127.0.0.1";

//服務器端口
net.ServerPort = 10211;

//遊戲id
net.GameId = 10095

//場id
net.ArenaId = 106

//是否网络处于激活状态
net.isActive = false

//网关心跳超时次数
net.waitGatewayHeartbeatNum = 0

//收到最后一条协议的时间
net.lastMsgTime = 0;

//是否在游戏中
net.gameIng = false;

//玩家ID
net.PlayerId = 0;

//断线重连次数
net.reconnectCount = 0;

//是否已经加载完proto文件
net.loadedProtoBuf = false;

//主动断开网络时，是否显示提示框
net.bShowNetErrorTips = true;

//基础消息协议号，因为这个是基础包，没有协议号
net.MsgCmd = {
    "Message": 1,
    "HttpResult": 50,
}

var protoList = {}
net.LoadProto = function (name) {
    cc.loader.loadRes("proto/" + name, function (err, data) {
        protoList[name] = ProtoBuf.protoFromString(data)

        //创建proto中的枚举对象
        net.createProtoEnum();

        net.loadedProtoBuf = true;

        EventManager.Dispatch("LoadProtoFinished")
    })
}

var errorCodeEnum = {}
var messageCodeEnum = {}
net.createProtoEnum = function () {
    errorCodeEnum = protoList["game_message"].build("Game.ErrorCode");
    messageCodeEnum = protoList["game_message"].build("Game.PROTOCOL");
}

net.getErrorCodeEnum = function () {
    return messageCodeEnum
}

//根据错误码数值获取错误码
net.getErrorCodeWithEnumValue = function (valueOfNumber) {
    return ProtoBuf.Reflect.Enum.getName(errorCodeEnum, valueOfNumber)
}

//根据消息数值获得消息码
net.getMessageCodeWithEnumValue = function (valueOfNumber) {
    return ProtoBuf.Reflect.Enum.getName(messageCodeEnum, valueOfNumber)
}

//根据协议的Value值获取Key
net.getMessageKeyWithValue = function (value) {
    let temp = "";
    for (var key in net.messageCode) {
        if (net.messageCode[key] == value) {
            temp = key;
            break;
        }
    }

    return temp;
}

//根据消息名获取消息Id
net.getMessageIdWithName = function (messageName) {
    return messageCodeEnum[net.getMessageKeyWithValue(messageName)];
}

var proto = {}
net.MakeMsg = function (msgName, cmd, pack) {
    if (!msgName && cmd) {
        msgName = net.messageCode[net.getMessageCodeWithEnumValue(cmd)];
    }
    if (!cmd) {
        cmd = net.getMessageIdWithName(msgName);
    }
    var msg = proto[msgName]
    if (!msg) {
        for (var protoName in protoList) {
            msg = protoList[protoName].build("Game." + msgName)
            if (msg) {
                proto[msgName] = msg
                break
            }
        }
    }
    if (msg && pack) {
        //这两个协议返回的是二进制数据
        if (msgName == "HttpResult" || msgName == "AllocServerAddressResp") {
            return msg.decode(pack, null, "binary")
        } else {
            return msg.decode(pack)
        }
    }
    return msg ? new msg() : null
}

//收到服务器下发的消息
net.OnRecvMsg = function (pack) {
    var msg = net.MakeMsg(null, net.MsgCmd["Message"], pack);
    return msg
}

//输出网络数据包的内容
net.printNetDataInfo = function (pack, err) {
    var dv = new DataView(pack)
    var len = pack.byteLength;
    console.error("OnMessage parse error")
    if (err) {
        console.error(err.stack)
    }

    var mo = len % 4;
    if (mo == 0) {
        var view32 = new Uint32Array(pack);
        var str = "32位：";
        for (var i = 0; i < view32.length; i++) {
            str += view32[i].toString(2) + ","
        }
        console.log(view32.length + "----------------------, " + str)
    } else {
        var str = "8位：";
        var view8 = new Uint8Array(pack);
        for (var j = 0; j < mo; j++) {
            str += view8[j].toString(2) + ","
        }

        if (view8.length > 4) {
            str += "---|32位：---"
            var data = pack.slice(mo);
            var view32 = new Uint32Array(data);
            for (var i = 0; i < view32.length; i++) {
                str += view32[i].toString(2) + ","
            }
        }
        console.log(view32.length + "----------------------, " + str)
    }
}

var ws = null
//网络连接
net.Connect = function (bReconnect) {
    if (net.conneting)
        return;

    if (ws) {
        ws.onopen = function (event) {}
        ws.onmessage = function (event) {}
        ws.onerror = function (event) {}
        ws.onclose = function (event) {}
        ws.close();
        ws = null;
        return;
    }

    if (bReconnect) {
        net.reconnectCount++;
    }

    net.lastMsgTime = new Date();
    net.conneting = true;

    var IP_ = net.ServerIp
    var PORT_ = net.ServerPort

    var connectStr = "ws://" + IP_ + ":" + PORT_;

    console.log("ws Connect str = " + connectStr);
    setTimeout(function () {
        ws = new WebSocket(connectStr)
        ws.binaryType = "arraybuffer"
        ws.onopen = function (event) {
            net.reconnectCount = 0;
            //网络连接成功
            EventManager.Dispatch('netSuccess');
            net.conneting = false;
            net.isActive = true;
        }

        ws.onmessage = function (event) {
            net.lastMsgTime = new Date(); //网络检测
            net.waitGatewayHeartbeatNum = 0; //网络检测

            let responseMsg = function (baseMsg, bIsSuccess) {
                try {
                    let msg = net.MakeMsg(null, baseMsg.Ops, baseMsg.Data)
                    let responseName = net.messageCode[net.getMessageCodeWithEnumValue(baseMsg.Ops)]
                    if (responseName != null) {
                        if (GameConfig.isDebugGame) {
                            console.log("Recv cmd: " + responseName + " ,Msg：" + JSON.stringify(msg) + " baseMsg.Ops = " + baseMsg.Ops)
                        }

                        var callBack = null;
                        let callBackName = "";

                        if (bIsSuccess) {
                            callBackName = "On" + responseName;
                        } else {
                            callBackName = "On" + responseName + "Failed";
                        }

                        callBack = net[callBackName];

                        if (callBack) {
                            callBack(msg)
                        }
                    } else {
                        console.error("Can not get response name in net.messageCode and responseName is " + responseName);
                    }

                } catch (error) {
                    console.error("OnMessage callback find logic error: " + baseMsg.Ops + ", " + error.stack);
                }
            }

            setTimeout(function () {
                let baseMsg;
                try {
                    baseMsg = net.OnRecvMsg(event.data);
                    if (baseMsg == null) {
                        net.printNetDataInfo(event.data, null);
                        return;
                    }
                } catch (err) {
                    net.printNetDataInfo(event.data, err);
                    return;
                }

                //这里的PlayerId是服务器返回的回应码，0为成功，其它为出现错误
                if (baseMsg.PlayerId == 0) {
                    //操作成功协议处理
                    responseMsg(baseMsg, true);
                } else {
                    if (baseMsg.PlayerId <= 1000) {
                        //这里的错误可能是由于传参错误等造成的，非正常游戏逻辑，只打印日志，方便测试。
                        let errorCode = net.getErrorCodeWithEnumValue(parseInt(baseMsg.PlayerId));
                        let errorCodeText = net.errorCodeText[errorCode]
                        console.log("baseMsg.Ops" + baseMsg.Ops + "baseMsg.PlayerId = " + baseMsg.PlayerId + "System error errorCode = " + errorCode + " errorCodeText = " + errorCodeText);
                    } else {
                        let errorCode = net.getErrorCodeWithEnumValue(parseInt(baseMsg.PlayerId))
                        console.log("baseMsg.Ops" + baseMsg.Ops + "OnMessage cause requese failed errorCode = " + errorCode + " errorIndex = " + baseMsg.PlayerId);
                        let errorCodeText = net.errorCodeText[errorCode]
                        if (errorCodeText != null) {
                            if (errorCodeText != "") {
                                //错误提示弹窗
                                EventManager.Dispatch("ResponseCodeError", errorCodeText);
                            } else {
                                //操作失败协议处理
                                responseMsg(baseMsg, false);
                            }
                        } else {
                            //操作失败协议处理
                            responseMsg(baseMsg, false);
                        }
                    }
                }
            }, 100);
        }

        ws.onerror = function (event) {
            console.log("ws onerror")
            net.conneting = false;
            ws.close();
        }

        ws.onclose = function (event) {
            console.log("ws onclose event.code = " + event.code)
            ws = null;
            net.isActive = false;
            net.conneting = false;

            if (net.bShowNetErrorTips) {
                EventManager.Dispatch("NetClose", event.code)
            }
        }
    }.bind(this), 0);
}

net.getWSState = function () {
    if (ws == null) {
        return WebSocket.CLOSED;
    }

    return ws.readyState;
}

//关闭网络
net.close = function (bShowNetErrorTips = true) {
    if (ws) {
        net.bShowNetErrorTips = bShowNetErrorTips;
        ws.close();
    }
}

//创建基础包
net.makeBaseMsg = function (cmd, msgToSend) {
    var baseMsg = net.MakeMsg("Message")
    baseMsg.PlayerId = net.PlayerId;
    baseMsg.Ops = cmd;
    baseMsg.Data = msgToSend.toBuffer();

    return baseMsg;
}

//发送消息
net.sendMesssage = function (messageName, msgToSend) {
    let cmd = net.getMessageIdWithName(messageName)
    var baseMsg = net.makeBaseMsg(cmd, msgToSend);
    var msg = baseMsg.toBuffer()

    if (GameConfig.isDebugGame) {
        if (cmd != 1002 || cmd != 1003) {
            console.log("Send cmd: " + net.messageCode[net.getMessageCodeWithEnumValue(cmd)] + ", cmd: " + cmd + ", Msg：" + JSON.stringify(msgToSend))
        }
    }

    if (ws != null && ws.readyState === WebSocket.OPEN) {
        ws.send(msg);
    } else {
        if (net.isActive) {
            net.close();
        }
    }
}

module.exports = net