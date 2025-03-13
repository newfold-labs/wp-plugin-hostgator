/**
 * This sets the latest wp-version in the wp-env.json file.
 * It runs every `npm i` so we don't have to manuallly update to latest versions.
 */
const fs = require( 'fs' );
const path = require( 'path' );
const wpEnvFile = path.resolve( __dirname, '../../.wp-env.json' );
const pluginFile = path.resolve(
	__dirname,
	'../../bluehost-wordpress-plugin.php'
);
const wpEnv = require( '../../.wp-env.json' );
async function fetchData( url ) {
	try {
		const fetch = ( ...args ) =>
			import( 'node-fetch' ).then( ( { default: fetch } ) =>
				fetch( ...args )
			);
		const response = await fetch( url );
		if ( ! response.ok ) {
			throw new Error( `HTTP error! status: ${ response.status }` );
		}
		const data = await response.json();
		return data;
	} catch ( error ) {
		console.error( 'Fetching error:', error );
		throw error;
	}
}

fetchData( 'https://api.wordpress.org/core/stable-check/1.0/' ).then(
	( json ) => {
		const wpEnvData = require( wpEnvFile );
		const wpCurrent = wpEnvData.core.split( '#tags/' )[ 1 ];
		const wpVersion = Object.keys( json )[ Object.keys( json ).length - 1 ];
		if ( wpCurrent === wpVersion ) {
			console.log( 'No WordPress updates found.' );
			return;
		}
		// update data
		wpEnvData.core = `WordPress/WordPress#tags/${ wpVersion }`;
		// write update to wp-env file
		try {
			fs.writeFileSync( wpEnvFile, JSON.stringify( wpEnvData, null, 2 ) );
			console.log(
				`The .wp-env.json file was updated with the latest WordPress version (${ wpVersion }).`
			);
		} catch ( err ) {
			console.log(
				'An error occurred while writing latest WordPress version to .wp-env.json file.',
				err
			);
		}

		// write to plugin file
		fs.readFile( pluginFile, 'utf8', function ( err, data ) {
			if ( err ) {
				return console.log( err );
			}
			const result = data.replaceAll( wpCurrent, wpVersion );
			fs.writeFile( pluginFile, result, 'utf8', function ( err ) {
				if ( err ) {
					return console.log( err );
				}
			} );
			console.log(
				`The plugin "Tested up to:" value has been updated to ${ wpVersion }.`
			);
		} );
	}
);
