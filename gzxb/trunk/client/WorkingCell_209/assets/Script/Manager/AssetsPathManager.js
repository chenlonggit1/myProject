var GameConfig = require("GameConfig")

var AssetsPathManager = cc.Class({
    extends: cc.Component,

    properties: {},

    statics: {
        instance: null,
    },

    onLoad: function () {
        AssetsPathManager.instance = this;

        this.assetPaths = {};
    },

    //处理资源与资源路径的隐射
    dealWithAssetPaths: function () {
        for (let index = 0; index < GameConfig.assetPaths.length; index++) {
            this.assetPaths[GameConfig.assetPaths[index].Name] = GameConfig.assetPaths[index].Path;
        }
    },

    //根据资源名称获取对应的资源路径
    getAssetPathWithName: function (assetName) {
        return this.assetPaths[assetName] || "";
    },
});