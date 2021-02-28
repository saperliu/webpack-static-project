/* eslint-disable */
const webpack = require('webpack');
const path = require('path') ;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const pageConfig = require('./page.config.js');

class ChunksFromEntryPlugin {
  apply (compiler) {
      compiler.hooks.emit.tap('ChunksFromEntryPlugin', compilation => {
          compilation.hooks.htmlWebpackPluginAlterChunks.tap(
              'ChunksFromEntryPlugin',
              (_, { plugin }) => {
                  // takes entry name passed via HTMLWebpackPlugin's options
                  const entry = plugin.options.entry;
                  const entrypoint = compilation.entrypoints.get(entry);

                  return entrypoint.chunks.map(chunk =>
                      ({
                          names: chunk.name ? [chunk.name] : [],
                          files: chunk.files.slice(),
                          size: chunk.modulesSize(),
                          hash: chunk.hash
                      })
                  );
              }
          );
      });
  }
}

let webpackConfig = {
  mode: 'production',
  // 配置入口
  entry: {},
  devtool: "source-map",
  // 配置出口
  output: {
    path: path.join(__dirname, "./dist/"),
    filename: 'static/js/[name].[hash:10].js',
    publicPath: '/',
  },
  module: {
    rules: [
      // html中的img标签
      {
        test: /\.html$/,
        loader:'html-withimg-loader',
        include: [path.join(__dirname, "./src")],
        options: {
          limit: 10000,
          // min:false,
          min:true,
          name: 'static/img/[name].[hash:10].[ext]'
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   loader: 'eslint-loader',
      //   options: {
      //     // eslint options (if necessary)
      //     fix:true
      //   },
      // },
      // {
      //   test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      //   loader: 'file-loader',
      //   options: {
      //     limit: 10000,
      //     name: 'static/img/[name].[hash:7].[ext]'
      //   }
      // },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use:[{
          loader:'file-loader',
          options:{
            esModule:false,
            name: 'static/img/[name].[hash:10].[ext]'
          }
        }]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:10].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          limit: 10000,
          name: 'static/fonts/[name].[hash:10].[ext]'
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader',"postcss-loader"],
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader,'css-loader', 'less-loader',"postcss-loader"],
      },
    ]
  },
  plugins:[
    new ESLintPlugin(),
    new UglifyJsPlugin({
      sourceMap:true,
      parallel: true
    }),
    new MiniCssExtractPlugin({
     filename: 'static/css/[name].[hash:10].css'
    }),
    //设置每一次build之前先删除dist
    new CleanWebpackPlugin(
      {
          cleanOnceBeforeBuildPatterns: ['dist/*'],//匹配删除的文件
          root: __dirname,   //根目录
          verbose: true,    //开启在控制台输出信息
          dry: false     //启用删除文件
      }
    ),
    // new ChunksFromEntryPlugin(),
  ],
  optimization:{
    minimize: true,
    minimizer: [
      // `...`,
      new CssMinimizerPlugin({
        sourceMap: false,
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
    splitChunks: {
      chunks: "all",
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: false,
      cacheGroups: {
          vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10
          },
          // default: {
          //     minChunks: 2,
          //     priority: -20,
          //     reuseExistingChunk: true
          // },
          commons: {
            name: "commons",
            chunks: "initial",
            minChunks: 2
          }
      }
    }
  }
};

if(pageConfig && Array.isArray(pageConfig)){
  pageConfig.map(page => {
    webpackConfig.entry[page.name] = `./src/views/${page.jsEntry}`;
    webpackConfig.plugins.push(new HtmlWebpackPlugin({
      filename: path.join(__dirname,`/dist/${page.name}.html`),
      template: path.join(__dirname,`/src/views/${page.html}`),
      inject: true,
      entry: page.name,
      chunks: [page.name],
      inlineSource: '.(js|css)$',
      minify:false,
      chunksSortMode: 'auto'
    }))
  })
}

module.exports = webpackConfig;
