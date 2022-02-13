const { parallel, src, dest, series } = require('gulp')
const htmlmin = require('gulp-htmlmin')
const upload = require('gulp-qcloud-cos-upload')
const fs = require('fs')
const envConfig = require('dotenv').config()
console.log('envConfig', fs.readFileSync('./.env'))

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
  AppId: process.env.AppId || envConfig.parsed.AppId,
  // 配置腾讯云 COS 服务所需的 SecretId
  SecretId: process.env.SecretId || envConfig.parsed.SecretId,
  // 配置腾讯云 COS 服务所需的 SecretKey
  SecretKey: process.env.SecretKey || envConfig.parsed.SecretKey,
  // COS服务配置的存储桶名称
  Bucket: process.env.Bucket || envConfig.parsed.Bucket,
  // 地域名称
  Region: process.env.Region || envConfig.parsed.Region,
  // 前缀路径，所有文件上传到这个路径下
  prefix: process.env.prefix || envConfig.parsed.prefix,
}
console.log('cosConfig', cosConfig)
// 压缩html
function minifyHtml() {
  return src('dist/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('dist'))
}

// 上传到腾讯云存储
function uploads(path = 'dist') {
  const files = fs.readdirSync(path, {
    withFileTypes: true,
  })
  const hasDir = files.find((d) => d.isDirectory())
  if (hasDir) {
    return files
      .map((dir) => {
        const curPath = `${path}/${dir.name}`
        if (dir.isDirectory()) {
          return uploads(curPath)
        }
        return () =>
          src(`${curPath.replace(/dist\//, '')}`, {
            cwd: 'dist',
          }).pipe(upload(cosConfig))
      })
      .flat(Number.MAX_VALUE)
  } else {
    return () =>
      src(`${path.replace(/dist\//, '')}/*`, {
        cwd: 'dist',
      }).pipe(upload(cosConfig))
  }
}

exports.default = series(minifyHtml, parallel(...uploads()))
// exports.default = minifyHtml
