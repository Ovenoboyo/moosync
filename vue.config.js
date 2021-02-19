var webpack = require('webpack');

module.exports = {
  runtimeCompiler: true,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.browser': 'true'
      }),
    ],
    externals: {
      'better-sqlite3': 'commonjs better-sqlite3'
    }
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      disableMainProcessTypescript: false,
      mainProcessTypeChecking: true,
      externals: [
        'better-sqlite3'
      ]
    },
    autoRouting: {
      chunkNamePrefix: 'page-'
    }
  },
}
