<?php

namespace HostGator;

/**
 * WPUnit tests for HostGator\Brand (regional link map, icons, container payload).
 *
 * @coversDefaultClass \HostGator\Brand
 */
class BrandWpunitTest extends \lucatume\WPBrowser\TestCase\WPTestCase {

	protected function setUp(): void {
		parent::setUp();
		require_once codecept_root_dir( 'inc/Brand.php' );
	}

	protected function tearDown(): void {
		\delete_option( 'hg_region' );
		parent::tearDown();
	}

	public function test_button_background_constant_is_stable(): void {
		$this->assertSame( '#b45300', Brand::BUTTON_BACKGROUND );
	}

	public function test_links_returns_full_region_map(): void {
		$links = Brand::links();
		$this->assertIsArray( $links );
		$this->assertArrayHasKey( 'main', $links );
		$this->assertArrayHasKey( 'site_info_portal', $links );
		$this->assertArrayHasKey( 'default', $links['main'] );
		$this->assertArrayHasKey( 'BR', $links['main'] );
	}

	public function test_region_defaults_to_us_when_option_unset(): void {
		\delete_option( 'hg_region' );
		$this->assertSame( 'US', Brand::region() );
	}

	public function test_region_uppercases_option_value(): void {
		\update_option( 'hg_region', 'br' );
		$this->assertSame( 'BR', Brand::region() );
	}

	public function test_link_returns_default_for_us_region(): void {
		\update_option( 'hg_region', 'US' );
		$this->assertSame( 'https://www.hostgator.com', Brand::link( 'main' ) );
	}

	public function test_link_returns_regional_override(): void {
		\update_option( 'hg_region', 'BR' );
		$this->assertSame( 'https://www.hostgator.com.br', Brand::link( 'main' ) );
	}

	public function test_link_falls_back_to_default_for_unknown_region(): void {
		\update_option( 'hg_region', 'ZZ' );
		$this->assertSame( 'https://www.hostgator.com', Brand::link( 'main' ) );
	}

	public function test_link_accepts_explicit_region_override(): void {
		\update_option( 'hg_region', 'US' );
		$this->assertSame( 'https://www.hostgator.mx', Brand::link( 'main', 'MX' ) );
	}

	public function test_link_falls_back_to_default_when_region_marked_false(): void {
		// help_phone_number is 'false' for every LATAM region.
		\update_option( 'hg_region', 'BR' );
		$this->assertSame( 'tel:8669642867', Brand::link( 'help_phone_number' ) );
	}

	public function test_link_returns_empty_string_for_unknown_key(): void {
		$this->assertSame( '', Brand::link( 'nope' ) );
	}

	public function test_supports_true_when_region_has_real_value(): void {
		\update_option( 'hg_region', 'BR' );
		$this->assertTrue( Brand::supports( 'main' ) );
	}

	public function test_supports_false_when_region_marked_false(): void {
		\update_option( 'hg_region', 'BR' );
		$this->assertFalse( Brand::supports( 'help_phone_number' ) );
	}

	public function test_supports_true_for_default_region(): void {
		\update_option( 'hg_region', 'US' );
		$this->assertTrue( Brand::supports( 'help_phone_number' ) );
	}

	public function test_supports_false_for_unknown_key(): void {
		$this->assertFalse( Brand::supports( 'nope' ) );
	}

	public function test_supports_accepts_explicit_region_override(): void {
		$this->assertFalse( Brand::supports( 'help_phone_number', 'BR' ) );
		$this->assertTrue( Brand::supports( 'help_phone_number', 'US' ) );
	}

	public function test_icons_returns_avatar_and_menu_urls(): void {
		$icons = Brand::icons();
		$this->assertArrayHasKey( 'avatar', $icons );
		$this->assertArrayHasKey( 'menu', $icons );
		$this->assertStringEndsWith( 'assets/svg/snappy.svg', $icons['avatar'] );
		$this->assertStringEndsWith( 'assets/svg/snappy-head.svg', $icons['menu'] );
	}

	public function test_register_binds_editor_chat_payload_on_container(): void {
		\update_option( 'hg_region', 'BR' );

		$container = new class() {
			public $store = array();
			public function set( $key, $value ) {
				$this->store[ $key ] = $value;
			}
		};

		Brand::register( $container );

		$this->assertArrayHasKey( 'editor_chat_brand', $container->store );
		$payload = $container->store['editor_chat_brand'];
		$this->assertSame( 'hostgator', $payload['id'] );
		$this->assertSame( 'HostGator', $payload['name'] );
		$this->assertSame( 'https://financeiro.hostgator.com.br', $payload['accountUrl'] );
		$this->assertSame( 'https://financeiro.hostgator.com.br', $payload['billingUrl'] );
		$this->assertSame( 'https://cliente.hostgator.com.br/emails-list', $payload['emailUrl'] );
		$this->assertArrayHasKey( 'adminUrl', $payload );
		$this->assertArrayHasKey( 'icons', $payload );
		$this->assertArrayHasKey( 'avatar', $payload['icons'] );
	}
}
