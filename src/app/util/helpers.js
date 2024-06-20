import { addQueryArgs } from '@wordpress/url';
import { dispatch } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { NewfoldRuntime } from '@newfold-labs/wp-module-runtime';
import region from '../data/region';

let lastNoticeId;

/**
 * Wrapper method to dispatch snackbar notice
 *
 * @param string text text for notice
 * @param text
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
 * @param {*} data         object of data
 * @param     passError    setter for the error in component
 * @param     thenCallback method to call in promise then
 * @return apiFetch promise
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
			console.log( error );
			passError( error );
		} );
};

/**
 * Coming soon admin bar
 * @param comingSoon
 */
export const comingSoonAdminbarToggle = ( comingSoon ) => {
	window.NewfoldRuntime.comingSoon.toggleAdminBarSiteStatus( comingSoon );
};

/**
 * Get the current region value
 * @return string - 2 char country code for region - or empty string for default region
 */
export const getRegionValue = () => {
	const brand = NewfoldRuntime.plugin.brand;
	const region = NewfoldRuntime.plugin.region.toUpperCase();

	// bail if not hostgator-latam brand
	if ( brand !== 'hostgator-latam' ) {
		return '';
	}
	// qualify region setting and return region code
	switch ( region ) {
		case 'BR':
		case 'MX':
		case 'CO':
		case 'CL':
			return region;
			break;
		case 'US':
		case false:
		default:
			return 'default';
	}
};

/**
 * Get region specific link value
 *
 * @param {*} link_name   - name for link in regions object
 * @param {*} region_code - region code for reference
 * @param     link_text
 * @return region specific href value for specified link or default
 */
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
 * Supports or can get region specific link value
 *
 * @param {*} link_name   - name for link in regions object
 * @param {*} region_code - region code for reference
 * @return boolean value of whether the region link is present or missing, or is false
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
	params.utm_source = `wp-admin/admin.php?page=hostgator${ window.location.hash }`;
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
