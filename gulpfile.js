const { parallel, src, dest, series } = require('gulp')
const htmlmin = require('gulp-htmlmin')
const upload = require('gulp-qcloud-cos-upload')
require('dotenv').config()

const cosConfig = {
  // 日志是否呈现为cdn路径，默认为 ''，设为具体域名可以替换 cdn 域名。
  cdn: true,
  // 是否开启调试模式，默认为 false，调试模式下，报错时输出详细错误信息
  debug: false,
  // 是否在控制台打印上传日志，默认为 true
  log: true,
  // 是否允许文件覆盖，默认为 false
  overwrite: true,
  // 在腾讯云申请的 AppId
  AppId: process.env.AppId,
  // 配置腾讯云 COS 服务所需的 SecretId
  SecretId: process.env.SecretId,
  // 配置腾讯云 COS 服务所需的 SecretKey
  SecretKey: process.env.SecretKey,
  // COS服务配置的存储桶名称
  Bucket: process.env.Bucket,
  // 地域名称
  Region: process.env.Region,
  // 前缀路径，所有文件上传到这个路径下
  prefix: process.env.prefix,
}

// 压缩html
function minifyHtml() {
  return src('dist/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('dist'))
}

// 上传到腾讯云存储
function uploads(dir) {
  return dir.map((v, i) => {
    return () => {
      return src(`${v}/*`, {
        cwd: 'dist/',
      }).pipe(upload(cosConfig))
    }
  })
}

// exports.default = parallel(minifyHtml, ...uploads(['css', 'js', 'img']))
exports.default = minifyHtml
