module.exports 	= {
	test: /\.jsx?$/,
	use: [{
		loader: 'babel-loader',
		options: { presets: [ 'es2015', 'react' ] }
	}, {
		loader: 'eslint-loader'
	}]
};
