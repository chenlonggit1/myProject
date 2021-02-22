# coding=utf-8
'''协议生成'''

import os
import glob
import shutil
import re
import sys

# env
PATH = os.getcwd()
LANGUAGE = sys.argv[1]
# LANGUAGE = "lua"
INPUT_ROOT = os.path.join(PATH, "proto")
OUTPUT_ROOT = os.path.join(PATH, "output/%s" % LANGUAGE)


def prepare():
    if not os.path.exists(OUTPUT_ROOT):
        os.makedirs(OUTPUT_ROOT)


def scan_protos(patterns, prefix=""):
    file_params = ""
    files = glob.glob(os.path.join(INPUT_ROOT, "*.proto"))
    for item in files:
        if contains(item, patterns):
            file_params += " %s%s" % (prefix, item)

    return file_params


def scan_seperated_protos(patterns, prefix=""):
    protos = []
    files = glob.glob(os.path.join(INPUT_ROOT, "*.proto"))
    for item in files:
        if contains(item, patterns):
            protos.append("%s%s" % (prefix, item))

    return protos


def make_sharp_params():
    params = "%s -o:%s" % (
        os.path.join(PATH, "protogen/protogen.exe"),
        os.path.join(OUTPUT_ROOT, "proto.cs"))

    protos = scan_protos("shared|server|client|monitor", " -i:")
    params += protos

    os.chdir(INPUT_ROOT)

    return params


def make_sharp_game_params():
    ret = []
    protos = scan_seperated_protos("game")
    for item in protos:
        params = "%s -o:%s.cs -i:%s" % (
            os.path.join(PATH, "protogen/protogen.exe"),
            os.path.join(OUTPUT_ROOT, os.path.basename(item).split(".")[0]),
            os.path.join(INPUT_ROOT, os.path.basename(item)))

        ret.append(params)

    os.chdir(INPUT_ROOT)
    return ret


def make_js_params():
    protos = scan_protos(".*")
    params = "%s/pbjs -t static-module -w commonjs -o %s %s" % (
        os.path.join(PATH, "../../code/monitor/node_modules/.bin"),
        os.path.join(OUTPUT_ROOT, "build.js"),
        protos)

    return params


def make_go_params():
    params = "%s --proto_path=%s  --go_out=%s" % (
        os.path.join(PATH, "protogen/protoc.exe"),
        INPUT_ROOT,
        OUTPUT_ROOT)

    protos = scan_protos("shared|server|client|monitor|game")
    params += protos

    return params


def make_lua_params():
    params = "%s --proto_path=%s  --plugin=protoc-gen-lua=%s --lua_out=%s " % (
        os.path.join(PATH, "gen-lua-plugin/protoc.exe"),
        INPUT_ROOT,
        os.path.join(PATH, 'gen-lua-plugin/protoc-gen-lua.bat'),
        OUTPUT_ROOT)

    protos = scan_protos(".*")
    params += protos

    return params


def make_cpp_params(pattern):
    params = "%s --proto_path=%s  --cpp_out=%s" % (
        os.path.join(PATH, "protogen/protoc.exe"),
        INPUT_ROOT,
        OUTPUT_ROOT)

    protos = scan_protos(pattern)
    params += protos

    return params


def build():
    '''
    编译
    '''
    prepare()

    params = []
    if LANGUAGE == "cpp":
        params.append(make_cpp_params("shared|server|client"))
    elif LANGUAGE == "lua":
        params.append(make_lua_params())
    elif LANGUAGE == "sharp":
        params.append(make_sharp_params())
        params.extend(make_sharp_game_params())
    elif LANGUAGE == "js":
        params.append(make_js_params())
    elif LANGUAGE == "go":
        params.append(make_go_params())

    for _, cmd in enumerate(params):
        print "PARAMS: ", cmd
        os.system(cmd)


def distribute():
    if LANGUAGE == "cpp":
        # 拷贝服务器协议
        do_distribute("plus/cluster/protocol/src",
                      "shared|server|client")
    # elif LANGUAGE == "lua":
    #    do_distribute(
    #        "ClientIO/Assets/_GameLobby/LobbyLua/Proto", "shared|client")
    elif LANGUAGE == "sharp":
        do_distribute("sharp/cluster/proto", "proto")
    # elif LANGUAGE == "js":
    #    do_distribute("monitor/common", "build")
    #    return


def do_distribute(tar_dir, pattern):
    copy(OUTPUT_ROOT,
         os.path.join(OUTPUT_ROOT, "../../../../code", tar_dir),
         pattern)


def copy(source_dir, dst_dir, pattern):
    '''
    拷贝
    '''
    for item in os.listdir(source_dir):
        if re.search(pattern, item) is None:
            continue

        source_path = os.path.join(source_dir, item)
        if os.path.isfile(source_path):
            shutil.copy(source_path, dst_dir)


def contains(path, pattern):
    '''
    path是否匹配pattern
    '''
    return re.search(pattern, path) != None


if __name__ == "__main__":
    print "Building ..."
    print "Language: %s Input: %s Output: %s" % (LANGUAGE, INPUT_ROOT, OUTPUT_ROOT)

    # 全部编译
    build()

    # 部署
    distribute()
