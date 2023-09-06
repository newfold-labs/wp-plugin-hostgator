import { addQueryArgs } from '@wordpress/url';
import { dispatch } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { NewfoldRuntime } from "@newfold-labs/wp-module-runtime";
import region from '../data/region';

let lastNoticeId;
const HG_NAV = document.querySelector('#toplevel_page_hostgator .wp-submenu');
/**
 * Set active nav in wp admin sub pages.
 *
 * @param  path
 */
export const setActiveSubnav = (path) => {
	if (HG_NAV) {
		const HG_NAV_LIS = HG_NAV.children;
		if (HG_NAV_LIS) {
			for (let i = 0; i < HG_NAV_LIS.length; i++) {
				// get all children li elements
				const link = HG_NAV_LIS[i].children[0];
				if (link) {
					const href = link.getAttribute('href');
					// check each child a href for match with path
					if (
						href.endsWith(path) || // match
						(path.includes('/marketplace/') &&
							href.endsWith('marketplace')) ||
						(path === '/' && href.endsWith('home'))
					) {
						// highlight home subnav for root page
						// update li class when match
						HG_NAV_LIS[i].classList.add('current');
					} else {
						HG_NAV_LIS[i].classList.remove('current');
					}
					// highlight our home nav for root level access
					const HG_HOME_NAV = document.querySelector(
						'.hgwp-nav a[href="#/home"]'
					);
					if (HG_HOME_NAV) {
						if (path === '/' || path === '/home') {
							HG_HOME_NAV.classList.add('active');
						} else {
							HG_HOME_NAV.classList.remove('active');
						}
					}
				}
			}
		}
	}
};

/**
 * Wrapper method to dispatch snackbar notice
 *
 * @param  string text text for notice
 * @param  text
 */
export const dispatchUpdateSnackbar = (text = 'Settings Saved') => {
	//clear previous notice so they don't stack up when quickly saving multiple settings
	dispatch('core/notices').removeNotice(lastNoticeId);

	//make new
	dispatch('core/notices')
		.createNotice('info', text, {
			type: 'snackbar',
			isDismissible: true,
		})
		.then((result) => {
			// save as notice to dismiss later
			lastNoticeId = result.notice.id;
		});
};

/**
 * Wrapper method to post setting to hostgator endpoint
 *
 * @param {*} data object of data
 * @param passError setter for the error in component
 * @param thenCallback method to call in promise then
 * @return apiFetch promise
 */
export const hostgatorSettingsApiFetch = (data, passError, thenCallback) => {
	return apiFetch({
		url: NewfoldRuntime.createApiUrl( '/hostgator/v1/settings' ),
		method: 'POST',
		data,
	})
		.then((response) => {
			thenCallback(response);
		})
		.catch((error) => {
			passError(error);
		});
};

/**
 * Wrapper method to post request to hostgator cache endpoint
 *
 * @param {*} data object of data
 * @param passError setter for the error in component
 * @param thenCallback method to call in promise then
 * @return apiFetch promise
 */
export const hostgatorPurgeCacheApiFetch = (data, passError, thenCallback) => {
	return apiFetch({
		url: NewfoldRuntime.createApiUrl( '/hostgator/v1/caching' ),
		method: 'DELETE',
		data,
	})
		.then((response) => {
			thenCallback(response);
		})
		.catch((error) => {
			console.log(error);
			passError(error);
		});
};

/**
 * Coming soon admin bar
 */
export const comingSoonAdminbarToggle = ( comingSoon ) => {
	const comingsoonadminbar = document.getElementById(
		'nfd-site-status-text'
	);
	if ( ! comingsoonadminbar ) {
		return;
	}
	if ( ! comingSoon ) {
		comingsoonadminbar.style.color = "#048200";
		comingsoonadminbar.textContent = "Live";
	} else {
		comingsoonadminbar.style.color = "#E01C1C";
		comingsoonadminbar.textContent = "Coming Soon";
	}
};

/**
 * Get the current region value
 * @returns string - 2 char country code for region - or empty string for default region
 */
export const getRegionValue = () => {
	const brand  = NewfoldRuntime.sdk.plugin.brand;
	const region = NewfoldRuntime.sdk.plugin.region;

	// bail if not hostgator-latam brand
	if ( brand !== 'hostgator-latam' ){
		return '';
	}
	// qualify region setting and return region code
	switch ( region ) {
		case 'BR':
			return region;
			break;
		case 'MX':
		case 'CO':
		case 'CL':
			return region;
			break;
		case false:
		default:
			return '';
	}
};

/**
 * Get region specific link value
 * 
 * @param {*} link_name - name for link in regions object
 * @param {*} region_code  - region code for reference
 * @returns region specific href value for specified link or default
 */
export const getLinkPerRegion = (link_name = 'main', link_text) => {
	let region_code = getRegionValue();

	// ensure there's a link value match
	if ( region[link_name] && region[link_name][region_code] ) {
		// automatically add utm params
		return addUtmParams( region[link_name][region_code], {
			utm_term: link_text,
			utm_content: link_name
		});
	} else {
		// if no match return default and automatically add utm params
		return addUtmParams( region[link_name]['default'], {
			utm_term: link_text,
			utm_content: link_name
		});
	}

};

/**
 * Supports or can get region specific link value
 * 
 * @param {*} link_name - name for link in regions object
 * @param {*} region_code  - region code for reference
 * @returns boolean value of whether the region link is present or missing, or is false
 */
export const supportsLinkPerRegion = (link_name = 'main') => {
	let region_code = getRegionValue();
	// ensure there's a link value to check
	if ( region[link_name] && region[link_name][region_code] ) {
		// if value exists return true - unless value itself is false, then return false
		return region[link_name][region_code] !== 'false';
	} else {
		// if no match, we'll return default
		return true;
	}

};

/**
 * Decorates an external link URL with UTM params.
 *
 * The utm_term, if passed, should be the link anchor text.
 * The utm_content, if passed, should be the unique identifier for the link.
 * The utm_campaign is optional and reserved for special occasions.
 *
 * @param {string} url The original URL.
 * @param {Object} params The URL parameters to add.
 *
 * @return {string} The new URL.
 */
 export const addUtmParams = (url, params = {})  => {
	params.utm_source = `wp-admin/admin.php?page=hostgator${ window.location.hash }`;
	params.utm_medium = 'hostgator_plugin';
	return addQueryArgs(url, params);
};
