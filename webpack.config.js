const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const isProduction =
    process.env.NODE_ENV === "production" ? "production" : "development";

const config = {
    context: __dirname,
    mode: isProduction,
    entry: {
        core: [
            path.resolve(__dirname, "/resources/scripts/core.js"),
            path.resolve(__dirname, "/resources/styles/core.scss"),
        ],
    },
    output: {
        filename: "scripts/[name].js",
        path: path.resolve(process.cwd(), "public/"),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                type: "asset",
            },
            {
                // Look for any .js files.
                // Exclude the node_modules folder.
                // Use babel loader to transpile the JS files.
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            {
                // Look for any .scss files
                test: /\.(sa|sc|c)ss$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                    "sass-loader",
                ],
            },
        ],
    },
    optimization: {
        minimizer: [
            "...",
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminMinify,
                    options: {
                        // Lossless optimization with custom option
                        // Feel free to experiment with options for better result for you
                        plugins: [
                            ["gifsicle", { interlaced: true }],
                            ["jpegtran", { progressive: true }],
                            ["optipng", { optimizationLevel: 5 }],
                            // Svgo configuration here https://github.com/svg/svgo#configuration
                            [
                                "svgo",
                                {
                                    plugins: [
                                        {
                                            name: "preset-default",
                                            params: {
                                                overrides: {
                                                    removeViewBox: false,
                                                    addAttributesToSVGElement: {
                                                        params: {
                                                            attributes: [
                                                                {
                                                                    xmlns: "http://www.w3.org/2000/svg",
                                                                },
                                                            ],
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                },
                            ],
                        ],
                    },
                },
            }),
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {from: "resources/fonts/", to: "fonts/[name][ext]"},
                {from: "resources/images/", to: "images/[name][ext]"}
            ],

        }),
        new MiniCssExtractPlugin({
            filename: "styles/[name].css",
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
        }),
    ],
    resolve: {
        alias: {
            "@src": path.resolve(__dirname, "resources"),
            "@dist": path.resolve(__dirname, "public"),
            "@fonts": "@src/fonts",
            "@images": "@src/images",
            "@scripts": "@src/scripts",
            "@styles": "@src/styles",
        },
    },
};

module.exports = (env, argv) => {
    if (argv.mode === "development") {
        config.devtool = "source-map";
        delete config.devServer;
        config.plugins.push(
            new BrowserSyncPlugin({
                server: true,
                files: ["public/**/*", "**/*/.html", "*.php"],
            })
        );
    }

    if (argv.mode === "production") {
        //...
    }

    return config;
};
