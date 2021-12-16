<?php

/**
 * Instantiate controllers and register routes.
 */
function hostgator_init_rest_api() {

	$controllers = array(
		'HostGator\\RestApi\\SettingsController',
	);

	foreach ( $controllers as $controller ) {
		/**
		 * Get an instance of the WP_REST_Controller.
		 *
		 * @var $instance WP_REST_Controller
		 */
		$instance = new $controller();
		$instance->register_routes();
	}
}

add_action( 'rest_api_init', 'hostgator_init_rest_api' );
