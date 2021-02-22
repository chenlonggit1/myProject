var GameConfig = require("GameConfig")
var AssetsPathManager = require("AssetsPathManager")

var ResourceManager = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
    },

    properties: {},

    onLoad: function () {
        this.effects = {};
        this.sprites = {};
        this.prefabs = {};
        ResourceManager.instance = this;

        this.previewLoadAtlas();
    },

    //预加载图集
    previewLoadAtlas: function () {
        this.loadAtlas("atlas/atlas_Germ");
        this.loadAtlas("atlas/atlas_Cell");
        this.loadAtlas("atlas/atlas_Skill");
        this.loadAtlas("atlas/atlas_Common_Load");
        this.loadAtlas("atlas/atlas_Scene_1001");
        this.loadAtlas("atlas/atlas_Scene_1002");
        this.loadAtlas("atlas/atlas_Scene_1003");
        this.loadAtlas("atlas/atlas_Scene_1004");
        this.loadAtlas("atlas/atlas_Rule");
    },

    //预加载预设
    //现在改为配置表配置资源，配置表在GameConfig的assetPaths中。
    previewLoadPrefab: function () {
        //加载低级常用细菌
        this.loadPrefab("feiyanlianqiujun");
        this.loadPrefab("jihuizhibingdu");
        this.loadPrefab("dachangyanhujun");
        this.loadPrefab("aixibao");
        this.loadPrefab("haishouweixianchong");
        this.loadPrefab("huanongxinglianqiujun");
        this.loadPrefab("jinhuangseputaoqiujun");
        this.loadPrefab("layangyabaoganjun");
        this.loadPrefab("liuxingxingganmao");
        this.loadPrefab("lvnongganjun");
        this.loadPrefab("saixianyanbingdu");
        this.loadPrefab("shanshuhuafenguominyuan");
        this.loadPrefab("xiaochangyanhujun");
        this.loadPrefab("shanshuhuafenguominyuan2");

        this.loadPrefab("shashout");
        this.loadPrefab("hongxibao");
        this.loadPrefab("baixibao");
        this.loadPrefab("bxibao");
        this.loadPrefab("xuexiaoban");

        this.loadPrefab("TipsWindow")

        this.loadEffectPfb();
    },

    //遍历frab/effect文件夹内的特效
    loadEffectPfb: function () {
        let self = this;
        cc.loader.loadResDir('frab/effect', function (err, assets) {
            if (err) {
                cc.error(err);
                return;
            }

            for (let i = 0; i < assets.length; ++i) {
                self.prefabs[assets[i].name] = assets[i];
            }
        });
    },

    //加载预设
    loadPrefab: function (assetName, callback = null) {
        if (this.prefabs[assetName]) {
            if (callback) {
                callback(this.prefabs[assetName]);
            }
            return;
        }

        let assetPath = AssetsPathManager.instance.getAssetPathWithName(assetName);

        if (assetPath != null) {
            var self = this;
            cc.loader.loadRes(assetPath, function (err, prefab) {
                if (err) {
                    console.error("assetName = " + assetName + " error = " + err.message || "assetName = " + assetName + " error = " + err);
                    return;
                }

                if (!prefab) {
                    return;
                }

                self.prefabs[assetName] = prefab;

                if (callback) {
                    callback(self.prefabs[assetName]);
                }
            })
        }
    },

    //加载SpriteFrame
    loadSprite: function (spriteName, callback) {
        var self = this;
        let assetPath = AssetsPathManager.instance.getAssetPathWithName(spriteName);
        if (assetPath != "") {
            cc.loader.loadRes(assetPath, cc.SpriteFrame, function (err, spriteFrame) {
                if (err) {
                    console.error("spriteName = " + spriteName + " error = " + err.message || "spriteName = " + spriteName + " error = " + err);
                    return;
                }

                self.sprites[spriteName] = spriteFrame;
                if (callback) {
                    callback(spriteFrame);
                }
            })
        }
    },

    //加载Atlas
    loadAtlas: function (path, callback) {
        var self = this;
        cc.loader.loadResDir(path, cc.SpriteAtlas, function (err, atlas) {
            if (err) {
                console.error("path = " + path + " error = " + err.message || "path = " + path + " error = " + err);
                return;
            }

            for (let index = 0; index < atlas.length; index++) {
                self.sprites[atlas[index].name] = atlas[index];
            }

            if (callback) {
                callback();
            }
        });
    },

    //克隆预设
    createPrefab: function (assetName, callback) {
        if (this.prefabs[assetName]) {
            if (callback != null) {
                callback(cc.instantiate(this.prefabs[assetName]));
            }
        } else {
            this.loadPrefab(assetName, function (prefab) {
                if (callback != null) {
                    callback(cc.instantiate(prefab));
                }
            })
        }
    },

    //克隆预设
    createPrefabAndCallBackWithData: function (assetName, callback, data) {
        if (this.prefabs[assetName]) {
            if (callback != null) {
                callback(cc.instantiate(this.prefabs[assetName]), data);
            }
        } else {
            this.loadPrefab(assetName, function (prefab) {
                if (callback != null) {
                    callback(cc.instantiate(prefab), data);
                }
            })
        }
    },

    //根据资源名字获取对应的图片
    setSpriteWithName: function (spriteName, callback) {
        if (this.sprites[spriteName]) {
            if (callback) {
                callback(this.sprites[spriteName]);
            }
        } else {
            let spriteInfo = GameConfig.getSpriteInfo(spriteName);
            if (spriteInfo != null) {
                let self = this;
                if (spriteInfo.Type == 1) {
                    this.loadAtlas("atlas/" + spriteInfo.AtlasName, function () {
                        if (self.sprites[spriteName]) {
                            if (callback) {
                                callback(self.sprites[spriteName]);
                            }
                        }
                    })
                } else {
                    this.loadSprite(spriteInfo.SpriteName, callback);
                }
            }
        }
    },
});