
cc.Class({
    extends: cc.Component,

    properties: {
        tipLabel: cc.Label,
        text: "",
        _bIsClick: false,
    },

    onLoad: function () {
        this.tipLabel.string = this.text;
    },

    tipClick: function (event) {
        let btnName = event.target.name;
        if (btnName === "closeBtn" || btnName === "confirmBtn") {
            if(this._bIsClick){
                cc.director.loadScene("Login");
            }
            this.node.destroy();
        }
    }
});
