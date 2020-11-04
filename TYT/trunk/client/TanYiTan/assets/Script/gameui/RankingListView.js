import {loadResLayer} from 'LoadResLayer';
import {GameTools} from 'GameTools';
cc.Class({
    extends: cc.Component,
    properties: {
        backButton: cc.Node,
        rankingScrollView: cc.Sprite,//显示排行榜
        shareTicket: null,
        bIsFriendRank: true,
    },
    onLoad() {
    },
    start() {
        this.setClickState();
    },

    setClickState: function () {
        if (this.bIsFriendRank) {
            this.rankingScrollView.node.active = true;
            if (this.shareTicket != null) {
                let shareNode = new cc.Node();
                shareNode.addComponent(cc.Label).string = "群排行";
                shareNode.setPosition(-260, 503);
                this.node.addChild(shareNode);
            }
            if (CC_WECHATGAME) {
                this.tex = new cc.Texture2D();
                window.sharedCanvas.width = 720;
                window.sharedCanvas.height = 1280;
                // 发消息给子域
                // cc.log(this.shareTicket)
                if (this.shareTicket != null) {
                    window.wx.postMessage({
                        messageType: 5,
                        MAIN_MENU_NUM: "Classic",
                        shareTicket: this.shareTicket
                    });
                } else {
                    window.wx.postMessage({
                        messageType: 1,
                        MAIN_MENU_NUM: "Classic",
                    });
                }
            } else {
                loadResLayer.prototype.addSystemTip("暂无排行榜数据");
            }
        } else {
            this.rankingScrollView.node.active = false;
            loadResLayer.prototype.addSystemTip("暂无世界排行");
        }
    },

    onBtnClick: function (event) {
        let btnName = event.target;
        if (btnName.name === "backButton") {
            this.backButtonFunc();
        } else if (btnName.name === "friendRank") {
            this.bIsFriendRank = true;
            this.setClickState();
        } else if (btnName.name === "worldRank") {
            this.bIsFriendRank = false;
            this.setClickState();
        }
    },

    backButtonFunc: function (event) {
        GameTools.removeRankData();
        if (CC_WECHATGAME) {
            window.wx.postMessage({// 发消息给子域
                messageType: 4,
                MAIN_MENU_NUM: "Classic",
            });
        }
        this.node.destroy();
    },

    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (CC_WECHATGAME) {
            if (window.sharedCanvas != undefined) {
                this.tex.initWithElement(window.sharedCanvas);
                this.tex.handleLoadedTexture();
                this.rankingScrollView.spriteFrame = new cc.SpriteFrame(this.tex);
            }
        }
    },
    update() {
        if (this.bIsFriendRank) {
            this._updateSubDomainCanvas();
        }
    },
});
