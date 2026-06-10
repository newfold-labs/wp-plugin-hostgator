<?php

namespace HostGator;

/**
 * WPUnit tests for HostGator\Data (runtime data, entitlements, site type).
 *
 * @coversDefaultClass \HostGator\Data
 */
class DataWpunitTest extends \lucatume\WPBrowser\TestCase\WPTestCase {

	protected function setUp(): void {
		parent::setUp();
		require_once ABSPATH . 'wp-admin/includes/plugin.php';
		require_once codecept_root_dir( 'inc/Data.php' );
	}

	/** @covers \HostGator\Data::get_entitlement_by_name */
	public function test_get_entitlement_by_name_returns_false_when_no_entitlements(): void {
		$this->assertFalse( \HostGator\Data::get_entitlement_by_name( array( 'solution' => 'foo' ), 'WonderCart' ) );
	}

	/** @covers \HostGator\Data::get_entitlement_by_name */
	public function test_get_entitlement_by_name_returns_false_when_entitlements_not_array(): void {
		$this->assertFalse( \HostGator\Data::get_entitlement_by_name( array( 'entitlements' => 'invalid' ), 'WonderCart' ) );
	}

	/** @covers \HostGator\Data::get_entitlement_by_name */
	public function test_get_entitlement_by_name_returns_entitlement_when_found(): void {
		$entitlement = array( 'name' => 'WonderCart', 'id' => '123' );
		$data        = array( 'entitlements' => array( array( 'name' => 'Other' ), $entitlement ) );
		$this->assertEquals( $entitlement, \HostGator\Data::get_entitlement_by_name( $data, 'WonderCart' ) );
	}

	/** @covers \HostGator\Data::get_entitlement_by_name */
	public function test_get_entitlement_by_name_returns_false_when_name_not_found(): void {
		$data = array( 'entitlements' => array( array( 'name' => 'WonderCart' ) ) );
		$this->assertFalse( \HostGator\Data::get_entitlement_by_name( $data, 'Sales & Promotions' ) );
	}

	/** @covers \HostGator\Data::get_site_type */
	public function test_get_site_type_returns_website_by_default(): void {
		update_option( 'active_plugins', array() );
		delete_option( 'nfd_module_onboarding_site_info' );
		$this->assertSame( 'website', \HostGator\Data::get_site_type() );
	}

	/** @covers \HostGator\Data::get_site_type */
	public function test_get_site_type_maps_personal_to_blog(): void {
		update_option( 'active_plugins', array() );
		update_option( 'nfd_module_onboarding_site_info', array( 'site_type' => 'personal' ) );
		$this->assertSame( 'blog', \HostGator\Data::get_site_type() );
	}

	/** @covers \HostGator\Data::get_site_type */
	public function test_get_site_type_maps_business_to_website(): void {
		update_option( 'active_plugins', array() );
		update_option( 'nfd_module_onboarding_site_info', array( 'site_type' => 'business' ) );
		$this->assertSame( 'website', \HostGator\Data::get_site_type() );
	}

	/** @covers \HostGator\Data::get_site_type */
	public function test_get_site_type_maps_ecommerce_to_store(): void {
		update_option( 'active_plugins', array() );
		update_option( 'nfd_module_onboarding_site_info', array( 'site_type' => 'ecommerce' ) );
		$this->assertSame( 'store', \HostGator\Data::get_site_type() );
	}

	/** @covers \HostGator\Data::get_site_type */
	public function test_get_site_type_returns_store_when_woocommerce_active(): void {
		update_option( 'active_plugins', array( 'woocommerce/woocommerce.php' ) );
		$this->assertSame( 'store', \HostGator\Data::get_site_type() );
	}

	/** @covers \HostGator\Data::get_site_type */
	public function test_get_site_type_returns_website_for_unknown_onboarding_site_type(): void {
		update_option( 'active_plugins', array() );
		update_option( 'nfd_module_onboarding_site_info', array( 'site_type' => 'unknown_type' ) );
		$this->assertSame( 'website', \HostGator\Data::get_site_type() );
	}

	/** @covers \HostGator\Data::is_sales_promotions_plugin_active */
	public function test_is_sales_promotions_plugin_active_returns_false_when_inactive(): void {
		update_option( 'active_plugins', array() );
		$this->assertFalse( \HostGator\Data::is_sales_promotions_plugin_active() );
	}

	/** @covers \HostGator\Data::is_sales_promotions_plugin_active */
	public function test_is_sales_promotions_plugin_active_returns_true_when_active(): void {
		update_option( 'active_plugins', array( 'wp-plugin-sales-promotions/wp-plugin-sales-promotions.php' ) );
		$this->assertTrue( \HostGator\Data::is_sales_promotions_plugin_active() );
	}
}
