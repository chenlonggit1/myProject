
cc.Class({
    extends: cc.Component,

    properties: {
        tipLabel: cc.Label,
        text: "",
    },

    onLoad: function () {
        this.tipLabel.string = this.text;
    },

    tipClick: function (event) {
    }
});
