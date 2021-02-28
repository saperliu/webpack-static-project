/* eslint-disable */
const webpack = require('webpack');
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const pageConfig = require('./page.config.js');

let webpackConfig = {
    mode: 'none',
    // 配置入口
    entry: {},
    // 配置出口
    output: {
        path: path.join(__dirname, "./dist/"),
        filename: 'static/js/[name].[hash:7].js',
        publicPath: '/',
    },
    module: {
        rules: [
            // html中的img标签
            {
                test: /\.html$/,
                loader: 'html-withimg-loader',
                include: [path.join(__dirname, "./src")],
                options: {
                    limit: 10000,
                    name: 'static/img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [path.join(__dirname, "./src")]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use:[{
                    loader:'file-loader',
                    options:{
                        esModule:false,
                        name: 'static/img/[name].[hash:7].[ext]'
                    }
                }]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'file-loader',
                options: {
                    limit: 10000,
                    name: 'static/media/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'file-loader',
                options: {
                    limit: 10000,
                    name: 'static/fonts/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader,'css-loader', "postcss-loader"],

            },
            {
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader,'css-loader', 'less-loader', "postcss-loader"],
            },
        ]
    },
    plugins: [
        new ESLintPlugin(),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[hash:7].css'
        }),
        //设置每一次build之前先删除dist
        new CleanWebpackPlugin(
            {
                cleanOnceBeforeBuildPatterns: ['dist/*'],//匹配删除的文件
                root: __dirname,   //根目录
                verbose: true,    //开启在控制台输出信息
                dry: false     //启用删除文件
            }
        )
    ],
    // 起本地服务
    devServer: {
        contentBase: "./dist/",
        historyApiFallback: true,
        inline: true,
        hot: true,
        host: 'localhost',
        port: 9001,
        open: true
    }
};

if (pageConfig && Array.isArray(pageConfig)) {
    pageConfig.map(page => {
        webpackConfig.entry[page.name] = `./src/views/${page.jsEntry}`;
        webpackConfig.plugins.push(new HtmlWebpackPlugin({
            filename: path.join(__dirname, `/dist/${page.name}.html`),
            template: path.join(__dirname, `/src/views/${page.html}`),
            inject: true,
            chunks: [page.name],
            inlineSource: '.(js|css)$',
            minify: false,
            chunksSortMode: 'auto'
        }))
    })
}


module.exports = webpackConfig;
