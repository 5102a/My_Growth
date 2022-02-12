#!/usr/bin/env sh
# 确保脚本抛出遇到的错误
set -e

rm -rf ./dist

npm i
ls node_modules/
gulp -v

exit 0