#! /bin/bash
echo start

basepath=$(cd `dirname $0`; pwd)

echo $basepath

cd $basepath

pbjs -t json-module -w commonjs -o billiard_pb.js *.proto && pbjs -t static-module *.proto --keep-case --force-number --no-verify --no-convert --no-delimited | pbts -o billiard_pb.d.ts -

# 替换第3行中的export为declare
sed -i '3s/export/declare/g' billiard_pb.d.ts
# 删除第1行
sed -i '1d' billiard_pb.d.ts
# 删除第4行
sed -i '4d' billiard_pb.js
# 删除空行
sed -i /^\s*$/d billiard_pb.js
# 替换第三行的var为let，$protobuf为protobuf
sed -i '3s/var/let/g' billiard_pb.js
sed -i '3s/$protobuf/protobuf/g' billiard_pb.js
# 替换95行中的module.exports = $root;为scope["Gateway"] = $root;
sed -i '95s/module.exports = \$root;/scope\[\"Gateway\"\] = \$root.Gateway;/g' billiard_pb.js
# 在文件第2行插入; (function (scope) {
sed -i '2i\'$'\n; (function (scope) {\n' billiard_pb.js
# 在文件最后添加}(typeof window !== \"undefined\" ? window : (typeof global !== \"undefined\" ? global : this)));
sed -i '$a\'$'\n}(typeof window !== \"undefined\" ? window : (typeof global !== \"undefined\" ? global : this)));\n' billiard_pb.js

# 文件移动自己根据需要去配置就可以了
# mv ./4_pb.js ../../assets/Main/Framework/JSLib/billiard_pb.js
# mv ./pb.d.ts ../../assets/Main/Framework/Types/billiard_pb.d.ts

echo end