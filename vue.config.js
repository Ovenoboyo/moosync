var webpack = require('webpack');

module.exports = {
  runtimeCompiler: true,
  pages: {
    index: 'src/main.ts',
    worker: 'src/worker/main.js'
  },
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
      disableMainProcessTypescript: false, // Manually disable typescript plugin for main process. Enable if you want to use regular js for the main process (src/background.js by default).
      mainProcessTypeChecking: false, // Manually enable type checking during webpack bundling for background file.
      externals: ['better-sqlite3']
    },
  },
}
