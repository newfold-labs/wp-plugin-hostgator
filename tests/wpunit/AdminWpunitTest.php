<?php

namespace HostGator;

/**
 * WPUnit tests for HostGator\Admin (subpages, menu structure).
 *
 * @coversDefaultClass \HostGator\Admin
 */
class AdminWpunitTest extends \lucatume\WPBrowser\TestCase\WPTestCase {

	/**
	 * Set up test; load Admin and Data classes.
	 */
	protected function setUp(): void {
		parent::setUp();
		require_once codecept_root_dir( 'inc/Data.php' );
		require_once codecept_root_dir( 'inc/Admin.php' );
	}

	/**
	 * Asserts plugin_subpages() returns a non-empty array.
	 *
	 * @covers \HostGator\Admin::plugin_subpages
	 */
	public function test_plugin_subpages_returns_array(): void {
		$subpages = \HostGator\Admin::plugin_subpages();
		$this->assertIsArray( $subpages );
		$this->assertNotEmpty( $subpages );
	}

	/**
	 * Asserts each subpage has route, title, and priority keys.
	 *
	 * @covers \HostGator\Admin::plugin_subpages
	 */
	public function test_plugin_subpages_each_item_has_route_title_priority(): void {
		$subpages = \HostGator\Admin::plugin_subpages();
		foreach ( $subpages as $item ) {
			$this->assertArrayHasKey( 'route', $item );
			$this->assertArrayHasKey( 'title', $item );
			$this->assertArrayHasKey( 'priority', $item );
		}
	}

	/**
	 * Asserts subpages include home, settings, and help routes.
	 *
	 * @covers \HostGator\Admin::plugin_subpages
	 */
	public function test_plugin_subpages_includes_home_settings_help(): void {
		$subpages = \HostGator\Admin::plugin_subpages();
		$routes   = wp_list_pluck( $subpages, 'route' );
		$this->assertContains( 'hostgator#/home', $routes );
		$this->assertContains( 'hostgator#/settings', $routes );
		$this->assertContains( 'hostgator#/help', $routes );
	}

	/**
	 * Asserts subpages are sorted by priority ascending.
	 *
	 * @covers \HostGator\Admin::plugin_subpages
	 */
	public function test_plugin_subpages_sorted_by_priority(): void {
		$subpages   = \HostGator\Admin::plugin_subpages();
		$priorities = wp_list_pluck( $subpages, 'priority' );
		$sorted     = $priorities;
		sort( $sorted, SORT_NUMERIC );
		$this->assertSame( $sorted, $priorities, 'Subpages should be sorted by priority ascending' );
	}

	/**
	 * Asserts subpages do not include performance or staging routes.
	 *
	 * @covers \HostGator\Admin::plugin_subpages
	 */
	public function test_plugin_subpages_excludes_performance_and_staging_routes(): void {
		$subpages = \HostGator\Admin::plugin_subpages();
		$routes   = wp_list_pluck( $subpages, 'route' );
		$this->assertNotContains( 'hostgator#/settings/performance', $routes );
		$this->assertNotContains( 'hostgator#/settings/staging', $routes );
	}
}
