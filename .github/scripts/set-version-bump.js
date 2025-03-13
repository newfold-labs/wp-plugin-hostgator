/**
 * For patch releases, use `npm run set-version-bump` script.
 * For minor or major releases, use `node run ./.github/scripts/set-version-bump.js minor`.
 * - Then run the remaining steps from the npm script:
 * - `npm i && rm -rf ./build && npm run build && composer run i18n`
 */

const fs = require( 'fs' );
const path = require( 'path' );
const semver = require( 'semver' );
const packagefile = path.resolve( __dirname, '../../package.json' );
const pluginfile = path.resolve(
	__dirname,
	'../../bluehost-wordpress-plugin.php'
);

if ( fs.existsSync( packagefile ) && fs.existsSync( pluginfile ) ) {
	const packageData = require( packagefile );
	const currentVersion = packageData.version;
	let type = process.argv[ 2 ];
	if ( ! [ 'major', 'minor', 'patch' ].includes( type ) ) {
		type = 'patch';
	}

	const newVersion = semver.inc( packageData.version, type );
	packageData.version = newVersion;
	fs.writeFileSync( packagefile, JSON.stringify( packageData, null, 4 ) );

	fs.readFile( pluginfile, 'utf8', function ( err, data ) {
		if ( err ) {
			return console.log( err );
		}
		const result = data.replaceAll( currentVersion, newVersion );

		fs.writeFile( pluginfile, result, 'utf8', function ( err ) {
			if ( err ) {
				return console.log( err );
			}
		} );
	} );

	console.log( 'Version updated', currentVersion, '=>', newVersion );
} else {
	console.log(
		'Version update error: package.json or bluehost-wordpress-plugin.php not found.'
	);
}
