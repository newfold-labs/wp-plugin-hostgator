<?php

namespace HostGator;

/**
 * WPUnit tests for HostGator REST API (settings route registration and permission).
 *
 * @coversDefaultClass \HostGator\RestApi\SettingsController
 */
class RestApiWpunitTest extends \lucatume\WPBrowser\TestCase\WPTestCase {

	/**
	 * Set up test; load REST API controller and init.
	 */
	protected function setUp(): void {
		parent::setUp();
		$root = codecept_root_dir();
		require_once $root . 'inc/RestApi/SettingsController.php';
		require_once $root . 'inc/RestApi/rest-api.php';
	}

	/**
	 * Asserts the HostGator settings REST route is registered.
	 *
	 * @covers \HostGator\init_rest_api
	 */
	public function test_hostgator_v1_settings_route_registered(): void {
		do_action( 'rest_api_init' );
		$routes = rest_get_server()->get_routes();
		$this->assertArrayHasKey( '/hostgator/v1/settings', $routes );
	}

	/**
	 * Asserts the settings route supports GET and at least one of POST/PUT/PATCH.
	 *
	 * @covers \HostGator\RestApi\SettingsController::register_routes
	 */
	public function test_settings_route_supports_get_and_edit_methods(): void {
		do_action( 'rest_api_init' );
		$routes = rest_get_server()->get_routes();
		$route  = $routes['/hostgator/v1/settings'] ?? null;
		$this->assertNotNull( $route );
		$all_methods = array();
		foreach ( $route as $endpoint ) {
			$all_methods = array_merge( $all_methods, array_keys( $endpoint['methods'] ?? array() ) );
		}
		$this->assertContains( 'GET', $all_methods );
		$has_editable = in_array( 'POST', $all_methods, true ) || in_array( 'PUT', $all_methods, true ) || in_array( 'PATCH', $all_methods, true );
		$this->assertTrue( $has_editable, 'Settings route should support an editable method (POST/PUT/PATCH)' );
	}

	/**
	 * Asserts unauthenticated GET request returns 401.
	 *
	 * @covers \HostGator\RestApi\SettingsController::check_permission
	 */
	public function test_settings_get_requires_authentication(): void {
		do_action( 'rest_api_init' );
		wp_set_current_user( 0 );
		$request  = new \WP_REST_Request( 'GET', '/hostgator/v1/settings' );
		$response = rest_do_request( $request );
		$this->assertTrue( $response->is_error(), 'Unauthenticated request should return an error' );
		$data = $response->get_data();
		$this->assertIsArray( $data );
		$this->assertArrayHasKey( 'code', $data );
		$this->assertSame( 'rest_forbidden_context', $data['code'] );
		$this->assertSame( 401, $response->get_status() );
	}

	/**
	 * Asserts administrator user passes the permission check.
	 *
	 * @covers \HostGator\RestApi\SettingsController::check_permission
	 */
	public function test_settings_permission_allows_administrator(): void {
		$controller = new \HostGator\RestApi\SettingsController();
		$admin      = $this->factory()->user->create_and_get( array( 'role' => 'administrator' ) );
		wp_set_current_user( $admin->ID );
		$result = $controller->check_permission();
		$this->assertTrue( $result, 'Administrator should pass permission check' );
	}

	/**
	 * Asserts GET settings returns the expected keys and types.
	 *
	 * @covers \HostGator\RestApi\SettingsController::get_item
	 * @covers \HostGator\RestApi\SettingsController::get_current_settings
	 */
	public function test_settings_get_returns_expected_structure(): void {
		do_action( 'rest_api_init' );
		$admin = $this->factory()->user->create_and_get( array( 'role' => 'administrator' ) );
		wp_set_current_user( $admin->ID );
		$request  = new \WP_REST_Request( 'GET', '/hostgator/v1/settings' );
		$response = rest_do_request( $request );
		$this->assertFalse( $response->is_error(), 'Authenticated GET should succeed' );
		$this->assertSame( 200, $response->get_status() );
		$data = $response->get_data();
		$this->assertIsArray( $data );
		$expected_keys = array(
			'comingSoon',
			'autoUpdatesAll',
			'autoUpdatesMajorCore',
			'autoUpdatesMinorCore',
			'autoUpdatesPlugins',
			'autoUpdatesThemes',
			'autoUpdatesTranslations',
			'disableCommentsOldPosts',
			'closeCommentsDays',
			'commentsPerPage',
			'contentRevisions',
			'emptyTrashDays',
			'hasSetHomepage',
			'showOnFront',
			'pageOnFront',
		);
		foreach ( $expected_keys as $key ) {
			$this->assertArrayHasKey( $key, $data, "Response should contain key: {$key}" );
		}
		$this->assertIsBool( $data['comingSoon'] );
		$this->assertIsBool( $data['autoUpdatesMajorCore'] );
		$this->assertIsInt( $data['closeCommentsDays'] );
		$this->assertIsInt( $data['commentsPerPage'] );
		$this->assertIsInt( $data['contentRevisions'] );
		$this->assertIsInt( $data['emptyTrashDays'] );
		$this->assertIsBool( $data['hasSetHomepage'] );
		$this->assertContains( $data['showOnFront'], array( 'posts', 'page' ), 'showOnFront should be posts or page' );
		$this->assertIsInt( $data['pageOnFront'] );
	}

	/**
	 * Asserts GET settings comingSoon reflects nfd_coming_soon option.
	 *
	 * @covers \HostGator\RestApi\SettingsController::get_item
	 * @covers \HostGator\RestApi\SettingsController::get_current_settings
	 */
	public function test_settings_get_coming_soon_reflects_option(): void {
		do_action( 'rest_api_init' );
		$admin = $this->factory()->user->create_and_get( array( 'role' => 'administrator' ) );
		wp_set_current_user( $admin->ID );
		update_option( 'nfd_coming_soon', true );
		$request  = new \WP_REST_Request( 'GET', '/hostgator/v1/settings' );
		$response = rest_do_request( $request );
		$this->assertFalse( $response->is_error() );
		$data = $response->get_data();
		$this->assertTrue( $data['comingSoon'], 'comingSoon should be true when nfd_coming_soon option is true' );
		update_option( 'nfd_coming_soon', false );
		$request2  = new \WP_REST_Request( 'GET', '/hostgator/v1/settings' );
		$response2 = rest_do_request( $request2 );
		$this->assertFalse( $response2->is_error() );
		$data2 = $response2->get_data();
		$this->assertFalse( $data2['comingSoon'], 'comingSoon should be false when nfd_coming_soon option is false' );
	}

	/**
	 * Asserts POST can update comingSoon and option is persisted.
	 *
	 * @covers \HostGator\RestApi\SettingsController::update_item
	 */
	public function test_settings_update_coming_soon(): void {
		do_action( 'rest_api_init' );
		$admin = $this->factory()->user->create_and_get( array( 'role' => 'administrator' ) );
		wp_set_current_user( $admin->ID );
		update_option( 'nfd_coming_soon', false );
		$request = new \WP_REST_Request( 'POST', '/hostgator/v1/settings' );
		$request->set_body_params( array( 'comingSoon' => true ) );
		$response = rest_do_request( $request );
		$this->assertFalse( $response->is_error(), 'Update comingSoon to true should succeed' );
		$this->assertSame( 200, $response->get_status() );
		$data = $response->get_data();
		$this->assertTrue( $data['comingSoon'] );
		$this->assertTrue( get_option( 'nfd_coming_soon' ), 'nfd_coming_soon option should be true' );
		$request2 = new \WP_REST_Request( 'POST', '/hostgator/v1/settings' );
		$request2->set_body_params( array( 'comingSoon' => false ) );
		$response2 = rest_do_request( $request2 );
		$this->assertFalse( $response2->is_error() );
		$data2 = $response2->get_data();
		$this->assertFalse( $data2['comingSoon'] );
		$this->assertFalse( get_option( 'nfd_coming_soon' ), 'nfd_coming_soon option should be false' );
	}

	/**
	 * Asserts unauthenticated POST request returns 401.
	 *
	 * @covers \HostGator\RestApi\SettingsController::check_permission
	 */
	public function test_settings_edit_requires_authentication(): void {
		do_action( 'rest_api_init' );
		wp_set_current_user( 0 );
		$request = new \WP_REST_Request( 'POST', '/hostgator/v1/settings' );
		$request->set_body_params( array( 'comingSoon' => true ) );
		$response = rest_do_request( $request );
		$this->assertTrue( $response->is_error(), 'Unauthenticated POST should return an error' );
		$data = $response->get_data();
		$this->assertArrayHasKey( 'code', $data );
		$this->assertSame( 'rest_forbidden_context', $data['code'] );
		$this->assertSame( 401, $response->get_status() );
	}
}
