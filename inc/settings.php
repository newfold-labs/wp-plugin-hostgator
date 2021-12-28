<?php 

/**
 * Filter wp revisions according to plugin setting
 */
function nfd_settings_revisions( $num, $post ) {
    return get_option( 'nfd_wp_post_revisions', 5 );
}
add_filter( 'wp_revisions_to_keep', 'nfd_settings_revisions', 10, 2 );

if ( !defined( 'EMPTY_TRASH_DAYS' ) ){
    $nfd_empty_trash_days = get_option('nfd_empty_trash_days', 30);
    define( 'EMPTY_TRASH_DAYS', $nfd_empty_trash_days );
}