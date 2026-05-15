/**
 * ESLint flat config for ESLint 9+ / `wp-scripts lint-js`.
 *
 * @wordpress/eslint-plugin v25+ only publishes flat configs. Legacy
 * `.eslintrc.js` + `extends: [ 'plugin:@wordpress/eslint-plugin/recommended' ]`
 * makes ESLint try to treat flat-config plugin objects as JSON and fails with
 * "Converting circular structure to JSON".
 *
 * This mirrors `@wordpress/scripts/config/eslint.config.cjs` and adds HostGator
 * import aliases / globals / unresolved ignores.
 */
const wpPlugin = require( '@wordpress/eslint-plugin' );
const { hasBabelConfig } = require( '@wordpress/scripts/utils' );

const config = [
	{
		ignores: [ '**/build/**', '**/node_modules/**', '**/vendor/**' ],
	},
	...wpPlugin.configs.recommended,
	...wpPlugin.configs[ 'test-unit' ].map( ( c ) => ( {
		...c,
		files: [ '**/@(test|__tests__)/**/*.js', '**/?(*.)test.js' ],
	} ) ),
	{
		settings: {
			'import/resolver': {
				alias: {
					map: [
						[ 'App', './src/app' ],
						[ 'Assets', './assets' ],
						[ '@modules', './vendor/newfold-labs' ],
					],
					extensions: [ '.js', '.jsx', '.json' ],
				},
			},
		},
		languageOptions: {
			globals: {
				__: 'writable',
				_camelCase: 'writable',
				_filter: 'writable',
				_n: 'writable',
				classNames: 'writable',
				useContext: 'writable',
				useEffect: 'writable',
				useState: 'writable',
			},
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
	},
];

if ( ! hasBabelConfig() ) {
	config.push( {
		languageOptions: {
			parserOptions: {
				requireConfigFile: false,
				babelOptions: {
					presets: [
						require.resolve( '@wordpress/babel-preset-default' ),
					],
				},
			},
		},
	} );
}

module.exports = config;
