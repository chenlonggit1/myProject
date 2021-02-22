
cc.Class({
    extends: cc.Component,

    properties: {

    },

    initRuleItem: function (ruleJs, ruleItemIndex) {
        this.ruleJs = ruleJs;
        this.ruleItemIndex = ruleItemIndex;
    },

    //规则点击
    ruleBtnClick: function (event) {
        this.ruleJs.ruleOnClick(this.ruleItemIndex);
    },

});