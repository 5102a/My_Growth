const path = require('path')

module.exports = (config) => {
  const NODE_ENV = process.env.NODE_ENV
  //判断是否是生产环境
  if (NODE_ENV === 'production') {
    return {
      output: {
        publicPath: 'https://docs.5102it.cn/docs',
      },
      resolve: {
        //配置路径别名
        alias: {
          '@public': path.resolve(__dirname, '../public'),
          '@docs': path.resolve(__dirname, '../../'),
        },
      },
    }
  } else {
    return {
      resolve: {
        //配置路径别名
        alias: {
          '@public': path.resolve(__dirname, '../public'),
          '@docs': path.resolve(__dirname, '../../'),
        },
      },
    }
  }
}
