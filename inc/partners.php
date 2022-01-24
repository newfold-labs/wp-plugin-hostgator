<?php

/**
 * WPForms upgrade affiliate link.
 *
 * @param string $url Destination URL.
 *
 * @return string
 */
function hostgator_wpforms_upgrade_affiliate_link( $url ) {
	return 'http://www.shareasale.com/r.cfm?B=837827&U=1258907&M=64312&urllink=' . rawurlencode( $url );
}

add_filter( 'wpforms_upgrade_link', 'hostgator_wpforms_upgrade_affiliate_link' );

/**
 * All-in-One SEO upgrade affiliate link.
 *
 * @param string $url Destination URL.
 *
 * @return string
 */
function hostgator_aioseo_upgrade_affiliate_link( $url ) {
	return 'http://www.shareasale.com/r.cfm?B=1491200&U=1258907&M=94778&urllink=' . rawurlencode( $url );
}

add_filter( 'aioseo_upgrade_link', 'hostgator_aioseo_upgrade_affiliate_link' );
