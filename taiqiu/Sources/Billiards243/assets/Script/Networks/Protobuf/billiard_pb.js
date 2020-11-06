/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
; (function (scope) {
"use strict";
let $root = (protobuf.roots["default"] || (protobuf.roots["default"] = new protobuf.Root()))
.setOptions({
  java_package: "com.wangpo.base.bean",
  java_outer_classname: "PlatFormProto"
})
.addJSON({
  C2S_BilliardInfo: {
    fields: {
      billiardInfos: {
        rule: "repeated",
        type: "BilliardInfo",
        id: 1
      }
    }
  },
  BilliardInfo: {
    fields: {
      chang: {
        type: "int32",
        id: 5
      },
      total: {
        type: "int32",
        id: 1
      },
      win: {
        type: "int32",
        id: 2
      },
      streak: {
        type: "int32",
        id: 3
      },
      run: {
        type: "int32",
        id: 4
      }
    }
  },
  C2S_Match: {
    fields: {
      gameId: {
        type: "int32",
        id: 1
      },
      changId: {
        type: "int32",
        id: 2
      },
      moneyId: {
        type: "int32",
        id: 3
      }
    }
  },
  C2S_EnterRoom: {
    fields: {}
  },
  C2S_CueMove: {
    fields: {
      playerID: {
        type: "int32",
        id: 1
      },
      angle: {
        type: "Vec3",
        id: 2
      },
      position: {
        type: "Vec3",
        id: 3
      }
    }
  },
  C2S_Batting: {
    fields: {
      playerID: {
        type: "int32",
        id: 1
      },
      angle: {
        type: "double",
        id: 2
      },
      powerScale: {
        type: "double",
        id: 3
      },
      velocity: {
        type: "Vec3",
        id: 4
      },
      force: {
        type: "Vec3",
        id: 5
      },
      contactPoint: {
        type: "Vec2",
        id: 6
      },
      gasserAngle: {
        type: "double",
        id: 7
      },
      hitPoint: {
        type: "Vec2",
        id: 8
      },
      hitAngle: {
        type: "double",
        id: 9
      }
    }
  },
  C2S_Snooker: {
    fields: {
      playerID: {
        type: "int32",
        id: 2
      },
      numbers: {
        rule: "repeated",
        type: "int32",
        id: 1
      },
      pos: {
        type: "int32",
        id: 3
      }
    }
  },
  C2S_SyncDesk: {
    fields: {
      pockets: {
        rule: "repeated",
        type: "GameBall",
        id: 1
      }
    }
  },
  C2S_SyncPos: {
    fields: {
      playerID: {
        type: "int32",
        id: 2
      },
      ballMoves: {
        rule: "repeated",
        type: "BallMove",
        id: 1
      }
    }
  },
  C2S_SyncPos2: {
    fields: {
      hitFirstBall: {
        type: "int32",
        id: 1
      },
      balls: {
        rule: "repeated",
        type: "GameBall",
        id: 2
      },
      playerID: {
        type: "int32",
        id: 3
      },
      gan: {
        type: "int32",
        id: 4
      },
      hitKu: {
        type: "int32",
        id: 5
      }
    }
  },
  C2S_LayBall: {
    fields: {
      playerID: {
        type: "int64",
        id: 1
      },
      position: {
        type: "Vec3",
        id: 2
      },
      dropStatus: {
        type: "int32",
        id: 3
      },
      angle: {
        type: "Vec4",
        id: 4
      },
      body: {
        type: "Vec3",
        id: 5
      }
    }
  },
  C2S_NewRound: {
    fields: {
      id: {
        type: "int32",
        id: 1
      }
    }
  },
  C2S_ExitRoom: {
    fields: {
      id: {
        type: "int32",
        id: 1
      }
    }
  },
  C2S_ReqDouble: {
    fields: {
      playerID: {
        type: "int32",
        id: 1
      }
    }
  },
  C2S_RespDouble: {
    fields: {
      playerID: {
        type: "int32",
        id: 1
      },
      flag: {
        type: "int32",
        id: 2
      }
    }
  },
  C2S_MyCue: {
    fields: {
      playerID: {
        type: "int32",
        id: 1
      }
    }
  },
  C2S_BuyCue: {
    fields: {
      playerID: {
        type: "int32",
        id: 1
      },
      cueID: {
        type: "int32",
        id: 2
      }
    }
  },
  C2S_SellCue: {
    fields: {
      playerID: {
        type: "int32",
        id: 1
      },
      id: {
        type: "int32",
        id: 2
      }
    }
  },
  C2S_UpgradeCue: {
    fields: {
      playerID: {
        type: "int32",
        id: 1
      },
      id: {
        type: "int32",
        id: 2
      }
    }
  },
  C2S_UseCue: {
    fields: {
      playerID: {
        type: "int32",
        id: 1
      },
      id: {
        type: "int32",
        id: 2
      }
    }
  },
  C2S_AllCue: {
    fields: {
      playerID: {
        type: "int32",
        id: 1
      }
    }
  },
  C2S_DefendCue: {
    fields: {
      playerId: {
        type: "int32",
        id: 1
      },
      id: {
        type: "int32",
        id: 2
      },
      defendType: {
        type: "int32",
        id: 3
      }
    }
  },
  C2S_AllItem: {
    fields: {}
  },
  C2S_GetConfig: {
    fields: {
      configType: {
        type: "int32",
        id: 1
      }
    }
  },
  S2C_BilliardAward: {
    fields: {
      items: {
        rule: "repeated",
        type: "Item",
        id: 1
      }
    }
  },
  C2S_Chat: {
    fields: {
      emoji: {
        type: "string",
        id: 1
      }
    }
  },
  S2C_Chat: {
    fields: {
      id: {
        type: "int32",
        id: 1
      },
      emoji: {
        type: "string",
        id: 2
      }
    }
  },
  S2C_OptPlayer: {
    fields: {
      id: {
        type: "int64",
        id: 1
      },
      endTime: {
        type: "int64",
        id: 2
      },
      gan: {
        type: "int32",
        id: 3
      },
      layBall: {
        type: "int32",
        id: 4
      }
    }
  },
  S2C_MatchOK: {
    fields: {
      matchPlayers: {
        rule: "repeated",
        type: "MatchPlayer",
        id: 1
      }
    }
  },
  S2C_RoomInfo: {
    fields: {
      optPlayer: {
        type: "int32",
        id: 1
      },
      roomNo: {
        type: "int32",
        id: 2
      },
      gan: {
        type: "int32",
        id: 3
      },
      remainTime: {
        type: "int32",
        id: 4
      },
      changId: {
        type: "int32",
        id: 5
      },
      players: {
        rule: "repeated",
        type: "GamePlayer",
        id: 6
      },
      balls: {
        rule: "repeated",
        type: "GameBall",
        id: 7
      },
      cards: {
        rule: "repeated",
        type: "int32",
        id: 8
      },
      proto: {
        type: "C2S_Batting",
        id: 9
      },
      doubleNum: {
        type: "int32",
        id: 10
      },
      divide: {
        type: "int32",
        id: 11
      },
      snookerList: {
        rule: "repeated",
        type: "int32",
        id: 12
      }
    }
  },
  S2C_MatchTimeOut: {
    fields: {}
  },
  S2C_BigSmall: {
    fields: {
      bigOrSmall: {
        type: "int32",
        id: 1
      }
    }
  },
  S2C_GameSettle: {
    fields: {
      code: {
        type: "int32",
        id: 1
      },
      winner: {
        rule: "repeated",
        type: "GameSettlePlayer",
        id: 2
      },
      losers: {
        rule: "repeated",
        type: "GameSettlePlayer",
        id: 3
      }
    }
  },
  S2C_Foul: {
    fields: {
      foul: {
        type: "int32",
        id: 1
      },
      playerID: {
        type: "int32",
        id: 2
      },
      repeatFoul: {
        type: "int32",
        id: 3
      }
    }
  },
  S2C_Frame: {
    fields: {
      frame: {
        type: "int64",
        id: 1
      },
      interval: {
        type: "double",
        id: 2
      }
    }
  },
  S2C_ChangeCue: {
    fields: {
      playerId: {
        type: "int32",
        id: 1
      },
      cueId: {
        type: "int32",
        id: 2
      }
    }
  },
  S2C_MyCue: {
    fields: {
      playerCue: {
        rule: "repeated",
        type: "PlayerCue",
        id: 1
      }
    }
  },
  S2C_BuyCue: {
    fields: {
      playerCue: {
        type: "PlayerCue",
        id: 1
      }
    }
  },
  S2C_SellCue: {
    fields: {
      id: {
        type: "int32",
        id: 1
      }
    }
  },
  S2C_UpgradeCue: {
    fields: {
      playerCue: {
        type: "PlayerCue",
        id: 1
      }
    }
  },
  S2C_UseCue: {
    fields: {
      id: {
        type: "int32",
        id: 1
      }
    }
  },
  S2C_AllCue: {
    fields: {
      playerCue: {
        rule: "repeated",
        type: "PlayerCue",
        id: 1
      }
    }
  },
  S2C_DefendCue: {
    fields: {
      playerCue: {
        type: "PlayerCue",
        id: 1
      }
    }
  },
  S2C_AllItem: {
    fields: {
      item: {
        rule: "repeated",
        type: "Item",
        id: 1
      }
    }
  },
  S2C_updateItem: {
    fields: {
      item: {
        type: "Item",
        id: 1
      }
    }
  },
  S2C_Notice: {
    fields: {
      body: {
        type: "string",
        id: 1
      }
    }
  },
  C2S_getRole: {
    fields: {}
  },
  C2S_UseRole: {
    fields: {
      id: {
        type: "int32",
        id: 1
      }
    }
  },
  S2C_getRole: {
    fields: {
      role: {
        rule: "repeated",
        type: "Role",
        id: 1
      }
    }
  },
  S2C_UseRole: {
    fields: {
      id: {
        type: "int32",
        id: 1
      }
    }
  },
  S2C_updateRole: {
    fields: {
      role: {
        type: "Role",
        id: 1
      }
    }
  },
  S2C_DrawCard: {
    fields: {
      cards: {
        rule: "repeated",
        type: "int32",
        id: 1
      }
    }
  },
  S2C_GetConfig: {
    fields: {
      configType: {
        type: "int32",
        id: 1
      },
      body: {
        type: "string",
        id: 2
      }
    }
  },
  C2S_Lottery: {
    fields: {
      chang: {
        type: "int32",
        id: 1
      }
    }
  },
  S2C_LotteryAward: {
    fields: {
      lotteryItem: {
        type: "LotteryItem",
        id: 1
      },
      lotteryItems: {
        rule: "repeated",
        type: "LotteryItem",
        id: 2
      }
    }
  },
  S2C_GameTimes: {
    fields: {
      gameTimes: {
        rule: "repeated",
        type: "GameTime",
        id: 1
      }
    }
  },
  C2S_LuckyCueOpt: {
    fields: {
      luckyType: {
        type: "int32",
        id: 1
      }
    }
  },
  C2S_Lucky: {
    fields: {
      luckyType: {
        type: "int32",
        id: 1
      },
      result: {
        type: "int32",
        id: 2
      }
    }
  },
  S2C_LuckCue: {
    fields: {
      freeTimes: {
        type: "int32",
        id: 1
      },
      vipTimes: {
        type: "int32",
        id: 2
      },
      remainTime: {
        type: "int64",
        id: 3
      },
      level: {
        type: "int32",
        id: 4
      },
      freeFlag: {
        type: "int32",
        id: 5
      },
      vipFlag: {
        type: "int32",
        id: 6
      }
    }
  },
  BallMove: {
    fields: {
      id: {
        type: "string",
        id: 1
      },
      p: {
        type: "Vec3",
        id: 2
      },
      q: {
        type: "Vec3",
        id: 3
      }
    }
  },
  GameBall: {
    fields: {
      id: {
        type: "int32",
        id: 1
      },
      position: {
        type: "Vec3",
        id: 2
      },
      angle: {
        type: "Vec4",
        id: 3
      },
      body: {
        type: "Vec3",
        id: 4
      }
    }
  },
  Vec2: {
    fields: {
      x: {
        type: "double",
        id: 1
      },
      y: {
        type: "double",
        id: 2
      }
    }
  },
  Vec3: {
    fields: {
      x: {
        type: "double",
        id: 1
      },
      y: {
        type: "double",
        id: 2
      },
      z: {
        type: "double",
        id: 3
      }
    }
  },
  Vec4: {
    fields: {
      x: {
        type: "double",
        id: 1
      },
      y: {
        type: "double",
        id: 2
      },
      z: {
        type: "double",
        id: 3
      },
      w: {
        type: "double",
        id: 4
      }
    }
  },
  GamePlayer: {
    fields: {
      id: {
        type: "int32",
        id: 1
      },
      nick: {
        type: "string",
        id: 2
      },
      head: {
        type: "string",
        id: 3
      },
      roleId: {
        type: "int32",
        id: 9
      },
      changId: {
        type: "int32",
        id: 4
      },
      cueId: {
        type: "int32",
        id: 5
      },
      balls: {
        rule: "repeated",
        type: "int32",
        id: 6
      },
      cards: {
        rule: "repeated",
        type: "int32",
        id: 7
      },
      winNum: {
        type: "int32",
        id: 8
      },
      foul: {
        type: "int32",
        id: 10
      },
      manyCue: {
        type: "int32",
        id: 11
      },
      exp: {
        type: "int32",
        id: 12
      }
    }
  },
  MatchPlayer: {
    fields: {
      id: {
        type: "int64",
        id: 1
      },
      head: {
        type: "string",
        id: 2
      },
      nick: {
        type: "string",
        id: 3
      }
    }
  },
  GameSettlePlayer: {
    fields: {
      id: {
        type: "int64",
        id: 1
      },
      exp: {
        type: "int32",
        id: 2
      },
      moneyType: {
        type: "int32",
        id: 3
      },
      money: {
        type: "int32",
        id: 4
      },
      head: {
        type: "string",
        id: 5
      },
      nick: {
        type: "string",
        id: 6
      },
      cards: {
        rule: "repeated",
        type: "int32",
        id: 7
      },
      needCards: {
        rule: "repeated",
        type: "int32",
        id: 8
      }
    }
  },
  PlayerCue: {
    fields: {
      id: {
        type: "int32",
        id: 1
      },
      playerID: {
        type: "int32",
        id: 2
      },
      cueID: {
        type: "int32",
        id: 3
      },
      grade: {
        type: "int32",
        id: 4
      },
      damageTime: {
        type: "int64",
        id: 5
      },
      isUse: {
        type: "int32",
        id: 6
      },
      defendTimes: {
        type: "int32",
        id: 7
      },
      defendDay: {
        type: "int64",
        id: 8
      }
    }
  },
  LotteryItem: {
    fields: {
      id: {
        type: "int32",
        id: 1
      },
      num: {
        type: "int32",
        id: 2
      },
      grade: {
        type: "int32",
        id: 3
      }
    }
  },
  Item: {
    fields: {
      id: {
        type: "int32",
        id: 1
      },
      num: {
        type: "int32",
        id: 2
      }
    }
  },
  Role: {
    fields: {
      id: {
        type: "int32",
        id: 1
      },
      roleId: {
        type: "int32",
        id: 2
      },
      playerId: {
        type: "int32",
        id: 3
      },
      isUse: {
        type: "int32",
        id: 4
      },
      exp: {
        type: "int32",
        id: 5
      }
    }
  },
  GameTime: {
    fields: {
      chang: {
        type: "int32",
        id: 1
      },
      times: {
        type: "int32",
        id: 2
      }
    }
  },
  C2S_NoviceGuideMatch: {
    fields: {
      gameId: {
        type: "int32",
        id: 1
      },
      changId: {
        type: "int32",
        id: 2
      },
      moneyId: {
        type: "int32",
        id: 3
      }
    }
  },
  C2S_NoviceGuideLottery: {
    fields: {
      chang: {
        type: "int32",
        id: 1
      }
    }
  },
  C2S_Login: {
    fields: {
      loginType: {
        type: "int32",
        id: 4
      },
      code: {
        type: "string",
        id: 3
      },
      origin: {
        type: "string",
        id: 2
      },
      device: {
        type: "int32",
        id: 1
      },
      parentId: {
        type: "int32",
        id: 5
      }
    }
  },
  S2C_Login: {
    fields: {
      id: {
        type: "int64",
        id: 1
      },
      nick: {
        type: "string",
        id: 2
      },
      head: {
        type: "string",
        id: 3
      },
      gold: {
        type: "int32",
        id: 4
      },
      diamond: {
        type: "int32",
        id: 5
      },
      level: {
        type: "int32",
        id: 6
      },
      levelExp: {
        type: "int32",
        id: 7
      },
      levelNeedExp: {
        type: "int32",
        id: 8
      },
      token: {
        type: "string",
        id: 9
      },
      redPacket: {
        type: "int32",
        id: 10
      },
      nociveGuideNum: {
        type: "string",
        id: 11
      }
    }
  },
  C2S_Heart: {
    fields: {
      sequence: {
        type: "int64",
        id: 1
      }
    }
  },
  S2C_UpdateGold: {
    fields: {
      id: {
        type: "int32",
        id: 1
      },
      gold: {
        type: "int32",
        id: 2
      }
    }
  },
  S2C_UpdateDiamond: {
    fields: {
      id: {
        type: "int32",
        id: 1
      },
      diamond: {
        type: "int32",
        id: 2
      }
    }
  },
  S2C_UpdateRedPacket: {
    fields: {
      id: {
        type: "int32",
        id: 1
      },
      redPacket: {
        type: "int32",
        id: 2
      }
    }
  },
  C2S_GetTask: {
    fields: {
      taskType: {
        type: "int32",
        id: 1
      }
    }
  },
  C2S_GetTaskReward: {
    fields: {
      id: {
        type: "int32",
        id: 1
      }
    }
  },
  C2S_GetActiveReward: {
    fields: {
      taskType: {
        type: "int32",
        id: 1
      },
      active: {
        type: "int32",
        id: 2
      }
    }
  },
  S2C_ActiveAward: {
    fields: {
      taskType: {
        type: "int32",
        id: 1
      },
      active: {
        type: "int32",
        id: 2
      },
      activeStatus: {
        type: "int32",
        id: 3
      },
      awards: {
        rule: "repeated",
        type: "Award",
        id: 4
      }
    }
  },
  S2C_Award: {
    fields: {
      id: {
        type: "int32",
        id: 1
      },
      taskType: {
        type: "int32",
        id: 2
      },
      active: {
        type: "int32",
        id: 3
      },
      awards: {
        rule: "repeated",
        type: "Award",
        id: 4
      }
    }
  },
  S2C_NewTask: {
    fields: {
      task: {
        type: "PlayerTask",
        id: 1
      }
    }
  },
  S2C_Task: {
    fields: {
      id: {
        type: "int32",
        id: 1
      },
      active: {
        type: "int32",
        id: 2
      },
      activeStatus: {
        type: "int32",
        id: 3
      },
      tasks: {
        rule: "repeated",
        type: "PlayerTask",
        id: 4
      }
    }
  },
  S2C_UpdateTask: {
    fields: {
      id: {
        type: "int32",
        id: 1
      },
      task: {
        type: "PlayerTask",
        id: 2
      }
    }
  },
  PlayerTask: {
    fields: {
      id: {
        type: "int32",
        id: 1
      },
      taskId: {
        type: "int32",
        id: 2
      },
      taskType: {
        type: "int32",
        id: 3
      },
      state: {
        type: "int32",
        id: 4
      },
      conditions: {
        rule: "repeated",
        type: "TaskCondition",
        id: 5
      }
    }
  },
  TaskCondition: {
    fields: {
      conditionId: {
        type: "int32",
        id: 1
      },
      progress: {
        type: "int32",
        id: 2
      },
      totalProgress: {
        type: "int32",
        id: 3
      }
    }
  },
  Award: {
    fields: {
      id: {
        type: "int32",
        id: 1
      },
      num: {
        type: "int32",
        id: 2
      }
    }
  },
  C2S_Member_Award: {
    fields: {
      level: {
        type: "int32",
        id: 1
      }
    }
  },
  S2C_Member_Award: {
    fields: {
      dayGift: {
        type: "int32",
        id: 1
      },
      award: {
        rule: "repeated",
        type: "Award",
        id: 2
      }
    }
  },
  S2C_Member_Upgrade: {
    fields: {
      points: {
        type: "int32",
        id: 1
      }
    }
  },
  S2C_Member_info: {
    fields: {
      points: {
        type: "int32",
        id: 1
      },
      dayGift: {
        type: "int32",
        id: 2
      },
      levelGift: {
        type: "int32",
        id: 3
      }
    }
  },
  C2S_Member_Level: {
    fields: {
      level: {
        type: "int32",
        id: 1
      }
    }
  },
  S2C_Member_Level: {
    fields: {
      levelGift: {
        type: "int32",
        id: 1
      },
      award: {
        rule: "repeated",
        type: "Award",
        id: 2
      }
    }
  },
  C2S_DrawLottery: {
    fields: {
      chang: {
        type: "int32",
        id: 1
      }
    }
  },
  C2S_GetRedPacket: {
    fields: {
      redPackets: {
        rule: "repeated",
        type: "RedPacket",
        id: 1
      }
    }
  },
  S2C_AddRedPacket: {
    fields: {
      redPacket: {
        type: "RedPacket",
        id: 1
      }
    }
  },
  RedPacket: {
    fields: {
      id: {
        type: "int32",
        id: 5
      },
      nick: {
        type: "string",
        id: 1
      },
      vip: {
        type: "int32",
        id: 2
      },
      num: {
        type: "int32",
        id: 3
      },
      time: {
        type: "int64",
        id: 4
      }
    }
  },
  C2S_GetMail: {
    fields: {
      mails: {
        rule: "repeated",
        type: "Mail",
        id: 1
      }
    }
  },
  C2S_MailAward: {
    fields: {
      mailId: {
        type: "int32",
        id: 1
      }
    }
  },
  S2C_NewMail: {
    fields: {
      mail: {
        type: "Mail",
        id: 1
      }
    }
  },
  Mail: {
    fields: {
      mailId: {
        type: "int64",
        id: 1
      },
      title: {
        type: "string",
        id: 2
      },
      content: {
        type: "string",
        id: 3
      },
      mailState: {
        type: "int32",
        id: 5
      },
      time: {
        type: "int64",
        id: 6
      },
      awards: {
        rule: "repeated",
        type: "Award",
        id: 4
      }
    }
  },
  C2S_SignInfo: {
    fields: {}
  },
  S2C_SignIfo: {
    fields: {
      signDayCount: {
        type: "int32",
        id: 1
      },
      signStatus: {
        type: "bool",
        id: 2
      },
      awards: {
        rule: "repeated",
        type: "signAward",
        id: 3
      }
    }
  },
  C2S_Sign: {
    fields: {}
  },
  S2C_Sign: {
    fields: {
      awards: {
        rule: "repeated",
        type: "Award",
        id: 1
      }
    }
  },
  signAward: {
    fields: {
      signDay: {
        type: "int32",
        id: 1
      },
      gold: {
        type: "int64",
        id: 2
      },
      diamond: {
        type: "int64",
        id: 3
      },
      awards: {
        rule: "repeated",
        type: "Award",
        id: 4
      }
    }
  },
  C2S_PayInfo: {
    fields: {}
  },
  S2C_PayInfo: {
    fields: {
      payInfo: {
        rule: "repeated",
        type: "PayInfo",
        id: 1
      }
    }
  },
  PayInfo: {
    fields: {
      payType: {
        type: "int32",
        id: 1
      },
      method: {
        type: "int32",
        id: 2
      },
      preferred: {
        type: "bool",
        id: 3
      }
    }
  },
  C2S_BuyGoods: {
    fields: {
      id: {
        type: "int32",
        id: 1
      },
      payType: {
        type: "int32",
        id: 2
      }
    }
  },
  S2C_BuyGoods: {
    fields: {
      id: {
        type: "int32",
        id: 1
      },
      body: {
        type: "string",
        id: 2
      },
      outTradeNo: {
        type: "string",
        id: 3
      },
      payType: {
        type: "int32",
        id: 4
      }
    }
  },
  S2C_BuyGoodsEnd: {
    fields: {
      id: {
        type: "int32",
        id: 1
      }
    }
  },
  C2S_AliInfo: {
    fields: {}
  },
  S2C_AliInfo: {
    fields: {
      aliInfo: {
        rule: "repeated",
        type: "AliInfo",
        id: 1
      },
      phone: {
        type: "int64",
        id: 2
      }
    }
  },
  AliInfo: {
    fields: {
      aliAccount: {
        type: "string",
        id: 1
      },
      aliName: {
        type: "string",
        id: 2
      }
    }
  },
  C2S_WxOpenIdInfo: {
    fields: {}
  },
  S2C_WxOpenIdInfo: {
    fields: {
      subscribe: {
        type: "int32",
        id: 1
      },
      phone: {
        type: "string",
        id: 2
      }
    }
  },
  C2S_RedPackage: {
    fields: {
      id: {
        type: "int32",
        id: 1
      },
      aliAccount: {
        type: "string",
        id: 2
      },
      aliName: {
        type: "string",
        id: 3
      }
    }
  },
  S2C_RedPackage: {
    fields: {
      id: {
        type: "int32",
        id: 1
      }
    }
  },
  C2S_BingdingPhone: {
    fields: {
      phone: {
        type: "string",
        id: 1
      }
    }
  },
  C2S_PhoneCode: {
    fields: {
      poneCode: {
        type: "string",
        id: 1
      }
    }
  },
  S2C_PhoneCodeSuccess: {
    fields: {
      success: {
        type: "int32",
        id: 1
      }
    }
  },
  C2S_PushAuthentication: {
    fields: {}
  },
  S2C_PushAuthentication: {
    fields: {
      Authentication: {
        type: "int32",
        id: 1
      },
      firstCharge: {
        type: "int32",
        id: 2
      },
      everyDayFirstCharge: {
        type: "int32",
        id: 3
      },
      monCard: {
        type: "int32",
        id: 4
      },
      resurrection: {
        type: "int32",
        id: 5
      },
      monCardTime: {
        type: "int64",
        id: 6
      },
      resurrectionTime: {
        type: "int64",
        id: 7
      },
      weekCard: {
        type: "int32",
        id: 8
      },
      luckyRod: {
        type: "int32",
        id: 9
      }
    }
  },
  C2S_Authentication: {
    fields: {
      name: {
        type: "string",
        id: 1
      },
      idCard: {
        type: "string",
        id: 2
      }
    }
  },
  S2C_Authentication: {
    fields: {
      success: {
        type: "int32",
        id: 1
      }
    }
  },
  S2C_SystemNotice: {
    fields: {
      notices: {
        rule: "repeated",
        type: "SystemNotice",
        id: 1
      }
    }
  },
  SystemNotice: {
    fields: {
      cnTitle: {
        type: "string",
        id: 1
      },
      wyTitle: {
        type: "string",
        id: 2
      },
      cnContent: {
        type: "string",
        id: 3
      },
      wyContent: {
        type: "string",
        id: 4
      },
      force: {
        type: "int32",
        id: 5
      },
      order: {
        type: "int32",
        id: 6
      }
    }
  },
  S2C_SystemTip: {
    fields: {
      notices: {
        rule: "repeated",
        type: "SystemTip",
        id: 1
      }
    }
  },
  SystemTip: {
    fields: {
      cnTitle: {
        type: "string",
        id: 1
      },
      wyTitle: {
        type: "string",
        id: 2
      },
      cnContent: {
        type: "string",
        id: 3
      },
      wyContent: {
        type: "string",
        id: 4
      }
    }
  },
  C2S_MonCardGiftBag: {
    fields: {
      goodsId: {
        type: "int32",
        id: 1
      }
    }
  },
  S2C_MonCardGiftBag: {
    fields: {
      awards: {
        rule: "repeated",
        type: "Award",
        id: 1
      },
      goodsId: {
        type: "int32",
        id: 2
      }
    }
  },
  C2S_ResurrectionNum: {
    fields: {
      roomNum: {
        type: "int32",
        id: 1
      }
    }
  },
  S2C_ResurrectionNum: {
    fields: {
      num: {
        type: "int32",
        id: 1
      }
    }
  },
  C2S_ResurrectionGiftBag: {
    fields: {
      roomNum: {
        type: "int32",
        id: 1
      }
    }
  },
  S2C_PushAward: {
    fields: {
      awards: {
        rule: "repeated",
        type: "Award",
        id: 1
      },
      goodsId: {
        type: "int32",
        id: 2
      }
    }
  },
  C2S_UpdateGuide: {
    fields: {
      num: {
        type: "string",
        id: 1
      }
    }
  }
});
module.exports = $root;
}(typeof window !== "undefined" ? window : (typeof global !== "undefined" ? global : this)));
