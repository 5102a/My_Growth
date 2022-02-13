#!/usr/bin/env sh
# 确保脚本抛出遇到的错误
set -e

rm -rf ./dist

npm i

npm i gulp -g

gulp -v

# # 生成静态文件
npm run build

# 压缩html，上传资源到cdn
gulp

exit 0