<?php

namespace HostGator;

/**
 * WPUnit tests for HostGator\updates (auto_update_configure, plugin_auto_update_setting_html).
 *
 * @covers \HostGator\auto_update_configure
 * @covers \HostGator\plugin_auto_update_setting_html
 */
class UpdatesWpunitTest extends \lucatume\WPBrowser\TestCase\WPTestCase {

	protected function setUp(): void {
		parent::setUp();
		require_once codecept_root_dir( 'inc/updates.php' );
	}

	/** @covers \HostGator\plugin_auto_update_setting_html */
	public function test_plugin_auto_update_setting_html_returns_original_when_auto_update_plugin_disabled(): void {
		update_option( 'auto_update_plugin', 'false' );
		$html = '<span class="label">Auto-updates enabled</span>';
		$out  = \HostGator\plugin_auto_update_setting_html( $html );
		$this->assertSame( $html, $out );
	}

	/** @covers \HostGator\plugin_auto_update_setting_html */
	public function test_plugin_auto_update_setting_html_replaces_label_when_auto_update_plugin_enabled(): void {
		update_option( 'auto_update_plugin', 'true' );
		$html = '<span class="label">Auto-updates enabled</span>';
		$out  = \HostGator\plugin_auto_update_setting_html( $html );
		$this->assertNotSame( $html, $out );
		$this->assertStringContainsString( 'HostGator', $out );
		$this->assertStringContainsString( 'Settings', $out );
	}

	/** @covers \HostGator\auto_update_make_bool (via option values) */
	public function test_auto_update_make_bool_used_for_option_strings(): void {
		$this->assertTrue( \HostGator\auto_update_make_bool( 'true' ) );
		$this->assertFalse( \HostGator\auto_update_make_bool( 'false' ) );
	}
}
