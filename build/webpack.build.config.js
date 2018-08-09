var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var StyleLintPlugin = require('stylelint-webpack-plugin')
// 百分比进度
const WebpackBar = require('webpackbar');

var webpackBaseConfig = require('./webpack.base.config.js');
var config = require('../config');
var pkg = require('../package.json');
var utils = require('./utils');

var env = config.build.env;
var isPro = env.NODE_ENV === '"production"';
var isDev = env.NODE_ENV === '"development"';
var dist = ''; // 生成的文件夹目录是可以配的，根据环境的不同生成的文件夹不同

var entry = {
  main: ['./src/index.js']
};

var plugins = [
  new WebpackBar({
    name: 'Client',
    color: '#41b883',
    compiledIn: false
  }),
  new StyleLintPlugin(),
  new webpack.DefinePlugin({
    ENV: JSON.stringify(env),
  }),
];

//设置 生成的文件夹目录

if (isDev) {
  dist = config.dev.dist;
} else {
  dist = config.build.dist;
}
// 注入内容
var oTime = new Date();
var oAllTime = oTime.getFullYear() + '-' + (oTime.getMonth()+1) + '-' + oTime.getDate() + ' ' + oTime.getHours() + ':' + oTime.getMinutes() + ':' + oTime.getSeconds();
plugins.push(new webpack.BannerPlugin('@ license 李梦龙\n@ version '+ pkg.version +'\n@ time '+ oAllTime));

if (isDev) {
  plugins.push(new webpack.HotModuleReplacementPlugin());

  var HtmlWebpackPlugin = require('html-webpack-plugin')
  plugins.push(new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'index.html',
    inject: 'head',
    hash: true,
    cache: true,
  }));
  // 复制静态资源
  var CopyWebpackPlugin = require('copy-webpack-plugin');
  plugins.push(
  new CopyWebpackPlugin([
    {
      from: path.resolve(__dirname, '../lib'),
      to: path.resolve(__dirname, '../' + dist),
      ignore: ['.*']
    }
  ]))
  // 插入热重载
  Object.keys(entry).forEach(function (name) {
    entry[name] = ['./build/dev-client'].concat(entry[name]);
  });
}

// 如果是开发
if (isPro) {
  // 压缩
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }));
}

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = merge(webpackBaseConfig, {
  entry: entry,
  devServer: {
    contentBase: [
      dist
    ],
    inline: true
  },
  output: {
    path: path.resolve(__dirname, '../'+dist),
    publicPath: '/'+ dist +'/',
    filename: utils.outname() + (isPro ? '.min' : '') +'.js',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    alias: {
      '@': resolve('src'),
    }
  },
  plugins: plugins
});
