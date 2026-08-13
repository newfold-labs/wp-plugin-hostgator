<?php

namespace HostGator;

/**
 * WPUnit tests for HostGator\partners (affiliate links, option filters).
 *
 * HostGator partners.php does not define plugin_activated() (present on Bluehost); WooCommerce tracking tests are omitted.
 *
 * @covers \HostGator\wpforms_upgrade_affiliate_link
 * @covers \HostGator\aioseo_upgrade_affiliate_link
 * @covers \HostGator\nfd_remove_sas_id
 */
class PartnersWpunitTest extends \lucatume\WPBrowser\TestCase\WPTestCase {

	protected function setUp(): void {
		parent::setUp();
		require_once codecept_root_dir( 'inc/partners.php' );
	}

	/** @covers \HostGator\wpforms_upgrade_affiliate_link */
	public function test_wpforms_upgrade_affiliate_link_returns_shareasale_url_with_encoded_destination(): void {
		$url    = 'https://wpforms.com/lite-upgrade/';
		$result = \HostGator\wpforms_upgrade_affiliate_link( $url );
		$this->assertStringContainsString( 'shareasale.com', $result );
		$this->assertStringContainsString( 'urllink=', $result );
		$this->assertStringContainsString( rawurlencode( $url ), $result );
	}

	/** @covers \HostGator\aioseo_upgrade_affiliate_link */
	public function test_aioseo_upgrade_affiliate_link_returns_shareasale_url_with_encoded_destination(): void {
		$url    = 'https://aioseo.com/pricing/';
		$result = \HostGator\aioseo_upgrade_affiliate_link( $url );
		$this->assertStringContainsString( 'shareasale.com', $result );
		$this->assertStringContainsString( 'urllink=', $result );
		$this->assertStringContainsString( rawurlencode( $url ), $result );
	}

	/** @covers \HostGator\nfd_remove_sas_id */
	public function test_nfd_remove_sas_id_returns_false_for_blocked_sas_id(): void {
		$this->assertFalse( \HostGator\nfd_remove_sas_id( '1258907' ) );
	}

	/** @covers \HostGator\nfd_remove_sas_id */
	public function test_nfd_remove_sas_id_returns_value_unchanged_when_not_blocked(): void {
		$this->assertSame( '9999999', \HostGator\nfd_remove_sas_id( '9999999' ) );
	}
}
