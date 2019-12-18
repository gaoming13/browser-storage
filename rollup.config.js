const rollupPluginNodeResolve = require('rollup-plugin-node-resolve');
const rollupPluginCommonjs = require('rollup-plugin-commonjs');
const rollupPluginBabel = require('rollup-plugin-babel');

const conf = {
  input: 'src/index.js',
  output: [
    // UMD(GLOBAL+AMD+CommonJs)
    {
      name: 'browserStore',
      file: 'dist/browser-storage.js',
      format: 'umd',
    },
    // CommonJs
    {
      file: 'dist/browser-storage.common.js',
      format: 'cjs',
    },
    // ESM
    {
      file: 'dist/browser-storage.esm.js',
      format: 'esm',
    },
  ],
  plugins: [
    // 解析 node_modules 中的模块
    rollupPluginNodeResolve(),
    // 转换 CJS -> ESM
    rollupPluginCommonjs(),
    rollupPluginBabel({
      exclude: 'node_modules/**',
    }),
  ],
};

// 用于测试
if (process.env.NODE_ENV === 'test') {
  conf.output = [
    {
      name: 'browserStore',
      file: 'dist/browser-storage.istanbul.js',
      format: 'umd',
    },
  ];
}

module.exports = conf;
