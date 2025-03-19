<?php
/**
 * This file adds filters for partler links.
 *
 * @package HostGatorWordPressPlugin
 */

namespace HostGator;

/**
 * WPForms upgrade affiliate link.
 *
 * @param string $url Destination URL.
 *
 * @return string
 */
function wpforms_upgrade_affiliate_link( $url ) {
	return 'http://www.shareasale.com/r.cfm?B=837827&U=1258907&M=64312&urllink=' . rawurlencode( $url );
}

// add_filter( 'wpforms_upgrade_link', __NAMESPACE__ . '\\wpforms_upgrade_affiliate_link' );

/**
 * All-in-One SEO upgrade affiliate link.
 *
 * @param string $url Destination URL.
 *
 * @return string
 */
function aioseo_upgrade_affiliate_link( $url ) {
	return 'http://www.shareasale.com/r.cfm?B=1491200&U=1258907&M=94778&urllink=' . rawurlencode( $url );
}

// add_filter( 'aioseo_upgrade_link', __NAMESPACE__ . '\\aioseo_upgrade_affiliate_link' );

/**
 * Remove Blocked ShareASale ID from OptinMonster, WPForms, and MonsterInsights.
 *
 * @param string $value The ShareASale ID.
 *
 * @return string|bool
 */
function nfd_remove_sas_id( $value ) {
	$blocked_sas_id = '1258907';
	if ( $value === $blocked_sas_id ) {
		return false;
	}
	return $value;
}

add_filter( 'option_optinmonster_trial_id', __NAMESPACE__ . '\\nfd_remove_sas_id' );
add_filter( 'option_wpforms_shareasale_id', __NAMESPACE__ . '\\nfd_remove_sas_id' );
add_filter( 'option_monsterinsights_shareasale_id', __NAMESPACE__ . '\\nfd_remove_sas_id' );
