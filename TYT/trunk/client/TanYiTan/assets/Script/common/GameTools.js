import { config } from 'Config';
var GameTools = {
    //判断今天是否可以签到
    checkInTodaySignIn: function () {
        //#region 非合法域名
        // console.log(cc.sys.platform);
        // if (cc.sys.isMobile || cc.sys.platform === 104) {
        //     let xhr = new XMLHttpRequest();
        //     xhr.onreadystatechange = function () {
        //         if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
        //             let response = xhr.responseText;
        //             console.log(response);

        //             // let weekArray = new Array("日", "一", "二", "三", "四", "五", "六");
        //             let weekArray = new Array(7, 1, 2, 3, 4, 5, 6);
        //             console.log(weekArray[new Date(response).getDay()]);
        //         }
        //     };
        //     xhr.open("GET", "http://cgi.im.qq.com/cgi-bin/cgi_svrtime", true);
        //     xhr.send();
        //#endregion

        this.isTest = false;            //是否打开测试
        this.isClearData = false;       //是否清除数据
        this.testTime = "2018-12-16";   //测试今天日期
        this.isSignIn = false;
        //测试存储数据
        this.todayTime = this.isTest ? ["2018-12-10", "2018-12-11", "2018-12-12", "2018-12-13", "2018-12-14", "2018-12-15"] : [];
        // this.todayTime = this.isTest ? ["2018-12-15"] : [];

        let signInData = (this.isTest || this.isClearData) ? "" : config.getSignIn();
        if (signInData != "" && signInData != null && signInData != undefined) {
            // console.log(`签到信息=${signInData.timeData}`);
            this.todayTime = signInData.timeData;
        }

        let dataStr = this.getTodayTime();
        if (this.todayTime.length === 0) {
            this.isSignIn = true;
        }
        else if (this.judgeTime(dataStr, this.todayTime[this.todayTime.length - 1])) {
            this.isSignIn = true;
            let tempVal = this.getDays(this.todayTime[this.todayTime.length - 1], dataStr);
            if (tempVal > 1) {
                this.todayTime.length = 0;
            }
        }
        if (this.todayTime.length === 7) {
            this.todayTime = [];
        }
        return this.isSignIn;
    },

    getIsTodaySignIn: function () {
        return this.isSignIn;
    },

    getTime: function () {
        return this.todayTime;
    },

    //获取今天日期
    getTodayTime: function () {
        let data = new Date();
        let newyear = data.getFullYear();
        let newmonth = data.getMonth() + 1;
        let newday = data.getDate();

        return this.isTest ? this.testTime : `${newyear}-${newmonth}-${newday}`;
    },

    //判断日期大小
    judgeTime: function (date1, date2) {
        let oDate1 = new Date(date1);
        let oDate2 = new Date(date2);
        return oDate1.getTime() > oDate2.getTime();
    },

    //获取日期间隔
    getDays: function (strDateStart, strDateEnd) {
        let strSeparator = "-"; //日期分隔符
        let oDate1;
        let oDate2;
        let iDays;
        oDate1 = strDateStart.split(strSeparator);
        oDate2 = strDateEnd.split(strSeparator);
        let strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
        let strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
        iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24)//把相差的毫秒数转换为天数 
        return iDays;
    },

    //获取排行榜
    getRankData(tempNode) {
        cc.loader.loadRes("prefab/RankingListView", (err, prefab) => {
            if (!err) {
                var node = cc.instantiate(prefab);
                tempNode.addChild(node);
            }
        });
    },

    //移除排行榜数据
    removeRankData() {
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 0,
            });
        } else {
            // cc.log("移除排行榜数据。");
        }
    },

    //提交得分
    submitScore(score) {
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 3,
                MAIN_MENU_NUM: "Classic",
                score: score,
            });
        } else {
            // cc.log("提交得分:" + "Classic" + " : " + score)
        }
    },

    //更新分数
    updateScore(baseScore, isStart) {
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 6,
                message: "刷新分数。",
                MAIN_MENU_NUM: "Classic",
                score: baseScore,
                isStart: isStart,
            });
        }
    },
};

export { GameTools }