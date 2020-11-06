export enum PayType {
    /** 支付宝 */
    ZFB = 1,
    /** 微信 */
    WX = 2,
    /** 银联 */
    YL = 3,
    /** 微信小程序 */
    WXM = 5,
}

export enum PayKinds {
    /** 人民币 */
    RMB = 1,
    /** 红包 */
    RED_PACK = 2,
    /** 钻石购买 */
    DIM = 3,
}

export enum GoodsType { // 货币类型：1 金币、2钻石、 3 微信红包、 4 话费、5复活新手礼包（限一次）、6月卡、7复活月卡、11支付宝红包 3002 幸运一杆
    GOLD = 1,
    DIM = 2,
    WXPack = 3, // 微信红包
    ALIPack = 11, // 支付宝红包
    Luck_Gan = 3002, // 幸运一杆
    ADV_Card = 3001, // 强化卡

}


export enum GoodsId { // 
    FirstPayGift = 7001, // 首充
    FirstPayGift_2 = 7003, // 首充
    MouthVip = 9001, // 月卡
    WeekVip = 9003, // 周卡
    reLifeMouthVip = 8003, // 复活月卡
    Advcard = 3001, // 强化卡
}
