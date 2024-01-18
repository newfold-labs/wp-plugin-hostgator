<?php

namespace HostGator;

/**
 * Class LoginRedirect
 *
 * @package HostHostGatorWordPressPluginGator
 */
class LoginRedirect {

	/**
	 * A reference to the Container
	 *
	 * @var \NewfoldLabs\WP\ModuleLoader\Container
	 */
	public static $container;

	/**
	 * Initialize the login redirect functionality.
	 */
	public static function init() {

		global $nfd_module_container;
		self::$container = $nfd_module_container;

		add_action( 'login_redirect', array( __CLASS__, 'on_login_redirect' ), 10, 3 );
		add_action( 'login_init', array( __CLASS__, 'on_login_init' ), 10, 3 );
		add_action( 'admin_init', array( __CLASS__, 'disable_yoast_onboarding_redirect' ), 2 );

		add_filter( 'login_form_defaults', array( __CLASS__, 'filter_login_form_defaults' ) );
		add_filter( 'newfold_sso_success_url_default', array( __CLASS__, 'get_default_redirect_url' ) );
	}

	/**
	 * Check if we should redirect.
	 * Redirect only if abTestPluginHome capability is true
	 *
	 * @return boolean
	 */
	public static function should_redirect() {
		return current_user_can( 'manage_options' ) && self::$container->get( 'capabilities' )->get( 'abTestPluginHome' );
	}

	/**
	 * Get default redirect URL.
	 *
	 * @param string $url - the redirect url
	 *
	 * @return string
	 */
	public static function get_default_redirect_url( $url ) {
		return self::should_redirect() ? self::get_plugin_dashboard_url() : $url;
	}

	/**
	 * Set the $_REQUEST['redirect_to'] value on the login_init action since there isn't a better way to do it before
	 * WordPress automatically defaults it to the WordPress dashboard URL.
	 */
	public static function on_login_init() {
		if ( ! isset( $_REQUEST['redirect_to'] ) && self::should_redirect() ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$_REQUEST['redirect_to'] = self::get_plugin_dashboard_url();
		}
	}

	/**
	 * Set default redirect used in the wp_login_form() function.
	 *
	 * @param array $defaults Collection of existing defaults.
	 *
	 * @return array
	 */
	public static function filter_login_form_defaults( array $defaults ) {
		if ( self::should_redirect() ) {
			$defaults['redirect'] = self::get_plugin_dashboard_url();
		}

		return $defaults;
	}

	/**
	 * Customize the login redirect URL if one hasn't already been set.
	 *
	 * @param string   $redirect_to Current redirect URL.
	 * @param string   $requested_redirect_to Requested redirect URL.
	 * @param \WP_User $user WordPress user.
	 *
	 * @return string
	 */
	public static function on_login_redirect( $redirect_to, $requested_redirect_to, $user ) {

		if ( self::is_user( $user ) && self::should_redirect() ) {
			// If no redirect is defined and the user is an administrator, redirect to the Plugin dashboard.
			if ( ( empty( $requested_redirect_to ) || admin_url( '/' ) === $requested_redirect_to ) && self::is_administrator( $user ) ) {
				return self::get_plugin_dashboard_url();
			}

			// If the user isn't an admin and the redirect is to the Plugin dashboard, point them to the WP dashboard instead.
			if ( ! self::is_administrator( $user ) && self::is_plugin_redirect( $requested_redirect_to ) ) {
				return admin_url( '/' );
			}
		}

		return $redirect_to;
	}

	/**
	 * Disable Yoast onboarding redirect.
	 */
	public static function disable_yoast_onboarding_redirect() {
		if ( class_exists( 'WPSEO_Options' ) && self::should_redirect() ) {
			\WPSEO_Options::set( 'should_redirect_after_install_free', false );
		}
	}

	/**
	 * Check if we have a valid user.
	 *
	 * @param \WP_User $user The WordPress user object.
	 *
	 * @return bool
	 */
	public static function is_user( $user ) {
		return $user && is_object( $user ) && is_a( $user, 'WP_User' );
	}

	/**
	 * Check if a user is an administrator.
	 *
	 * @param \WP_User $user WordPress user.
	 *
	 * @return bool
	 */
	public static function is_administrator( $user ) {
		return self::is_user( $user ) && $user->has_cap( 'manage_options' );
	}

	/**
	 * Check if the current redirect is to the Plugin plugin.
	 *
	 * @param string $redirect The current redirect URL.
	 *
	 * @return bool
	 */
	public static function is_plugin_redirect( $redirect ) {
		$plugin_id = self::get_plugin_id();

		return false !== strpos( $redirect, admin_url( 'admin.php?page=' . $plugin_id ) );
	}

	/**
	 * Get the Plugin dashboard URL.
	 *
	 * @return string
	 */
	public static function get_plugin_dashboard_url() {
		$plugin_id = self::get_plugin_id();

		return admin_url( 'admin.php?page=' . $plugin_id . '#/home' );
	}

	/**
	 * Get the Plugin dashboard URL.
	 *
	 * @return string
	 */
	public static function get_plugin_id() {
		return self::$container->plugin()->id;
	}
}

LoginRedirect::init();
