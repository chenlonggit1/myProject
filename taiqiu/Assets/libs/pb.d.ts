declare namespace pb {

    /** Properties of a Heartbeat. */
    interface IHeartbeat {

        /** 服务器时间戳，单位到毫秒 */
        time?: (number|null);
    }

    /** 心跳消息 */
    class Heartbeat implements IHeartbeat {

        /**
         * Constructs a new Heartbeat.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IHeartbeat);

        /** 服务器时间戳，单位到毫秒 */
        public time: number;

        /**
         * Creates a new Heartbeat instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Heartbeat instance
         */
        public static create(properties?: pb.IHeartbeat): pb.Heartbeat;

        /**
         * Encodes the specified Heartbeat message. Does not implicitly {@link pb.Heartbeat.verify|verify} messages.
         * @param message Heartbeat message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IHeartbeat, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Heartbeat message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Heartbeat
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.Heartbeat;
    }

    /** Properties of a KickOff. */
    interface IKickOff {

        /** 原因码 */
        code?: (number|null);

        /** 踢下线的原因 */
        reason?: (string|null);
    }

    /** 服务器踢人下线 */
    class KickOff implements IKickOff {

        /**
         * Constructs a new KickOff.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IKickOff);

        /** 原因码 */
        public code: number;

        /** 踢下线的原因 */
        public reason: string;

        /**
         * Creates a new KickOff instance using the specified properties.
         * @param [properties] Properties to set
         * @returns KickOff instance
         */
        public static create(properties?: pb.IKickOff): pb.KickOff;

        /**
         * Encodes the specified KickOff message. Does not implicitly {@link pb.KickOff.verify|verify} messages.
         * @param message KickOff message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IKickOff, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a KickOff message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns KickOff
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.KickOff;
    }

    /** 服务类型 */
    enum ServiceType {
        UNKNOWNSERVICE = 0,
        GATEWAY = 1,
        PLATFORM = 2,
        LANDLORD = 3,
        CATCHFISH = 4,
        BILLIARD = 5
    }

    /** 网关消息号 */
    enum Cmd {
        UNKNOWNGATEWAYCMD = 0,
        Heartbeat = 1,
        KickOff = 2
    }

    /** Properties of a C2S. */
    interface IC2S {

        /** 服务器序列 */
        sid?: (number|null);

        /** 消息号（各个服独立的，跨服之间可以重复，同一个服内不可重复） */
        cid?: (number|null);

        /** 消息序号，用作客户端识别服务器响应 */
        sequence?: (number|null);

        /** 消息体数据 */
        body?: (Uint8Array|null);
    }

    /** 客户端向服务器发送消息 */
    class C2S implements IC2S {

        /**
         * Constructs a new C2S.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IC2S);

        /** 服务器序列 */
        public sid: number;

        /** 消息号（各个服独立的，跨服之间可以重复，同一个服内不可重复） */
        public cid: number;

        /** 消息序号，用作客户端识别服务器响应 */
        public sequence: number;

        /** 消息体数据 */
        public body: Uint8Array;

        /**
         * Creates a new C2S instance using the specified properties.
         * @param [properties] Properties to set
         * @returns C2S instance
         */
        public static create(properties?: pb.IC2S): pb.C2S;

        /**
         * Encodes the specified C2S message. Does not implicitly {@link pb.C2S.verify|verify} messages.
         * @param message C2S message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IC2S, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a C2S message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns C2S
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.C2S;
    }

    /** Properties of a S2C. */
    interface IS2C {

        /** 服务器序列 */
        sid?: (number|null);

        /** 消息号（各个服独立的，跨服之间可以重复，同一个服内不可重复） */
        cid?: (number|null);

        /** 消息序号，用作客户端识别服务器响应 */
        sequence?: (number|null);

        /** 响应结果，0是成功，1是请求超时（消息已发出），2是请求错误（消息未发出），大于100是服务器响应返回的错误 */
        code?: (number|null);

        /** 消息体数据 */
        body?: (Uint8Array|null);

        /** 错误信息 */
        errStr?: (string|null);
    }

    /** 服务端向客户端发送消息 */
    class S2C implements IS2C {

        /**
         * Constructs a new S2C.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IS2C);

        /** 服务器序列 */
        public sid: number;

        /** 消息号（各个服独立的，跨服之间可以重复，同一个服内不可重复） */
        public cid: number;

        /** 消息序号，用作客户端识别服务器响应 */
        public sequence: number;

        /** 响应结果，0是成功，1是请求超时（消息已发出），2是请求错误（消息未发出），大于100是服务器响应返回的错误 */
        public code: number;

        /** 消息体数据 */
        public body: Uint8Array;

        /** 错误信息 */
        public errStr: string;

        /**
         * Creates a new S2C instance using the specified properties.
         * @param [properties] Properties to set
         * @returns S2C instance
         */
        public static create(properties?: pb.IS2C): pb.S2C;

        /**
         * Encodes the specified S2C message. Does not implicitly {@link pb.S2C.verify|verify} messages.
         * @param message S2C message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IS2C, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a S2C message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns S2C
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.S2C;
    }
}
