import { loadResLayer } from 'LoadResLayer';
cc.Class({
    extends: cc.Component,

    properties: {
        levelNum: cc.Label,
        levelIndex: 0,
    },

    onLoad() {
    },


    onLevelBtnClick(event) {
        
    },

    setCurLevelNum(curLevelNum, curLevelIndex) {
        this.levelNum.string = curLevelNum;
        this.levelIndex = curLevelIndex;
    },

});



