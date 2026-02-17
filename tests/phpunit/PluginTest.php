<?php
/**
 * Minimal PHPUnit sanity tests (no WordPress-dependent assertions).
 *
 * Plugin behaviour and integration are tested in WPUnit (tests/wpunit/).
 * This class extends PHPUnit\Framework\TestCase so it can run without WP_PHPUNIT__DIR.
 *
 * @package HostGatorWordPressPlugin
 */

use PHPUnit\Framework\TestCase;

/**
 * Class PluginTest
 */
class PluginTest extends TestCase {

	/**
	 * Plugin main file exists.
	 */
	public function test_plugin_file_exists(): void {
		$this->assertFileExists( dirname( dirname( __DIR__ ) ) . '/wp-plugin-hostgator.php' );
	}

	/**
	 * Plugin version constant is defined in main file (semver-like, e.g. 3.0.0).
	 */
	public function test_plugin_version_constant_defined_in_file(): void {
		$plugin_file = dirname( dirname( __DIR__ ) ) . '/wp-plugin-hostgator.php';
		$content     = file_get_contents( $plugin_file );
		$this->assertNotEmpty( $content );
		$this->assertMatchesRegularExpression(
			'/define\s*\(\s*[\'"]HOSTGATOR_PLUGIN_VERSION[\'"]\s*,\s*[\'"]([\d.]+)[\'"]\s*\)/',
			$content,
			'Plugin should define HOSTGATOR_PLUGIN_VERSION constant.'
		);
	}
}
