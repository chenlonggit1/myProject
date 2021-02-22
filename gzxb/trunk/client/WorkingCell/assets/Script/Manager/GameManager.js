var net = require("net")
var GameConfig = require("GameConfig")
var CacheManager = require("CacheManager")
var AudioManager = require("AudioManager")
var EventManager = require("EventManager")
var ResourceManager = require("ResourceManager")
var AssetsPathManager = require("AssetsPathManager")

var GameManager = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
    },

    properties: {},

    start: function () {
        GameManager.instance = this;

        //加载协议文件
        net.LoadProto("game_message");

        //初始化事件
        this.initEvent();

        //加载json文件
        this.loadJsonFiles();

        //初始化音频
        AudioManager.instance.initAudio();

        //加载cache数据
        CacheManager.instance.loadUserDatas();
        CacheManager.instance.loadDebugServerDatas();
        CacheManager.instance.getGameData();

        //添加为不销毁节点
        cc.game.addPersistRootNode(this.node);
    },

    initEvent: function () {
        EventManager.Add("LoadJsonFile", function (event, data) {
            if (data == event.needLoadJsonFileCount) {

            }
        }, this)
    },

    removeEvent: function () {
        EventManager.Remove("LoadJsonFile");
    },

    //加载json文件
    loadJsonFiles: function () {
        //需要加载的json文件数量
        this.needLoadJsonFileCount = 0;
        //已经加载完成的json文件数量
        this.loadedJsonFileCount = 0;

        //基础配置
        this.loadJsonFileWithName("json/basic", function (jsonAsset) {
            GameConfig.meetingMultipleRate = GameConfig.meetingMultipleRate.concat(jsonAsset.json.BET_RATIO_LIST);
        });

        //英雄配置
        this.loadJsonFileWithName("json/hero", function (jsonAsset) {
            for (var index = 0; index < jsonAsset.json.length; index++) {
                GameConfig.heroInfos.push(jsonAsset.json[index])
            }
        });

        //宝箱配置
        this.loadJsonFileWithName("json/box", function (jsonAsset) {
            for (var index = 0; index < jsonAsset.json.length; index++) {
                GameConfig.boxInfos.push(jsonAsset.json[index])
            }
        });

        //Buff配置
        this.loadJsonFileWithName("json/buff", function (jsonAsset) {
            for (var index = 0; index < jsonAsset.json.length; index++) {
                GameConfig.buffInfos.push(jsonAsset.json[index])
            }
        });

        //怪物配置
        this.loadJsonFileWithName("json/monster", function (jsonAsset) {
            for (var index = 0; index < jsonAsset.json.length; index++) {
                GameConfig.monsterInfos.push(jsonAsset.json[index])
            }
        });

        //怪物配置
        this.loadJsonFileWithName("json/role_attribute", function (jsonAsset) {
            for (var index = 0; index < jsonAsset.json.length; index++) {
                GameConfig.roleAttributeInfos.push(jsonAsset.json[index])
            }
        });

        //技能配置
        this.loadJsonFileWithName("json/skill", function (jsonAsset) {
            for (var index = 0; index < jsonAsset.json.length; index++) {
                GameConfig.skillInfos.push(jsonAsset.json[index])
            }
        });

        //技能特效配置
        this.loadJsonFileWithName("json/skill_effect", function (jsonAsset) {
            for (var index = 0; index < jsonAsset.json.length; index++) {
                GameConfig.skillEffectInfos.push(jsonAsset.json[index])
            }
        });

        //关卡配置
        this.loadJsonFileWithName("json/level", function (jsonAsset) {
            for (var index = 0; index < jsonAsset.json.length; index++) {
                GameConfig.levelInfos.push(jsonAsset.json[index])
            }
        });

        //资源配置
        this.loadJsonFileWithName("json/assets", function (jsonAsset) {
            for (var index = 0; index < jsonAsset.json.length; index++) {
                GameConfig.assetPaths.push(jsonAsset.json[index])
            }

            //重新处理资源
            AssetsPathManager.instance.dealWithAssetPaths();

            //预加载资源
            ResourceManager.instance.previewLoadPrefab();
        });

        //图片配置
        this.loadJsonFileWithName("json/sprites", function (jsonAsset) {
            for (var index = 0; index < jsonAsset.json.datas.length; index++) {
                GameConfig.spriteInfos.push(jsonAsset.json.datas[index])
            }
        })
    },

    //根据名字加载json文件
    loadJsonFileWithName: function (fileName, callBack) {
        var self = this;
        this.needLoadJsonFileCount = this.needLoadJsonFileCount + 1;
        cc.loader.loadRes(fileName, cc.JsonAsset, function (err, jsonAsset) {
            if (err) {
                console.error("loadJsonFileWithName error = " + err);
            } else {
                self.loadedJsonFileCount = self.loadedJsonFileCount + 1;
                if (callBack) {
                    callBack(jsonAsset);
                    EventManager.Dispatch("LoadJsonFile", self.loadedJsonFileCount)
                }
            }
        });
    },

    onDestroy: function () {
        this.removeEvent();
    },
})