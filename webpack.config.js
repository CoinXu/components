/**
 * Created by xcp on 2016/3/12.
 */

var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var entry = require('./webpack.entry');
var commonsChunkPlugin = new webpack.optimize.CommonsChunkPlugin({
    filename: 'react-components-common',
    minChunks: 2,
    children: true,
    async: true
});

var precss = require('precss');
var autoprefixer = require('autoprefixer');

module.exports = {

    entry: entry,

    cache: true,

    output: {
        path: path.join(process.cwd(), 'dist'),
        publicPath: '/dist/',
        filename: '[name].bundle.js'
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {presets: ['es2015', 'react', 'stage-0']}
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader!postcss-loader"
            }
        ]
    },

    postcss: function () {
        return [precss, autoprefixer];
    },

    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "react-dom/server": "ReactDOMServer"
    },

    plugins: [
        new ExtractTextPlugin('[name].css'),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        commonsChunkPlugin
    ],

    resolve: {
        extensions: ['', '.js', '.jsx', '.less', '.css']
    }
};
