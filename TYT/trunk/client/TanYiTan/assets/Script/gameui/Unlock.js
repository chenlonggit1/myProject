
cc.Class({
    extends: cc.Component,

    properties: {
        tipLb: cc.Label,
        currentLb: cc.Label,
    },

    onLoad: function () {
    },

    init: function (tipStr, currentStr) {
        this.tipLb.string = tipStr;
        this.currentLb.string = currentStr;
    },

    tipClick: function (event) {
        let btnName = event.target.name;
        if (btnName === "closeBtn" || btnName === "confirmBtn") {
            this.node.destroy();
        }
    }
});
