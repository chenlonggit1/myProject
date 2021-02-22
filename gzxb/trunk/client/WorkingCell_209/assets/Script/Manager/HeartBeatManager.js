var net = require("net")

var HeartBeatManager = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
    },

    onLoad: function () {
        HeartBeatManager.instance = this;
    },

    starHeartBeat: function () {
        let self = this;
        cc.director.getScheduler().schedule(self.SendPingGameReq, self, 8);
        this.SendPingGameReq();
        console.log("starHeartBeat")
    },

    //持续发送心跳消息到服务器
    SendPingGameReq: function (d) {
        //每隔n秒检查一次网络状态
        if (net.getWSState() == WebSocket.CLOSED) {
            net.waitGatewayHeartbeatNum = 0;
            return;
        }

        try {
            net.PingGameReq();

            var interval = new Date().getTime() - net.lastMsgTime.getTime();
            if (interval > 8000) {
                net.waitGatewayHeartbeatNum++;
                //为了减低网络流量，只有在10秒钟没有任何活动的时候才发送消息。
            }

            //三次发送到服务器的消息都不成功则
            if (net.waitGatewayHeartbeatNum >= 3) {
                //断开连接
                net.close();
                return;
            }
        } catch (err) {}
    },
});