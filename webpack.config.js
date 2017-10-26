const path = require("path")
const glob = require("glob")
const uglifyPlugin = require("uglifyjs-webpack-plugin");
const webpack = require("webpack");
const htmlPlugin = require("html-webpack-plugin")
const extractTextPlugin = require("extract-text-webpack-plugin")
const purifyCssPlugin = require("purifycss-webpack")
const entry = require("./webpack_config/entry_webpack.js")
console.log(encodeURIComponent(process.env.type))
if (process.env.type == "build") {
    var website = {
        publicPath: 'http://localhost:9527/'
    }
} else {
    var website = {
        publicPath: 'http://192.168.1.107:8085/'
    }

}


module.exports = {
    devtool: "source-map",
    //source-map独立map(最全，项目开发组用)
    //cheap-module-source-map独立map
    //eval-source-map独立开发阶段
    //cheap-module-eval-source-map列
    entry: entry.path,
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
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                },
                exclude: /node_modules/
            }, {
                test: /\.css$/,
                // use: [{
                //     loader: "style-loader"
                // }, {
                //     loader: "css-loader"
                // }],
                use: extractTextPlugin.extract({

                    fallback: "style-loader",
                    use: [{
                            loader: "css-loader",
                            options: {
                                importLoaders: 1
                            }
                        },
                        "postcss-loader"
                    ]
                })
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 5,
                        outputPath: "images/"
                    }
                }]

            },
            {
                test: /\.(htm|html)$/i,
                use: ['html-withimg-loader']
            },
            {
                test: /\.less$/,
                use: extractTextPlugin.extract({

                    use: [{
                            loader: "css-loader"
                        },
                        {
                            loader: "less-loader"
                        }
                    ],
                    fallback: "style-loader",
                })
                // use: [{
                //     loader: "style-loader"
                // }, {
                //     loader: "css-loader"
                // }, {
                //     loader: "less-loader"
                // }],
            },
            {
                test: /\.(scss|sass)$/,
                use: extractTextPlugin.extract({

                    use: [{
                            loader: "css-loader"
                        },
                        {
                            loader: "sass-loader"
                        },
                        "postcss-loader"
                    ],
                    fallback: "style-loader",
                })
                // use: [{
                //     loader: "style-loader"
                // }, {
                //     loader: "css-loader"
                // }, {
                //     loader: "less-loader"
                // }],
            },

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
        new extractTextPlugin("css/index.css"),
        new purifyCssPlugin({
            paths: glob.sync(path.join(__dirname, "src/*.html"))
        }),
    ],
    devServer: {
        contentBase: path.resolve(__dirname, "dist"),
        host: "localhost",
        compress: true, //服务器压缩
        port: 9527

    }

}