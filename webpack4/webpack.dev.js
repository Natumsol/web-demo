const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: __dirname,
    entry: { 'index': './src/index.jsx' },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                options: {
                    babelrc: true,
                    cacheDirectory: true
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: ['node_modules']
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Hello, Webpack 4',
            template: './template/index.html'
        })
    ]
};