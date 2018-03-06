function buildConfig( env ) {
	return require( './config/webpack/webpack.' + env + '.config.js' )( env );
}

module.exports = buildConfig;
