var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry : {
		'jannes.mingram.net' : ["./src/main.js"]
	},
	output : {
		path : path.resolve(__dirname, "build/js"),
		publicPath : "/",
		filename : "js/[name].js"
	},
    plugins: [
        new ExtractTextPlugin('/css/styles.css')
    ],
    sassLoader: {
        includePaths: [ 'node_modules/bootstrap/scss' ]
    },
	module : {
		loaders : [{
				test : /.jsx?$/,
				loader : 'babel-loader',
				exclude : /node_modules/,
				query : {
					presets : ['latest']
				}
			},
            { test: /\.svg$/, loader: 'url?limit=65000&mimetype=image/svg+xml&name=fonts/[name].[ext]' },
            { test: /\.woff$/, loader: 'url?limit=65000&mimetype=application/font-woff&name=fonts/[name].[ext]' },
            { test: /\.woff2$/, loader: 'url?limit=65000&mimetype=application/font-woff2&name=fonts/[name].[ext]' },
            { test: /\.ttf$/, loader: 'url?limit=65000&mimetype=application/octet-stream&name=fonts/[name].[ext]' },
            { test: /\.eot$/, loader: 'url?limit=65000&mimetype=application/vnd.ms-fontobject&name=fonts/[name].[ext]' },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract(
                    'style', // The backup style loader
                    'css?sourceMap!sass?sourceMap'
                )
            }
		]
	},
};
