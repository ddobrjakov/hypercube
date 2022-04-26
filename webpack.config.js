const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
		"demo-mobile": "./src/demo-mobile",
		"demo-web": "./src/demo-web",
		"demo-web-timer": "./src/demo-web-timer"
    },
    mode: "none",
    output: {
        filename: "[name]/[name].bundle.js",
        path: path.resolve(__dirname, "./server/public/")
    },
    resolve: {
        extensions: ['.mjs', '.js', '.json']
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
			{ from: "html/demo-web", to: "demo-web" },
			{ from: "html/demo-mobile", to: "demo-mobile" },
			{ from: "html/demo-web-timer", to: "demo-web-timer" },
            // { from: "html", to: "" },
            { from: "node_modules/@hyper/hypercube/assets", to: "assets" }        
        ]})
    ]
};