#!/usr/bin/env sh
# 确保脚本抛出遇到的错误
set -e

git add .
git commit -m 'deploy'

git push -f git@gitee.com:lc5102/My_Growth.git master
git push -f git@github.com:1015355299/My_Growth.git master

exit 0