<?php
/**
 * Class that runs checks before loading possibly incompatible code.
 *
 * @package HostGatorWordPressPlugin
 */

Namespace HostGator;

/**
 * Class NDF_Plugin_Compat_Check
 *
 * This class is responsible for performing basic checks to see if there are other plugins that would conflict with this one.
 */
class NFD_Plugin_Compat_Check {

	/**
	 * Callbacks for additional checks
	 *
	 * @var array
	 */
	public $callbacks = array();

	/**
	 * Collection of errors
	 *
	 * @var \WP_Error
	 */
	public $errors;

	/**
	 * A reference to the main plugin file
	 *
	 * @var string
	 */
	public $file;

	/**
	 * Plugin name
	 *
	 * @var string
	 */
	public $name = '';

	/**
	 * Newfold plugins if order of priority ('Name' => 'slug')
	 *
	 * @var array
	 */
	public $nfd_incompatible_plugins = array(
		'Bluehost' => 'bluehost-wordpress-plugin/bluehost-wordpress-plugin.php',
	);

	/**
	 * Setup our class properties
	 *
	 * @param string $file Plugin file
	 */
	public function __construct( $file ) {
		$this->errors = new \WP_Error();
		$this->file   = $file;
		$this->name   = $this->get_plugin_name();
	}

	/**
	 * Get the plugin name from the plugin file headers
	 *
	 * @return string
	 */
	public function get_plugin_name() {
		$plugin = get_file_data( $this->file, array( 'name' => 'Plugin Name' ) );

		return isset( $plugin['name'] ) ? $plugin['name'] : '';
	}

	/**
	 * Check all our plugin requirements.
	 * Displays an admin notice and deactivates the plugin if all requirements are not met.
	 */
	public function check_plugin_requirements() {

		if ( ! empty( $this->nfd_incompatible_plugins ) ) {
			$this->check_incompatible_plugins();
		}

		if ( ! empty( $this->callbacks ) ) {
			foreach ( $this->callbacks as $callback ) {
				if ( is_callable( $callback ) ) {
					call_user_func_array( $callback, array( $this ) );
				}
			}
		}
		if ( $this->has_errors() ) {
			// Suppress 'Plugin Activated' notice
			unset( $_GET['activate'] ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$this->deactivate();
			add_action( 'admin_notices', array( $this, 'admin_notices' ) );

			return false;
		}

		return true;
	}

	/**
	 * Check if a incompatible plugin is active.
	 */
	public function check_incompatible_plugins() {
		foreach ( $this->nfd_incompatible_plugins as $incompatible_name => $incompatible_plugin ) {
			require_once ABSPATH . '/wp-admin/includes/plugin.php';
			if ( function_exists( 'is_plugin_active' ) && is_plugin_active( $incompatible_plugin ) ) {
				$this->errors->add(
					'nfd_plugin',
					/* translators: 1: plugin name 2: incompatible plugin */
					sprintf( __( 'The "%1$s" plugin is incompatible with the "%2$s" plugin.', 'mojo-marketplace-wp-plugin' ), $this->name, $incompatible_name )
				);
			}
		}
	}

	/**
	 * Check if any errors were encountered during our plugin checks
	 *
	 * @return bool
	 */
	public function has_errors() {
		return (bool) count( $this->errors->errors );
	}

	/**
	 * Deactivate the plugin
	 */
	public function deactivate() {
		require_once ABSPATH . '/wp-admin/includes/plugin.php';
		if ( function_exists( 'deactivate_plugins' ) ) {
			deactivate_plugins( $this->file );
		}
	}

	/**
	 * Display error messages in the admin
	 */
	public function admin_notices() {
		echo '<div class="error">';
		foreach ( $this->errors->get_error_messages() as $msg ) {
			echo '<p>' . esc_html( $msg ) . '</p>';
		}
		echo '<p>';
		/* translators: plugin name */
		printf( esc_html__( 'The "%s" plugin has been deactivated.', 'mojo-marketplace-wp-plugin' ), esc_html( $this->name ) );
		echo '</p></div>';
	}

}
