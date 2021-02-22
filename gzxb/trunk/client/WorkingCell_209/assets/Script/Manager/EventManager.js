let EventNode = cc.Class({
    ctor: function () {
        this.key = null;
        this.data = [];
    },

    set: function (key, callBack, target) {
        this.key = key;
        let isExist = false;
        let tempIndex = -1;
        for (let index = 0; index < this.data.length; index++) {
            if (this.data[index].target == target) {
                isExist = true;
                tempIndex = index;
                break;
            }
        }
        if (isExist) {
            this.data[tempIndex].target = target;
        } else {
            this.data.push({
                "target": target,
                "callBack": callBack,
            })
        }
    },
});

let EventManager = cc.Class({
    name: 'EventManager',

    ctor: function () {
        this.eventList = new Array();
    },

    add: function (key, callBack, target) {
        let eventNode = this.get(key);
        if (eventNode == null) {
            eventNode = new EventNode();
            eventNode.set(key, callBack, target);

            this.eventList.push(eventNode);
        } else {
            eventNode.set(key, callBack, target);
        }
    },

    remove: function (key, target) {
        let item = null;
        for (let i = 0; i < this.eventList.length; i++) {
            if (this.eventList[i].key == key) {
                for (let index = 0; index < this.eventList[i].data.length; index++) {
                    if (this.eventList[i].data[index].target == target) {
                        item = this.eventList[i].data.splice(index, 1);
                    }
                }
            }
        }

        return item;
    },

    get: function (key) {
        for (let index = 0; index < this.eventList.length; index++) {
            if (this.eventList[index].key == key)
                return this.eventList[index];
        }

        return null;
    },

    dispatch: function (key, p1, p2, p3, p4) {
        let eventNode = this.get(key);
        if (eventNode == null) {
            return;
        }

        for (let index = 0; index < eventNode.data.length; index++) {
            eventNode.data[index].callBack(eventNode.data[index].target, p1, p2, p3, p4)
        }
    },

    release: function () {
        this.eventList.length = 0;
        this.eventList = null;
    },
});

const E_type = {

}

let instance = new EventManager();

function Add(key, callback, target) {
    instance.add(key, callback, target);
}

function Remove(key, target) {
    instance.remove(key, target);
}

function Dispatch(key, p1, p2, p3, p4) {
    instance.dispatch(key, p1, p2, p3, p4);
}

function Release() {
    instance.release();
    instance = null;
}

module.exports = {
    Add: Add,
    Remove: Remove,
    Dispatch: Dispatch,
    Release: Release,
    Type: E_type,
}