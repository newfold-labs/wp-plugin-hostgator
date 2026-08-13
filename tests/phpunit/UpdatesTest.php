<?php
/**
 * PHPUnit tests for HostGator\updates (auto_update_make_bool only; no WP runtime).
 *
 * @package HostGatorWordPressPlugin
 */

use PHPUnit\Framework\TestCase;

/**
 * Class UpdatesTest
 */
class UpdatesTest extends TestCase {

	/** @var string */
	private static $inc_path;

	public static function setUpBeforeClass(): void {
		parent::setUpBeforeClass();
		self::$inc_path = dirname( dirname( __DIR__ ) ) . '/inc';
		if ( ! function_exists( 'add_action' ) ) {
			function add_action( $hook, $callback, $priority = 10, $accepted_args = 1 ) {}
		}
		if ( ! function_exists( 'add_filter' ) ) {
			function add_filter( $hook, $callback, $priority = 10, $accepted_args = 1 ) {}
		}
		require_once self::$inc_path . '/updates.php';
	}

	/** @covers \HostGator\auto_update_make_bool */
	public function test_auto_update_make_bool_string_false(): void {
		$this->assertFalse( \HostGator\auto_update_make_bool( 'false' ) );
	}

	/** @covers \HostGator\auto_update_make_bool */
	public function test_auto_update_make_bool_string_true(): void {
		$this->assertTrue( \HostGator\auto_update_make_bool( 'true' ) );
	}

	/** @covers \HostGator\auto_update_make_bool */
	public function test_auto_update_make_bool_uses_default_for_invalid(): void {
		$this->assertTrue( \HostGator\auto_update_make_bool( 'invalid', true ) );
		$this->assertFalse( \HostGator\auto_update_make_bool( 'invalid', false ) );
	}

	/** @covers \HostGator\auto_update_make_bool */
	public function test_auto_update_make_bool_default_is_true(): void {
		$this->assertTrue( \HostGator\auto_update_make_bool( 'something' ) );
	}

	/** @covers \HostGator\auto_update_make_bool */
	public function test_auto_update_make_bool_passthrough_bool(): void {
		$this->assertTrue( \HostGator\auto_update_make_bool( true, false ) );
		$this->assertFalse( \HostGator\auto_update_make_bool( false, true ) );
	}
}
