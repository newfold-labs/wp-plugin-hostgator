<?php

namespace HostGator;

/**
 * WPUnit tests for HostGator base helper functions (install date, setup).
 *
 * @covers \HostGator\hg_has_plugin_install_date
 * @covers \HostGator\hg_get_plugin_install_date
 * @covers \HostGator\hg_set_plugin_install_date
 * @covers \HostGator\hg_get_days_since_plugin_install_date
 * @covers \HostGator\hg_install_date_filter
 * @covers \HostGator\hg_setup
 */
class BaseFunctionsWpunitTest extends \lucatume\WPBrowser\TestCase\WPTestCase {

	/**
	 * Set up test; load base helper functions.
	 */
	protected function setUp(): void {
		parent::setUp();
		require_once codecept_root_dir( 'inc/base.php' );
	}

	/**
	 * Tear down; remove install date and legacy options.
	 */
	protected function tearDown(): void {
		delete_option( 'hg_plugin_install_date' );
		delete_option( 'mm_install_date' );
		delete_option( 'mm_cron' );
		delete_option( 'mm_master_aff' );
		parent::tearDown();
	}

	/**
	 * Asserts hg_has_plugin_install_date() returns false when option is not set.
	 */
	public function test_hg_has_plugin_install_date_returns_false_when_empty(): void {
		delete_option( 'hg_plugin_install_date' );
		$this->assertFalse( \HostGator\hg_has_plugin_install_date() );
	}

	/**
	 * Asserts hg_has_plugin_install_date() returns true when option is set.
	 */
	public function test_hg_has_plugin_install_date_returns_true_when_set(): void {
		update_option( 'hg_plugin_install_date', '1234567890', true );
		$this->assertTrue( \HostGator\hg_has_plugin_install_date() );
	}

	/**
	 * Asserts set and get install date roundtrip correctly.
	 */
	public function test_hg_set_and_get_plugin_install_date_roundtrip(): void {
		$value = '9876543210';
		\HostGator\hg_set_plugin_install_date( $value );
		$this->assertSame( $value, \HostGator\hg_get_plugin_install_date() );
	}

	/**
	 * Asserts hg_get_plugin_install_date() returns a numeric string.
	 */
	public function test_hg_get_plugin_install_date_returns_string(): void {
		delete_option( 'hg_plugin_install_date' );
		$result = \HostGator\hg_get_plugin_install_date();
		$this->assertIsString( $result );
		$this->assertMatchesRegularExpression( '/^\d+$/', $result );
	}

	/**
	 * Asserts hg_get_days_since_plugin_install_date() returns an integer near expected days.
	 */
	public function test_hg_get_days_since_plugin_install_date(): void {
		$five_days_ago = (string) ( time() - 5 * DAY_IN_SECONDS );
		\HostGator\hg_set_plugin_install_date( $five_days_ago );
		$days = \HostGator\hg_get_days_since_plugin_install_date();
		$this->assertIsInt( $days );
		$this->assertGreaterThanOrEqual( 4, $days );
		$this->assertLessThanOrEqual( 6, $days );
	}

	/**
	 * Asserts hg_install_date_filter() returns the stored install date.
	 */
	public function test_hg_install_date_filter_returns_install_date(): void {
		$value = '1111111111';
		\HostGator\hg_set_plugin_install_date( $value );
		$this->assertSame( $value, \HostGator\hg_install_date_filter( '' ) );
	}

	/**
	 * Asserts hg_setup() sets install date from mm_install_date when missing.
	 */
	public function test_hg_setup_sets_plugin_install_date_when_missing(): void {
		delete_option( 'hg_plugin_install_date' );
		update_option( 'mm_install_date', 'Jan 15, 2020' );
		\HostGator\hg_setup();
		$this->assertTrue( \HostGator\hg_has_plugin_install_date() );
		$date = \DateTime::createFromFormat( 'M d, Y', 'Jan 15, 2020' );
		$this->assertSame( (string) $date->format( 'U' ), \HostGator\hg_get_plugin_install_date() );
	}
}
