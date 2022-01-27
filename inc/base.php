<?php
/**
 * Base functions
 *
 * @package           HostGatorWordPressPlugin
 */

/**
 * Check if plugin install date exists.
 *
 * @return bool
 */
function bh_has_plugin_install_date() {
	return ! empty( get_option( 'bh_plugin_install_date', '' ) );
}

/**
 * Get the plugin install date.
 *
 * @return string
 */
function bh_get_plugin_install_date() {
	return (string) get_option( 'bh_plugin_install_date', gmdate( 'U' ) );
}

/**
 * Set the plugin install date.
 *
 * @param string $value Date in Unix timestamp format.
 */
function bh_set_plugin_install_date( $value ) {
	update_option( 'bh_plugin_install_date', $value, true );
}


/**
 * Get the number of days since the plugin was installed.
 *
 * @return int
 */
function bh_get_days_since_plugin_install_date() {
	return absint( ( gmdate( 'U' ) - bh_get_plugin_install_date() ) / DAY_IN_SECONDS );
}

/**
 * Get the client IP address.
 *
 * @return string
 */
function bh_get_client_ip() {

	// Default to REMOTE_ADDR
	$ip = ( isset( $_SERVER['REMOTE_ADDR'] ) ) ? $_SERVER['REMOTE_ADDR'] : null;

	$proxy_headers = array(
		'HTTP_CF_CONNECTING_IP', // CloudFlare
		'HTTP_FASTLY_CLIENT_IP', // Fastly
		'HTTP_INCAP_CLIENT_IP', // Incapsula
		'HTTP_TRUE_CLIENT_IP', // CloudFlare Enterprise
		'HTTP_X_FORWARDED_FOR', // Any proxy
		'HTTP_X_SUCURI_CLIENTIP', // Sucuri
	);

	// Check for alternate headers indicating a forwarded IP address
	foreach ( $proxy_headers as $proxy_header ) {
		if ( ! empty( $_SERVER[ $proxy_header ] ) ) {
			$forwarded_ips = explode( ',', $_SERVER[ $proxy_header ] );
			$forwarded_ip  = array_shift( $forwarded_ips );
			if ( $forwarded_ip ) {
				$ip = $forwarded_ip;
				break;
			}
		}
	}

	return $ip;
}
