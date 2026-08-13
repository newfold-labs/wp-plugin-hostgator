<?php
/**
 * PHPUnit tests for HostGator\jetpack (pure functions, no WP runtime).
 *
 * @package HostGatorWordPressPlugin
 */

use PHPUnit\Framework\TestCase;

/**
 * Class JetpackTest
 */
class JetpackTest extends TestCase {

	/** @var string */
	private static $inc_path;

	public static function setUpBeforeClass(): void {
		parent::setUpBeforeClass();
		self::$inc_path = dirname( dirname( __DIR__ ) ) . '/inc';
		if ( ! function_exists( 'add_filter' ) ) {
			function add_filter( $hook, $callback, $priority = 10, $accepted_args = 1 ) {}
		}
		require_once self::$inc_path . '/jetpack.php';
	}

	/** @covers \HostGator\customize_jetpack_default_modules */
	public function test_customize_jetpack_default_modules_adds_photon_and_sso(): void {
		$modules = array( 'stats' );
		$result  = \HostGator\customize_jetpack_default_modules( $modules );
		$this->assertContains( 'photon', $result );
		$this->assertContains( 'sso', $result );
		$this->assertContains( 'stats', $result );
		$this->assertSame( array_unique( $result ), array_values( $result ) );
	}

	/** @covers \HostGator\customize_jetpack_default_modules */
	public function test_customize_jetpack_default_modules_deduplicates(): void {
		$modules = array( 'photon' );
		$result  = \HostGator\customize_jetpack_default_modules( $modules );
		$this->assertCount( 2, $result );
		$this->assertContains( 'photon', $result );
		$this->assertContains( 'sso', $result );
	}

	/** @covers \HostGator\jetpack_unregister_blocks */
	public function test_jetpack_unregister_blocks_removes_mailchimp_and_revue(): void {
		$blocks = array( 'mailchimp', 'other', 'revue' );
		$result = \HostGator\jetpack_unregister_blocks( $blocks );
		$this->assertNotContains( 'mailchimp', $result );
		$this->assertNotContains( 'revue', $result );
		$this->assertContains( 'other', $result );
	}

	/** @covers \HostGator\jetpack_unregister_blocks */
	public function test_jetpack_unregister_blocks_leaves_others_unchanged(): void {
		$blocks = array( 'contact-form', 'markdown' );
		$result = \HostGator\jetpack_unregister_blocks( $blocks );
		$this->assertSame( array( 'contact-form', 'markdown' ), array_values( $result ) );
	}
}
