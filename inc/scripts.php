<?php
/**
 * Set up any scripts (and styles) for the plugin
 * 
 * @package HostGatorWordPressPlugin
 */


function hgwpp_admin_scripts() {
    $screen = get_current_screen();

    if( false !== strpos( $screen->id, 'hostgator' ) ) {       
        wp_enqueue_script(
            'hgwpp-scripts',
            HOSTGATOR_PLUGIN_URL . 'build/' . HOSTGATOR_PLUGIN_VERSION . '/index.js',
            array('lodash', 'react', 'wp-dom-ready', 'wp-element', 'wp-i18n'),
            HOSTGATOR_PLUGIN_VERSION,
            true
        );
    }
}

add_action( 'admin_enqueue_scripts', 'hgwpp_admin_scripts');