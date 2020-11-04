cc.Class({
    extends: cc.Component,
    // name: "GameOverRank",
    properties: {
        // backSprite: cc.Node,
        // selfBg: cc.SpriteFrame,
        rankLabel: cc.Label,
        avatarImgSprite: cc.Sprite,
        nickLabel: cc.Label,
        topScoreLabel: cc.Label,
    },
    start() {

    },

    init: function (rank, data, isPlayer) {
        let avatarUrl = data.avatarUrl;
        let nick = data.nickname.length <= 10 ? data.nickname : data.nickname.substr(0, 10) + "...";
        // let nick = data.nickname;
        let grade = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;



        // if (isPlayer) {
        //     this.rankLabel.node.color = new cc.Color(255, 0, 0, 255);
        //     this.backSprite.getComponent(cc.Sprite).spriteFrame = this.selfBg;
        // }

        this.rankLabel.string = (rank + 1).toString();
        this.createImage(avatarUrl);
        this.nickLabel.string = nick;
        this.topScoreLabel.string = grade.toString();
    },

    initF: function (data) {
        let avatarUrl = data.avatarUrl;
        let nick = data.nickname.length <= 5 ? data.nickname : data.nickname.substr(0, 5) + "...";
        // let nick = data.nickname;
        let grade = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;

        // if (rank % 2 == 0) {
        //     this.backSprite.color = new cc.Color(55, 55, 55, 255);
        // }

        // if (isPlayer) {
        //     this.rankLabel.node.color = new cc.Color(0, 255, 0, 255);
        // }

        // this.rankLabel.string = (rank + 1).toString();

        this.createImage(avatarUrl);
        this.nickLabel.string = nick;
        this.topScoreLabel.string = this.change(grade);
    },

    change(score) {
        return score > 100000 ? ((score / 10000).toFixed(0) + "万") : score;
    },

    createImage(avatarUrl) {
        if (CC_WECHATGAME) {
            try {
                let image = wx.createImage();
                image.onload = () => {
                    try {
                        let texture = new cc.Texture2D();
                        texture.initWithElement(image);
                        texture.handleLoadedTexture();
                        this.avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
                    } catch (e) {
                        // cc.log(e);
                        this.avatarImgSprite.node.active = false;
                    }
                };
                image.src = avatarUrl;
            } catch (e) {
                // cc.log(e);
                this.avatarImgSprite.node.active = false;
            }
        } else {
            cc.loader.load({
                url: avatarUrl, type: 'jpg'
            }, (err, texture) => {
                this.avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    }

});
