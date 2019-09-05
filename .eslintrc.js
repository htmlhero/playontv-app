module.exports = {
	extends: 'interfaced',
	overrides: [
		{
			files: ['app/**/*.js'],
			extends: 'interfaced/esm',
			settings: {
				'import/resolver': 'zombiebox',
			},
			rules: {
				'interfaced/props-order': 'off',
				'interfaced/lines-between-props': 'off',
			}
		},
		{
			files: ['config.js', 'scripts/**/*.js'],
			extends: 'interfaced/node',
		},
	],
};
