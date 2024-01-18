<?php
/**
 * All data retrieval and saving happens from this file.
 *
 * @package HostGatorWordPressPlugin
 */

namespace HostGator;

/**
 * \HostGator\Data
 * This class does not have a constructor to get instantiated, just static methods.
 */
final class Data {

	/**
	 * Data loaded onto window.NewfoldRuntime
	 *
	 * @return array
	 */
	public static function runtime() {
		global $nfd_module_container;

		$runtime = array(
			'plugin' => array(
				'url'     => HOSTGATOR_BUILD_URL,
				'version' => HOSTGATOR_PLUGIN_VERSION,
				'assets'  => HOSTGATOR_PLUGIN_URL . 'assets/',
				'brand'   => $nfd_module_container->plugin()->brand,
				'region'  => $nfd_module_container->plugin()->region,
			),
		);

		return $runtime;
	}
}
