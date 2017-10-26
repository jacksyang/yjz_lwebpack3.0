const path = require("path")
const glob = require("glob")
const uglifyPlugin = require("uglifyjs-webpack-plugin");
const copyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const htmlPlugin = require("html-webpack-plugin")
const extractTextPlugin = require("extract-text-webpack-plugin")
const purifyCssPlugin = require("purifycss-webpack")
const entry = require("./webpack_config/entry_webpack.js");

console.log(encodeURIComponent(process.env.type))
if (process.env.type == "build") {
    var website = {
        publicPath: './'
    }
} else {
    var website = {
        publicPath: './'
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
        jquery: "jquery",
        vue: "vue"

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
        new webpack.optimize.CommonsChunkPlugin({
            name: ["jquery", "vue"],
            filename: "js/[name].js",
            minChunks: 2,
        }),
        new webpack.ProvidePlugin({
            $: "jquery",

            //不用的花不会把jq打进去

        }),

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
        new webpack.BannerPlugin("2017-10-26"),
        new copyPlugin([{
            from: __dirname + '/src/img',
            to: "./public"
        }])
        //复制src到dist，没什么道理。f
        //
        // new uglifyPlugin() //生成环境用
        //打版本号
    ],
    devServer: {
        contentBase: path.resolve(__dirname, "dist"),
        host: "localhost",
        compress: true, //服务器压缩
        port: 9527

    },
    watchOptions: {
        poll: 1000,
        aggregeateTimeout: 500,
        ignored: /node_modules/,

    }

}