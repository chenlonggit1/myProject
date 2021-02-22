var net = require("net")
var DataManager = require("DataManager");

var CacheManager = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
    },

    properties: {

    },

    onLoad: function () {
        this.userDatas = {};
        this.debugServerDatas = {};
        this.gameData = {};
        CacheManager.instance = this;
    },

    //加载cache数据
    loadUserDatas: function () {
        var data = cc.sys.localStorage.getItem('userDatas');
        if (!data) {
            return;
        }

        var userData = JSON.parse(data);
        if (userData) {
            this.userDatas = userData;
        }
    },

    //保存cache数据
    saveUserDatas: function () {
        cc.sys.localStorage.setItem('userDatas', JSON.stringify(this.userDatas));
    },

    //加载debug模式下连接的服务器数据
    loadDebugServerDatas: function () {
        var data = cc.sys.localStorage.getItem('debugServerDatas');
        if (data) {
            var debugServerDatas = JSON.parse(data);
            if (debugServerDatas) {
                this.debugServerDatas = debugServerDatas;
                net.ServerIp = this.debugServerDatas["serverDatas"][this.debugServerDatas["selectIndex"]];
            }
        } else {
            this.debugServerDatas["selectIndex"] = 0;
            this.debugServerDatas["serverDatas"] = [];
            this.debugServerDatas["serverDatas"].push("127.0.0.1");
            cc.sys.localStorage.setItem('debugServerDatas', JSON.stringify(this.debugServerDatas));
        }
    },

    //保存debug模式下连接的服务器数据
    saveDebugServerDatas: function (selectIndex, serverDatas) {
        this.debugServerDatas["selectIndex"] = selectIndex;
        this.debugServerDatas["serverDatas"] = serverDatas;
        cc.sys.localStorage.setItem('debugServerDatas', JSON.stringify(this.debugServerDatas));
    },

    //保存游戏数据
    saveGameData: function () {
        this.gameData["voiceData"] = DataManager.instance.isPlayMusic;
        this.gameData["skipAni"] = DataManager.instance.isSkipAni;
        this.gameData["duihuan"] = DataManager.instance.audtoDuiHuan;
        cc.sys.localStorage.setItem('gameData', JSON.stringify(this.gameData));

    },

    //获取游戏数据
    getGameData: function () {
        let data = cc.sys.localStorage.getItem('gameData');
        if (!data)
            return;

        let curGameData = JSON.parse(data);
        DataManager.instance.isPlayMusic = curGameData["voiceData"];
        DataManager.instance.isSkipAni = curGameData["skipAni"];
        DataManager.instance.audtoDuiHuan = curGameData["duihuan"];
    },
});