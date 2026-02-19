import { addQueryArgs } from '@wordpress/url';
import { dispatch } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { NewfoldRuntime } from '@newfold/wp-module-runtime';
import region from '../data/region';

let lastNoticeId;

/**
 * Wrapper method to dispatch snackbar notice
 *
 * @param {string} [text='Settings Saved'] - Text for the notice.
 */
export const dispatchUpdateSnackbar = ( text = 'Settings Saved' ) => {
	//clear previous notice so they don't stack up when quickly saving multiple settings
	dispatch( 'core/notices' ).removeNotice( lastNoticeId );

	//make new
	dispatch( 'core/notices' )
		.createNotice( 'info', text, {
			type: 'snackbar',
			isDismissible: true,
		} )
		.then( ( result ) => {
			// save as notice to dismiss later
			lastNoticeId = result.notice.id;
		} );
};

/**
 * Wrapper method for toggling a feature via the features API
 *
 * @param {string}   featureName  the name of the feature
 * @param {Function} thenCallback method to call in promise then
 * @return {Promise} Features API promise with attached then callback
 */
export const featureToggle = async ( featureName, thenCallback ) => {
	if ( true === window.NewfoldFeatures.features[ featureName ] ) {
		return window.NewfoldFeatures.disable( featureName ).then(
			( response ) => {
				thenCallback( response );
			}
		);
	}
	// else
	return window.NewfoldFeatures.enable( featureName ).then( ( response ) => {
		thenCallback( response );
	} );
};

/**
 * Helper to update UI elements as features are enabled/disabled
 *
 * @param {string}  selector    css selector to find the element
 * @param {boolean} enabled     whether the element is now activated/deactivated
 * @param {string}  className   the css class to add/remove - default 'nfd-disabled'
 * @param {boolean} forceReload whether this update requires a forced page reload - default false
 */
export const updateUI = (
	selector,
	enabled = true,
	className = 'nfd-disabled',
	forceReload = false
) => {
	const element = document.querySelector( selector );
	if ( element ) {
		if ( ! enabled ) {
			element.classList.add( className );
		} else {
			element.classList.remove( className );
		}
	}
	if ( forceReload ) {
		window.location.reload();
	}
};

/**
 * Wrapper method to post setting to hostgator endpoint
 *
 * @param {Object}   data         object of data
 * @param {Function} passError    setter for the error in component
 * @param {Function} thenCallback method to call in promise then
 * @return {Promise} apiFetch promise with attached then and catch callbacks
 */
export const hostgatorSettingsApiFetch = ( data, passError, thenCallback ) => {
	return apiFetch( {
		url: NewfoldRuntime.createApiUrl( '/hostgator/v1/settings' ),
		method: 'POST',
		data,
	} )
		.then( ( response ) => {
			thenCallback( response );
		} )
		.catch( ( error ) => {
			passError( error );
		} );
};

/**
 * Wrapper method to post request to hostgator cache endpoint
 *
 * @param {Object}   data         - Request data.
 * @param {Function} passError    - Setter for the error in component.
 * @param {Function} thenCallback - Callback for the promise then.
 * @return {Promise} apiFetch promise.
 */
export const hostgatorPurgeCacheApiFetch = (
	data,
	passError,
	thenCallback
) => {
	return apiFetch( {
		url: NewfoldRuntime.createApiUrl( '/hostgator/v1/caching' ),
		method: 'DELETE',
		data,
	} )
		.then( ( response ) => {
			thenCallback( response );
		} )
		.catch( ( error ) => {
			passError( error );
		} );
};

/**
 * Coming soon admin bar toggle.
 *
 * @param {boolean} comingSoon - Whether coming soon mode is enabled.
 */
export const comingSoonAdminbarToggle = ( comingSoon ) => {
	window.NewfoldRuntime.comingSoon.toggleAdminBarSiteStatus( comingSoon );
};

/**
 * Get the current region value.
 *
 * @return {string} Two-char country code for region, or empty string for default region.
 */
export const getRegionValue = () => {
	const brand = NewfoldRuntime.plugin.brand;

	// bail if not hostgator-latam brand
	if ( brand !== 'hostgator-latam' ) {
		return '';
	}
	const regionCode = NewfoldRuntime.plugin.region.toUpperCase();
	switch ( regionCode ) {
		case 'AR': // Argentina
		case 'BO': // Bolivia
		case 'BR': // Brazil
		case 'CL': // Chile
		case 'CO': // Colombia
		case 'DO': // Dominican Republic
		case 'EC': // Ecuador
		case 'MX': // Mexico
		case 'PR': // Peru
		case 'UY': // Uruguay
			return regionCode;
		case 'US':
		case false:
		default:
			return 'default';
	}
};

/**
 * Get region specific link value.
 *
 * @param {string} [link_name='main'] - Name for link in regions object.
 * @param {string} [link_text]        - Link text for UTM.
 * @return {string} Region-specific href value for the specified link or default.
 */
/* eslint-disable camelcase */
export const getLinkPerRegion = ( link_name = 'main', link_text ) => {
	const region_code = getRegionValue();

	// ensure there's a link value match
	if ( region[ link_name ] && region[ link_name ][ region_code ] ) {
		// automatically add utm params
		return addUtmParams( region[ link_name ][ region_code ], {
			utm_term: link_text,
			utm_content: link_name,
		} );
	}
	// if no match return default and automatically add utm params
	return addUtmParams( region[ link_name ].default, {
		utm_term: link_text,
		utm_content: link_name,
	} );
};

/**
 * Supports or can get region specific link value.
 *
 * @param {string} [link_name='main'] - Name for link in regions object.
 * @return {boolean} Whether the region link is present or missing, or false.
 */
export const supportsLinkPerRegion = ( link_name = 'main' ) => {
	const region_code = getRegionValue();
	// ensure there's a link value to check
	if ( region[ link_name ] && region[ link_name ][ region_code ] ) {
		// if value exists return true - unless value itself is false, then return false
		return region[ link_name ][ region_code ] !== 'false';
	}
	// if no match, we'll return default
	return true;
};
/* eslint-enable camelcase */

/**
 * Decorates an external link URL with UTM params.
 *
 * The utm_term, if passed, should be the link anchor text.
 * The utm_content, if passed, should be the unique identifier for the link.
 * The utm_campaign is optional and reserved for special occasions.
 *
 * @param {string} url    The original URL.
 * @param {Object} params The URL parameters to add.
 *
 * @return {string} The new URL.
 */
export const addUtmParams = ( url, params = {} ) => {
	// eslint-disable-next-line camelcase
	params.utm_source = `wp-admin/admin.php?page=hostgator${ window.location.hash }`;
	// eslint-disable-next-line camelcase
	params.utm_medium = 'hostgator_plugin';
	return addQueryArgs( url, params );
};

/**
 * Handles help center links click, will open help center slide if user has access
 * or navigate to help page if user doesn't have access
 */
export const handleHelpLinksClick = () => {
	if (
		NewfoldRuntime.hasCapability( 'canAccessHelpCenter' ) &&
		window.newfoldEmbeddedHelp &&
		! window.newfoldEmbeddedHelp.hasListeners
	) {
		// add listener to all help links
		const helpLinks = document.querySelectorAll( '[href*="#/help"]' );
		if ( helpLinks ) {
			helpLinks.forEach( ( el ) =>
				el.addEventListener( 'click', ( e ) => {
					e.preventDefault();
					window.newfoldEmbeddedHelp.toggleNFDLaunchedEmbeddedHelp();
				} )
			);
			window.newfoldEmbeddedHelp.hasListeners = true;
		}

		// if on help page already, open help center
		if ( window.location.hash === '#/help' ) {
			window.newfoldEmbeddedHelp.toggleNFDLaunchedEmbeddedHelp();
		}
	}
};

/**
 * Cached features promise - ensures only one polling instance exists
 * @type {Promise<object>|null}
 */
let featuresPromise = null;

/**
 * Wait for the NewfoldFeatures object to be available on window
 * @param {number} timeout - Maximum time to wait in milliseconds (default: 5000)
 * @return {Promise<object>} Resolves with the features object when available
 */
export const waitForFeatures = ( timeout = 5000 ) => {
	if ( featuresPromise ) {
		return featuresPromise;
	}
	featuresPromise = new Promise( ( resolve, reject ) => {
		if ( window.NewfoldFeatures?.features ) {
			resolve( window.NewfoldFeatures );
			return;
		}
		const startTime = Date.now();
		const interval = setInterval( () => {
			if ( window.NewfoldFeatures?.features ) {
				clearInterval( interval );
				resolve( window.NewfoldFeatures );
			} else if ( Date.now() - startTime >= timeout ) {
				clearInterval( interval );
				featuresPromise = null;
				reject(
					new Error(
						'NewfoldFeatures not available, please refresh the page and try again.'
					)
				);
			}
		}, 50 );
	} );
	return featuresPromise;
};

/**
 * Cached runtime promise for use by getEditorUrl/getEditorLabel
 * @type {Promise<object>|null}
 */
let runtimePromise = null;

/**
 * Wait for NewfoldRuntime to be available on window.
 * Resolves when adminUrl is present (required for editor URL/label helpers).
 *
 * @param {number} [timeout=5000] - Max wait in ms.
 * @return {Promise<object>} Resolves with NewfoldRuntime when available.
 */
export const waitForRuntime = ( timeout = 5000 ) => {
	if ( runtimePromise ) {
		return runtimePromise;
	}
	runtimePromise = new Promise( ( resolve, reject ) => {
		const rt = window.NewfoldRuntime;
		if ( rt?.adminUrl ) {
			resolve( rt );
			return;
		}
		const startTime = Date.now();
		const interval = setInterval( () => {
			const current = window.NewfoldRuntime;
			if ( current?.adminUrl ) {
				clearInterval( interval );
				resolve( current );
			} else if ( Date.now() - startTime >= timeout ) {
				clearInterval( interval );
				runtimePromise = null;
				reject( new Error( 'NewfoldRuntime not available.' ) );
			}
		}, 50 );
	} );
	return runtimePromise;
};

/**
 * Get the appropriate editor URL based on theme type.
 *
 * @param {string} [canvas='edit'] - Optional canvas for site editor.
 * @return {Promise<string>} URL for the theme editor or customizer.
 */
export const getEditorUrl = async ( canvas = 'edit' ) => {
	try {
		const runtime = await waitForRuntime();
		const classicThemeEditorUrl = `${ runtime.adminUrl }customize.php`;
		const blockThemeEditorUrl = `${ runtime.adminUrl }site-editor.php?canvas=${ canvas }`;
		const blockTheme = runtime?.wordpress?.isBlockTheme || false;
		return blockTheme ? blockThemeEditorUrl : classicThemeEditorUrl;
	} catch {
		// Fallback when runtime not available (e.g. before script loads).
		return '#';
	}
};

/**
 * Get the appropriate editor label based on theme type.
 *
 * @return {Promise<string>} Localized label for Site Editor or Customizer.
 */
export const getEditorLabel = async () => {
	try {
		const runtime = await waitForRuntime();
		const blockTheme = runtime?.wordpress?.isBlockTheme || false;
		return blockTheme
			? __( 'Site Editor', 'wp-plugin-hostgator' )
			: __( 'Customizer', 'wp-plugin-hostgator' );
	} catch {
		return __( 'Editor', 'wp-plugin-hostgator' );
	}
};

/**
 * Get HostGator platform/hosting URL.
 *
 * @param {string} [jarvisPath=''] - Path for Jarvis-style accounts.
 * @param {string} [legacyPath=''] - Path for legacy hosting (e.g. 'app/#/sites').
 * @return {string} Full URL for the platform or hosting panel.
 */
export const getPlatformPathUrl = ( jarvisPath = '', legacyPath = '' ) => {
	// HostGator: use my.hostgator.com or similar; legacyPath for hosting panel
	const base = 'https://my.hostgator.com/';
	if ( legacyPath ) {
		return (
			base +
			( legacyPath.startsWith( 'app' )
				? 'hosting/' + legacyPath
				: legacyPath )
		);
	}
	return base + ( jarvisPath || '' );
};
