var net = require("net")
var md5 = require('MD5')
var util = require('util')
var HttpUtil = require("HttpUtil")
var GameConfig = require("GameConfig")

//获取配置文件
net.getGameConfig = function (callback) {
    let url = "http://qpzdxb.vk51.com/config/config.json";
    HttpUtil.httpGet(url, function (data) {
        let temp = JSON.parse(data)
        if (callback != null) {
            callback(temp);
        }
    });
}

//获取GS信息
net.GetGameGSInfo = function (callback) {
    var gid = GameConfig.gameId + "";
    var ggid = GameConfig.gameId + "";
    var sid = GameConfig.gameId + "";
    var timeStamp = util.GetTimeStamp().toString();
    var sign = md5.hex_md5(ggid + gid + sid + timeStamp + GameConfig.securityKey)
    var url = cc.js.formatStr(GameConfig.getGameGSAddress, gid, ggid, sid, timeStamp, sign);
    console.log("GetGameGSInfo url = " + url)
    HttpUtil.httpGet(url, function (data) {
        let temp = JSON.parse(data)
        if (callback != null) {
            callback(temp.data);
        }
    });
}

//获取服务器IP
net.getServerIp = function (serverData, callback) {
    let url = serverData.ServerAddress + "?ops=13&playerid=" + net.PlayerId;
    let msg = net.MakeMsg("AllocServer")
    msg.GameId = GameConfig.gameId;
    msg.GroupId = 1;

    console.log("getServerIp url=" + url);
    HttpUtil.httpPostWithMessage(url, msg.toBuffer(), "AllocServerAddressResp", function (data) {
        let temp = data.Address.indexOf(":")
        net.ServerIp = data.Address.substring(0, temp);
        net.ServerPort = data.Address.substring(temp + 1, data.Address.length);

        if (callback != null) {
            callback(data);
        }
    });
}

//亲朋账号登录获取玩家ID
net.GetPlayerId = function (account, password, callback) {
    var url = cc.js.formatStr(GameConfig.getPlayerIDAddress, net.ServerIp, account, password);
    console.log("GetPlayerId url=" + url);
    HttpUtil.httpGet(url, function (data) {
        let temp = JSON.parse(data)
        net.PlayerId = temp.passportID;

        if (GameConfig.isDebugGame) {
            net.LoginGameReq("");
        }

        if (callback != null) {
            callback();
        }
    });
}

//获取微信初始化信息
net.GetWeChatConfigWithPost = function (wechat_url, callback, timeOutCallBack) {
    let url = GameConfig.getWeChatConfigWithPostAddress;
    let msg = net.MakeMsg("WechatSignReq")
    msg.url = wechat_url;

    console.log("GetWeChatConfigWithPost url=" + url + " wechat_url = " + wechat_url);
    HttpUtil.httpPost(url, msg.toBuffer(), callback, timeOutCallBack);
}

//微信登录获取玩家ID
net.GetPlayerIdInWeChatWithPost = function (game_id, partner_id, marketid, version, unionid, nickname, headimgurl, sex, callback, timeOutCallBack = null) {
    let url = GameConfig.getPlayerIDInWeChatWithPostAddress;
    let msg = net.MakeMsg("QPPartnerUserLoginReq")
    msg.GameID = game_id;
    msg.PartnerID = partner_id;
    msg.MarkerID = marketid;
    msg.Version = version;
    msg.UnionID = unionid;
    msg.NickName = nickname;
    msg.HeadimgUrl = headimgurl;
    msg.Sex = sex;
    msg.Json = true;

    console.log("GetPlayerIdInWeChatWithPost url=" + url);
    HttpUtil.httpPost(url, msg.toBuffer(), callback, timeOutCallBack);
}

//获取玩家亲朋账号绑定信息
net.GetAccountBindInfo = function (callback) {
    var url = cc.js.formatStr(GameConfig.getAccountBindInfoAddress, net.PlayerId);
    console.log("GetAccountBindInfo url=" + url);
    HttpUtil.httpGet(url, function (data) {
        let temp = JSON.parse(data)
        console.log("temp.res = " + temp.res)
        if (callback != null) {
            callback(temp);
        }
    });
}

//上报错误
net.ReportError = function (message) {
    var url = cc.js.formatStr(GameConfig.reportErrorAddress, message);
    HttpUtil.httpGet(url);
}

//登录游戏请求
net.LoginGameReq = function (token) {
    var msg = net.MakeMsg("LoginGameReq")
    msg.PlayerId = net.PlayerId;
    msg.Token = token;
    msg.Version = GameConfig.Version;
    net.sendMesssage("LoginGameReq", msg)
}

//登出游戏请求
net.LogoutGameReq = function (token) {
    var msg = net.MakeMsg("LogoutGameReq")
    net.sendMesssage("LogoutGameReq", msg)
}

//Ping游戏服务器请求
net.PingGameReq = function () {
    var msg = net.MakeMsg("PingGameReq")
    net.sendMesssage("PingGameReq", msg)
}

//加入房间请求
net.JoinRoomReq = function () {
    var msg = net.MakeMsg("JoinRoomReq")
    net.sendMesssage("JoinRoomReq", msg)
}

//离开房间请求
net.LeaveRoomReq = function () {
    var msg = net.MakeMsg("LeaveRoomReq")
    net.sendMesssage("LeaveRoomReq", msg)
}

//开始游戏请求
net.StartGameReq = function () {
    var msg = net.MakeMsg("StartGameReq")
    net.sendMesssage("StartGameReq", msg)
}

//开始游戏请求
net.RestartGameReq = function () {
    var msg = net.MakeMsg("RestartGameReq")
    net.sendMesssage("RestartGameReq", msg)
}

//设置倍率请求
net.SetRatioReq = function (msgRatio) {
    var msg = net.MakeMsg("SetRatioReq")
    msg.Ratio = msgRatio;
    net.sendMesssage("SetRatioReq", msg)
}

//翻开卡牌请求
net.OpenOneCardReq = function (msgCardIndex, times, ratio) {
    var msg = net.MakeMsg("OpenOneCardReq")
    msg.CardIndex = msgCardIndex;
    msg.Times = times * 10;
    msg.Ratio = ratio;
    net.sendMesssage("OpenOneCardReq", msg)
}

//使用一张已翻开的卡牌
net.UseOneCardReq = function (curCardIndex) {
    var msg = net.MakeMsg("UseOneCardReq")
    msg.CardIndex = curCardIndex;
    net.sendMesssage("UseOneCardReq", msg)
}

//上阵英雄
net.EquipHeroReq = function (position, roleID) {
    var msg = net.MakeMsg("EquipHeroReq")
    msg.Position = position;
    msg.RoleID = roleID;
    console.log("------------------->EquipHeroReq")
    net.sendMesssage("EquipHeroReq", msg)
}

//下阵英雄
net.UnEquipHeroReq = function (position) {
    var msg = net.MakeMsg("UnEquipHeroReq")
    msg.Position = position;
    net.sendMesssage("UnEquipHeroReq", msg)
}

//杀死实体请求
net.AttackEntityReq = function (attackEntityID, beAttackEntityID, times, ratio) {
    var msg = net.MakeMsg("AttackEntityReq")
    msg.AttackerID = attackEntityID;
    msg.BeAttackerID = beAttackEntityID;
    msg.Times = times * 10;
    msg.Ratio = ratio;
    net.sendMesssage("AttackEntityReq", msg)
}

//直接杀死实体请求
net.KillEntityReq = function (EntityID) {
    var msg = net.MakeMsg("KillEntityReq")
    msg.EntityID = EntityID;
    net.sendMesssage("KillEntityReq", msg)
}

//交换阵容请求
net.ChangePositionReq = function (sourcePosition, targetPosition) {
    var msg = net.MakeMsg("ChangePositionReq")
    msg.SourcePosition = sourcePosition;
    msg.TargetPosition = targetPosition;
    net.sendMesssage("ChangePositionReq", msg)
}

//剧情攻击请求
net.AllergenAttackReq = function (attackIndex) {
    var msg = net.MakeMsg("AllergenAttackReq")
    msg.Index = attackIndex;
    net.sendMesssage("AllergenAttackReq", msg)
}

//清理结算标志
net.ResetAllergenSettleFlagReq = function () {
    var msg = net.MakeMsg("ResetAllergenSettleFlagReq")
    net.sendMesssage("ResetAllergenSettleFlagReq", msg)
}

//请求翻牌
net.ClownOpenAllCardReq = function (round) {
    var msg = net.MakeMsg("ClownOpenAllCardReq")
    msg.Round = round;
    net.sendMesssage("ClownOpenAllCardReq", msg)
}

//清理结算标志
net.ResetClownSettleFlagReq = function () {
    var msg = net.MakeMsg("ResetClownSettleFlagReq")
    net.sendMesssage("ResetClownSettleFlagReq", msg)
}

//同步点券
net.RefreshUserDianJuanReq = function (callBack) {
    var url = cc.js.formatStr(GameConfig.getTicketAddress, net.PlayerId);
    HttpUtil.httpGet(url, callBack);
}

//点劵兑换
net.ticketExchangeGoldReq = function (userid, ticket, callBack) {
    var sAddress = GameConfig.ticketExchangeGoldAddress;
    var handle = "userticketchargecoin";
    var SECURITY_KEY = "E8FE168AD73Fqp*s$yGAME";
    var sign = handle + userid + ticket + net.GameId + 0 + SECURITY_KEY;
    var url = cc.js.formatStr("%s?handle=%s&uid=%d&gameid=%s&ticket=%s&datatype=json&sign=%s&exchangetype=0",
        sAddress, handle, userid, net.GameId, ticket, md5.hex_md5(sign));
    HttpUtil.httpGet(url, callBack);
}

//支付
net.sendWxPay = function (openid, uid, money, exchange, gameid, callBack) {
    var sAddress = GameConfig.wxPayAddress;
    var url = cc.js.formatStr("%s?openid=%s&uid=%s&money=%s&Exchange=%s&gameid=%s",
        sAddress, openid, uid, money, exchange, gameid);
    HttpUtil.httpGet(url, callBack);
}