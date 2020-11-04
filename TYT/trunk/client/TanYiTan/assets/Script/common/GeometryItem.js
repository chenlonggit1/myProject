cc.Class({
    extends: cc.Component,

    properties: {
        geometryLb: cc.Label,
    },

    onLoad() {
        this.clickNum = 1;
    },

    setGeometryNum(tempClickNum) {
        this.clickNum = tempClickNum;
        this.geometryLb.string = this.clickNum;
    }

});

