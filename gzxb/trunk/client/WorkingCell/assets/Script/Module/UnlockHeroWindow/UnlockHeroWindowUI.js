var GameConfig = require("GameConfig")
var WindowManager = require("WindowManager")
var ResourceManager = require("ResourceManager")

cc.Class({
    extends: cc.Component,

    properties: {
        mask: {
            default: null,
            type: cc.Node,
        },
        item: {
            default: null,
            type: cc.Node,
        },
        layout: {
            default: null,
            type: cc.Node,
        },
        targetNode: {
            default: null,
            type: cc.Node,
        },
        other: {
            default: null,
            type: cc.Node,
        }
    },

    initData: function (name, unlockHeros) {
        this.tweenIcon = false;
        this.name = name;
        this.items = [];
        for (let index = 0; index < unlockHeros.length; index++) {
            let heroInfo = GameConfig.getHeroInfoWithID(unlockHeros[index]);
            if (heroInfo != null) {
                let node = cc.instantiate(this.item);
                this.layout.addChild(node);
                let temp = node.getChildByName("Icon").getComponent(cc.Sprite);
                ResourceManager.instance.setSpriteWithName(heroInfo.Icon, function (sprite) {
                    temp.spriteFrame = sprite;
                    let spriteFrameSize = sprite.getOriginalSize();
                    temp.node.width = spriteFrameSize.width * 0.8;
                    temp.node.height = spriteFrameSize.height * 0.8;
                });
                node.active = true;

                this.items.push(node);
            }
        }

        this.scheduleOnce(function () {
            this.closeWindow();
        }.bind(this), 30);
    },

    closeWindow: function () {
        this.tweenIcon = true;
        this.mask.active = false;
        this.other.active = false;

        let currentCount = 0;
        let totalCount = this.items.length;
        for (let index = 0; index < this.items.length; index++) {
            this.items[index].runAction(cc.sequence(cc.spawn(cc.moveTo(0.4, cc.v2(this.targetNode.position.x, this.targetNode.position.y)), cc.scaleTo(0.4, 0)), cc.callFunc(function () {
                currentCount++;
                console.log("currentCount = " + currentCount + " totalCount = " + totalCount)
                if (currentCount == totalCount) {
                    WindowManager.instance.closeWindow(this.name);
                    this.node.destroy();
                }
                console.log("" + this.items[index].position)
            }.bind(this))));
        }
    },

    onDestroy: function () {
        this.unscheduleAllCallbacks();
    }
});