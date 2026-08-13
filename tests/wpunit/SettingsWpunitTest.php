<?php

namespace HostGator;

/**
 * WPUnit tests for inc/settings.php (EMPTY_TRASH_DAYS from option).
 */
class SettingsWpunitTest extends \lucatume\WPBrowser\TestCase\WPTestCase {

	protected function setUp(): void {
		parent::setUp();
		if ( ! defined( 'EMPTY_TRASH_DAYS' ) ) {
			require_once codecept_root_dir( 'inc/settings.php' );
		}
	}

	public function test_empty_trash_days_constant_defined(): void {
		$this->assertTrue( defined( 'EMPTY_TRASH_DAYS' ), 'EMPTY_TRASH_DAYS should be defined when plugin/settings are loaded' );
		$this->assertIsInt( EMPTY_TRASH_DAYS );
		$this->assertGreaterThan( 0, EMPTY_TRASH_DAYS );
	}

	public function test_empty_trash_days_matches_option(): void {
		$expected = (int) get_option( 'nfd_empty_trash_days', 30 );
		$this->assertSame( $expected, EMPTY_TRASH_DAYS );
	}
}
