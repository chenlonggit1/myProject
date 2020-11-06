/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
; (function (scope) {
; (function (scope) {
    "use strict";
        .addJSON({
            pb: {
                nested: {
                    Heartbeat: {
                        fields: {
                            time: {
                                type: "int64",
                                id: 1
                            }
                        }
                    },
                    KickOff: {
                        fields: {
                            code: {
                                type: "int32",
                                id: 1
                            },
                            reason: {
                                type: "string",
                                id: 2
                            }
                        }
                    },
                    ServiceType: {
                        values: {
                            UNKNOWNSERVICE: 0,
                            GATEWAY: 1,
                            PLATFORM: 2,
                            LANDLORD: 3,
                            CATCHFISH: 4,
                            BILLIARD: 5
                        }
                    },
                    Cmd: {
                        values: {
                            UNKNOWNGATEWAYCMD: 0,
                            Heartbeat: 1,
                            KickOff: 2
                        }
                    },
                    C2S: {
                        fields: {
                            sid: {
                                type: "int32",
                                id: 1
                            },
                            cid: {
                                type: "int32",
                                id: 2
                            },
                            sequence: {
                                type: "int32",
                                id: 3
                            },
                            body: {
                                type: "bytes",
                                id: 4
                            }
                        }
                    },
                    S2C: {
                        fields: {
                            sid: {
                                type: "int32",
                                id: 1
                            },
                            cid: {
                                type: "int32",
                                id: 2
                            },
                            sequence: {
                                type: "int32",
                                id: 3
                            },
                            code: {
                                type: "int32",
                                id: 4
                            },
                            body: {
                                type: "bytes",
                                id: 5
                            },
                            errStr: {
                                type: "string",
                                id: 6
                            }
                        }
                    }
                }
            }
        });
    scope["pb"] = $root.nested.pb;
}(typeof window !== "undefined" ? window : (typeof global !== "undefined" ? global : this)));
}(typeof window !== "undefined" ? window : (typeof global !== "undefined" ? global : this)));
