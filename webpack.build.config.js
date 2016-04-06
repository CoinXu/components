/**
 * Created by xcp on 2016/3/12.
 */

var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var entry = require('./webpack.entry');
var UglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
    }
});
var plugins = [];
var argvs = process.argv;
var filename = '[name].';

if(argvs.indexOf('--compress') !== -1){
    plugins.push(UglifyJsPlugin);
    filename = filename + 'min.'
}

module.exports = {

    entry: {index:path.join(__dirname, './index')},

    output: {
        path: 'build',
        filename: filename + 'js',
        library: 'Essa',
        libraryTarget: 'this'
    },

    cache: true,

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {presets: ['es2015', 'react', 'stage-0']}
            },
            {
                test: /\.json$/,
                exclude: /node_modules/,
                loader: 'json-loader'
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract(
                    'css?sourceMap&-minimize!' + 'postcss-loader!' + 'less?sourceMap'
                )
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract(
                    'css?sourceMap&-minimize!' + 'postcss-loader'
                )
            }
        ]
    },

    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "react-dom/server": "ReactDOMServer"
    },

    plugins: plugins,

    resolve: {
        extensions: ['', '.js', '.jsx', '.less', '.css']
    }
};
