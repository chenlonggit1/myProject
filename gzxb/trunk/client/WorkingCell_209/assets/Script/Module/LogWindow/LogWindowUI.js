var EventManager = require("EventManager")

cc.Class({
    extends: cc.Component,

    properties: {
        bViewIsOpen: false,
        itemNode: {
            type: cc.Node,
            default: null,
        },
        itemRoot: {
            type: cc.Node,
            default: null,
        },
    },

    onEnable: function () {
        console.log("Log window enable.");

        //添加为不销毁节点
        cc.game.addPersistRootNode(this.node.parent);

        this.bViewIsOpen = true;
        this.showAllItems();
    },

    onDisable: function () {
        console.log("Log window disable.");

        this.bViewIsOpen = false;
    },

    onLoad: function () {
        console.log("Log window onLoad.");
        this.logInfos = [];
        this.showItems = [];
        this.hideItems = [];
        this.maxClickCount = 3;
        this.leftClickCount = 0;
        this.rightClickCount = 0;
        EventManager.Add("PrintLog", function (event, data) {
            if (event.logInfos.length >= 2500) {
                let newLogInfos = [];
                for (let index = 1501; index < event.logInfos.length; index++) {
                    newLogInfos.push(event.logInfos[index]);
                }

                event.logInfos = newLogInfos;
            }

            let length = event.logInfos.push(data);

            console.log("PrintLog length = " + length);

            if (event.bViewIsOpen) {
                event.updateItem(length - 1);
            }
        }, this);
    },

    start: function () {
        this.node.active = false;
        this.node.opacity = 255;
    },

    showAllItems: function () {
        if (this.logInfos != null) {
            console.log("this.logInfos.length = " + this.logInfos.length)
            for (let index = 0; index < this.logInfos.length; index++) {
                this.updateItem(index);
            }
        }
    },

    updateItem: function (index) {
        let item = null;
        if (this.hideItems.length > 0) {
            item = this.hideItems.pop();
            this.showItems.push(item)
        } else {
            let node = cc.instantiate(this.itemNode);
            node.setParent(this.itemRoot);
            node.setScale(1);
            item = {};
            item.gameObject = node;
            item.text = node.getComponent(cc.Label);
            this.showItems.push(item);
        }

        item.gameObject.setSiblingIndex(index);

        item.gameObject.active = true;

        item.text.string = this.logInfos[index].message;

        console.log("this.logInfos[" + index + "].type = " + this.logInfos[index].type)

        if (this.logInfos[index].type == "log") {
            item.gameObject.color = cc.Color.WHITE;
        } else if (this.logInfos[index].type == "warning") {
            item.gameObject.color = cc.Color.YELLOW;
        } else if (this.logInfos[index].type == "error") {
            item.gameObject.color = cc.Color.RED;
        }

        console.log("this.itemRoot.childrenCount = " + this.itemRoot.childrenCount);
    },

    onCloseBtnClick: function () {
        for (let index = this.showItems.length - 1; index >= 0; index--) {
            let item = this.showItems.pop();
            item.gameObject.active = false;
            this.hideItems.push(item);

        }
        this.node.active = false;
        console.log("this.showItems.length = " + this.showItems.length);
    },

    onLeftBtnClick: function () {
        if (this.leftClickCount == this.rightClickCount) {
            this.leftClickCount = this.leftClickCount + 1;
        } else if (this.leftClickCount > this.maxClickCount) {
            this.resetCliclCount();
        }

        console.log("onLeftBtnClick this.leftClickCount = " + this.leftClickCount + " this.rightClickCount = " + this.rightClickCount);
    },

    onRightBtnClick: function () {
        if (this.leftClickCount - this.rightClickCount == 1) {
            this.rightClickCount = this.rightClickCount + 1;

            if (this.rightClickCount == this.maxClickCount) {
                if (this.leftClickCount == this.maxClickCount) {
                    this.node.active = true;
                    this.resetCliclCount();
                    console.log("=====> 22222 <=====");
                }
            } else if (this.rightClickCount > this.maxClickCount) {
                this.resetCliclCount();
            }
        } else {
            this.resetCliclCount();
        }

        console.log("onRightBtnClick this.leftClickCount = " + this.leftClickCount + " this.rightClickCount = " + this.rightClickCount);
    },

    resetCliclCount: function () {
        this.leftClickCount = 0;
        this.rightClickCount = 0;
    }
});