import { dispatch } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

let lastNoticeId;

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
export const hostgatorApiFetch = ( data ) => { 
    return apiFetch( 
        {
            path: 'hostgator/v1/settings', 
            method: 'POST', 
            data
        } 
    );
};
