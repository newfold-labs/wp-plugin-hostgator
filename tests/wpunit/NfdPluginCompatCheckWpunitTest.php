<?php

namespace HostGator;

/**
 * WPUnit tests for HostGator\NFD_Plugin_Compat_Check.
 *
 * @coversDefaultClass \HostGator\NFD_Plugin_Compat_Check
 */
class NfdPluginCompatCheckWpunitTest extends \lucatume\WPBrowser\TestCase\WPTestCase {

	protected function setUp(): void {
		parent::setUp();
		require_once ABSPATH . 'wp-admin/includes/plugin.php';
		require_once codecept_root_dir( 'inc/plugin-nfd-compat-check.php' );
		delete_option( 'nfd_plugins_compat_check_conflicts' );
	}

	protected function tearDown(): void {
		delete_option( 'nfd_plugins_compat_check_conflicts' );
		parent::tearDown();
	}

	/**
	 * @return \HostGator\NFD_Plugin_Compat_Check
	 */
	private function make_checker() {
		$sut                       = new \HostGator\NFD_Plugin_Compat_Check( codecept_root_dir( 'wp-plugin-hostgator.php' ) );
		$sut->incompatible_plugins = array(
			'The Bluehost Plugin' => 'bluehost-wordpress-plugin/bluehost-wordpress-plugin.php',
		);
		$sut->legacy_plugins       = array(
			'The MOJO Plugin' => 'wp-plugin-mojo/wp-plugin-mojo.php',
		);
		return $sut;
	}

	/** @covers \HostGator\NFD_Plugin_Compat_Check::__construct */
	public function test_constructor_sets_slug_and_name(): void {
		$file = codecept_root_dir( 'wp-plugin-hostgator.php' );
		$sut  = new \HostGator\NFD_Plugin_Compat_Check( $file );
		$this->assertNotEmpty( $sut->slug );
		$this->assertNotEmpty( $sut->name );
	}

	/** @covers \HostGator\NFD_Plugin_Compat_Check::get_plugin_name */
	public function test_get_plugin_name_returns_plugin_name_from_headers(): void {
		$file = codecept_root_dir( 'wp-plugin-hostgator.php' );
		$sut  = new \HostGator\NFD_Plugin_Compat_Check( $file );
		$name = $sut->get_plugin_name( $file );
		$this->assertNotEmpty( $name );
		$this->assertStringContainsString( 'HostGator', $name );
	}

	/** @covers \HostGator\NFD_Plugin_Compat_Check::get_plugin_slug */
	public function test_get_plugin_slug_strips_wp_plugins_path(): void {
		$sut  = new \HostGator\NFD_Plugin_Compat_Check( codecept_root_dir( 'wp-plugin-hostgator.php' ) );
		$full = ABSPATH . 'wp-content/plugins/wp-plugin-hostgator/wp-plugin-hostgator.php';
		$slug = $sut->get_plugin_slug( $full );
		$this->assertSame( 'wp-plugin-hostgator/wp-plugin-hostgator.php', $slug );
	}

	/** @covers \HostGator\NFD_Plugin_Compat_Check::check_plugin_requirements */
	public function test_stale_incompatible_conflict_is_cleared_when_bluehost_is_inactive(): void {
		$sut = $this->make_checker();
		update_option(
			'nfd_plugins_compat_check_conflicts',
			array(
				array(
					'slug'   => $sut->slug,
					'source' => $sut->slug,
					'error'  => new \WP_Error( 'nfd_plugin_incompatible', 'stale' ),
				),
			)
		);
		update_option( 'active_plugins', array() );

		$sut->conflicts = get_option( 'nfd_plugins_compat_check_conflicts' );
		$passed         = $sut->check_plugin_requirements();

		$this->assertTrue( $passed );
		$this->assertFalse( get_option( 'nfd_plugins_compat_check_conflicts' ) );
	}

	/** @covers \HostGator\NFD_Plugin_Compat_Check::check_plugin_requirements */
	public function test_self_deactivates_when_bluehost_is_active(): void {
		$sut           = $this->make_checker();
		$sut->slug     = 'wp-plugin-hostgator/wp-plugin-hostgator.php';
		$hostgator     = $sut->slug;
		$bluehost      = 'bluehost-wordpress-plugin/bluehost-wordpress-plugin.php';
		update_option( 'active_plugins', array( $hostgator, $bluehost ) );

		$passed = $sut->check_plugin_requirements();

		$this->assertFalse( $passed );
		$this->assertContains( $bluehost, (array) get_option( 'active_plugins' ) );
		$this->assertNotContains( $hostgator, (array) get_option( 'active_plugins' ) );
	}
}
