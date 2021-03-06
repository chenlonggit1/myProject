var net = require("net")

net.messageCode = {
    "BASE_MESSAGE": "Message",
    "ALLOC_SERVER": "AllocServer",
    "ALLOC_SERVER_ADDRESS_RSP": "AllocServerAddressResp",
    "PARTNER_USER_LOGIN_REQ": "QPPartnerUserLoginReq",
    "WECHAT_SIGN_REQ": "WechatSignReq",
    "HTTP_RESULT": "HttpResult",
    "LOGIN_GAME_REQ": "LoginGameReq",
    "LOGIN_GAME_RSP": "LoginGameRsp",
    "LOGOUT_GAME_REQ": "LogoutGameReq",
    "LOGOUT_GAME_RSP": "LogoutGameRsp",
    "PING_GAME_REQ": "PingGameReq",
    "PING_GAME_RSP": "PingGameRsp",
    "JOIN_ROOM_REQ": "JoinRoomReq",
    "JOIN_ROOM_RSP": "JoinRoomRsp",
    "LEAVE_ROOM_REQ": "LeaveRoomReq",
    "LEAVE_ROOM_RSP": "LeaveRoomRsp",
    "ENTER_GAME_RSP": "EnterGameRsp",
    "START_GAME_REQ": "StartGameReq",
    "START_GAME_RSP": "StartGameRsp",
    "RESTART_GAME_REQ": "RestartGameReq",
    "RESTART_GAME_RSP": "RestartGameRsp",
    "GAME_BEGIN_RSP": "GameBeginRsp",
    "GAME_END_RSP": "GameEndRsp",
    "SET_RATIO_REQ": "SetRatioReq",
    "SET_RATIO_RSP": "SetRatioRsp",
    "BET_RSP": "BetRsp",
    "INVALID_SCORE_RSP": "InvalidScoreRsp",
    "OPEN_ONE_CARD_REQ": "OpenOneCardReq",
    "OPEN_ONE_CARD_RSP": "OpenOneCardRsp",
    "USE_ONE_CARD_REQ": "UseOneCardReq",
    "USE_ONE_CARD_RSP": "UseOneCardRsp",
    "SYNC_CARD_RSP": "SyncCardRsp",
    "SYNC_INIT_CARD_RSP": "SyncInitCardRsp",
    "EQUIP_HERO_REQ": "EquipHeroReq",
    "EQUIP_HERO_RSP": "EquipHeroRsp",
    "UNEQUIP_HERO_REQ": "UnEquipHeroReq",
    "UNEQUIP_HERO_RSP": "UnEquipHeroRsp",
    "CHANGE_HERO_POSITION_REQ": "ChangePositionReq",
    "CHANGE_HERO_POSITION_RSP": "ChangePositionRsp",
    "SYNC_INIT_POSITION_RSP": "SyncInitPositionRsp",
    "SYNC_ALL_POSITION_RSP": "SyncAllPositionRsp",
    "SYNC_INIT_ENTITY_RSP": "SyncInitEntityRsp",
    "ENTITY_SPAWN_RSP": "EntitySpawnRsp",
    "ENTITY_DEATH_RSP": "EntityDeathRsp",
    "ATTACK_ENTITY_REQ": "AttackEntityReq",
    "KILL_ENTITY_REQ": "KillEntityReq",
    "SYNC_STORY_DATA": "SyncStoryData",
    "ALLERGEN_ATTACK_REQ": "AllergenAttackReq",
    "ALLERGEN_ATTACK_RSP": "AllergenAttackRsp",
    "ALLERGEN_SETTLE_RSP": "AllergenSettleRsp",
    "RESET_ALLERGEN_SETTLE_FLAG_REQ": "ResetAllergenSettleFlagReq",
    "UNLOCK_HEROS_RSP": "UnlockHerosRsp",
    "SYNC_MONEY_RSP": "SyncMoneyRsp",
    "CLOWN_OPEN_ALL_CARD_REQ": "ClownOpenAllCardReq",
    "CLOWN_OPEN_ALL_CARD_RSP": "ClownOpenAllCardRsp",
    "CLOWN_SETTLE_RSP": "ClownSettleRsp",
    "RESET_CLOWN_SETTLE_FLAG_REQ": "ResetClownSettleFlagReq",
}