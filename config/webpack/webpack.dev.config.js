const webpackMerge = require( 'webpack-merge' );
const baseConfig = require( './webpack.base.config' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const path = require( 'path' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const WriteFilePlugin = require( 'write-file-webpack-plugin' );

module.exports = function() {
	return webpackMerge( baseConfig(), {
		output: {
			filename: '[name].bundle.js'
		},
		devtool: 'source-map',
		devServer: {
			contentBase: path.join( __dirname, '../../build' ),
			inline: true,
			historyApiFallback: true
		},
		plugins: [
			new ExtractTextPlugin( '[name].bundle.css' ),
			new CopyWebpackPlugin( [
				{from: '_assets/pwa/manifest.json', to: '../../'},

				{from: '_assets/pwa/browserconfig.xml', to: '../../'},
				{from: '_assets/pwa/favicon.ico', to: '../../'},
				{from: '_assets/images', to: 'images', ignore: [ '*.ai']}
			] ),
			new WriteFilePlugin({
				test: /\.ico|\.xml|\.json/
			})
		]
	});
};
