cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {
    },

    onBtnClick(event) {
        let btnName = event.target;
        if (btnName.name === "backButton") {
            this.node.destroy();
        }
    }
});
