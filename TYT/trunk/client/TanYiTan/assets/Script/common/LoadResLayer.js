// 动画资源表
var AnimRes = {}
var ImageRes = {};

var loadResLayer = cc.Class({
    extends: cc.Component,

    properties: {
        systemTip: cc.Prefab,
        unlockTip: cc.Prefab,
    },

    onLoad: function () {
        this.laodImg('ball/geometry');
        AnimRes.systemTipPfb = this.systemTip;
        AnimRes.unlockTipPfb = this.unlockTip;
    },


    laodImg: function loadImg(imagePath, callback) {
        cc.loader.loadRes(imagePath, cc.SpriteAtlas, function (err, atlas) {
            ImageRes.geometryAtlas = atlas._spriteFrames;
        });
    },

    addSystemTip: function (curText, _bIsClick) {
        let systemTip = cc.instantiate(AnimRes.systemTipPfb);
        systemTip.getComponent("SystemTip").text = curText;
        if (_bIsClick) {
            systemTip.getComponent("SystemTip")._bIsClick = _bIsClick;
        }
        cc.director.getScene().getChildByName('Canvas').addChild(systemTip);
    },

    addUnlockTip: function (tipStr, currentStr) {
        let unlockTipNode = cc.instantiate(AnimRes.unlockTipPfb);
        unlockTipNode.getComponent("Unlock").init(tipStr, currentStr);
        cc.director.getScene().getChildByName('Canvas').addChild(unlockTipNode);
    }

});

export { ImageRes, loadResLayer }