<?php

namespace HostGator;

/**
 * Asserts plugin constants and main file when run under WPUnit bootstrap.
 *
 * @coversNothing Plugin environment (constants defined by tests/wpunit/_bootstrap.php)
 */
class PluginWpunitTest extends \lucatume\WPBrowser\TestCase\WPTestCase {

	/**
	 * Plugin root path from codecept_root_dir().
	 *
	 * @var string
	 */
	private $plugin_root;

	/**
	 * Set up test; store plugin root path.
	 */
	protected function setUp(): void {
		parent::setUp();
		$this->plugin_root = codecept_root_dir();
	}

	/**
	 * Asserts all expected plugin constants are defined.
	 */
	public function test_plugin_constants_defined(): void {
		$this->assertTrue( defined( 'HOSTGATOR_PLUGIN_VERSION' ), 'HOSTGATOR_PLUGIN_VERSION should be defined' );
		$this->assertTrue( defined( 'HOSTGATOR_PLUGIN_FILE' ), 'HOSTGATOR_PLUGIN_FILE should be defined' );
		$this->assertTrue( defined( 'HOSTGATOR_PLUGIN_DIR' ), 'HOSTGATOR_PLUGIN_DIR should be defined' );
		$this->assertTrue( defined( 'HOSTGATOR_PLUGIN_URL' ), 'HOSTGATOR_PLUGIN_URL should be defined' );
		$this->assertTrue( defined( 'HOSTGATOR_BUILD_DIR' ), 'HOSTGATOR_BUILD_DIR should be defined' );
		$this->assertTrue( defined( 'HOSTGATOR_BUILD_URL' ), 'HOSTGATOR_BUILD_URL should be defined' );
	}

	/**
	 * Asserts the plugin main PHP file exists.
	 */
	public function test_plugin_main_file_exists(): void {
		$this->assertFileExists( $this->plugin_root . 'wp-plugin-hostgator.php' );
	}

	/**
	 * Asserts HOSTGATOR_PLUGIN_VERSION matches semver-like format.
	 */
	public function test_plugin_version_format(): void {
		$this->assertMatchesRegularExpression(
			'/^\d+\.\d+\.\d+/',
			HOSTGATOR_PLUGIN_VERSION,
			'HOSTGATOR_PLUGIN_VERSION should be semver-like'
		);
	}
}
