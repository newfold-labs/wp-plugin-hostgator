<?php

namespace HostGator;

/**
 * WPUnit tests for HostGator\LoginRedirect.
 *
 * @coversDefaultClass \HostGator\LoginRedirect
 */
class LoginRedirectWpunitTest extends \lucatume\WPBrowser\TestCase\WPTestCase {

	/**
	 * Match production: redirect requires container capability abTestPluginHome.
	 */
	private function bind_login_redirect_container(): void {
		global $nfd_module_container;
		$nfd_module_container = new class() {
			public function plugin() {
				return new class() {
					/** @var string */
					public $id = 'hostgator';
				};
			}

			public function get( $key ) {
				if ( 'capabilities' === $key ) {
					return new class() {
						public function get( $cap ) {
							return 'abTestPluginHome' === $cap;
						}
					};
				}
				return null;
			}
		};
		require_once codecept_root_dir( 'inc/LoginRedirect.php' );
		LoginRedirect::$container = $nfd_module_container;
	}

	protected function setUp(): void {
		parent::setUp();
		$this->bind_login_redirect_container();
	}

	/** @covers \HostGator\LoginRedirect::is_user */
	public function test_is_user_returns_false_for_null(): void {
		$this->assertFalse( \HostGator\LoginRedirect::is_user( null ) );
	}

	/** @covers \HostGator\LoginRedirect::is_user */
	public function test_is_user_returns_false_for_non_object(): void {
		$this->assertFalse( \HostGator\LoginRedirect::is_user( 'not-a-user' ) );
	}

	/** @covers \HostGator\LoginRedirect::is_user */
	public function test_is_user_returns_true_for_wp_user(): void {
		$user = $this->factory()->user->create_and_get();
		$this->assertTrue( \HostGator\LoginRedirect::is_user( $user ) );
	}

	/** @covers \HostGator\LoginRedirect::is_administrator */
	public function test_is_administrator_returns_true_for_admin(): void {
		$user = $this->factory()->user->create_and_get( array( 'role' => 'administrator' ) );
		$this->assertTrue( \HostGator\LoginRedirect::is_administrator( $user ) );
	}

	/** @covers \HostGator\LoginRedirect::is_administrator */
	public function test_is_administrator_returns_false_for_subscriber(): void {
		$user = $this->factory()->user->create_and_get( array( 'role' => 'subscriber' ) );
		$this->assertFalse( \HostGator\LoginRedirect::is_administrator( $user ) );
	}

	/** @covers \HostGator\LoginRedirect::is_plugin_redirect */
	public function test_is_plugin_redirect_returns_true_for_hostgator_page(): void {
		$url = admin_url( 'admin.php?page=hostgator' );
		$this->assertTrue( \HostGator\LoginRedirect::is_plugin_redirect( $url ) );
	}

	/** @covers \HostGator\LoginRedirect::is_plugin_redirect */
	public function test_is_plugin_redirect_returns_false_for_other_url(): void {
		$this->assertFalse( \HostGator\LoginRedirect::is_plugin_redirect( admin_url( 'index.php' ) ) );
	}

	/** @covers \HostGator\LoginRedirect::get_plugin_dashboard_url */
	public function test_get_plugin_dashboard_url_contains_page_and_hash(): void {
		$url = \HostGator\LoginRedirect::get_plugin_dashboard_url();
		$this->assertStringContainsString( 'admin.php', $url );
		$this->assertStringContainsString( 'page=hostgator', $url );
		$this->assertStringContainsString( '#/home', $url );
	}

	/** @covers \HostGator\LoginRedirect::get_default_redirect_url */
	public function test_get_default_redirect_url_returns_plugin_dashboard_for_admin(): void {
		$admin = $this->factory()->user->create_and_get( array( 'role' => 'administrator' ) );
		wp_set_current_user( $admin->ID );
		$url = \HostGator\LoginRedirect::get_default_redirect_url( 'https://other.example/redirect' );
		$this->assertStringContainsString( 'page=hostgator', $url );
		$this->assertStringContainsString( '#/home', $url );
	}

	/** @covers \HostGator\LoginRedirect::get_default_redirect_url */
	public function test_get_default_redirect_url_returns_passed_url_for_non_admin(): void {
		$user = $this->factory()->user->create_and_get( array( 'role' => 'subscriber' ) );
		wp_set_current_user( $user->ID );
		$passed = 'https://example.com/custom-redirect';
		$this->assertSame( $passed, \HostGator\LoginRedirect::get_default_redirect_url( $passed ) );
	}

	/** @covers \HostGator\LoginRedirect::filter_login_form_defaults */
	public function test_filter_login_form_defaults_sets_redirect_to_plugin_dashboard(): void {
		$admin = $this->factory()->user->create_and_get( array( 'role' => 'administrator' ) );
		wp_set_current_user( $admin->ID );
		$defaults = \HostGator\LoginRedirect::filter_login_form_defaults( array( 'redirect' => admin_url( '/' ) ) );
		$this->assertArrayHasKey( 'redirect', $defaults );
		$this->assertStringContainsString( 'page=hostgator', $defaults['redirect'] );
		$this->assertStringContainsString( '#/home', $defaults['redirect'] );
	}

	/** @covers \HostGator\LoginRedirect::should_redirect */
	public function test_should_redirect_returns_false_when_container_is_null(): void {
		$saved = LoginRedirect::$container;
		$admin = $this->factory()->user->create_and_get( array( 'role' => 'administrator' ) );
		wp_set_current_user( $admin->ID );

		LoginRedirect::$container = null;
		$this->assertFalse( LoginRedirect::should_redirect() );

		LoginRedirect::$container = $saved;
	}

	/** @covers \HostGator\LoginRedirect::should_redirect */
	public function test_should_redirect_returns_false_when_capabilities_service_missing(): void {
		$saved                    = LoginRedirect::$container;
		LoginRedirect::$container = new class() {
			public function plugin() {
				return new class() {
					/** @var string */
					public $id = 'hostgator';
				};
			}

			public function get( $key ) {
				return null;
			}
		};
		$admin = $this->factory()->user->create_and_get( array( 'role' => 'administrator' ) );
		wp_set_current_user( $admin->ID );
		$this->assertFalse( LoginRedirect::should_redirect() );

		LoginRedirect::$container = $saved;
	}

	/** @covers \HostGator\LoginRedirect::on_login_redirect */
	public function test_on_login_redirect_returns_plugin_dashboard_for_admin_when_empty_requested(): void {
		$admin = $this->factory()->user->create_and_get( array( 'role' => 'administrator' ) );
		$result = \HostGator\LoginRedirect::on_login_redirect( admin_url( '/' ), '', $admin );
		$this->assertStringContainsString( 'page=hostgator', $result );
		$this->assertStringContainsString( '#/home', $result );
	}

	/** @covers \HostGator\LoginRedirect::on_login_redirect */
	public function test_on_login_redirect_returns_wp_admin_for_non_admin_when_plugin_requested(): void {
		$user         = $this->factory()->user->create_and_get( array( 'role' => 'subscriber' ) );
		$plugin_url = admin_url( 'admin.php?page=hostgator#/home' );
		$result     = \HostGator\LoginRedirect::on_login_redirect( $plugin_url, $plugin_url, $user );
		$this->assertSame( admin_url( '/' ), $result );
	}

	/** @covers \HostGator\LoginRedirect::on_login_redirect */
	public function test_on_login_redirect_returns_original_when_custom_redirect_requested(): void {
		$admin  = $this->factory()->user->create_and_get( array( 'role' => 'administrator' ) );
		$custom = admin_url( 'edit.php?post_type=page' );
		$result = \HostGator\LoginRedirect::on_login_redirect( $custom, $custom, $admin );
		$this->assertSame( $custom, $result );
	}
}
