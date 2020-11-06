package com.kys.common.utility;

import java.util.HashMap;
import java.util.Map;

public class ObjectUtils {

    public static Map<Object, Object> map(Object... args) {
        Map<Object, Object> map = new HashMap<>();
        for (int i = 0; i < args.length; i += 2) {
            map.put(args[i], args[i + 1]);
        }
        return map;
    }
}
