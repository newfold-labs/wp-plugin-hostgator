import { dispatch } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

let lastNoticeId;
const HG_NAV = document.querySelector('#toplevel_page_hostgator .wp-submenu');
/**
 * Set active nav in wp admin sub pages.
 */
 export const setActiveSubnav = ( path ) => {
    if ( HG_NAV ) {
        const HG_NAV_LIS = HG_NAV.children;
        if ( HG_NAV_LIS ) {
            for( var i = 0; i < HG_NAV_LIS.length; i++ ){
                // get all children li elements
                let link = HG_NAV_LIS[i].children[0];
                if (link) {
                    let href = link.getAttribute('href')
                    // check each child a href for match with path
                    if ( href.endsWith( path ) || // match
                        path === '/' && href.endsWith('home') ) { // highlight home subnav for root page
                        // update li class when match
                        HG_NAV_LIS[i].classList.add('current');
                    } else {
                        HG_NAV_LIS[i].classList.remove('current');
                    }
                    // highlight our home nav for root level access
                    const HG_HOME_NAV = document.querySelector('.hgwp-nav a[href="#/home"]');
                    if( HG_HOME_NAV ) {
                        if ( path === '/' || path === '/home' ) {
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
 * @param string text text for notice
 */
export const dispatchUpdateSnackbar = ( text = 'Settings Saved' ) => {
    //clear previous notice so they don't stack up when quickly saving multiple settings
    dispatch('core/notices').removeNotice( lastNoticeId );

    //make new
    dispatch('core/notices').createNotice(
        'info',
        text,
        {
            type: 'snackbar',
            isDismissible: true,
        }
    ).then( ( result ) => {
        // save as notice to dismiss later
        lastNoticeId = result.notice.id;
    });
    
};

/**
 * Wrapper method to post setting to hostgator endpoint
 * @param {*} data object of data
 * @returns 
 */
export const hostgatorSettingsApiFetch = ( data ) => { 
    return apiFetch( 
        {
            path: 'hostgator/v1/settings', 
            method: 'POST', 
            data
        } 
    );
};

/**
 * Wrapper method to post request to hostgator cache endpoint
 * @param {*} data object of data
 * @returns 
 */
 export const hostgatorPurgeCacheApiFetch = ( data ) => { 
    return apiFetch( 
        {
            path: 'hostgator/v1/caching', 
            method: 'DELETE', 
            data
        } 
    );
};