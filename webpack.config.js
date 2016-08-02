var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require('webpack');

module.exports = {
    // 入口
    entry: './src/main',
    // 输出
    output: {
        path: path.join(__dirname, './dist'),
        filename: '[name].js',
        publicPath: '/dist/'
    },
    module: {
        // 加载器
        loaders: [
            { test: /\.vue$/, loader: 'vue' },
            { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader") },
            { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=40000' },
            { test: /\.(html|tpl)$/, loader: 'html-loader' },
        ]
    },
    vue: {
        loaders: {
            css: 'style!css!postcss-loader'
        }
    },
    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime']
    },
    postcss: function(pack) {
        return [require('postcss-import')({ addDependencyTo: pack }), require('postcss-css-variables'), require("postcss-custom-media"), require('autoprefixer')];
    },
    resolve: {
        // require时省略的扩展名，如：require('module') 不需要module.js
        extensions: ['', '.js', '.vue'],
        // 别名
        alias: {
            filter: path.join(__dirname, './src/filters'),
            components: path.join(__dirname, './src/components')
        }
    },
    plugins: [
        new ExtractTextPlugin("[name].css", { disable: false }),
	// new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
    ],
    // 开启source-map，webpack有多种source-map，在官网文档可以查到
    devtool: '#source-map',
    devServer: {
        hot: true,
        host: 'localhost',
        port: 8888,
        proxy: {
            '/login': {
                target: 'http://127.0.0.1:9090',
                secure: false,
            }
        }
    }

};
