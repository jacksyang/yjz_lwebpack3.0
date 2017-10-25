const path = require("path")
const uglifyPlugin = require("uglifyjs-webpack-plugin");
const webpack = require("webpack");
const htmlPlugin = require("html-webpack-plugin")
const extractTextPlugin = require("extract-text-webpack-plugin")
var website = {
    publicPath: 'http://localhost:9527/'
}
module.exports = {
    entry: {
        entry: "./src/entry.js",
        entry2: "./src/entry2.js",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        publicPath: website.publicPath
    },
    module: {
        rules: [{
                test: /\.css$/,
                // use: [{
                //     loader: "style-loader"
                // }, {
                //     loader: "css-loader"
                // }],
                use: extractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 5,
                        outputPath:"images/"
                    }
                }]

            }
        ]
    },
    plugins: [
        // new uglifyPlugin() //生成环境用
        new htmlPlugin({
            minify: {
                removeAttributeQuotes: true,
            },
            hash: true,
            template: "./src/index.html"
        }),
        new extractTextPlugin("css/index.css")
    ],
    devServer: {
        contentBase: path.resolve(__dirname, "dist"),
        host: "localhost",
        compress: true, //服务器压缩
        port: 9527

    }

}