#!/usr/bin/env sh
# 确保脚本抛出遇到的错误
set -e
gulp -v
# 生成静态文件
npm run build

# 压缩html
gulp

exit 0