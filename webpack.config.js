const path = require('path');
const { merge } = require('webpack-merge');
const wpScriptsConfig = require('@wordpress/scripts/config/webpack.config');
const version = require('./package.json').version;
const { ProvidePlugin } = require('webpack');
const TerserPlugin = require( 'terser-webpack-plugin' );

/**
 * Aliases for resolving Brand imports
 */
const alias = {
    App: path.resolve(__dirname, '/src/app/'),
    Store: path.resolve(__dirname, '/src/app/data/store.js'),
    Routes: path.resolve(__dirname, '/src/app/data/routes.js'),
};
/**
 * Make most-common imports available globally to ease import debt.
 * (Instead of import { useEffect } from '@wordpress/element' in every file)
 */
const mostCommonImports = {
    Fragment: ['@wordpress/element', 'Fragment'],
    useState: ['@wordpress/element', 'useState'],
    useEffect: ['@wordpress/element', 'useEffect'],
    useContext: ['@wordpress/element', 'useContext'],
    useLocation: ['react-router-dom', 'useLocation'],
    useNavigate: ['react-router-dom', 'useNavigate'],
    _filter: ['lodash', 'filter'],
    _map: ['lodash', 'map'],
    _isEmpty: ['lodash', 'isEmpty'],
    _camelCase: ['lodash', 'camelCase'],
    __: ['@wordpress/i18n', '__'],
    _n: ['@wordpress/i18n', '_n'],
    sprintf: ['@wordpress/i18n', 'sprintf'],
    classNames: ['classnames'],
};

/**
 * Terser's function to decide which comments to preserve.
 *
 * @see https://github.com/Automattic/jetpack/blob/fdf3b72390c7fcb64508d985149de2af01b935b3/projects/js-packages/webpack-config/src/webpack/terser.js
 * @see https://github.com/terser/terser/blob/v5.9.0/lib/output.js#L171-L177
 * @param {object} comment - Comment object.
 * @param {string} comment.type - Comment type.
 * @param {string} comment.value - Comment text.
 * @returns {boolean} Whether to keep it.
 */
 function isSomeComments( comment ) {
	return (
		( comment.type === 'comment2' || comment.type === 'comment1' ) &&
		/@preserve|@lic|@cc_on|^\**!/i.test( comment.value )
	);
}

/**
 * Function to match a WP i18n "translators" comment.
 *
 * @see https://github.com/Automattic/jetpack/blob/fdf3b72390c7fcb64508d985149de2af01b935b3/projects/js-packages/webpack-config/src/webpack/terser.js
 * @see https://github.com/php-gettext/Gettext/blob/4.x/src/Utils/ParsedComment.php#L53-L73
 * @see https://github.com/wp-cli/i18n-command/blob/v2.2.9/src/JsCodeExtractor.php#L15
 * @param {object} comment - Comment object.
 * @param {string} comment.type - Comment type.
 * @param {string} comment.value - Comment text.
 * @returns {boolean} Whether to keep it.
 */
 function isTranslatorsComment( comment ) {
	return (
		( comment.type === 'comment2' || comment.type === 'comment1' ) &&
		/^[#*/ \t\r\n]*[tT]ranslators/.test( comment.value )
	);
}

/**
 * Extend @wordpress/scripts default webpack config with:
 * - Versioned build folder (via package.json version) for cache-busting.
 * - Set Plugin-specific aliases for tidy imports.
 * - Use webpack's ProvidePlugin to ease repetitive imports.
 */
const hostgatorConfig = {
    mode: 'production',
    output: {
        // versioned output directory i.e. /build/1.0.0, /build/1.1.0, etc.
        path: path.resolve(process.cwd(), 'build/' + version),
    },
    resolve: { alias },
    plugins: [new ProvidePlugin(mostCommonImports)],
    optimization: {
        concatenateModules: false,
        minimize: true,
        minimizer: [
            new TerserPlugin( {
                terserOptions: {
                    mangle: {
                        reserved: [ '__', '_n', '_nx', '_x' ]
                    },
                    format: {
                        // The `new Function` bit here is a hack to work around the way terser-webpack-plugin serializes
                        // the terserOptions. The "comments" function must not refer to anything from the local or global scope,
                        // so we "paste" our external functions inside.
                        comments: new Function(
                            'node',
                            'comment',
                            `${ isTranslatorsComment }; return isTranslatorsComment( comment )`
                        ),
                    },
                },
                // Same.
                extractComments: new Function(
                    'node',
                    'comment',
                    `${ isSomeComments }; return isSomeComments( comment )`
                ),
            }),
        ]
    },

};
module.exports = merge(wpScriptsConfig, hostgatorConfig);