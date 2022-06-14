<?php
/**
 * Handle updates for version 1.0.3
 *
 * Update the plugin legacy coming soon option.
 *
 * @package HostGatorWordPressPlugin
 */

// Migrate any exisint legacy coming soon setting.
if ( 'true' === get_option( 'mm_coming_soon', 'false' ) ) {
	add_option( 'nfd_coming_soon', 'true' );
}
