module.exports = {
	extends: ['plugin:@wordpress/eslint-plugin/recommended'],
	settings: {
		'import/resolver': {
			alias: {
				map: [
					['App', './src/app'],
					['Assets', './assets'],
					['@modules', './vendor/newfold-labs'],
				],
				extensions: ['.js', '.jsx', '.json'],
			},
		},
	},
	globals: {
		__: true,
		_camelCase: true,
		_filter: true,
		_n: true,
		classNames: true,
		useContext: true,
		useEffect: true,
		useState: true,
	},
	rules: {
		'import/no-unresolved': [
			'error',
			{
				ignore: [
					'^App/',
					'^Assets/',
					'^@wordpress/',
					'^@newfold/',
					'^react',
					'^lodash',
					'^classnames',
					'^react-use',
					'^react-router-dom',
					'^@heroicons/',
					'^react-error-boundary',
					'^html-react-parser',
				],
			},
		],
	},
};
