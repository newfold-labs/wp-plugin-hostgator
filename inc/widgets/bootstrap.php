<?php
/**
 * Widgets bootstrap file
 *
 * @package HostGatorWordPressPlugin
 */

namespace HostGator;

require_once HOSTGATOR_PLUGIN_DIR . '/inc/widgets/SitePreview.php';

if ( is_admin() ) {
	new HostGatorSitePreviewWidget();
}
