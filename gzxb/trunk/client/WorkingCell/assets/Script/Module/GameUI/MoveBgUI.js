const ResourceManager = require('ResourceManager');
var EventManager = require("EventManager")
const pictureWidth = 960;
const moveCount = 3; //移动背景数量

cc.Class({
    extends: cc.Component,

    properties: {
        moveScenePfb: cc.Prefab, //移动场景
    },

    onLoad: function () {
        this.moveTime = 0; //移动时间
        this.addMoveNum = [0, 0, 0]; //移动背景数量
        this.isCanCombat = false; //是否可以战斗
        this.moveSceneNode = []; //战斗背景
        this.cloudNodeList = []; //白云
        this.sceneIndex = 1; //场景编号

        this.moveCloudNode = this.node.getChildByName("cloudNode");
        for (let i = 0; i < 2; ++i) {
            this.cloudNodeList[i] = this.moveCloudNode.getChildByName(`cloudNode${i}`).getComponent(cc.Sprite);
        }
        for (let i = 0; i < moveCount; ++i) {
            this.moveSceneNode[i] = this.node.getChildByName(`layout${i}`);
        }

        //背景对象池
        this.moveBgPool = new cc.NodePool();
        for (let i = 0; i < 8; ++i) {
            let moveNode = cc.instantiate(this.moveScenePfb);
            this.moveBgPool.put(moveNode);
        }
        this.initEvent();
    },

    init: function () {
        this.moveSceneNode[0].y = -211;
        for (let i = 0; i < moveCount; ++i) {
            if (this.sceneIndex === 3 && i === 0) {
                this.moveSceneNode[i].y = -201;
            }
            for (let j = 0; j < this.moveSceneNode[i].childrenCount; ++j) {
                this.setMoveBg(this.moveSceneNode[i].children[j], i);
            }
        }

        let self = this;
        for (let i = 0; i < 2; ++i) {
            if (this.sceneIndex === 3) {
                ResourceManager.instance.setSpriteWithName(`100304`, function (sprite) {
                    self.cloudNodeList[i].spriteFrame = sprite;
                })
            } else {
                ResourceManager.instance.setSpriteWithName(`100104`, function (sprite) {
                    self.cloudNodeList[i].spriteFrame = sprite;
                })
            }
        }

        //中间底图
        ResourceManager.instance.setSpriteWithName(`100${self.sceneIndex}01`, function (sprite) {
            self.node.parent.getChildByName("middleBg").getComponent(cc.Sprite).spriteFrame = sprite;
        })
    },

    initEvent: function () {
        //更新战斗状态
        EventManager.Add("UpdateCombatState", function (event, data) {
            if (event.isCanCombat != data)
                event.isCanCombat = data;
        }, this);

        //游戏开始
        EventManager.Add("GameBegin", function (event, data) {
            if (event.sceneIndex != data.LevelID) {
                event.sceneIndex = data.LevelID < 5 ? data.LevelID : 1;
                event.init();
            }
        }, this);
    },

    onDestroy: function () {
        EventManager.Remove("UpdateCombatState", this);
        EventManager.Remove("GameBegin", this);
    },

    //回收卡牌
    onMoveBg: function (moveBgNode) {
        this.moveBgPool.put(moveBgNode);
    },

    update: function (dt) {
        if (!this.isCanCombat) {
            this.moveTime += dt;
            if (this.moveTime >= 0.1) {
                this.moveTime = 0;
                for (let i = 0; i < moveCount; ++i) {
                    this.moveSceneNode[i].runAction(cc.moveBy(0.1, cc.v2(-5 - i * 2, 0)));
                }
                this.moveCloudNode.runAction(cc.moveBy(0.1, cc.v2(-2, 0)));
            }
            for (let i = 0; i < moveCount; ++i) {
                if (this.moveSceneNode[i].childrenCount < 3) {
                    if (this.moveSceneNode[i].x < -121 - (this.addMoveNum[i] * pictureWidth) && this.moveSceneNode[i].x > -131 - (this.addMoveNum[i] * pictureWidth)) {
                        this.addMoveNum[i]++;
                        this.addMoveBg(i);
                    }
                }
                if (this.moveSceneNode[i].childrenCount == 2) {
                    if (this.moveSceneNode[i].x < -100 - (this.addMoveNum[i] * pictureWidth) && this.moveSceneNode[i].x > -110 - (this.addMoveNum[i] * pictureWidth)) {
                        this.removeMoveBg(i);
                    }
                }
            }

            if (this.moveCloudNode.x < -850) {
                this.moveCloudNode.setPosition(500, 0);
            }
        }
    },

    //设置背景图片
    setMoveBg: function (moveNode, moveIndex) {
        if (moveIndex === 1) {
            ResourceManager.instance.setSpriteWithName(`100${this.sceneIndex}03`, function (sprite) {
                moveNode.getComponent(cc.Sprite).spriteFrame = sprite;
            })
        } else {
            ResourceManager.instance.setSpriteWithName(`100${this.sceneIndex}0${moveIndex}`, function (sprite) {
                moveNode.getComponent(cc.Sprite).spriteFrame = sprite;
            })
        }
    },

    //添加背景
    addMoveBg: function (isAddMoveBg) {
        for (let i = 0; i < moveCount; ++i) {
            if (i === isAddMoveBg) {
                let sceneBg = this.moveBgPool.size() > 0 ? this.moveBgPool.get() : cc.instantiate(this.moveScenePfb);
                this.moveSceneNode[i].addChild(sceneBg);
                sceneBg.x = this.addMoveNum[i] * pictureWidth;
                this.setMoveBg(sceneBg, i);
                break;
            }
        }
    },
    //移除背景
    removeMoveBg: function (isRemove) {
        for (let i = 0; i < moveCount; ++i) {
            if (i === isRemove) {
                this.onMoveBg(this.moveSceneNode[i].children[0]);
            }
        }
    },

});