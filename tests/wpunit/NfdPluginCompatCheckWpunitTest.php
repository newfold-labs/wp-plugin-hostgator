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
}
