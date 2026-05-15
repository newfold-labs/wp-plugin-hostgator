<?php

namespace HostGator;

/**
 * WPUnit tests for HostGator\HG_Plugin_PHP_Compat_Check.
 *
 * @coversDefaultClass \HostGator\HG_Plugin_PHP_Compat_Check
 */
class PluginPhpCompatCheckWpunitTest extends \lucatume\WPBrowser\TestCase\WPTestCase {

	protected function setUp(): void {
		parent::setUp();
		require_once ABSPATH . 'wp-admin/includes/plugin.php';
		require_once codecept_root_dir( 'inc/plugin-php-compat-check.php' );
	}

	/** @covers \HostGator\HG_Plugin_PHP_Compat_Check::__construct */
	public function test_constructor_sets_file_and_errors(): void {
		$file = codecept_root_dir( 'wp-plugin-hostgator.php' );
		$sut  = new \HostGator\HG_Plugin_PHP_Compat_Check( $file );
		$this->assertSame( $file, $sut->file );
		$this->assertInstanceOf( \WP_Error::class, $sut->errors );
	}

	/** @covers \HostGator\HG_Plugin_PHP_Compat_Check::get_plugin_name */
	public function test_get_plugin_name_returns_plugin_name_from_headers(): void {
		$file = codecept_root_dir( 'wp-plugin-hostgator.php' );
		$sut  = new \HostGator\HG_Plugin_PHP_Compat_Check( $file );
		$name = $sut->get_plugin_name();
		$this->assertNotEmpty( $name );
		$this->assertStringContainsString( 'HostGator', $name );
	}
}
