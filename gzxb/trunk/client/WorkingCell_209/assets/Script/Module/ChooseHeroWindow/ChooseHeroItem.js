var EnumDefine = require("EnumDefine")
var GameConfig = require("GameConfig")
var DataManager = require("DataManager")
var EventManager = require("EventManager")
var WindowManager = require("WindowManager")

//长按显示拖动节点所需时间时间
const LONG_CLICK_TIME = 0.05;

cc.Class({
    extends: cc.Component,

    properties: {
        itemType: EnumDefine.DragNodeType.TOP,
    },

    init: function (dragNode) {
        this.dragNode = dragNode;
        this.isCanSendMessage = false;

        this.dragEvent = function () {
            if (this.itemType == EnumDefine.DragNodeType.TOP) {
                if (DataManager.instance.checkCellIsUnlock(this.heroID) == true &&
                    this.isLock == false) {
                    EventManager.Dispatch("ShowDragNode", {
                        "index": this.index,
                        "hero_id": this.heroID,
                        "type": this.itemType,
                    })
                }
            } else {
                if (DataManager.instance.checkCellIsCombat(this.heroID) == true) {
                    EventManager.Dispatch("ShowDragNode", {
                        "index": this.index,
                        "hero_id": this.heroID,
                        "type": this.itemType,
                    })
                }
            }
        }

        this.initEvent();
    },

    //初始化事件
    initEvent: function () {
        //鼠标按下事件
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);

        //鼠标移动事件
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);

        //鼠标抬起事件
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        //鼠标抬起事件
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCancel, this);
    },

    //移除事件
    removeEvent: function () {
        //鼠标按下事件
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);

        //鼠标移动事件
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);

        //鼠标抬起事件
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        //鼠标抬起事件
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchCancel, this);
    },

    //手指触摸事件
    onTouchStart: function () {
        this.isCanSendMessage = true;
        this.scheduleOnce(this.dragEvent, LONG_CLICK_TIME);
        EventManager.Dispatch("HeroTouchStart", true);
    },

    //手指移动事件
    onTouchMove: function (event) {
        let delta = event.touch.getDelta();
        //移动节点
        this.dragNode.node.x = this.dragNode.node.x + delta.x;
        this.dragNode.node.y = this.dragNode.node.y + delta.y;
    },

    //手指取消触摸事件
    onTouchCancel: function () {
        EventManager.Dispatch("HeroTouchStart", false);
        this.unschedule(this.dragEvent);

        let data = this.checkIsEnterSafeArea();
        if (this.itemType == EnumDefine.DragNodeType.TOP) {
            if (data.isEnterSafeArea && data.index >= 0) {
                if (DataManager.instance.checkCellIsUnlock(this.heroID) == true &&
                    this.isCanSendMessage &&
                    this.isLock == false) {
                    this.isCanSendMessage = false;
                    //先判断拖动的英雄是否已经上阵
                    if (DataManager.instance.checkCellIsCombat(this.heroID) == false) {
                        //判断要拖上去的目标点是否为攻击细胞
                        if (DataManager.instance.checkIsFarAttackCell(this.heroID) == false) {
                            let temp = DataManager.instance.getCombatCellWithIndex(data.index);
                            if (temp == null) {
                                //该位置没有细胞，直接上阵
                                EventManager.Dispatch("HeroEnterCombat", {
                                    "index": data.index,
                                    "hero_id": this.heroID,
                                });
                            } else {
                                //判断替换的细胞是否为远程细胞
                                if (DataManager.instance.checkIsFarAttackCell(temp.RoleID)) {
                                    if (DataManager.instance.getCombatCellCount() >= 2) {
                                        EventManager.Dispatch("HeroEnterCombat", {
                                            "index": data.index,
                                            "hero_id": this.heroID,
                                        });
                                    } else {
                                        WindowManager.instance.showTips({
                                            desc: "场上必须有一个攻击细胞！",
                                        });
                                    }
                                } else {
                                    EventManager.Dispatch("HeroEnterCombat", {
                                        "index": data.index,
                                        "hero_id": this.heroID,
                                    });
                                }
                            }
                        } else {
                            //如果是攻击细胞，需要先判断上阵的攻击细胞数量，修改操作后的攻击细胞数量不能小于1
                            if (DataManager.instance.getCombatCellCount() >= 1) {
                                EventManager.Dispatch("HeroEnterCombat", {
                                    "index": data.index,
                                    "hero_id": this.heroID,
                                });
                            } else {
                                WindowManager.instance.showTips({
                                    desc: "场上必须有一个攻击细胞！",
                                });
                            }
                        }
                    } else {
                        let sourcePosition = DataManager.instance.getCombatCellPositionWithRoleID(this.heroID);
                        if (data.index != sourcePosition) {
                            if (sourcePosition >= 0) {
                                EventManager.Dispatch("HeroChangePosition", {
                                    "sourcePosition": sourcePosition,
                                    "targetPosition": data.index,
                                });
                            }
                        }
                    }
                }
            }
        } else {
            if (DataManager.instance.checkCellIsCombat(this.heroID) == true && this.isCanSendMessage == true) {
                this.isCanSendMessage = false;
                if (!data.isEnterSafeArea) {
                    EventManager.Dispatch("HeroExitCombat", {
                        "index": this.index,
                        "hero_id": this.heroID,
                    });
                } else {
                    let sourcePosition = DataManager.instance.getCombatCellPositionWithRoleID(this.heroID);
                    if (sourcePosition >= 0 && sourcePosition != data.index) {
                        console.log("Bottom Change Hero Position")
                        EventManager.Dispatch("HeroChangePosition", {
                            "sourcePosition": sourcePosition,
                            "targetPosition": data.index,
                        });
                    }
                }
            }
        }

        this.dragNode.node.active = false;
    },

    //设置数据
    setData: function (index, hero_id, isLock) {
        this.index = index;
        this.heroID = hero_id;
        this.isLock = isLock;
    },

    //获取英雄ID
    getHeroID: function () {
        return this.heroID;
    },

    //检测是否进入了安全区域，处于安全区域，可以替换
    checkIsEnterSafeArea: function () {
        let targetIndex = -1;
        let isEnterSafeArea = false;
        for (let index = 0; index < GameConfig.chooseHeroDragSafeArea.length; index++) {
            let data = GameConfig.chooseHeroDragSafeArea[index];
            if (this.dragNode.node.x >= data.Left && this.dragNode.node.x <= data.Right) {
                if (this.dragNode.node.y >= data.Bottom && this.dragNode.node.y <= data.Top) {
                    targetIndex = index;
                    isEnterSafeArea = true;
                }
            }
        }

        return {
            "isEnterSafeArea": isEnterSafeArea,
            "index": targetIndex,
        };
    },

    onDestroy: function () {
        this.removeEvent();
    }
});