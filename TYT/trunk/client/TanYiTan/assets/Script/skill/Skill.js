import {loadResLayer} from 'LoadResLayer';
cc.Class({
    extends: cc.Component,

    properties: {
        onBtnCallBack: null,
        skillNum: [],
    },

    onLoad() {
    },

    init(gameCtl) {
        this.gameCtl = gameCtl;
        this.skillNum = this.gameCtl.userInfo.skillNum;
    },

    setSkillNum(skillIndex, curSkillNum) {
        this.skillNum[skillIndex] += curSkillNum;
    },

    onBtnClick(event) {
    }

});

