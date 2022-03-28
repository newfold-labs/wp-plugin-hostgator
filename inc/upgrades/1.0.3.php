<?php
/**
 * Handle updates for version 0.9.1
 *
 * Sync the plugin's auto-update settings with the new, WordPress Core options.
 *
 * @package HostGatorWordPressPlugin
 */

// Migrate any exisint legacy coming soon setting.
if ( 'true' === get_option( 'mm_coming_soon', 'false' ) ) {
	add_option( 'nfd_coming_soon', 'true' );
}
