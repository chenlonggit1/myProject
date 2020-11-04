var config = {};

//保存数据
config.saveSetting = function (obj) {
    // cc.log("保存数据=" + obj);
    cc.sys.localStorage.setItem('settingData', JSON.stringify(obj));
};

//读取数据
config.getSetting = function () {
    let tempData = cc.sys.localStorage.getItem('settingData');
    // cc.log("读取数据=" + tempData);
    let settingData = tempData == "" ? "" : JSON.parse(tempData);
    return settingData;
};

//保存签到数据
config.saveSignIn = function (obj) {
    cc.sys.localStorage.setItem('signInData', JSON.stringify(obj));
};

//读取签到数据
config.getSignIn = function () {
    let tempData = cc.sys.localStorage.getItem('signInData');
    let settingData = tempData == "" ? "" : JSON.parse(tempData);
    return settingData;
};

export { config }