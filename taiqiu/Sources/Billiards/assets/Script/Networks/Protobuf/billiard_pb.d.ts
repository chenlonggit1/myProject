/** Properties of a C2S_BilliardInfo. */
declare interface IC2S_BilliardInfo {

    /** C2S_BilliardInfo billiardInfos */
    billiardInfos?: (IBilliardInfo[]|null);
}

/** Represents a C2S_BilliardInfo. */
export class C2S_BilliardInfo implements IC2S_BilliardInfo {

    /**
     * Constructs a new C2S_BilliardInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_BilliardInfo);

    /** C2S_BilliardInfo billiardInfos. */
    public billiardInfos: IBilliardInfo[];

    /**
     * Creates a new C2S_BilliardInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_BilliardInfo instance
     */
    public static create(properties?: IC2S_BilliardInfo): C2S_BilliardInfo;

    /**
     * Encodes the specified C2S_BilliardInfo message. Does not implicitly {@link C2S_BilliardInfo.verify|verify} messages.
     * @param message C2S_BilliardInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_BilliardInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_BilliardInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_BilliardInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_BilliardInfo;
}

/** Properties of a BilliardInfo. */
export interface IBilliardInfo {

    /** BilliardInfo chang */
    chang?: (number|null);

    /** BilliardInfo total */
    total?: (number|null);

    /** BilliardInfo win */
    win?: (number|null);

    /** BilliardInfo streak */
    streak?: (number|null);

    /** BilliardInfo run */
    run?: (number|null);
}

/** Represents a BilliardInfo. */
export class BilliardInfo implements IBilliardInfo {

    /**
     * Constructs a new BilliardInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IBilliardInfo);

    /** BilliardInfo chang. */
    public chang: number;

    /** BilliardInfo total. */
    public total: number;

    /** BilliardInfo win. */
    public win: number;

    /** BilliardInfo streak. */
    public streak: number;

    /** BilliardInfo run. */
    public run: number;

    /**
     * Creates a new BilliardInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns BilliardInfo instance
     */
    public static create(properties?: IBilliardInfo): BilliardInfo;

    /**
     * Encodes the specified BilliardInfo message. Does not implicitly {@link BilliardInfo.verify|verify} messages.
     * @param message BilliardInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IBilliardInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a BilliardInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns BilliardInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): BilliardInfo;
}

/** Properties of a C2S_Match. */
export interface IC2S_Match {

    /** C2S_Match gameId */
    gameId?: (number|null);

    /** C2S_Match changId */
    changId?: (number|null);

    /** C2S_Match moneyId */
    moneyId?: (number|null);
}

/** Represents a C2S_Match. */
export class C2S_Match implements IC2S_Match {

    /**
     * Constructs a new C2S_Match.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_Match);

    /** C2S_Match gameId. */
    public gameId: number;

    /** C2S_Match changId. */
    public changId: number;

    /** C2S_Match moneyId. */
    public moneyId: number;

    /**
     * Creates a new C2S_Match instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_Match instance
     */
    public static create(properties?: IC2S_Match): C2S_Match;

    /**
     * Encodes the specified C2S_Match message. Does not implicitly {@link C2S_Match.verify|verify} messages.
     * @param message C2S_Match message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_Match, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_Match message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_Match
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_Match;
}

/** Properties of a C2S_EnterRoom. */
export interface IC2S_EnterRoom {
}

/** Represents a C2S_EnterRoom. */
export class C2S_EnterRoom implements IC2S_EnterRoom {

    /**
     * Constructs a new C2S_EnterRoom.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_EnterRoom);

    /**
     * Creates a new C2S_EnterRoom instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_EnterRoom instance
     */
    public static create(properties?: IC2S_EnterRoom): C2S_EnterRoom;

    /**
     * Encodes the specified C2S_EnterRoom message. Does not implicitly {@link C2S_EnterRoom.verify|verify} messages.
     * @param message C2S_EnterRoom message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_EnterRoom, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_EnterRoom message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_EnterRoom
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_EnterRoom;
}

/** Properties of a C2S_CueMove. */
export interface IC2S_CueMove {

    /** C2S_CueMove playerID */
    playerID?: (number|null);

    /** C2S_CueMove angle */
    angle?: (IVec3|null);

    /** C2S_CueMove position */
    position?: (IVec3|null);
}

/** Represents a C2S_CueMove. */
export class C2S_CueMove implements IC2S_CueMove {

    /**
     * Constructs a new C2S_CueMove.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_CueMove);

    /** C2S_CueMove playerID. */
    public playerID: number;

    /** C2S_CueMove angle. */
    public angle?: (IVec3|null);

    /** C2S_CueMove position. */
    public position?: (IVec3|null);

    /**
     * Creates a new C2S_CueMove instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_CueMove instance
     */
    public static create(properties?: IC2S_CueMove): C2S_CueMove;

    /**
     * Encodes the specified C2S_CueMove message. Does not implicitly {@link C2S_CueMove.verify|verify} messages.
     * @param message C2S_CueMove message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_CueMove, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_CueMove message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_CueMove
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_CueMove;
}

/** Properties of a C2S_Batting. */
export interface IC2S_Batting {

    /** C2S_Batting playerID */
    playerID?: (number|null);

    /** C2S_Batting angle */
    angle?: (number|null);

    /** C2S_Batting powerScale */
    powerScale?: (number|null);

    /** C2S_Batting velocity */
    velocity?: (IVec3|null);

    /** C2S_Batting force */
    force?: (IVec3|null);

    /** C2S_Batting contactPoint */
    contactPoint?: (IVec2|null);

    /** C2S_Batting gasserAngle */
    gasserAngle?: (number|null);

    /** C2S_Batting hitPoint */
    hitPoint?: (IVec2|null);

    /** C2S_Batting hitAngle */
    hitAngle?: (number|null);
}

/** Represents a C2S_Batting. */
export class C2S_Batting implements IC2S_Batting {

    /**
     * Constructs a new C2S_Batting.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_Batting);

    /** C2S_Batting playerID. */
    public playerID: number;

    /** C2S_Batting angle. */
    public angle: number;

    /** C2S_Batting powerScale. */
    public powerScale: number;

    /** C2S_Batting velocity. */
    public velocity?: (IVec3|null);

    /** C2S_Batting force. */
    public force?: (IVec3|null);

    /** C2S_Batting contactPoint. */
    public contactPoint?: (IVec2|null);

    /** C2S_Batting gasserAngle. */
    public gasserAngle: number;

    /** C2S_Batting hitPoint. */
    public hitPoint?: (IVec2|null);

    /** C2S_Batting hitAngle. */
    public hitAngle: number;

    /**
     * Creates a new C2S_Batting instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_Batting instance
     */
    public static create(properties?: IC2S_Batting): C2S_Batting;

    /**
     * Encodes the specified C2S_Batting message. Does not implicitly {@link C2S_Batting.verify|verify} messages.
     * @param message C2S_Batting message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_Batting, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_Batting message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_Batting
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_Batting;
}

/** Properties of a C2S_Snooker. */
export interface IC2S_Snooker {

    /** C2S_Snooker playerID */
    playerID?: (number|null);

    /** C2S_Snooker numbers */
    numbers?: (number[]|null);

    /** C2S_Snooker pos */
    pos?: (number|null);
}

/** Represents a C2S_Snooker. */
export class C2S_Snooker implements IC2S_Snooker {

    /**
     * Constructs a new C2S_Snooker.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_Snooker);

    /** C2S_Snooker playerID. */
    public playerID: number;

    /** C2S_Snooker numbers. */
    public numbers: number[];

    /** C2S_Snooker pos. */
    public pos: number;

    /**
     * Creates a new C2S_Snooker instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_Snooker instance
     */
    public static create(properties?: IC2S_Snooker): C2S_Snooker;

    /**
     * Encodes the specified C2S_Snooker message. Does not implicitly {@link C2S_Snooker.verify|verify} messages.
     * @param message C2S_Snooker message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_Snooker, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_Snooker message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_Snooker
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_Snooker;
}

/** Properties of a C2S_SyncDesk. */
export interface IC2S_SyncDesk {

    /** C2S_SyncDesk pockets */
    pockets?: (IGameBall[]|null);
}

/** Represents a C2S_SyncDesk. */
export class C2S_SyncDesk implements IC2S_SyncDesk {

    /**
     * Constructs a new C2S_SyncDesk.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_SyncDesk);

    /** C2S_SyncDesk pockets. */
    public pockets: IGameBall[];

    /**
     * Creates a new C2S_SyncDesk instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_SyncDesk instance
     */
    public static create(properties?: IC2S_SyncDesk): C2S_SyncDesk;

    /**
     * Encodes the specified C2S_SyncDesk message. Does not implicitly {@link C2S_SyncDesk.verify|verify} messages.
     * @param message C2S_SyncDesk message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_SyncDesk, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_SyncDesk message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_SyncDesk
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_SyncDesk;
}

/** Properties of a C2S_SyncPos. */
export interface IC2S_SyncPos {

    /** C2S_SyncPos playerID */
    playerID?: (number|null);

    /** C2S_SyncPos ballMoves */
    ballMoves?: (IBallMove[]|null);
}

/** Represents a C2S_SyncPos. */
export class C2S_SyncPos implements IC2S_SyncPos {

    /**
     * Constructs a new C2S_SyncPos.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_SyncPos);

    /** C2S_SyncPos playerID. */
    public playerID: number;

    /** C2S_SyncPos ballMoves. */
    public ballMoves: IBallMove[];

    /**
     * Creates a new C2S_SyncPos instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_SyncPos instance
     */
    public static create(properties?: IC2S_SyncPos): C2S_SyncPos;

    /**
     * Encodes the specified C2S_SyncPos message. Does not implicitly {@link C2S_SyncPos.verify|verify} messages.
     * @param message C2S_SyncPos message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_SyncPos, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_SyncPos message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_SyncPos
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_SyncPos;
}

/** Properties of a C2S_SyncPos2. */
export interface IC2S_SyncPos2 {

    /** C2S_SyncPos2 hitFirstBall */
    hitFirstBall?: (number|null);

    /** C2S_SyncPos2 balls */
    balls?: (IGameBall[]|null);

    /** C2S_SyncPos2 playerID */
    playerID?: (number|null);

    /** C2S_SyncPos2 gan */
    gan?: (number|null);

    /** C2S_SyncPos2 hitKu */
    hitKu?: (number|null);
}

/** Represents a C2S_SyncPos2. */
export class C2S_SyncPos2 implements IC2S_SyncPos2 {

    /**
     * Constructs a new C2S_SyncPos2.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_SyncPos2);

    /** C2S_SyncPos2 hitFirstBall. */
    public hitFirstBall: number;

    /** C2S_SyncPos2 balls. */
    public balls: IGameBall[];

    /** C2S_SyncPos2 playerID. */
    public playerID: number;

    /** C2S_SyncPos2 gan. */
    public gan: number;

    /** C2S_SyncPos2 hitKu. */
    public hitKu: number;

    /**
     * Creates a new C2S_SyncPos2 instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_SyncPos2 instance
     */
    public static create(properties?: IC2S_SyncPos2): C2S_SyncPos2;

    /**
     * Encodes the specified C2S_SyncPos2 message. Does not implicitly {@link C2S_SyncPos2.verify|verify} messages.
     * @param message C2S_SyncPos2 message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_SyncPos2, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_SyncPos2 message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_SyncPos2
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_SyncPos2;
}

/** Properties of a C2S_LayBall. */
export interface IC2S_LayBall {

    /** C2S_LayBall playerID */
    playerID?: (number|null);

    /** C2S_LayBall position */
    position?: (IVec3|null);

    /** C2S_LayBall dropStatus */
    dropStatus?: (number|null);

    /** C2S_LayBall angle */
    angle?: (IVec4|null);

    /** C2S_LayBall body */
    body?: (IVec3|null);
}

/** Represents a C2S_LayBall. */
export class C2S_LayBall implements IC2S_LayBall {

    /**
     * Constructs a new C2S_LayBall.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_LayBall);

    /** C2S_LayBall playerID. */
    public playerID: number;

    /** C2S_LayBall position. */
    public position?: (IVec3|null);

    /** C2S_LayBall dropStatus. */
    public dropStatus: number;

    /** C2S_LayBall angle. */
    public angle?: (IVec4|null);

    /** C2S_LayBall body. */
    public body?: (IVec3|null);

    /**
     * Creates a new C2S_LayBall instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_LayBall instance
     */
    public static create(properties?: IC2S_LayBall): C2S_LayBall;

    /**
     * Encodes the specified C2S_LayBall message. Does not implicitly {@link C2S_LayBall.verify|verify} messages.
     * @param message C2S_LayBall message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_LayBall, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_LayBall message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_LayBall
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_LayBall;
}

/** Properties of a C2S_NewRound. */
export interface IC2S_NewRound {

    /** C2S_NewRound id */
    id?: (number|null);
}

/** Represents a C2S_NewRound. */
export class C2S_NewRound implements IC2S_NewRound {

    /**
     * Constructs a new C2S_NewRound.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_NewRound);

    /** C2S_NewRound id. */
    public id: number;

    /**
     * Creates a new C2S_NewRound instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_NewRound instance
     */
    public static create(properties?: IC2S_NewRound): C2S_NewRound;

    /**
     * Encodes the specified C2S_NewRound message. Does not implicitly {@link C2S_NewRound.verify|verify} messages.
     * @param message C2S_NewRound message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_NewRound, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_NewRound message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_NewRound
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_NewRound;
}

/** Properties of a C2S_ExitRoom. */
export interface IC2S_ExitRoom {

    /** C2S_ExitRoom id */
    id?: (number|null);
}

/** Represents a C2S_ExitRoom. */
export class C2S_ExitRoom implements IC2S_ExitRoom {

    /**
     * Constructs a new C2S_ExitRoom.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_ExitRoom);

    /** C2S_ExitRoom id. */
    public id: number;

    /**
     * Creates a new C2S_ExitRoom instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_ExitRoom instance
     */
    public static create(properties?: IC2S_ExitRoom): C2S_ExitRoom;

    /**
     * Encodes the specified C2S_ExitRoom message. Does not implicitly {@link C2S_ExitRoom.verify|verify} messages.
     * @param message C2S_ExitRoom message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_ExitRoom, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_ExitRoom message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_ExitRoom
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_ExitRoom;
}

/** Properties of a C2S_ReqDouble. */
export interface IC2S_ReqDouble {

    /** C2S_ReqDouble playerID */
    playerID?: (number|null);
}

/** Represents a C2S_ReqDouble. */
export class C2S_ReqDouble implements IC2S_ReqDouble {

    /**
     * Constructs a new C2S_ReqDouble.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_ReqDouble);

    /** C2S_ReqDouble playerID. */
    public playerID: number;

    /**
     * Creates a new C2S_ReqDouble instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_ReqDouble instance
     */
    public static create(properties?: IC2S_ReqDouble): C2S_ReqDouble;

    /**
     * Encodes the specified C2S_ReqDouble message. Does not implicitly {@link C2S_ReqDouble.verify|verify} messages.
     * @param message C2S_ReqDouble message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_ReqDouble, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_ReqDouble message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_ReqDouble
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_ReqDouble;
}

/** Properties of a C2S_RespDouble. */
export interface IC2S_RespDouble {

    /** C2S_RespDouble playerID */
    playerID?: (number|null);

    /** C2S_RespDouble flag */
    flag?: (number|null);
}

/** Represents a C2S_RespDouble. */
export class C2S_RespDouble implements IC2S_RespDouble {

    /**
     * Constructs a new C2S_RespDouble.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_RespDouble);

    /** C2S_RespDouble playerID. */
    public playerID: number;

    /** C2S_RespDouble flag. */
    public flag: number;

    /**
     * Creates a new C2S_RespDouble instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_RespDouble instance
     */
    public static create(properties?: IC2S_RespDouble): C2S_RespDouble;

    /**
     * Encodes the specified C2S_RespDouble message. Does not implicitly {@link C2S_RespDouble.verify|verify} messages.
     * @param message C2S_RespDouble message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_RespDouble, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_RespDouble message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_RespDouble
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_RespDouble;
}

/** Properties of a C2S_MyCue. */
export interface IC2S_MyCue {

    /** C2S_MyCue playerID */
    playerID?: (number|null);
}

/** Represents a C2S_MyCue. */
export class C2S_MyCue implements IC2S_MyCue {

    /**
     * Constructs a new C2S_MyCue.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_MyCue);

    /** C2S_MyCue playerID. */
    public playerID: number;

    /**
     * Creates a new C2S_MyCue instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_MyCue instance
     */
    public static create(properties?: IC2S_MyCue): C2S_MyCue;

    /**
     * Encodes the specified C2S_MyCue message. Does not implicitly {@link C2S_MyCue.verify|verify} messages.
     * @param message C2S_MyCue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_MyCue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_MyCue message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_MyCue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_MyCue;
}

/** Properties of a C2S_BuyCue. */
export interface IC2S_BuyCue {

    /** C2S_BuyCue playerID */
    playerID?: (number|null);

    /** C2S_BuyCue cueID */
    cueID?: (number|null);
}

/** Represents a C2S_BuyCue. */
export class C2S_BuyCue implements IC2S_BuyCue {

    /**
     * Constructs a new C2S_BuyCue.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_BuyCue);

    /** C2S_BuyCue playerID. */
    public playerID: number;

    /** C2S_BuyCue cueID. */
    public cueID: number;

    /**
     * Creates a new C2S_BuyCue instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_BuyCue instance
     */
    public static create(properties?: IC2S_BuyCue): C2S_BuyCue;

    /**
     * Encodes the specified C2S_BuyCue message. Does not implicitly {@link C2S_BuyCue.verify|verify} messages.
     * @param message C2S_BuyCue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_BuyCue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_BuyCue message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_BuyCue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_BuyCue;
}

/** Properties of a C2S_SellCue. */
export interface IC2S_SellCue {

    /** C2S_SellCue playerID */
    playerID?: (number|null);

    /** C2S_SellCue id */
    id?: (number|null);
}

/** Represents a C2S_SellCue. */
export class C2S_SellCue implements IC2S_SellCue {

    /**
     * Constructs a new C2S_SellCue.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_SellCue);

    /** C2S_SellCue playerID. */
    public playerID: number;

    /** C2S_SellCue id. */
    public id: number;

    /**
     * Creates a new C2S_SellCue instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_SellCue instance
     */
    public static create(properties?: IC2S_SellCue): C2S_SellCue;

    /**
     * Encodes the specified C2S_SellCue message. Does not implicitly {@link C2S_SellCue.verify|verify} messages.
     * @param message C2S_SellCue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_SellCue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_SellCue message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_SellCue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_SellCue;
}

/** Properties of a C2S_UpgradeCue. */
export interface IC2S_UpgradeCue {

    /** C2S_UpgradeCue playerID */
    playerID?: (number|null);

    /** C2S_UpgradeCue id */
    id?: (number|null);
}

/** Represents a C2S_UpgradeCue. */
export class C2S_UpgradeCue implements IC2S_UpgradeCue {

    /**
     * Constructs a new C2S_UpgradeCue.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_UpgradeCue);

    /** C2S_UpgradeCue playerID. */
    public playerID: number;

    /** C2S_UpgradeCue id. */
    public id: number;

    /**
     * Creates a new C2S_UpgradeCue instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_UpgradeCue instance
     */
    public static create(properties?: IC2S_UpgradeCue): C2S_UpgradeCue;

    /**
     * Encodes the specified C2S_UpgradeCue message. Does not implicitly {@link C2S_UpgradeCue.verify|verify} messages.
     * @param message C2S_UpgradeCue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_UpgradeCue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_UpgradeCue message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_UpgradeCue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_UpgradeCue;
}

/** Properties of a C2S_UseCue. */
export interface IC2S_UseCue {

    /** C2S_UseCue playerID */
    playerID?: (number|null);

    /** C2S_UseCue id */
    id?: (number|null);
}

/** Represents a C2S_UseCue. */
export class C2S_UseCue implements IC2S_UseCue {

    /**
     * Constructs a new C2S_UseCue.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_UseCue);

    /** C2S_UseCue playerID. */
    public playerID: number;

    /** C2S_UseCue id. */
    public id: number;

    /**
     * Creates a new C2S_UseCue instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_UseCue instance
     */
    public static create(properties?: IC2S_UseCue): C2S_UseCue;

    /**
     * Encodes the specified C2S_UseCue message. Does not implicitly {@link C2S_UseCue.verify|verify} messages.
     * @param message C2S_UseCue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_UseCue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_UseCue message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_UseCue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_UseCue;
}

/** Properties of a C2S_AllCue. */
export interface IC2S_AllCue {

    /** C2S_AllCue playerID */
    playerID?: (number|null);
}

/** Represents a C2S_AllCue. */
export class C2S_AllCue implements IC2S_AllCue {

    /**
     * Constructs a new C2S_AllCue.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_AllCue);

    /** C2S_AllCue playerID. */
    public playerID: number;

    /**
     * Creates a new C2S_AllCue instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_AllCue instance
     */
    public static create(properties?: IC2S_AllCue): C2S_AllCue;

    /**
     * Encodes the specified C2S_AllCue message. Does not implicitly {@link C2S_AllCue.verify|verify} messages.
     * @param message C2S_AllCue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_AllCue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_AllCue message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_AllCue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_AllCue;
}

/** Properties of a C2S_DefendCue. */
export interface IC2S_DefendCue {

    /** C2S_DefendCue playerId */
    playerId?: (number|null);

    /** C2S_DefendCue id */
    id?: (number|null);

    /** C2S_DefendCue defendType */
    defendType?: (number|null);
}

/** Represents a C2S_DefendCue. */
export class C2S_DefendCue implements IC2S_DefendCue {

    /**
     * Constructs a new C2S_DefendCue.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_DefendCue);

    /** C2S_DefendCue playerId. */
    public playerId: number;

    /** C2S_DefendCue id. */
    public id: number;

    /** C2S_DefendCue defendType. */
    public defendType: number;

    /**
     * Creates a new C2S_DefendCue instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_DefendCue instance
     */
    public static create(properties?: IC2S_DefendCue): C2S_DefendCue;

    /**
     * Encodes the specified C2S_DefendCue message. Does not implicitly {@link C2S_DefendCue.verify|verify} messages.
     * @param message C2S_DefendCue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_DefendCue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_DefendCue message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_DefendCue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_DefendCue;
}

/** Properties of a C2S_AllItem. */
export interface IC2S_AllItem {
}

/** Represents a C2S_AllItem. */
export class C2S_AllItem implements IC2S_AllItem {

    /**
     * Constructs a new C2S_AllItem.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_AllItem);

    /**
     * Creates a new C2S_AllItem instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_AllItem instance
     */
    public static create(properties?: IC2S_AllItem): C2S_AllItem;

    /**
     * Encodes the specified C2S_AllItem message. Does not implicitly {@link C2S_AllItem.verify|verify} messages.
     * @param message C2S_AllItem message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_AllItem, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_AllItem message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_AllItem
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_AllItem;
}

/** Properties of a C2S_GetConfig. */
export interface IC2S_GetConfig {

    /** C2S_GetConfig configType */
    configType?: (number|null);
}

/** Represents a C2S_GetConfig. */
export class C2S_GetConfig implements IC2S_GetConfig {

    /**
     * Constructs a new C2S_GetConfig.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_GetConfig);

    /** C2S_GetConfig configType. */
    public configType: number;

    /**
     * Creates a new C2S_GetConfig instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_GetConfig instance
     */
    public static create(properties?: IC2S_GetConfig): C2S_GetConfig;

    /**
     * Encodes the specified C2S_GetConfig message. Does not implicitly {@link C2S_GetConfig.verify|verify} messages.
     * @param message C2S_GetConfig message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_GetConfig, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_GetConfig message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_GetConfig
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_GetConfig;
}

/** Properties of a S2C_BilliardAward. */
export interface IS2C_BilliardAward {

    /** S2C_BilliardAward items */
    items?: (IItem[]|null);
}

/** Represents a S2C_BilliardAward. */
export class S2C_BilliardAward implements IS2C_BilliardAward {

    /**
     * Constructs a new S2C_BilliardAward.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_BilliardAward);

    /** S2C_BilliardAward items. */
    public items: IItem[];

    /**
     * Creates a new S2C_BilliardAward instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_BilliardAward instance
     */
    public static create(properties?: IS2C_BilliardAward): S2C_BilliardAward;

    /**
     * Encodes the specified S2C_BilliardAward message. Does not implicitly {@link S2C_BilliardAward.verify|verify} messages.
     * @param message S2C_BilliardAward message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_BilliardAward, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_BilliardAward message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_BilliardAward
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_BilliardAward;
}

/** Properties of a C2S_Chat. */
export interface IC2S_Chat {

    /** C2S_Chat emoji */
    emoji?: (string|null);
}

/** Represents a C2S_Chat. */
export class C2S_Chat implements IC2S_Chat {

    /**
     * Constructs a new C2S_Chat.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_Chat);

    /** C2S_Chat emoji. */
    public emoji: string;

    /**
     * Creates a new C2S_Chat instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_Chat instance
     */
    public static create(properties?: IC2S_Chat): C2S_Chat;

    /**
     * Encodes the specified C2S_Chat message. Does not implicitly {@link C2S_Chat.verify|verify} messages.
     * @param message C2S_Chat message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_Chat, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_Chat message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_Chat
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_Chat;
}

/** Properties of a S2C_Chat. */
export interface IS2C_Chat {

    /** S2C_Chat id */
    id?: (number|null);

    /** S2C_Chat emoji */
    emoji?: (string|null);
}

/** Represents a S2C_Chat. */
export class S2C_Chat implements IS2C_Chat {

    /**
     * Constructs a new S2C_Chat.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_Chat);

    /** S2C_Chat id. */
    public id: number;

    /** S2C_Chat emoji. */
    public emoji: string;

    /**
     * Creates a new S2C_Chat instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_Chat instance
     */
    public static create(properties?: IS2C_Chat): S2C_Chat;

    /**
     * Encodes the specified S2C_Chat message. Does not implicitly {@link S2C_Chat.verify|verify} messages.
     * @param message S2C_Chat message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_Chat, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_Chat message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_Chat
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_Chat;
}

/** Properties of a S2C_OptPlayer. */
export interface IS2C_OptPlayer {

    /** S2C_OptPlayer id */
    id?: (number|null);

    /** S2C_OptPlayer endTime */
    endTime?: (number|null);

    /** S2C_OptPlayer gan */
    gan?: (number|null);

    /** S2C_OptPlayer layBall */
    layBall?: (number|null);
}

/** Represents a S2C_OptPlayer. */
export class S2C_OptPlayer implements IS2C_OptPlayer {

    /**
     * Constructs a new S2C_OptPlayer.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_OptPlayer);

    /** S2C_OptPlayer id. */
    public id: number;

    /** S2C_OptPlayer endTime. */
    public endTime: number;

    /** S2C_OptPlayer gan. */
    public gan: number;

    /** S2C_OptPlayer layBall. */
    public layBall: number;

    /**
     * Creates a new S2C_OptPlayer instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_OptPlayer instance
     */
    public static create(properties?: IS2C_OptPlayer): S2C_OptPlayer;

    /**
     * Encodes the specified S2C_OptPlayer message. Does not implicitly {@link S2C_OptPlayer.verify|verify} messages.
     * @param message S2C_OptPlayer message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_OptPlayer, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_OptPlayer message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_OptPlayer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_OptPlayer;
}

/** Properties of a S2C_MatchOK. */
export interface IS2C_MatchOK {

    /** S2C_MatchOK matchPlayers */
    matchPlayers?: (IMatchPlayer[]|null);
}

/** Represents a S2C_MatchOK. */
export class S2C_MatchOK implements IS2C_MatchOK {

    /**
     * Constructs a new S2C_MatchOK.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_MatchOK);

    /** S2C_MatchOK matchPlayers. */
    public matchPlayers: IMatchPlayer[];

    /**
     * Creates a new S2C_MatchOK instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_MatchOK instance
     */
    public static create(properties?: IS2C_MatchOK): S2C_MatchOK;

    /**
     * Encodes the specified S2C_MatchOK message. Does not implicitly {@link S2C_MatchOK.verify|verify} messages.
     * @param message S2C_MatchOK message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_MatchOK, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_MatchOK message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_MatchOK
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_MatchOK;
}

/** Properties of a S2C_RoomInfo. */
export interface IS2C_RoomInfo {

    /** S2C_RoomInfo optPlayer */
    optPlayer?: (number|null);

    /** S2C_RoomInfo roomNo */
    roomNo?: (number|null);

    /** S2C_RoomInfo gan */
    gan?: (number|null);

    /** S2C_RoomInfo remainTime */
    remainTime?: (number|null);

    /** S2C_RoomInfo changId */
    changId?: (number|null);

    /** S2C_RoomInfo players */
    players?: (IGamePlayer[]|null);

    /** S2C_RoomInfo balls */
    balls?: (IGameBall[]|null);

    /** S2C_RoomInfo cards */
    cards?: (number[]|null);

    /** S2C_RoomInfo proto */
    proto?: (IC2S_Batting|null);

    /** S2C_RoomInfo doubleNum */
    doubleNum?: (number|null);

    /** S2C_RoomInfo divide */
    divide?: (number|null);

    /** S2C_RoomInfo snookerList */
    snookerList?: (number[]|null);
}

/** Represents a S2C_RoomInfo. */
export class S2C_RoomInfo implements IS2C_RoomInfo {

    /**
     * Constructs a new S2C_RoomInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_RoomInfo);

    /** S2C_RoomInfo optPlayer. */
    public optPlayer: number;

    /** S2C_RoomInfo roomNo. */
    public roomNo: number;

    /** S2C_RoomInfo gan. */
    public gan: number;

    /** S2C_RoomInfo remainTime. */
    public remainTime: number;

    /** S2C_RoomInfo changId. */
    public changId: number;

    /** S2C_RoomInfo players. */
    public players: IGamePlayer[];

    /** S2C_RoomInfo balls. */
    public balls: IGameBall[];

    /** S2C_RoomInfo cards. */
    public cards: number[];

    /** S2C_RoomInfo proto. */
    public proto?: (IC2S_Batting|null);

    /** S2C_RoomInfo doubleNum. */
    public doubleNum: number;

    /** S2C_RoomInfo divide. */
    public divide: number;

    /** S2C_RoomInfo snookerList. */
    public snookerList: number[];

    /**
     * Creates a new S2C_RoomInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_RoomInfo instance
     */
    public static create(properties?: IS2C_RoomInfo): S2C_RoomInfo;

    /**
     * Encodes the specified S2C_RoomInfo message. Does not implicitly {@link S2C_RoomInfo.verify|verify} messages.
     * @param message S2C_RoomInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_RoomInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_RoomInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_RoomInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_RoomInfo;
}

/** Properties of a S2C_MatchTimeOut. */
export interface IS2C_MatchTimeOut {
}

/** Represents a S2C_MatchTimeOut. */
export class S2C_MatchTimeOut implements IS2C_MatchTimeOut {

    /**
     * Constructs a new S2C_MatchTimeOut.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_MatchTimeOut);

    /**
     * Creates a new S2C_MatchTimeOut instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_MatchTimeOut instance
     */
    public static create(properties?: IS2C_MatchTimeOut): S2C_MatchTimeOut;

    /**
     * Encodes the specified S2C_MatchTimeOut message. Does not implicitly {@link S2C_MatchTimeOut.verify|verify} messages.
     * @param message S2C_MatchTimeOut message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_MatchTimeOut, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_MatchTimeOut message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_MatchTimeOut
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_MatchTimeOut;
}

/** Properties of a S2C_BigSmall. */
export interface IS2C_BigSmall {

    /** S2C_BigSmall bigOrSmall */
    bigOrSmall?: (number|null);
}

/** Represents a S2C_BigSmall. */
export class S2C_BigSmall implements IS2C_BigSmall {

    /**
     * Constructs a new S2C_BigSmall.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_BigSmall);

    /** S2C_BigSmall bigOrSmall. */
    public bigOrSmall: number;

    /**
     * Creates a new S2C_BigSmall instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_BigSmall instance
     */
    public static create(properties?: IS2C_BigSmall): S2C_BigSmall;

    /**
     * Encodes the specified S2C_BigSmall message. Does not implicitly {@link S2C_BigSmall.verify|verify} messages.
     * @param message S2C_BigSmall message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_BigSmall, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_BigSmall message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_BigSmall
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_BigSmall;
}

/** Properties of a S2C_GameSettle. */
export interface IS2C_GameSettle {

    /** S2C_GameSettle code */
    code?: (number|null);

    /** S2C_GameSettle winner */
    winner?: (IGameSettlePlayer[]|null);

    /** S2C_GameSettle losers */
    losers?: (IGameSettlePlayer[]|null);
}

/** Represents a S2C_GameSettle. */
export class S2C_GameSettle implements IS2C_GameSettle {

    /**
     * Constructs a new S2C_GameSettle.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_GameSettle);

    /** S2C_GameSettle code. */
    public code: number;

    /** S2C_GameSettle winner. */
    public winner: IGameSettlePlayer[];

    /** S2C_GameSettle losers. */
    public losers: IGameSettlePlayer[];

    /**
     * Creates a new S2C_GameSettle instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_GameSettle instance
     */
    public static create(properties?: IS2C_GameSettle): S2C_GameSettle;

    /**
     * Encodes the specified S2C_GameSettle message. Does not implicitly {@link S2C_GameSettle.verify|verify} messages.
     * @param message S2C_GameSettle message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_GameSettle, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_GameSettle message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_GameSettle
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_GameSettle;
}

/** Properties of a S2C_Foul. */
export interface IS2C_Foul {

    /** S2C_Foul foul */
    foul?: (number|null);

    /** S2C_Foul playerID */
    playerID?: (number|null);

    /** S2C_Foul repeatFoul */
    repeatFoul?: (number|null);
}

/** Represents a S2C_Foul. */
export class S2C_Foul implements IS2C_Foul {

    /**
     * Constructs a new S2C_Foul.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_Foul);

    /** S2C_Foul foul. */
    public foul: number;

    /** S2C_Foul playerID. */
    public playerID: number;

    /** S2C_Foul repeatFoul. */
    public repeatFoul: number;

    /**
     * Creates a new S2C_Foul instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_Foul instance
     */
    public static create(properties?: IS2C_Foul): S2C_Foul;

    /**
     * Encodes the specified S2C_Foul message. Does not implicitly {@link S2C_Foul.verify|verify} messages.
     * @param message S2C_Foul message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_Foul, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_Foul message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_Foul
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_Foul;
}

/** Properties of a S2C_Frame. */
export interface IS2C_Frame {

    /** S2C_Frame frame */
    frame?: (number|null);

    /** S2C_Frame interval */
    interval?: (number|null);
}

/** Represents a S2C_Frame. */
export class S2C_Frame implements IS2C_Frame {

    /**
     * Constructs a new S2C_Frame.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_Frame);

    /** S2C_Frame frame. */
    public frame: number;

    /** S2C_Frame interval. */
    public interval: number;

    /**
     * Creates a new S2C_Frame instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_Frame instance
     */
    public static create(properties?: IS2C_Frame): S2C_Frame;

    /**
     * Encodes the specified S2C_Frame message. Does not implicitly {@link S2C_Frame.verify|verify} messages.
     * @param message S2C_Frame message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_Frame, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_Frame message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_Frame
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_Frame;
}

/** Properties of a S2C_ChangeCue. */
export interface IS2C_ChangeCue {

    /** S2C_ChangeCue playerId */
    playerId?: (number|null);

    /** S2C_ChangeCue cueId */
    cueId?: (number|null);
}

/** Represents a S2C_ChangeCue. */
export class S2C_ChangeCue implements IS2C_ChangeCue {

    /**
     * Constructs a new S2C_ChangeCue.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_ChangeCue);

    /** S2C_ChangeCue playerId. */
    public playerId: number;

    /** S2C_ChangeCue cueId. */
    public cueId: number;

    /**
     * Creates a new S2C_ChangeCue instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_ChangeCue instance
     */
    public static create(properties?: IS2C_ChangeCue): S2C_ChangeCue;

    /**
     * Encodes the specified S2C_ChangeCue message. Does not implicitly {@link S2C_ChangeCue.verify|verify} messages.
     * @param message S2C_ChangeCue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_ChangeCue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_ChangeCue message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_ChangeCue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_ChangeCue;
}

/** Properties of a S2C_MyCue. */
export interface IS2C_MyCue {

    /** S2C_MyCue playerCue */
    playerCue?: (IPlayerCue[]|null);
}

/** Represents a S2C_MyCue. */
export class S2C_MyCue implements IS2C_MyCue {

    /**
     * Constructs a new S2C_MyCue.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_MyCue);

    /** S2C_MyCue playerCue. */
    public playerCue: IPlayerCue[];

    /**
     * Creates a new S2C_MyCue instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_MyCue instance
     */
    public static create(properties?: IS2C_MyCue): S2C_MyCue;

    /**
     * Encodes the specified S2C_MyCue message. Does not implicitly {@link S2C_MyCue.verify|verify} messages.
     * @param message S2C_MyCue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_MyCue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_MyCue message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_MyCue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_MyCue;
}

/** Properties of a S2C_BuyCue. */
export interface IS2C_BuyCue {

    /** S2C_BuyCue playerCue */
    playerCue?: (IPlayerCue|null);
}

/** Represents a S2C_BuyCue. */
export class S2C_BuyCue implements IS2C_BuyCue {

    /**
     * Constructs a new S2C_BuyCue.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_BuyCue);

    /** S2C_BuyCue playerCue. */
    public playerCue?: (IPlayerCue|null);

    /**
     * Creates a new S2C_BuyCue instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_BuyCue instance
     */
    public static create(properties?: IS2C_BuyCue): S2C_BuyCue;

    /**
     * Encodes the specified S2C_BuyCue message. Does not implicitly {@link S2C_BuyCue.verify|verify} messages.
     * @param message S2C_BuyCue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_BuyCue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_BuyCue message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_BuyCue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_BuyCue;
}

/** Properties of a S2C_SellCue. */
export interface IS2C_SellCue {

    /** S2C_SellCue id */
    id?: (number|null);
}

/** Represents a S2C_SellCue. */
export class S2C_SellCue implements IS2C_SellCue {

    /**
     * Constructs a new S2C_SellCue.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_SellCue);

    /** S2C_SellCue id. */
    public id: number;

    /**
     * Creates a new S2C_SellCue instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_SellCue instance
     */
    public static create(properties?: IS2C_SellCue): S2C_SellCue;

    /**
     * Encodes the specified S2C_SellCue message. Does not implicitly {@link S2C_SellCue.verify|verify} messages.
     * @param message S2C_SellCue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_SellCue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_SellCue message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_SellCue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_SellCue;
}

/** Properties of a S2C_UpgradeCue. */
export interface IS2C_UpgradeCue {

    /** S2C_UpgradeCue playerCue */
    playerCue?: (IPlayerCue|null);
}

/** Represents a S2C_UpgradeCue. */
export class S2C_UpgradeCue implements IS2C_UpgradeCue {

    /**
     * Constructs a new S2C_UpgradeCue.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_UpgradeCue);

    /** S2C_UpgradeCue playerCue. */
    public playerCue?: (IPlayerCue|null);

    /**
     * Creates a new S2C_UpgradeCue instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_UpgradeCue instance
     */
    public static create(properties?: IS2C_UpgradeCue): S2C_UpgradeCue;

    /**
     * Encodes the specified S2C_UpgradeCue message. Does not implicitly {@link S2C_UpgradeCue.verify|verify} messages.
     * @param message S2C_UpgradeCue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_UpgradeCue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_UpgradeCue message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_UpgradeCue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_UpgradeCue;
}

/** Properties of a S2C_UseCue. */
export interface IS2C_UseCue {

    /** S2C_UseCue id */
    id?: (number|null);
}

/** Represents a S2C_UseCue. */
export class S2C_UseCue implements IS2C_UseCue {

    /**
     * Constructs a new S2C_UseCue.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_UseCue);

    /** S2C_UseCue id. */
    public id: number;

    /**
     * Creates a new S2C_UseCue instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_UseCue instance
     */
    public static create(properties?: IS2C_UseCue): S2C_UseCue;

    /**
     * Encodes the specified S2C_UseCue message. Does not implicitly {@link S2C_UseCue.verify|verify} messages.
     * @param message S2C_UseCue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_UseCue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_UseCue message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_UseCue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_UseCue;
}

/** Properties of a S2C_AllCue. */
export interface IS2C_AllCue {

    /** S2C_AllCue playerCue */
    playerCue?: (IPlayerCue[]|null);
}

/** Represents a S2C_AllCue. */
export class S2C_AllCue implements IS2C_AllCue {

    /**
     * Constructs a new S2C_AllCue.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_AllCue);

    /** S2C_AllCue playerCue. */
    public playerCue: IPlayerCue[];

    /**
     * Creates a new S2C_AllCue instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_AllCue instance
     */
    public static create(properties?: IS2C_AllCue): S2C_AllCue;

    /**
     * Encodes the specified S2C_AllCue message. Does not implicitly {@link S2C_AllCue.verify|verify} messages.
     * @param message S2C_AllCue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_AllCue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_AllCue message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_AllCue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_AllCue;
}

/** Properties of a S2C_DefendCue. */
export interface IS2C_DefendCue {

    /** S2C_DefendCue playerCue */
    playerCue?: (IPlayerCue|null);
}

/** Represents a S2C_DefendCue. */
export class S2C_DefendCue implements IS2C_DefendCue {

    /**
     * Constructs a new S2C_DefendCue.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_DefendCue);

    /** S2C_DefendCue playerCue. */
    public playerCue?: (IPlayerCue|null);

    /**
     * Creates a new S2C_DefendCue instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_DefendCue instance
     */
    public static create(properties?: IS2C_DefendCue): S2C_DefendCue;

    /**
     * Encodes the specified S2C_DefendCue message. Does not implicitly {@link S2C_DefendCue.verify|verify} messages.
     * @param message S2C_DefendCue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_DefendCue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_DefendCue message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_DefendCue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_DefendCue;
}

/** Properties of a S2C_AllItem. */
export interface IS2C_AllItem {

    /** S2C_AllItem item */
    item?: (IItem[]|null);
}

/** Represents a S2C_AllItem. */
export class S2C_AllItem implements IS2C_AllItem {

    /**
     * Constructs a new S2C_AllItem.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_AllItem);

    /** S2C_AllItem item. */
    public item: IItem[];

    /**
     * Creates a new S2C_AllItem instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_AllItem instance
     */
    public static create(properties?: IS2C_AllItem): S2C_AllItem;

    /**
     * Encodes the specified S2C_AllItem message. Does not implicitly {@link S2C_AllItem.verify|verify} messages.
     * @param message S2C_AllItem message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_AllItem, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_AllItem message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_AllItem
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_AllItem;
}

/** Properties of a S2C_updateItem. */
export interface IS2C_updateItem {

    /** S2C_updateItem item */
    item?: (IItem|null);
}

/** Represents a S2C_updateItem. */
export class S2C_updateItem implements IS2C_updateItem {

    /**
     * Constructs a new S2C_updateItem.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_updateItem);

    /** S2C_updateItem item. */
    public item?: (IItem|null);

    /**
     * Creates a new S2C_updateItem instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_updateItem instance
     */
    public static create(properties?: IS2C_updateItem): S2C_updateItem;

    /**
     * Encodes the specified S2C_updateItem message. Does not implicitly {@link S2C_updateItem.verify|verify} messages.
     * @param message S2C_updateItem message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_updateItem, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_updateItem message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_updateItem
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_updateItem;
}

/** Properties of a S2C_Notice. */
export interface IS2C_Notice {

    /** S2C_Notice body */
    body?: (string|null);
}

/** Represents a S2C_Notice. */
export class S2C_Notice implements IS2C_Notice {

    /**
     * Constructs a new S2C_Notice.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_Notice);

    /** S2C_Notice body. */
    public body: string;

    /**
     * Creates a new S2C_Notice instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_Notice instance
     */
    public static create(properties?: IS2C_Notice): S2C_Notice;

    /**
     * Encodes the specified S2C_Notice message. Does not implicitly {@link S2C_Notice.verify|verify} messages.
     * @param message S2C_Notice message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_Notice, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_Notice message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_Notice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_Notice;
}

/** Properties of a C2S_getRole. */
export interface IC2S_getRole {
}

/** Represents a C2S_getRole. */
export class C2S_getRole implements IC2S_getRole {

    /**
     * Constructs a new C2S_getRole.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_getRole);

    /**
     * Creates a new C2S_getRole instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_getRole instance
     */
    public static create(properties?: IC2S_getRole): C2S_getRole;

    /**
     * Encodes the specified C2S_getRole message. Does not implicitly {@link C2S_getRole.verify|verify} messages.
     * @param message C2S_getRole message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_getRole, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_getRole message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_getRole
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_getRole;
}

/** Properties of a C2S_UseRole. */
export interface IC2S_UseRole {

    /** C2S_UseRole id */
    id?: (number|null);
}

/** Represents a C2S_UseRole. */
export class C2S_UseRole implements IC2S_UseRole {

    /**
     * Constructs a new C2S_UseRole.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_UseRole);

    /** C2S_UseRole id. */
    public id: number;

    /**
     * Creates a new C2S_UseRole instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_UseRole instance
     */
    public static create(properties?: IC2S_UseRole): C2S_UseRole;

    /**
     * Encodes the specified C2S_UseRole message. Does not implicitly {@link C2S_UseRole.verify|verify} messages.
     * @param message C2S_UseRole message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_UseRole, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_UseRole message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_UseRole
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_UseRole;
}

/** Properties of a S2C_getRole. */
export interface IS2C_getRole {

    /** S2C_getRole role */
    role?: (IRole[]|null);
}

/** Represents a S2C_getRole. */
export class S2C_getRole implements IS2C_getRole {

    /**
     * Constructs a new S2C_getRole.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_getRole);

    /** S2C_getRole role. */
    public role: IRole[];

    /**
     * Creates a new S2C_getRole instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_getRole instance
     */
    public static create(properties?: IS2C_getRole): S2C_getRole;

    /**
     * Encodes the specified S2C_getRole message. Does not implicitly {@link S2C_getRole.verify|verify} messages.
     * @param message S2C_getRole message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_getRole, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_getRole message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_getRole
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_getRole;
}

/** Properties of a S2C_UseRole. */
export interface IS2C_UseRole {

    /** S2C_UseRole id */
    id?: (number|null);
}

/** Represents a S2C_UseRole. */
export class S2C_UseRole implements IS2C_UseRole {

    /**
     * Constructs a new S2C_UseRole.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_UseRole);

    /** S2C_UseRole id. */
    public id: number;

    /**
     * Creates a new S2C_UseRole instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_UseRole instance
     */
    public static create(properties?: IS2C_UseRole): S2C_UseRole;

    /**
     * Encodes the specified S2C_UseRole message. Does not implicitly {@link S2C_UseRole.verify|verify} messages.
     * @param message S2C_UseRole message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_UseRole, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_UseRole message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_UseRole
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_UseRole;
}

/** Properties of a S2C_updateRole. */
export interface IS2C_updateRole {

    /** S2C_updateRole role */
    role?: (IRole|null);
}

/** Represents a S2C_updateRole. */
export class S2C_updateRole implements IS2C_updateRole {

    /**
     * Constructs a new S2C_updateRole.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_updateRole);

    /** S2C_updateRole role. */
    public role?: (IRole|null);

    /**
     * Creates a new S2C_updateRole instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_updateRole instance
     */
    public static create(properties?: IS2C_updateRole): S2C_updateRole;

    /**
     * Encodes the specified S2C_updateRole message. Does not implicitly {@link S2C_updateRole.verify|verify} messages.
     * @param message S2C_updateRole message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_updateRole, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_updateRole message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_updateRole
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_updateRole;
}

/** Properties of a S2C_DrawCard. */
export interface IS2C_DrawCard {

    /** S2C_DrawCard cards */
    cards?: (number[]|null);
}

/** Represents a S2C_DrawCard. */
export class S2C_DrawCard implements IS2C_DrawCard {

    /**
     * Constructs a new S2C_DrawCard.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_DrawCard);

    /** S2C_DrawCard cards. */
    public cards: number[];

    /**
     * Creates a new S2C_DrawCard instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_DrawCard instance
     */
    public static create(properties?: IS2C_DrawCard): S2C_DrawCard;

    /**
     * Encodes the specified S2C_DrawCard message. Does not implicitly {@link S2C_DrawCard.verify|verify} messages.
     * @param message S2C_DrawCard message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_DrawCard, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_DrawCard message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_DrawCard
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_DrawCard;
}

/** Properties of a S2C_GetConfig. */
export interface IS2C_GetConfig {

    /** S2C_GetConfig configType */
    configType?: (number|null);

    /** S2C_GetConfig body */
    body?: (string|null);
}

/** Represents a S2C_GetConfig. */
export class S2C_GetConfig implements IS2C_GetConfig {

    /**
     * Constructs a new S2C_GetConfig.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_GetConfig);

    /** S2C_GetConfig configType. */
    public configType: number;

    /** S2C_GetConfig body. */
    public body: string;

    /**
     * Creates a new S2C_GetConfig instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_GetConfig instance
     */
    public static create(properties?: IS2C_GetConfig): S2C_GetConfig;

    /**
     * Encodes the specified S2C_GetConfig message. Does not implicitly {@link S2C_GetConfig.verify|verify} messages.
     * @param message S2C_GetConfig message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_GetConfig, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_GetConfig message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_GetConfig
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_GetConfig;
}

/** Properties of a C2S_Lottery. */
export interface IC2S_Lottery {

    /** C2S_Lottery chang */
    chang?: (number|null);
}

/** Represents a C2S_Lottery. */
export class C2S_Lottery implements IC2S_Lottery {

    /**
     * Constructs a new C2S_Lottery.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_Lottery);

    /** C2S_Lottery chang. */
    public chang: number;

    /**
     * Creates a new C2S_Lottery instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_Lottery instance
     */
    public static create(properties?: IC2S_Lottery): C2S_Lottery;

    /**
     * Encodes the specified C2S_Lottery message. Does not implicitly {@link C2S_Lottery.verify|verify} messages.
     * @param message C2S_Lottery message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_Lottery, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_Lottery message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_Lottery
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_Lottery;
}

/** Properties of a S2C_LotteryAward. */
export interface IS2C_LotteryAward {

    /** S2C_LotteryAward lotteryItem */
    lotteryItem?: (ILotteryItem|null);

    /** S2C_LotteryAward lotteryItems */
    lotteryItems?: (ILotteryItem[]|null);
}

/** Represents a S2C_LotteryAward. */
export class S2C_LotteryAward implements IS2C_LotteryAward {

    /**
     * Constructs a new S2C_LotteryAward.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_LotteryAward);

    /** S2C_LotteryAward lotteryItem. */
    public lotteryItem?: (ILotteryItem|null);

    /** S2C_LotteryAward lotteryItems. */
    public lotteryItems: ILotteryItem[];

    /**
     * Creates a new S2C_LotteryAward instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_LotteryAward instance
     */
    public static create(properties?: IS2C_LotteryAward): S2C_LotteryAward;

    /**
     * Encodes the specified S2C_LotteryAward message. Does not implicitly {@link S2C_LotteryAward.verify|verify} messages.
     * @param message S2C_LotteryAward message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_LotteryAward, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_LotteryAward message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_LotteryAward
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_LotteryAward;
}

/** Properties of a S2C_GameTimes. */
export interface IS2C_GameTimes {

    /** S2C_GameTimes gameTimes */
    gameTimes?: (IGameTime[]|null);
}

/** Represents a S2C_GameTimes. */
export class S2C_GameTimes implements IS2C_GameTimes {

    /**
     * Constructs a new S2C_GameTimes.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_GameTimes);

    /** S2C_GameTimes gameTimes. */
    public gameTimes: IGameTime[];

    /**
     * Creates a new S2C_GameTimes instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_GameTimes instance
     */
    public static create(properties?: IS2C_GameTimes): S2C_GameTimes;

    /**
     * Encodes the specified S2C_GameTimes message. Does not implicitly {@link S2C_GameTimes.verify|verify} messages.
     * @param message S2C_GameTimes message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_GameTimes, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_GameTimes message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_GameTimes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_GameTimes;
}

/** Properties of a C2S_LuckyCueOpt. */
export interface IC2S_LuckyCueOpt {

    /** C2S_LuckyCueOpt luckyType */
    luckyType?: (number|null);
}

/** Represents a C2S_LuckyCueOpt. */
export class C2S_LuckyCueOpt implements IC2S_LuckyCueOpt {

    /**
     * Constructs a new C2S_LuckyCueOpt.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_LuckyCueOpt);

    /** C2S_LuckyCueOpt luckyType. */
    public luckyType: number;

    /**
     * Creates a new C2S_LuckyCueOpt instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_LuckyCueOpt instance
     */
    public static create(properties?: IC2S_LuckyCueOpt): C2S_LuckyCueOpt;

    /**
     * Encodes the specified C2S_LuckyCueOpt message. Does not implicitly {@link C2S_LuckyCueOpt.verify|verify} messages.
     * @param message C2S_LuckyCueOpt message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_LuckyCueOpt, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_LuckyCueOpt message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_LuckyCueOpt
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_LuckyCueOpt;
}

/** Properties of a C2S_Lucky. */
export interface IC2S_Lucky {

    /** C2S_Lucky luckyType */
    luckyType?: (number|null);

    /** C2S_Lucky result */
    result?: (number|null);
}

/** Represents a C2S_Lucky. */
export class C2S_Lucky implements IC2S_Lucky {

    /**
     * Constructs a new C2S_Lucky.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_Lucky);

    /** C2S_Lucky luckyType. */
    public luckyType: number;

    /** C2S_Lucky result. */
    public result: number;

    /**
     * Creates a new C2S_Lucky instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_Lucky instance
     */
    public static create(properties?: IC2S_Lucky): C2S_Lucky;

    /**
     * Encodes the specified C2S_Lucky message. Does not implicitly {@link C2S_Lucky.verify|verify} messages.
     * @param message C2S_Lucky message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_Lucky, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_Lucky message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_Lucky
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_Lucky;
}

/** Properties of a S2C_LuckCue. */
export interface IS2C_LuckCue {

    /** S2C_LuckCue freeTimes */
    freeTimes?: (number|null);

    /** S2C_LuckCue vipTimes */
    vipTimes?: (number|null);

    /** S2C_LuckCue remainTime */
    remainTime?: (number|null);

    /** S2C_LuckCue level */
    level?: (number|null);

    /** S2C_LuckCue freeFlag */
    freeFlag?: (number|null);

    /** S2C_LuckCue vipFlag */
    vipFlag?: (number|null);
}

/** Represents a S2C_LuckCue. */
export class S2C_LuckCue implements IS2C_LuckCue {

    /**
     * Constructs a new S2C_LuckCue.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_LuckCue);

    /** S2C_LuckCue freeTimes. */
    public freeTimes: number;

    /** S2C_LuckCue vipTimes. */
    public vipTimes: number;

    /** S2C_LuckCue remainTime. */
    public remainTime: number;

    /** S2C_LuckCue level. */
    public level: number;

    /** S2C_LuckCue freeFlag. */
    public freeFlag: number;

    /** S2C_LuckCue vipFlag. */
    public vipFlag: number;

    /**
     * Creates a new S2C_LuckCue instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_LuckCue instance
     */
    public static create(properties?: IS2C_LuckCue): S2C_LuckCue;

    /**
     * Encodes the specified S2C_LuckCue message. Does not implicitly {@link S2C_LuckCue.verify|verify} messages.
     * @param message S2C_LuckCue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_LuckCue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_LuckCue message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_LuckCue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_LuckCue;
}

/** Properties of a BallMove. */
export interface IBallMove {

    /** BallMove id */
    id?: (string|null);

    /** BallMove p */
    p?: (IVec3|null);

    /** BallMove q */
    q?: (IVec3|null);
}

/** Represents a BallMove. */
export class BallMove implements IBallMove {

    /**
     * Constructs a new BallMove.
     * @param [properties] Properties to set
     */
    constructor(properties?: IBallMove);

    /** BallMove id. */
    public id: string;

    /** BallMove p. */
    public p?: (IVec3|null);

    /** BallMove q. */
    public q?: (IVec3|null);

    /**
     * Creates a new BallMove instance using the specified properties.
     * @param [properties] Properties to set
     * @returns BallMove instance
     */
    public static create(properties?: IBallMove): BallMove;

    /**
     * Encodes the specified BallMove message. Does not implicitly {@link BallMove.verify|verify} messages.
     * @param message BallMove message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IBallMove, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a BallMove message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns BallMove
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): BallMove;
}

/** Properties of a GameBall. */
export interface IGameBall {

    /** GameBall id */
    id?: (number|null);

    /** GameBall position */
    position?: (IVec3|null);

    /** GameBall angle */
    angle?: (IVec4|null);

    /** GameBall body */
    body?: (IVec3|null);
}

/** Represents a GameBall. */
export class GameBall implements IGameBall {

    /**
     * Constructs a new GameBall.
     * @param [properties] Properties to set
     */
    constructor(properties?: IGameBall);

    /** GameBall id. */
    public id: number;

    /** GameBall position. */
    public position?: (IVec3|null);

    /** GameBall angle. */
    public angle?: (IVec4|null);

    /** GameBall body. */
    public body?: (IVec3|null);

    /**
     * Creates a new GameBall instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GameBall instance
     */
    public static create(properties?: IGameBall): GameBall;

    /**
     * Encodes the specified GameBall message. Does not implicitly {@link GameBall.verify|verify} messages.
     * @param message GameBall message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IGameBall, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a GameBall message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GameBall
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GameBall;
}

/** Properties of a Vec2. */
export interface IVec2 {

    /** Vec2 x */
    x?: (number|null);

    /** Vec2 y */
    y?: (number|null);
}

/** Represents a Vec2. */
export class Vec2 implements IVec2 {

    /**
     * Constructs a new Vec2.
     * @param [properties] Properties to set
     */
    constructor(properties?: IVec2);

    /** Vec2 x. */
    public x: number;

    /** Vec2 y. */
    public y: number;

    /**
     * Creates a new Vec2 instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Vec2 instance
     */
    public static create(properties?: IVec2): Vec2;

    /**
     * Encodes the specified Vec2 message. Does not implicitly {@link Vec2.verify|verify} messages.
     * @param message Vec2 message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IVec2, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Vec2 message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Vec2
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Vec2;
}

/** Properties of a Vec3. */
export interface IVec3 {

    /** Vec3 x */
    x?: (number|null);

    /** Vec3 y */
    y?: (number|null);

    /** Vec3 z */
    z?: (number|null);
}

/** Represents a Vec3. */
export class Vec3 implements IVec3 {

    /**
     * Constructs a new Vec3.
     * @param [properties] Properties to set
     */
    constructor(properties?: IVec3);

    /** Vec3 x. */
    public x: number;

    /** Vec3 y. */
    public y: number;

    /** Vec3 z. */
    public z: number;

    /**
     * Creates a new Vec3 instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Vec3 instance
     */
    public static create(properties?: IVec3): Vec3;

    /**
     * Encodes the specified Vec3 message. Does not implicitly {@link Vec3.verify|verify} messages.
     * @param message Vec3 message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IVec3, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Vec3 message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Vec3
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Vec3;
}

/** Properties of a Vec4. */
export interface IVec4 {

    /** Vec4 x */
    x?: (number|null);

    /** Vec4 y */
    y?: (number|null);

    /** Vec4 z */
    z?: (number|null);

    /** Vec4 w */
    w?: (number|null);
}

/** Represents a Vec4. */
export class Vec4 implements IVec4 {

    /**
     * Constructs a new Vec4.
     * @param [properties] Properties to set
     */
    constructor(properties?: IVec4);

    /** Vec4 x. */
    public x: number;

    /** Vec4 y. */
    public y: number;

    /** Vec4 z. */
    public z: number;

    /** Vec4 w. */
    public w: number;

    /**
     * Creates a new Vec4 instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Vec4 instance
     */
    public static create(properties?: IVec4): Vec4;

    /**
     * Encodes the specified Vec4 message. Does not implicitly {@link Vec4.verify|verify} messages.
     * @param message Vec4 message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IVec4, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Vec4 message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Vec4
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Vec4;
}

/** Properties of a GamePlayer. */
export interface IGamePlayer {

    /** GamePlayer id */
    id?: (number|null);

    /** GamePlayer nick */
    nick?: (string|null);

    /** GamePlayer head */
    head?: (string|null);

    /** GamePlayer roleId */
    roleId?: (number|null);

    /** GamePlayer changId */
    changId?: (number|null);

    /** GamePlayer cueId */
    cueId?: (number|null);

    /** GamePlayer balls */
    balls?: (number[]|null);

    /** GamePlayer cards */
    cards?: (number[]|null);

    /** GamePlayer winNum */
    winNum?: (number|null);

    /** GamePlayer foul */
    foul?: (number|null);

    /** GamePlayer manyCue */
    manyCue?: (number|null);

    /** GamePlayer exp */
    exp?: (number|null);
}

/** Represents a GamePlayer. */
export class GamePlayer implements IGamePlayer {

    /**
     * Constructs a new GamePlayer.
     * @param [properties] Properties to set
     */
    constructor(properties?: IGamePlayer);

    /** GamePlayer id. */
    public id: number;

    /** GamePlayer nick. */
    public nick: string;

    /** GamePlayer head. */
    public head: string;

    /** GamePlayer roleId. */
    public roleId: number;

    /** GamePlayer changId. */
    public changId: number;

    /** GamePlayer cueId. */
    public cueId: number;

    /** GamePlayer balls. */
    public balls: number[];

    /** GamePlayer cards. */
    public cards: number[];

    /** GamePlayer winNum. */
    public winNum: number;

    /** GamePlayer foul. */
    public foul: number;

    /** GamePlayer manyCue. */
    public manyCue: number;

    /** GamePlayer exp. */
    public exp: number;

    /**
     * Creates a new GamePlayer instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GamePlayer instance
     */
    public static create(properties?: IGamePlayer): GamePlayer;

    /**
     * Encodes the specified GamePlayer message. Does not implicitly {@link GamePlayer.verify|verify} messages.
     * @param message GamePlayer message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IGamePlayer, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a GamePlayer message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GamePlayer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GamePlayer;
}

/** Properties of a MatchPlayer. */
export interface IMatchPlayer {

    /** MatchPlayer id */
    id?: (number|null);

    /** MatchPlayer head */
    head?: (string|null);

    /** MatchPlayer nick */
    nick?: (string|null);
}

/** Represents a MatchPlayer. */
export class MatchPlayer implements IMatchPlayer {

    /**
     * Constructs a new MatchPlayer.
     * @param [properties] Properties to set
     */
    constructor(properties?: IMatchPlayer);

    /** MatchPlayer id. */
    public id: number;

    /** MatchPlayer head. */
    public head: string;

    /** MatchPlayer nick. */
    public nick: string;

    /**
     * Creates a new MatchPlayer instance using the specified properties.
     * @param [properties] Properties to set
     * @returns MatchPlayer instance
     */
    public static create(properties?: IMatchPlayer): MatchPlayer;

    /**
     * Encodes the specified MatchPlayer message. Does not implicitly {@link MatchPlayer.verify|verify} messages.
     * @param message MatchPlayer message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IMatchPlayer, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a MatchPlayer message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns MatchPlayer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MatchPlayer;
}

/** Properties of a GameSettlePlayer. */
export interface IGameSettlePlayer {

    /** GameSettlePlayer id */
    id?: (number|null);

    /** GameSettlePlayer exp */
    exp?: (number|null);

    /** GameSettlePlayer moneyType */
    moneyType?: (number|null);

    /** GameSettlePlayer money */
    money?: (number|null);

    /** GameSettlePlayer head */
    head?: (string|null);

    /** GameSettlePlayer nick */
    nick?: (string|null);

    /** GameSettlePlayer cards */
    cards?: (number[]|null);

    /** GameSettlePlayer needCards */
    needCards?: (number[]|null);
}

/** Represents a GameSettlePlayer. */
export class GameSettlePlayer implements IGameSettlePlayer {

    /**
     * Constructs a new GameSettlePlayer.
     * @param [properties] Properties to set
     */
    constructor(properties?: IGameSettlePlayer);

    /** GameSettlePlayer id. */
    public id: number;

    /** GameSettlePlayer exp. */
    public exp: number;

    /** GameSettlePlayer moneyType. */
    public moneyType: number;

    /** GameSettlePlayer money. */
    public money: number;

    /** GameSettlePlayer head. */
    public head: string;

    /** GameSettlePlayer nick. */
    public nick: string;

    /** GameSettlePlayer cards. */
    public cards: number[];

    /** GameSettlePlayer needCards. */
    public needCards: number[];

    /**
     * Creates a new GameSettlePlayer instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GameSettlePlayer instance
     */
    public static create(properties?: IGameSettlePlayer): GameSettlePlayer;

    /**
     * Encodes the specified GameSettlePlayer message. Does not implicitly {@link GameSettlePlayer.verify|verify} messages.
     * @param message GameSettlePlayer message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IGameSettlePlayer, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a GameSettlePlayer message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GameSettlePlayer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GameSettlePlayer;
}

/** Properties of a PlayerCue. */
export interface IPlayerCue {

    /** PlayerCue id */
    id?: (number|null);

    /** PlayerCue playerID */
    playerID?: (number|null);

    /** PlayerCue cueID */
    cueID?: (number|null);

    /** PlayerCue grade */
    grade?: (number|null);

    /** PlayerCue damageTime */
    damageTime?: (number|null);

    /** PlayerCue isUse */
    isUse?: (number|null);

    /** PlayerCue defendTimes */
    defendTimes?: (number|null);

    /** PlayerCue defendDay */
    defendDay?: (number|null);
}

/** Represents a PlayerCue. */
export class PlayerCue implements IPlayerCue {

    /**
     * Constructs a new PlayerCue.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPlayerCue);

    /** PlayerCue id. */
    public id: number;

    /** PlayerCue playerID. */
    public playerID: number;

    /** PlayerCue cueID. */
    public cueID: number;

    /** PlayerCue grade. */
    public grade: number;

    /** PlayerCue damageTime. */
    public damageTime: number;

    /** PlayerCue isUse. */
    public isUse: number;

    /** PlayerCue defendTimes. */
    public defendTimes: number;

    /** PlayerCue defendDay. */
    public defendDay: number;

    /**
     * Creates a new PlayerCue instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PlayerCue instance
     */
    public static create(properties?: IPlayerCue): PlayerCue;

    /**
     * Encodes the specified PlayerCue message. Does not implicitly {@link PlayerCue.verify|verify} messages.
     * @param message PlayerCue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPlayerCue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PlayerCue message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PlayerCue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PlayerCue;
}

/** Properties of a LotteryItem. */
export interface ILotteryItem {

    /** LotteryItem id */
    id?: (number|null);

    /** LotteryItem num */
    num?: (number|null);

    /** LotteryItem grade */
    grade?: (number|null);
}

/** Represents a LotteryItem. */
export class LotteryItem implements ILotteryItem {

    /**
     * Constructs a new LotteryItem.
     * @param [properties] Properties to set
     */
    constructor(properties?: ILotteryItem);

    /** LotteryItem id. */
    public id: number;

    /** LotteryItem num. */
    public num: number;

    /** LotteryItem grade. */
    public grade: number;

    /**
     * Creates a new LotteryItem instance using the specified properties.
     * @param [properties] Properties to set
     * @returns LotteryItem instance
     */
    public static create(properties?: ILotteryItem): LotteryItem;

    /**
     * Encodes the specified LotteryItem message. Does not implicitly {@link LotteryItem.verify|verify} messages.
     * @param message LotteryItem message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ILotteryItem, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a LotteryItem message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns LotteryItem
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): LotteryItem;
}

/** Properties of an Item. */
export interface IItem {

    /** Item id */
    id?: (number|null);

    /** Item num */
    num?: (number|null);
}

/** Represents an Item. */
export class Item implements IItem {

    /**
     * Constructs a new Item.
     * @param [properties] Properties to set
     */
    constructor(properties?: IItem);

    /** Item id. */
    public id: number;

    /** Item num. */
    public num: number;

    /**
     * Creates a new Item instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Item instance
     */
    public static create(properties?: IItem): Item;

    /**
     * Encodes the specified Item message. Does not implicitly {@link Item.verify|verify} messages.
     * @param message Item message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IItem, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Item message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Item
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Item;
}

/** Properties of a Role. */
export interface IRole {

    /** Role id */
    id?: (number|null);

    /** Role roleId */
    roleId?: (number|null);

    /** Role playerId */
    playerId?: (number|null);

    /** Role isUse */
    isUse?: (number|null);

    /** Role exp */
    exp?: (number|null);
}

/** Represents a Role. */
export class Role implements IRole {

    /**
     * Constructs a new Role.
     * @param [properties] Properties to set
     */
    constructor(properties?: IRole);

    /** Role id. */
    public id: number;

    /** Role roleId. */
    public roleId: number;

    /** Role playerId. */
    public playerId: number;

    /** Role isUse. */
    public isUse: number;

    /** Role exp. */
    public exp: number;

    /**
     * Creates a new Role instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Role instance
     */
    public static create(properties?: IRole): Role;

    /**
     * Encodes the specified Role message. Does not implicitly {@link Role.verify|verify} messages.
     * @param message Role message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IRole, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Role message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Role
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Role;
}

/** Properties of a GameTime. */
export interface IGameTime {

    /** GameTime chang */
    chang?: (number|null);

    /** GameTime times */
    times?: (number|null);
}

/** Represents a GameTime. */
export class GameTime implements IGameTime {

    /**
     * Constructs a new GameTime.
     * @param [properties] Properties to set
     */
    constructor(properties?: IGameTime);

    /** GameTime chang. */
    public chang: number;

    /** GameTime times. */
    public times: number;

    /**
     * Creates a new GameTime instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GameTime instance
     */
    public static create(properties?: IGameTime): GameTime;

    /**
     * Encodes the specified GameTime message. Does not implicitly {@link GameTime.verify|verify} messages.
     * @param message GameTime message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IGameTime, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a GameTime message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GameTime
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GameTime;
}

/** Properties of a C2S_NoviceGuideMatch. */
export interface IC2S_NoviceGuideMatch {

    /** C2S_NoviceGuideMatch gameId */
    gameId?: (number|null);

    /** C2S_NoviceGuideMatch changId */
    changId?: (number|null);

    /** C2S_NoviceGuideMatch moneyId */
    moneyId?: (number|null);
}

/** Represents a C2S_NoviceGuideMatch. */
export class C2S_NoviceGuideMatch implements IC2S_NoviceGuideMatch {

    /**
     * Constructs a new C2S_NoviceGuideMatch.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_NoviceGuideMatch);

    /** C2S_NoviceGuideMatch gameId. */
    public gameId: number;

    /** C2S_NoviceGuideMatch changId. */
    public changId: number;

    /** C2S_NoviceGuideMatch moneyId. */
    public moneyId: number;

    /**
     * Creates a new C2S_NoviceGuideMatch instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_NoviceGuideMatch instance
     */
    public static create(properties?: IC2S_NoviceGuideMatch): C2S_NoviceGuideMatch;

    /**
     * Encodes the specified C2S_NoviceGuideMatch message. Does not implicitly {@link C2S_NoviceGuideMatch.verify|verify} messages.
     * @param message C2S_NoviceGuideMatch message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_NoviceGuideMatch, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_NoviceGuideMatch message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_NoviceGuideMatch
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_NoviceGuideMatch;
}

/** Properties of a C2S_NoviceGuideLottery. */
export interface IC2S_NoviceGuideLottery {

    /** C2S_NoviceGuideLottery chang */
    chang?: (number|null);
}

/** Represents a C2S_NoviceGuideLottery. */
export class C2S_NoviceGuideLottery implements IC2S_NoviceGuideLottery {

    /**
     * Constructs a new C2S_NoviceGuideLottery.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_NoviceGuideLottery);

    /** C2S_NoviceGuideLottery chang. */
    public chang: number;

    /**
     * Creates a new C2S_NoviceGuideLottery instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_NoviceGuideLottery instance
     */
    public static create(properties?: IC2S_NoviceGuideLottery): C2S_NoviceGuideLottery;

    /**
     * Encodes the specified C2S_NoviceGuideLottery message. Does not implicitly {@link C2S_NoviceGuideLottery.verify|verify} messages.
     * @param message C2S_NoviceGuideLottery message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_NoviceGuideLottery, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_NoviceGuideLottery message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_NoviceGuideLottery
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_NoviceGuideLottery;
}

/** Properties of a C2S_Login. */
export interface IC2S_Login {

    /** C2S_Login loginType */
    loginType?: (number|null);

    /** C2S_Login code */
    code?: (string|null);

    /** C2S_Login origin */
    origin?: (string|null);

    /** C2S_Login device */
    device?: (number|null);

    /** C2S_Login parentId */
    parentId?: (number|null);
}

/** 登录协议Start */
export class C2S_Login implements IC2S_Login {

    /**
     * Constructs a new C2S_Login.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_Login);

    /** C2S_Login loginType. */
    public loginType: number;

    /** C2S_Login code. */
    public code: string;

    /** C2S_Login origin. */
    public origin: string;

    /** C2S_Login device. */
    public device: number;

    /** C2S_Login parentId. */
    public parentId: number;

    /**
     * Creates a new C2S_Login instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_Login instance
     */
    public static create(properties?: IC2S_Login): C2S_Login;

    /**
     * Encodes the specified C2S_Login message. Does not implicitly {@link C2S_Login.verify|verify} messages.
     * @param message C2S_Login message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_Login, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_Login message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_Login
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_Login;
}

/** Properties of a S2C_Login. */
export interface IS2C_Login {

    /** S2C_Login id */
    id?: (number|null);

    /** S2C_Login nick */
    nick?: (string|null);

    /** S2C_Login head */
    head?: (string|null);

    /** S2C_Login gold */
    gold?: (number|null);

    /** S2C_Login diamond */
    diamond?: (number|null);

    /** S2C_Login level */
    level?: (number|null);

    /** S2C_Login levelExp */
    levelExp?: (number|null);

    /** S2C_Login levelNeedExp */
    levelNeedExp?: (number|null);

    /** S2C_Login token */
    token?: (string|null);

    /** S2C_Login redPacket */
    redPacket?: (number|null);

    /** S2C_Login nociveGuideNum */
    nociveGuideNum?: (string|null);
}

/** Represents a S2C_Login. */
export class S2C_Login implements IS2C_Login {

    /**
     * Constructs a new S2C_Login.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_Login);

    /** S2C_Login id. */
    public id: number;

    /** S2C_Login nick. */
    public nick: string;

    /** S2C_Login head. */
    public head: string;

    /** S2C_Login gold. */
    public gold: number;

    /** S2C_Login diamond. */
    public diamond: number;

    /** S2C_Login level. */
    public level: number;

    /** S2C_Login levelExp. */
    public levelExp: number;

    /** S2C_Login levelNeedExp. */
    public levelNeedExp: number;

    /** S2C_Login token. */
    public token: string;

    /** S2C_Login redPacket. */
    public redPacket: number;

    /** S2C_Login nociveGuideNum. */
    public nociveGuideNum: string;

    /**
     * Creates a new S2C_Login instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_Login instance
     */
    public static create(properties?: IS2C_Login): S2C_Login;

    /**
     * Encodes the specified S2C_Login message. Does not implicitly {@link S2C_Login.verify|verify} messages.
     * @param message S2C_Login message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_Login, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_Login message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_Login
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_Login;
}

/** Properties of a C2S_Heart. */
export interface IC2S_Heart {

    /** C2S_Heart sequence */
    sequence?: (number|null);
}

/** Represents a C2S_Heart. */
export class C2S_Heart implements IC2S_Heart {

    /**
     * Constructs a new C2S_Heart.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_Heart);

    /** C2S_Heart sequence. */
    public sequence: number;

    /**
     * Creates a new C2S_Heart instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_Heart instance
     */
    public static create(properties?: IC2S_Heart): C2S_Heart;

    /**
     * Encodes the specified C2S_Heart message. Does not implicitly {@link C2S_Heart.verify|verify} messages.
     * @param message C2S_Heart message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_Heart, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_Heart message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_Heart
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_Heart;
}

/** Properties of a S2C_UpdateGold. */
export interface IS2C_UpdateGold {

    /** S2C_UpdateGold id */
    id?: (number|null);

    /** S2C_UpdateGold gold */
    gold?: (number|null);
}

/** Represents a S2C_UpdateGold. */
export class S2C_UpdateGold implements IS2C_UpdateGold {

    /**
     * Constructs a new S2C_UpdateGold.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_UpdateGold);

    /** S2C_UpdateGold id. */
    public id: number;

    /** S2C_UpdateGold gold. */
    public gold: number;

    /**
     * Creates a new S2C_UpdateGold instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_UpdateGold instance
     */
    public static create(properties?: IS2C_UpdateGold): S2C_UpdateGold;

    /**
     * Encodes the specified S2C_UpdateGold message. Does not implicitly {@link S2C_UpdateGold.verify|verify} messages.
     * @param message S2C_UpdateGold message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_UpdateGold, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_UpdateGold message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_UpdateGold
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_UpdateGold;
}

/** Properties of a S2C_UpdateDiamond. */
export interface IS2C_UpdateDiamond {

    /** S2C_UpdateDiamond id */
    id?: (number|null);

    /** S2C_UpdateDiamond diamond */
    diamond?: (number|null);
}

/** Represents a S2C_UpdateDiamond. */
export class S2C_UpdateDiamond implements IS2C_UpdateDiamond {

    /**
     * Constructs a new S2C_UpdateDiamond.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_UpdateDiamond);

    /** S2C_UpdateDiamond id. */
    public id: number;

    /** S2C_UpdateDiamond diamond. */
    public diamond: number;

    /**
     * Creates a new S2C_UpdateDiamond instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_UpdateDiamond instance
     */
    public static create(properties?: IS2C_UpdateDiamond): S2C_UpdateDiamond;

    /**
     * Encodes the specified S2C_UpdateDiamond message. Does not implicitly {@link S2C_UpdateDiamond.verify|verify} messages.
     * @param message S2C_UpdateDiamond message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_UpdateDiamond, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_UpdateDiamond message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_UpdateDiamond
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_UpdateDiamond;
}

/** Properties of a S2C_UpdateRedPacket. */
export interface IS2C_UpdateRedPacket {

    /** S2C_UpdateRedPacket id */
    id?: (number|null);

    /** S2C_UpdateRedPacket redPacket */
    redPacket?: (number|null);
}

/** Represents a S2C_UpdateRedPacket. */
export class S2C_UpdateRedPacket implements IS2C_UpdateRedPacket {

    /**
     * Constructs a new S2C_UpdateRedPacket.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_UpdateRedPacket);

    /** S2C_UpdateRedPacket id. */
    public id: number;

    /** S2C_UpdateRedPacket redPacket. */
    public redPacket: number;

    /**
     * Creates a new S2C_UpdateRedPacket instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_UpdateRedPacket instance
     */
    public static create(properties?: IS2C_UpdateRedPacket): S2C_UpdateRedPacket;

    /**
     * Encodes the specified S2C_UpdateRedPacket message. Does not implicitly {@link S2C_UpdateRedPacket.verify|verify} messages.
     * @param message S2C_UpdateRedPacket message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_UpdateRedPacket, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_UpdateRedPacket message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_UpdateRedPacket
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_UpdateRedPacket;
}

/** Properties of a C2S_GetTask. */
export interface IC2S_GetTask {

    /** C2S_GetTask taskType */
    taskType?: (number|null);
}

/** 任务系统相关协议Start */
export class C2S_GetTask implements IC2S_GetTask {

    /**
     * Constructs a new C2S_GetTask.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_GetTask);

    /** C2S_GetTask taskType. */
    public taskType: number;

    /**
     * Creates a new C2S_GetTask instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_GetTask instance
     */
    public static create(properties?: IC2S_GetTask): C2S_GetTask;

    /**
     * Encodes the specified C2S_GetTask message. Does not implicitly {@link C2S_GetTask.verify|verify} messages.
     * @param message C2S_GetTask message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_GetTask, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_GetTask message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_GetTask
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_GetTask;
}

/** Properties of a C2S_GetTaskReward. */
export interface IC2S_GetTaskReward {

    /** C2S_GetTaskReward id */
    id?: (number|null);
}

/** Represents a C2S_GetTaskReward. */
export class C2S_GetTaskReward implements IC2S_GetTaskReward {

    /**
     * Constructs a new C2S_GetTaskReward.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_GetTaskReward);

    /** C2S_GetTaskReward id. */
    public id: number;

    /**
     * Creates a new C2S_GetTaskReward instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_GetTaskReward instance
     */
    public static create(properties?: IC2S_GetTaskReward): C2S_GetTaskReward;

    /**
     * Encodes the specified C2S_GetTaskReward message. Does not implicitly {@link C2S_GetTaskReward.verify|verify} messages.
     * @param message C2S_GetTaskReward message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_GetTaskReward, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_GetTaskReward message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_GetTaskReward
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_GetTaskReward;
}

/** Properties of a C2S_GetActiveReward. */
export interface IC2S_GetActiveReward {

    /** C2S_GetActiveReward taskType */
    taskType?: (number|null);

    /** C2S_GetActiveReward active */
    active?: (number|null);
}

/** Represents a C2S_GetActiveReward. */
export class C2S_GetActiveReward implements IC2S_GetActiveReward {

    /**
     * Constructs a new C2S_GetActiveReward.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_GetActiveReward);

    /** C2S_GetActiveReward taskType. */
    public taskType: number;

    /** C2S_GetActiveReward active. */
    public active: number;

    /**
     * Creates a new C2S_GetActiveReward instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_GetActiveReward instance
     */
    public static create(properties?: IC2S_GetActiveReward): C2S_GetActiveReward;

    /**
     * Encodes the specified C2S_GetActiveReward message. Does not implicitly {@link C2S_GetActiveReward.verify|verify} messages.
     * @param message C2S_GetActiveReward message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_GetActiveReward, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_GetActiveReward message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_GetActiveReward
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_GetActiveReward;
}

/** Properties of a S2C_ActiveAward. */
export interface IS2C_ActiveAward {

    /** S2C_ActiveAward taskType */
    taskType?: (number|null);

    /** S2C_ActiveAward active */
    active?: (number|null);

    /** S2C_ActiveAward activeStatus */
    activeStatus?: (number|null);

    /** S2C_ActiveAward awards */
    awards?: (IAward[]|null);
}

/** Represents a S2C_ActiveAward. */
export class S2C_ActiveAward implements IS2C_ActiveAward {

    /**
     * Constructs a new S2C_ActiveAward.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_ActiveAward);

    /** S2C_ActiveAward taskType. */
    public taskType: number;

    /** S2C_ActiveAward active. */
    public active: number;

    /** S2C_ActiveAward activeStatus. */
    public activeStatus: number;

    /** S2C_ActiveAward awards. */
    public awards: IAward[];

    /**
     * Creates a new S2C_ActiveAward instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_ActiveAward instance
     */
    public static create(properties?: IS2C_ActiveAward): S2C_ActiveAward;

    /**
     * Encodes the specified S2C_ActiveAward message. Does not implicitly {@link S2C_ActiveAward.verify|verify} messages.
     * @param message S2C_ActiveAward message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_ActiveAward, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_ActiveAward message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_ActiveAward
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_ActiveAward;
}

/** Properties of a S2C_Award. */
export interface IS2C_Award {

    /** S2C_Award id */
    id?: (number|null);

    /** S2C_Award taskType */
    taskType?: (number|null);

    /** S2C_Award active */
    active?: (number|null);

    /** S2C_Award awards */
    awards?: (IAward[]|null);
}

/** Represents a S2C_Award. */
export class S2C_Award implements IS2C_Award {

    /**
     * Constructs a new S2C_Award.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_Award);

    /** S2C_Award id. */
    public id: number;

    /** S2C_Award taskType. */
    public taskType: number;

    /** S2C_Award active. */
    public active: number;

    /** S2C_Award awards. */
    public awards: IAward[];

    /**
     * Creates a new S2C_Award instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_Award instance
     */
    public static create(properties?: IS2C_Award): S2C_Award;

    /**
     * Encodes the specified S2C_Award message. Does not implicitly {@link S2C_Award.verify|verify} messages.
     * @param message S2C_Award message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_Award, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_Award message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_Award
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_Award;
}

/** Properties of a S2C_NewTask. */
export interface IS2C_NewTask {

    /** S2C_NewTask task */
    task?: (IPlayerTask|null);
}

/** Represents a S2C_NewTask. */
export class S2C_NewTask implements IS2C_NewTask {

    /**
     * Constructs a new S2C_NewTask.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_NewTask);

    /** S2C_NewTask task. */
    public task?: (IPlayerTask|null);

    /**
     * Creates a new S2C_NewTask instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_NewTask instance
     */
    public static create(properties?: IS2C_NewTask): S2C_NewTask;

    /**
     * Encodes the specified S2C_NewTask message. Does not implicitly {@link S2C_NewTask.verify|verify} messages.
     * @param message S2C_NewTask message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_NewTask, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_NewTask message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_NewTask
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_NewTask;
}

/** Properties of a S2C_Task. */
export interface IS2C_Task {

    /** S2C_Task id */
    id?: (number|null);

    /** S2C_Task active */
    active?: (number|null);

    /** S2C_Task activeStatus */
    activeStatus?: (number|null);

    /** S2C_Task tasks */
    tasks?: (IPlayerTask[]|null);
}

/** Represents a S2C_Task. */
export class S2C_Task implements IS2C_Task {

    /**
     * Constructs a new S2C_Task.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_Task);

    /** S2C_Task id. */
    public id: number;

    /** S2C_Task active. */
    public active: number;

    /** S2C_Task activeStatus. */
    public activeStatus: number;

    /** S2C_Task tasks. */
    public tasks: IPlayerTask[];

    /**
     * Creates a new S2C_Task instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_Task instance
     */
    public static create(properties?: IS2C_Task): S2C_Task;

    /**
     * Encodes the specified S2C_Task message. Does not implicitly {@link S2C_Task.verify|verify} messages.
     * @param message S2C_Task message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_Task, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_Task message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_Task
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_Task;
}

/** Properties of a S2C_UpdateTask. */
export interface IS2C_UpdateTask {

    /** S2C_UpdateTask id */
    id?: (number|null);

    /** S2C_UpdateTask task */
    task?: (IPlayerTask|null);
}

/** Represents a S2C_UpdateTask. */
export class S2C_UpdateTask implements IS2C_UpdateTask {

    /**
     * Constructs a new S2C_UpdateTask.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_UpdateTask);

    /** S2C_UpdateTask id. */
    public id: number;

    /** S2C_UpdateTask task. */
    public task?: (IPlayerTask|null);

    /**
     * Creates a new S2C_UpdateTask instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_UpdateTask instance
     */
    public static create(properties?: IS2C_UpdateTask): S2C_UpdateTask;

    /**
     * Encodes the specified S2C_UpdateTask message. Does not implicitly {@link S2C_UpdateTask.verify|verify} messages.
     * @param message S2C_UpdateTask message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_UpdateTask, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_UpdateTask message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_UpdateTask
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_UpdateTask;
}

/** Properties of a PlayerTask. */
export interface IPlayerTask {

    /** PlayerTask id */
    id?: (number|null);

    /** PlayerTask taskId */
    taskId?: (number|null);

    /** PlayerTask taskType */
    taskType?: (number|null);

    /** PlayerTask state */
    state?: (number|null);

    /** PlayerTask conditions */
    conditions?: (ITaskCondition[]|null);
}

/** Represents a PlayerTask. */
export class PlayerTask implements IPlayerTask {

    /**
     * Constructs a new PlayerTask.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPlayerTask);

    /** PlayerTask id. */
    public id: number;

    /** PlayerTask taskId. */
    public taskId: number;

    /** PlayerTask taskType. */
    public taskType: number;

    /** PlayerTask state. */
    public state: number;

    /** PlayerTask conditions. */
    public conditions: ITaskCondition[];

    /**
     * Creates a new PlayerTask instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PlayerTask instance
     */
    public static create(properties?: IPlayerTask): PlayerTask;

    /**
     * Encodes the specified PlayerTask message. Does not implicitly {@link PlayerTask.verify|verify} messages.
     * @param message PlayerTask message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPlayerTask, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PlayerTask message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PlayerTask
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PlayerTask;
}

/** Properties of a TaskCondition. */
export interface ITaskCondition {

    /** TaskCondition conditionId */
    conditionId?: (number|null);

    /** TaskCondition progress */
    progress?: (number|null);

    /** TaskCondition totalProgress */
    totalProgress?: (number|null);
}

/** Represents a TaskCondition. */
export class TaskCondition implements ITaskCondition {

    /**
     * Constructs a new TaskCondition.
     * @param [properties] Properties to set
     */
    constructor(properties?: ITaskCondition);

    /** TaskCondition conditionId. */
    public conditionId: number;

    /** TaskCondition progress. */
    public progress: number;

    /** TaskCondition totalProgress. */
    public totalProgress: number;

    /**
     * Creates a new TaskCondition instance using the specified properties.
     * @param [properties] Properties to set
     * @returns TaskCondition instance
     */
    public static create(properties?: ITaskCondition): TaskCondition;

    /**
     * Encodes the specified TaskCondition message. Does not implicitly {@link TaskCondition.verify|verify} messages.
     * @param message TaskCondition message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ITaskCondition, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a TaskCondition message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns TaskCondition
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): TaskCondition;
}

/** Properties of an Award. */
export interface IAward {

    /** Award id */
    id?: (number|null);

    /** Award num */
    num?: (number|null);
}

/** Represents an Award. */
export class Award implements IAward {

    /**
     * Constructs a new Award.
     * @param [properties] Properties to set
     */
    constructor(properties?: IAward);

    /** Award id. */
    public id: number;

    /** Award num. */
    public num: number;

    /**
     * Creates a new Award instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Award instance
     */
    public static create(properties?: IAward): Award;

    /**
     * Encodes the specified Award message. Does not implicitly {@link Award.verify|verify} messages.
     * @param message Award message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IAward, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Award message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Award
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Award;
}

/** Properties of a C2S_Member_Award. */
export interface IC2S_Member_Award {

    /** C2S_Member_Award level */
    level?: (number|null);
}

/** 会员协议Start */
export class C2S_Member_Award implements IC2S_Member_Award {

    /**
     * Constructs a new C2S_Member_Award.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_Member_Award);

    /** C2S_Member_Award level. */
    public level: number;

    /**
     * Creates a new C2S_Member_Award instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_Member_Award instance
     */
    public static create(properties?: IC2S_Member_Award): C2S_Member_Award;

    /**
     * Encodes the specified C2S_Member_Award message. Does not implicitly {@link C2S_Member_Award.verify|verify} messages.
     * @param message C2S_Member_Award message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_Member_Award, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_Member_Award message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_Member_Award
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_Member_Award;
}

/** Properties of a S2C_Member_Award. */
export interface IS2C_Member_Award {

    /** S2C_Member_Award dayGift */
    dayGift?: (number|null);

    /** S2C_Member_Award award */
    award?: (IAward[]|null);
}

/** Represents a S2C_Member_Award. */
export class S2C_Member_Award implements IS2C_Member_Award {

    /**
     * Constructs a new S2C_Member_Award.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_Member_Award);

    /** S2C_Member_Award dayGift. */
    public dayGift: number;

    /** S2C_Member_Award award. */
    public award: IAward[];

    /**
     * Creates a new S2C_Member_Award instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_Member_Award instance
     */
    public static create(properties?: IS2C_Member_Award): S2C_Member_Award;

    /**
     * Encodes the specified S2C_Member_Award message. Does not implicitly {@link S2C_Member_Award.verify|verify} messages.
     * @param message S2C_Member_Award message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_Member_Award, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_Member_Award message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_Member_Award
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_Member_Award;
}

/** Properties of a S2C_Member_Upgrade. */
export interface IS2C_Member_Upgrade {

    /** S2C_Member_Upgrade points */
    points?: (number|null);
}

/** Represents a S2C_Member_Upgrade. */
export class S2C_Member_Upgrade implements IS2C_Member_Upgrade {

    /**
     * Constructs a new S2C_Member_Upgrade.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_Member_Upgrade);

    /** S2C_Member_Upgrade points. */
    public points: number;

    /**
     * Creates a new S2C_Member_Upgrade instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_Member_Upgrade instance
     */
    public static create(properties?: IS2C_Member_Upgrade): S2C_Member_Upgrade;

    /**
     * Encodes the specified S2C_Member_Upgrade message. Does not implicitly {@link S2C_Member_Upgrade.verify|verify} messages.
     * @param message S2C_Member_Upgrade message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_Member_Upgrade, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_Member_Upgrade message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_Member_Upgrade
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_Member_Upgrade;
}

/** Properties of a S2C_Member_info. */
export interface IS2C_Member_info {

    /** S2C_Member_info points */
    points?: (number|null);

    /** S2C_Member_info dayGift */
    dayGift?: (number|null);

    /** S2C_Member_info levelGift */
    levelGift?: (number|null);
}

/** Represents a S2C_Member_info. */
export class S2C_Member_info implements IS2C_Member_info {

    /**
     * Constructs a new S2C_Member_info.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_Member_info);

    /** S2C_Member_info points. */
    public points: number;

    /** S2C_Member_info dayGift. */
    public dayGift: number;

    /** S2C_Member_info levelGift. */
    public levelGift: number;

    /**
     * Creates a new S2C_Member_info instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_Member_info instance
     */
    public static create(properties?: IS2C_Member_info): S2C_Member_info;

    /**
     * Encodes the specified S2C_Member_info message. Does not implicitly {@link S2C_Member_info.verify|verify} messages.
     * @param message S2C_Member_info message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_Member_info, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_Member_info message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_Member_info
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_Member_info;
}

/** Properties of a C2S_Member_Level. */
export interface IC2S_Member_Level {

    /** C2S_Member_Level level */
    level?: (number|null);
}

/** Represents a C2S_Member_Level. */
export class C2S_Member_Level implements IC2S_Member_Level {

    /**
     * Constructs a new C2S_Member_Level.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_Member_Level);

    /** C2S_Member_Level level. */
    public level: number;

    /**
     * Creates a new C2S_Member_Level instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_Member_Level instance
     */
    public static create(properties?: IC2S_Member_Level): C2S_Member_Level;

    /**
     * Encodes the specified C2S_Member_Level message. Does not implicitly {@link C2S_Member_Level.verify|verify} messages.
     * @param message C2S_Member_Level message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_Member_Level, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_Member_Level message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_Member_Level
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_Member_Level;
}

/** Properties of a S2C_Member_Level. */
export interface IS2C_Member_Level {

    /** S2C_Member_Level levelGift */
    levelGift?: (number|null);

    /** S2C_Member_Level award */
    award?: (IAward[]|null);
}

/** Represents a S2C_Member_Level. */
export class S2C_Member_Level implements IS2C_Member_Level {

    /**
     * Constructs a new S2C_Member_Level.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_Member_Level);

    /** S2C_Member_Level levelGift. */
    public levelGift: number;

    /** S2C_Member_Level award. */
    public award: IAward[];

    /**
     * Creates a new S2C_Member_Level instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_Member_Level instance
     */
    public static create(properties?: IS2C_Member_Level): S2C_Member_Level;

    /**
     * Encodes the specified S2C_Member_Level message. Does not implicitly {@link S2C_Member_Level.verify|verify} messages.
     * @param message S2C_Member_Level message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_Member_Level, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_Member_Level message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_Member_Level
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_Member_Level;
}

/** Properties of a C2S_DrawLottery. */
export interface IC2S_DrawLottery {

    /** C2S_DrawLottery chang */
    chang?: (number|null);
}

/** 红包墙协议Start */
export class C2S_DrawLottery implements IC2S_DrawLottery {

    /**
     * Constructs a new C2S_DrawLottery.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_DrawLottery);

    /** C2S_DrawLottery chang. */
    public chang: number;

    /**
     * Creates a new C2S_DrawLottery instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_DrawLottery instance
     */
    public static create(properties?: IC2S_DrawLottery): C2S_DrawLottery;

    /**
     * Encodes the specified C2S_DrawLottery message. Does not implicitly {@link C2S_DrawLottery.verify|verify} messages.
     * @param message C2S_DrawLottery message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_DrawLottery, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_DrawLottery message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_DrawLottery
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_DrawLottery;
}

/** Properties of a C2S_GetRedPacket. */
export interface IC2S_GetRedPacket {

    /** C2S_GetRedPacket redPackets */
    redPackets?: (IRedPacket[]|null);
}

/** Represents a C2S_GetRedPacket. */
export class C2S_GetRedPacket implements IC2S_GetRedPacket {

    /**
     * Constructs a new C2S_GetRedPacket.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_GetRedPacket);

    /** C2S_GetRedPacket redPackets. */
    public redPackets: IRedPacket[];

    /**
     * Creates a new C2S_GetRedPacket instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_GetRedPacket instance
     */
    public static create(properties?: IC2S_GetRedPacket): C2S_GetRedPacket;

    /**
     * Encodes the specified C2S_GetRedPacket message. Does not implicitly {@link C2S_GetRedPacket.verify|verify} messages.
     * @param message C2S_GetRedPacket message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_GetRedPacket, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_GetRedPacket message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_GetRedPacket
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_GetRedPacket;
}

/** Properties of a S2C_AddRedPacket. */
export interface IS2C_AddRedPacket {

    /** S2C_AddRedPacket redPacket */
    redPacket?: (IRedPacket|null);
}

/** Represents a S2C_AddRedPacket. */
export class S2C_AddRedPacket implements IS2C_AddRedPacket {

    /**
     * Constructs a new S2C_AddRedPacket.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_AddRedPacket);

    /** S2C_AddRedPacket redPacket. */
    public redPacket?: (IRedPacket|null);

    /**
     * Creates a new S2C_AddRedPacket instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_AddRedPacket instance
     */
    public static create(properties?: IS2C_AddRedPacket): S2C_AddRedPacket;

    /**
     * Encodes the specified S2C_AddRedPacket message. Does not implicitly {@link S2C_AddRedPacket.verify|verify} messages.
     * @param message S2C_AddRedPacket message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_AddRedPacket, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_AddRedPacket message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_AddRedPacket
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_AddRedPacket;
}

/** Properties of a RedPacket. */
export interface IRedPacket {

    /** RedPacket id */
    id?: (number|null);

    /** RedPacket nick */
    nick?: (string|null);

    /** RedPacket vip */
    vip?: (number|null);

    /** RedPacket num */
    num?: (number|null);

    /** RedPacket time */
    time?: (number|null);
}

/** Represents a RedPacket. */
export class RedPacket implements IRedPacket {

    /**
     * Constructs a new RedPacket.
     * @param [properties] Properties to set
     */
    constructor(properties?: IRedPacket);

    /** RedPacket id. */
    public id: number;

    /** RedPacket nick. */
    public nick: string;

    /** RedPacket vip. */
    public vip: number;

    /** RedPacket num. */
    public num: number;

    /** RedPacket time. */
    public time: number;

    /**
     * Creates a new RedPacket instance using the specified properties.
     * @param [properties] Properties to set
     * @returns RedPacket instance
     */
    public static create(properties?: IRedPacket): RedPacket;

    /**
     * Encodes the specified RedPacket message. Does not implicitly {@link RedPacket.verify|verify} messages.
     * @param message RedPacket message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IRedPacket, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a RedPacket message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns RedPacket
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): RedPacket;
}

/** Properties of a C2S_GetMail. */
export interface IC2S_GetMail {

    /** C2S_GetMail mails */
    mails?: (IMail[]|null);
}

/** 邮件协议Start */
export class C2S_GetMail implements IC2S_GetMail {

    /**
     * Constructs a new C2S_GetMail.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_GetMail);

    /** C2S_GetMail mails. */
    public mails: IMail[];

    /**
     * Creates a new C2S_GetMail instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_GetMail instance
     */
    public static create(properties?: IC2S_GetMail): C2S_GetMail;

    /**
     * Encodes the specified C2S_GetMail message. Does not implicitly {@link C2S_GetMail.verify|verify} messages.
     * @param message C2S_GetMail message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_GetMail, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_GetMail message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_GetMail
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_GetMail;
}

/** Properties of a C2S_MailAward. */
export interface IC2S_MailAward {

    /** C2S_MailAward mailId */
    mailId?: (number|null);
}

/** Represents a C2S_MailAward. */
export class C2S_MailAward implements IC2S_MailAward {

    /**
     * Constructs a new C2S_MailAward.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_MailAward);

    /** C2S_MailAward mailId. */
    public mailId: number;

    /**
     * Creates a new C2S_MailAward instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_MailAward instance
     */
    public static create(properties?: IC2S_MailAward): C2S_MailAward;

    /**
     * Encodes the specified C2S_MailAward message. Does not implicitly {@link C2S_MailAward.verify|verify} messages.
     * @param message C2S_MailAward message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_MailAward, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_MailAward message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_MailAward
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_MailAward;
}

/** Properties of a S2C_NewMail. */
export interface IS2C_NewMail {

    /** S2C_NewMail mail */
    mail?: (IMail|null);
}

/** Represents a S2C_NewMail. */
export class S2C_NewMail implements IS2C_NewMail {

    /**
     * Constructs a new S2C_NewMail.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_NewMail);

    /** S2C_NewMail mail. */
    public mail?: (IMail|null);

    /**
     * Creates a new S2C_NewMail instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_NewMail instance
     */
    public static create(properties?: IS2C_NewMail): S2C_NewMail;

    /**
     * Encodes the specified S2C_NewMail message. Does not implicitly {@link S2C_NewMail.verify|verify} messages.
     * @param message S2C_NewMail message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_NewMail, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_NewMail message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_NewMail
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_NewMail;
}

/** Properties of a Mail. */
export interface IMail {

    /** Mail mailId */
    mailId?: (number|null);

    /** Mail title */
    title?: (string|null);

    /** Mail content */
    content?: (string|null);

    /** Mail mailState */
    mailState?: (number|null);

    /** Mail time */
    time?: (number|null);

    /** Mail awards */
    awards?: (IAward[]|null);
}

/** Represents a Mail. */
export class Mail implements IMail {

    /**
     * Constructs a new Mail.
     * @param [properties] Properties to set
     */
    constructor(properties?: IMail);

    /** Mail mailId. */
    public mailId: number;

    /** Mail title. */
    public title: string;

    /** Mail content. */
    public content: string;

    /** Mail mailState. */
    public mailState: number;

    /** Mail time. */
    public time: number;

    /** Mail awards. */
    public awards: IAward[];

    /**
     * Creates a new Mail instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Mail instance
     */
    public static create(properties?: IMail): Mail;

    /**
     * Encodes the specified Mail message. Does not implicitly {@link Mail.verify|verify} messages.
     * @param message Mail message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IMail, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Mail message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Mail
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Mail;
}

/** Properties of a C2S_SignInfo. */
export interface IC2S_SignInfo {
}

/** 签到协议Start */
export class C2S_SignInfo implements IC2S_SignInfo {

    /**
     * Constructs a new C2S_SignInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_SignInfo);

    /**
     * Creates a new C2S_SignInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_SignInfo instance
     */
    public static create(properties?: IC2S_SignInfo): C2S_SignInfo;

    /**
     * Encodes the specified C2S_SignInfo message. Does not implicitly {@link C2S_SignInfo.verify|verify} messages.
     * @param message C2S_SignInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_SignInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_SignInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_SignInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_SignInfo;
}

/** Properties of a S2C_SignIfo. */
export interface IS2C_SignIfo {

    /** S2C_SignIfo signDayCount */
    signDayCount?: (number|null);

    /** S2C_SignIfo signStatus */
    signStatus?: (boolean|null);

    /** S2C_SignIfo awards */
    awards?: (IsignAward[]|null);
}

/** Represents a S2C_SignIfo. */
export class S2C_SignIfo implements IS2C_SignIfo {

    /**
     * Constructs a new S2C_SignIfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_SignIfo);

    /** S2C_SignIfo signDayCount. */
    public signDayCount: number;

    /** S2C_SignIfo signStatus. */
    public signStatus: boolean;

    /** S2C_SignIfo awards. */
    public awards: IsignAward[];

    /**
     * Creates a new S2C_SignIfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_SignIfo instance
     */
    public static create(properties?: IS2C_SignIfo): S2C_SignIfo;

    /**
     * Encodes the specified S2C_SignIfo message. Does not implicitly {@link S2C_SignIfo.verify|verify} messages.
     * @param message S2C_SignIfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_SignIfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_SignIfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_SignIfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_SignIfo;
}

/** Properties of a C2S_Sign. */
export interface IC2S_Sign {
}

/** Represents a C2S_Sign. */
export class C2S_Sign implements IC2S_Sign {

    /**
     * Constructs a new C2S_Sign.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_Sign);

    /**
     * Creates a new C2S_Sign instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_Sign instance
     */
    public static create(properties?: IC2S_Sign): C2S_Sign;

    /**
     * Encodes the specified C2S_Sign message. Does not implicitly {@link C2S_Sign.verify|verify} messages.
     * @param message C2S_Sign message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_Sign, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_Sign message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_Sign
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_Sign;
}

/** Properties of a S2C_Sign. */
export interface IS2C_Sign {

    /** S2C_Sign awards */
    awards?: (IAward[]|null);
}

/** Represents a S2C_Sign. */
export class S2C_Sign implements IS2C_Sign {

    /**
     * Constructs a new S2C_Sign.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_Sign);

    /** S2C_Sign awards. */
    public awards: IAward[];

    /**
     * Creates a new S2C_Sign instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_Sign instance
     */
    public static create(properties?: IS2C_Sign): S2C_Sign;

    /**
     * Encodes the specified S2C_Sign message. Does not implicitly {@link S2C_Sign.verify|verify} messages.
     * @param message S2C_Sign message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_Sign, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_Sign message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_Sign
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_Sign;
}

/** Properties of a signAward. */
export interface IsignAward {

    /** signAward signDay */
    signDay?: (number|null);

    /** signAward gold */
    gold?: (number|null);

    /** signAward diamond */
    diamond?: (number|null);

    /** signAward awards */
    awards?: (IAward[]|null);
}

/** Represents a signAward. */
export class signAward implements IsignAward {

    /**
     * Constructs a new signAward.
     * @param [properties] Properties to set
     */
    constructor(properties?: IsignAward);

    /** signAward signDay. */
    public signDay: number;

    /** signAward gold. */
    public gold: number;

    /** signAward diamond. */
    public diamond: number;

    /** signAward awards. */
    public awards: IAward[];

    /**
     * Creates a new signAward instance using the specified properties.
     * @param [properties] Properties to set
     * @returns signAward instance
     */
    public static create(properties?: IsignAward): signAward;

    /**
     * Encodes the specified signAward message. Does not implicitly {@link signAward.verify|verify} messages.
     * @param message signAward message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IsignAward, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a signAward message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns signAward
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signAward;
}

/** Properties of a C2S_PayInfo. */
export interface IC2S_PayInfo {
}

/** 支付Start */
export class C2S_PayInfo implements IC2S_PayInfo {

    /**
     * Constructs a new C2S_PayInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_PayInfo);

    /**
     * Creates a new C2S_PayInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_PayInfo instance
     */
    public static create(properties?: IC2S_PayInfo): C2S_PayInfo;

    /**
     * Encodes the specified C2S_PayInfo message. Does not implicitly {@link C2S_PayInfo.verify|verify} messages.
     * @param message C2S_PayInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_PayInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_PayInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_PayInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_PayInfo;
}

/** Properties of a S2C_PayInfo. */
export interface IS2C_PayInfo {

    /** S2C_PayInfo payInfo */
    payInfo?: (IPayInfo[]|null);
}

/** Represents a S2C_PayInfo. */
export class S2C_PayInfo implements IS2C_PayInfo {

    /**
     * Constructs a new S2C_PayInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_PayInfo);

    /** S2C_PayInfo payInfo. */
    public payInfo: IPayInfo[];

    /**
     * Creates a new S2C_PayInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_PayInfo instance
     */
    public static create(properties?: IS2C_PayInfo): S2C_PayInfo;

    /**
     * Encodes the specified S2C_PayInfo message. Does not implicitly {@link S2C_PayInfo.verify|verify} messages.
     * @param message S2C_PayInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_PayInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_PayInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_PayInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_PayInfo;
}

/** Properties of a PayInfo. */
export interface IPayInfo {

    /** PayInfo payType */
    payType?: (number|null);

    /** PayInfo method */
    method?: (number|null);

    /** PayInfo preferred */
    preferred?: (boolean|null);
}

/** Represents a PayInfo. */
export class PayInfo implements IPayInfo {

    /**
     * Constructs a new PayInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPayInfo);

    /** PayInfo payType. */
    public payType: number;

    /** PayInfo method. */
    public method: number;

    /** PayInfo preferred. */
    public preferred: boolean;

    /**
     * Creates a new PayInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PayInfo instance
     */
    public static create(properties?: IPayInfo): PayInfo;

    /**
     * Encodes the specified PayInfo message. Does not implicitly {@link PayInfo.verify|verify} messages.
     * @param message PayInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPayInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PayInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PayInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PayInfo;
}

/** Properties of a C2S_BuyGoods. */
export interface IC2S_BuyGoods {

    /** C2S_BuyGoods id */
    id?: (number|null);

    /** C2S_BuyGoods payType */
    payType?: (number|null);
}

/** Represents a C2S_BuyGoods. */
export class C2S_BuyGoods implements IC2S_BuyGoods {

    /**
     * Constructs a new C2S_BuyGoods.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_BuyGoods);

    /** C2S_BuyGoods id. */
    public id: number;

    /** C2S_BuyGoods payType. */
    public payType: number;

    /**
     * Creates a new C2S_BuyGoods instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_BuyGoods instance
     */
    public static create(properties?: IC2S_BuyGoods): C2S_BuyGoods;

    /**
     * Encodes the specified C2S_BuyGoods message. Does not implicitly {@link C2S_BuyGoods.verify|verify} messages.
     * @param message C2S_BuyGoods message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_BuyGoods, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_BuyGoods message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_BuyGoods
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_BuyGoods;
}

/** Properties of a S2C_BuyGoods. */
export interface IS2C_BuyGoods {

    /** S2C_BuyGoods id */
    id?: (number|null);

    /** S2C_BuyGoods body */
    body?: (string|null);

    /** S2C_BuyGoods outTradeNo */
    outTradeNo?: (string|null);

    /** S2C_BuyGoods payType */
    payType?: (number|null);
}

/** Represents a S2C_BuyGoods. */
export class S2C_BuyGoods implements IS2C_BuyGoods {

    /**
     * Constructs a new S2C_BuyGoods.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_BuyGoods);

    /** S2C_BuyGoods id. */
    public id: number;

    /** S2C_BuyGoods body. */
    public body: string;

    /** S2C_BuyGoods outTradeNo. */
    public outTradeNo: string;

    /** S2C_BuyGoods payType. */
    public payType: number;

    /**
     * Creates a new S2C_BuyGoods instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_BuyGoods instance
     */
    public static create(properties?: IS2C_BuyGoods): S2C_BuyGoods;

    /**
     * Encodes the specified S2C_BuyGoods message. Does not implicitly {@link S2C_BuyGoods.verify|verify} messages.
     * @param message S2C_BuyGoods message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_BuyGoods, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_BuyGoods message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_BuyGoods
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_BuyGoods;
}

/** Properties of a S2C_BuyGoodsEnd. */
export interface IS2C_BuyGoodsEnd {

    /** S2C_BuyGoodsEnd id */
    id?: (number|null);
}

/** Represents a S2C_BuyGoodsEnd. */
export class S2C_BuyGoodsEnd implements IS2C_BuyGoodsEnd {

    /**
     * Constructs a new S2C_BuyGoodsEnd.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_BuyGoodsEnd);

    /** S2C_BuyGoodsEnd id. */
    public id: number;

    /**
     * Creates a new S2C_BuyGoodsEnd instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_BuyGoodsEnd instance
     */
    public static create(properties?: IS2C_BuyGoodsEnd): S2C_BuyGoodsEnd;

    /**
     * Encodes the specified S2C_BuyGoodsEnd message. Does not implicitly {@link S2C_BuyGoodsEnd.verify|verify} messages.
     * @param message S2C_BuyGoodsEnd message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_BuyGoodsEnd, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_BuyGoodsEnd message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_BuyGoodsEnd
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_BuyGoodsEnd;
}

/** Properties of a C2S_AliInfo. */
export interface IC2S_AliInfo {
}

/** 红包Start */
export class C2S_AliInfo implements IC2S_AliInfo {

    /**
     * Constructs a new C2S_AliInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_AliInfo);

    /**
     * Creates a new C2S_AliInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_AliInfo instance
     */
    public static create(properties?: IC2S_AliInfo): C2S_AliInfo;

    /**
     * Encodes the specified C2S_AliInfo message. Does not implicitly {@link C2S_AliInfo.verify|verify} messages.
     * @param message C2S_AliInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_AliInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_AliInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_AliInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_AliInfo;
}

/** Properties of a S2C_AliInfo. */
export interface IS2C_AliInfo {

    /** S2C_AliInfo aliInfo */
    aliInfo?: (IAliInfo[]|null);

    /** S2C_AliInfo phone */
    phone?: (number|null);
}

/** Represents a S2C_AliInfo. */
export class S2C_AliInfo implements IS2C_AliInfo {

    /**
     * Constructs a new S2C_AliInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_AliInfo);

    /** S2C_AliInfo aliInfo. */
    public aliInfo: IAliInfo[];

    /** S2C_AliInfo phone. */
    public phone: number;

    /**
     * Creates a new S2C_AliInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_AliInfo instance
     */
    public static create(properties?: IS2C_AliInfo): S2C_AliInfo;

    /**
     * Encodes the specified S2C_AliInfo message. Does not implicitly {@link S2C_AliInfo.verify|verify} messages.
     * @param message S2C_AliInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_AliInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_AliInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_AliInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_AliInfo;
}

/** Properties of an AliInfo. */
export interface IAliInfo {

    /** AliInfo aliAccount */
    aliAccount?: (string|null);

    /** AliInfo aliName */
    aliName?: (string|null);
}

/** Represents an AliInfo. */
export class AliInfo implements IAliInfo {

    /**
     * Constructs a new AliInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IAliInfo);

    /** AliInfo aliAccount. */
    public aliAccount: string;

    /** AliInfo aliName. */
    public aliName: string;

    /**
     * Creates a new AliInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns AliInfo instance
     */
    public static create(properties?: IAliInfo): AliInfo;

    /**
     * Encodes the specified AliInfo message. Does not implicitly {@link AliInfo.verify|verify} messages.
     * @param message AliInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IAliInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an AliInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns AliInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AliInfo;
}

/** Properties of a C2S_WxOpenIdInfo. */
export interface IC2S_WxOpenIdInfo {
}

/** Represents a C2S_WxOpenIdInfo. */
export class C2S_WxOpenIdInfo implements IC2S_WxOpenIdInfo {

    /**
     * Constructs a new C2S_WxOpenIdInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_WxOpenIdInfo);

    /**
     * Creates a new C2S_WxOpenIdInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_WxOpenIdInfo instance
     */
    public static create(properties?: IC2S_WxOpenIdInfo): C2S_WxOpenIdInfo;

    /**
     * Encodes the specified C2S_WxOpenIdInfo message. Does not implicitly {@link C2S_WxOpenIdInfo.verify|verify} messages.
     * @param message C2S_WxOpenIdInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_WxOpenIdInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_WxOpenIdInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_WxOpenIdInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_WxOpenIdInfo;
}

/** Properties of a S2C_WxOpenIdInfo. */
export interface IS2C_WxOpenIdInfo {

    /** S2C_WxOpenIdInfo subscribe */
    subscribe?: (number|null);

    /** S2C_WxOpenIdInfo phone */
    phone?: (string|null);
}

/** Represents a S2C_WxOpenIdInfo. */
export class S2C_WxOpenIdInfo implements IS2C_WxOpenIdInfo {

    /**
     * Constructs a new S2C_WxOpenIdInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_WxOpenIdInfo);

    /** S2C_WxOpenIdInfo subscribe. */
    public subscribe: number;

    /** S2C_WxOpenIdInfo phone. */
    public phone: string;

    /**
     * Creates a new S2C_WxOpenIdInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_WxOpenIdInfo instance
     */
    public static create(properties?: IS2C_WxOpenIdInfo): S2C_WxOpenIdInfo;

    /**
     * Encodes the specified S2C_WxOpenIdInfo message. Does not implicitly {@link S2C_WxOpenIdInfo.verify|verify} messages.
     * @param message S2C_WxOpenIdInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_WxOpenIdInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_WxOpenIdInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_WxOpenIdInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_WxOpenIdInfo;
}

/** Properties of a C2S_RedPackage. */
export interface IC2S_RedPackage {

    /** C2S_RedPackage id */
    id?: (number|null);

    /** C2S_RedPackage aliAccount */
    aliAccount?: (string|null);

    /** C2S_RedPackage aliName */
    aliName?: (string|null);
}

/** Represents a C2S_RedPackage. */
export class C2S_RedPackage implements IC2S_RedPackage {

    /**
     * Constructs a new C2S_RedPackage.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_RedPackage);

    /** C2S_RedPackage id. */
    public id: number;

    /** C2S_RedPackage aliAccount. */
    public aliAccount: string;

    /** C2S_RedPackage aliName. */
    public aliName: string;

    /**
     * Creates a new C2S_RedPackage instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_RedPackage instance
     */
    public static create(properties?: IC2S_RedPackage): C2S_RedPackage;

    /**
     * Encodes the specified C2S_RedPackage message. Does not implicitly {@link C2S_RedPackage.verify|verify} messages.
     * @param message C2S_RedPackage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_RedPackage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_RedPackage message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_RedPackage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_RedPackage;
}

/** Properties of a S2C_RedPackage. */
export interface IS2C_RedPackage {

    /** S2C_RedPackage id */
    id?: (number|null);
}

/** Represents a S2C_RedPackage. */
export class S2C_RedPackage implements IS2C_RedPackage {

    /**
     * Constructs a new S2C_RedPackage.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_RedPackage);

    /** S2C_RedPackage id. */
    public id: number;

    /**
     * Creates a new S2C_RedPackage instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_RedPackage instance
     */
    public static create(properties?: IS2C_RedPackage): S2C_RedPackage;

    /**
     * Encodes the specified S2C_RedPackage message. Does not implicitly {@link S2C_RedPackage.verify|verify} messages.
     * @param message S2C_RedPackage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_RedPackage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_RedPackage message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_RedPackage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_RedPackage;
}

/** Properties of a C2S_BingdingPhone. */
export interface IC2S_BingdingPhone {

    /** C2S_BingdingPhone phone */
    phone?: (string|null);
}

/** Represents a C2S_BingdingPhone. */
export class C2S_BingdingPhone implements IC2S_BingdingPhone {

    /**
     * Constructs a new C2S_BingdingPhone.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_BingdingPhone);

    /** C2S_BingdingPhone phone. */
    public phone: string;

    /**
     * Creates a new C2S_BingdingPhone instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_BingdingPhone instance
     */
    public static create(properties?: IC2S_BingdingPhone): C2S_BingdingPhone;

    /**
     * Encodes the specified C2S_BingdingPhone message. Does not implicitly {@link C2S_BingdingPhone.verify|verify} messages.
     * @param message C2S_BingdingPhone message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_BingdingPhone, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_BingdingPhone message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_BingdingPhone
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_BingdingPhone;
}

/** Properties of a C2S_PhoneCode. */
export interface IC2S_PhoneCode {

    /** C2S_PhoneCode poneCode */
    poneCode?: (string|null);
}

/** Represents a C2S_PhoneCode. */
export class C2S_PhoneCode implements IC2S_PhoneCode {

    /**
     * Constructs a new C2S_PhoneCode.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_PhoneCode);

    /** C2S_PhoneCode poneCode. */
    public poneCode: string;

    /**
     * Creates a new C2S_PhoneCode instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_PhoneCode instance
     */
    public static create(properties?: IC2S_PhoneCode): C2S_PhoneCode;

    /**
     * Encodes the specified C2S_PhoneCode message. Does not implicitly {@link C2S_PhoneCode.verify|verify} messages.
     * @param message C2S_PhoneCode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_PhoneCode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_PhoneCode message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_PhoneCode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_PhoneCode;
}

/** Properties of a S2C_PhoneCodeSuccess. */
export interface IS2C_PhoneCodeSuccess {

    /** S2C_PhoneCodeSuccess success */
    success?: (number|null);
}

/** Represents a S2C_PhoneCodeSuccess. */
export class S2C_PhoneCodeSuccess implements IS2C_PhoneCodeSuccess {

    /**
     * Constructs a new S2C_PhoneCodeSuccess.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_PhoneCodeSuccess);

    /** S2C_PhoneCodeSuccess success. */
    public success: number;

    /**
     * Creates a new S2C_PhoneCodeSuccess instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_PhoneCodeSuccess instance
     */
    public static create(properties?: IS2C_PhoneCodeSuccess): S2C_PhoneCodeSuccess;

    /**
     * Encodes the specified S2C_PhoneCodeSuccess message. Does not implicitly {@link S2C_PhoneCodeSuccess.verify|verify} messages.
     * @param message S2C_PhoneCodeSuccess message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_PhoneCodeSuccess, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_PhoneCodeSuccess message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_PhoneCodeSuccess
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_PhoneCodeSuccess;
}

/** Properties of a C2S_PushAuthentication. */
export interface IC2S_PushAuthentication {
}

/** 实名制Start */
export class C2S_PushAuthentication implements IC2S_PushAuthentication {

    /**
     * Constructs a new C2S_PushAuthentication.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_PushAuthentication);

    /**
     * Creates a new C2S_PushAuthentication instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_PushAuthentication instance
     */
    public static create(properties?: IC2S_PushAuthentication): C2S_PushAuthentication;

    /**
     * Encodes the specified C2S_PushAuthentication message. Does not implicitly {@link C2S_PushAuthentication.verify|verify} messages.
     * @param message C2S_PushAuthentication message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_PushAuthentication, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_PushAuthentication message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_PushAuthentication
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_PushAuthentication;
}

/** Properties of a S2C_PushAuthentication. */
export interface IS2C_PushAuthentication {

    /** S2C_PushAuthentication Authentication */
    Authentication?: (number|null);

    /** S2C_PushAuthentication firstCharge */
    firstCharge?: (number|null);

    /** S2C_PushAuthentication everyDayFirstCharge */
    everyDayFirstCharge?: (number|null);

    /** S2C_PushAuthentication monCard */
    monCard?: (number|null);

    /** S2C_PushAuthentication resurrection */
    resurrection?: (number|null);

    /** S2C_PushAuthentication monCardTime */
    monCardTime?: (number|null);

    /** S2C_PushAuthentication resurrectionTime */
    resurrectionTime?: (number|null);

    /** S2C_PushAuthentication weekCard */
    weekCard?: (number|null);

    /** S2C_PushAuthentication luckyRod */
    luckyRod?: (number|null);
}

/** Represents a S2C_PushAuthentication. */
export class S2C_PushAuthentication implements IS2C_PushAuthentication {

    /**
     * Constructs a new S2C_PushAuthentication.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_PushAuthentication);

    /** S2C_PushAuthentication Authentication. */
    public Authentication: number;

    /** S2C_PushAuthentication firstCharge. */
    public firstCharge: number;

    /** S2C_PushAuthentication everyDayFirstCharge. */
    public everyDayFirstCharge: number;

    /** S2C_PushAuthentication monCard. */
    public monCard: number;

    /** S2C_PushAuthentication resurrection. */
    public resurrection: number;

    /** S2C_PushAuthentication monCardTime. */
    public monCardTime: number;

    /** S2C_PushAuthentication resurrectionTime. */
    public resurrectionTime: number;

    /** S2C_PushAuthentication weekCard. */
    public weekCard: number;

    /** S2C_PushAuthentication luckyRod. */
    public luckyRod: number;

    /**
     * Creates a new S2C_PushAuthentication instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_PushAuthentication instance
     */
    public static create(properties?: IS2C_PushAuthentication): S2C_PushAuthentication;

    /**
     * Encodes the specified S2C_PushAuthentication message. Does not implicitly {@link S2C_PushAuthentication.verify|verify} messages.
     * @param message S2C_PushAuthentication message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_PushAuthentication, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_PushAuthentication message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_PushAuthentication
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_PushAuthentication;
}

/** Properties of a C2S_Authentication. */
export interface IC2S_Authentication {

    /** C2S_Authentication name */
    name?: (string|null);

    /** C2S_Authentication idCard */
    idCard?: (string|null);
}

/** Represents a C2S_Authentication. */
export class C2S_Authentication implements IC2S_Authentication {

    /**
     * Constructs a new C2S_Authentication.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_Authentication);

    /** C2S_Authentication name. */
    public name: string;

    /** C2S_Authentication idCard. */
    public idCard: string;

    /**
     * Creates a new C2S_Authentication instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_Authentication instance
     */
    public static create(properties?: IC2S_Authentication): C2S_Authentication;

    /**
     * Encodes the specified C2S_Authentication message. Does not implicitly {@link C2S_Authentication.verify|verify} messages.
     * @param message C2S_Authentication message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_Authentication, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_Authentication message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_Authentication
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_Authentication;
}

/** Properties of a S2C_Authentication. */
export interface IS2C_Authentication {

    /** S2C_Authentication success */
    success?: (number|null);
}

/** Represents a S2C_Authentication. */
export class S2C_Authentication implements IS2C_Authentication {

    /**
     * Constructs a new S2C_Authentication.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_Authentication);

    /** S2C_Authentication success. */
    public success: number;

    /**
     * Creates a new S2C_Authentication instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_Authentication instance
     */
    public static create(properties?: IS2C_Authentication): S2C_Authentication;

    /**
     * Encodes the specified S2C_Authentication message. Does not implicitly {@link S2C_Authentication.verify|verify} messages.
     * @param message S2C_Authentication message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_Authentication, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_Authentication message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_Authentication
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_Authentication;
}

/** Properties of a S2C_SystemNotice. */
export interface IS2C_SystemNotice {

    /** S2C_SystemNotice notices */
    notices?: (ISystemNotice[]|null);
}

/** 游戏公告Start */
export class S2C_SystemNotice implements IS2C_SystemNotice {

    /**
     * Constructs a new S2C_SystemNotice.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_SystemNotice);

    /** S2C_SystemNotice notices. */
    public notices: ISystemNotice[];

    /**
     * Creates a new S2C_SystemNotice instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_SystemNotice instance
     */
    public static create(properties?: IS2C_SystemNotice): S2C_SystemNotice;

    /**
     * Encodes the specified S2C_SystemNotice message. Does not implicitly {@link S2C_SystemNotice.verify|verify} messages.
     * @param message S2C_SystemNotice message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_SystemNotice, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_SystemNotice message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_SystemNotice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_SystemNotice;
}

/** Properties of a SystemNotice. */
export interface ISystemNotice {

    /** SystemNotice cnTitle */
    cnTitle?: (string|null);

    /** SystemNotice wyTitle */
    wyTitle?: (string|null);

    /** SystemNotice cnContent */
    cnContent?: (string|null);

    /** SystemNotice wyContent */
    wyContent?: (string|null);

    /** SystemNotice force */
    force?: (number|null);

    /** SystemNotice order */
    order?: (number|null);
}

/** Represents a SystemNotice. */
export class SystemNotice implements ISystemNotice {

    /**
     * Constructs a new SystemNotice.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISystemNotice);

    /** SystemNotice cnTitle. */
    public cnTitle: string;

    /** SystemNotice wyTitle. */
    public wyTitle: string;

    /** SystemNotice cnContent. */
    public cnContent: string;

    /** SystemNotice wyContent. */
    public wyContent: string;

    /** SystemNotice force. */
    public force: number;

    /** SystemNotice order. */
    public order: number;

    /**
     * Creates a new SystemNotice instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SystemNotice instance
     */
    public static create(properties?: ISystemNotice): SystemNotice;

    /**
     * Encodes the specified SystemNotice message. Does not implicitly {@link SystemNotice.verify|verify} messages.
     * @param message SystemNotice message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISystemNotice, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a SystemNotice message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SystemNotice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SystemNotice;
}

/** Properties of a S2C_SystemTip. */
export interface IS2C_SystemTip {

    /** S2C_SystemTip notices */
    notices?: (ISystemTip[]|null);
}

/** 系统公告Start */
export class S2C_SystemTip implements IS2C_SystemTip {

    /**
     * Constructs a new S2C_SystemTip.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_SystemTip);

    /** S2C_SystemTip notices. */
    public notices: ISystemTip[];

    /**
     * Creates a new S2C_SystemTip instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_SystemTip instance
     */
    public static create(properties?: IS2C_SystemTip): S2C_SystemTip;

    /**
     * Encodes the specified S2C_SystemTip message. Does not implicitly {@link S2C_SystemTip.verify|verify} messages.
     * @param message S2C_SystemTip message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_SystemTip, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_SystemTip message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_SystemTip
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_SystemTip;
}

/** Properties of a SystemTip. */
export interface ISystemTip {

    /** SystemTip cnTitle */
    cnTitle?: (string|null);

    /** SystemTip wyTitle */
    wyTitle?: (string|null);

    /** SystemTip cnContent */
    cnContent?: (string|null);

    /** SystemTip wyContent */
    wyContent?: (string|null);
}

/** Represents a SystemTip. */
export class SystemTip implements ISystemTip {

    /**
     * Constructs a new SystemTip.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISystemTip);

    /** SystemTip cnTitle. */
    public cnTitle: string;

    /** SystemTip wyTitle. */
    public wyTitle: string;

    /** SystemTip cnContent. */
    public cnContent: string;

    /** SystemTip wyContent. */
    public wyContent: string;

    /**
     * Creates a new SystemTip instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SystemTip instance
     */
    public static create(properties?: ISystemTip): SystemTip;

    /**
     * Encodes the specified SystemTip message. Does not implicitly {@link SystemTip.verify|verify} messages.
     * @param message SystemTip message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISystemTip, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a SystemTip message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SystemTip
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SystemTip;
}

/** Properties of a C2S_MonCardGiftBag. */
export interface IC2S_MonCardGiftBag {

    /** C2S_MonCardGiftBag goodsId */
    goodsId?: (number|null);
}

/** 礼包Start */
export class C2S_MonCardGiftBag implements IC2S_MonCardGiftBag {

    /**
     * Constructs a new C2S_MonCardGiftBag.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_MonCardGiftBag);

    /** C2S_MonCardGiftBag goodsId. */
    public goodsId: number;

    /**
     * Creates a new C2S_MonCardGiftBag instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_MonCardGiftBag instance
     */
    public static create(properties?: IC2S_MonCardGiftBag): C2S_MonCardGiftBag;

    /**
     * Encodes the specified C2S_MonCardGiftBag message. Does not implicitly {@link C2S_MonCardGiftBag.verify|verify} messages.
     * @param message C2S_MonCardGiftBag message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_MonCardGiftBag, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_MonCardGiftBag message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_MonCardGiftBag
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_MonCardGiftBag;
}

/** Properties of a S2C_MonCardGiftBag. */
export interface IS2C_MonCardGiftBag {

    /** S2C_MonCardGiftBag awards */
    awards?: (IAward[]|null);

    /** S2C_MonCardGiftBag goodsId */
    goodsId?: (number|null);
}

/** Represents a S2C_MonCardGiftBag. */
export class S2C_MonCardGiftBag implements IS2C_MonCardGiftBag {

    /**
     * Constructs a new S2C_MonCardGiftBag.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_MonCardGiftBag);

    /** S2C_MonCardGiftBag awards. */
    public awards: IAward[];

    /** S2C_MonCardGiftBag goodsId. */
    public goodsId: number;

    /**
     * Creates a new S2C_MonCardGiftBag instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_MonCardGiftBag instance
     */
    public static create(properties?: IS2C_MonCardGiftBag): S2C_MonCardGiftBag;

    /**
     * Encodes the specified S2C_MonCardGiftBag message. Does not implicitly {@link S2C_MonCardGiftBag.verify|verify} messages.
     * @param message S2C_MonCardGiftBag message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_MonCardGiftBag, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_MonCardGiftBag message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_MonCardGiftBag
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_MonCardGiftBag;
}

/** Properties of a C2S_ResurrectionNum. */
export interface IC2S_ResurrectionNum {

    /** C2S_ResurrectionNum roomNum */
    roomNum?: (number|null);
}

/** Represents a C2S_ResurrectionNum. */
export class C2S_ResurrectionNum implements IC2S_ResurrectionNum {

    /**
     * Constructs a new C2S_ResurrectionNum.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_ResurrectionNum);

    /** C2S_ResurrectionNum roomNum. */
    public roomNum: number;

    /**
     * Creates a new C2S_ResurrectionNum instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_ResurrectionNum instance
     */
    public static create(properties?: IC2S_ResurrectionNum): C2S_ResurrectionNum;

    /**
     * Encodes the specified C2S_ResurrectionNum message. Does not implicitly {@link C2S_ResurrectionNum.verify|verify} messages.
     * @param message C2S_ResurrectionNum message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_ResurrectionNum, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_ResurrectionNum message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_ResurrectionNum
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_ResurrectionNum;
}

/** Properties of a S2C_ResurrectionNum. */
export interface IS2C_ResurrectionNum {

    /** S2C_ResurrectionNum num */
    num?: (number|null);
}

/** Represents a S2C_ResurrectionNum. */
export class S2C_ResurrectionNum implements IS2C_ResurrectionNum {

    /**
     * Constructs a new S2C_ResurrectionNum.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_ResurrectionNum);

    /** S2C_ResurrectionNum num. */
    public num: number;

    /**
     * Creates a new S2C_ResurrectionNum instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_ResurrectionNum instance
     */
    public static create(properties?: IS2C_ResurrectionNum): S2C_ResurrectionNum;

    /**
     * Encodes the specified S2C_ResurrectionNum message. Does not implicitly {@link S2C_ResurrectionNum.verify|verify} messages.
     * @param message S2C_ResurrectionNum message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_ResurrectionNum, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_ResurrectionNum message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_ResurrectionNum
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_ResurrectionNum;
}

/** Properties of a C2S_ResurrectionGiftBag. */
export interface IC2S_ResurrectionGiftBag {

    /** C2S_ResurrectionGiftBag roomNum */
    roomNum?: (number|null);
}

/** Represents a C2S_ResurrectionGiftBag. */
export class C2S_ResurrectionGiftBag implements IC2S_ResurrectionGiftBag {

    /**
     * Constructs a new C2S_ResurrectionGiftBag.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_ResurrectionGiftBag);

    /** C2S_ResurrectionGiftBag roomNum. */
    public roomNum: number;

    /**
     * Creates a new C2S_ResurrectionGiftBag instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_ResurrectionGiftBag instance
     */
    public static create(properties?: IC2S_ResurrectionGiftBag): C2S_ResurrectionGiftBag;

    /**
     * Encodes the specified C2S_ResurrectionGiftBag message. Does not implicitly {@link C2S_ResurrectionGiftBag.verify|verify} messages.
     * @param message C2S_ResurrectionGiftBag message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_ResurrectionGiftBag, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_ResurrectionGiftBag message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_ResurrectionGiftBag
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_ResurrectionGiftBag;
}

/** Properties of a S2C_PushAward. */
export interface IS2C_PushAward {

    /** S2C_PushAward awards */
    awards?: (IAward[]|null);

    /** S2C_PushAward goodsId */
    goodsId?: (number|null);
}

/** Represents a S2C_PushAward. */
export class S2C_PushAward implements IS2C_PushAward {

    /**
     * Constructs a new S2C_PushAward.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS2C_PushAward);

    /** S2C_PushAward awards. */
    public awards: IAward[];

    /** S2C_PushAward goodsId. */
    public goodsId: number;

    /**
     * Creates a new S2C_PushAward instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S2C_PushAward instance
     */
    public static create(properties?: IS2C_PushAward): S2C_PushAward;

    /**
     * Encodes the specified S2C_PushAward message. Does not implicitly {@link S2C_PushAward.verify|verify} messages.
     * @param message S2C_PushAward message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS2C_PushAward, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a S2C_PushAward message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S2C_PushAward
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): S2C_PushAward;
}

/** Properties of a C2S_UpdateGuide. */
export interface IC2S_UpdateGuide {

    /** C2S_UpdateGuide num */
    num?: (string|null);
}

/** 新手引导start */
export class C2S_UpdateGuide implements IC2S_UpdateGuide {

    /**
     * Constructs a new C2S_UpdateGuide.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC2S_UpdateGuide);

    /** C2S_UpdateGuide num. */
    public num: string;

    /**
     * Creates a new C2S_UpdateGuide instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C2S_UpdateGuide instance
     */
    public static create(properties?: IC2S_UpdateGuide): C2S_UpdateGuide;

    /**
     * Encodes the specified C2S_UpdateGuide message. Does not implicitly {@link C2S_UpdateGuide.verify|verify} messages.
     * @param message C2S_UpdateGuide message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC2S_UpdateGuide, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a C2S_UpdateGuide message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C2S_UpdateGuide
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): C2S_UpdateGuide;
}
