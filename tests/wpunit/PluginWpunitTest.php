<?php

namespace HostGator;

/**
 * WPUnit tests for plugin environment and constants.
 *
 * @coversNothing Plugin environment (constants defined by tests/wpunit/_bootstrap.php)
 */
class PluginWpunitTest extends \lucatume\WPBrowser\TestCase\WPTestCase {

	/** @var string */
	private $plugin_root;

	protected function setUp(): void {
		parent::setUp();
		$this->plugin_root = codecept_root_dir();
	}

	public function test_plugin_constants_defined(): void {
		$this->assertTrue( defined( 'HOSTGATOR_PLUGIN_VERSION' ), 'HOSTGATOR_PLUGIN_VERSION should be defined' );
		$this->assertTrue( defined( 'HOSTGATOR_PLUGIN_FILE' ), 'HOSTGATOR_PLUGIN_FILE should be defined' );
		$this->assertTrue( defined( 'HOSTGATOR_PLUGIN_DIR' ), 'HOSTGATOR_PLUGIN_DIR should be defined' );
		$this->assertTrue( defined( 'HOSTGATOR_PLUGIN_URL' ), 'HOSTGATOR_PLUGIN_URL should be defined' );
		$this->assertTrue( defined( 'HOSTGATOR_BUILD_DIR' ), 'HOSTGATOR_BUILD_DIR should be defined' );
		$this->assertTrue( defined( 'HOSTGATOR_BUILD_URL' ), 'HOSTGATOR_BUILD_URL should be defined' );
	}

	public function test_plugin_main_file_exists(): void {
		$this->assertFileExists( $this->plugin_root . 'wp-plugin-hostgator.php' );
	}

	public function test_plugin_version_format(): void {
		$this->assertMatchesRegularExpression(
			'/^\d+\.\d+\.\d+/',
			HOSTGATOR_PLUGIN_VERSION,
			'HOSTGATOR_PLUGIN_VERSION should be semver-like'
		);
	}
}
