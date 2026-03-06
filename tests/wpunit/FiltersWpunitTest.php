<?php

namespace HostGator;

/**
 * WPUnit tests for HostGator\Filters (Hiive headers, etc.).
 *
 * @coversDefaultClass \HostGator\Filters
 */
class FiltersWpunitTest extends \lucatume\WPBrowser\TestCase\WPTestCase {

	/**
	 * Set up test; load Filters class.
	 */
	protected function setUp(): void {
		parent::setUp();
		require_once codecept_root_dir( 'inc/Filters.php' );
	}

	/**
	 * Asserts add_hiive_headers leaves args unchanged when URL is not Hiive.
	 *
	 * @covers \HostGator\Filters::add_hiive_headers
	 */
	public function test_add_hiive_headers_returns_unchanged_when_url_not_hiive(): void {
		$args   = array(
			'method'  => 'GET',
			'headers' => array( 'Accept' => 'application/json' ),
		);
		$result = \HostGator\Filters::add_hiive_headers( $args, 'https://example.com/api' );
		$this->assertSame( $args, $result );
	}

	/**
	 * Asserts add_hiive_headers leaves args unchanged when headers key is missing.
	 *
	 * @covers \HostGator\Filters::add_hiive_headers
	 */
	public function test_add_hiive_headers_returns_unchanged_when_headers_missing(): void {
		$args   = array( 'method' => 'GET' );
		$result = \HostGator\Filters::add_hiive_headers( $args, 'https://other.org/feed' );
		$this->assertSame( $args, $result );
	}
}
