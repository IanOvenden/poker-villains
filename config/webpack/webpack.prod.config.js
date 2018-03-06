const path = require( 'path' );
const WebpackCleanupPlugin = require( 'webpack-cleanup-plugin' );
const webpackMerge = require( 'webpack-merge' );
const baseConfig = require( './webpack.base.config' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const SWPrecacheWebpackPlugin = require( 'sw-precache-webpack-plugin' );

module.exports = function() {
	return webpackMerge( baseConfig(), {
		devtool: 'none',
		output: {
			filename: '[name].[hash].bundle.js'
		},
		plugins: [
			new ExtractTextPlugin( '[name].[hash].bundle.css' ),
			new WebpackCleanupPlugin({quiet: true}),
			new HtmlWebpackPlugin({
				filename: '../../dist/index.html',
				template: './_assets/templates/index.template',
				inject: 'body'
			}),
			new CopyWebpackPlugin( [ // PROD
				{from: '_assets/pwa', to: 'pwa', ignore: [ '*.json', '*.xml', '*.ico', '*.js']},
				{from: '_assets/images', to: 'images', ignore: [ '*.ai']},
				{from: '_assets/pwa/manifest.json', to: '../'},
				{from: '_assets/pwa/browserconfig.xml', to: '../'},
				{from: '_assets/pwa/favicon.ico', to: '../'}
			] ),
			new SWPrecacheWebpackPlugin({
				cacheId: 'snap-cache',
				filename: 'sw.js',
				mergeStaticsConfig: true,
				root: 'dist',
				stripPrefix: 'C:/development/snap/projects/snap-react/build/dist',
				logger: function() {},

				//minify: true,
				filepath: path.resolve( __dirname, '../../build/dist/sw.js' ),
				staticFileGlobs: [
					'assets/**.css',
					'index.html',
					'assets/**.js'
				],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/private-c05f7-snapimock.apiary-mock.com/,
						handler: 'networkFirst',
						options: {
							cache: {
								maxEntries: 10,
								name: 'api-cache'
							}
						}
					}
				]
			})
		]
	});
};
