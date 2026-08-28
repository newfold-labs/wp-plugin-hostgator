<?php
/**
 * Class that runs checks before loading possibly incompatible code.
 * Checks if incompatible plugins are already active and if so, self deactivate (this plugin).
 * Checks for legacy plugins and deactivates them in favor of self (this plugin).
 * Ensures that only a single notice is displayed per plugin.
 *
 * @package HostGatorWordPressPlugin
 */

namespace HostGator;

/**
 * Class NDF_Plugin_Compat_Check
 *
 * This class is responsible for performing basic checks to see if there are other plugins that would conflict with this one.
 */
class NFD_Plugin_Compat_Check {

	/**
	 * A reference to the main plugin file (relative to plugins dir) or plugin slug
	 *
	 * @var string
	 */
	public $slug;

	/**
	 * Plugin name
	 *
	 * @var string
	 */
	public $name = '';

	/**
	 * Global list of plugins with associated error (to prevent duplicate notices)
	 *
	 * conflict {
	 *  plugin: slug,
	 *  error: WP_Error
	 * }
	 *
	 * @var array
	 */
	public $conflicts;


	/**
	 * Newfold incompatibe plugins
	 * Don't allow this plugin to be installed while these are active.
	 * Deactivate this on activation if incompatible plugin is found.
	 *
	 * @var array
	 */
	public $incompatible_plugins = array();

	/**
	 * Newfold legacy plugins
	 * If active when this plugin activates, deactivate legacy plugin to avoid conflict.
	 * Deactivate legacy on activation of this.
	 *
	 * @var array
	 */
	public $legacy_plugins = array();

	/**
	 * Setup our class properties
	 *
	 * @param string $file Plugin file
	 */
	public function __construct( $file ) {
		require_once ABSPATH . '/wp-admin/includes/plugin.php';
		// require_once ABSPATH . '/wp-includes/option.php';
		$this->slug      = $this->get_plugin_slug( $file );
		$this->name      = $this->get_plugin_name( $file );
		$conflicts       = get_option( 'nfd_plugins_compat_check_conflicts', array() );
		$this->conflicts = is_array( $conflicts ) ? $conflicts : array();
	}

	/**
	 * Get the plugin name from the plugin file headers
	 *
	 * @param string $file Plugin file
	 * @return string
	 */
	public function get_plugin_name( $file ) {
		$plugin = get_file_data( $file, array( 'name' => 'Plugin Name' ) );
		return isset( $plugin['name'] ) ? $plugin['name'] : '';
	}

	/**
	 * Get the plugin slug from the plugin path
	 *
	 * @param string $file Plugin file
	 * @return string
	 */
	public function get_plugin_slug( $file ) {
		$wp = ABSPATH . 'wp-content/plugins/';
		if ( strpos( $file, $wp ) === 0 ) {
			$file = substr( $file, strlen( $wp ) );
		}
		return $file;
	}

	/**
	 * Check all our plugin requirements.
	 * Displays an admin notice and deactivates the plugin if all requirements are not met.
	 */
	public function check_plugin_requirements() {
		$this->prune_stale_conflicts();

		if ( ! empty( $this->incompatible_plugins ) ) {
			$this->check_incompatible_plugins();

			// Incompatible plugin error
			if ( $this->has_errors() ) {
				// Suppress 'Plugin Activated' notice
				unset( $_GET['activate'] ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
				$this->deactivate();
				add_action( 'admin_notices', array( $this, 'admin_notices' ) );

				// Fail check, disable self
				return false;
			}
		}

		if ( ! empty( $this->legacy_plugins ) ) {
			$this->check_legacy_plugins();

			// Legacy plugin error
			if ( $this->has_errors() ) {
				// Suppress 'Plugin Activated' notice
				unset( $_GET['activate'] ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
				$this->deactivate();
				add_action( 'admin_notices', array( $this, 'admin_notices' ) );

				// Pass check, but disable other plugin
				return true;
			}
		}

		// Pre-existing conflict found
		// and the errors are loaded from option without displaying the notice yet
		if ( $this->has_errors() ) {
			add_action( 'admin_notices', array( $this, 'admin_notices' ) );
		}

		// Pass check, enable self
		return true;
	}

	/**
	 * Drop stored conflicts that no longer apply.
	 *
	 * A leftover nfd_plugins_compat_check_conflicts option must not keep
	 * self-deactivating this plugin after the incompatible plugin is gone.
	 */
	public function prune_stale_conflicts() {
		if ( empty( $this->conflicts ) ) {
			return;
		}

		$incompatible_files = array_values( $this->incompatible_plugins );
		$legacy_files       = array_values( $this->legacy_plugins );
		$kept               = array();

		foreach ( $this->conflicts as $conflict ) {
			if ( ! is_array( $conflict ) || empty( $conflict['slug'] ) ) {
				continue;
			}

			$slug = $conflict['slug'];

			if ( $slug === $this->slug ) {
				if ( $this->is_any_plugin_active( $incompatible_files ) ) {
					$kept[] = $conflict;
				}
				continue;
			}

			if ( in_array( $slug, $legacy_files, true ) && $this->is_plugin_currently_active( $slug ) ) {
				$kept[] = $conflict;
			}
		}

		if ( $kept === $this->conflicts ) {
			return;
		}

		$this->conflicts = $kept;
		if ( empty( $this->conflicts ) ) {
			delete_option( 'nfd_plugins_compat_check_conflicts' );
			return;
		}

		update_option( 'nfd_plugins_compat_check_conflicts', $this->conflicts );
	}

	/**
	 * Whether any plugin in the list is currently active.
	 *
	 * @param array $plugin_files Plugin basenames.
	 * @return bool
	 */
	protected function is_any_plugin_active( $plugin_files ) {
		foreach ( $plugin_files as $plugin_file ) {
			if ( $this->is_plugin_currently_active( $plugin_file ) ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Whether a plugin basename is currently active.
	 *
	 * @param string $plugin_file Plugin basename.
	 * @return bool
	 */
	protected function is_plugin_currently_active( $plugin_file ) {
		return function_exists( 'is_plugin_active' ) && is_plugin_active( $plugin_file );
	}

	/**
	 * Check if a incompatible plugin is active.
	 */
	public function check_incompatible_plugins() {
		foreach ( $this->incompatible_plugins as $incompatible_name => $incompatible_file ) {
			$conflict_plugins = array_column( $this->conflicts, 'slug' );
			if ( function_exists( 'is_plugin_active' ) && is_plugin_active( $incompatible_file ) && ! in_array( $this->slug, $conflict_plugins, true ) ) {
				$error = new \WP_Error();
				$error->add(
					'nfd_plugin_incompatible',
					sprintf(
						/* translators: 1: plugin name 2: incompatible plugin name */
						__( '"%1$s" has self-deactivated. It is incompatible with "%2$s".', 'wp-plugin-hostgator' ),
						$this->name,
						$incompatible_name
					)
				);
				$this->conflicts[] = array(
					'slug'   => $this->slug,
					'source' => $this->slug,
					'error'  => $error,
				);
				update_option( 'nfd_plugins_compat_check_conflicts', $this->conflicts );
			}
		}
	}

	/**
	 * Check if a legacy plugin is active.
	 */
	public function check_legacy_plugins() {
		foreach ( $this->legacy_plugins as $legacy_name => $legacy_file ) {
			$conflict_plugins = array_column( $this->conflicts, 'slug' );
			if ( function_exists( 'is_plugin_active' ) && is_plugin_active( $legacy_file ) && ! in_array( $legacy_file, $conflict_plugins, true ) ) {
				$error = new \WP_Error();
				$error->add(
					'nfd_plugin_legacy',
					sprintf(
						/* translators: 1: legacy plugin name 2: plugin name */
						__( '"%1$s" has been deactivated. It is incompatible with "%2$s".', 'wp-plugin-hostgator' ),
						$legacy_name,
						$this->name
					)
				);
				$this->conflicts[] = array(
					'slug'   => $legacy_file,
					'source' => $this->slug,
					'error'  => $error,
				);
				update_option( 'nfd_plugins_compat_check_conflicts', $this->conflicts );
			}
		}
	}

	/**
	 * Check if any errors were encountered during our plugin checks
	 *
	 * @return bool
	 */
	public function has_errors() {
		foreach ( $this->conflicts as $conflict ) {
			if ( is_array( $conflict ) && isset( $conflict['source'] ) && $conflict['source'] === $this->slug ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Deactivate the plugin
	 */
	public function deactivate() {
		$conflict_plugins = array_column( $this->conflicts, 'slug' );
		if ( function_exists( 'deactivate_plugins' ) ) {
			deactivate_plugins( $conflict_plugins );
		}
	}

	/**
	 * Display error messages in the admin
	 */
	public function admin_notices() {
		$conflict_errors = array_column( $this->conflicts, 'error' );
		foreach ( $conflict_errors as $error ) {
			if ( \is_wp_error( $error ) ) {
				echo '<div class="notice notice-error is-dismissible">';
				echo '<p>' . esc_html( $error->get_error_message() ) . '</p>';
				echo '</div>';
			}
		}
		delete_option( 'nfd_plugins_compat_check_conflicts' );
	}
}
