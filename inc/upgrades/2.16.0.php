<?php
/**
 * Handle updates for version 2.16.0
 *
 * AUTO_INCREMENT fix for the options table.
 *
 * @package HostGatorWordPressPlugin
 */

use HostGator\AutoIncrement;

require_once __DIR__ . '/../AutoIncrement.php';

global $wpdb;

( new AutoIncrement( $wpdb ) )
	->fix_auto_increment( 'options', 'option_id' );