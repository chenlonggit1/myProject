var net = require("net");
var EnumDefine = require("EnumDefine")
var GameConfig = require("GameConfig")
var DataManager = require("DataManager");
var EventManager = require("EventManager");
var WindowManager = require("WindowManager");
var HeartBeatManager = require("HeartBeatManager");

//Ping游戏服务器回应
net.OnPingGameRsp = function (rsp) {
    net.waitGatewayHeartbeatNum = 0
}

//登录游戏回应
net.OnLoginGameRsp = function (rsp) {
    if (rsp) {
        DataManager.instance.nickName = rsp.Nick;
        DataManager.instance.sex = rsp.Sex;
        DataManager.instance.headUrl = rsp.Portrait;
        DataManager.instance.money = rsp.Money;

        HeartBeatManager.instance.starHeartBeat();

        EventManager.Dispatch("LoginSuccess")
    }
}

//登出游戏回应
net.OnLogoutGameRsp = function (rsp) {
    if (rsp) {
        EventManager.Dispatch("LogoutSuccess")
    }
}

//进入游戏回应
net.OnEnterGameRsp = function (rsp) {
    if (rsp) {
        DataManager.instance.unlockCellList = rsp.HeroList;
        DataManager.instance.storyAttackStyle = EnumDefine.CellAttackStyle.CLICK_INTERVAL;
    }
}

net.OnStartGameRsp = function (rsp) {
    if (rsp) {
        //刷新本地数据并请求将该细胞上阵
        for (let index = 0; index < DataManager.instance.willCombatCells.length; index++) {
            if (DataManager.instance.willCombatCells[index].RoleID != 0) {
                net.EquipHeroReq(DataManager.instance.willCombatCells[index].Position, DataManager.instance.willCombatCells[index].RoleID)
            }
        }
    }
}

//回合初始通知
net.OnGameBeginRsp = function (rsp) {
    if (rsp) {
        DataManager.instance.resetDataAfterRefresh()

        DataManager.instance.ratio = rsp.Ratio;
        DataManager.instance.level = rsp.LevelID;
        DataManager.instance.money = rsp.Money;
        DataManager.instance.totalKillGermCount = rsp.KillCount;

        console.log("OnGameBeginRsp money = " + DataManager.instance.money)

        //初始化关卡 TODO
        EventManager.Dispatch("GameBegin", rsp);

        for (let idx = 0; idx < GameConfig.meetingMultipleRate.length; ++idx) {
            if (rsp.Ratio === GameConfig.meetingMultipleRate[idx]) {
                DataManager.instance.multipleIndex = idx;
                EventManager.Dispatch("UpdateRatio");
                break;
            }
        }
    }
}

//回合结束通知
net.OnGameEndRsp = function (rsp) {
    EventManager.Dispatch("GameEnd");
}

//设置倍率回应
net.OnSetRatioRsp = function (rsp) {
    if (rsp) {
        for (let idx = 0; idx < GameConfig.meetingMultipleRate.length; ++idx) {
            if (rsp.Ratio === GameConfig.meetingMultipleRate[idx]) {
                DataManager.instance.multipleIndex = idx;
                EventManager.Dispatch("UpdateRatio");
                break;
            }
        }
    }
}

//下注回应
net.OnBetRsp = function (rsp) {
    if (rsp) {
        EventManager.Dispatch("UpdateBetRsp", rsp);

        let role_id = 0;
        if (rsp.Info.BetType == EnumDefine.BetType.ATTACK_GERM && rsp.Delta > 0 && rsp.Consume > 0) {
            for (let index = 0; index < DataManager.instance.combatCells.length; index++) {
                if (rsp.Info.AttackerID == DataManager.instance.combatCells[index].EntityID) {
                    role_id = DataManager.instance.combatCells[index].RoleID;
                    break;
                }
            }
        }
    }
}

//无效分消耗回应(通知客户端加钱)
net.OnInvalidScoreRsp = function (rsp) {
    if (rsp) {
        DataManager.instance.setClientMoney(DataManager.instance.getClientMoney() + parseInt(rsp.Consume));
        EventManager.Dispatch('changeMoney');
        if (rsp.Index >= 0) {
            EventManager.Dispatch('CardUnLock', rsp.Index);
        }
    }
}

//同步卡牌信息
net.OnSyncCardRsp = function (rsp) {
    if (rsp) {
        DataManager.instance.updataCard(rsp.CardData);
        EventManager.Dispatch("SyncCard", rsp.CardData);
    }
}

//同步初始所有卡牌信息
net.OnSyncInitCardRsp = function (rsp) {
    if (rsp) {
        DataManager.instance.cardList = rsp.CardList;

        DataManager.instance.cards = rsp.CardList
        for (let index = 0; index < rsp.CardList.length; index++) {
            EventManager.Dispatch("SyncCard", rsp.CardList[index]);
        }
    }
}

//同步初始阵容信息
net.OnSyncInitPositionRsp = function (rsp) {
    if (rsp) {
        DataManager.instance.willCombatCells = rsp.PositionList;
    }
}

//同步上阵列表
net.OnSyncAllPositionRsp = function (rsp) {
    if (rsp) {
        //刷新本地数据并请求将该细胞上阵
        for (let index = 0; index < rsp.PositionList.length; index++) {
            DataManager.instance.synCombatCell(rsp.PositionList[index]);
        }

        EventManager.Dispatch("SyncPosition")
    }
}

//同步初始实体列表（如果为空列表，那么清空场景中的实体）
net.OnSyncInitEntityRsp = function (rsp) {
    DataManager.instance.combatCellEntitys = [];
    DataManager.instance.combatGermEntitys = [];
    if (rsp.EntityList.length > 0) {
        for (let index = 0; index < rsp.EntityList.length; index++) {
            DataManager.instance.synCombatCellEntity(rsp.EntityList[index]);
            DataManager.instance.synCombatGermEntity(rsp.EntityList[index]);
        }
    }
}

//游戏实体生成回应
net.OnEntitySpawnRsp = function (rsp) {
    if (rsp) {
        if (rsp.Entity.Type == EnumDefine.RoleType.CELL) {
            DataManager.instance.synCombatCellEntity(rsp.Entity);
        } else {
            DataManager.instance.synCombatGermEntity(rsp.Entity);
        }

        if (rsp.Entity.Type == EnumDefine.RoleType.GERM) {
            DataManager.instance.updataCardEntityIdList(rsp.Entity.Index, rsp.Entity.ID);
        }

        EventManager.Dispatch("SpawnEntity", rsp.Entity);
    }
}

//同步初始实体列表
net.OnSyncInitEntityRsp = function (rsp) {

}

//游戏实体死亡数据回应
net.OnEntityDeathRsp = function (rsp) {
    if (rsp) {
        //刷新当前击杀细菌总数
        DataManager.instance.totalKillGermCount = rsp.KillCount;
        EventManager.Dispatch("UpdateTotalKillGermCount");

        let entity = DataManager.instance.killEntity(rsp.EntityID);

        //派发杀死细胞实体信息
        if (entity.Type == EnumDefine.RoleType.CELL) {
            //刷新被攻击的细胞列表
            DataManager.instance.updateBeAttackCells(rsp.EntityID, false);
            //派发杀死细胞实体消息
            EventManager.Dispatch("KillCellEntity", rsp);
        } else {
            if (rsp.EntityID == DataManager.instance.curAttackedGerm) {
                DataManager.instance.curAttackedGerm = -1;
            }

            //刷新卡牌和细菌实体ID对应数据
            let cardIndex = DataManager.instance.getIndexWithCardEntityID(rsp.EntityID);
            if (cardIndex >= 0) {
                DataManager.instance.updataCardEntityIdList(cardIndex, 0);

                if (entity) {
                    let monsterInfo = GameConfig.getMonsterInfoWithID(entity.RoleID);
                    if (monsterInfo != null) {
                        if (monsterInfo.Type == EnumDefine.GermType.JOKER) {
                            EventManager.Dispatch("KillCardInJokerStaus", cardIndex);
                        }
                    }
                }
            }

            //刷新被攻击细菌列表
            DataManager.instance.updateBeAttackGerms(rsp.EntityID, false);
            //派发杀死思君实体消息
            EventManager.Dispatch("KillGermEntity", rsp);
        }
    }
}

//解锁英雄
net.OnUnlockHerosRsp = function (rsp) {
    if (rsp) {
        for (let index = 0; index < rsp.UnlockHeros.length; index++) {
            DataManager.instance.updateUnlockCellList(rsp.UnlockHeros[index]);
        }
        EventManager.Dispatch("UpdateTotalKillGermCount");

        WindowManager.instance.showWindow("UnlockHeroWindow", rsp.UnlockHeros)
    }
}

//交换阵容回应
net.OnChangePositionRsp = function (rsp) {
    if (rsp) {
        EventManager.Dispatch("ChangeHeroPosition", rsp);
    }
}

//同步剧情数据
net.OnSyncStoryData = function (rsp) {
    if (rsp) {
        if (rsp.StoryID == GameConfig.jokerStoryID) {
            //小丑剧情模式数据
            let msg = net.MakeMsg("ClownData", null, rsp.Data);
            console.log("msg.Status = " + msg.Status + " msg.Round = " + msg.Round + " msg.FreeTimes = " + msg.FreeTimes)
            if (DataManager.instance.isJokerFreeStatus != msg.Status) {
                if (msg.Status) {
                    //进入小丑剧情模式
                    DataManager.instance.JokerFreeAmount = 0;
                    DataManager.instance.jokerCurrentRound = msg.Round;
                    DataManager.instance.jokerMoney = rsp.Money;
                    EventManager.Dispatch("EnterJokerStatus", msg.FreeTimes)
                }
            }
        } else {
            //过敏源剧情模式数据
            let msg = net.MakeMsg("AllergenData", null, rsp.Data);
            cc.log(JSON.stringify(msg));
            if (DataManager.instance.isStoryDataStatus != msg.Status) {
                if (msg.Status) {
                    DataManager.instance.isStoryDataStatus = msg.Status;
                    msg.Money = rsp.Money;
                    msg.StoryID = rsp.StoryID;
                    EventManager.Dispatch("EnterStoryRsp", msg);
                } else {
                    DataManager.instance.isStoryDataStatus = msg.Status;
                }
            }
        }
    }
}

//剧情攻击回应
net.OnAllergenAttackRsp = function (rsp) {
    if (rsp) {
        EventManager.Dispatch("AllergenAttack", rsp);
    }
}

//过敏源剧情结算
net.OnAllergenSettleRsp = function (rsp) {
    if (rsp) {
        EventManager.Dispatch("ExitStory", rsp);
        net.ResetAllergenSettleFlagReq();
    }
}

//同步金币
net.OnSyncMoneyRsp = function (rsp) {
    if (rsp) {
        DataManager.instance.setClientMoney(DataManager.instance.getClientMoney() + parseInt(rsp.Delta));
        EventManager.Dispatch('changeMoney');
    }
}

//小丑剧情翻牌回应
net.OnClownOpenAllCardRsp = function (rsp) {
    if (rsp) {
        if (rsp.Result == 0) {
            DataManager.instance.jokerCurrentRound = rsp.Round + 1;
            DataManager.instance.jokerCardDatas = rsp.CardList;
            EventManager.Dispatch("JokerStatusOpenCards")
        }
    }
}

//小丑剧情结算
net.OnClownSettleRsp = function (rsp) {
    if (rsp) {
        console.log("OnClownSettleRsp rsp.Delta = " + rsp.Delta)
        if (rsp.Delta > 0) {
            if (DataManager.instance.isJokerFreeStatus) {
                DataManager.instance.jokerTotalRewardAmount = rsp.Delta;
            }
        }
    }
}