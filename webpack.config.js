var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry : {
		'jannes.mingram.net' : ["./src/main.js"]
	},
	output : {
		path : path.resolve(__dirname, "build/js"),
		publicPath : "/js/",
		filename : "[name].js"
	},
	module : {
		loaders : [{
				test : /.jsx?$/,
				loader : 'babel-loader',
				exclude : /node_modules/,
				query : {
					presets : ['latest']
				}
			}
		]
	},
};
