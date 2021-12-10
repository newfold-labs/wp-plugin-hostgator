<?php
/**
 * Set up admin menu for the plugin
 * 
 * @package HostGatorWordPressPlugin
 */

require_once HOSTGATOR_PLUGIN_DIR . '/assets/svg/snappy.php';

function hgwpp_add_menu() {
    global $snappy;
    add_menu_page(
        __( 'HostGator', 'hostgator-wordpress-plugin' ),
        __( 'HostGator', 'hostgator-wordpress-plugin' ),
        'manage_options',
        'hostgator',
        'nfd_hostgator_contents',
        $snappy,
        3
    );
}
add_action( 'admin_menu', 'hgwpp_add_menu');

function nfd_hostgator_contents() {
    ?>
        <div id="hwa-app" class="hgwpp hgwpp_app">
            <h1><?php esc_html_e( 'HostGator', 'hostgator-wordpress-plugin' ); ?></h1>
            <p>Welcome to HostGator Plugin!</p>
        </div>
    <?php
}