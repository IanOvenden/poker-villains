'use strict';

const webpack = require( 'webpack' );
const path = require( 'path' );
const StyleLintPlugin = require( 'stylelint-webpack-plugin' );

var loaders = {
	css: require( './loader-css' ),
	js: require( './loader-js' )
};

module.exports = function() {
	return {
		context: path.resolve( __dirname, '../../src' ),
		entry: {
			vendor: [
				'react', 'react-dom', 'react-router', 'react-redux'
			],
			app: [
				'./index.jsx'
			]
		},
		output: {
			path: path.resolve( __dirname, '../../build/dist/assets' ),
			publicPath: '/assets/'
		},
		module: {
			rules: [
				loaders.js,
				loaders.css
			]
		},
		resolve: {
			extensions: [
				'.css',
				'.js',
				'.jsx'
			]
		},
		plugins: [
			new StyleLintPlugin({
				files: '**/*.css'
			}),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'vendor',
				minChunks: Infinity
			})
		]
	};
};
