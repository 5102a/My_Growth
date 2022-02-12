#!/usr/bin/env sh
# 确保脚本抛出遇到的错误
set -e

rm -rf ./dist

npm i

npm i gulp -g

exit 0