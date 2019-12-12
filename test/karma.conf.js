module.exports = (config) => {
  config.set({
    // 浏览器中加载的文件列表(默认[])
    files: [
      '../dist/browser-store.istanbul.js',
      '../test/index.js'
    ],
    // 监视文件(默认true):若文件被改变,执行测试
    autoWatch: false,
    // 文件变更延迟多久执行测试(默认250ms)
    autoWatchBatchDelay: 300,
    // 执行测试后是否退出(默认false持续集成模式)
    singleRun: true,
    // 要启动和捕获的浏览器列表(默认[])
    browsers: [
      // 'Chrome', // karma-chrome-launcher
      // 'ChromeHeadless', // karma-chrome-launcher
      // 'ChromeCanary', // 金丝雀每日构建版,依赖:karma-chrome-launcher
      // 'PhantomJS', // 依赖:karma-phantomjs-launcher
      'Firefox', // 依赖:karma-firefox-launcher
      // 'Opera', // 依赖:karma-opera-launcher
      // 'IE', // 依赖:karma-ie-launcher
      // 'Safari', // 依赖:karma-safari-launcher
    ],
    // 测试框架列表(默认[])
    frameworks: [
      'mocha', // karma-mocha
      'chai', // karma-chai
    ],
    // 报告者(默认['progress'])
    reporters: [
      'mocha', // karma-mocha-reporter
      'coverage-istanbul', // karma-coverage-istanbul-reporter
    ],
    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly', 'text-summary'],
      // 调试
      // verbose: true,
    },
  })
}